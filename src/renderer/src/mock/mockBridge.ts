import type { EventName, EventPayload, IpcResult, MolicutBridge, QueueStats } from '@shared/ipc'
import type { HardwareProfile, MediaAsset, QueueJob } from '@shared/schemas'
import { defaultSettings } from '@shared/schemas'
import { builtinPresets } from '@shared/builtinPresets'
import { createProject } from '@shared/projectFactory'
import { uid } from '@shared/utils'

/**
 * Browser mock bridge. Same contract as preload, backed by memory + a tiny
 * queue simulator. This is what makes the Preview tab (and the web build)
 * a faithful, interactive demo without Electron or FFmpeg.
 */

const now = (): string => new Date().toISOString()

const demoAssets: MediaAsset[] = [
  {
    id: 'med_city',
    path: 'C:\\Demo\\City_Night_HDR.mp4',
    name: 'City_Night_HDR.mp4',
    kind: 'video',
    durationSec: 32,
    width: 3840,
    height: 2160,
    fps: 25,
    codec: 'hevc',
    audioCodec: 'aac',
    channels: 2,
    sampleRate: 48000,
    bitrate: 80_000_000,
    colorSpace: 'smpte2084',
    rotation: 0,
    isHDR: true,
    timecode: '01:00:00:00',
    fileSize: 512_000_000,
    proxyPath: null,
    thumbnailPath: null,
    status: 'online',
    importedAt: now()
  },
  {
    id: 'med_interview',
    path: 'C:\\Demo\\Interview_A.mov',
    name: 'Interview_A.mov',
    kind: 'video',
    durationSec: 48,
    width: 1920,
    height: 1080,
    fps: 25,
    codec: 'prores',
    audioCodec: 'pcm_s24le',
    channels: 2,
    sampleRate: 48000,
    bitrate: 220_000_000,
    colorSpace: 'bt709',
    rotation: 0,
    isHDR: false,
    timecode: '10:00:00:00',
    fileSize: 1_300_000_000,
    proxyPath: 'C:\\Proxies\\interview_540p.mp4',
    thumbnailPath: null,
    status: 'online',
    importedAt: now()
  },
  {
    id: 'med_drone',
    path: 'C:\\Demo\\Drone_Coast.mp4',
    name: 'Drone_Coast.mp4',
    kind: 'video',
    durationSec: 24,
    width: 3840,
    height: 2160,
    fps: 30,
    codec: 'h264',
    audioCodec: 'aac',
    channels: 2,
    sampleRate: 48000,
    bitrate: 60_000_000,
    colorSpace: 'bt709',
    rotation: 0,
    isHDR: false,
    timecode: null,
    fileSize: 210_000_000,
    proxyPath: null,
    thumbnailPath: null,
    status: 'online',
    importedAt: now()
  },
  {
    id: 'med_ambient',
    path: 'C:\\Demo\\Ambient_Bed.wav',
    name: 'Ambient_Bed.wav',
    kind: 'audio',
    durationSec: 62,
    width: 0,
    height: 0,
    fps: 0,
    codec: 'pcm_s24le',
    audioCodec: 'pcm_s24le',
    channels: 2,
    sampleRate: 48000,
    bitrate: 2304,
    colorSpace: 'unknown',
    rotation: 0,
    isHDR: false,
    timecode: null,
    fileSize: 18_000_000,
    proxyPath: null,
    thumbnailPath: null,
    status: 'online',
    importedAt: now()
  },
  {
    id: 'med_logo',
    path: 'C:\\Demo\\MoliCut_Logo.png',
    name: 'MoliCut_Logo.png',
    kind: 'image',
    durationSec: 5,
    width: 1200,
    height: 1200,
    fps: 30,
    codec: 'png',
    audioCodec: '',
    channels: 0,
    sampleRate: 0,
    bitrate: 0,
    colorSpace: 'unknown',
    rotation: 0,
    isHDR: false,
    timecode: null,
    fileSize: 1_200_000,
    proxyPath: null,
    thumbnailPath: null,
    status: 'online',
    importedAt: now()
  }
]

