import { existsSync, mkdirSync, statSync, unlinkSync } from 'node:fs'
import { dirname } from 'node:path'
import type { EncodePreset, Project } from '@shared/schemas'
import { sequenceContentDuration } from '@shared/projectFactory'
import { roundTo } from '@shared/utils'
import {
  buildEncodeArgs,
  buildGraphEncodeArgs,
  chooseEncoder,
  type BackendId,
  type EncoderChoice
} from './encoder'
import { ffmpeg } from './ffmpeg'
import { hardware } from './hardware'
import { logger } from './logger'
import { settings } from './settings'
import { buildTimelineGraph } from './timelineGraph'

/**
 * ONE pipeline for every render path (editor "Export", queue window, watch
 * folder, batch). The UI only supplies a preset + source; everything about
 * encoder selection, filtering, progress and fallback lives here.
 *
 * GPU-first: the profile is loaded (or scanned) before choosing an encoder.
 * When `gpuOnly` is enabled and the machine exposes a GPU encoder, software
 * encoding is never used — a broken driver fails the job with an actionable
 * error instead of silently rendering on the CPU.
 */

export class RenderCanceledError extends Error {
  constructor() {
    super('Render annullato')
    this.name = 'RenderCanceledError'
  }
}

export interface RenderProgress {
  percent: number
  timeSec: number
  frame: number
  fps: number
  speed: number
  etaSec: number
  sizeBytes: number
}

export interface RenderSpec {
  jobId: string
  input: string
  output: string
  preset: EncodePreset
  durationSec: number | null
  hasAudio: boolean
  hardwareOverride?: BackendId | 'auto'
  signal: AbortSignal
  lowPriority?: boolean
  onProgress: (p: RenderProgress) => void
  onLog: (line: string) => void
}

export interface TimelineRenderSpec {
  jobId: string
  project: Project
  sequenceId: string
  output: string
  preset: EncodePreset
  hardwareOverride?: BackendId | 'auto'
  signal: AbortSignal
  lowPriority?: boolean
  onProgress: (p: RenderProgress) => void
  onLog: (line: string) => void
}

export interface RenderResult {
  outputBytes: number
  durationMs: number
  avgFps: number
  encodedFrames: number
  encoder: EncoderChoice
  fallback: boolean
}

const healthCache = new Map<string, boolean>()

interface ResolvedChoice {
  choice: EncoderChoice
  gpuOnly: boolean
  hardwareAvailable: boolean
}

export class RenderEngine {
  private async ensureHardwareProfile(log: (line: string) => void): Promise<void> {
    if (hardware.cachedProfile()) return
    log('[hw] profilo hardware assente: scansione automatica…')
    try {
      await hardware.scan(false, (stage, percent, message) => {
        log(`[hw] ${message} (${percent}% · ${stage})`)
      })
    } catch (err) {
      log(`[hw] scansione fallita: ${(err as Error).message}`)
    }
  }

  private async resolveChoice(
    preset: EncodePreset,
    override: BackendId | 'auto' | undefined,
    log: (line: string) => void
  ): Promise<ResolvedChoice> {
    await this.ensureHardwareProfile(log)
    const current = settings.get()
    const gpuOnly = current.gpuOnly && !current.safeMode
    const backends = current.safeMode ? (['software'] as BackendId[]) : hardware.backends()
    const hardwareBackends = backends.filter((backend) => backend !== 'software')
    const hardwareAvailable = hardwareBackends.length > 0
    const policy = preset.video.encoderPolicy
    const overrideMap: Record<string, BackendId | 'auto'> = {
      auto: 'auto',
      nvidia: 'nvenc',
      amd: 'amf',
      intel: 'qsv',
      apple: 'videotoolbox',
      vaapi: 'vaapi',
      software: 'software'
    }
    const requestedOverride = override ?? overrideMap[current.hardwareOverride] ?? 'auto'

    // GPU-only and an actual GPU encoder present: the CPU is not a fallback.
    if (gpuOnly && hardwareAvailable && preset.video.codec !== 'none') {
      const forced = chooseEncoder(
        preset.video.codec,
        'hardware',
        hardwareBackends,
        requestedOverride === 'software' ? 'auto' : requestedOverride
      )
      if (!forced.hardware) {
        throw new Error(
          `Codec ${preset.video.codec.toUpperCase()} non supportato dalla GPU (${hardwareBackends.join(', ')}). ` +
            'La modalità Solo GPU è attiva: scegli H.264, HEVC o AV1 oppure disattivala nelle Impostazioni.'
        )
      }
      log(`[hw] solo GPU: ${forced.encoder} (nessun fallback CPU consentito)`)
      return { choice: forced, gpuOnly: true, hardwareAvailable }
    }

    const choice = chooseEncoder(preset.video.codec, policy, backends, requestedOverride)
    if (gpuOnly && hardwareAvailable) {
      log(`[hw] codec ${preset.video.codec}: nessun encoder GPU applicabile (audio/immagine).`)
    } else if (gpuOnly && !hardwareAvailable) {
      log('[hw] nessun encoder GPU rilevato: export software (la macchina non offre alternative).')
    }
    return { choice, gpuOnly, hardwareAvailable }
  }

