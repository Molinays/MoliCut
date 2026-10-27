import type { AudioSettings, EncodePreset, VideoSettings } from './schemas'
import { uid } from './utils'

const FIXED_DATE = '2026-01-01T00:00:00.000Z'

const baseVideo: VideoSettings = {
  codec: 'h264',
  encoderPolicy: 'auto',
  width: null,
  height: null,
  fps: null,
  bitrateMode: 'vbr',
  bitrateKbps: 12000,
  crf: 20,
  gopSeconds: 2,
  preset: 'medium',
  profile: null,
  pixelFormat: 'yuv420p',
  colorSpace: 'rec709',
  hdr: 'none'
}

const baseAudio: AudioSettings = {
  codec: 'aac',
  bitrateKbps: 192,
  channels: 2,
  sampleRate: 48000,
  loudness: { enabled: false, targetLufs: -16, truePeakDb: -1, lra: 11 }
}

type PresetSeed = Pick<EncodePreset, 'id' | 'name' | 'description' | 'container' | 'tags'> & {
  video?: Partial<VideoSettings>
  audio?: Partial<AudioSettings>
  suffix?: string
}

function seed(input: PresetSeed): EncodePreset {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    container: input.container,
    video: { ...baseVideo, ...input.video },
    audio: { ...baseAudio, ...input.audio },
    filters: { lut: null, burnSubtitles: false, subtitlePath: null, scaleMode: 'fit', colorConversion: true },
    output: { suffix: input.suffix ?? '', directory: null },
    tags: input.tags,
    version: 1,
    builtin: true,
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE
  }
}

/**
 * Built-in presets are code, not seeded rows: they are always present, cannot
 * be deleted and are versioned with the app. Users clone them into custom ones.
 */
