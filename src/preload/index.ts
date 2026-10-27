import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { EVENT_NAME_LIST, IPC_CHANNEL_LIST } from '../shared/channelList'
import type { IpcResult, MolicutBridge } from '../shared/ipc'

/**
 * Security boundary. The renderer gets:
 *  - a whitelist of invoke channels derived from the IPC contract,
 *  - a whitelist of push events,
 *  - no Node, no ipcRenderer, no remote, no arbitrary channel names.
 * Every payload is still validated in the main process: this bridge is a
 * convenience boundary, not the trust boundary.
 */

const channels = new Set<string>(IPC_CHANNEL_LIST)
const events = new Set<string>(EVENT_NAME_LIST)

const bridge: MolicutBridge = {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
  },
  isMock: false,
  getPathForFile(file: File): string {
    try {
      return webUtils.getPathForFile(file)
    } catch {
      return ''
    }
  },
  invoke(channel: string, payload: unknown): Promise<IpcResult<unknown>> {
    if (!channels.has(channel)) {
      return Promise.resolve({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: `Canale IPC non autorizzato: ${channel}` }
      })
    }
    return ipcRenderer.invoke(channel, payload) as Promise<IpcResult<unknown>>
  },
  on(event: string, listener: (payload: unknown) => void): () => void {
    if (!events.has(event)) throw new Error(`Evento non autorizzato: ${event}`)
    const wrapped = (_event: Electron.IpcRendererEvent, payload: unknown): void => listener(payload)
    ipcRenderer.on(event, wrapped)
    return () => ipcRenderer.removeListener(event, wrapped)
  }
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('molicut', bridge)
} else {
  // contextIsolation is always enabled in this app; this fallback exists only
  // so a misconfiguration fails loudly in development.
  throw new Error('contextIsolation must be enabled')
}