  private async ensureHealthy(choice: EncoderChoice, log: (line: string) => void): Promise<boolean> {
    if (!choice.hardware) return true
    const cached = healthCache.get(choice.encoder)
    if (cached !== undefined) return cached
    log(`[hw] test rapido encoder ${choice.encoder} (1s)…`)
    const codec = choice.encoder.includes('hevc') ? 'hevc' : choice.encoder.includes('av1') ? 'av1' : 'h264'
    const test = await hardware.testEncoder(choice.encoder, codec)
    healthCache.set(choice.encoder, test.ok)
    if (test.ok) log(`[hw] ${choice.encoder} operativo (${test.fps ?? '?'} fps)`)
    else log(`[hw] ${choice.encoder} FALLITO: ${test.detail}`)
    return test.ok
  }

  async render(spec: RenderSpec): Promise<RenderResult> {
    if (!existsSync(spec.input)) throw new Error(`Sorgente non trovata: ${spec.input}`)
    if (!existsSync(dirname(spec.output))) mkdirSync(dirname(spec.output), { recursive: true })

    const resolved = await this.resolveChoice(spec.preset, spec.hardwareOverride, spec.onLog)
    let choice = resolved.choice
    let fallback = false
    spec.onLog(`[render] backend=${choice.backend} encoder=${choice.encoder} (${choice.reason})`)

    if (choice.hardware && !(await this.ensureHealthy(choice, spec.onLog))) {
      if (resolved.gpuOnly) {
        throw new Error(
          `Encoder GPU ${choice.encoder} non operativo. Export annullato: modalità Solo GPU attiva (nessun fallback CPU).`
        )
      }
      const software = chooseEncoder(spec.preset.video.codec, 'software', ['software'])
      spec.onLog(`[hw] fallback esplicito a ${software.encoder}: encoder hardware non disponibile.`)
      choice = software
      fallback = true
    }

    const makeArgs = (encoder: EncoderChoice): string[] =>
      buildEncodeArgs({
        input: spec.input,
        output: spec.output,
        preset: spec.preset,
        choice: encoder,
        durationSec: spec.durationSec,
        hasAudio: spec.hasAudio
      })

    try {
      return await this.execute(spec, choice, fallback, makeArgs)
    } catch (err) {
      if (err instanceof RenderCanceledError) throw err
      if (!choice.hardware) throw err
      if (resolved.gpuOnly) {
        throw new Error(
          `Encode GPU (${choice.encoder}) fallito: ${(err as Error).message}\n` +
            'Modalità Solo GPU attiva: nessun fallback alla CPU. Controlla driver/encoder o disattivala nelle Impostazioni.'
        )
      }
      const software = chooseEncoder(spec.preset.video.codec, 'software', ['software'])
      spec.onLog(`[hw] errore encoder ${choice.encoder}: ${(err as Error).message}`)
      spec.onLog(`[hw] retry con fallback software ${software.encoder}`)
      logger.warn('render', `hardware encode failed, falling back: ${(err as Error).message}`)
      healthCache.set(choice.encoder, false)
      try {
        return await this.execute(spec, software, true, makeArgs)
      } catch (retryErr) {
        if (retryErr instanceof RenderCanceledError) throw retryErr
        throw new Error(`Encode fallito (hardware e software): ${(retryErr as Error).message}`)
      }
    }
  }

