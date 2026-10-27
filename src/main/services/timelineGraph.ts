import { existsSync } from 'node:fs'
import type { Clip, EncodePreset, Project, Sequence, Track } from '@shared/schemas'
import { sequenceContentDuration } from '@shared/projectFactory'
import { clamp, roundTo } from '@shared/utils'
import type { EncoderChoice } from './encoder'

/**
 * Timeline → FFmpeg filter graph.
 *
 * Export used to encode a single source file, which made the timeline edits
 * meaningless. This builder composes every visible video clip over a black
 * sequence canvas, mixes every audible audio clip, and burns title clips with
 * drawtext. It is pure (no spawning) so argument construction is unit-testable.
 */

export interface TimelineGraph {
  /** Asset paths in input order; images must be opened with `-loop 1`. */
  inputs: Array<{ path: string; loop: boolean }>
  filterGraph: string
  durationSec: number
  hasAudio: boolean
  videoLabel: string
  audioLabel: string | null
  notes: string[]
}

interface InputSpec {
  index: number
  path: string
  loop: boolean
  videoCount: number
  audioCount: number
  videoLabels: string[]
  audioLabels: string[]
  videoCursor: number
  audioCursor: number
}

function escapeFilterPath(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'")
}

/** drawtext parses `:`, `%` and filter separators even inside quoted text. */
function escapeDrawText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/:/g, '\\:')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/%/g, '\\%')
    .replace(/\r?\n/g, '\\n')
}

function findFontFile(): string | null {
  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Windows\\Fonts\\segoeui.ttf',
          'C:\\Windows\\Fonts\\segoeuib.ttf',
          'C:\\Windows\\Fonts\\arial.ttf',
          'C:\\Windows\\Fonts\\calibri.ttf'
        ]
      : process.platform === 'darwin'
        ? ['/System/Library/Fonts/Helvetica.ttc', '/System/Library/Fonts/SFNS.ttf', '/Library/Fonts/Arial.ttf']
        : [
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/TTF/DejaVuSans.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
          ]
  return candidates.find((candidate) => existsSync(candidate)) ?? null
}

function colorValue(value: string | undefined): string {
  return /^#[0-9a-f]{6}$/i.test(value ?? '') ? `0x${value!.slice(1)}` : '0xffffff'
}

function numberParam(effectParams: Record<string, number | string | boolean>, key: string, fallback: number): number {
  const raw = effectParams[key]
  const value = typeof raw === 'number' ? raw : Number(raw)
  return Number.isFinite(value) ? value : fallback
}

/** FFmpeg filters for the effects that can be reproduced deterministically. */
export function effectFilters(clip: Clip, notes: string[]): string[] {
  const filters: string[] = []
  for (const effect of clip.effects) {
    if (!effect.enabled) continue
    switch (effect.type) {
      case 'Gaussian Blur': {
        const radius = Math.max(0, numberParam(effect.params, 'radius', 8))
        if (radius > 0) filters.push(`gblur=sigma=${roundTo(radius / 2, 2)}`)
        break
      }
      case 'Box Blur': {
        const radius = Math.max(0, Math.round(numberParam(effect.params, 'radius', 6)))
        if (radius > 0) filters.push(`boxblur=${radius}:1`)
        break
      }
      case 'Directional Blur': {
        const length = Math.max(0, numberParam(effect.params, 'length', 12))
        if (length > 0) filters.push(`gblur=sigma=${roundTo(length / 4, 2)}`)
        break
      }
      case 'Sharpen': {
        const amount = clamp(numberParam(effect.params, 'amount', 0.5), 0, 2)
        filters.push(`unsharp=5:5:${roundTo(amount, 3)}`)
        break
      }
      case 'Film Grain':
      case 'Noise': {
        const amount = clamp(numberParam(effect.params, 'amount', 0.25), 0, 1)
        filters.push(`noise=alls=${Math.round(amount * 40)}:allf=t`)
        break
      }
      case 'Chroma Key': {
        const tolerance = clamp(numberParam(effect.params, 'tolerance', 0.25), 0, 1)
        const spill = clamp(numberParam(effect.params, 'spill', 0.1), 0, 1)
        filters.push(`format=rgba`, `colorkey=0x00ff00:${roundTo(tolerance, 3)}:${roundTo(spill, 3)}`)
        break
      }
      case 'Crop': {
        const left = clamp(numberParam(effect.params, 'left', 0) / 100, 0, 0.95)
        const right = clamp(numberParam(effect.params, 'right', 0) / 100, 0, 0.95)
        const top = clamp(numberParam(effect.params, 'top', 0) / 100, 0, 0.95)
        const bottom = clamp(numberParam(effect.params, 'bottom', 0) / 100, 0, 0.95)
        if (left + right < 0.95 && top + bottom < 0.95) {
          filters.push(
            `crop=iw*${roundTo(1 - left - right, 4)}:ih*${roundTo(1 - top - bottom, 4)}:iw*${roundTo(left, 4)}:ih*${roundTo(top, 4)}`
          )
        }
        break
      }
      case 'Color Wheels':
      case 'Cinematic LUT': {
        const contrast = clamp(numberParam(effect.params, 'contrast', 1.05), 0.2, 3)
        const saturation = clamp(numberParam(effect.params, 'saturation', 1), 0, 3)
        const brightness = clamp(numberParam(effect.params, 'lift', 0) * 0.15, -1, 1)
        filters.push(`eq=contrast=${roundTo(contrast, 3)}:saturation=${roundTo(saturation, 3)}:brightness=${roundTo(brightness, 3)}`)
        break
      }
      case 'Glow':
        filters.push(`gblur=sigma=${roundTo(Math.max(1, numberParam(effect.params, 'radius', 16) / 4), 2)}`)
        break
      case 'Timecode Burn-in':
      case 'Text Generator':
      case 'Opacity':
      case 'Luma Key':
      case 'Transform':
        // Handled by the clip transform / title pass, or not representable 1:1.
        break
      default:
        notes.push(`Effetto "${effect.type}" non riproducibile in export: ignorato.`)
    }
  }
  return filters
}

