import { z } from 'zod'

/**
 * Every shape that crosses a process boundary (IPC), is persisted on disk,
 * or comes from a user file is described here. TypeScript types are inferred
 * from these schemas: one source of truth, no drift between runtime
 * validation and compile-time types.
 */

export const PROJECT_SCHEMA_VERSION = 1 as const

export const idSchema = z.string().min(1).max(96)
export const pathSchema = z
  .string()
  .min(1)
  .max(4096)
  .refine((value) => /^[a-zA-Z]:[\\/]/.test(value) || value.startsWith('/') || value.startsWith('\\\\'), {
    message: 'Il path deve essere assoluto'
  })

export const keyframeSchema = z.object({
  id: idSchema,
  time: z.number().min(0),
  value: z.number(),
  easing: z.enum(['linear', 'easeIn', 'easeOut', 'easeInOut', 'bezier']),
  cubic: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional()
})
export type Keyframe = z.infer<typeof keyframeSchema>

export const transformSchema = z.object({
  x: z.number().min(-100000).max(100000),
  y: z.number().min(-100000).max(100000),
  scale: z.number().min(0.01).max(20),
  rotation: z.number().min(-3600).max(3600),
  opacity: z.number().min(0).max(1)
})
export type Transform = z.infer<typeof transformSchema>

export const effectSchema = z.object({
  id: idSchema,
  type: z.string().min(1).max(80),
  enabled: z.boolean(),
  params: z.record(z.union([z.number(), z.string(), z.boolean()])),
  keyframes: z.record(z.array(keyframeSchema)).optional()
})
export type EffectInstance = z.infer<typeof effectSchema>

export const clipTextSchema = z.object({
  content: z.string().max(2000),
  fontSize: z.number().min(8).max(400),
  color: z.string().max(32),
  align: z.enum(['left', 'center', 'right']),
  /** Normalised position in the sequence frame (0..1). */
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  background: z.boolean()
})
export type ClipText = z.infer<typeof clipTextSchema>

export const clipSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(512),
  trackId: idSchema,
  mediaId: idSchema.nullable(),
  start: z.number().min(0),
  duration: z.number().min(0.001),
  inPoint: z.number().min(0),
  speed: z.number().min(0.05).max(20),
  color: z.string().max(32),
  volume: z.number().min(0).max(4),
  transform: transformSchema,
  effects: z.array(effectSchema).max(128),
  keyframes: z.record(z.array(keyframeSchema)).optional(),
  label: z.string().max(64).optional(),
  nestedSequenceId: idSchema.nullable().optional(),
  // Shared by an imported A/V pair: the picture clip and its audio twin form
  // one edit unit — move/trim/split/delete/duplicate propagate across it.
  linkId: idSchema.optional(),
  // Title/generator clip: mediaId is null and this payload is rendered by the
  // preview overlay and by the timeline export's drawtext chain.
  text: clipTextSchema.optional()
})
export type Clip = z.infer<typeof clipSchema>

export const trackSchema = z.object({
  id: idSchema,
  kind: z.enum(['video', 'audio', 'subtitle', 'adjustment', 'nested']),
  name: z.string().min(1).max(96),
  height: z.number().min(28).max(240),
  mute: z.boolean(),
  solo: z.boolean(),
  locked: z.boolean(),
  volume: z.number().min(0).max(4),
  pan: z.number().min(-1).max(1),
  clips: z.array(clipSchema).max(5000)
})
export type Track = z.infer<typeof trackSchema>

export const markerSchema = z.object({
  id: idSchema,
  time: z.number().min(0),
  label: z.string().max(256),
  color: z.string().max(32)
})
export type Marker = z.infer<typeof markerSchema>

