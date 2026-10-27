import { z } from 'zod'
import { EVENT_NAME_LIST, IPC_CHANNEL_LIST } from './channelList'
import {
  addJobInputSchema,
  encodePresetSchema,
  hardwareProfileSchema,
  logEntrySchema,
  mediaAssetSchema,
  metricsSnapshotSchema,
  pathSchema,
  projectSchema,
  queueJobSchema,
  settingsSchema,
  dependencyStatusSchema,
  watchFolderSchema,
  watchLogSchema,
  type AppSettings,
  type QueueJob
} from './schemas'

/**
 * IPC contract. Every channel declares its request schema and its response
 * schema. The main process validates requests with the same schemas, the
 * preload exposes only the channels listed here, and the renderer gets typed
 * call signatures for free. Never add a channel outside this table.
 */

const empty = z.object({}).strict()
const okSchema = z.object({ ok: z.literal(true) })

export const queueStatsSchema = z.object({
  queued: z.number(),
  running: z.number(),
  paused: z.number(),
  done: z.number(),
  error: z.number(),
  canceled: z.number(),
  total: z.number(),
  progress: z.number(),
  aggregateFps: z.number()
})
export type QueueStats = z.infer<typeof queueStatsSchema>

export const appInfoSchema = z.object({
  name: z.string(),
  version: z.string(),
  electron: z.string(),
  chrome: z.string(),
  node: z.string(),
  platform: z.string(),
  arch: z.string(),
  userDataPath: z.string(),
  isPackaged: z.boolean(),
  recoveredFromCrash: z.boolean(),
  ffmpegAvailable: z.boolean(),
  dbDriver: z.string()
})

export const benchmarkResultSchema = z.object({
  at: z.string(),
  cpuScore: z.number(),
  gpuScore: z.number().nullable(),
  diskReadMBs: z.number(),
  diskWriteMBs: z.number(),
  renderFps: z.number().nullable(),
  durationMs: z.number(),
  details: z.array(z.string())
})
export type BenchmarkResult = z.infer<typeof benchmarkResultSchema>

export const encoderTestSchema = z.object({
  encoderId: z.string(),
  ok: z.boolean(),
  encodeFps: z.number().nullable(),
  detail: z.string(),
  durationMs: z.number()
})
export type EncoderTest = z.infer<typeof encoderTestSchema>

export const pluginInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  vendor: z.string(),
  description: z.string(),
  permissions: z.array(z.string()),
  enabled: z.boolean(),
  signed: z.boolean(),
  verified: z.boolean(),
  path: z.string()
})
export type PluginInfo = z.infer<typeof pluginInfoSchema>

export const ipcStatsSchema = z.object({
  channels: z.array(
    z.object({
      channel: z.string(),
      calls: z.number(),
      errors: z.number(),
      avgMs: z.number(),
      lastMs: z.number(),
      lastAt: z.string().nullable()
    })
  ),
  totalCalls: z.number(),
  totalErrors: z.number()
})
export type IpcStats = z.infer<typeof ipcStatsSchema>

