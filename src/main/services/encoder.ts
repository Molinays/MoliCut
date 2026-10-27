import { basename, extname, join } from 'node:path'
import type { EncodePreset } from '@shared/schemas'
import { basenameNoExt } from '@shared/utils'

export type BackendId = 'nvenc' | 'amf' | 'qsv' | 'videotoolbox' | 'vaapi' | 'software'

export interface EncoderChoice {
  encoder: string
  backend: BackendId
  hardware: boolean
  label: string
  reason: string
}

const HARDWARE_ENCODERS: Record<Exclude<BackendId, 'software'>, Partial<Record<string, string>>> = {
  nvenc: { h264: 'h264_nvenc', hevc: 'hevc_nvenc', av1: 'av1_nvenc' },
  amf: { h264: 'h264_amf', hevc: 'hevc_amf', av1: 'av1_amf' },
  qsv: { h264: 'h264_qsv', hevc: 'hevc_qsv', av1: 'av1_qsv' },
  videotoolbox: { h264: 'h264_videotoolbox', hevc: 'hevc_videotoolbox' },
  vaapi: { h264: 'h264_vaapi', hevc: 'hevc_vaapi', av1: 'av1_vaapi' }
}

const SOFTWARE_ENCODERS: Record<string, string> = {
  h264: 'libx264',
  hevc: 'libx265',
  av1: 'libsvtav1',
  vp9: 'libvpx-vp9',
  prores: 'prores_ks',
  dnxhr: 'dnxhd',
  gif: 'gif',
  png: 'png',
  mjpeg: 'mjpeg'
}

const BACKEND_LABEL: Record<BackendId, string> = {
  nvenc: 'NVIDIA NVENC',
  amf: 'AMD AMF',
  qsv: 'Intel Quick Sync',
  videotoolbox: 'Apple VideoToolbox',
  vaapi: 'VAAPI',
  software: 'Software (CPU)'
}

const DEFAULT_PRIORITY: BackendId[] =
  process.platform === 'darwin'
    ? ['videotoolbox', 'software']
    : process.platform === 'linux'
      ? ['nvenc', 'vaapi', 'qsv', 'amf', 'software']
      : ['nvenc', 'qsv', 'amf', 'software']

/** Derive usable hardware backends from the actual ffmpeg encoder list. */
export function backendsFromEncoders(encoders: string[]): BackendId[] {
  const found: BackendId[] = []
  for (const backend of Object.keys(HARDWARE_ENCODERS) as Array<Exclude<BackendId, 'software'>>) {
    if (Object.values(HARDWARE_ENCODERS[backend]).some((enc) => enc && encoders.includes(enc))) {
      found.push(backend)
    }
  }
  if (!found.includes('software')) found.push('software')
  return found
}

export function chooseEncoder(
  codec: string,
  policy: 'auto' | 'hardware' | 'software',
  backends: BackendId[],
  override: BackendId | 'auto' = 'auto'
): EncoderChoice {
  const software = (reason: string): EncoderChoice => ({
    encoder: SOFTWARE_ENCODERS[codec] ?? 'libx264',
    backend: 'software',
    hardware: false,
    label: 'Software (CPU)',
    reason
  })

  if (codec === 'gif' || codec === 'png' || codec === 'mjpeg' || !SOFTWARE_ENCODERS[codec]) {
    return codec === 'none' ? { encoder: 'none', backend: 'software', hardware: false, label: 'Nessuno', reason: 'nessun video' } : software('codec senza encoder hardware')
  }
  if (policy === 'software') return software('policy=software')
  if (override === 'software') return software('override=software')
  if (backends.length === 0) return software('nessun backend rilevato')

  const order = override === 'auto' ? DEFAULT_PRIORITY : [override, ...DEFAULT_PRIORITY]
  for (const candidate of order) {
    if (candidate === 'software') continue
    if (!backends.includes(candidate)) continue
    const encoder = HARDWARE_ENCODERS[candidate][codec]
    if (!encoder) continue
    return { encoder, backend: candidate, hardware: true, label: BACKEND_LABEL[candidate], reason: `backend ${candidate} disponibile` }
  }
  return software('nessun encoder hardware per questo codec')
}

