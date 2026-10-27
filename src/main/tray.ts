import { join } from 'node:path'
import { app, Menu, nativeImage, Notification, Tray } from 'electron'
import { logger } from './services/logger'
import { queue } from './services/queue'
import { settings } from './services/settings'
import { windows } from './windows'

/**
 * Tray / background mode. The queue lives in the main process, so closing the
 * editor never interrupts rendering. The tray exposes queue controls, live
 * progress in the tooltip, native notifications and the quit action.
 */
export class TrayController {
  private tray: Tray | null = null
  private interval: NodeJS.Timeout | null = null

  create(): void {
    if (this.tray) return
    try {
      const icon = nativeImage.createFromPath(join(app.getAppPath(), 'resources', 'icon.png')).resize({ width: 32, height: 32 })
      this.tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon)
      this.tray.on('click', () => windows.showMain())
      this.tray.on('double-click', () => windows.showMain())
      this.rebuild()
      this.interval = setInterval(() => this.rebuild(), 5000)
      this.interval.unref?.()
      logger.info('tray', 'tray icon created')
    } catch (err) {
      logger.warn('tray', `tray unavailable: ${(err as Error).message}`)
    }
  }

  private rebuild(): void {
    if (!this.tray) return
    const stats = queue.stats()
    const paused = stats.paused > 0
    this.tray.setToolTip(
      stats.running > 0 || stats.queued > 0
        ? `MoliCut — ${stats.running} attivi / ${stats.queued} in coda (${stats.progress}%)`
        : 'MoliCut'
    )
    if (process.platform === 'darwin' || process.platform === 'linux') {
      try {
        app.setBadgeCount(stats.running + stats.queued)
      } catch {
        /* unsupported */
      }
    }
    const menu = Menu.buildFromTemplate([
      { label: 'Apri MoliCut', click: () => windows.showMain() },
      { label: 'Render Queue', click: () => windows.showQueue() },
      { type: 'separator' },
      { label: `In coda: ${stats.queued} · Attivi: ${stats.running} · Errori: ${stats.error}`, enabled: false },
      {
        label: paused ? 'Riprendi tutta la coda' : 'Metti in pausa la coda',
        enabled: stats.running + stats.queued + stats.paused > 0,
        click: () => {
          if (paused) queue.resume()
          else queue.pause()
          this.rebuild()
        }
      },
      { label: 'Apri cartella export', click: () => void import('electron').then(({ shell }) => shell.openPath(join(app.getPath('userData'), 'exports'))) },
      { type: 'separator' },
      {
        label: 'Esci',
        click: () => {
          windows.isQuitting = true
          app.quit()
        }
      }
    ])
    this.tray.setContextMenu(menu)
  }

  notify(title: string, body: string, kind: 'success' | 'error' | 'info' = 'info'): void {
    if (!settings.get().notifications) return
    if (!Notification.isSupported()) return
    try {
      const notification = new Notification({ title, body: body.slice(0, 400), urgency: kind === 'error' ? 'critical' : 'normal' })
      notification.on('click', () => windows.showQueue())
      notification.show()
    } catch (err) {
      logger.warn('tray', `notification failed: ${(err as Error).message}`)
    }
  }

  destroy(): void {
    if (this.interval) clearInterval(this.interval)
    this.interval = null
    this.tray?.destroy()
    this.tray = null
  }
}

export const tray = new TrayController()