export const ipcRoutes = {
  'app:info': { input: empty, output: appInfoSchema },

  'settings:get': { input: empty, output: z.object({ settings: settingsSchema }) },
  'settings:set': {
    input: z.object({ patch: settingsSchema.partial() }),
    output: z.object({ settings: settingsSchema })
  },
  'settings:reset': { input: empty, output: z.object({ settings: settingsSchema }) },

  'project:new': { input: z.object({ name: z.string().min(1).max(200) }), output: z.object({ project: projectSchema }) },
  'project:open': {
    input: z.object({ path: pathSchema.optional() }),
    output: z.object({ project: projectSchema, path: z.string() })
  },
  'project:openDialog': {
    input: empty,
    output: z.object({ canceled: z.boolean(), project: projectSchema.optional(), path: z.string().optional() })
  },
  'project:save': {
    input: z.object({ project: projectSchema, path: pathSchema.optional() }),
    output: z.object({ path: z.string(), savedAt: z.string(), canceled: z.boolean() })
  },
  'project:autosave': {
    input: z.object({ project: projectSchema }),
    output: z.object({ path: z.string(), savedAt: z.string() })
  },
  'project:recoverAutosave': {
    input: empty,
    output: z.object({ project: projectSchema, path: z.string(), savedAt: z.string() }).nullable()
  },
  'project:recent': { input: empty, output: z.object({ items: z.array(z.string()) }) },
  'project:exportInterchange': {
    input: z.object({
      project: projectSchema,
      sequenceId: z.string(),
      format: z.enum(['edl', 'fcpxml', 'xml'])
    }),
    output: z.object({ path: z.string().nullable(), canceled: z.boolean() })
  },

  'media:importDialog': {
    input: z.object({ generateProxies: z.boolean().default(false) }),
    output: z.object({ assets: z.array(mediaAssetSchema), canceled: z.boolean() })
  },
  'media:importPaths': {
    input: z.object({ paths: z.array(pathSchema).min(1).max(200), generateProxies: z.boolean().default(false) }),
    output: z.object({ assets: z.array(mediaAssetSchema) })
  },
  'media:probe': { input: z.object({ path: pathSchema }), output: z.object({ asset: mediaAssetSchema }) },
  'media:thumbnail': {
    input: z.object({ path: pathSchema, timeSec: z.number().min(0).max(86400).default(1) }),
    output: z.object({ dataUrl: z.string(), fromCache: z.boolean() })
  },
  'media:waveform': {
    input: z.object({ path: pathSchema, buckets: z.number().int().min(64).max(16384).default(2048) }),
    output: z.object({ peaks: z.array(z.number()), durationSec: z.number() })
  },
  'media:relink': {
    input: z.object({ assetId: z.string(), newPath: pathSchema }),
    output: z.object({ asset: mediaAssetSchema })
  },
  'media:chooseRelink': {
    input: z.object({ assetId: z.string(), name: z.string().optional() }),
    output: z.object({ asset: mediaAssetSchema.nullable(), canceled: z.boolean() })
  },
  'media:missing': {
    input: z.object({ paths: z.array(pathSchema).max(10000) }),
    output: z.object({ missing: z.array(z.string()) })
  },

  'queue:list': {
    input: empty,
    output: z.object({ jobs: z.array(queueJobSchema), stats: queueStatsSchema, concurrency: z.number() })
  },
  'queue:add': {
    input: z.object({ items: z.array(addJobInputSchema).min(1).max(500) }),
    output: z.object({ jobs: z.array(queueJobSchema) })
  },
  'queue:action': {
    input: z.object({
      action: z.enum([
        'pause',
        'resume',
        'cancel',
        'retry',
        'remove',
        'duplicate',
        'stop-after-current',
        'pause-all',
        'resume-all',
        'clear-finished'
      ]),
      jobId: z.string().optional(),
      value: z.boolean().optional()
    }),
    output: z.object({ jobs: z.array(queueJobSchema) })
  },
  'queue:reorder': {
    input: z.object({ jobId: z.string(), toIndex: z.number().int().min(0).max(100000) }),
    output: z.object({ jobs: z.array(queueJobSchema) })
  },
  'queue:setPriority': {
    input: z.object({ jobId: z.string(), priority: z.number().int().min(0).max(100) }),
    output: z.object({ jobs: z.array(queueJobSchema) })
  },
  'queue:setConcurrency': {
    input: z.object({ value: z.number().int().min(1).max(16) }),
    output: z.object({ jobs: z.array(queueJobSchema) })
  },
  'queue:openWindow': { input: empty, output: okSchema },
  'queue:exportReport': {
    input: z.object({ format: z.enum(['json', 'csv']), jobIds: z.array(z.string()).optional() }),
    output: z.object({ path: z.string(), canceled: z.boolean() })
  },

  'presets:list': { input: empty, output: z.object({ presets: z.array(encodePresetSchema) }) },
  'presets:save': { input: z.object({ preset: encodePresetSchema }), output: z.object({ preset: encodePresetSchema }) },
  'presets:delete': { input: z.object({ id: z.string() }), output: z.object({ presets: z.array(encodePresetSchema) }) },
  'presets:export': {
    input: z.object({ ids: z.array(z.string()).optional() }),
    output: z.object({ path: z.string().nullable(), canceled: z.boolean() })
  },
  'presets:import': {
    input: empty,
    output: z.object({ presets: z.array(encodePresetSchema), canceled: z.boolean() })
  },
  'presets:suggest': {
    input: z.object({ asset: mediaAssetSchema }),
    output: z.object({ presets: z.array(encodePresetSchema) })
  },

  'watch:list': { input: empty, output: z.object({ folders: z.array(watchFolderSchema) }) },
  'watch:add': {
    input: z.object({ folder: watchFolderSchema.omit({ id: true, createdAt: true }) }),
    output: z.object({ folder: watchFolderSchema })
  },
  'watch:update': { input: z.object({ folder: watchFolderSchema }), output: z.object({ folder: watchFolderSchema }) },
  'watch:remove': { input: z.object({ id: z.string() }), output: z.object({ folders: z.array(watchFolderSchema) }) },
  'watch:logs': {
    input: z.object({ limit: z.number().int().min(1).max(1000).default(200) }),
    output: z.object({ logs: z.array(watchLogSchema) })
  },
  'watch:test': {
    input: z.object({ id: z.string() }),
    output: z.object({ matches: z.array(z.string()), scanned: z.number() })
  },

  'system:profile': { input: empty, output: z.object({ profile: hardwareProfileSchema.nullable() }) },
  'system:scan': { input: z.object({ force: z.boolean().default(false) }), output: z.object({ profile: hardwareProfileSchema }) },
  'system:benchmark': { input: empty, output: benchmarkResultSchema },
  'system:testEncoder': {
    input: z.object({ encoderId: z.string(), codec: z.enum(['h264', 'hevc', 'av1']) }),
    output: encoderTestSchema
  },
  'deps:status': { input: empty, output: z.object({ dependencies: z.array(dependencyStatusSchema) }) },
  'deps:download': {
    input: z.object({ component: z.enum(['ffmpeg', 'ffprobe', 'all']) }),
    output: z.object({ dependencies: z.array(dependencyStatusSchema), detail: z.string() })
  },

  'debug:logs': {
    input: z.object({ level: z.enum(['debug', 'info', 'warn', 'error']).optional(), limit: z.number().int().min(1).max(5000).default(500) }),
    output: z.object({ logs: z.array(logEntrySchema) })
  },
  'debug:clientError': {
    input: z.object({
      message: z.string().min(1).max(8000),
      stack: z.string().max(16000).optional(),
      componentStack: z.string().max(16000).optional(),
      source: z.string().max(200).optional()
    }),
    output: okSchema
  },
  'debug:ipcStats': { input: empty, output: ipcStatsSchema },
  'debug:metrics': { input: empty, output: metricsSnapshotSchema },
  'debug:action': {
    input: z.object({
      action: z.enum([
        'reset-cache',
        'regenerate-proxies',
        'flush-shaders',
        'restart-engine',
        'redetect-hardware',
        'repair-queue-db',
        'safe-mode-on',
        'safe-mode-off',
        'clear-logs'
      ]),
      confirmation: z.boolean().optional()
    }),
    output: z.object({ ok: z.boolean(), detail: z.string() })
  },
  'debug:bundle': { input: empty, output: z.object({ path: z.string() }) },

  'window:control': {
    input: z.object({ action: z.enum(['minimize', 'maximize', 'close', 'toggle-devtools', 'open-queue', 'open-editor']) }),
    output: okSchema
  },
  'shell:reveal': { input: z.object({ path: pathSchema }), output: okSchema },

  'updater:check': { input: empty, output: z.object({ status: z.enum(['disabled', 'checking', 'none', 'available', 'error']), version: z.string().optional(), message: z.string().optional() }) },
  'updater:install': { input: empty, output: okSchema },

  'plugins:list': { input: empty, output: z.object({ plugins: z.array(pluginInfoSchema) }) },
  'plugins:install': { input: z.object({ path: pathSchema }), output: z.object({ plugin: pluginInfoSchema }) },
  'plugins:toggle': { input: z.object({ id: z.string(), enabled: z.boolean() }), output: z.object({ plugins: z.array(pluginInfoSchema) }) }
} as const

