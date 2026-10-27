import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { app, BrowserWindow, dialog, shell } from 'electron'
import AdmZip from 'adm-zip'
import si from 'systeminformation'
import type { AppSettings, MediaAsset } from '@shared/schemas'
import type { MetricsSnapshot } from '@shared/schemas'
import { redactSensitive, roundTo } from '@shared/utils'
import { handle, ipcStats } from './registry'
import { backendInfo, recoveryState } from '../services/appInfo'
import { backupDatabase, getDb } from '../services/db'
import { dependencies } from '../services/deps'
import { ffmpeg } from '../services/ffmpeg'
import { hardware } from '../services/hardware'
import { logger } from '../services/logger'
import { media } from '../services/media'
import { appPaths } from '../services/paths'
import { plugins } from '../services/plugins'
import { presets } from '../services/presets'
import { projectService } from '../services/project'
import { queue } from '../services/queue'
import { settings } from '../services/settings'
import { updater } from '../services/updater'
import { watch } from '../services/watchFolders'
import { tray } from '../tray'
import { windows } from '../windows'

let metricsCache: { at: number; value: MetricsSnapshot } | null = null

function dirSize(dir: string): number {
  try {
    return readdirSync(dir, { withFileTypes: true }).reduce((sum, entry) => {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) return sum + dirSize(full)
      try {
        return sum + statSync(full).size
      } catch {
        return sum
      }
    }, 0)
  } catch {
    return 0
  }
}

async function sampleMetrics(): Promise<MetricsSnapshot> {
  if (metricsCache && Date.now() - metricsCache.at < 1500) return metricsCache.value
  const [load, mem] = await Promise.all([si.currentLoad().catch(() => null), si.mem().catch(() => null)])
  const cacheBytes = dirSize(appPaths().thumbnails) + dirSize(appPaths().waveforms) + dirSize(appPaths().proxies)
  const value: MetricsSnapshot = {
    at: new Date().toISOString(),
    cpuPercent: roundTo(load?.currentLoad ?? 0, 1),
    memoryUsedMB: Math.round((mem?.active ?? 0) / 1024 ** 2),
    memoryTotalMB: Math.round((mem?.total ?? 0) / 1024 ** 2),
    gpuPercent: null,
    renderCacheMB: Math.round((cacheBytes / 1024 ** 2) * 10) / 10,
    activeWorkers: queue.runningCount,
    previewFps: 0,
    droppedFrames: 0
  }
  metricsCache = { at: Date.now(), value }
  return value
}

async function importPaths(paths: string[], generateProxies: boolean): Promise<MediaAsset[]> {
  const assets: MediaAsset[] = []
  for (const path of paths) {
    try {
      const asset = await media.probe(path)
      assets.push(asset)
      media.registerRoot(path)
      if (generateProxies && asset.kind === 'video') media.startProxy(asset)
    } catch (err) {
      logger.warn('media', `import failed for ${path}: ${(err as Error).message}`)
      windows.broadcast('toast', { kind: 'warn', message: `Import ignorato: ${basename(path)} — ${(err as Error).message}` })
    }
  }
  return assets
}

function applySettingsSideEffects(updated: AppSettings): void {
  queue.setSettings(updated)
  watch.syncEnabled(updated.watchEnabled)
  if (app.isPackaged) {
    try {
      app.setLoginItemSettings({ openAtLogin: updated.runAtLogin, openAsHidden: updated.startMinimized })
    } catch {
      /* unsupported on some Linux desktop environments */
    }
  }
  windows.broadcast('settings:changed', { settings: updated })
}

