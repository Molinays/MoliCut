import { defaultSettings, settingsSchema, type AppSettings } from '@shared/schemas'
import { getKv, setKv } from './db'
import { logger } from './logger'

type Listener = (settings: AppSettings) => void

class SettingsService {
  private current: AppSettings = defaultSettings
  private listeners = new Set<Listener>()

  init(): AppSettings {
    const raw = getKv<unknown>('settings', null)
    const parsed = raw ? settingsSchema.safeParse(raw) : null
    if (parsed && parsed.success) {
      this.current = parsed.data
    } else {
      if (raw) logger.warn('settings', 'stored settings invalid, falling back to defaults')
      this.current = defaultSettings
      setKv('settings', this.current)
    }
    return this.current
  }

  get(): AppSettings {
    return this.current
  }

  update(patch: Partial<AppSettings>): AppSettings {
    const merged: AppSettings = {
      ...this.current,
      ...patch,
      shortcuts: { ...this.current.shortcuts, ...(patch.shortcuts ?? {}) },
      telemetry: false
    }
    const parsed = settingsSchema.parse(merged)
    this.current = parsed
    setKv('settings', parsed)
    for (const listener of this.listeners) listener(parsed)
    logger.info('settings', `updated: ${Object.keys(patch).join(', ') || 'no-op'}`)
    return parsed
  }

  reset(): AppSettings {
    this.current = { ...defaultSettings }
    setKv('settings', this.current)
    for (const listener of this.listeners) listener(this.current)
    logger.info('settings', 'reset to defaults')
    return this.current
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /** Safe mode disables plugins, GPU acceleration and most startup automation. */
  isSafeMode(): boolean {
    return this.current.safeMode || process.env.MOLICUT_SAFE_MODE === '1'
  }
}

export const settings = new SettingsService()