export function builtinPresets(): EncodePreset[] {
  return [
    seed({
      id: 'builtin-youtube-1080p',
      name: 'YouTube 1080p',
      description: 'H.264 1080p30 VBR 12 Mbps, AAC 192 kbps, faststart.',
      container: 'mp4',
      video: { width: 1920, height: 1080, fps: 30, bitrateKbps: 12000, preset: 'medium', profile: 'high' },
      audio: { codec: 'aac', bitrateKbps: 192 },
      tags: ['web', 'youtube', 'h264']
    }),
    seed({
      id: 'builtin-youtube-4k',
      name: 'YouTube 4K',
      description: 'H.265/HEVC 2160p VBR 45 Mbps con fallback hardware automatico.',
      container: 'mp4',
      video: {
        codec: 'hevc',
        width: 3840,
        height: 2160,
        fps: 30,
        bitrateKbps: 45000,
        preset: 'slow',
        profile: 'main10',
        pixelFormat: 'yuv420p10le'
      },
      audio: { bitrateKbps: 256 },
      tags: ['web', 'youtube', 'hevc', '4k']
    }),
    seed({
      id: 'builtin-vimeo-1080p',
      name: 'Vimeo 1080p',
      description: 'H.264 1080p VBR 10 Mbps, audio AAC 192 kbps.',
      container: 'mp4',
      video: { width: 1920, height: 1080, bitrateKbps: 10000 },
      tags: ['web', 'vimeo']
    }),
    seed({
      id: 'builtin-instagram-reels',
      name: 'Instagram Reels',
      description: 'Verticale 1080x1920 30 fps, 8 Mbps, AAC 128 kbps.',
      container: 'mp4',
      video: { width: 1080, height: 1920, fps: 30, bitrateKbps: 8000, preset: 'veryfast' },
      audio: { bitrateKbps: 128 },
      tags: ['social', 'vertical', 'instagram']
    }),
    seed({
      id: 'builtin-tiktok',
      name: 'TikTok 1080x1920',
      description: 'Verticale 9:16, GOP 1s, bitrate 8 Mbps, loudness -14 LUFS.',
      container: 'mp4',
      video: { width: 1080, height: 1920, fps: 30, bitrateKbps: 8000, gopSeconds: 1, preset: 'veryfast' },
      audio: { bitrateKbps: 128, loudness: { enabled: true, targetLufs: -14, truePeakDb: -1, lra: 9 } },
      tags: ['social', 'vertical', 'tiktok']
    }),
    seed({
      id: 'builtin-broadcast-prores-422hq',
      name: 'ProRes 422 HQ',
      description: 'Master broadcast Apple ProRes 422 HQ 1080p, PCM 24-bit 48 kHz.',
      container: 'mov',
      video: { codec: 'prores', width: 1920, height: 1080, fps: 25, bitrateMode: 'vbr', bitrateKbps: 220000, profile: 'hq', pixelFormat: 'yuv422p10le' },
      audio: { codec: 'pcm_s24le', bitrateKbps: 2304 },
      tags: ['broadcast', 'prores', 'master']
    }),
    seed({
      id: 'builtin-broadcast-dnxhr-hqx',
      name: 'DNxHR HQX',
      description: 'Avid DNxHR HQX 10-bit 1080p per workflow broadcast.',
      container: 'mov',
      video: { codec: 'dnxhr', width: 1920, height: 1080, fps: 25, bitrateKbps: 180000, profile: 'hqx', pixelFormat: 'yuv422p10le' },
      audio: { codec: 'pcm_s24le', bitrateKbps: 2304 },
      tags: ['broadcast', 'dnxhr', 'master']
    }),
    seed({
      id: 'builtin-master-hdr10',
      name: 'Master HDR10',
      description: 'HEVC 10-bit, Rec.2020 PQ, metadata HDR10 statici, 60 Mbps.',
      container: 'mp4',
      video: {
        codec: 'hevc',
        width: 3840,
        height: 2160,
        fps: 24,
        bitrateKbps: 60000,
        profile: 'main10',
        pixelFormat: 'yuv420p10le',
        colorSpace: 'rec2020',
        hdr: 'hdr10',
        hdrMastering: { maxLuminance: 1000, minLuminance: 0.005, maxCLL: 1000, maxFALL: 400 }
      },
      audio: { bitrateKbps: 320 },
      tags: ['hdr', 'master', 'hdr10']
    }),
    seed({
      id: 'builtin-master-hlg',
      name: 'Master HLG',
      description: 'HEVC 10-bit HLG per distribuzione broadcast HDR.',
      container: 'mp4',
      video: {
        codec: 'hevc',
        width: 3840,
        height: 2160,
        fps: 25,
        bitrateKbps: 50000,
        profile: 'main10',
        pixelFormat: 'yuv420p10le',
        colorSpace: 'rec2020',
        hdr: 'hlg'
      },
      tags: ['hdr', 'hlg', 'broadcast']
    }),
    seed({
      id: 'builtin-audio-wav',
      name: 'WAV 48 kHz 24-bit',
      description: 'Solo audio PCM 24-bit, loudness normalization opzionale.',
      container: 'wav',
      video: { codec: 'none' },
      audio: { codec: 'pcm_s24le', bitrateKbps: 2304, sampleRate: 48000 },
      tags: ['audio', 'wav']
    }),
    seed({
      id: 'builtin-audio-mp3',
      name: 'MP3 320 kbps',
      description: 'Audio MP3 CBR 320 kbps 44.1 kHz.',
      container: 'mp3',
      video: { codec: 'none' },
      audio: { codec: 'mp3', bitrateKbps: 320, sampleRate: 44100 },
      tags: ['audio', 'mp3']
    }),
    seed({
      id: 'builtin-audio-aac',
      name: 'AAC 256 kbps',
      description: 'Audio AAC-LC 256 kbps dentro container MP4 (solo audio).',
      container: 'mp4',
      video: { codec: 'none' },
      audio: { codec: 'aac', bitrateKbps: 256 },
      tags: ['audio', 'aac']
    }),
    seed({
      id: 'builtin-gif',
      name: 'GIF 720p',
      description: 'GIF 15 fps, palette 256 colori, larghezza 720.',
      container: 'gif',
      video: { codec: 'gif', width: 720, height: null, fps: 15, bitrateMode: 'crf', crf: 0 },
      audio: { codec: 'none' },
      tags: ['image', 'gif', 'social']
    }),
    seed({
      id: 'builtin-webm-vp9',
      name: 'WebM VP9',
      description: 'VP9 CRF 32 + Opus 128 kbps, per web moderno.',
      container: 'webm',
      video: { codec: 'vp9', bitrateMode: 'crf', crf: 32, preset: 'good', pixelFormat: 'yuv420p' },
      audio: { codec: 'opus', bitrateKbps: 128 },
      tags: ['web', 'webm', 'vp9']
    }),
    seed({
      id: 'builtin-av1',
      name: 'AV1 SVT 1080p',
      description: 'SVT-AV1 CRF 30, massima efficienza, fallback software.',
      container: 'mp4',
      video: { codec: 'av1', width: 1920, height: 1080, bitrateMode: 'crf', crf: 30, preset: '6' },
      tags: ['web', 'av1', 'efficient']
    }),
    seed({
      id: 'builtin-image-png',
      name: 'Sequenza PNG',
      description: 'Image sequence PNG RGBA, un frame per file.',
      container: 'image2',
      video: { codec: 'png', bitrateMode: 'crf', crf: 0, pixelFormat: 'rgba' },
      audio: { codec: 'none' },
      suffix: '_%04d',
      tags: ['image', 'sequence', 'vfx']
    })
  ]
}

/** Clone a builtin into an editable custom preset. */
export function clonePreset(preset: EncodePreset, name?: string): EncodePreset {
  const now = new Date().toISOString()
  return {
    ...structuredClone(preset),
    id: uid('pst'),
    name: name ?? `${preset.name} (copia)`,
    builtin: false,
    version: 1,
    createdAt: now,
    updatedAt: now
  }
}