function nvencPreset(preset: string): string {
  const map: Record<string, string> = {
    ultrafast: 'p1',
    superfast: 'p2',
    veryfast: 'p3',
    faster: 'p4',
    fast: 'p4',
    medium: 'p5',
    slow: 'p6',
    slower: 'p6',
    veryslow: 'p7'
  }
  return map[preset] ?? 'p5'
}

function bitrateArgs(preset: EncodePreset, choice: EncoderChoice, fps: number | null): string[] {
  const v = preset.video
  const args: string[] = []
  if (preset.video.codec === 'prores' || preset.video.codec === 'dnxhr' || preset.video.codec === 'png') return args

  if (v.bitrateMode === 'crf') {
    switch (choice.backend) {
      case 'software':
        if (v.codec === 'vp9') args.push('-crf', String(v.crf), '-b:v', '0')
        else if (v.codec === 'av1') args.push('-crf', String(v.crf), '-preset', v.preset || '6')
        else args.push('-crf', String(v.crf))
        break
      case 'nvenc':
        args.push('-rc', 'vbr', '-cq', String(v.crf), '-b:v', '0')
        break
      case 'qsv':
        args.push('-global_quality', String(v.crf))
        break
      case 'amf':
        args.push('-rc', 'cqp', '-qp_i', String(v.crf), '-qp_p', String(v.crf))
        break
      case 'videotoolbox':
        args.push('-q:v', String(Math.round(1 + (v.crf / 63) * 99)))
        break
      case 'vaapi':
        args.push('-qp', String(v.crf))
        break
    }
    return args
  }

  args.push('-b:v', `${v.bitrateKbps}k`)
  if (v.bitrateMode === 'cbr') {
    args.push('-maxrate', `${v.bitrateKbps}k`, '-bufsize', `${v.bitrateKbps * 2}k`)
    if (choice.backend === 'nvenc') args.push('-rc', 'cbr')
  } else if (choice.backend === 'nvenc') {
    args.push('-rc', 'vbr')
  }
  if (fps && v.gopSeconds > 0) {
    const gop = Math.max(1, Math.round(fps * v.gopSeconds))
    args.push('-g', String(gop), '-keyint_min', String(Math.max(1, Math.floor(gop / 2))))
  }
  return args
}

function proresProfile(profile: string | null): string {
  const map: Record<string, string> = { proxy: '0', lt: '1', standard: '2', hq: '3', '4444': '4' }
  return map[profile ?? 'hq'] ?? '3'
}

function dnxhrProfile(profile: string | null): string {
  const p = (profile ?? 'hqx').toLowerCase()
  return p.startsWith('dnxhr_') ? p : `dnxhr_${p}`
}

function colorArgs(preset: EncodePreset): string[] {
  const { colorSpace, hdr } = preset.video
  const args: string[] = []
  const isHdr = hdr === 'hdr10' || hdr === 'hlg'
  if (isHdr) {
    args.push(
      '-color_primaries',
      'bt2020',
      '-color_trc',
      hdr === 'hdr10' ? 'smpte2084' : 'arib-std-b67',
      '-colorspace',
      'bt2020nc'
    )
    return args
  }
  switch (colorSpace) {
    case 'rec2020':
      args.push('-color_primaries', 'bt2020', '-color_trc', 'bt2020-10', '-colorspace', 'bt2020nc')
      break
    case 'p3':
      // -colorspace takes a YUV MATRIX (bt709/bt2020nc/…); 'smpte432' is a
      // PRIMARIES value and makes ffmpeg abort with "Invalid argument" — the
      // whole export failed. P3-D65: bt2020 matrix + P3 primaries + bt709 trc.
      args.push('-color_primaries', 'smpte432', '-color_trc', 'bt709', '-colorspace', 'bt2020nc')
      break
    case 'aces':
      args.push('-color_primaries', 'bt2020', '-color_trc', 'linear', '-colorspace', 'bt2020nc')
      break
    default:
      args.push('-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709')
  }
  return args
}