async function buildDiagnosticBundle(): Promise<string> {
  const dir = join(appPaths().userData, 'diagnostics')
  mkdirSync(dir, { recursive: true })
  const target = join(dir, `molicut-diagnostic-${Date.now()}.zip`)
  const zip = new AdmZip()
  const report = {
    generatedAt: new Date().toISOString(),
    app: {
      version: app.getVersion(),
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
      platform: process.platform,
      arch: process.arch,
      packaged: app.isPackaged
    },
    hardware: hardware.cachedProfile(),
    dependencies: await dependencies.status(),
    settings: settings.get(),
    ipc: ipcStats(),
    queue: { stats: queue.stats(), jobs: queue.list().slice(0, 200) },
    logs: logger.recent(2000)
  }
  zip.addFile('report.json', Buffer.from(redactSensitive(JSON.stringify(report, null, 2)), 'utf8'))
  const logPath = join(appPaths().logs, 'molicut.log')
  if (existsSync(logPath)) {
    zip.addFile('molicut.log', Buffer.from(redactSensitive(readFileSync(logPath, 'utf8').slice(-2_000_000)), 'utf8'))
  }
  zip.addFile('README.txt', Buffer.from('MoliCut diagnostic bundle. PII redacted. No telemetry was sent.\n', 'utf8'))
  zip.writeZip(target)
  logger.info('debug', `diagnostic bundle written: ${target}`)
  return target
}

