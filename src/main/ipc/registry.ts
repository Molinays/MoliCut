import { ipcMain, type IpcMainInvokeEvent } from 'electron'
import { z } from 'zod'
import type { IpcChannel, IpcError, IpcOutput, IpcStats, IpcResult } from '@shared/ipc'
import { ipcRoutes } from '@shared/ipc'
import { logger } from '../services/logger'
import { isTrustedWebContents } from '../services/security'

/**
 * Every IPC handler goes through this registry:
 *  sender allowlist -> per-channel token bucket -> Zod parse -> timed handler.
 * Renderer input is never trusted, including its own "typed" client.
 */

interface ChannelStats {
  calls: number
  errors: number
  totalMs: number
  lastMs: number
  lastAt: string | null
}

const stats = new Map<string, ChannelStats>()
const buckets = new Map<string, number[]>()

const RATE_LIMITS: Partial<Record<IpcChannel, { max: number; windowMs: number }>> = {
  'system:scan': { max: 3, windowMs: 60_000 },
  'system:benchmark': { max: 2, windowMs: 120_000 },
  'system:testEncoder': { max: 10, windowMs: 60_000 },
  'deps:download': { max: 2, windowMs: 300_000 },
  'queue:add': { max: 30, windowMs: 60_000 },
  'debug:bundle': { max: 3, windowMs: 120_000 },
  'debug:clientError': { max: 20, windowMs: 60_000 }
}

function rateLimited(event: IpcMainInvokeEvent, channel: IpcChannel): boolean {
  const limits = RATE_LIMITS[channel] ?? { max: 120, windowMs: 10_000 }
  const key = `${event.sender.id}:${channel}`
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < limits.windowMs)
  hits.push(now)
  buckets.set(key, hits)
  return hits.length > limits.max
}

function statsFor(channel: string): ChannelStats {
  let s = stats.get(channel)
  if (!s) {
    s = { calls: 0, errors: 0, totalMs: 0, lastMs: 0, lastAt: null }
    stats.set(channel, s)
  }
  return s
}

export type Handler<C extends IpcChannel> = (
  input: z.infer<(typeof ipcRoutes)[C]['input']>,
  context: { event: IpcMainInvokeEvent; channel: C }
) => Promise<IpcOutput<C>> | IpcOutput<C>

export function handle<C extends IpcChannel>(channel: C, handler: Handler<C>): void {
  ipcMain.removeHandler(channel)
  ipcMain.handle(channel, async (event, rawInput: unknown): Promise<IpcResult<unknown>> => {
    const started = performance.now()
    const s = statsFor(channel)
    s.calls++
    s.lastAt = new Date().toISOString()
    try {
      if (!isTrustedWebContents(event.sender.id)) {
        throw Object.assign(new Error('Sender non autorizzato'), { code: 'UNAUTHORIZED' })
      }
      if (rateLimited(event, channel)) {
        throw Object.assign(new Error(`Rate limit superato su ${channel}`), { code: 'RATE_LIMITED' })
      }
      const schema = ipcRoutes[channel].input
      const parsed = schema.safeParse(rawInput ?? {})
      if (!parsed.success) {
        throw Object.assign(new Error('Payload IPC non valido'), {
          code: 'VALIDATION',
          details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
        })
      }
      const data = await handler(parsed.data as never, { event, channel })
      s.lastMs = Math.round(performance.now() - started)
      s.totalMs += s.lastMs
      return { ok: true, data }
    } catch (err) {
      s.errors++
      const error: IpcError = {
        code: (err as { code?: IpcError['code'] }).code ?? 'INTERNAL',
        message: (err as Error).message ?? 'Errore interno',
        details: (err as { details?: unknown }).details
      }
      if (error.code === 'INTERNAL') logger.error('ipc', `${channel}: ${error.message}`)
      else logger.debug('ipc', `${channel} rejected (${error.code}): ${error.message}`)
      s.lastMs = Math.round(performance.now() - started)
      s.totalMs += s.lastMs
      return { ok: false, error }
    }
  })
}

export function ipcStats(): IpcStats {
  return {
    channels: [...stats.entries()]
      .map(([channel, s]) => ({
        channel,
        calls: s.calls,
        errors: s.errors,
        avgMs: s.calls > 0 ? Math.round((s.totalMs / s.calls) * 10) / 10 : 0,
        lastMs: s.lastMs,
        lastAt: s.lastAt
      }))
      .sort((a, b) => b.calls - a.calls),
    totalCalls: [...stats.values()].reduce((sum, s) => sum + s.calls, 0),
    totalErrors: [...stats.values()].reduce((sum, s) => sum + s.errors, 0)
  }
}
