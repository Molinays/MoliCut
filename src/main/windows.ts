import { join } from 'node:path'
import { app, BrowserWindow, dialog, shell } from 'electron'
import { recoveryState } from './services/appInfo'
import { hardenWindow, trustWebContents, untrustWebContents } from './services/security'
import { logger } from './services/logger'
import { queue } from './services/queue'
import { settings } from './services/settings'

/**
 * Window management. Two independent renderer surfaces share the same bundle
 * (`?view=editor|queue`), so they also share the same React code and stores
 * while keeping separate OS windows (Media Encoder parity).
 */

const isMac = process.platform === 'darwin'

export class WindowManager {
  mainWindow: BrowserWindow | null = null
  queueWindow: BrowserWindow | null = null
  isQuitting = false
  private crashTimes = new Map<number, number[]>()
  private loadFailures = new Map<number, number>()

  private baseWebPreferences(): Electron.WebPreferences {
    return {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false,
      devTools: !app.isPackaged || process.env.MOLICUT_DEVTOOLS === '1',
      webviewTag: false,
      safeDialogs: true,
      navigateOnDragDrop: false
    }
  }

  private allowedPrefixes(): string[] {
    const dev = process.env.ELECTRON_RENDERER_URL
    return dev ? [dev] : ['file://']
  }