function hdrParams(preset: EncodePreset, choice: EncoderChoice): string[] {
  if (preset.video.hdr !== 'hdr10') return []
  const m = preset.video.hdrMastering ?? { maxLuminance: 1000, minLuminance: 0.005, maxCLL: 1000, maxFALL: 400 }
  if (choice.encoder === 'libx265') {
    const master = `G(13250,34500)B(7500,3000)R(34000,16000)WP(15635,16450)L(${Math.round(m.maxLuminance * 10000)},${Math.max(1, Math.round(m.minLuminance * 10000))})`
    return [
      '-x265-params',
      `hdr-opt=1:repeat-headers=1:colorprim=bt2020:transfer=smpte2084:colormatrix=bt2020nc:master-display=${master}:max-cll=${m.maxCLL},${m.maxFALL}`
    ]
  }
  // Hardware encoders take mastering metadata from side data. The renderer
  // forwards it at the filter level when available; tracked in ROADMAP (HDR-2).
  return []
}

/** ffmpeg filter paths are colon/single-quote sensitive: normalise carefully. */
function escapeFilterPath(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'")
}

export interface BuildArgsOptions {
  input: string
  output: string
  preset: EncodePreset
  choice: EncoderChoice
  durationSec: number | null
  hasAudio: boolean
  sourceIsImage?: boolean
  testMode?: boolean
}

/** Codec arguments shared by single-source and timeline (filter graph) renders. */
function appendVideoCodecArgs(args: string[], preset: EncodePreset, choice: EncoderChoice, fps: number | null): void {
  const v = preset.video
  if (v.codec === 'none') {
    args.push('-vn')
    return
  }
  args.push('-c:v', choice.encoder)
  if (choice.backend === 'nvenc') args.push('-preset', nvencPreset(v.preset))
  else if (choice.backend === 'software' && v.codec !== 'gif' && v.codec !== 'png') args.push('-preset', v.preset)
  if (choice.backend === 'amf') args.push('-quality', 'quality')
  if (v.codec === 'prores') {
    args.push('-profile:v', proresProfile(v.profile), '-vendor', 'apl0')
  } else if (v.codec === 'dnxhr') {
    args.push('-profile:v', dnxhrProfile(v.profile))
  } else if (v.profile && v.codec !== 'gif' && v.codec !== 'png') {
    args.push('-profile:v', v.profile)
  }
  if (v.pixelFormat && choice.backend !== 'vaapi' && v.codec !== 'gif') args.push('-pix_fmt', v.pixelFormat)
  args.push(...bitrateArgs(preset, choice, fps))
  args.push(...colorArgs(preset))
  args.push(...hdrParams(preset, choice))
  if (preset.container === 'mp4' && v.codec === 'hevc') args.push('-tag:v', 'hvc1')
}

function appendAudioCodecArgs(args: string[], preset: EncodePreset, hasAudio: boolean): void {
  const a = preset.audio
  if (a.codec === 'none' || !hasAudio || preset.video.codec === 'gif') {
    args.push('-an')
    return
  }
  const codecMap: Record<string, string> = {
    aac: 'aac',
    mp3: 'libmp3lame',
    pcm_s16le: 'pcm_s16le',
    pcm_s24le: 'pcm_s24le',
    opus: 'libopus'
  }
  args.push('-c:a', codecMap[a.codec] ?? 'aac')
  if (a.codec !== 'pcm_s16le' && a.codec !== 'pcm_s24le') args.push('-b:a', `${a.bitrateKbps}k`)
  args.push('-ac', String(a.channels), '-ar', String(a.sampleRate))
}

function appendContainerArgs(args: string[], preset: EncodePreset, output: string, testMode?: boolean): void {
  if (preset.container === 'mp4' || preset.container === 'mov') args.push('-movflags', '+faststart')
  if (preset.container === 'gif') args.push('-loop', '0')
  if (preset.container === 'image2') args.push('-f', 'image2', '-start_number', '1')
  if (preset.container === 'webm') args.push('-f', 'webm')
  if (testMode) args.push('-f', 'null')
  args.push(testMode ? '-' : output)
}