export const sequenceSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(200),
  width: z.number().int().min(16).max(16384),
  height: z.number().int().min(16).max(16384),
  fps: z.number().min(1).max(480),
  duration: z.number().min(0),
  colorSpace: z.enum(['rec709', 'rec2020', 'p3', 'aces']),
  tracks: z.array(trackSchema).max(64),
  markers: z.array(markerSchema).max(500)
})
export type Sequence = z.infer<typeof sequenceSchema>

export const mediaAssetSchema = z.object({
  id: idSchema,
  path: pathSchema,
  name: z.string().min(1).max(512),
  kind: z.enum(['video', 'audio', 'image']),
  durationSec: z.number().min(0),
  width: z.number().int().min(0),
  height: z.number().int().min(0),
  fps: z.number().min(0),
  codec: z.string().max(80),
  audioCodec: z.string().max(80),
  channels: z.number().int().min(0).max(64),
  sampleRate: z.number().int().min(0).max(384000),
  bitrate: z.number().min(0),
  colorSpace: z.string().max(80),
  // Raw ffprobe stream color metadata (matrix/primaries/range), optional for
  // backward compatibility with projects saved before it was recorded.
  colorMatrix: z.string().max(80).optional(),
  colorPrimaries: z.string().max(80).optional(),
  colorRange: z.string().max(20).optional(),
  rotation: z.number().min(-360).max(360),
  isHDR: z.boolean(),
  timecode: z.string().max(80).nullable(),
  fileSize: z.number().min(0),
  proxyPath: z.string().max(4096).nullable(),
  thumbnailPath: z.string().max(4096).nullable(),
  status: z.enum(['online', 'offline', 'processing', 'error']),
  importedAt: z.string()
})
export type MediaAsset = z.infer<typeof mediaAssetSchema>

export const projectSchema = z.object({
  schemaVersion: z.literal(PROJECT_SCHEMA_VERSION),
  id: idSchema,
  name: z.string().min(1).max(200),
  createdAt: z.string(),
  modifiedAt: z.string(),
  activeSequenceId: idSchema,
  sequences: z.array(sequenceSchema).min(1).max(64),
  media: z.array(mediaAssetSchema).max(10000),
  notes: z.string().max(20000).optional()
})
export type Project = z.infer<typeof projectSchema>

/* ------------------------------------------------------------------ */
/* Encoding presets                                                    */
/* ------------------------------------------------------------------ */

export const videoCodecSchema = z.enum(['h264', 'hevc', 'av1', 'vp9', 'prores', 'dnxhr', 'gif', 'png', 'mjpeg', 'none'])
export const encoderPolicySchema = z.enum(['auto', 'hardware', 'software'])
export const colorSpaceSchema = z.enum(['rec709', 'rec2020', 'p3', 'aces'])
export const hdrSchema = z.enum(['none', 'hdr10', 'hlg'])

export const videoSettingsSchema = z.object({
  codec: videoCodecSchema,
  encoderPolicy: encoderPolicySchema,
  width: z.number().int().min(16).max(16384).nullable(),
  height: z.number().int().min(16).max(16384).nullable(),
  fps: z.number().min(1).max(480).nullable(),
  bitrateMode: z.enum(['cbr', 'vbr', 'crf']),
  bitrateKbps: z.number().int().min(64).max(800000),
  crf: z.number().int().min(0).max(63),
  gopSeconds: z.number().min(0.1).max(30),
  preset: z.string().max(32),
  profile: z.string().max(32).nullable(),
  pixelFormat: z.string().max(32),
  colorSpace: colorSpaceSchema,
  hdr: hdrSchema,
  hdrMastering: z
    .object({
      maxLuminance: z.number().min(1).max(10000),
      minLuminance: z.number().min(0).max(1),
      maxCLL: z.number().min(0).max(10000),
      maxFALL: z.number().min(0).max(10000)
    })
    .optional()
})
export type VideoSettings = z.infer<typeof videoSettingsSchema>