export type IpcChannel = keyof typeof ipcRoutes
/** Runtime whitelist used by main/preload must stay in sync with the routes. */
export const ROUTE_CHANNELS = IPC_CHANNEL_LIST
export type IpcInput<C extends IpcChannel> = z.infer<(typeof ipcRoutes)[C]['input']>
export type IpcOutput<C extends IpcChannel> = z.infer<(typeof ipcRoutes)[C]['output']>

export const IPC_CHANNELS = Object.keys(ipcRoutes) as IpcChannel[]
const ROUTE_KEYS = Object.keys(ipcRoutes)
if (ROUTE_KEYS.some((channel) => !(IPC_CHANNEL_LIST as readonly string[]).includes(channel))) {
  throw new Error('IPC contract contains channels missing from channelList.ts')
}

/** Response envelope: renderer code never sees raw exceptions. */
export const ipcErrorCodeSchema = z.enum([
  'VALIDATION',
  'UNAUTHORIZED',
  'RATE_LIMITED',
  'NOT_FOUND',
  'CONFLICT',
  'CANCELED',
  'FFMPEG',
  'INTERNAL'
])
export type IpcErrorCode = z.infer<typeof ipcErrorCodeSchema>

export interface IpcError {
  code: IpcErrorCode
  message: string
  details?: unknown
}
export type IpcResult<T> = { ok: true; data: T } | { ok: false; error: IpcError }

