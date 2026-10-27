import type { AppSettings } from '@shared/schemas'

const STORAGE_KEY = 'molicut.theme'

export function applyTheme(theme: AppSettings['theme'], accent: string): void {
  const root = document.documentElement
  const resolved =
    theme === 'system' ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : theme
  root.dataset.theme = resolved
  root.style.setProperty('--accent', accent)
  root.style.setProperty('--accent-soft', hexToRgba(accent, 0.16))
  root.style.setProperty('--accent-border', hexToRgba(accent, 0.45))
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, accent }))
  } catch {
    /* private mode */
  }
}

export function initTheme(): void {
  let theme: AppSettings['theme'] = 'dark'
  let accent = '#4f8dff'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as { theme?: AppSettings['theme']; accent?: string }
      theme = parsed.theme ?? theme
      accent = parsed.accent ?? accent
    }
  } catch {
    /* ignore */
  }
  applyTheme(theme, accent)
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const r = Number.parseInt(full.slice(0, 2), 16) || 79
  const g = Number.parseInt(full.slice(2, 4), 16) || 141
  const b = Number.parseInt(full.slice(4, 6), 16) || 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function accentRgba(alpha: number): string {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4f8dff'
  return hexToRgba(accent, alpha)
}
