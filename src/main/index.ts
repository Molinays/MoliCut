import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { app, BrowserWindow, dialog, Menu, session } from 'electron'
import { registerIpcHandlers } from './ipc'
import { backendInfo, recoveryState } from './services/appInfo'
import { closeDatabase, initDatabase } from './services/db'
import { hardware } from './services/hardware'
import { logger } from './services/logger'
import { media } from './services/media'
import { appPaths, ensureAppDirs } from './services/paths'
import { queue } from './services/queue'
import {
  applySessionHardening,
  hardenWindow,
  registerMediaProtocol,
  registerPrivilegedSchemes,
  setMediaRoots
} from './services/security'
import { settings } from './services/settings'
import { watch } from './services/watchFolders'
import { tray } from './tray'
import { windows } from './windows'

/**
 * Main process bootstrap. Engineering rules:
 *  - no heavy work on the main thread (only orchestration + IPC);
 *  - security policy applied before the first window exists;
 *  - the queue starts before the UI so background rendering survives crashes.
 */

app.setName('MoliCut')
if (process.platform === 'win32') app.setAppUserModelId('studio.molicut.app')
if (process.env.MOLICUT_USER_DATA) app.setPath('userData', process.env.MOLICUT_USER_DATA)

// GPU-first: Chromium rasterises and composites on the GPU when available.
// No `ignore-gpu-blocklist` on purpose: forcing an unsupported driver is a
// stability risk; detection + explicit fallback is safer (SECURITY/PERF docs).
app.commandLine.appendSwitch('enable-gpu-rasterization')
app.commandLine.appendSwitch('enable-zero-copy')

