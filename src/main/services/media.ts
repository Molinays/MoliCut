import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import type { MediaAsset } from '@shared/schemas'
import { computeWaveformPeaks, roundTo } from '@shared/utils'
import { ffmpeg } from './ffmpeg'
import { logger } from './logger'
import { appPaths } from './paths'
import { isSupportedMediaFile, safeRealPath } from './security'

/**
 * Media service: FFprobe is the single source of truth for metadata.
 * Thumbnails/waveforms are content-addressed caches, so imports are cheap and
 * the same file never gets processed twice.
 */

const IMAGE_CODECS = new Set(['png', 'mjpeg', 'jpeg', 'bmp', 'tiff', 'webp', 'exr', 'dpx', 'gif'])
const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'bmp', 'tif', 'tiff', 'webp', 'exr', 'dpx', 'gif'])

export function mediaIdFor(filePath: string): string {
  const real = existsSync(filePath) ? safeRealPath(filePath) : filePath
  return `med_${createHash('sha1').update(real.toLowerCase()).digest('hex').slice(0, 12)}`
}

function parseRate(rate: string | undefined): number {
  if (!rate || rate === '0/0') return 0
  const [num, den] = rate.split('/').map(Number)
  if (num === undefined || den === undefined || Number.isNaN(num) || Number.isNaN(den) || den === 0) return 0
  return roundTo(num / den, 3)
}

function placeholderThumb(name: string, kind: MediaAsset['kind']): string {
  const color = kind === 'audio' ? '#38d9a9' : kind === 'image' ? '#ffb547' : '#7c5cff'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#15161d"/><rect x="1" y="1" width="318" height="178" fill="none" stroke="${color}" stroke-opacity=".35"/><text x="160" y="84" font-family="Inter,system-ui,sans-serif" font-size="13" fill="${color}" text-anchor="middle">${kind.toUpperCase()}</text><text x="160" y="106" font-family="Inter,system-ui,sans-serif" font-size="10" fill="#8b8fa3" text-anchor="middle">${escapeXml(name).slice(0, 34)}</text></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

function escapeXml(input: string): string {
  return input.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c] ?? c)
}

export class MediaService {
  private roots = new Set<string>()
  onProxyReady: ((mediaId: string, proxyPath: string) => void) | null = null

  registerRoot(filePath: string): void {
    try {
      this.roots.add(dirname(safeRealPath(filePath)))
    } catch {
      this.roots.add(dirname(filePath))
    }
  }

  mediaRoots(): string[] {
    return [...this.roots]
  }