/* ------------------------------------------------------------------ */
/* Push events (main -> renderer)                                      */
/* ------------------------------------------------------------------ */

export const eventNames = EVENT_NAME_LIST
export type EventName = (typeof eventNames)[number]

export const eventPayloads = {
  'queue:changed': z.object({ jobs: z.array(queueJobSchema), stats: queueStatsSchema }),
  'queue:progress': z.object({
    jobId: z.string(),
    progress: z.number(),
    fps: z.number(),
    speed: z.number(),
    etaSec: z.number(),
    sizeBytes: z.number()
  }),
  'queue:log': z.object({ jobId: z.string(), line: z.string() }),
  'scan:progress': z.object({ stage: z.string(), percent: z.number(), message: z.string() }),
  toast: z.object({
    kind: z.enum(['info', 'success', 'warn', 'error']),
    message: z.string(),
    action: z.object({ label: z.string(), channel: z.string(), payload: z.unknown() }).optional()
  }),
  log: logEntrySchema,
  metrics: metricsSnapshotSchema,
  'watch:log': watchLogSchema,
  'relink:request': z.object({ mediaId: z.string(), path: z.string() }),
  'updater:status': z.object({ status: z.string(), version: z.string().optional(), message: z.string().optional() }),
  'settings:changed': z.object({ settings: settingsSchema }),
  'media:proxy-ready': z.object({ mediaId: z.string(), proxyPath: z.string() })
} satisfies Record<EventName, z.ZodTypeAny>

export type EventPayload<E extends EventName> = z.infer<(typeof eventPayloads)[E]>

/** Shape exposed by the preload bridge on `window.molicut`. */
export interface MolicutBridge {
  readonly platform: string
  readonly versions: { electron: string; chrome: string; node: string }
  readonly isMock: boolean
  invoke(channel: string, payload: unknown): Promise<IpcResult<unknown>>
  on(event: string, listener: (payload: unknown) => void): () => void
  /** Electron 32+ removed File.path: the preload resolves drop paths via webUtils. */
  getPathForFile(file: File): string
}

export function isSettings(value: unknown): value is AppSettings {
  return settingsSchema.safeParse(value).success
}

export function isQueueJob(value: unknown): value is QueueJob {
  return queueJobSchema.safeParse(value).success
}
