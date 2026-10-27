import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import * as os from 'node:os'
import { join } from 'node:path'
import { appPaths, ffmpegResourcesDir } from './paths'
import { parseEncoderList } from './ffmpegParse'
import { logger } from './logger'

/**
 * Direct `spawn` wrapper instead of fluent-ffmpeg.
 * Motivation: no shell string interpolation (command injection surface), full
 * control over -progress parsing, AbortSignal cancellation, OS priority and
 * argument arrays. The public API stays tiny and testable.
 */

export interface BinaryInfo {
  path: string | null
  version: string | null
  source: 'env' | 'bundled' | 'system' | 'none'
}

export interface RunOptions {
  onStdout?: (line: string) => void
  onStderr?: (line: string) => void
  signal?: AbortSignal
  timeoutMs?: number
  lowPriority?: boolean
  env?: NodeJS.ProcessEnv
}

export interface RunResult {
  code: number
  stdout: string
  stderr: string
  canceled: boolean
  timedOut: boolean
}

const isWindows = process.platform === 'win32'
const exe = (name: string): string => (isWindows ? `${name}.exe` : name)

function findBundled(name: string): string | null {
  const candidates = [join(ffmpegResourcesDir(), exe(name)), join(appPaths().bin, exe(name))]
  return candidates.find((candidate) => existsSync(candidate)) ?? null
}

export class FfmpegService {
  private cache: { ffmpeg: BinaryInfo; ffprobe: BinaryInfo } | null = null

  private resolveOne(name: 'ffmpeg' | 'ffprobe'): BinaryInfo {
    const envVar = name === 'ffmpeg' ? process.env.MOLICUT_FFMPEG : process.env.MOLICUT_FFPROBE
    if (envVar && existsSync(envVar)) return { path: envVar, version: null, source: 'env' }
    const bundled = findBundled(name)
    if (bundled) return { path: bundled, version: null, source: 'bundled' }
    return { path: exe(name), version: null, source: 'system' }
  }

  binaries(): { ffmpeg: BinaryInfo; ffprobe: BinaryInfo } {
    this.cache ??= { ffmpeg: this.resolveOne('ffmpeg'), ffprobe: this.resolveOne('ffprobe') }
    return this.cache
  }

  invalidate(): void {
    this.cache = null
  }

  async version(which: 'ffmpeg' | 'ffprobe' = 'ffmpeg'): Promise<string | null> {
    const info = this.binaries()[which]
    if (!info.path) return null
    try {
      const res = await this.run(info.path, ['-version'], { timeoutMs: 8000 })
      if (res.code !== 0) return null
      return res.stdout.split('\n')[0] ?? null
    } catch {
      return null
    }
  }

  async available(): Promise<boolean> {
    return (await this.version('ffmpeg')) !== null
  }

  run(bin: string, args: string[], options: RunOptions = {}): Promise<RunResult> {
    return new Promise((resolvePromise, reject) => {
      let child: ReturnType<typeof spawn>
      try {
        child = spawn(bin, args, {
          windowsHide: true,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, ...options.env },
          // never pass a shell: args are always an array
          shell: false
        })
      } catch (err) {
        reject(err)
        return
      }

      const stdout: string[] = []
      const stderr: string[] = []
      let stdoutBytes = 0
      let stderrBytes = 0
      let canceled = false
      let timedOut = false
      let settled = false
      let killTimer: NodeJS.Timeout | null = null

      const MAX_CAPTURE = 4 * 1024 * 1024

      const handleLine = (chunk: Buffer, sink: string[], onLine?: (line: string) => void, bytes = 0): number => {
        const text = chunk.toString('utf8')
        if (bytes < MAX_CAPTURE) sink.push(text)
        if (onLine) {
          for (const line of text.split(/\r?\n/)) {
            if (line.trim().length > 0) onLine(line)
          }
        }
        return bytes + chunk.length
      }

      child.stdout?.on('data', (chunk: Buffer) => {
        stdoutBytes = handleLine(chunk, stdout, options.onStdout, stdoutBytes)
      })
      child.stderr?.on('data', (chunk: Buffer) => {
        stderrBytes = handleLine(chunk, stderr, options.onStderr, stderrBytes)
      })

      const terminate = (): void => {
        if (child.exitCode !== null) return
        try {
          child.kill('SIGTERM')
        } catch {
          /* already gone */
        }
        killTimer = setTimeout(() => {
          try {
            child.kill('SIGKILL')
          } catch {
            /* already gone */
          }
        }, 2500)
        killTimer.unref?.()
      }

      const onAbort = (): void => {
        canceled = true
        terminate()
      }
      if (options.signal) {
        if (options.signal.aborted) onAbort()
        else options.signal.addEventListener('abort', onAbort, { once: true })
      }

      let timeout: NodeJS.Timeout | null = null
      if (options.timeoutMs && options.timeoutMs > 0) {
        timeout = setTimeout(() => {
          timedOut = true
          terminate()
        }, options.timeoutMs)
        timeout.unref?.()
      }

      if (options.lowPriority && child.pid) {
        try {
          // Windows maps this to BELOW_NORMAL_PRIORITY_CLASS, POSIX to nice 10.
          os.setPriority(child.pid, os.constants.priority.PRIORITY_BELOW_NORMAL)
        } catch {
          /* not fatal */
        }
      }

      const cleanup = (): void => {
        if (killTimer) clearTimeout(killTimer)
        if (timeout) clearTimeout(timeout)
        options.signal?.removeEventListener('abort', onAbort)
      }

      child.on('error', (err) => {
        if (settled) return
        settled = true
        cleanup()
        reject(err)
      })

      child.on('close', (code) => {
        if (settled) return
        settled = true
        cleanup()
        const result: RunResult = {
          code: code ?? -1,
          stdout: stdout.join(''),
          stderr: stderr.join(''),
          canceled,
          timedOut
        }
        if (canceled) logger.debug('ffmpeg', `canceled: ${args.slice(0, 4).join(' ')}`)
        resolvePromise(result)
      })
    })
  }

  async runFfmpeg(args: string[], options: RunOptions = {}): Promise<RunResult> {
    const info = this.binaries().ffmpeg
    if (!info.path) throw new Error('FFmpeg non disponibile')
    return this.run(info.path, ['-hide_banner', '-nostdin', '-y', ...args], options)
  }

  async runFfprobe(args: string[], options: RunOptions = {}): Promise<RunResult> {
    const info = this.binaries().ffprobe
    if (!info.path) throw new Error('FFprobe non disponibile')
    return this.run(info.path, ['-hide_banner', ...args], options)
  }

  async listEncoders(): Promise<string[]> {
    const info = this.binaries().ffmpeg
    if (!info.path) return []
    try {
      const res = await this.run(info.path, ['-hide_banner', '-encoders'], { timeoutMs: 15000 })
      return parseEncoderList(res.stdout)
    } catch {
      return []
    }
  }

  async listHwaccels(): Promise<string[]> {
    const info = this.binaries().ffmpeg
    if (!info.path) return []
    try {
      const res = await this.run(info.path, ['-hide_banner', '-hwaccels'], { timeoutMs: 15000 })
      return res.stdout
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.toLowerCase().startsWith('hardware acceleration'))
    } catch {
      return []
    }
  }
}

export const ffmpeg = new FfmpegService()
