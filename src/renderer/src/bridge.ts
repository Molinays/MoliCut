import type { EventName, EventPayload, IpcChannel, IpcInput, IpcOutput, IpcResult, MolicutBridge } from '@shared/ipc'
import { eventNames } from '@shared/ipc'
import { createMockBridge } from './mock/mockBridge'

/**
 * Renderer-side IPC facade.
 * - Electron: forwards to the preload whitelist.
 * - Browser (design preview / Playwright web): in-memory mock with the same
 *   shape, so components never branch on environment.
 */

export class BridgeError extends Error {
  code: string
  details?: unknown
  constructor(code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'BridgeError'
    this.code = code
    this.details = details
  }
}

let mock: MolicutBridge | null = null
const bridge = (): MolicutBridge => {
  if (window.molicut) return window.molicut
  mock ??= createMockBridge()
  return mock
}

export const isMock = (): boolean => !window.molicut
export const platform = (): string => bridge().platform

/** Resolve the OS path of a dropped File (Electron 32+ removed File.path). */
export function filePath(file: File): string {
  return bridge().getPathForFile(file)
}

export async function call<C extends IpcChannel>(channel: C, payload: IpcInput<C>): Promise<IpcOutput<C>> {
  let result: IpcResult<unknown>
  try {
    result = await bridge().invoke(channel, payload)
  } catch (err) {
    throw new BridgeError('TRANSPORT', (err as Error).message)
  }
  if (!result.ok) throw new BridgeError(result.error.code, result.error.message, result.error.details)
  return result.data as IpcOutput<C>
}

export function on<E extends EventName>(event: E, listener: (payload: EventPayload<E>) => void): () => void {
  return bridge().on(event, (payload) => listener(payload as EventPayload<E>))
}

export function mediaSrc(path: string): string {
  if (isMock()) return ''
  return `molicut-media://media/${encodeURIComponent(path)}`
}

export { eventNames }