function audible(track: Track, hasSolo: boolean): boolean {
  return !track.mute && (!hasSolo || track.solo)
}

function atempoChain(speed: number): string[] {
  let remaining = clamp(speed, 0.05, 20)
  const filters: string[] = []
  while (remaining > 2.0001) {
    filters.push('atempo=2')
    remaining /= 2
  }
  while (remaining < 0.4999) {
    filters.push('atempo=0.5')
    remaining /= 0.5
  }
  if (Math.abs(remaining - 1) > 0.001) filters.push(`atempo=${roundTo(remaining, 5)}`)
  return filters
}

export interface TimelineGraphOptions {
  choice?: EncoderChoice
  fontFile?: string | null
}

export function buildTimelineGraph(
  project: Project,
  sequence: Sequence,
  preset: EncodePreset,
  options: TimelineGraphOptions = {}
): TimelineGraph {
  const notes: string[] = []
  const assets = new Map(project.media.map((asset) => [asset.id, asset]))
  const hasSolo = sequence.tracks.some((track) => track.solo)
  const videoTracks = sequence.tracks.filter(
    (track) => (track.kind === 'video' || track.kind === 'adjustment') && audible(track, hasSolo)
  )
  const audioTracks = sequence.tracks.filter((track) => track.kind === 'audio' && audible(track, hasSolo))
  const textTracks = sequence.tracks.filter((track) => audible(track, hasSolo))

  const videoClips: Array<{ clip: Clip; track: Track }> = []
  for (const track of videoTracks) {
    for (const clip of track.clips) {
      if (clip.text) continue
      const asset = clip.mediaId ? assets.get(clip.mediaId) : null
      if (asset && (asset.kind === 'video' || asset.kind === 'image')) videoClips.push({ clip, track })
    }
  }
  const audioClips: Array<{ clip: Clip; track: Track }> = []
  for (const track of audioTracks) {
    for (const clip of track.clips) {
      const asset = clip.mediaId ? assets.get(clip.mediaId) : null
      if (asset && asset.channels > 0) audioClips.push({ clip, track })
    }
  }
  const textClips: Array<{ clip: Clip; track: Track }> = []
  for (const track of textTracks) {
    for (const clip of track.clips) if (clip.text?.content.trim()) textClips.push({ clip, track })
  }

  // Count stream reuse: an input pad can only be consumed once unless split.
  const specs = new Map<string, InputSpec>()
  const ensureSpec = (mediaId: string): InputSpec | null => {
    const asset = assets.get(mediaId)
    if (!asset) return null
    let spec = specs.get(mediaId)
    if (!spec) {
      spec = {
        index: specs.size,
        path: asset.path,
        loop: asset.kind === 'image',
        videoCount: 0,
        audioCount: 0,
        videoLabels: [],
        audioLabels: [],
        videoCursor: 0,
        audioCursor: 0
      }
      specs.set(mediaId, spec)
    }
    return spec
  }
  for (const { clip } of videoClips) if (clip.mediaId) ensureSpec(clip.mediaId)!.videoCount += 1
  for (const { clip } of audioClips) if (clip.mediaId) ensureSpec(clip.mediaId)!.audioCount += 1

  // Stable output labels.
  for (const [mediaId, spec] of specs) {
    void mediaId
    for (let i = 0; i < spec.videoCount; i++) spec.videoLabels.push(`src${spec.index}_v${i}`)
    for (let i = 0; i < spec.audioCount; i++) spec.audioLabels.push(`src${spec.index}_a${i}`)
  }

  const durationSec = Math.max(0.1, sequenceContentDuration(sequence))
  const width = sequence.width
  const height = sequence.height
  const fps = sequence.fps
  const filters: string[] = []
  filters.push(`color=c=black:s=${width}x${height}:r=${fps}:d=${roundTo(durationSec, 3)}[base]`)

  // Stream splitters come first so all clip chains can reference a pad.
  for (const spec of specs.values()) {
    if (spec.videoCount > 1) {
      const labels = spec.videoLabels.map((label) => `[${label}]`).join('')
      filters.push(`[${spec.index}:v]split=${spec.videoCount}${labels}`)
    } else if (spec.videoCount === 1) {
      spec.videoLabels[0] = `${spec.index}:v`
    }
    if (spec.audioCount > 1) {
      const labels = spec.audioLabels.map((label) => `[${label}]`).join('')
      filters.push(`[${spec.index}:a]asplit=${spec.audioCount}${labels}`)
    } else if (spec.audioCount === 1) {
      spec.audioLabels[0] = `${spec.index}:a`
    }
  }

  // Bottom track first: array order is top-to-bottom in the timeline UI.
  let last = 'base'
  let overlayIndex = 0
  for (const track of [...videoTracks].reverse()) {
    for (const clip of track.clips) {
      if (clip.text) continue
      const asset = clip.mediaId ? assets.get(clip.mediaId) : null
      if (!asset) continue
      const spec = specs.get(asset.id)
      if (!spec || spec.videoLabels.length === 0) continue
      const source = spec.videoLabels[spec.videoCursor++]
      const speed = clamp(clip.speed || 1, 0.05, 20)
      const sourceIn = Math.max(0, clip.inPoint)
      const sourceOut = sourceIn + clip.duration * speed
      const chain: string[] = [
        `trim=start=${roundTo(sourceIn, 3)}:end=${roundTo(sourceOut, 3)}`,
        `setpts=(PTS-STARTPTS)/${roundTo(speed, 5)}+${roundTo(clip.start, 3)}/TB`
      ]
      const effects = effectFilters(clip, notes)
      if (effects.length > 0) chain.push(...effects)
      const rotation = clip.transform.rotation
      if (Math.abs(rotation) > 0.01) {
        const radians = (rotation * Math.PI) / 180
        chain.push(`rotate=${roundTo(radians, 6)}:ow=rotw(${roundTo(radians, 6)}):oh=roth(${roundTo(radians, 6)}):c=none`)
      }
      chain.push(`scale=${width}:${height}:force_original_aspect_ratio=decrease`, 'setsar=1')
      const scale = clamp(clip.transform.scale || 1, 0.05, 20)
      if (Math.abs(scale - 1) > 0.001) {
        chain.push(`scale=trunc(iw*${roundTo(scale, 4)}/2)*2:trunc(ih*${roundTo(scale, 4)}/2)*2`)
      }
      const opacity = clamp(clip.transform.opacity, 0, 1)
      if (opacity < 0.999) {
        chain.push('format=rgba', `colorchannelmixer=aa=${roundTo(opacity, 3)}`)
      } else {
        chain.push('format=rgba')
      }
      const label = `vclip${overlayIndex}`
      const composed = `vstage${overlayIndex}`
      filters.push(`[${source}]${chain.join(',')}[${label}]`)
      // Overlay variables are W/H (main) and w/h (overlay); `ow/oh` are not
      // defined there and made ffmpeg abort with "Undefined constant ow".
      const xExpr = `(W-w)/2+${roundTo(clip.transform.x, 2)}`
      const yExpr = `(H-h)/2+${roundTo(-clip.transform.y, 2)}`
      filters.push(
        `[${last}][${label}]overlay=x=${xExpr}:y=${yExpr}:eof_action=pass:format=auto:enable='between(t,${roundTo(clip.start, 3)},${roundTo(clip.start + clip.duration, 3)})'[${composed}]`
      )
      last = composed
      overlayIndex += 1
    }
  }

  // Titles / lower thirds: drawn last so they sit above every picture track.
  const fontFile = options.fontFile === undefined ? findFontFile() : options.fontFile
  let textIndex = 0
  for (const { clip } of textClips) {
    const text = clip.text!
    if (!fontFile) {
      notes.push(`Nessun font di sistema trovato: il titolo "${text.content.slice(0, 32)}" non può essere esportato.`)
      continue
    }
    const label = `vtext${textIndex}`
    const color = colorValue(text.color)
    const box = text.background ? `:box=1:boxcolor=black@0.38:boxborderw=14` : ''
    filters.push(
      `[${last}]drawtext=fontfile='${escapeFilterPath(fontFile)}':text='${escapeDrawText(text.content)}':fontcolor=${color}:fontsize=${Math.round(text.fontSize)}:x=(w-text_w)*${roundTo(text.x, 3)}:y=h*${roundTo(text.y, 3)}-text_h/2${box}:enable='between(t,${roundTo(clip.start, 3)},${roundTo(clip.start + clip.duration, 3)})'[${label}]`
    )
    last = label
    textIndex += 1
  }

  // Output scaling / colour contract.
  const outputWidth = preset.video.width
  const outputHeight = preset.video.height
  const outputFps = preset.video.fps ?? fps
  const tail: string[] = []
  if (outputWidth && outputHeight) {
    if (preset.filters.scaleMode === 'fill') {
      tail.push(
        `scale=${outputWidth}:${outputHeight}:force_original_aspect_ratio=increase`,
        `crop=${outputWidth}:${outputHeight}`
      )
    } else if (preset.filters.scaleMode === 'stretch') {
      tail.push(`scale=${outputWidth}:${outputHeight}`)
    } else {
      tail.push(
        `scale=${outputWidth}:${outputHeight}:force_original_aspect_ratio=decrease`,
        `pad=${outputWidth}:${outputHeight}:(ow-iw)/2:(oh-ih)/2:color=black`
      )
    }
  } else if (outputWidth) {
    tail.push(`scale=${outputWidth}:-2`)
  } else if (outputHeight) {
    tail.push(`scale=-2:${outputHeight}`)
  }
  if (preset.filters.lut) tail.push(`lut3d=file='${escapeFilterPath(preset.filters.lut)}'`)
  if (preset.filters.burnSubtitles && preset.filters.subtitlePath) {
    tail.push(`subtitles=filename='${escapeFilterPath(preset.filters.subtitlePath)}'`)
  }
  if (preset.filters.colorConversion !== false) {
    const matrix = preset.video.colorSpace === 'rec709' ? 'bt709' : 'bt2020'
    tail.push(`scale=out_color_matrix=${matrix}:out_range=tv`)
  }
  tail.push(`fps=${outputFps}`, 'setsar=1')
  if (options.choice?.backend === 'vaapi' && process.platform === 'linux') {
    tail.push('format=nv12', 'hwupload')
  } else {
    tail.push(`format=${preset.video.pixelFormat || 'yuv420p'}`)
  }
  filters.push(`[${last}]${tail.join(',')}[vout]`)

  // Audio mix -----------------------------------------------------------
  const audioChains: string[] = []
  let audioIndex = 0
  for (const { clip, track } of audioClips) {
    const asset = clip.mediaId ? assets.get(clip.mediaId) : null
    if (!asset) continue
    const spec = specs.get(asset.id)
    if (!spec || spec.audioLabels.length === 0) continue
    const source = spec.audioLabels[spec.audioCursor++]
    const speed = clamp(clip.speed || 1, 0.05, 20)
    const sourceIn = Math.max(0, clip.inPoint)
    const sourceOut = sourceIn + clip.duration * speed
    const chain = [
      `atrim=start=${roundTo(sourceIn, 3)}:end=${roundTo(sourceOut, 3)}`,
      'asetpts=PTS-STARTPTS',
      ...atempoChain(speed),
      `volume=${roundTo(clamp(clip.volume * track.volume, 0, 8), 3)}`
    ]
    if (clip.start > 0.001) chain.push(`adelay=${Math.round(clip.start * 1000)}:all=1`)
    filters.push(`[${source}]${chain.join(',')}[a${audioIndex}]`)
    audioChains.push(`[a${audioIndex}]`)
    audioIndex += 1
  }
  let audioLabel: string | null = null
  if (audioChains.length === 1) {
    filters.push(`${audioChains[0]}anull[aout]`)
    audioLabel = 'aout'
  } else if (audioChains.length > 1) {
    filters.push(
      `${audioChains.join('')}amix=inputs=${audioChains.length}:normalize=0:duration=longest,alimiter=limit=0.95[aout]`
    )
    audioLabel = 'aout'
  }

  return {
    inputs: [...specs.values()].map((spec) => ({ path: spec.path, loop: spec.loop })),
    filterGraph: filters.join(';'),
    durationSec,
    hasAudio: audioLabel !== null,
    videoLabel: 'vout',
    audioLabel,
    notes: [...new Set(notes)]
  }
}