export function buildEncodeArgs(options: BuildArgsOptions): string[] {
  const { input, output, preset, choice } = options
  const v = preset.video
  const a = preset.audio
  const args: string[] = []
  const fps = v.fps
  const filters: string[] = []
  const audioFilters: string[] = []

  if (options.sourceIsImage && options.durationSec) {
    args.push('-loop', '1', '-t', String(options.durationSec))
  }
  if (choice.backend === 'vaapi' && process.platform === 'linux') {
    args.push('-vaapi_device', process.env.MOLICUT_VAAPI_DEVICE ?? '/dev/dri/renderD128')
  }
  args.push('-i', input)

  // Video filters -----------------------------------------------------
  if (v.codec === 'gif') {
    const width = v.width ?? 720
    filters.push(`fps=${v.fps ?? 15}`, `scale=${width}:-1:flags=lanczos`, 'split[s0][s1]', '[s0]palettegen=max_colors=256[p]', '[s1][p]paletteuse=dither=sierra2_4a')
  } else {
    if (v.width && v.height) {
      if (preset.filters.scaleMode === 'fit') {
        filters.push(
          `scale=${v.width}:${v.height}:force_original_aspect_ratio=decrease`,
          `pad=${v.width}:${v.height}:(ow-iw)/2:(oh-ih)/2:color=black`
        )
      } else if (preset.filters.scaleMode === 'fill') {
        filters.push(`scale=${v.width}:${v.height}:force_original_aspect_ratio=increase`, `crop=${v.width}:${v.height}`)
      } else {
        filters.push(`scale=${v.width}:${v.height}`)
      }
    } else if (v.width) {
      filters.push(`scale=${v.width}:-2`)
    } else if (v.height) {
      filters.push(`scale=-2:${v.height}`)
    }
    if (fps) filters.push(`fps=${fps}`)
    if (preset.filters.lut) filters.push(`lut3d=file='${escapeFilterPath(preset.filters.lut)}'`)
    if (preset.filters.burnSubtitles && preset.filters.subtitlePath) {
      filters.push(`subtitles=filename='${escapeFilterPath(preset.filters.subtitlePath)}'`)
    }
    if (preset.filters.colorConversion !== false) {
      // Explicit YUV matrix + range so the encoded pixels MATCH the tags that
      // colorArgs writes below: swscale otherwise picks an implicit matrix
      // (frequently BT.601) while the container claims BT.709 — the
      // green/yellow cast on players that trust the tags. Runs before the
      // vaapi hwupload so it stays on CPU frames. Opt-out via the preset's
      // colorConversion flag (default true in built-in presets).
      const matrix = v.colorSpace === 'rec709' ? 'bt709' : 'bt2020'
      filters.push(`scale=out_color_matrix=${matrix}:out_range=tv`)
    }
    if (choice.backend === 'vaapi') filters.push('format=nv12,hwupload')
    else if (v.pixelFormat) filters.push(`format=${v.pixelFormat}`)
  }

  // Audio chain -------------------------------------------------------
  if (a.loudness.enabled && a.codec !== 'none') {
    audioFilters.push(`loudnorm=I=${a.loudness.targetLufs}:TP=${a.loudness.truePeakDb}:LRA=${a.loudness.lra}`)
  }

  if (filters.length > 0) args.push('-vf', filters.join(','))
  if (audioFilters.length > 0) args.push('-af', audioFilters.join(','))

  // Codecs + container ------------------------------------------------
  appendVideoCodecArgs(args, preset, choice, fps)
  appendAudioCodecArgs(args, preset, options.hasAudio)
  appendContainerArgs(args, preset, output, options.testMode)
  return args
}

export interface BuildGraphArgsOptions {
  output: string
  preset: EncodePreset
  choice: EncoderChoice
  filterGraph: string
  videoLabel: string
  audioLabel: string | null
  durationSec: number
  hasAudio: boolean
  testMode?: boolean
}

