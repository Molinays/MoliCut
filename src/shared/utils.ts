/** Pure helpers shared by main, preload and renderer. No Node/DOM globals here. */

export function uid(prefix = 'id'): string {
  const cryptoObj = globalThis.crypto
  if (cryptoObj && 'randomUUID' in cryptoObj) return `${prefix}_${cryptoObj.randomUUID().slice(0, 8)}`
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1)
}

export function roundTo(value: number, decimals = 2): number {
  const f = 10 ** decimals
  return Math.round(value * f) / f
}

/** SMPTE-style non-drop timecode. */
export function formatTimecode(seconds: number, fps = 30): string {
  const safe = Math.max(0, Number.isFinite(seconds) ? seconds : 0)
  const totalFrames = Math.round(safe * fps)
  const frames = totalFrames % Math.round(fps)
  const totalSeconds = Math.floor(totalFrames / fps)
  const s = totalSeconds % 60
  const m = Math.floor(totalSeconds / 60) % 60
  const h = Math.floor(totalSeconds / 3600)
  const p = (n: number): string => String(n).padStart(2, '0')
  return `${p(h)}:${p(m)}:${p(s)}:${p(frames)}`
}

export function parseTimecode(tc: string, fps = 30): number {
  const parts = tc.trim().split(':').map(Number)
  if (parts.some((n) => Number.isNaN(n))) return 0
  if (parts.length === 4) {
    const [h, m, s, f] = parts as [number, number, number, number]
    return h * 3600 + m * 60 + s + f / fps
  }
  if (parts.length === 3) {
    const [h, m, s] = parts as [number, number, number]
    return h * 3600 + m * 60 + s
  }
  return parts[0] ?? 0
}

export function formatClock(seconds: number): string {
  const safe = Math.max(0, seconds)
  const s = Math.floor(safe % 60)
  const m = Math.floor(safe / 60) % 60
  const h = Math.floor(safe / 3600)
  const p = (n: number): string => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${roundTo(bytes / 1024 ** i, i === 0 ? 0 : 1)} ${units[i]}`
}

export function formatEta(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—'
  if (seconds < 60) return `${Math.round(seconds)}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${String(s).padStart(2, '0')}s`
}

export function formatNumber(value: number, locale = 'it-IT'): string {
  try {
    return new Intl.NumberFormat(locale).format(value)
  } catch {
    return String(value)
  }
}

export function sanitizeFileName(name: string, fallback = 'untitled'): string {
  const cleaned = Array.from(name)
    .map((char) => (char.charCodeAt(0) < 32 || '<>:"/\\|?*'.includes(char) ? '_' : char))
    .join('')
    .replace(/\.+$/g, '')
    .trim()
    .slice(0, 180)
  return cleaned.length > 0 ? cleaned : fallback
}

export function ensureExtension(fileName: string, extension: string): string {
  const ext = extension.startsWith('.') ? extension : `.${extension}`
  return fileName.toLowerCase().endsWith(ext.toLowerCase()) ? fileName : `${fileName}${ext}`
}

export function globToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.')
  return new RegExp(`^${escaped}$`, 'i')
}

export function basenameNoExt(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/')
  const base = normalized.split('/').pop() ?? normalized
  const dot = base.lastIndexOf('.')
  return dot > 0 ? base.slice(0, dot) : base
}

/** Cubic-bezier easing evaluator (CSS compatible, Newton iterations). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const sampleX = (t: number): number => ((ax * t + bx) * t + cx) * t
  const sampleY = (t: number): number => ((ay * t + by) * t + cy) * t
  const sampleDX = (t: number): number => (3 * ax * t + 2 * bx) * t + cx
  const solve = (x: number): number => {
    let guess = x
    for (let i = 0; i < 8; i++) {
      const err = sampleX(guess) - x
      if (Math.abs(err) < 1e-5) return guess
      const d = sampleDX(guess)
      if (Math.abs(d) < 1e-6) break
      guess -= err / d
    }
    return x
  }
  return (t: number) => sampleY(solve(clamp(t, 0, 1)))
}

export const easings = {
  linear: (t: number): number => t,
  easeIn: (t: number): number => t * t,
  easeOut: (t: number): number => 1 - (1 - t) * (1 - t),
  easeInOut: (t: number): number => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
} as const

/** Interpolate a scalar track of keyframes. Deterministic and side-effect free. */
export function interpolateKeyframes(
  keyframes: Array<{ time: number; value: number; easing: string; cubic?: [number, number, number, number] }>,
  time: number,
  fallback: number
): number {
  if (keyframes.length === 0) return fallback
  const sorted = [...keyframes].sort((a, b) => a.time - b.time)
  const first = sorted[0]!
  if (time <= first.time) return first.value
  const last = sorted[sorted.length - 1]!
  if (time >= last.time) return last.value
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!
    const b = sorted[i + 1]!
    if (time >= a.time && time <= b.time) {
      const span = b.time - a.time || 1
      const t = (time - a.time) / span
      let eased = t
      if (b.easing === 'bezier' && b.cubic) {
        eased = cubicBezier(b.cubic[0], b.cubic[1], b.cubic[2], b.cubic[3])(t)
      } else if (b.easing in easings) {
        eased = easings[b.easing as keyof typeof easings](t)
      }
      return lerp(a.value, b.value, eased)
    }
  }
  return last.value
}

/** Aggregate peaks for a waveform: max(abs(sample)) per bucket. */
export function computeWaveformPeaks(samples: Float32Array, buckets: number): number[] {
  if (samples.length === 0 || buckets <= 0) return []
  const out: number[] = []
  const size = Math.max(1, Math.floor(samples.length / buckets))
  for (let b = 0; b < buckets; b++) {
    const start = b * size
    const end = Math.min(samples.length, start + size)
    let peak = 0
    for (let i = start; i < end; i++) {
      const v = Math.abs(samples[i] ?? 0)
      if (v > peak) peak = v
    }
    out.push(roundTo(peak, 3))
  }
  return out
}

export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = clamp(Math.floor((p / 100) * (sorted.length - 1)), 0, sorted.length - 1)
  return sorted[index] ?? 0
}

export function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCsv(rows: Array<Record<string, unknown>>, columns?: string[]): string {
  if (rows.length === 0) return ''
  const cols = columns ?? Object.keys(rows[0] ?? {})
  const header = cols.map(csvEscape).join(',')
  const body = rows.map((row) => cols.map((c) => csvEscape(row[c])).join(',')).join('\n')
  return `${header}\n${body}`
}

/** Best-effort PII redaction before anything is written to disk or exported. */
export function redactSensitive(input: string): string {
  let out = input
  out = out.replace(/[A-Z]:\\Users\\[^\\\s"']+/gi, '%USERPROFILE%')
  out = out.replace(/\/Users\/[^/\s"']+/g, '/Users/%USER%')
  out = out.replace(/\/home\/[^/\s"']+/g, '/home/%USER%')
  out = out.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '%EMAIL%')
  out = out.replace(/\b(Bearer)\s+[A-Za-z0-9\-._~+/]+=*/gi, '$1 %TOKEN%')
  out = out.replace(/\b(api[_-]?key|token|secret|password)\b\s*[:=]\s*("[^"]*"|'[^']*'|\S+)/gi, '$1=%REDACTED%')
  out = out.replace(/\b[A-Fa-f0-9]{32,}\b/g, '%HASH%')
  return out
}

export function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value)) as T
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