  /** Render the whole timeline (overlaid tracks + audio mix + titles). */
  async renderTimeline(spec: TimelineRenderSpec): Promise<RenderResult> {
    const sequence = spec.project.sequences.find((item) => item.id === spec.sequenceId)
    if (!sequence) throw new Error('Sequenza non trovata nel progetto')
    if (sequenceContentDuration(sequence) <= 0.01) throw new Error('Timeline vuota: aggiungi almeno una clip prima di esportare.')

    const initialGraph = buildTimelineGraph(spec.project, sequence, spec.preset)
    for (const input of initialGraph.inputs) {
      if (!existsSync(input.path)) throw new Error(`Sorgente non trovata: ${input.path}`)
    }
    if (!existsSync(dirname(spec.output))) mkdirSync(dirname(spec.output), { recursive: true })

    const resolved = await this.resolveChoice(spec.preset, spec.hardwareOverride, spec.onLog)
    let choice = resolved.choice
    let fallback = false
    spec.onLog(`[render] timeline "${sequence.name}" backend=${choice.backend} encoder=${choice.encoder} (${choice.reason})`)

    if (choice.hardware && !(await this.ensureHealthy(choice, spec.onLog))) {
      if (resolved.gpuOnly) {
        throw new Error(
          `Encoder GPU ${choice.encoder} non operativo. Export annullato: modalità Solo GPU attiva (nessun fallback CPU).`
        )
      }
      const software = chooseEncoder(spec.preset.video.codec, 'software', ['software'])
      spec.onLog(`[hw] fallback esplicito a ${software.encoder}: encoder hardware non disponibile.`)
      choice = software
      fallback = true
    }

    const baseSpec: RenderSpec = {
      jobId: spec.jobId,
      input: initialGraph.inputs[0]?.path ?? '',
      output: spec.output,
      preset: spec.preset,
      durationSec: initialGraph.durationSec,
      hasAudio: initialGraph.hasAudio,
      hardwareOverride: spec.hardwareOverride,
      signal: spec.signal,
      lowPriority: spec.lowPriority,
      onProgress: spec.onProgress,
      onLog: spec.onLog
    }

    const makeArgs = (encoder: EncoderChoice): string[] => {
      const graph = buildTimelineGraph(spec.project, sequence, spec.preset, { choice: encoder })
      for (const note of graph.notes) spec.onLog(`[timeline] ${note}`)
      const inputs: string[] = []
      for (const input of graph.inputs) {
        if (input.loop) inputs.push('-loop', '1')
        inputs.push('-i', input.path)
      }
      return [
        ...inputs,
        ...buildGraphEncodeArgs({
          output: spec.output,
          preset: spec.preset,
          choice: encoder,
          filterGraph: graph.filterGraph,
          videoLabel: graph.videoLabel,
          audioLabel: graph.audioLabel,
          durationSec: graph.durationSec,
          hasAudio: graph.hasAudio
        })
      ]
    }

    try {
      return await this.execute(baseSpec, choice, fallback, makeArgs)
    } catch (err) {
      if (err instanceof RenderCanceledError) throw err
      if (!choice.hardware) throw err
      if (resolved.gpuOnly) {
        throw new Error(
          `Encode GPU (${choice.encoder}) fallito: ${(err as Error).message}\n` +
            'Modalità Solo GPU attiva: nessun fallback alla CPU. Controlla driver/encoder o disattivala nelle Impostazioni.'
        )
      }
      const software = chooseEncoder(spec.preset.video.codec, 'software', ['software'])
      spec.onLog(`[hw] errore encoder ${choice.encoder}: ${(err as Error).message}`)
      spec.onLog(`[hw] retry con fallback software ${software.encoder}`)
      logger.warn('render', `timeline hardware encode failed, falling back: ${(err as Error).message}`)
      healthCache.set(choice.encoder, false)
      try {
        return await this.execute(baseSpec, software, true, makeArgs)
      } catch (retryErr) {
        if (retryErr instanceof RenderCanceledError) throw retryErr
        throw new Error(`Encode timeline fallito (hardware e software): ${(retryErr as Error).message}`)
      }
    }
  }