export const audioSettingsSchema = z.object({
  codec: z.enum(['aac', 'mp3', 'pcm_s16le', 'pcm_s24le', 'opus', 'none']),
  bitrateKbps: z.number().int().min(32).max(8192),
  channels: z.number().int().min(1).max(32),
  sampleRate: z.number().int().min(8000).max(384000),
  loudness: z.object({
    enabled: z.boolean(),
    targetLufs: z.number().min(-40).max(0),
    truePeakDb: z.number().min(-9).max(0),
    lra: z.number().min(1).max(50)
  })
})
export type AudioSettings = z.infer<typeof audioSettingsSchema>

export const filterSettingsSchema = z.object({
  lut: z.string().max(4096).nullable(),
  burnSubtitles: z.boolean(),
  subtitlePath: z.string().max(4096).nullable(),
  scaleMode: z.enum(['fit', 'fill', 'stretch']),
  colorConversion: z.boolean()
})
export type FilterSettings = z.infer<typeof filterSettingsSchema>

export const encodePresetSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(120),
  description: z.string().max(2000),
  container: z.enum(['mp4', 'mov', 'mkv', 'webm', 'wav', 'mp3', 'gif', 'image2']),
  video: videoSettingsSchema,
  audio: audioSettingsSchema,
  filters: filterSettingsSchema,
  output: z.object({ suffix: z.string().max(64), directory: z.string().max(4096).nullable() }),
  tags: z.array(z.string().max(32)).max(20),
  version: z.number().int().min(1),
  builtin: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
})
export type EncodePreset = z.infer<typeof encodePresetSchema>

/* ------------------------------------------------------------------ */
/* Render queue                                                        */
/* ------------------------------------------------------------------ */

export const jobStateSchema = z.enum(['queued', 'running', 'paused', 'done', 'error', 'canceled'])
export type JobState = z.infer<typeof jobStateSchema>

export const jobMetricsSchema = z.object({
  avgFps: z.number().min(0),
  encodedFrames: z.number().min(0),
  durationMs: z.number().min(0),
  outputBytes: z.number().min(0),
  speed: z.number().min(0)
})
export type JobMetrics = z.infer<typeof jobMetricsSchema>

export const queueJobSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(300),
  sourcePath: pathSchema,
  sourceMediaId: idSchema.nullable(),
  sequenceId: idSchema.nullable(),
  /** Set for timeline exports: the exact project snapshot to render. */
  timeline: z
    .object({
      project: projectSchema,
      sequenceId: idSchema
    })
    .nullable()
    .optional(),
  preset: encodePresetSchema,
  outputPath: pathSchema,
  durationSec: z.number().min(0),
  hasAudio: z.boolean(),
  state: jobStateSchema,
  priority: z.number().int().min(0).max(100),
  progress: z.number().min(0).max(100),
  fps: z.number().min(0),
  speed: z.number().min(0),
  etaSec: z.number().min(0),
  sizeBytes: z.number().min(0),
  attempts: z.number().int().min(0),
  maxRetries: z.number().int().min(0).max(20),
  error: z.string().max(8000).nullable(),
  logs: z.array(z.string().max(4000)).max(2000),
  groupId: z.string().max(96).nullable(),
  metrics: jobMetricsSchema,
  createdAt: z.string(),
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  nextAttemptAt: z.string().nullable()
})
export type QueueJob = z.infer<typeof queueJobSchema>

export const addJobInputSchema = z.object({
  sourcePath: pathSchema.optional(),
  name: z.string().min(1).max(300).optional(),
  mediaId: idSchema.nullable().optional(),
  sequenceId: idSchema.nullable().optional(),
  /** Timeline export: render the whole sequence instead of a single media file. */
  timeline: z
    .object({
      project: projectSchema,
      sequenceId: idSchema
    })
    .optional(),
  presetId: idSchema.optional(),
  preset: encodePresetSchema.optional(),
  outputPath: pathSchema.optional(),
  durationSec: z.number().min(0).optional(),
  hasAudio: z.boolean().optional(),
  priority: z.number().int().min(0).max(100).default(50),
  groupId: z.string().max(96).nullable().optional(),
  maxRetries: z.number().int().min(0).max(20).default(3)
})
export type AddJobInput = z.infer<typeof addJobInputSchema>

