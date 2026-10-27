import { app } from 'electron'
import { logger } from './logger'
import { settings } from './settings'

type Status = 'disabled' | 'checking' | 'none' | 'available' | 'error'

export interface UpdateStatus {
  status: Status
  version?: string
  message?: string
}

/**
 * Updates are only enabled in packaged builds with signing configured.
 * electron-updater verifies the publisher signature of the downloaded package
 * and refuses unsigned builds; rollback is handled by re-installing the
 * previous signed DMG/NSIS package if a launch fails (documented operation).
 */
class UpdaterService {
  private status: UpdateStatus = { status: 'disabled', message: 'Updater attivo solo nei pacchetti firmati' }
  private updater: import('electron-updater').AppUpdater | null = null

  private async load(): Promise<import('electron-updater').AppUpdater | null> {
    if (!app.isPackaged || settings.isSafeMode() || process.env.MOLICUT_DISABLE_UPDATER === '1') return null
    if (this.updater) return this.updater
    const { autoUpdater } = await import('electron-updater')
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.allowPrerelease = false
    autoUpdater.on('checking-for-update', () => {
      this.status = { status: 'checking' }
    })
    autoUpdater.on('update-not-available', () => {
      this.status = { status: 'none' }
    })
    autoUpdater.on('update-available', (info) => {
      this.status = { status: 'available', version: info.version }
      logger.info('updater', `update available: ${info.version}`)
    })
    autoUpdater.on('error', (err) => {
      this.status = { status: 'error', message: err.message }
      logger.warn('updater', `error: ${err.message}`)
    })
    this.updater = autoUpdater
    return autoUpdater
  }

  async check(): Promise<UpdateStatus> {
    const updater = await this.load()
    if (!updater) return this.status
    try {
      const result = await updater.checkForUpdates()
      if (result?.updateInfo) {
        this.status = {
          status: result.updateInfo.version === app.getVersion() ? 'none' : 'available',
          version: result.updateInfo.version
        }
      }
      return { ...this.status, message: this.status.message ?? (this.status.status === 'none' ? 'Nessun aggiornamento disponibile' : undefined) }
    } catch (err) {
      this.status = { status: 'error', message: (err as Error).message }
      return this.status
    }
  }

  install(): void {
    if (!this.updater) throw new Error('Updater non inizializzato')
    this.updater.quitAndInstall(true, true)
  }
}

export const updater = new UpdaterService()
