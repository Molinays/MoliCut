import { app } from 'electron'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * All writable locations are derived from Electron's userData directory.
 * Nothing is written next to the executable (read-only installs, code signing).
 */
export interface AppPaths {
  userData: string
  projects: string
  cache: string
  proxies: string
  thumbnails: string
  waveforms: string
  logs: string
  temp: string
  overlays: string
  backups: string
  bin: string
}

let cached: AppPaths | null = null

export function appPaths(): AppPaths {
  if (cached) return cached
  const userData = app.getPath('userData')
  cached = {
    userData,
    projects: join(userData, 'projects'),
    cache: join(userData, 'cache'),
    proxies: join(userData, 'proxies'),
    thumbnails: join(userData, 'thumbnails'),
    waveforms: join(userData, 'waveforms'),
    logs: join(userData, 'logs'),
    temp: join(userData, 'tmp'),
    overlays: join(userData, 'overlays'),
    backups: join(userData, 'backups'),
    bin: join(userData, 'bin')
  }
  return cached
}

export function ensureAppDirs(): AppPaths {
  const paths = appPaths()
  for (const dir of Object.values(paths)) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 })
  }
  return paths
}

/** Bundled FFmpeg lives in resources/bin (dev) or resources/ffmpeg (packaged). */
export function ffmpegResourcesDir(): string {
  const packaged = join(process.resourcesPath, 'ffmpeg')
  if (app.isPackaged && existsSync(packaged)) return packaged
  return join(app.getAppPath(), 'ffmpeg', 'bin')
}

/** Root folders a write operation may target without an explicit user dialog. */
export function writableRoots(): string[] {
  const p = appPaths()
  const roots = [p.userData, p.projects, p.cache, p.proxies, p.thumbnails, p.waveforms, p.temp, p.backups, p.bin]
  try {
    roots.push(app.getPath('videos'), app.getPath('downloads'), app.getPath('documents'))
  } catch {
    /* some paths are unavailable on headless Linux */
  }
  return roots
}

/** Default delivery folder: <Videos>/MoliCut (created on demand). */
export function defaultExportDir(): string {
  let root = ''
  try {
    root = app.getPath('videos')
  } catch {
    root = ''
  }
  const dir = root ? join(root, 'MoliCut') : join(appPaths().userData, 'exports')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

export function settingsFile(): string {
  return join(appPaths().userData, 'settings.json')
}

export function databaseFile(): string {
  return join(appPaths().userData, 'molicut.sqlite')
}