/* ------------------------------------------------------------------ */
/* Watch folders                                                       */
/* ------------------------------------------------------------------ */

export const watchFolderSchema = z.object({
  id: idSchema,
  path: pathSchema,
  presetId: idSchema,
  outputDir: pathSchema,
  enabled: z.boolean(),
  recursive: z.boolean(),
  extensions: z.array(z.string().max(16)).min(1).max(40),
  namePattern: z.string().max(300).nullable(),
  excludePattern: z.string().max(300).nullable(),
  stabilityMs: z.number().int().min(500).max(120000),
  action: z.enum(['queue', 'proxy', 'ignore']),
  conflict: z.enum(['suffix', 'overwrite', 'skip']),
  dryRun: z.boolean(),
  createdAt: z.string()
})
export type WatchFolder = z.infer<typeof watchFolderSchema>

export const watchLogSchema = z.object({
  at: z.string(),
  folderId: idSchema,
  level: z.enum(['info', 'warn', 'error']),
  message: z.string().max(2000),
  file: z.string().max(4096).optional()
})
export type WatchLogEntry = z.infer<typeof watchLogSchema>

/* ------------------------------------------------------------------ */
/* Hardware / system                                                   */
/* ------------------------------------------------------------------ */

export const hardwareEncoderSchema = z.object({
  id: z.string().max(40),
  name: z.string().max(120),
  vendor: z.enum(['nvidia', 'amd', 'intel', 'apple', 'software']),
  available: z.boolean(),
  codecs: z.array(z.string().max(32)),
  testedOk: z.boolean().nullable(),
  testDetail: z.string().max(2000).nullable()
})
export type HardwareEncoder = z.infer<typeof hardwareEncoderSchema>

export const gpuInfoSchema = z.object({
  model: z.string().max(200),
  vendor: z.string().max(100),
  vramMB: z.number().min(0),
  driverVersion: z.string().max(80),
  api: z.array(z.string().max(24))
})
export type GpuInfo = z.infer<typeof gpuInfoSchema>

export const diskInfoSchema = z.object({
  mount: z.string().max(40),
  fs: z.string().max(32),
  sizeGB: z.number().min(0),
  freeGB: z.number().min(0),
  kind: z.enum(['ssd', 'hdd', 'unknown'])
})
export type DiskInfo = z.infer<typeof diskInfoSchema>

export const hardwareProfileSchema = z.object({
  hardwareHash: z.string(),
  scannedAt: z.string(),
  platform: z.string(),
  arch: z.string(),
  cpu: z.object({
    manufacturer: z.string(),
    brand: z.string(),
    cores: z.number(),
    physicalCores: z.number(),
    speedGHz: z.number(),
    flags: z.array(z.string().max(32))
  }),
  memoryTotalGB: z.number(),
  memoryFreeGB: z.number(),
  gpus: z.array(gpuInfoSchema),
  disks: z.array(diskInfoSchema),
  os: z.object({
    platform: z.string(),
    distro: z.string(),
    release: z.string(),
    kernel: z.string(),
    build: z.string()
  }),
  encoders: z.array(hardwareEncoderSchema),
  hwaccels: z.array(z.string().max(40)),
  acceleration: z.object({
    preferredBackend: z.string().max(40),
    hardwareAvailable: z.boolean(),
    webgpu: z.boolean(),
    webgl2: z.boolean(),
    recommendedConcurrency: z.number().int().min(1).max(16),
    notes: z.array(z.string().max(500)).max(40)
  })
})
export type HardwareProfile = z.infer<typeof hardwareProfileSchema>

