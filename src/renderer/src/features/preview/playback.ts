import type { Clip, MediaAsset, Project, Sequence, Track } from '@shared/schemas'
import { clamp, formatTimecode, interpolateKeyframes } from '@shared/utils'
import { sequenceContentDuration } from '@shared/projectFactory'
import { isMock, mediaSrc } from '../../bridge'
import { reportClientError } from '../../observability'

/**
 * Preview engine.
 * - Clock: AudioContext (monotonic) when playing; rAF only for drawing. This
 *   avoids A/V drift from `performance.now` throttling.
 * - Video decode: HTMLVideoElement + WebCodecs-ready abstraction (see ROADMAP
 *   PREV-2; WebCodecs frame sources plug into `drawSource`).
 * - GPU: WebGL2 shader applies transform/opacity/color; CPU fallback keeps the
 *   UI alive if context creation fails.
 * - Mock mode (browser preview) paints a procedural frame so the whole UI is
 *   demonstrable without FFmpeg.
 */

interface PreviewInput {
  project: Project
  sequence: Sequence
  time: number
  playing: boolean
  muted: boolean
  showScopes: boolean
  showSafeArea: boolean
  quality: 'auto' | 'quarter' | 'half' | 'full'
}

type Vec4 = { x: number; y: number; z: number; w: number }

const VS = `#version 300 es
in vec2 aPos;
out vec2 vUv;
uniform vec4 uRect; // x,y = center offset (clip space); z,w = on-screen size (clip space)
uniform float uRotation;
uniform float uAspect; // canvas width / height
void main() {
  vec2 p = aPos * 0.5; // -0.5..0.5
  // Scale to final on-screen size first, then rotate in *screen* space.
  // Rotating before the non-uniform fit/aspect mapping shears the picture
  // (the "stretched when rotating" bug) on any non-square canvas or letterbox.
  vec2 u = p * uRect.zw * 2.0;
  float c = cos(uRotation);
  float s = sin(uRotation);
  vec2 world = vec2(u.x * c - u.y * s / uAspect, u.x * s * uAspect + u.y * c) + uRect.xy;
  vUv = vec2(aPos.x * 0.5 + 0.5, 1.0 - (aPos.y * 0.5 + 0.5));
  gl_Position = vec4(world, 0.0, 1.0);
}`

const FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uSaturation;
uniform float uContrast;
uniform float uTemperature;
uniform float uTint;
uniform float uVignette;
void main() {
  vec4 tex = texture(uTexture, vUv);
  vec3 color = tex.rgb;
  // Warm/cool axis: + red / - blue. Tint is the green-magenta axis.
  color.r += uTemperature * 0.08;
  color.b -= uTemperature * 0.08;
  color.g += uTint * 0.06;
  color.r -= uTint * 0.03;
  color.b -= uTint * 0.03;
  color = (color - 0.5) * uContrast + 0.5;
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, uSaturation);
  float d = distance(vUv, vec2(0.5));
  color *= 1.0 - smoothstep(0.45, 0.95, d) * uVignette;
  outColor = vec4(clamp(color, 0.0, 1.0), tex.a) * uOpacity;
}`

const QUALITY_SCALE = { auto: 1, full: 1, half: 0.6, quarter: 0.4 } as const

function audible(track: Track, hasSolo: boolean): boolean {
  return !track.mute && (!hasSolo || track.solo)
}

function activeClip(sequence: Sequence, time: number): { clip: Clip; track: Track } | null {
  const hasSolo = sequence.tracks.some((t) => t.solo)
  const tracks = sequence.tracks.filter(
    (t) => (t.kind === 'video' || t.kind === 'adjustment') && audible(t, hasSolo)
  )
  for (const track of tracks) {
    let found: Clip | null = null
    for (const clip of track.clips) {
      if (time >= clip.start && time < clip.start + clip.duration) {
        // Overlapping clips on one lane: the most recent edit is on top.
        if (!found || clip.start >= found.start) found = clip
      }
    }
    if (found) return { clip: found, track }
  }
  return null
}

function activeTexts(sequence: Sequence, time: number): Array<{ clip: Clip; track: Track }> {
  const hasSolo = sequence.tracks.some((t) => t.solo)
  const result: Array<{ clip: Clip; track: Track }> = []
  // Reverse draw order: the first track in the array is visually on top.
  for (const track of [...sequence.tracks].reverse()) {
    if (!audible(track, hasSolo)) continue
    for (const clip of track.clips) {
      if (!clip.text?.content.trim()) continue
      if (time >= clip.start && time < clip.start + clip.duration) result.push({ clip, track })
    }
  }
  return result
}

function activeAudios(sequence: Sequence, time: number): Array<{ clip: Clip; track: Track }> {
  const result: Array<{ clip: Clip; track: Track }> = []
  const hasSolo = sequence.tracks.some((t) => t.solo)
  for (const track of sequence.tracks.filter((t) => t.kind === 'audio' && audible(t, hasSolo))) {
    for (const clip of track.clips) {
      if (time >= clip.start && time < clip.start + clip.duration) result.push({ clip, track })
    }
  }
  return result
}

/**
 * A/V drift correction while playing: nudge the element's rate toward the
 * master AudioContext clock instead of hard re-seeking a playing element
 * (audible jump / frame hitch). Small error → factor ≈ 1, closes silently.
 */
function driftRate(deltaSec: number): number {
  const nudge = clamp(deltaSec * 4, -0.12, 0.12)
  return Math.abs(nudge) < 0.002 ? 1 : 1 + nudge
}

export class PreviewEngine {
  private canvas: HTMLCanvasElement
  private overlay: HTMLCanvasElement
  private gl: WebGL2RenderingContext | null = null
  private program: WebGLProgram | null = null
  private texture: WebGLTexture | null = null
  private videoCache = new Map<string, HTMLVideoElement>()
  private imageCache = new Map<string, HTMLImageElement>()
  private currentSource: HTMLVideoElement | null = null
  private currentImage: HTMLImageElement | null = null
  private audioElements = new Map<string, HTMLMediaElement>()
  private raf = 0
  private input: PreviewInput | null = null
  private baseTime = 0
  private baseClock = 0
  private audioContext: AudioContext | null = null
  private playing = false
  private lastScopesAt = 0
  private lastTimeEmit = 0
  private lastDrawAt = 0
  private hasFrame = false
  private lastAspect = 16 / 9
  private uploadedSource: TexImageSource | null = null
  private uploadedAt = -1
  private frameCount = 0
  private fpsWindowStart = 0
  private mockSeed = Math.random() * 100
  private disposed = false
  private failing = false

  onTime: (time: number) => void = () => {}
  onStats: (fps: number, dropped: number) => void = () => {}
  /** Playback reached the last frame: the store must leave the playing state. */
  onEnded: () => void = () => {}

  constructor(canvas: HTMLCanvasElement, overlay: HTMLCanvasElement) {
    this.canvas = canvas
    this.overlay = overlay
    // Driver resets / eGPU removal raise context-lost instead of killing the app.
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault()
      this.gl = null
      this.program = null
      this.texture = null
      this.hasFrame = false
      this.uploadedSource = null
      this.uploadedAt = -1
    })
    canvas.addEventListener('webglcontextrestored', () => this.initGL())
    if (!isMock()) this.initGL()
    this.loop = this.loop.bind(this)
    window.addEventListener('resize', this.onWindowResize)
    this.raf = requestAnimationFrame(this.loop)
  }

  private onWindowResize = (): void => {
    if (this.input) this.draw(this.input.time)
  }

  private initGL(): void {
    try {
      const gl = this.canvas.getContext('webgl2', { alpha: false, antialias: true, powerPreference: 'high-performance' })
      if (!gl) return
      const compile = (type: number, source: string): WebGLShader | null => {
        const shader = gl.createShader(type)
        if (!shader) return null
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null
        return shader
      }
      const vs = compile(gl.VERTEX_SHADER, VS)
      const fs = compile(gl.FRAGMENT_SHADER, FS)
      if (!vs || !fs) return
      const program = gl.createProgram()
      if (!program) return
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
      gl.useProgram(program)

      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(program, 'aPos')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

      this.gl = gl
      this.program = program
      this.texture = texture
      this.uploadedSource = null
      this.uploadedAt = -1
    } catch {
      this.gl = null
    }
  }

  update(input: PreviewInput): void {
    const wasPlaying = this.playing
    const previous = this.input
    const jumped = previous ? Math.abs(input.time - previous.time) > 0.35 : false
    this.input = input
    this.playing = input.playing
    if (!input.playing) {
      this.baseTime = input.time
      this.baseClock = this.clock()
    } else if (!wasPlaying || jumped) {
      this.baseTime = input.time
      this.baseClock = this.clock()
    }
    if (!input.playing || jumped) this.syncMedia(input.time)
    if (!input.playing || jumped || previous?.sequence.id !== input.sequence.id) this.draw(input.time)
  }

  private clock(): number {
    if (!this.audioContext) {
      try {
        this.audioContext = new AudioContext({ latencyHint: 'interactive' })
      } catch {
        this.audioContext = null
      }
    }
    if (this.audioContext) {
      if (this.audioContext.state === 'suspended') void this.audioContext.resume()
      return this.audioContext.currentTime
    }
    return performance.now() / 1000
  }

  /** Exact content end: playback stops there, not at the padded ruler length. */
  private endTime(): number {
    return this.input ? sequenceContentDuration(this.input.sequence) : 0
  }

  private currentTime(): number {
    if (!this.input) return 0
    if (!this.playing) return this.input.time
    return clamp(this.baseTime + (this.clock() - this.baseClock), 0, this.endTime())
  }

  private ensureVideo(asset: MediaAsset): HTMLVideoElement | null {
    if (isMock()) return null
    let video = this.videoCache.get(asset.id)
    if (!video) {
      video = document.createElement('video')
      video.src = mediaSrc(asset.path)
      video.preload = 'auto'
      video.crossOrigin = 'anonymous'
      video.playsInline = true
      video.muted = false
      video.load()
      // A paused seek drops readyState below 2 until the new frame decodes;
      // redraw when it arrives, otherwise the monitor stays black after Stop.
      video.addEventListener('seeked', () => this.mediaReady(video!))
      video.addEventListener('loadeddata', () => this.mediaReady(video!))
      this.videoCache.set(asset.id, video)
    }
    return video
  }

  private ensureImage(asset: MediaAsset): HTMLImageElement | null {
    if (isMock()) return null
    let image = this.imageCache.get(asset.id)
    if (!image) {
      image = new Image()
      image.crossOrigin = 'anonymous'
      image.addEventListener('load', () => this.imageReady(image!))
      image.src = mediaSrc(asset.path)
      this.imageCache.set(asset.id, image)
    }
    return image
  }

  private imageReady(image: HTMLImageElement): void {
    if (this.disposed || !this.input) return
    if (this.currentImage !== image) return
    this.uploadedSource = null
    this.uploadedAt = -1
    try {
      this.draw(this.input.time)
    } catch (err) {
      reportClientError('preview.imageReady', err)
    }
  }

  private ensureAudio(asset: MediaAsset): HTMLMediaElement | null {
    if (isMock()) return null
    let element: HTMLMediaElement | null = this.audioElements.get(asset.id) ?? null
    if (!element) {
      // Always a dedicated <audio> element, even for video media: the picture
      // element stays muted while the audio twin on the A track owns the sound,
      // so track mute/volume applies and nothing plays twice.
      const audio = document.createElement('audio')
      audio.src = mediaSrc(asset.path)
      audio.preload = 'auto'
      element = audio
      this.audioElements.set(asset.id, element)
    }
    return element
  }

  /** True when an audio-track clip for this media covers `time` (muted tracks count). */
  private audioTwinActive(sequence: Sequence, time: number, mediaId: string): boolean {
    for (const track of sequence.tracks) {
      if (track.kind !== 'audio') continue
      for (const clip of track.clips) {
        if (clip.mediaId === mediaId && time >= clip.start && time < clip.start + clip.duration) return true
      }
    }
    return false
  }

  /** Redraw the paused monitor once a seek/load delivers a fresh frame. */
  private mediaReady(video: HTMLVideoElement): void {
    if (this.disposed || this.playing || !this.input) return
    if (this.currentSource !== video) return
    this.uploadedAt = -1 // a new frame arrived: force one texture upload
    try {
      this.draw(this.input.time)
    } catch (err) {
      reportClientError('preview.mediaReady', err)
    }
  }

  private syncMedia(time: number): void {
    const input = this.input
    if (!input) return
    const active = activeClip(input.sequence, time)
    const asset = active?.clip.mediaId ? input.project.media.find((m) => m.id === active.clip.mediaId) ?? null : null
    if (active && asset?.kind === 'image') {
      const image = this.ensureImage(asset)
      this.currentImage = image
      this.currentSource = null
    } else if (active && asset && asset.kind !== 'image') {
      this.currentImage = null
      const video = this.ensureVideo(asset)
      if (video) {
        this.currentSource = video
        const target = active.clip.inPoint + (time - active.clip.start) * active.clip.speed
        // Setting currentTime always restarts a seek (readyState dips < 2). Only
        // seek when we are actually off-target, and never fight a running one:
        // unconditioned seeks were the "blacks out after Stop" bug.
        const epsilon = this.playing ? 0.2 : 1 / Math.max(1, input.sequence.fps) / 2
        if (video.readyState < 1 || (!video.seeking && Math.abs(video.currentTime - target) > epsilon)) {
          try {
            video.currentTime = Math.max(0, target)
          } catch {
            /* metadata not ready */
          }
        }
        video.muted = input.muted || this.audioTwinActive(input.sequence, time, asset.id)
        video.volume = clamp(active.clip.volume * active.track.volume, 0, 1)
        // Rate management (was missing entirely): the master clock advances at
        // `speed` while the element played at 1×, so any clip.speed ≠ 1
        // desynced linearly and re-seeked every ~0.2 s; drift correction never
        // ran either. Muted (twin owns sound) → glide on rate, inaudible;
        // unmuted → rate = speed exactly (correct own-audio pitch/speed).
        const baseRate = clamp(active.clip.speed, 0.25, 4)
        if (this.playing && !video.seeking && video.readyState >= 2) {
          const delta = video.currentTime - target
          video.playbackRate = video.muted && Math.abs(delta) <= 0.5 ? clamp(baseRate * driftRate(delta), 0.25, 4) : baseRate
        } else {
          video.playbackRate = baseRate
        }
        if (this.playing && video.paused) void video.play().catch(() => undefined)
        if (!this.playing && !video.paused) video.pause()
      }
    } else {
      this.currentSource = null
      this.currentImage = null
    }

    const audios = activeAudios(input.sequence, time)
    for (const entry of audios) {
      const audioAsset = entry.clip.mediaId ? input.project.media.find((m) => m.id === entry.clip.mediaId) : null
      if (audioAsset) this.ensureAudio(audioAsset)
    }
    for (const [mediaId, element] of this.audioElements) {
      const clipInfo = audios.find((entry) => entry.clip.mediaId === mediaId)
      if (!clipInfo || !this.playing) {
        element.pause()
        continue
      }
      const target = clipInfo.clip.inPoint + (time - clipInfo.clip.start) * clipInfo.clip.speed
      // Rate + drift (was missing entirely): with clip.speed ≠ 1 the element
      // played at 1× while the target advanced at `speed` — audible desync and
      // re-seek stutter every few frames. The element now tracks the master
      // clock at `speed`, gliding on rate for small errors and hard-seeking
      // only past 0.5 s (join/play start included).
      const baseRate = clamp(clipInfo.clip.speed, 0.25, 4)
      const delta = element.currentTime - target
      if (Math.abs(delta) > 0.5) {
        try {
          element.currentTime = Math.max(0, target)
        } catch {
          /* ignore */
        }
        element.playbackRate = baseRate
      } else {
        element.playbackRate = clamp(baseRate * driftRate(delta), 0.25, 4)
      }
      element.volume = clamp(clipInfo.clip.volume * clipInfo.track.volume, 0, 1)
      element.muted = input.muted
      if (element.paused) void element.play().catch(() => undefined)
    }
  }

  private loop(): void {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.loop)
    if (!this.input) return
    try {
      const now = performance.now()
      if (this.playing) {
        const time = this.currentTime()
        this.syncMedia(time)
        this.draw(time)
        if (now - this.lastTimeEmit > 33) {
          this.lastTimeEmit = now
          this.onTime(time)
        }
        // End of content: stop once and tell the UI. The old code reset the
        // playhead to 0 while the store still said "playing", so the engine
        // revived itself and looped the sequence forever.
        const end = this.endTime()
        if (end > 0 && time >= end - 0.001) {
          this.playing = false
          this.onTime(end)
          this.onEnded()
        }
        this.frameCount++
        if (!this.fpsWindowStart) this.fpsWindowStart = now
        if (now - this.fpsWindowStart > 1000) {
          const fps = (this.frameCount * 1000) / (now - this.fpsWindowStart)
          this.onStats(Math.round(fps * 10) / 10, 0)
          this.frameCount = 0
          this.fpsWindowStart = now
        }
      }
      this.failing = false
    } catch (err) {
      // Keep the frame loop alive: an undecodable clip must not freeze the editor.
      if (!this.failing) reportClientError('preview.loop', err)
      this.failing = true
    }
  }

  private resizeCanvas(): void {
    const parent = this.canvas.parentElement
    if (!parent) return
    const rect = parent.getBoundingClientRect()
    const quality = QUALITY_SCALE[this.input?.quality ?? 'full']
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(2, Math.round(rect.width * dpr * quality))
    const height = Math.max(2, Math.round(rect.height * dpr * quality))
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width
      this.canvas.height = height
    }
    const overlayWidth = Math.max(2, Math.round(rect.width * dpr))
    const overlayHeight = Math.max(2, Math.round(rect.height * dpr))
    if (this.overlay.width !== overlayWidth || this.overlay.height !== overlayHeight) {
      this.overlay.width = overlayWidth
      this.overlay.height = overlayHeight
    }
  }

  private draw(time: number): void {
    const input = this.input
    if (!input) return
    this.resizeCanvas()
    this.drawPicture(input, time)
    this.drawOverlay(input, time)
  }

  private drawPicture(input: PreviewInput, time: number): void {
    if (isMock()) {
      const ctx = this.canvas.getContext('2d')
      if (!ctx) return
      const { width, height } = this.canvas
      const active = activeClip(input.sequence, time)
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      const hue = active ? 250 : 230
      const offset = (time * 12 + this.mockSeed) % 360
      gradient.addColorStop(0, `hsl(${hue + offset * 0.1}, 55%, 12%)`)
      gradient.addColorStop(0.55, `hsl(${hue + 30 + offset * 0.06}, 62%, 26%)`)
      gradient.addColorStop(1, `hsl(${hue - 40}, 48%, 8%)`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = 0.5
      for (let i = 0; i < 4; i++) {
        const x = ((Math.sin(time * 0.25 + i * 1.7) * 0.5 + 0.5) * width)
        const y = ((Math.cos(time * 0.18 + i * 1.1) * 0.5 + 0.5) * height)
        const r = (0.12 + i * 0.04) * width
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r)
        glow.addColorStop(0, i % 2 === 0 ? 'rgba(124,92,255,.5)' : 'rgba(56,189,248,.38)')
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, width, height)
      }
      ctx.globalAlpha = 1
      return
    }

    const gl = this.gl
    if (!gl || !this.program) {
      const ctx = this.canvas.getContext('2d')
      ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
      return
    }
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    gl.clearColor(0.03, 0.035, 0.05, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const active = activeClip(input.sequence, time)
    const clip = active?.clip
    const videoSource = this.currentSource
    const imageSource = this.currentImage
    const source = videoSource ?? imageSource
    const ready =
      videoSource !== null
        ? videoSource.readyState >= 2 && videoSource.videoWidth > 0
        : imageSource !== null && imageSource.complete && imageSource.naturalWidth > 0

    if (ready && source) {
      gl.useProgram(this.program)
      gl.bindTexture(gl.TEXTURE_2D, this.texture)
      // While paused the decoded frame is immutable: re-uploading the video on
      // every store update (e.g. each pointermove of a clip drag) is what made
      // dragging lag. Upload only when the source frame actually changed.
      const sourceTime = source instanceof HTMLVideoElement ? source.currentTime : 0
      if (this.uploadedSource !== source || this.uploadedAt !== sourceTime) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
        this.uploadedSource = source
        this.uploadedAt = sourceTime
      }
      this.hasFrame = true
      this.lastAspect =
        source instanceof HTMLVideoElement ? source.videoWidth / source.videoHeight : source.naturalWidth / source.naturalHeight
    } else if (!this.hasFrame) {
      // No decoded frame ever: stay on the cleared stage (overlay shows NO SIGNAL).
      return
    }
    // Draw the newest texture even while a seek settles: showing the previous
    // frame beats a black monitor when the user stops and edits.
    gl.useProgram(this.program)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)

    const canvasAspect = this.canvas.width / this.canvas.height
    const videoAspect = this.lastAspect || 16 / 9
    let fitW = 1
    let fitH = 1
    if (videoAspect > canvasAspect) fitH = canvasAspect / videoAspect
    else fitW = videoAspect / canvasAspect

    const scale = clip ? interpolateKeyframes((clip.keyframes?.scale ?? []).map((k) => ({ ...k })), time - clip.start, clip.transform.scale) : 1
    const opacity = clip ? interpolateKeyframes(clip.keyframes?.opacity ?? [], time - clip.start, clip.transform.opacity) : 1
    const rotation = ((clip?.transform.rotation ?? 0) * Math.PI) / 180
    const offsetX = (clip?.transform.x ?? 0) / (input.sequence.width / 2)
    const offsetY = (clip?.transform.y ?? 0) / (input.sequence.height / 2)

    const grade = readGrade(clip)
    gl.uniform4f(gl.getUniformLocation(this.program, 'uRect'), offsetX, -offsetY, fitW * scale, fitH * scale)
    gl.uniform1f(gl.getUniformLocation(this.program, 'uRotation'), rotation)
    gl.uniform1f(gl.getUniformLocation(this.program, 'uAspect'), this.canvas.width / Math.max(1, this.canvas.height))
    gl.uniform1f(gl.getUniformLocation(this.program, 'uOpacity'), clamp(opacity, 0, 1))
    gl.uniform1f(gl.getUniformLocation(this.program, 'uSaturation'), grade.saturation)
    gl.uniform1f(gl.getUniformLocation(this.program, 'uContrast'), grade.contrast)
    gl.uniform1f(gl.getUniformLocation(this.program, 'uTemperature'), grade.temperature)
    gl.uniform1f(gl.getUniformLocation(this.program, 'uTint'), grade.tint)
    gl.uniform1f(gl.getUniformLocation(this.program, 'uVignette'), grade.vignette)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  private drawOverlay(input: PreviewInput, time: number): void {
    const canvas = this.overlay
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
    const active = activeClip(input.sequence, time)
    const asset = active?.clip.mediaId ? input.project.media.find((m) => m.id === active.clip.mediaId) : null
    const texts = activeTexts(input.sequence, time)

    if (!active && texts.length === 0) {
      if (!isMock()) {
        ctx.fillStyle = 'rgba(8,9,12,.72)'
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = 'rgba(255,255,255,.4)'
        ctx.textAlign = 'center'
        ctx.font = `${Math.round(width * 0.022)}px Inter, system-ui, sans-serif`
        ctx.fillText('NO SIGNAL — nessuna clip sotto il playhead', width / 2, height / 2)
        ctx.textAlign = 'left'
      }
    } else if (isMock() && active) {
      ctx.fillStyle = 'rgba(255,255,255,.85)'
      const fontSize = Math.max(12, width * 0.028)
      ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`
      ctx.fillText(active.clip.name, width * 0.04, height * 0.88)
      ctx.font = `${fontSize * 0.55}px "JetBrains Mono", monospace`
      ctx.fillStyle = 'rgba(255,255,255,.55)'
      ctx.fillText(`${asset?.width ?? 1920}×${asset?.height ?? 1080} · ${formatTimecode(time, input.sequence.fps)}`, width * 0.04, height * 0.94)
      if (asset?.isHDR) {
        ctx.fillStyle = '#ffb547'
        ctx.fillText('HDR10 · Rec.2020 PQ', width * 0.04, height * 0.82)
      }
    }

    for (const entry of texts) drawTitle(ctx, entry.clip, input.sequence, width, height)

    if (input.showSafeArea) {
      ctx.strokeStyle = 'rgba(255,255,255,.35)'
      ctx.lineWidth = 1
      ctx.setLineDash([6, 6])
      ctx.strokeRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9)
      ctx.strokeStyle = 'rgba(255,255,255,.25)'
      ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8)
      ctx.beginPath()
      ctx.moveTo(width / 2, height * 0.1)
      ctx.lineTo(width / 2, height * 0.9)
      ctx.moveTo(width * 0.1, height / 2)
      ctx.lineTo(width * 0.9, height / 2)
      ctx.stroke()
      ctx.setLineDash([])
    }

    if (input.showScopes && this.gl && !isMock() && performance.now() - this.lastScopesAt > 200) {
      this.lastScopesAt = performance.now()
      this.histogram = this.readHistogram()
    }
    if (input.showScopes) {
      this.drawScopes(ctx, width, height)
    }

    if (this.input?.playing) {
      ctx.fillStyle = 'rgba(124,92,255,.9)'
      ctx.beginPath()
      ctx.arc(width - 22, 22, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  private histogram: number[][] = [[], [], []]

  private readHistogram(): number[][] {
    const gl = this.gl
    if (!gl) return [[], [], []]
    const w = 64
    const h = 36
    const pixels = new Uint8Array(w * h * 4)
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    const bins = [new Array(32).fill(0), new Array(32).fill(0), new Array(32).fill(0)]
    for (let i = 0; i < pixels.length; i += 4) {
      bins[0]![Math.min(31, (pixels[i] ?? 0) >> 3)]! += 1
      bins[1]![Math.min(31, (pixels[i + 1] ?? 0) >> 3)]! += 1
      bins[2]![Math.min(31, (pixels[i + 2] ?? 0) >> 3)]! += 1
    }
    return bins
  }

  private drawScopes(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const boxW = Math.min(220, width * 0.28)
    const boxH = boxW * 0.42
    const x = 14
    const y = height - boxH - 14
    ctx.fillStyle = 'rgba(10,11,16,.78)'
    ctx.strokeStyle = 'rgba(255,255,255,.12)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(x, y, boxW, boxH, 0)
    ctx.fill()
    ctx.stroke()
    const colors = ['#ff5c5c', '#4cd964', '#4c8dff']
    this.histogram.forEach((bins, ci) => {
      if (!bins.length) return
      const max = Math.max(1, ...bins)
      ctx.strokeStyle = colors[ci]!
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      bins.forEach((v, i) => {
        const px = x + 6 + (i / (bins.length - 1)) * (boxW - 12)
        const py = y + boxH - 6 - (v / max) * (boxH - 12)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.stroke()
    })
    ctx.globalAlpha = 1
    ctx.fillStyle = 'rgba(255,255,255,.45)'
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.fillText('RGB PARADE', x + 8, y + 14)
  }

  dispose(): void {
    this.disposed = true
    window.removeEventListener('resize', this.onWindowResize)
    cancelAnimationFrame(this.raf)
    for (const element of this.videoCache.values()) {
      element.pause()
      element.removeAttribute('src')
      element.load()
    }
    for (const element of this.audioElements.values()) element.pause()
    for (const image of this.imageCache.values()) image.removeAttribute('src')
    this.videoCache.clear()
    this.imageCache.clear()
    this.audioElements.clear()
    this.currentImage = null
    void this.audioContext?.close()
  }
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  clip: Clip,
  sequence: Sequence,
  width: number,
  height: number
): void {
  const text = clip.text
  if (!text) return
  const scale = width / Math.max(1, sequence.width)
  const fontSize = Math.max(8, text.fontSize * scale)
  const lineHeight = fontSize * 1.22
  const lines = text.content.split(/\r?\n/)
  ctx.save()
  ctx.font = `600 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`
  ctx.textAlign = text.align
  ctx.textBaseline = 'middle'
  const anchorX = clamp(text.x, 0, 1) * width
  const anchorY = clamp(text.y, 0, 1) * height
  const total = lines.length * lineHeight
  const startY = anchorY - total / 2 + lineHeight / 2
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight
    if (text.background) {
      const metrics = ctx.measureText(line)
      const padX = fontSize * 0.35
      const padY = fontSize * 0.18
      const boxWidth = metrics.width + padX * 2
      const left = text.align === 'left' ? anchorX - padX : text.align === 'right' ? anchorX - metrics.width - padX : anchorX - boxWidth / 2
      ctx.fillStyle = 'rgba(0,0,0,.38)'
      ctx.fillRect(left, y - lineHeight / 2 + padY * 0.2, boxWidth, lineHeight - padY * 0.4)
    }
    ctx.fillStyle = /^#[0-9a-f]{6}$/i.test(text.color) ? text.color : '#ffffff'
    ctx.fillText(line, anchorX, y)
  })
  ctx.restore()
}

function readGrade(clip: Clip | null | undefined): {
  saturation: number
  contrast: number
  temperature: number
  tint: number
  vignette: number
} {
  let saturation = 1
  let contrast = 1
  let temperature = 0
  let tint = 0
  // No vignette unless an effect asks for it: a permanent 0.18 darkened the
  // corners of every clip and looked like a colour cast.
  let vignette = 0
  for (const effect of clip?.effects ?? []) {
    if (!effect.enabled) continue
    const value = (key: string, fallback: number): number => Number(effect.params[key] ?? fallback)
    switch (effect.type) {
      case 'Cinematic LUT': {
        const intensity = clamp(value('intensity', 0.8), 0, 1)
        contrast *= value('contrast', 1.08)
        saturation *= 0.95 + intensity * 0.15
        vignette = 0.25 * intensity
        break
      }
      case 'Color Wheels':
        // The Inspector writes temperature/tint/contrast/saturation here; the
        // shader only read `saturation` and `lift`, so most sliders were dead.
        saturation *= value('saturation', 1)
        contrast *= value('contrast', 1)
        temperature += value('temperature', 0) + value('lift', 0) * 0.25 + value('gain', 0) * 0.1
        tint += value('tint', 0)
        break
      case 'Sharpen':
        contrast *= 1 + value('amount', 0.4) * 0.05
        break
      case 'Film Grain': {
        const amount = value('amount', 0.2)
        saturation *= 1 - amount * 0.1
        break
      }
      case 'Glow':
        contrast *= 0.98
        break
    }
  }
  return { saturation, contrast, temperature, tint, vignette }
}

export function clipAt(sequence: Sequence, time: number): { clip: Clip; track: Track } | null {
  return activeClip(sequence, time)
}

export function audioClipsAt(sequence: Sequence, time: number): Array<{ clip: Clip; track: Track }> {
  return activeAudios(sequence, time)
}

export { QUALITY_SCALE }
export type { Vec4 }
