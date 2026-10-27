import { appendFileSync, existsSync, mkdirSync, renameSync, statSync } from 'node:fs'
import { join } from 'node:path'
import type { LogEntry } from '@shared/schemas'
import { redactSensitive } from '@shared/utils'
import { appPaths } from './paths'

type Level = LogEntry['level']
type Listener = (entry: LogEntry) => void

const LEVEL_WEIGHT: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 }
const MAX_BUFFER = 4000
const MAX_FILE_BYTES = 8 * 1024 * 1024

/**
 * Single logging pipeline for main + renderer-forwarded logs.
 * - bounded ring buffer, so the debug panel can never leak memory
 * - PII redaction applied before buffering AND before writing to disk
 * - rotating file sink, no network sink by default
 */
export class Logger {
  private buffer: LogEntry[] = []
  private listeners = new Set<Listener>()
  private seq = 0
  private minLevel: Level = 'debug'
  private filePath: string | null = null
  private fileEnabled = true

  configure(options: { fileEnabled?: boolean; minLevel?: Level }): void {
    if (options.fileEnabled !== undefined) this.fileEnabled = options.fileEnabled
    if (options.minLevel) this.minLevel = options.minLevel
  }

  private ensureFile(): string {
    if (this.filePath) return this.filePath
    const dir = appPaths().logs
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    this.filePath = join(dir, 'molicut.log')
    return this.filePath
  }

  private rotateIfNeeded(path: string): void {
    try {
      if (existsSync(path) && statSync(path).size > MAX_FILE_BYTES) {
        renameSync(path, join(appPaths().logs, `molicut-${Date.now()}.log`))
      }
    } catch {
      /* rotation must never break logging */
    }
  }

  private write(level: Level, scope: string, message: string): LogEntry {
    const clean = redactSensitive(message)
    const entry: LogEntry = {
      id: ++this.seq,
      at: new Date().toISOString(),
      level,
      scope: scope.slice(0, 64),
      message: clean.slice(0, 8000)
    }
    if (LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[this.minLevel]) {
      this.buffer.push(entry)
      if (this.buffer.length > MAX_BUFFER) this.buffer.splice(0, this.buffer.length - MAX_BUFFER)
      for (const listener of this.listeners) {
        try {
          listener(entry)
        } catch {
          /* a broken listener must not break the app */
        }
      }
      if (process.env.NODE_ENV !== 'test') {
        const line = `[${entry.at}] ${level.toUpperCase().padEnd(5)} ${scope}: ${clean}`
        if (level === 'error') console.error(line)
        else if (level === 'warn') console.warn(line)
        else console.log(line)
      }
      if (this.fileEnabled) {
        try {
          const path = this.ensureFile()
          this.rotateIfNeeded(path)
          appendFileSync(path, `[${entry.at}] ${level.toUpperCase().padEnd(5)} ${scope}: ${clean}\n`, 'utf8')
        } catch {
          /* disk full / permissions: keep running */
        }
      }
    }
    return entry
  }

  debug(scope: string, message: string): void {
    this.write('debug', scope, message)
  }
  info(scope: string, message: string): void {
    this.write('info', scope, message)
  }
  warn(scope: string, message: string): void {
    this.write('warn', scope, message)
  }
  error(scope: string, message: string): void {
    this.write('error', scope, message)
  }

  recent(limit = 500, level?: Level): LogEntry[] {
    const filtered = level ? this.buffer.filter((e) => LEVEL_WEIGHT[e.level] >= LEVEL_WEIGHT[level]) : this.buffer
    return filtered.slice(-limit)
  }

  clear(): void {
    const hadFile = this.filePath
    this.buffer = []
    this.listeners.clear()
    this.filePath = hadFile
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  logPath(): string | null {
    return this.filePath
  }
}

export const logger = new Logger()