  private async execute(
    spec: RenderSpec,
    choice: EncoderChoice,
    fallback: boolean,
    makeArgs: (choice: EncoderChoice) => string[]
  ): Promise<RenderResult> {
    const args = makeArgs(choice)
    const fullArgs = ['-progress', 'pipe:1', '-nostats', ...args]
    const started = Date.now()
    const latest: RenderProgress = {
      percent: 0,
      timeSec: 0,
      frame: 0,
      fps: 0,
      speed: 0,
      etaSec: 0,
      sizeBytes: 0
    }
    let lastEmit = 0
    let lastFrame = 0

    const parseProgress = (line: string): void => {
      const idx = line.indexOf('=')
      if (idx <= 0) return
      const key = line.slice(0, idx).trim()
      const value = line.slice(idx + 1).trim()
      if (key === 'out_time_us' || key === 'out_time_ms') {
        const us = Number(value)
        if (Number.isFinite(us)) latest.timeSec = us / 1_000_000
      } else if (key === 'frame') {
        latest.frame = Number(value) || 0
      } else if (key === 'fps') {
        latest.fps = Number(value) || 0
      } else if (key === 'speed') {
        latest.speed = Number(value.replace('x', '')) || 0
      } else if (key === 'total_size') {
        latest.sizeBytes = Number(value) || 0
      } else if (key === 'progress' && value === 'end') {
        latest.percent = 100
      }
      if (spec.durationSec && spec.durationSec > 0) {
        latest.percent = Math.max(latest.percent, Math.min(99.5, (latest.timeSec / spec.durationSec) * 100))
        const remaining = Math.max(0, spec.durationSec - latest.timeSec)
        latest.etaSec = latest.speed > 0 ? remaining / latest.speed : 0
      }
      if (latest.fps > 0) lastFrame = latest.frame
      const now = Date.now()
      if (now - lastEmit > 250) {
        lastEmit = now
        spec.onProgress({ ...latest, percent: roundTo(latest.percent, 1) })
      }
    }

    spec.onLog(`[ffmpeg] ${choice.encoder} → ${spec.output}`)
    const result = await ffmpeg.runFfmpeg(fullArgs, {
      signal: spec.signal,
      lowPriority: spec.lowPriority ?? true,
      onStdout: parseProgress,
      onStderr: (line) => {
        if (line.includes('Error') || line.includes('error') || line.includes('Invalid')) spec.onLog(`[ffmpeg] ${line}`)
      }
    })

    if (result.canceled) {
      try {
        if (existsSync(spec.output)) unlinkSync(spec.output)
      } catch {
        /* partial file may be locked */
      }
      throw new RenderCanceledError()
    }
    if (result.code !== 0) {
      throw new Error(tail(result.stderr))
    }
    if (!existsSync(spec.output)) throw new Error('FFmpeg ha terminato senza produrre output')

    const outputBytes = statSync(spec.output).size
    const durationMs = Date.now() - started
    const avgFps = latest.timeSec > 0 ? roundTo(lastFrame / latest.timeSec, 2) : 0
    spec.onProgress({ ...latest, percent: 100, sizeBytes: outputBytes, etaSec: 0 })
    spec.onLog(`[render] completato in ${(durationMs / 1000).toFixed(1)}s (${outputBytes} byte, ${avgFps} fps medi)`)
    logger.info('render', `done job=${spec.jobId} encoder=${choice.encoder} ms=${durationMs} bytes=${outputBytes}`)

    return {
      outputBytes,
      durationMs,
      avgFps,
      encodedFrames: lastFrame,
      encoder: choice,
      fallback
    }
  }

  /** Single-frame export (still) used by "Esporta frame". */
  async renderStill(input: string, output: string, timeSec: number, width?: number): Promise<void> {
    if (!existsSync(dirname(output))) mkdirSync(dirname(output), { recursive: true })
    const args = ['-ss', String(timeSec), '-i', input, '-frames:v', '1']
    if (width) args.push('-vf', `scale=${width}:-2`)
    args.push('-q:v', '2', output)
    const res = await ffmpeg.runFfmpeg(args, { timeoutMs: 120000 })
    if (res.code !== 0) throw new Error(tail(res.stderr))
  }
}

function tail(stderr: string): string {
  const lines = stderr.split(/\r?\n/).filter((l) => l.trim().length > 0)
  return lines.slice(-12).join('\n').slice(0, 4000) || 'Errore FFmpeg sconosciuto'
}

export const renderEngine = new RenderEngine()
