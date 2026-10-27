/**
 * Renderer-side failure reporting.
 * Errors are isolated in the UI first; this helper only mirrors them to the main
 * log (redacted there) and throttles duplicates so a render loop cannot flood IPC.
 */

const reported = new Map<string, number>()
const WINDOW_MS = 30_000
const MAX_MESSAGE = 8000

export function reportClientError(source: string, error: unknown, componentStack?: string | null): void {
  const normalized = error instanceof Error ? error : new Error(String(error))
  const key = `${source}:${normalized.message}`
  const now = Date.now()
  if ((reported.get(key) ?? 0) > now - WINDOW_MS) return
  reported.set(key, now)

  console.error(`[${source}]`, normalized)
  try {
    void window.molicut?.invoke('debug:clientError', {
      message: normalized.message.slice(0, MAX_MESSAGE) || 'Unknown renderer error',
      stack: (normalized.stack ?? '').slice(0, 16_000),
      componentStack: (componentStack ?? '').slice(0, 16_000),
      source
    })
  } catch {
    /* bridge unavailable: browser preview or crash before preload */
  }
}

export function installGlobalErrorReporting(): void {
  window.addEventListener('error', (event) => {
    reportClientError('window.error', event.error ?? new Error(event.message))
  })
  window.addEventListener('unhandledrejection', (event) => {
    reportClientError('unhandledrejection', event.reason)
  })
}
