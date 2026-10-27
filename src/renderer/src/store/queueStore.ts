import { create } from 'zustand'
import type { AddJobInput, EncodePreset, MediaAsset, QueueJob, WatchFolder, WatchLogEntry } from '@shared/schemas'
import type { QueueStats } from '@shared/ipc'
import { call, on } from '../bridge'

export type QueueFilter = 'all' | 'queued' | 'running' | 'paused' | 'done' | 'error' | 'canceled'

interface QueueState {
  jobs: QueueJob[]
  stats: QueueStats
  concurrency: number
  presets: EncodePreset[]
  folders: WatchFolder[]
  watchLogs: WatchLogEntry[]
  selectedJobId: string | null
  filter: QueueFilter
  search: string
  liveLogs: Record<string, string[]>
  initialized: boolean
  scanning: boolean

  init: () => Promise<void>
  refresh: () => Promise<void>
  selectJob: (id: string | null) => void
  setFilter: (filter: QueueFilter) => void
  setSearch: (search: string) => void
  enqueue: (items: AddJobInput[]) => Promise<void>
  action: (action: 'pause' | 'resume' | 'cancel' | 'retry' | 'remove' | 'duplicate' | 'clear-finished' | 'pause-all' | 'resume-all' | 'stop-after-current', jobId?: string, value?: boolean) => Promise<void>
  reorder: (jobId: string, toIndex: number) => Promise<void>
  setPriority: (jobId: string, priority: number) => Promise<void>
  setConcurrency: (value: number) => Promise<void>
  exportReport: (format: 'json' | 'csv') => Promise<void>
  openWindow: () => Promise<void>
  loadPresets: () => Promise<void>
  suggestFor: (asset: MediaAsset) => Promise<EncodePreset[]>
  loadWatch: () => Promise<void>
  addFolder: (folder: Omit<WatchFolder, 'id' | 'createdAt'>) => Promise<void>
  updateFolder: (folder: WatchFolder) => Promise<void>
  removeFolder: (id: string) => Promise<void>
  testFolder: (id: string) => Promise<{ matches: string[]; scanned: number }>
  loadWatchLogs: () => Promise<void>
  importPresets: () => Promise<void>
  exportPresets: () => Promise<void>
}

const emptyStats: QueueStats = {
  queued: 0,
  running: 0,
  paused: 0,
  done: 0,
  error: 0,
  canceled: 0,
  total: 0,
  progress: 0,
  aggregateFps: 0
}

let subscribed = false

export const useQueueStore = create<QueueState>((set, get) => ({
  jobs: [],
  stats: emptyStats,
  concurrency: 1,
  presets: [],
  folders: [],
  watchLogs: [],
  selectedJobId: null,
  filter: 'all',
  search: '',
  liveLogs: {},
  initialized: false,
  scanning: false,

  init: async () => {
    if (!subscribed) {
      subscribed = true
      on('queue:changed', ({ jobs, stats }) => {
        set((state) => {
          const liveLogs = { ...state.liveLogs }
          for (const job of jobs) {
            const incoming = job.logs.slice(-300)
            const existing = liveLogs[job.id] ?? []
            if (incoming.length < existing.length || (incoming[0] && existing[0] && incoming[0] !== existing[0])) {
              liveLogs[job.id] = incoming
            } else {
              liveLogs[job.id] = [...existing, ...incoming.slice(existing.length)].slice(-400)
            }
          }
          return { jobs, stats, liveLogs }
        })
      })
      on('queue:progress', ({ jobId, progress, fps, speed, etaSec, sizeBytes }) => {
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, progress, fps, speed, etaSec, sizeBytes } : j))
        }))
      })
      on('queue:log', ({ jobId, line }) => {
        set((state) => ({
          liveLogs: { ...state.liveLogs, [jobId]: [...(state.liveLogs[jobId] ?? []), line].slice(-400) }
        }))
      })
    }
    if (!get().initialized) {
      await Promise.all([get().refresh(), get().loadPresets(), get().loadWatch(), get().loadWatchLogs()])
      set({ initialized: true })
    }
  },

  refresh: async () => {
    const result = await call('queue:list', {})
    set((state) => ({
      jobs: result.jobs,
      stats: result.stats,
      concurrency: result.concurrency,
      liveLogs: {
        ...state.liveLogs,
        ...Object.fromEntries(result.jobs.map((j) => [j.id, state.liveLogs[j.id] ?? j.logs.slice(-300)]))
      }
    }))
  },

  selectJob: (id) => set({ selectedJobId: id }),
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),

  enqueue: async (items) => {
    await call('queue:add', { items })
    await get().refresh()
  },

  action: async (action, jobId, value) => {
    const result = await call('queue:action', { action, jobId, value })
    set({ jobs: result.jobs })
    await get().refresh()
  },

  reorder: async (jobId, toIndex) => {
    const result = await call('queue:reorder', { jobId, toIndex })
    set({ jobs: result.jobs })
  },

  setPriority: async (jobId, priority) => {
    const result = await call('queue:setPriority', { jobId, priority })
    set({ jobs: result.jobs })
  },

  setConcurrency: async (value) => {
    await call('queue:setConcurrency', { value })
    set({ concurrency: value })
    await get().refresh()
  },

  exportReport: async (format) => {
    await call('queue:exportReport', { format })
  },

  openWindow: async () => {
    await call('queue:openWindow', {})
  },

  loadPresets: async () => {
    const { presets } = await call('presets:list', {})
    set({ presets })
  },

  suggestFor: async (asset) => {
    const { presets } = await call('presets:suggest', { asset })
    return presets
  },

  loadWatch: async () => {
    const { folders } = await call('watch:list', {})
    set({ folders })
  },

  addFolder: async (folder) => {
    await call('watch:add', { folder })
    await get().loadWatch()
    await get().loadWatchLogs()
  },

  updateFolder: async (folder) => {
    await call('watch:update', { folder })
    await get().loadWatch()
  },

  removeFolder: async (id) => {
    const { folders } = await call('watch:remove', { id })
    set({ folders })
  },

  testFolder: async (id) => call('watch:test', { id }),

  loadWatchLogs: async () => {
    const { logs } = await call('watch:logs', { limit: 200 })
    set({ watchLogs: logs })
  },

  importPresets: async () => {
    const result = await call('presets:import', {})
    if (!result.canceled) await get().loadPresets()
  },

  exportPresets: async () => {
    await call('presets:export', {})
  }
}))