  async probe(filePath: string): Promise<MediaAsset> {
    if (!existsSync(filePath)) throw new Error('File non trovato')
    if (!isSupportedMediaFile(filePath)) throw new Error(`Formato non supportato: ${extname(filePath)}`)
    const real = safeRealPath(filePath)
    const stats = statSync(real)
    const res = await ffmpeg.runFfprobe(['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', real], {
      timeoutMs: 30000
    })
    if (res.code !== 0) throw new Error(`FFprobe ha fallito: ${res.stderr.slice(-800)}`)
    const data = JSON.parse(res.stdout) as {
      streams?: Array<Record<string, unknown>>
      format?: Record<string, unknown>
    }
    const streams = data.streams ?? []
    const format = data.format ?? {}
    const video = streams.find((s) => s.codec_type === 'video' && s.disposition !== undefined && (s.disposition as Record<string, number>).attached_pic !== 1)
    const audio = streams.find((s) => s.codec_type === 'audio')
    const ext = extname(real).slice(1).toLowerCase()
    // Still images are images by extension+codec, not by missing duration:
    // ffprobe reports a tiny duration for several image demuxers, which used
    // to classify JPG/PNG files as 0.04 s videos and made photo import unusable.
    const isImage = IMAGE_EXTS.has(ext) && !audio && (!video || IMAGE_CODECS.has(String(video.codec_name)))

    const tags = (format.tags ?? {}) as Record<string, string>
    const videoTags = (video?.tags ?? {}) as Record<string, string>
    const transfer = String(video?.color_transfer ?? '')
    const sideData = (video?.side_data_list ?? []) as Array<Record<string, unknown>>
    const rotation = Number(
      videoTags.rotate ?? sideData.find((s) => s.rotation !== undefined)?.rotation ?? 0
    )

    const duration = isImage ? 5 : Number(format.duration ?? video?.duration ?? audio?.duration ?? 0)
    const asset: MediaAsset = {
      id: mediaIdFor(real),
      path: real,
      name: basename(real),
      kind: isImage ? 'image' : audio && !video ? 'audio' : 'video',
      durationSec: roundTo(Math.max(0, duration), 3),
      width: Number(video?.width ?? 0),
      height: Number(video?.height ?? 0),
      fps: parseRate(video?.avg_frame_rate as string) || parseRate(video?.r_frame_rate as string) || (isImage ? 30 : 0),
      codec: String(video?.codec_name ?? audio?.codec_name ?? 'unknown'),
      audioCodec: String(audio?.codec_name ?? ''),
      channels: Number(audio?.channels ?? 0),
      sampleRate: Number(audio?.sample_rate ?? 0),
      bitrate: Number(format.bit_rate ?? 0),
      colorSpace: transfer || 'unknown',
      // Per-stream color tags: previously only the transfer was read, so no
      // downstream step could know the real matrix (601 vs 709) or range.
      colorMatrix: String(video?.color_space ?? ''),
      colorPrimaries: String(video?.color_primaries ?? ''),
      colorRange: String(video?.color_range ?? ''),
      rotation: Number.isFinite(rotation) ? rotation : 0,
      isHDR: transfer === 'smpte2084' || transfer === 'arib-std-b67',
      timecode: tags.timecode ?? null,
      fileSize: stats.size,
      proxyPath: null,
      thumbnailPath: null,
      status: 'online',
      importedAt: new Date().toISOString()
    }
    this.registerRoot(real)
    return asset
  }

  async thumbnail(filePath: string, timeSec = 1): Promise<{ dataUrl: string; fromCache: boolean }> {
    const key = createHash('sha1').update(`${filePath}:${Math.round(timeSec * 10)}`).digest('hex').slice(0, 16)
    const dir = appPaths().thumbnails
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    const cacheFile = join(dir, `${key}.jpg`)
    if (existsSync(cacheFile)) {
      return { dataUrl: `data:image/jpeg;base64,${readFileSync(cacheFile).toString('base64')}`, fromCache: true }
    }
    try {
      const isImage = IMAGE_EXTS.has(extname(filePath).slice(1).toLowerCase())
      const args = isImage
        ? ['-i', filePath, '-frames:v', '1', '-vf', 'scale=480:-2', '-q:v', '3', cacheFile]
        : ['-ss', String(timeSec), '-i', filePath, '-frames:v', '1', '-vf', 'scale=480:-2', '-q:v', '3', cacheFile]
      const res = await ffmpeg.runFfmpeg(args, { timeoutMs: 30000 })
      if (res.code !== 0 || !existsSync(cacheFile)) throw new Error(res.stderr.slice(-300))
      return { dataUrl: `data:image/jpeg;base64,${readFileSync(cacheFile).toString('base64')}`, fromCache: false }
    } catch (err) {
      logger.debug('media', `thumbnail placeholder for ${filePath}: ${(err as Error).message}`)
      return { dataUrl: placeholderThumb(basename(filePath), extname(filePath).match(/\.(wav|mp3|aac|flac|ogg)$/i) ? 'audio' : 'video'), fromCache: false }
    }
  }

