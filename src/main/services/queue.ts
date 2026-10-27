import { existsSync, mkdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import type { AddJobInput, AppSettings, EncodePreset, JobState, QueueJob } from '@shared/schemas'
import { queueJobSchema } from '@shared/schemas'
import { builtinPresets } from '@shared/builtinPresets'
import { roundTo, toCsv, uid } from '@shared/utils'
import { isTransientError, nextAttemptDelay } from '@shared/jobRules'
import { getDb } from './db'
import {
  defaultOutputPath,
  estimateSizeBytes,
  outputExtension,
  safeFileStem,
  uniqueOutputPath
} from './encoder'
import { media } from './media'
import { logger } from './logger'
import { appPaths, defaultExportDir } from './paths'
import { sequenceContentDuration } from '@shared/projectFactory'
import { presets } from './presets'
import { renderEngine, RenderCanceledError, type RenderProgress } from './renderEngine'
import { assertWritablePath } from './security'
import type { QueueStats } from '@shared/ipc'

/**
 * Persistent render queue.
 *
 * Design decisions:
 * - every state transition is written to SQLite before it is broadcast, so a
 *   crash can only ever leave "running" rows, which are safely re-queued;
 * - concurrency is enforced here, not in the UI, so tray/watch/editor all
 *   share one scheduler;
 * - progress is throttled and persisted every 2s (DB churn vs crash precision);
 * - transient failures retry with exponential backoff, permanent ones stop.
 */

export interface QueueEvents {
  changed?: (jobs: QueueJob[], stats: QueueStats) => void
  progress?: (jobId: string, p: RenderProgress) => void
  log?: (jobId: string, line: string) => void
  notify?: (title: string, body: string, kind: 'success' | 'error' | 'info') => void
  fallback?: (message: string) => void
}

export { isTransientError, nextAttemptDelay } from '@shared/jobRules'

interface InternalJob extends QueueJob {
  pauseRequested?: boolean
  cancelRequested?: boolean
}

export class RenderQueue {
  private jobs = new Map<string, InternalJob>()
  private running = new Map<string, AbortController>()
  private concurrency = 1
  private pausedAll = false
  private stopAfterCurrent = false
  private timer: NodeJS.Timeout | null = null
  private lastPersist = new Map<string, number>()
  private started = false
  private settingsProvider: () => AppSettings = () => ({ maxConcurrentJobs: 1 }) as AppSettings
  events: QueueEvents = {}

  init(settings: AppSettings): void {
    this.settingsProvider = () => settings
    this.concurrency = Math.max(1, Math.min(16, settings.maxConcurrentJobs))
    const rows = getDb().prepare('SELECT payload FROM queue_jobs').all<{ payload: string }>()
    this.jobs.clear()
    for (const row of rows) {
      try {
        const parsed = queueJobSchema.safeParse(JSON.parse(row.payload))
        if (!parsed.success) continue
        const job: InternalJob = { ...parsed.data }
        if (job.state === 'running') {
          job.state = 'queued'
          job.startedAt = null
          job.logs.push(`[queue] Ripristino dopo arresto imprevisto, job riaccodato (${new Date().toISOString()})`)
        }
        this.jobs.set(job.id, job)
      } catch {
        logger.warn('queue', 'skipping corrupted job row')
      }
    }
    this.prune(settings)
    this.started = true
    logger.info('queue', `restored ${this.jobs.size} jobs, concurrency=${this.concurrency}`)
    this.broadcast()
    this.schedule()
  }

  setSettings(settings: AppSettings): void {
    this.concurrency = Math.max(1, Math.min(16, settings.maxConcurrentJobs))
    this.settingsProvider = () => settings
    this.schedule()
  }

  setEvents(events: QueueEvents): void {
    this.events = events
  }

  /** Default delivery folder: <Videos>/MoliCut (not userData/exports). */
  private defaultDir(): string {
    return defaultExportDir()
  }

  private save(job: InternalJob): void {
    getDb()
      .prepare(
        'INSERT INTO queue_jobs (id, state, priority, created_at, updated_at, payload) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET state=excluded.state, priority=excluded.priority, updated_at=excluded.updated_at, payload=excluded.payload'
      )
      .run(job.id, job.state, job.priority, job.createdAt, new Date().toISOString(), JSON.stringify(job))
  }

  private removeRow(id: string): void {
    getDb().prepare('DELETE FROM queue_jobs WHERE id = ?').run(id)
  }

  private prune(settings: AppSettings): void {
    const cutoff = Date.now() - settings.queueRetentionDays * 86400_000
    for (const job of [...this.jobs.values()]) {
      if (job.state === 'done' && job.finishedAt && new Date(job.finishedAt).getTime() < cutoff) {
        this.jobs.delete(job.id)
        this.removeRow(job.id)
      }
    }
    if (this.jobs.size > settings.queueMaxJobs) {
      const removable = [...this.jobs.values()]
        .filter((j) => j.state === 'done' || j.state === 'canceled')
        .sort((a, b) => (a.finishedAt ?? a.createdAt).localeCompare(b.finishedAt ?? b.createdAt))
      for (const job of removable) {
        if (this.jobs.size <= settings.queueMaxJobs) break
        this.jobs.delete(job.id)
        this.removeRow(job.id)
      }
    }
  }

  sortedJobs(): QueueJob[] {
    return [...this.jobs.values()].sort((a, b) => {
      const active = Number(b.state === 'running') - Number(a.state === 'running')
      if (active !== 0) return active
      if (b.priority !== a.priority) return b.priority - a.priority
      return a.createdAt.localeCompare(b.createdAt)
    })
  }

  stats(): QueueStats {
    const jobs = [...this.jobs.values()]
    const count = (state: JobState): number => jobs.filter((j) => j.state === state).length
    const runningJobs = jobs.filter((j) => j.state === 'running')
    const aggregateFps = runningJobs.reduce((sum, j) => sum + j.fps, 0)
    const total = jobs.length
    const progress = total === 0 ? 0 : roundTo(jobs.reduce((sum, j) => sum + (j.state === 'done' ? 100 : j.progress), 0) / total, 1)
    return {
      queued: count('queued'),
      running: runningJobs.length,
      paused: count('paused'),
      done: count('done'),
      error: count('error'),
      canceled: count('canceled'),
      total,
      progress,
      aggregateFps: roundTo(aggregateFps, 1)
    }
  }

  private broadcast(): void {
    this.events.changed?.(this.sortedJobs(), this.stats())
  }

  private log(job: InternalJob, line: string): void {
    const clean = line.slice(0, 4000)
    job.logs.push(clean)
    if (job.logs.length > 800) job.logs.splice(0, job.logs.length - 800)
    this.events.log?.(job.id, clean)
  }

  async add(inputs: AddJobInput[], extraOutputRoots: string[] = []): Promise<QueueJob[]> {
    if (!this.started) throw new Error('Coda non inizializzata')
    const created: QueueJob[] = []
    const fallbackPreset = builtinPresets()[0]!
    for (const input of inputs) {
      const preset = input.preset ?? (input.presetId ? presets.get(input.presetId) : undefined) ?? fallbackPreset
      const timeline = input.timeline
      const sequence = timeline
        ? timeline.project.sequences.find((item) => item.id === timeline.sequenceId) ?? null
        : null
      if (timeline && !sequence) throw new Error('Sequenza da esportare non trovata nel progetto')
      if (!timeline && !input.sourcePath) throw new Error('sourcePath richiesto per un job media')
      if (!timeline && input.sourcePath && !existsSync(input.sourcePath)) {
        throw new Error(`Sorgente non trovata: ${input.sourcePath}`)
      }

      let durationSec = input.durationSec ?? 0
      let hasAudio = input.hasAudio ?? false
      let sourcePath = input.sourcePath ?? ''
      if (timeline && sequence) {
        durationSec = durationSec || sequenceContentDuration(sequence)
        if (input.hasAudio === undefined) {
          const mediaById = new Map(timeline.project.media.map((asset) => [asset.id, asset]))
          hasAudio = sequence.tracks
            .filter((track) => track.kind === 'audio')
            .flatMap((track) => track.clips)
            .some((clip) => (clip.mediaId ? (mediaById.get(clip.mediaId)?.channels ?? 0) > 0 : false))
        }
        // Informational path for the queue UI; timeline jobs render the
        // embedded snapshot, so this file does not have to exist.
        sourcePath = sourcePath || join(appPaths().projects, `${safeFileStem(timeline.project.name)}.mcut`)
      } else if (input.sourcePath) {
        if (!durationSec || input.hasAudio === undefined) {
          try {
            const asset = await media.probe(input.sourcePath)
            durationSec = durationSec || asset.durationSec
            hasAudio = input.hasAudio ?? asset.channels > 0
          } catch (err) {
            logger.warn('queue', `probe failed for ${input.sourcePath}: ${(err as Error).message}`)
          }
        }
      }

      const outputDir = preset.output.directory ?? this.defaultDir()
      if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })
      const requested =
        input.outputPath ??
        (timeline && sequence
          ? join(
              outputDir,
              `${safeFileStem(timeline.project.name)}_${safeFileStem(sequence.name)}${preset.output.suffix}.${outputExtension(preset)}`
            )
          : defaultOutputPath(preset, input.sourcePath ?? '', outputDir))
      assertWritablePath(requested, [dirname(sourcePath || outputDir), outputDir, ...extraOutputRoots])
      const outputPath = uniqueOutputPath(requested, existsSync)
      const now = new Date().toISOString()
      const job: InternalJob = {
        id: uid('job'),
        name:
          input.name ??
          (timeline && sequence
            ? `${timeline.project.name} — ${sequence.name} → ${preset.name}`
            : `${basename(input.sourcePath ?? 'media')} → ${preset.name}`),
        sourcePath,
        sourceMediaId: input.mediaId ?? null,
        sequenceId: input.sequenceId ?? sequence?.id ?? null,
        timeline: timeline ?? null,
        preset,
        outputPath,
        durationSec: roundTo(durationSec, 3),
        hasAudio,
        state: 'queued',
        priority: input.priority,
        progress: 0,
        fps: 0,
        speed: 0,
        etaSec: 0,
        sizeBytes: 0,
        attempts: 0,
        maxRetries: input.maxRetries,
        error: null,
        logs: [`[queue] accodato ${now}`],
        groupId: input.groupId ?? null,
        metrics: { avgFps: 0, encodedFrames: 0, durationMs: 0, outputBytes: 0, speed: 0 },
        createdAt: now,
        startedAt: null,
        finishedAt: null,
        nextAttemptAt: null
      }
      this.save(job)
      this.jobs.set(job.id, job)
      created.push(job)
      logger.info('queue', `job queued ${job.id} (${preset.name})`)
    }
    this.broadcast()
    this.schedule()
    return created
  }

  private schedule(): void {
    if (this.timer) return
    this.timer = setTimeout(() => {
      this.timer = null
      void this.pump()
    }, 40)
    this.timer.unref?.()
  }

  private async pump(): Promise<void> {
    if (!this.started || this.pausedAll) return
    if (this.stopAfterCurrent && this.running.size > 0) return
    const now = Date.now()
    const candidates = [...this.jobs.values()]
      .filter((j) => j.state === 'queued')
      .filter((j) => !j.nextAttemptAt || new Date(j.nextAttemptAt).getTime() <= now)
      .sort((a, b) => b.priority - a.priority || a.createdAt.localeCompare(b.createdAt))
    for (const job of candidates) {
      if (this.running.size >= this.concurrency) break
      if (this.stopAfterCurrent) break
      void this.startJob(job)
    }
  }

  private async startJob(job: InternalJob): Promise<void> {
    if (this.running.has(job.id)) return
    const controller = new AbortController()
    this.running.set(job.id, controller)
    job.state = 'running'
    job.startedAt = new Date().toISOString()
    job.finishedAt = null
    job.error = null
    job.pauseRequested = false
    job.cancelRequested = false
    job.attempts += 1
    job.progress = 0
    job.fps = 0
    job.speed = 0
    job.etaSec = 0
    job.nextAttemptAt = null
    this.log(job, `[queue] avvio tentativo ${job.attempts}/${job.maxRetries + 1}`)
    this.save(job)
    this.broadcast()

    try {
      const onLog = (line: string): void => {
        this.log(job, line)
        this.events.log?.(job.id, line)
      }
      let result
      if (job.timeline) {
        this.log(job, '[queue] export timeline (sequenza, non singolo media)')
        result = await renderEngine.renderTimeline({
          jobId: job.id,
          project: job.timeline.project,
          sequenceId: job.timeline.sequenceId,
          output: job.outputPath,
          preset: job.preset,
          signal: controller.signal,
          lowPriority: true,
          onProgress: (p) => this.handleProgress(job, p),
          onLog
        })
      } else {
        if (!job.durationSec || !existsSync(job.sourcePath)) {
          const asset = await media.probe(job.sourcePath)
          job.durationSec = asset.durationSec
          job.hasAudio = asset.channels > 0
        }
        result = await renderEngine.render({
          jobId: job.id,
          input: job.sourcePath,
          output: job.outputPath,
          preset: job.preset,
          durationSec: job.durationSec,
          hasAudio: job.hasAudio,
          signal: controller.signal,
          lowPriority: true,
          onProgress: (p) => this.handleProgress(job, p),
          onLog
        })
      }
      job.state = 'done'
      job.progress = 100
      job.finishedAt = new Date().toISOString()
      job.sizeBytes = result.outputBytes
      job.metrics = {
        avgFps: result.avgFps,
        encodedFrames: result.encodedFrames,
        durationMs: result.durationMs,
        outputBytes: result.outputBytes,
        speed: job.speed
      }
      job.etaSec = 0
      this.log(job, `[queue] completato con ${result.encoder.encoder}${result.fallback ? ' (fallback software)' : ''}`)
      if (result.fallback) this.events.fallback?.(`Job ${job.name}: encoder hardware non disponibile, usato ${result.encoder.encoder}`)
      this.events.notify?.('Render completato', `${job.name} → ${job.outputPath}`, 'success')
    } catch (err) {
      const message = err instanceof RenderCanceledError ? 'Annullato' : (err as Error).message
      if (job.pauseRequested) {
        job.state = 'paused'
        this.log(job, '[queue] job in pausa')
      } else if (job.cancelRequested || err instanceof RenderCanceledError) {
        job.state = 'canceled'
        job.finishedAt = new Date().toISOString()
        this.log(job, '[queue] job annullato')
      } else if (isTransientError(message) && job.attempts <= job.maxRetries) {
        const delay = nextAttemptDelay(job.attempts)
        job.state = 'queued'
        job.nextAttemptAt = new Date(Date.now() + delay * 1000).toISOString()
        job.error = message
        this.log(job, `[queue] errore transitorio, retry tra ${delay}s: ${message}`)
      } else {
        job.state = 'error'
        job.error = message
        job.finishedAt = new Date().toISOString()
        this.log(job, `[queue] errore definitivo: ${message}`)
        this.events.notify?.('Render fallito', `${job.name}: ${message.slice(0, 180)}`, 'error')
      }
    } finally {
      this.running.delete(job.id)
      job.pauseRequested = false
      job.cancelRequested = false
      this.save(job)
      this.lastPersist.delete(job.id)
      this.prune(this.settingsProvider())
      this.broadcast()
      this.schedule()
    }
  }

  private handleProgress(job: InternalJob, p: RenderProgress): void {
    job.progress = Math.min(100, p.percent)
    job.fps = roundTo(p.fps, 2)
    job.speed = roundTo(p.speed, 2)
    job.etaSec = Math.round(p.etaSec)
    job.sizeBytes = p.sizeBytes
    this.events.progress?.(job.id, p)
    const now = Date.now()
    if (now - (this.lastPersist.get(job.id) ?? 0) > 2000) {
      this.lastPersist.set(job.id, now)
      this.save(job)
    }
  }

  private withJob(jobId: string | undefined, fn: (job: InternalJob) => void): void {
    if (!jobId) return
    const job = this.jobs.get(jobId)
    if (!job) throw new Error('Job non trovato')
    fn(job)
    this.save(job)
    this.broadcast()
  }

  pause(jobId?: string): QueueJob[] {
    if (!jobId) {
      this.pausedAll = true
      for (const job of this.jobs.values()) {
        if (job.state === 'running') {
          job.pauseRequested = true
          this.running.get(job.id)?.abort()
        }
      }
      this.broadcast()
      return this.sortedJobs()
    }
    const job = this.jobs.get(jobId)
    if (!job) throw new Error('Job non trovato')
    if (job.state === 'running') {
      job.pauseRequested = true
      this.running.get(jobId)?.abort()
    } else if (job.state === 'queued') {
      job.state = 'paused'
      this.save(job)
    }
    this.broadcast()
    return this.sortedJobs()
  }

  resume(jobId?: string): QueueJob[] {
    if (!jobId) {
      this.pausedAll = false
      for (const job of this.jobs.values()) {
        if (job.state === 'paused') {
          job.state = 'queued'
          job.nextAttemptAt = null
          this.save(job)
        }
      }
      this.broadcast()
      this.schedule()
      return this.sortedJobs()
    }
    this.withJob(jobId, (job) => {
      if (job.state === 'paused') {
        job.state = 'queued'
        job.nextAttemptAt = null
      }
    })
    this.schedule()
    return this.sortedJobs()
  }

  cancel(jobId: string): QueueJob[] {
    const job = this.jobs.get(jobId)
    if (!job) throw new Error('Job non trovato')
    if (job.state === 'running') {
      job.cancelRequested = true
      this.running.get(jobId)?.abort()
    } else if (job.state === 'queued' || job.state === 'paused') {
      job.state = 'canceled'
      job.finishedAt = new Date().toISOString()
      this.save(job)
    }
    this.broadcast()
    return this.sortedJobs()
  }

  retry(jobId: string): QueueJob[] {
    this.withJob(jobId, (job) => {
      if (job.state === 'error' || job.state === 'canceled') {
        job.state = 'queued'
        job.error = null
        job.progress = 0
        job.nextAttemptAt = null
        this.log(job, '[queue] retry manuale')
      }
    })
    this.schedule()
    return this.sortedJobs()
  }

  remove(jobId: string): QueueJob[] {
    const job = this.jobs.get(jobId)
    if (!job) throw new Error('Job non trovato')
    if (job.state === 'running') {
      job.cancelRequested = true
      this.running.get(jobId)?.abort()
    }
    this.jobs.delete(jobId)
    this.removeRow(jobId)
    this.broadcast()
    return this.sortedJobs()
  }

  duplicate(jobId: string): QueueJob[] {
    const job = this.jobs.get(jobId)
    if (!job) throw new Error('Job non trovato')
    const now = new Date().toISOString()
    const copy: InternalJob = {
      ...structuredClone(job),
      id: uid('job'),
      state: 'queued',
      progress: 0,
      fps: 0,
      speed: 0,
      etaSec: 0,
      sizeBytes: 0,
      attempts: 0,
      error: null,
      logs: [`[queue] duplicato da ${job.id}`],
      createdAt: now,
      startedAt: null,
      finishedAt: null,
      nextAttemptAt: null,
      outputPath: uniqueOutputPath(job.outputPath.replace(/(\.[^.\\/]+)$/, '_copy$1'), existsSync)
    }
    this.save(copy)
    this.jobs.set(copy.id, copy)
    this.broadcast()
    this.schedule()
    return this.sortedJobs()
  }

  reorder(jobId: string, toIndex: number): QueueJob[] {
    const list = this.sortedJobs()
    const from = list.findIndex((j) => j.id === jobId)
    if (from < 0) throw new Error('Job non trovato')
    const [moved] = list.splice(from, 1)
    if (!moved) return this.sortedJobs()
    list.splice(Math.max(0, Math.min(list.length, toIndex)), 0, moved)
    list.forEach((job, index) => {
      const target = this.jobs.get(job.id)
      if (target) {
        target.priority = Math.max(0, 100 - index)
        this.save(target)
      }
    })
    this.broadcast()
    this.schedule()
    return this.sortedJobs()
  }

  setPriority(jobId: string, priority: number): QueueJob[] {
    this.withJob(jobId, (job) => {
      job.priority = Math.max(0, Math.min(100, Math.round(priority)))
    })
    this.schedule()
    return this.sortedJobs()
  }

  setConcurrency(value: number): QueueJob[] {
    this.concurrency = Math.max(1, Math.min(16, Math.round(value)))
    this.schedule()
    this.broadcast()
    return this.sortedJobs()
  }

  setStopAfterCurrent(enabled: boolean): QueueJob[] {
    this.stopAfterCurrent = enabled
    this.broadcast()
    return this.sortedJobs()
  }

  clearFinished(): QueueJob[] {
    for (const job of [...this.jobs.values()]) {
      if (job.state === 'done' || job.state === 'canceled') {
        this.jobs.delete(job.id)
        this.removeRow(job.id)
      }
    }
    this.broadcast()
    return this.sortedJobs()
  }

  list(): QueueJob[] {
    return this.sortedJobs()
  }

  exportReport(format: 'json' | 'csv', jobIds?: string[]): string {
    const jobs = this.sortedJobs().filter((j) => !jobIds || jobIds.includes(j.id))
    if (format === 'json') {
      return JSON.stringify(
        { generatedAt: new Date().toISOString(), stats: this.stats(), jobs },
        null,
        2
      )
    }
    return toCsv(
      jobs.map((j) => ({
        id: j.id,
        name: j.name,
        state: j.state,
        preset: j.preset.name,
        encoder: j.preset.video.codec,
        source: j.sourcePath,
        output: j.outputPath,
        progress: j.progress,
        fps: j.fps,
        attempts: j.attempts,
        sizeBytes: j.sizeBytes,
        durationMs: j.metrics.durationMs,
        error: j.error,
        createdAt: j.createdAt,
        finishedAt: j.finishedAt
      })),
      ['id', 'name', 'state', 'preset', 'encoder', 'source', 'output', 'progress', 'fps', 'attempts', 'sizeBytes', 'durationMs', 'error', 'createdAt', 'finishedAt']
    )
  }

  async shutdown(): Promise<void> {
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
    for (const controller of this.running.values()) controller.abort()
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  get runningCount(): number {
    return this.running.size
  }
}

export const queue = new RenderQueue()