const gradients: Record<string, [string, string]> = {
  med_city: ['#2b1055', '#7597de'],
  med_interview: ['#42275a', '#734b6d'],
  med_drone: ['#134e5e', '#71b280'],
  med_ambient: ['#232526', '#414345'],
  med_logo: ['#7c5cff', '#38d9a9']
}

function artwork(id: string, label: string): string {
  const [a, b] = gradients[id] ?? ['#1c1d26', '#34364a']
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="480" height="270" fill="url(#g)"/><g fill="white" opacity=".18"><circle cx="90" cy="80" r="60"/><circle cx="380" cy="200" r="90"/></g><text x="24" y="238" font-family="Inter,system-ui,sans-serif" font-size="18" font-weight="600" fill="white" opacity=".92">${label}</text></svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

function demoProject() {
  const project = createProject('MoliCut Demo')
  project.media = demoAssets.map((a) => ({ ...a }))
  const sequence = project.sequences[0]!
  sequence.name = 'Trailer 01'
  sequence.duration = 48
  const v2 = sequence.tracks.find((track) => track.kind === 'video' && track.name === 'V2')
  const v1 = sequence.tracks.find((track) => track.kind === 'video' && track.name === 'V1')
  const a1 = sequence.tracks.find((track) => track.kind === 'audio')
  if (v2 && v1 && a1) {
    v2.clips.push({
      id: uid('clip'),
      name: 'City_Night_HDR.mp4',
      trackId: v2.id,
      mediaId: 'med_city',
      start: 0,
      duration: 14,
      inPoint: 2,
      speed: 1,
      color: '#7c5cff',
      volume: 1,
      transform: { x: 0, y: 0, scale: 1.04, rotation: 0, opacity: 1 },
      effects: [
        { id: uid('fx'), type: 'Cinematic LUT', enabled: true, params: { intensity: 0.85, contrast: 1.12 } },
        { id: uid('fx'), type: 'Gaussian Blur', enabled: false, params: { radius: 4 } }
      ]
    })
    v1.clips.push({
      id: uid('clip'),
      name: 'Interview_A.mov',
      trackId: v1.id,
      mediaId: 'med_interview',
      start: 12,
      duration: 16,
      inPoint: 5,
      speed: 1,
      color: '#4c8dff',
      volume: 1,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
      effects: [{ id: uid('fx'), type: 'Sharpen', enabled: true, params: { amount: 0.4 } }]
    })
    v1.clips.push({
      id: uid('clip'),
      name: 'Drone_Coast.mp4',
      trackId: v1.id,
      mediaId: 'med_drone',
      start: 28,
      duration: 12,
      inPoint: 0,
      speed: 1,
      color: '#38d9a9',
      volume: 1,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
      effects: []
    })
    a1.clips.push({
      id: uid('clip'),
      name: 'Ambient_Bed.wav',
      trackId: a1.id,
      mediaId: 'med_ambient',
      start: 0,
      duration: 42,
      inPoint: 0,
      speed: 1,
      color: '#ffb547',
      volume: 0.55,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
      effects: []
    })
  }
  sequence.markers = [
    { id: uid('mk'), time: 12, label: 'Intervista', color: '#4c8dff' },
    { id: uid('mk'), time: 28, label: 'B-roll drone', color: '#38d9a9' }
  ]
  project.activeSequenceId = sequence.id
  return project
}

const listeners = new Map<EventName, Set<(payload: unknown) => void>>()
function emit<E extends EventName>(event: E, payload: EventPayload<E>): void {
  for (const fn of listeners.get(event) ?? []) fn(payload)
}

let settings = { ...defaultSettings, shortcuts: { ...defaultSettings.shortcuts }, recentProjects: ['C:\\Projects\\MoliCut Demo.mcut'] }
let project = demoProject()
let presets = builtinPresets()
let folders = [
  {
    id: 'wf_demo',
    path: 'C:\\Watch\\Incoming',
    presetId: 'builtin-youtube-1080p',
    outputDir: 'C:\\Watch\\Out',
    enabled: false,
    recursive: true,
    extensions: ['mp4', 'mov'],
    namePattern: null,
    excludePattern: '*_tmp*',
    stabilityMs: 4000,
    action: 'queue' as const,
    conflict: 'suffix' as const,
    dryRun: true,
    createdAt: now()
  }
]

const jobs: QueueJob[] = []
const timers = new Map<string, ReturnType<typeof setInterval>>()

function presetById(id: string) {
  return presets.find((p) => p.id === id) ?? presets[0]!
}

function makeJob(source: string, presetId: string, state: QueueJob['state'] = 'queued'): QueueJob {
  const preset = presetById(presetId)
  const name = source.split(/[\\/]/).pop() ?? 'source'
  return {
    id: uid('job'),
    name: `${name} → ${preset.name}`,
    sourcePath: source,
    sourceMediaId: demoAssets.find((a) => a.name === name)?.id ?? null,
    sequenceId: null,
    preset,
    outputPath: `C:\\Exports\\${name.replace(/\.[^.]+$/, '')}_${preset.video.height ?? 1080}p.mp4`,
    durationSec: 30,
    hasAudio: true,
    state,
    priority: 50,
    progress: state === 'done' ? 100 : 0,
    fps: 0,
    speed: 0,
    etaSec: 0,
    sizeBytes: state === 'done' ? 148_000_000 : 0,
    attempts: state === 'done' ? 1 : 0,
    maxRetries: 3,
    error: null,
    logs: [`[queue] accodato ${now()}`],
    groupId: null,
    metrics:
      state === 'done'
        ? { avgFps: 61.4, encodedFrames: 1842, durationMs: 30_000, outputBytes: 148_000_000, speed: 1.9 }
        : { avgFps: 0, encodedFrames: 0, durationMs: 0, outputBytes: 0, speed: 0 },
    createdAt: now(),
    startedAt: state === 'done' ? now() : null,
    finishedAt: state === 'done' ? now() : null,
    nextAttemptAt: null
  }
}

jobs.push(
  { ...makeJob('C:\\Demo\\Interview_A.mov', 'builtin-youtube-1080p', 'done') },
  { ...makeJob('C:\\Demo\\Drone_Coast.mp4', 'builtin-instagram-reels', 'done') }
)

function stats(): QueueStats {
  const count = (state: QueueJob['state']) => jobs.filter((j) => j.state === state).length
  return {
    queued: count('queued'),
    running: count('running'),
    paused: count('paused'),
    done: count('done'),
    error: count('error'),
    canceled: count('canceled'),
    total: jobs.length,
    progress: jobs.length ? Math.round((jobs.reduce((s, j) => s + (j.state === 'done' ? 100 : j.progress), 0) / jobs.length) * 10) / 10 : 0,
    aggregateFps: jobs.filter((j) => j.state === 'running').reduce((s, j) => s + j.fps, 0)
  }
}

function queueChanged(): void {
  emit('queue:changed', { jobs: [...jobs], stats: stats() })
}

function startSim(job: QueueJob): void {
  if (timers.has(job.id)) return
  job.state = 'running'
  job.startedAt = now()
  job.attempts += 1
  job.logs.push(`[queue] avvio tentativo ${job.attempts}/4`)
  emit('queue:log', { jobId: job.id, line: job.logs[job.logs.length - 1]! })
  queueChanged()
  const interval = setInterval(() => {
    job.progress = Math.min(100, job.progress + 2.4)
    job.fps = 48 + Math.round(Math.random() * 30)
    job.speed = 7.4
    job.etaSec = Math.max(0, Math.round((100 - job.progress) * 1.4))
    job.sizeBytes = Math.round((job.progress / 100) * 148_000_000)
    emit('queue:progress', {
      jobId: job.id,
      progress: job.progress,
      fps: job.fps,
      speed: job.speed,
      etaSec: job.etaSec,
      sizeBytes: job.sizeBytes
    })
    if (Math.random() < 0.12) {
      const line = `[ffmpeg] frame=${Math.round(job.progress * 18)} fps=${job.fps} speed=${job.speed}x`
      job.logs.push(line)
      emit('queue:log', { jobId: job.id, line })
    }
    queueChanged()
    if (job.progress >= 100) {
      clearInterval(interval)
      timers.delete(job.id)
      job.state = 'done'
      job.finishedAt = now()
      job.metrics = { avgFps: job.fps, encodedFrames: 1842, durationMs: 18_400, outputBytes: 148_000_000, speed: job.speed }
      job.logs.push(`[queue] completato (mock encoder)`)
      emit('queue:changed', { jobs: [...jobs], stats: stats() })
      emit('toast', { kind: 'success', message: `Render completato: ${job.name}` })
    }
  }, 700)
  timers.set(job.id, interval)
}

setTimeout(() => {
  const first = jobs.find((j) => j.state === 'queued')
  if (first) startSim(first)
}, 4000)

const logs = [
  { id: 1, at: now(), level: 'info' as const, scope: 'main', message: 'MoliCut 0.1.0 starting (win32-x64) — modalità demo browser' },
  { id: 2, at: now(), level: 'info' as const, scope: 'hardware', message: 'scan complete: cpu=AMD Ryzen 9 7950X gpu=NVIDIA GeForce RTX 4070 backend=nvenc' },
  { id: 3, at: now(), level: 'warn' as const, scope: 'deps', message: 'checksum SHA-256 non pinnato per ffmpeg (win32-x64)' },
  { id: 4, at: now(), level: 'info' as const, scope: 'queue', message: 'restored 2 jobs, concurrency=1' },
  { id: 5, at: now(), level: 'error' as const, scope: 'media', message: 'proxy failed for med_drone: FFmpeg non disponibile (demo)' }
]

const profile: HardwareProfile = {
  hardwareHash: 'demo-hardware-hash',
  scannedAt: now(),
  platform: 'win32',
  arch: 'x64',
  cpu: {
    manufacturer: 'AMD',
    brand: 'Ryzen 9 7950X 16-Core Processor',
    cores: 32,
    physicalCores: 16,
    speedGHz: 4.5,
    flags: ['avx2', 'avx512', 'fma', 'sse4_2']
  },
  memoryTotalGB: 64,
  memoryFreeGB: 38.4,
  gpus: [
    { model: 'NVIDIA GeForce RTX 4070', vendor: 'NVIDIA', vramMB: 12282, driverVersion: '560.94', api: ['CUDA', 'Vulkan', 'DX12', 'OpenCL'] }
  ],
  disks: [
    { mount: 'C:', fs: 'NTFS', sizeGB: 1863, freeGB: 612, kind: 'ssd' },
    { mount: 'D:', fs: 'NTFS', sizeGB: 3726, freeGB: 1204, kind: 'hdd' }
  ],
  os: { platform: 'win32', distro: 'Windows 11 Pro', release: '10.0.26100', kernel: '10.0.26100', build: '26100' },
  encoders: [
    { id: 'nvenc', name: 'NVIDIA NVENC', vendor: 'nvidia', available: true, codecs: ['h264', 'hevc', 'av1'], testedOk: true, testDetail: 'Encode 1s ok, 214 fps' },
    { id: 'qsv', name: 'Intel Quick Sync', vendor: 'intel', available: false, codecs: [], testedOk: null, testDetail: null },
    { id: 'amf', name: 'AMD AMF', vendor: 'amd', available: false, codecs: [], testedOk: null, testDetail: null },
    { id: 'software', name: 'Software (CPU)', vendor: 'software', available: true, codecs: ['h264', 'hevc', 'av1', 'vp9'], testedOk: true, testDetail: null }
  ],
  hwaccels: ['cuda', 'dxva2', 'qsv'],
  acceleration: {
    preferredBackend: 'nvenc',
    hardwareAvailable: true,
    webgpu: true,
    webgl2: true,
    recommendedConcurrency: 2,
    notes: ['Backend preferito: nvenc. Selezione automatica all’avvio; override manuale nelle Impostazioni.', 'GPU presente ma senza encoder supportati da FFmpeg su questa build.']
  }
}

const deps = [
  { id: 'ffmpeg', name: 'FFmpeg', required: true, path: 'C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut\\bin\\ffmpeg.exe', version: 'ffmpeg version 7.1', expectedSha256: null, actualSha256: 'a7c4d1e9f832bc0091d9c0d1c7e2b7a1b2c3d4e5f60718293a4b5c6d7e8f9012', status: 'ok' as const, detail: 'Firma SHA-256 verificata (a7c4d1e9f832…).' },
  { id: 'ffprobe', name: 'FFprobe', required: true, path: 'C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut\\bin\\ffprobe.exe', version: 'ffprobe version 7.1', expectedSha256: null, actualSha256: 'b1c2d3e4f5061728394a5b6c7d8e9f00112233445566778899aabbccddeeff00', status: 'ok' as const, detail: 'Firma SHA-256 verificata.' },
  { id: 'sqlite', name: 'SQLite (better-sqlite3 / sql.js)', required: false, path: null, version: 'better-sqlite3', expectedSha256: null, actualSha256: null, status: 'ok' as const, detail: 'Driver nativo attivo.' }
]

const invokeMock = async (channel: string, payload: any): Promise<IpcResult<unknown>> => {
  await new Promise((r) => setTimeout(r, 60))
  switch (channel) {
    case 'app:info':
      return ok({
        name: 'MoliCut',
        version: '0.1.0-demo',
        electron: '33.4.11',
        chrome: '130.0.6723.191',
        node: '20.18.1',
        platform: 'win32',
        arch: 'x64',
        userDataPath: 'C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut',
        isPackaged: false,
        recoveredFromCrash: false,
        ffmpegAvailable: true,
        dbDriver: 'better-sqlite3'
      })
    case 'settings:get':
      return ok({ settings })
    case 'settings:set':
      settings = { ...settings, ...payload.patch, shortcuts: { ...settings.shortcuts, ...(payload.patch.shortcuts ?? {}) } }
      emit('settings:changed', { settings })
      return ok({ settings })
    case 'settings:reset':
      settings = { ...defaultSettings }
      return ok({ settings })
    case 'project:new':
      project = demoProject()
      project.name = payload.name
      return ok({ project })
    case 'project:open':
    case 'project:openDialog':
      return ok({ project, path: 'C:\\Projects\\MoliCut Demo.mcut', canceled: false })
    case 'project:save':
      project = { ...payload.project, modifiedAt: now() }
      return ok({ path: payload.path ?? 'C:\\Projects\\MoliCut Demo.mcut', savedAt: now(), canceled: false })
    case 'project:autosave':
      project = payload.project
      return ok({ path: 'C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut\\projects\\demo.autosave.mcut', savedAt: now() })
    case 'project:recoverAutosave':
      return ok(null)
    case 'project:recent':
      return ok({ items: ['C:\\Projects\\MoliCut Demo.mcut', 'C:\\Projects\\Client_Spot.mcut'] })
    case 'project:exportInterchange':
      return ok({ path: `C:\\Exports\\sequence.${payload.format}`, canceled: false })
    case 'media:importDialog':
    case 'media:importPaths': {
      const pool = demoAssets.filter((a) => !project.media.some((m) => m.id === a.id))
      const added = pool.slice(0, Math.min(2, pool.length))
      if (added.length === 0) {
        return ok({ assets: [deliveryAsset()], canceled: false })
      }
      project = { ...project, media: [...project.media, ...added.map((a) => ({ ...a }))] }
      return ok({ assets: added, canceled: false })
    }
    case 'media:probe':
      return ok({ asset: demoAssets.find((a) => a.path === payload.path) ?? deliveryAsset() })
    case 'media:thumbnail': {
      const asset = project.media.find((a) => a.path === payload.path) ?? demoAssets[0]!
      return ok({ dataUrl: artwork(asset.id, asset.name), fromCache: true })
    }
    case 'media:waveform': {
      const buckets = payload.buckets ?? 512
      const peaks = Array.from({ length: buckets }, (_, i) => Math.abs(Math.sin(i / 7) * 0.65 + Math.sin(i / 31) * 0.3) * (i % 23 === 0 ? 0.9 : 0.8))
      return ok({ peaks, durationSec: 42 })
    }
    case 'media:relink': {
      project = {
        ...project,
        media: project.media.map((m) => (m.id === payload.assetId ? { ...m, path: payload.newPath, status: 'online' as const } : m))
      }
      return ok({ asset: project.media.find((m) => m.id === payload.assetId) ?? deliveryAsset() })
    }
    case 'media:chooseRelink': {
      const asset = { ...(project.media.find((m) => m.id === payload.assetId) ?? deliveryAsset()), path: 'D:\\Relink\\media_ricollegato.mp4', status: 'online' as const }
      project = { ...project, media: project.media.map((m) => (m.id === payload.assetId ? asset : m)) }
      return ok({ asset, canceled: false })
    }
    case 'media:missing':
      return ok({ missing: [] })
    case 'queue:list':
      return ok({ jobs: [...jobs], stats: stats(), concurrency: settings.maxConcurrentJobs })
    case 'queue:add': {
      const created = payload.items.map((item: any) => {
        if (item.timeline) {
          const seq = item.timeline.project.sequences.find((entry: any) => entry.id === item.timeline.sequenceId)
          const job = makeJob(`${item.timeline.project.name}_${seq?.name ?? 'Timeline'}`, item.presetId, 'queued')
          job.timeline = item.timeline
          job.sequenceId = item.timeline.sequenceId
          job.name = item.name ?? `${item.timeline.project.name} — ${seq?.name ?? 'Timeline'} → ${job.preset.name}`
          job.outputPath = `C:\\Videos\\MoliCut\\${job.name.replace(/[\\/:*?"<>|]+/g, '-')}.mp4`
          job.durationSec = item.durationSec ?? 30
          return job
        }
        return makeJob(item.sourcePath, item.presetId, 'queued')
      })
      jobs.push(...created)
      queueChanged()
      setTimeout(() => {
        const next = jobs.find((j) => j.state === 'queued' && !timers.has(j.id))
        if (next) startSim(next)
      }, 600)
      return ok({ jobs: created })
    }
    case 'queue:action': {
      const job = jobs.find((j) => j.id === payload.jobId)
      switch (payload.action) {
        case 'pause':
          jobs.forEach((j) => {
            if (j.state === 'queued' || j.state === 'running') {
              if (j.id === payload.jobId || !payload.jobId) {
                if (timers.has(j.id)) {
                  clearInterval(timers.get(j.id))
                  timers.delete(j.id)
                }
                j.state = payload.jobId ? 'paused' : 'paused'
              }
            }
          })
          break
        case 'resume':
          jobs.forEach((j) => {
            if (j.state === 'paused') {
              j.state = 'queued'
            }
          })
          setTimeout(() => {
            const next = jobs.find((j) => j.state === 'queued')
            if (next) startSim(next)
          }, 400)
          break
        case 'pause-all':
          jobs.forEach((j) => {
            if (j.state === 'queued' || j.state === 'running') j.state = 'paused'
            if (timers.has(j.id)) {
              clearInterval(timers.get(j.id))
              timers.delete(j.id)
            }
          })
          break
        case 'resume-all':
          jobs.forEach((j) => {
            if (j.state === 'paused') j.state = 'queued'
          })
          setTimeout(() => {
            const next = jobs.find((j) => j.state === 'queued')
            if (next) startSim(next)
          }, 300)
          break
        case 'cancel':
          if (job) {
            if (timers.has(job.id)) clearInterval(timers.get(job.id))
            timers.delete(job.id)
            job.state = 'canceled'
            job.finishedAt = now()
          }
          break
        case 'retry':
          if (job) {
            job.state = 'queued'
            job.progress = 0
            job.error = null
            setTimeout(() => startSim(job), 300)
          }
          break
        case 'remove':
          if (job) {
            if (timers.has(job.id)) clearInterval(timers.get(job.id))
            timers.delete(job.id)
            jobs.splice(jobs.indexOf(job), 1)
          }
          break
        case 'duplicate':
          if (job) {
            const copy = { ...structuredClone(job), id: uid('job'), state: 'queued' as const, progress: 0, attempts: 0, finishedAt: null }
            jobs.push(copy)
          }
          break
        case 'clear-finished':
          for (let i = jobs.length - 1; i >= 0; i--) {
            if (jobs[i]!.state === 'done' || jobs[i]!.state === 'canceled') jobs.splice(i, 1)
          }
          break
      }
      queueChanged()
      return ok({ jobs: [...jobs] })
    }
    case 'queue:reorder': {
      const from = jobs.findIndex((j) => j.id === payload.jobId)
      if (from >= 0) {
        const [moved] = jobs.splice(from, 1)
        if (moved) jobs.splice(payload.toIndex, 0, moved)
      }
      return ok({ jobs: [...jobs] })
    }
    case 'queue:setPriority': {
      const job = jobs.find((j) => j.id === payload.jobId)
      if (job) job.priority = payload.priority
      return ok({ jobs: [...jobs] })
    }
    case 'queue:setConcurrency':
      settings = { ...settings, maxConcurrentJobs: payload.value }
      return ok({ jobs: [...jobs] })
    case 'queue:openWindow':
      emit('toast', { kind: 'info', message: 'In Electron la Render Queue è una finestra separata (tray).' })
      return ok({ ok: true })
    case 'queue:exportReport':
      return ok({ path: `C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut\\molicut-report.${payload.format}`, canceled: false })
    case 'presets:list':
      return ok({ presets })
    case 'presets:save': {
      const existing = presets.findIndex((p) => p.id === payload.preset.id)
      if (existing >= 0) presets[existing] = payload.preset
      else presets.push(payload.preset)
      return ok({ preset: payload.preset })
    }
    case 'presets:delete':
      presets = presets.filter((p) => p.id !== payload.id || p.builtin)
      return ok({ presets })
    case 'presets:export':
      return ok({ path: 'C:\\Users\\%USER%\\molicut-presets.json', canceled: false })
    case 'presets:import':
      return ok({ presets: [], canceled: false })
    case 'presets:suggest': {
      const asset: MediaAsset = payload.asset
      return ok({ presets: presets.filter((p) => (asset.kind === 'audio' ? p.video.codec === 'none' : p.video.codec !== 'none')).slice(0, 3) })
    }
    case 'watch:list':
      return ok({ folders })
    case 'watch:add':
      folders = [...folders, { ...payload.folder, id: uid('wf'), createdAt: now() }]
      return ok({ folder: folders[folders.length - 1] })
    case 'watch:update':
      folders = folders.map((f) => (f.id === payload.folder.id ? payload.folder : f))
      return ok({ folder: payload.folder })
    case 'watch:remove':
      folders = folders.filter((f) => f.id !== payload.id)
      return ok({ folders })
    case 'watch:logs':
      return ok({
        logs: [
          { at: now(), folderId: 'wf_demo', level: 'info' as const, message: '[dry-run] queue → clip_001.mp4 (preset YouTube 1080p)', file: 'C:\\Watch\\Incoming\\clip_001.mp4' },
          { at: now(), folderId: 'wf_demo', level: 'warn' as const, message: 'Output esistente, skip per policy' }
        ].slice(0, payload.limit ?? 200)
      })
    case 'watch:test':
      return ok({ matches: ['C:\\Watch\\Incoming\\clip_001.mp4', 'C:\\Watch\\Incoming\\interview_final.mov'], scanned: 8 })
    case 'system:profile':
      return ok({ profile })
    case 'system:scan': {
      for (const [stage, percent, message] of [
        ['cpu', 10, 'Lettura CPU e memoria'],
        ['gpu', 30, 'Rilevamento GPU'],
        ['ffmpeg', 55, 'Interrogazione FFmpeg'],
        ['strategy', 80, 'Calcolo strategia di accelerazione'],
        ['done', 100, 'Scansione completata']
      ] as const) {
        emit('scan:progress', { stage, percent, message })
        await new Promise((r) => setTimeout(r, 160))
      }
      return ok({ profile: { ...profile, scannedAt: now() } })
    }
    case 'system:benchmark':
      await new Promise((r) => setTimeout(r, 900))
      return ok({
        at: now(),
        cpuScore: 2840,
        gpuScore: null,
        diskReadMBs: 3120,
        diskWriteMBs: 2210,
        renderFps: 486,
        durationMs: 2100,
        details: [
          'CPU hash: 18422 ops in 450ms, avg 0.024ms, p95 0.031ms',
          'Disco: 2210 MB/s write, 3120 MB/s read (32 MB)',
          'Encode CPU 1080p: 486 fps (libx264 veryfast)'
        ]
      })
    case 'system:testEncoder':
      await new Promise((r) => setTimeout(r, 700))
      return ok({ encoderId: payload.encoderId, ok: true, encodeFps: 214, detail: 'Encode 1s completato in 640ms', durationMs: 640 })
    case 'deps:status':
      return ok({ dependencies: deps })
    case 'deps:download':
      return ok({ dependencies: deps, detail: 'Demo: download disabilitato nel browser.' })
    case 'debug:logs':
      return ok({ logs: payload.level ? logs.filter((l) => l.level === payload.level) : logs })
    case 'debug:clientError':
      logs.unshift({ id: logs.length + 1, at: now(), level: 'error' as const, scope: payload.source ?? 'renderer', message: payload.message })
      return ok({ ok: true })
    case 'debug:ipcStats':
      return ok({
        channels: [
          { channel: 'queue:list', calls: 84, errors: 0, avgMs: 1.2, lastMs: 0.8, lastAt: now() },
          { channel: 'media:thumbnail', calls: 31, errors: 1, avgMs: 12.4, lastMs: 9.1, lastAt: now() },
          { channel: 'settings:get', calls: 12, errors: 0, avgMs: 0.4, lastMs: 0.3, lastAt: now() },
          { channel: 'system:scan', calls: 3, errors: 0, avgMs: 842, lastMs: 796, lastAt: now() }
        ],
        totalCalls: 130,
        totalErrors: 1
      })
    case 'debug:metrics':
      return ok({
        at: now(),
        cpuPercent: 18 + Math.random() * 22,
        memoryUsedMB: 2860 + Math.random() * 240,
        memoryTotalMB: 65536,
        gpuPercent: 42 + Math.random() * 18,
        renderCacheMB: 184,
        activeWorkers: jobs.filter((j) => j.state === 'running').length,
        previewFps: 59.9,
        droppedFrames: 0
      })
    case 'debug:action':
      return ok({ ok: true, detail: `Azione "${payload.action}" eseguita (mock).` })
    case 'debug:bundle':
      return ok({ path: 'C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut\\diagnostics\\molicut-diagnostic.zip' })
    case 'window:control':
      return ok({ ok: true })
    case 'shell:reveal':
      return ok({ ok: true })
    case 'updater:check':
      return ok({ status: 'disabled', message: 'Updater attivo solo nei pacchetti firmati' })
    case 'updater:install':
      return ok({ ok: true })
    case 'plugins:list':
      return ok({ plugins: [] })
    case 'plugins:install':
      return err('NOT_FOUND', 'Installazione plugin disponibile solo in Electron')
    case 'plugins:toggle':
      return ok({ plugins: [] })
    default:
      return err('NOT_FOUND', `Canale non implementato nel mock: ${channel}`)
  }
}

function deliveryAsset(): MediaAsset {
  const id = uid('med')
  return {
    id,
    path: `C:\\Incoming\\nuovo_media_${id.slice(-4)}.mp4`,
    name: `nuovo_media_${id.slice(-4)}.mp4`,
    kind: 'video',
    durationSec: 18,
    width: 1920,
    height: 1080,
    fps: 25,
    codec: 'h264',
    audioCodec: 'aac',
    channels: 2,
    sampleRate: 48000,
    bitrate: 12_000_000,
    colorSpace: 'bt709',
    rotation: 0,
    isHDR: false,
    timecode: null,
    fileSize: 27_000_000,
    proxyPath: null,
    thumbnailPath: null,
    status: 'online',
    importedAt: now()
  }
}

function ok(data: unknown): IpcResult<unknown> {
  return { ok: true, data }
}
function err(code: string, message: string): IpcResult<unknown> {
  return { ok: false, error: { code: code as never, message } }
}

export function createMockBridge(): MolicutBridge {
  return {
    platform: 'win32',
    versions: { electron: '33.4.11', chrome: '130.0.6723.191', node: '20.18.1' },
    isMock: true,
    getPathForFile(file: File): string {
      return (file as File & { path?: string }).path ?? ''
    },
    invoke: invokeMock,
    on(event: string, listener: (payload: unknown) => void): () => void {
      const name = event as EventName
      const set = listeners.get(name) ?? new Set()
      set.add(listener)
      listeners.set(name, set)
      return () => set.delete(listener)
    }
  }
}

export const mockInfo = { artwork, demoAssets }