export function registerIpcHandlers(): void {
  /* ---------------- app ---------------- */
  handle('app:info', () => ({
    name: app.getName(),
    version: app.getVersion(),
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    userDataPath: app.getPath('userData'),
    isPackaged: app.isPackaged,
    recoveredFromCrash: (() => {
      // One-shot flag: the first renderer that asks gets the recovery offer.
      const recovered = recoveryState.get()
      recoveryState.set(false)
      return recovered
    })(),
    ffmpegAvailable: Boolean(ffmpeg.binaries().ffmpeg.path && (existsSync(ffmpeg.binaries().ffmpeg.path!) || ffmpeg.binaries().ffmpeg.source === 'system')),
    dbDriver: (() => {
      try {
        return getDb().kind
      } catch {
        return 'unknown'
      }
    })()
  }))

  /* ---------------- settings ---------------- */
  handle('settings:get', () => ({ settings: settings.get() }))
  handle('settings:set', (input) => {
    const updated = settings.update(input.patch)
    applySettingsSideEffects(updated)
    return { settings: updated }
  })
  handle('settings:reset', () => {
    const updated = settings.reset()
    applySettingsSideEffects(updated)
    return { settings: updated }
  })

  /* ---------------- project ---------------- */
  handle('project:new', (input) => ({ project: projectService.newProject(input.name) }))
  handle('project:open', async (input) => {
    if (!input.path) throw new Error('Path richiesto')
    const opened = await projectService.open(input.path)
    for (const asset of opened.project.media) media.registerRoot(asset.path)
    return opened
  })
  handle('project:openDialog', async (_input, { event }) => {
    const parent = BrowserWindow.fromWebContents(event.sender)
    const opened = await projectService.openWithDialog(parent)
    for (const asset of opened.project?.media ?? []) media.registerRoot(asset.path)
    return opened
  })
  handle('project:save', async (input, { event }) => {
    const parent = BrowserWindow.fromWebContents(event.sender)
    return projectService.save(parent, input.project, input.path)
  })
  handle('project:autosave', (input) => projectService.autosave(input.project))
  handle('project:recoverAutosave', () => {
    const recovered = projectService.latestAutosave()
    if (!recovered) return null
    for (const asset of recovered.project.media) media.registerRoot(asset.path)
    return recovered
  })
  handle('project:recent', () => ({ items: projectService.recent() }))
  handle('project:exportInterchange', async (input, { event }) => {
    const result = await projectService.exportInterchange(
      BrowserWindow.fromWebContents(event.sender),
      input.project,
      input.sequenceId,
      input.format
    )
    return { path: result.canceled ? null : result.path, canceled: result.canceled }
  })

  /* ---------------- media ---------------- */
  handle('media:importDialog', async (input, { event }) => {
    const parent = BrowserWindow.fromWebContents(event.sender)
    const options: Electron.OpenDialogOptions = {
      title: 'Importa media',
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Media', extensions: ['mp4', 'mov', 'mkv', 'avi', 'webm', 'mxf', 'm4v', 'mts', 'm2ts', 'wav', 'mp3', 'aac', 'flac', 'ogg', 'png', 'jpg', 'jpeg', 'tif', 'tiff', 'exr', 'dpx', 'gif'] },
        { name: 'Tutti i file', extensions: ['*'] }
      ]
    }
    const result = parent ? await dialog.showOpenDialog(parent, options) : await dialog.showOpenDialog(options)
    if (result.canceled || result.filePaths.length === 0) return { assets: [], canceled: true }
    return { assets: await importPaths(result.filePaths, input.generateProxies), canceled: false }
  })
  handle('media:importPaths', async (input) => ({ assets: await importPaths(input.paths, input.generateProxies) }))
  handle('media:probe', async (input) => {
    const asset = await media.probe(input.path)
    media.registerRoot(input.path)
    return { asset }
  })
  handle('media:thumbnail', (input) => media.thumbnail(input.path, input.timeSec))
  handle('media:waveform', (input) => media.waveform(input.path, input.buckets))
  handle('media:relink', async (input) => {
    const asset = await media.probe(input.newPath)
    media.registerRoot(input.newPath)
    return { asset: { ...asset, id: input.assetId } }
  })
  handle('media:chooseRelink', async (input, { event }) => {
    const parent = BrowserWindow.fromWebContents(event.sender)
    const options: Electron.OpenDialogOptions = {
      title: `Rilink ${input.name ?? 'media'}`,
      properties: ['openFile'],
      filters: [{ name: 'Media', extensions: ['mp4', 'mov', 'mkv', 'avi', 'webm', 'mxf', 'wav', 'mp3', 'png', 'jpg', 'exr', 'dpx'] }]
    }
    const result = parent ? await dialog.showOpenDialog(parent, options) : await dialog.showOpenDialog(options)
    if (result.canceled || result.filePaths.length === 0) return { asset: null, canceled: true }
    const asset = await media.probe(result.filePaths[0]!)
    media.registerRoot(result.filePaths[0]!)
    return { asset: { ...asset, id: input.assetId }, canceled: false }
  })
  handle('media:missing', (input) => ({ missing: media.missingFiles(input.paths) }))

  /* ---------------- queue ---------------- */
  handle('queue:list', () => ({
    jobs: queue.list(),
    stats: queue.stats(),
    concurrency: settings.get().maxConcurrentJobs
  }))
  handle('queue:add', async (input) => {
    const jobs = await queue.add(input.items)
    windows.broadcast('toast', {
      kind: 'success',
      message: `${jobs.length} job accodat${jobs.length === 1 ? 'o' : 'i'}`
    })
    return { jobs }
  })
  handle('queue:action', (input) => {
    switch (input.action) {
      case 'pause':
        return { jobs: queue.pause(input.jobId) }
      case 'resume':
        return { jobs: queue.resume(input.jobId) }
      case 'cancel':
        if (!input.jobId) throw new Error('jobId richiesto')
        return { jobs: queue.cancel(input.jobId) }
      case 'retry':
        if (!input.jobId) throw new Error('jobId richiesto')
        return { jobs: queue.retry(input.jobId) }
      case 'remove':
        if (!input.jobId) throw new Error('jobId richiesto')
        return { jobs: queue.remove(input.jobId) }
      case 'duplicate':
        if (!input.jobId) throw new Error('jobId richiesto')
        return { jobs: queue.duplicate(input.jobId) }
      case 'stop-after-current':
        return { jobs: queue.setStopAfterCurrent(input.value ?? true) }
      case 'pause-all':
        return { jobs: queue.pause() }
      case 'resume-all':
        return { jobs: queue.resume() }
      case 'clear-finished':
        return { jobs: queue.clearFinished() }
      default:
        throw new Error('Azione non supportata')
    }
  })
  handle('queue:reorder', (input) => ({ jobs: queue.reorder(input.jobId, input.toIndex) }))
  handle('queue:setPriority', (input) => ({ jobs: queue.setPriority(input.jobId, input.priority) }))
  handle('queue:setConcurrency', (input) => {
    const updated = settings.update({ maxConcurrentJobs: input.value })
    queue.setSettings(updated)
    return { jobs: queue.setConcurrency(input.value) }
  })
  handle('queue:openWindow', () => {
    windows.showQueue()
    return { ok: true as const }
  })
  handle('queue:exportReport', async (input, { event }) => {
    const parent = BrowserWindow.fromWebContents(event.sender)
    const ext = input.format === 'json' ? 'json' : 'csv'
    const options: Electron.SaveDialogOptions = {
      title: 'Esporta report coda',
      defaultPath: join(appPaths().userData, `molicut-report-${Date.now()}.${ext}`),
      filters: [{ name: ext.toUpperCase(), extensions: [ext] }]
    }
    const result = parent ? await dialog.showSaveDialog(parent, options) : await dialog.showSaveDialog(options)
    if (result.canceled || !result.filePath) return { path: '', canceled: true }
    writeFileSync(result.filePath, queue.exportReport(input.format, input.jobIds), 'utf8')
    return { path: result.filePath, canceled: false }
  })

  /* ---------------- presets ---------------- */
  handle('presets:list', () => ({ presets: presets.list() }))
  handle('presets:save', (input) => ({ preset: presets.save(input.preset) }))
  handle('presets:delete', (input) => ({ presets: presets.delete(input.id) }))
  handle('presets:export', async (input, { event }) => {
    const parent = BrowserWindow.fromWebContents(event.sender)
    const options: Electron.SaveDialogOptions = {
      title: 'Esporta preset',
      defaultPath: join(appPaths().userData, 'molicut-presets.json'),
      filters: [{ name: 'JSON', extensions: ['json'] }]
    }
    const result = parent ? await dialog.showSaveDialog(parent, options) : await dialog.showSaveDialog(options)
    if (result.canceled || !result.filePath) return { path: null, canceled: true }
    presets.exportToFile(result.filePath, input.ids)
    return { path: result.filePath, canceled: false }
  })
  handle('presets:import', async (_input, { event }) => {
    const parent = BrowserWindow.fromWebContents(event.sender)
    const options: Electron.OpenDialogOptions = {
      title: 'Importa preset',
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }]
    }
    const result = parent ? await dialog.showOpenDialog(parent, options) : await dialog.showOpenDialog(options)
    if (result.canceled || result.filePaths.length === 0) return { presets: [], canceled: true }
    return { presets: presets.importFromFile(result.filePaths[0]!), canceled: false }
  })
  handle('presets:suggest', (input) => ({ presets: presets.suggest(input.asset) }))

  /* ---------------- watch folders ---------------- */
  handle('watch:list', () => ({ folders: watch.list() }))
  handle('watch:add', (input) => ({ folder: watch.add(input.folder) }))
  handle('watch:update', (input) => ({ folder: watch.update(input.folder) }))
  handle('watch:remove', (input) => ({ folders: watch.remove(input.id) }))
  handle('watch:logs', (input) => ({ logs: watch.logs(input.limit) }))
  handle('watch:test', (input) => watch.test(input.id))

  /* ---------------- system / hardware ---------------- */
  handle('system:profile', () => ({ profile: hardware.cachedProfile() }))
  handle('system:scan', async (input) => {
    const profile = await hardware.scan(input.force, (stage, percent, message) => {
      windows.broadcast('scan:progress', { stage, percent, message })
    })
    windows.broadcast('toast', {
      kind: 'info',
      message: `Hardware: ${profile.gpus[0]?.model ?? profile.cpu.brand} · backend ${profile.acceleration.preferredBackend}`
    })
    return { profile }
  })
  handle('system:benchmark', () => hardware.benchmark())
  handle('system:testEncoder', (input) => {
    const test = hardware.testEncoder(input.encoderId, input.codec)
    return test.then((t) => ({
      encoderId: input.encoderId,
      ok: t.ok,
      encodeFps: t.fps,
      detail: t.detail,
      durationMs: t.ms
    }))
  })

  /* ---------------- dependencies ---------------- */
  handle('deps:status', async () => ({ dependencies: await dependencies.status() }))
  handle('deps:download', (input) => dependencies.download(input.component))

  /* ---------------- debug ---------------- */
  handle('debug:logs', (input) => ({ logs: logger.recent(input.limit, input.level) }))
  handle('debug:clientError', (input) => {
    // Renderer failures are isolated and logged, never re-thrown in main.
    const where = input.source ?? 'renderer'
    const detail = [input.message, input.stack, input.componentStack].filter(Boolean).join('\n')
    logger.error('renderer', `[${where}] ${detail}`.slice(0, 20_000))
    return { ok: true }
  })
  handle('debug:ipcStats', () => ipcStats())
  handle('debug:metrics', () => sampleMetrics())
  handle('debug:action', async (input) => {
    switch (input.action) {
      case 'reset-cache': {
        for (const dir of [appPaths().thumbnails, appPaths().waveforms, appPaths().cache]) {
          rmSync(dir, { recursive: true, force: true })
          mkdirSync(dir, { recursive: true })
        }
        return { ok: true, detail: 'Cache thumbnail, waveform e render svuotata.' }
      }
      case 'regenerate-proxies': {
        rmSync(appPaths().proxies, { recursive: true, force: true })
        mkdirSync(appPaths().proxies, { recursive: true })
        return { ok: true, detail: 'Proxy eliminati: verranno rigenerati al prossimo import (vedi ROADMAP MEDIA-3).' }
      }
      case 'flush-shaders':
        windows.broadcast('toast', { kind: 'info', message: 'Flush shader cache richiesto al renderer' })
        return { ok: true, detail: 'Richiesta inviata al renderer (WebGL2/WebGPU context reset).' }
      case 'restart-engine': {
        ffmpeg.invalidate()
        await hardware.scan(true, (stage, percent, message) => windows.broadcast('scan:progress', { stage, percent, message }))
        backendInfo.reset()
        return { ok: true, detail: 'Motore media riavviato: binari ri-risolti e hardware riscansionato.' }
      }
      case 'redetect-hardware': {
        const profile = await hardware.scan(true, (stage, percent, message) => windows.broadcast('scan:progress', { stage, percent, message }))
        backendInfo.set(profile.acceleration.preferredBackend)
        return { ok: true, detail: `Encoder rilevati: ${profile.encoders.filter((e) => e.available).map((e) => e.id).join(', ')}` }
      }
      case 'repair-queue-db': {
        const backup = backupDatabase('pre-repair')
        getDb().prepare("UPDATE queue_jobs SET state = 'queued' WHERE state = 'running'").run()
        return { ok: true, detail: `Coda riparata. Backup: ${backup ?? 'non creato (DB assente)'}` }
      }
      case 'safe-mode-on': {
        applySettingsSideEffects(settings.update({ safeMode: true }))
        queue.pause()
        return { ok: true, detail: 'Safe mode attivo: plugin, GPU e automazioni disabilitati. Riavvia per applicare tutto.' }
      }
      case 'safe-mode-off': {
        applySettingsSideEffects(settings.update({ safeMode: false }))
        return { ok: true, detail: 'Safe mode disattivato.' }
      }
      case 'clear-logs':
        logger.clear()
        return { ok: true, detail: 'Buffer log svuotato.' }
      default:
        throw new Error('Azione debug non supportata')
    }
  })
  handle('debug:bundle', async () => ({ path: await buildDiagnosticBundle() }))

  /* ---------------- window / shell ---------------- */
  handle('window:control', (input, { event }) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    switch (input.action) {
      case 'minimize':
        win?.minimize()
        break
      case 'maximize':
        if (win?.isMaximized()) win.unmaximize()
        else win?.maximize()
        break
      case 'close':
        win?.close()
        break
      case 'toggle-devtools':
        if (win && (!app.isPackaged || process.env.MOLICUT_DEVTOOLS === '1')) win.webContents.toggleDevTools()
        break
      case 'open-queue':
        windows.showQueue()
        break
      case 'open-editor':
        windows.showMain()
        break
    }
    return { ok: true as const }
  })
  handle('shell:reveal', (input) => {
    if (!existsSync(input.path)) throw new Error('Path non trovato')
    shell.showItemInFolder(input.path)
    return { ok: true as const }
  })

  /* ---------------- updater ---------------- */
  handle('updater:check', () => updater.check())
  handle('updater:install', () => {
    updater.install()
    return { ok: true as const }
  })

  /* ---------------- plugins ---------------- */
  handle('plugins:list', () => ({ plugins: plugins.list() }))
  handle('plugins:install', async (input) => ({ plugin: await plugins.install(input.path) }))
  handle('plugins:toggle', (input) => ({ plugins: plugins.toggle(input.id, input.enabled) }))

  logger.info('ipc', 'handlers registered')
  void tray
}