  createMainWindow(): BrowserWindow {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) return this.mainWindow
    const startHidden = settings.get().startMinimized || settings.get().runAtLogin
    const win = new BrowserWindow({
      width: 1480,
      height: 920,
      minWidth: 920,
      minHeight: 560,
      show: false,
      resizable: true,
      maximizable: true,
      minimizable: true,
      fullscreenable: true,
      // Frameless windows need the native thick frame on Windows to expose
      // the OS resize border; otherwise the edge drag does nothing.
      thickFrame: true,
      backgroundColor: '#0e0f13',
      title: 'MoliCut',
      icon: join(app.getAppPath(), 'resources', 'icon.png'),
      ...(isMac ? { titleBarStyle: 'hidden' as const, trafficLightPosition: { x: 14, y: 14 } } : { frame: false }),
      webPreferences: this.baseWebPreferences()
    })
    this.mainWindow = win
    const winId = win.id
    const contentsId = win.webContents.id
    trustWebContents(contentsId)
    hardenWindow(win, this.allowedPrefixes())
    this.installCrashRecovery(win)
    win.on('ready-to-show', () => {
      if (!startHidden) win.show()
    })
    win.on('close', (event) => {
      if (this.isQuitting) return
      const active = queue.list().some((j) => j.state === 'queued' || j.state === 'running' || j.state === 'paused')
      if (active) {
        event.preventDefault()
        win.hide()
        logger.info('windows', 'editor hidden: queue still active (background mode)')
      } else {
        this.isQuitting = true
        app.quit()
      }
    })
    win.on('closed', () => {
      // webContents is already destroyed here: never touch win.webContents.
      this.crashTimes.delete(winId)
      this.loadFailures.delete(winId)
      untrustWebContents(contentsId)
      this.mainWindow = null
    })
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (/^https:\/\//.test(url)) void shell.openExternal(url)
      return { action: 'deny' }
    })
    this.load(win, 'editor')
    return win
  }

  createQueueWindow(): BrowserWindow {
    if (this.queueWindow && !this.queueWindow.isDestroyed()) {
      this.queueWindow.show()
      this.queueWindow.focus()
      return this.queueWindow
    }
    const win = new BrowserWindow({
      width: 1320,
      height: 820,
      minWidth: 820,
      minHeight: 520,
      show: false,
      resizable: true,
      maximizable: true,
      minimizable: true,
      fullscreenable: true,
      thickFrame: true,
      backgroundColor: '#0e0f13',
      title: 'MoliCut — Render Queue',
      icon: join(app.getAppPath(), 'resources', 'icon.png'),
      ...(isMac ? { titleBarStyle: 'hidden' as const, trafficLightPosition: { x: 14, y: 14 } } : { frame: false }),
      webPreferences: this.baseWebPreferences()
    })
    this.queueWindow = win
    const winId = win.id
    const contentsId = win.webContents.id
    trustWebContents(contentsId)
    hardenWindow(win, this.allowedPrefixes())
    this.installCrashRecovery(win)
    win.on('ready-to-show', () => win.show())
    win.on('close', (event) => {
      if (this.isQuitting) return
      // Hiding keeps the renderer (and its live progress) alive in background.
      event.preventDefault()
      win.hide()
    })
    win.on('closed', () => {
      this.crashTimes.delete(winId)
      this.loadFailures.delete(winId)
      untrustWebContents(contentsId)
      this.queueWindow = null
    })
    this.load(win, 'queue')
    return win
  }

  /**
   * Renderer resilience: a crashed surface is reloaded a bounded number of
   * times, an unresponsive one offers a human decision, and neither path can
   * spin forever. Queue rendering lives in main, so it keeps running.
   */
  private installCrashRecovery(win: BrowserWindow): void {
    const wc = win.webContents
    const view = (): 'editor' | 'queue' => (win === this.queueWindow ? 'queue' : 'editor')
    let dialogOpen = false

    wc.on('render-process-gone', (_event, details) => {
      if (this.isQuitting || details.reason === 'clean-exit') return
      const now = Date.now()
      const recent = (this.crashTimes.get(win.id) ?? []).filter((at) => now - at < 60_000)
      recent.push(now)
      this.crashTimes.set(win.id, recent)
      logger.error('windows', `${view()} renderer gone (${details.reason}), attempt ${recent.length}/3`)
      // The reloaded editor should offer the newest autosave instead of a blank project.
      if (view() === 'editor') recoveryState.set(true)

      if (recent.length > 3) {
        dialog.showErrorBox(
          'MoliCut — ripristino non riuscito',
          'La finestra continua a chiudersi. I job in coda restano al sicuro nel processo principale.\n\nRiavvia MoliCut; se il problema persiste avvia in Safe Mode con MOLICUT_SAFE_MODE=1.'
        )
        return
      }
      setTimeout(() => {
        if (!win.isDestroyed() && !this.isQuitting) this.load(win, view())
      }, 350 * recent.length)
    })

    wc.on('unresponsive', () => {
      if (dialogOpen || this.isQuitting) return
      dialogOpen = true
      logger.warn('windows', `${view()} renderer unresponsive`)
      void dialog
        .showMessageBox(win, {
          type: 'warning',
          title: 'MoliCut non risponde',
          message: 'La finestra è temporaneamente bloccata.',
          detail: 'Puoi attendere oppure ricaricare la finestra. La coda di rendering non viene interrotta.',
          buttons: ['Attendi', 'Ricarica finestra'],
          defaultId: 0,
          cancelId: 0
        })
        .then(({ response }) => {
          if (response === 1 && !win.isDestroyed()) win.reload()
        })
        .finally(() => {
          dialogOpen = false
        })
    })

    wc.on('did-fail-load', (_event, code, description, _url, isMainFrame) => {
      if (!isMainFrame || code === -3 || this.isQuitting) return
      const failures = (this.loadFailures.get(win.id) ?? 0) + 1
      this.loadFailures.set(win.id, failures)
      logger.error('windows', `${view()} load failed (${code} ${description}), attempt ${failures}/2`)
      if (failures <= 2) {
        setTimeout(() => {
          if (!win.isDestroyed()) this.load(win, view())
        }, 500 * failures)
      } else {
        dialog.showErrorBox('MoliCut — caricamento fallito', `Impossibile caricare l'interfaccia (${code} ${description}).`)
      }
    })

    wc.on('did-finish-load', () => this.loadFailures.set(win.id, 0))
  }

  private load(win: BrowserWindow, view: 'editor' | 'queue'): void {
    const devUrl = process.env.ELECTRON_RENDERER_URL
    if (devUrl) {
      void win.loadURL(`${devUrl}?view=${view}`)
    } else {
      void win.loadFile(join(__dirname, '../renderer/index.html'), { query: { view } })
    }
  }

  showMain(): void {
    const win = this.mainWindow && !this.mainWindow.isDestroyed() ? this.mainWindow : this.createMainWindow()
    win.show()
    win.focus()
  }

  showQueue(): void {
    const win = this.queueWindow && !this.queueWindow.isDestroyed() ? this.queueWindow : this.createQueueWindow()
    win.show()
    win.focus()
  }

  toggleQueue(): void {
    if (this.queueWindow?.isVisible()) this.queueWindow.hide()
    else this.showQueue()
  }

  broadcast(channel: string, payload: unknown): void {
    for (const win of [this.mainWindow, this.queueWindow]) {
      if (win && !win.isDestroyed() && !win.webContents.isDestroyed()) {
        win.webContents.send(channel, payload)
      }
    }
  }

  allWindows(): BrowserWindow[] {
    return [this.mainWindow, this.queueWindow].filter((w): w is BrowserWindow => Boolean(w && !w.isDestroyed()))
  }
}

export const windows = new WindowManager()