registerPrivilegedSchemes()

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => windows.showMain())

  process.on('uncaughtException', (err) => {
    logger.error('main', `uncaught exception: ${err.stack ?? err.message}`)
    try {
      const dir = join(app.getPath('userData'), 'logs')
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, `uncaught-${Date.now()}.json`), JSON.stringify({ at: new Date().toISOString(), message: err.message, stack: err.stack }, null, 2))
    } catch {
      /* logging must never mask the original failure */
    }
  })
  process.on('unhandledRejection', (reason) => {
    logger.error('main', `unhandled rejection: ${String(reason)}`)
  })

  app.whenReady().then(async () => {
    ensureAppDirs()
    recoveredFromCrash = detectUncleanShutdown()
    recoveryState.set(recoveredFromCrash)
    await initDatabase()
    settings.init()
    logger.info('main', `MoliCut ${app.getVersion()} starting (${process.platform}-${process.arch})`)

    // Queue first: background rendering is independent from the editor window.
    queue.setEvents({
      changed: (jobs, stats) => windows.broadcast('queue:changed', { jobs, stats }),
      progress: (jobId, p) =>
        windows.broadcast('queue:progress', {
          jobId,
          progress: p.percent,
          fps: p.fps,
          speed: p.speed,
          etaSec: p.etaSec,
          sizeBytes: p.sizeBytes
        }),
      log: (jobId, line) => windows.broadcast('queue:log', { jobId, line }),
      notify: (title, body, kind) => tray.notify(title, body, kind),
      fallback: (message) => windows.broadcast('toast', { kind: 'warn', message })
    })
    queue.init(settings.get())

    watch.setSettingsProvider(() => settings.get())
    watch.onLog = (entry) => windows.broadcast('watch:log', entry)
    watch.init()

    media.onProxyReady = (mediaId, proxyPath) => windows.broadcast('media:proxy-ready', { mediaId, proxyPath })
    setMediaRoots(() => media.mediaRoots())

    applySessionHardening(session.defaultSession)
    registerMediaProtocol()
    registerIpcHandlers()

    Menu.setApplicationMenu(null)
    windows.createMainWindow()
    tray.create()

    logger.subscribe((entry) => windows.broadcast('log', entry))

    app.on('web-contents-created', (_event, contents) => {
      contents.setWindowOpenHandler(() => ({ action: 'deny' }))
      contents.on('will-navigate', (event) => event.preventDefault())
    })

    app.on('render-process-gone', (_event, _contents, details) => {
      logger.error('main', `renderer crashed: ${details.reason}`)
      try {
        const crashDir = appPaths().logs
        mkdirSync(crashDir, { recursive: true })
        writeFileSync(join(crashDir, `crash-${Date.now()}.json`), JSON.stringify(details, null, 2), 'utf8')
      } catch {
        /* ignore */
      }
    })
    app.on('child-process-gone', (_event, details) => {
      if (details.reason === 'clean-exit') return
      logger.warn('main', `child process gone: ${details.type} ${details.reason}`)
      if (details.type === 'GPU') {
        windows.broadcast('toast', {
          kind: 'warn',
          message: 'Processo GPU riavviato: la preview continua in fallback. Controlla la scheda Debug ▸ GPU.'
        })
      }
    })

    app.on('activate', () => windows.showMain())

    // Non-blocking hardware scan; the UI is already interactive.
    setTimeout(() => {
      void hardware
        .scan(false, (stage, percent, message) => windows.broadcast('scan:progress', { stage, percent, message }))
        .then((profile) => {
          backendInfo.set(profile.acceleration.preferredBackend)
          logger.info('main', `acceleration strategy: ${profile.acceleration.preferredBackend}`)
          if (!settings.isSafeMode()) {
            const backend = profile.acceleration.preferredBackend
            windows.broadcast('toast', {
              kind: backend === 'software' ? 'warn' : 'success',
              message:
                backend === 'software'
                  ? 'Nessun encoder hardware: export e preview useranno la CPU (fallback esplicito).'
                  : `Accelerazione hardware attiva: ${backend.toUpperCase()}`
            })
          }
        })
        .catch((err) => logger.error('main', `hardware scan failed: ${(err as Error).message}`))
    }, 900)

    if (recoveredFromCrash) {
      setTimeout(() => {
        windows.broadcast('toast', {
          kind: 'warn',
          message: 'MoliCut ripristinato dopo una chiusura imprevista. Recupero l’ultimo autosave disponibile.'
        })
      }, 1600)
    }

    logger.info('main', 'ready')
  }).catch((err) => {
    const error = err instanceof Error ? err : new Error(String(err))
    logger.error('main', `bootstrap failed: ${error.stack ?? error.message}`)
    dialog.showErrorBox(
      'MoliCut non è riuscito ad avviarsi',
      `${error.message}\n\nAvvia con MOLICUT_SAFE_MODE=1 per disattivare accelerazione hardware e plugin.`
    )
    app.quit()
  })

  app.on('window-all-closed', () => {
    if (process.platform === 'darwin') return
    const active = queue.list().some((j) => ['queued', 'running', 'paused'].includes(j.state))
    if (!active) app.quit()
  })

  let shuttingDown = false
  app.on('before-quit', (event) => {
    if (shuttingDown) return
    event.preventDefault()
    shuttingDown = true
    windows.isQuitting = true
    logger.info('main', 'shutdown requested')
    void (async () => {
      try {
        await queue.shutdown()
        watch.stopAll()
        tray.destroy()
        closeDatabase()
      } catch (err) {
        logger.error('main', `shutdown error: ${(err as Error).message}`)
      } finally {
        markCleanShutdown()
        app.quit()
      }
    })()
  })
}

let recoveredFromCrash = false

function sessionMarkerPath(): string {
  return join(app.getPath('userData'), 'logs', 'session.json')
}

/** A marker written at boot and cleared on clean quit detects hard crashes. */
function detectUncleanShutdown(): boolean {
  const marker = sessionMarkerPath()
  let unclean = false
  try {
    if (existsSync(marker)) {
      const parsed = JSON.parse(readFileSync(marker, 'utf8')) as { clean?: boolean }
      unclean = parsed.clean === false
    }
  } catch {
    unclean = false
  }
  try {
    mkdirSync(join(app.getPath('userData'), 'logs'), { recursive: true })
    writeFileSync(marker, JSON.stringify({ clean: false, pid: process.pid, startedAt: new Date().toISOString() }, null, 2))
  } catch {
    /* read-only profile: not fatal */
  }
  return unclean
}

function markCleanShutdown(): void {
  try {
    writeFileSync(sessionMarkerPath(), JSON.stringify({ clean: true, at: new Date().toISOString() }, null, 2))
  } catch {
    /* ignore */
  }
}

// Exported for Playwright E2E helpers.
export function trustedWindows(): BrowserWindow[] {
  return windows.allWindows()
}
export { hardenWindow }