/**
 * Encode a pre-built filter graph (the timeline compositor). The graph owns
 * scaling/compositing and emits `<videoLabel>` (and optionally `<audioLabel>`);
 * this function only appends codec/container arguments so the same encoder
 * policy and argument rules apply to timeline exports.
 */
export function buildGraphEncodeArgs(options: BuildGraphArgsOptions): string[] {
  const { preset, choice, durationSec } = options
  const fids: string[] = ['-filter_complex', options.filterGraph]
  if (preset.video.codec !== 'none') fids.push('-map', `[${options.videoLabel}]`)
  if (options.hasAudio && options.audioLabel && preset.audio.codec !== 'none' && preset.video.codec !== 'gif') {
    fids.push('-map', `[${options.audioLabel}]`)
  }
  fids.push('-t', String(Math.max(0.05, durationSec)))
  appendVideoCodecArgs(fids, preset, choice, preset.video.fps)
  appendAudioCodecArgs(fids, preset, options.hasAudio)
  appendContainerArgs(fids, preset, options.output, options.testMode)
  return fids
}

/** Sanitise a project/sequence name into a cross-platform file stem. */
export function safeFileStem(value: string, fallback = 'MoliCut'): string {
  const stem = value
    .normalize('NFKD')
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[. ]+$/g, '')
    .slice(0, 100)
  return stem || fallback
}

export function encoderTestArgs(encoderId: string, codec: 'h264' | 'hevc' | 'av1'): string[] {
  const args = [
    '-f',
    'lavfi',
    '-i',
    'testsrc2=size=640x360:rate=30:duration=1',
    '-c:v',
    encoderId,
    '-pix_fmt',
    'yuv420p',
    '-f',
    'null',
    '-'
  ]
  if (encoderId === 'libsvtav1') args.splice(args.indexOf('-pix_fmt'), 2, '-preset', '10')
  if (encoderId.endsWith('_vaapi')) args.splice(0, 0, '-vaapi_device', process.env.MOLICUT_VAAPI_DEVICE ?? '/dev/dri/renderD128')
  return args
}

export function outputExtension(preset: EncodePreset): string {
  if (preset.container === 'image2') return preset.video.codec === 'png' ? 'png' : 'jpg'
  return preset.container
}

export function defaultOutputPath(preset: EncodePreset, sourcePath: string, directory: string): string {
  const desired = preset.output.directory ?? directory
  const suffix = preset.output.suffix || ''
  return join(desired, `${basenameNoExt(sourcePath)}${suffix}.${outputExtension(preset)}`)
}

export function uniqueOutputPath(path: string, exists: (p: string) => boolean): string {
  if (!exists(path)) return path
  const ext = extname(path)
  const stem = basename(path, ext)
  for (let i = 1; i < 500; i++) {
    const candidate = join(path.slice(0, path.length - basename(path).length), `${stem}_${i}${ext}`)
    if (!exists(candidate)) return candidate
  }
  return path
}

export function estimateSizeBytes(preset: EncodePreset, durationSec: number, hasAudio: boolean): number {
  if (preset.video.codec === 'prores') return Math.round(durationSec * (preset.video.bitrateKbps || 220000) * 125)
  if (preset.video.codec === 'dnxhr') return Math.round(durationSec * (preset.video.bitrateKbps || 180000) * 125)
  const videoKbps = preset.video.bitrateMode === 'crf' ? preset.video.bitrateKbps : preset.video.bitrateKbps
  const audioKbps = preset.audio.codec === 'none' || !hasAudio ? 0 : preset.audio.bitrateKbps
  return Math.round(((videoKbps + audioKbps) * 1000 * durationSec) / 8)
}

export function shortCodecName(codec: string): string {
  const map: Record<string, string> = {
    h264: 'H.264',
    hevc: 'HEVC',
    av1: 'AV1',
    vp9: 'VP9',
    prores: 'ProRes',
    dnxhr: 'DNxHR',
    gif: 'GIF',
    png: 'PNG',
    mjpeg: 'MJPEG'
  }
  return map[codec] ?? codec.toUpperCase()
}