  async waveform(filePath: string, buckets: number): Promise<{ peaks: number[]; durationSec: number }> {
    const cacheFile = join(appPaths().waveforms, `${createHash('sha1').update(`${filePath}:${buckets}`).digest('hex').slice(0, 16)}.json`)
    if (existsSync(cacheFile)) {
      try {
        const parsed = JSON.parse(readFileSync(cacheFile, 'utf8')) as { peaks: number[]; durationSec: number }
        if (Array.isArray(parsed.peaks)) return parsed
      } catch {
        /* regenerate */
      }
    }
    const info = ffmpeg.binaries().ffmpeg
    const binPath = info.path
    if (!binPath) throw new Error('FFmpeg non disponibile per la waveform')
    const result = await new Promise<{ peaks: number[]; durationSec: number }>((resolvePromise, reject) => {
      const child = spawn(
        binPath,
        ['-hide_banner', '-v', 'error', '-i', filePath, '-ac', '1', '-ar', '8000', '-f', 'f32le', '-'],
        { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] as const }
      )
      let pending: Buffer = Buffer.alloc(0)
      // Fixed 20 ms windows: memory is O(duration) independent of the sample
      // count, and we can down-sample to any number of buckets at the end.
      const WINDOW_SAMPLES = 160
      const windows: number[] = []
      let windowPeak = 0
      let windowCount = 0
      let totalSamples = 0
      let bytes = 0
      child.stdout.on('data', (chunk: Buffer) => {
        bytes += chunk.length
        if (bytes > 128 * 1024 * 1024) {
          child.kill()
          return
        }
        const buf = pending.length ? Buffer.concat([pending, chunk]) : chunk
        const usable = buf.length - (buf.length % 4)
        pending = buf.subarray(usable)
        for (let i = 0; i < usable; i += 4) {
          const value = Math.abs(buf.readFloatLE(i))
          if (value > windowPeak) windowPeak = value
          windowCount++
          totalSamples++
          if (windowCount >= WINDOW_SAMPLES) {
            windows.push(windowPeak)
            windowPeak = 0
            windowCount = 0
          }
        }
      })
      child.on('error', reject)
      child.on('close', () => {
        if (windowCount > 0) windows.push(windowPeak)
        const out: number[] = []
        const step = windows.length / Math.max(1, buckets)
        for (let b = 0; b < buckets; b++) {
          const start = Math.floor(b * step)
          const end = Math.min(windows.length, Math.max(start + 1, Math.floor((b + 1) * step)))
          let peak = 0
          for (let i = start; i < end; i++) peak = Math.max(peak, windows[i] ?? 0)
          out.push(roundTo(peak, 3))
        }
        resolvePromise({ peaks: out, durationSec: roundTo(totalSamples / 8000, 2) })
      })
    })
    const normalized = result.peaks.length ? result.peaks : computeWaveformPeaks(new Float32Array(0), buckets)
    writeFileSync(cacheFile, JSON.stringify({ peaks: normalized, durationSec: result.durationSec }), 'utf8')
    return { peaks: normalized, durationSec: result.durationSec }
  }

  async generateProxy(asset: MediaAsset, height = 540): Promise<string> {
    const dir = join(appPaths().proxies, asset.id)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    const out = join(dir, `${asset.id}_${height}p.mp4`)
    if (existsSync(out)) return out
    const res = await ffmpeg.runFfmpeg(
      [
        '-i',
        asset.path,
        '-vf',
        `scale=-2:${height}`,
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-crf',
        '28',
        '-c:a',
        'aac',
        '-b:a',
        '96k',
        '-movflags',
        '+faststart',
        out
      ],
      { timeoutMs: 30 * 60 * 1000, lowPriority: true }
    )
    if (res.code !== 0) throw new Error(`Proxy fallito: ${res.stderr.slice(-800)}`)
    logger.info('media', `proxy ready: ${asset.id} -> ${out}`)
    return out
  }

  startProxy(asset: MediaAsset): void {
    void this.generateProxy(asset)
      .then((proxyPath) => this.onProxyReady?.(asset.id, proxyPath))
      .catch((err) => logger.warn('media', `proxy failed for ${asset.id}: ${(err as Error).message}`))
  }

  missingFiles(paths: string[]): string[] {
    return paths.filter((p) => !existsSync(p))
  }
}

export const media = new MediaService()