export const dependencyStatusSchema = z.object({
  id: z.string().max(40),
  name: z.string().max(120),
  required: z.boolean(),
  path: z.string().max(4096).nullable(),
  version: z.string().max(120).nullable(),
  expectedSha256: z.string().max(128).nullable(),
  actualSha256: z.string().max(128).nullable(),
  status: z.enum(['ok', 'missing', 'corrupt', 'unsupported']),
  detail: z.string().max(2000)
})
export type DependencyStatus = z.infer<typeof dependencyStatusSchema>

export const logEntrySchema = z.object({
  id: z.number(),
  at: z.string(),
  level: z.enum(['debug', 'info', 'warn', 'error']),
  scope: z.string().max(64),
  message: z.string().max(8000)
})
export type LogEntry = z.infer<typeof logEntrySchema>

export const metricsSnapshotSchema = z.object({
  at: z.string(),
  cpuPercent: z.number(),
  memoryUsedMB: z.number(),
  memoryTotalMB: z.number(),
  gpuPercent: z.number().nullable(),
  renderCacheMB: z.number(),
  activeWorkers: z.number(),
  previewFps: z.number(),
  droppedFrames: z.number()
})
export type MetricsSnapshot = z.infer<typeof metricsSnapshotSchema>

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export const settingsSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']),
  accent: z.string().max(24),
  language: z.enum(['it', 'en']),
  hardwareOverride: z.enum(['auto', 'nvidia', 'amd', 'intel', 'apple', 'vaapi', 'software']),
  previewQuality: z.enum(['auto', 'quarter', 'half', 'full']),
  maxConcurrentJobs: z.number().int().min(1).max(16),
  queueMaxJobs: z.number().int().min(10).max(10000),
  queueRetentionDays: z.number().int().min(1).max(365),
  cpuLimitPercent: z.number().int().min(10).max(100),
  memoryLimitMB: z.number().int().min(512).max(262144),
  cacheSizeMB: z.number().int().min(256).max(1048576),
  notifications: z.boolean(),
  startMinimized: z.boolean(),
  runAtLogin: z.boolean(),
  shutdownAfterQueue: z.boolean(),
  watchEnabled: z.boolean(),
  autosaveSeconds: z.number().int().min(5).max(600),
  telemetry: z.literal(false),
  safeMode: z.boolean(),
  /** When true and a GPU encoder exists, export never falls back to CPU. */
  gpuOnly: z.boolean().default(true),
  shortcuts: z.record(z.string().max(40)),
  recentProjects: z.array(z.string().max(4096)).max(12)
})
export type AppSettings = z.infer<typeof settingsSchema>

export const defaultSettings: AppSettings = {
  theme: 'dark',
  accent: '#4f8dff',
  language: 'it',
  hardwareOverride: 'auto',
  previewQuality: 'auto',
  maxConcurrentJobs: 1,
  queueMaxJobs: 500,
  queueRetentionDays: 30,
  cpuLimitPercent: 85,
  memoryLimitMB: 8192,
  cacheSizeMB: 4096,
  notifications: true,
  startMinimized: false,
  runAtLogin: false,
  shutdownAfterQueue: false,
  watchEnabled: true,
  autosaveSeconds: 120,
  telemetry: false,
  safeMode: false,
  gpuOnly: true,
  shortcuts: {
    'command.palette': 'Ctrl+Shift+P',
    'debug.panel': 'Ctrl+Shift+D',
    'timeline.split': 'Ctrl+K',
    'timeline.rippleDelete': 'Shift+Delete',
    'timeline.addTitle': 'T',
    'timeline.snap': 'S',
    'timeline.delete': 'Delete',
    'playback.playPause': 'Space',
    'project.save': 'Ctrl+S',
    'project.saveAs': 'Ctrl+Shift+S',
    'export.dialog': 'Ctrl+M',
    'queue.window': 'Ctrl+Shift+Q'
  },
  recentProjects: []
}
