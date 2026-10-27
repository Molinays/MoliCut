/// <reference types="vite/client" />

import type { MolicutBridge } from '../../shared/ipc'
import type { useProjectStore } from './store/projectStore'

declare global {
  interface Window {
    molicut?: MolicutBridge
    /**
     * E2E/debug seam: the renderer-only project store. Lets Playwright drive
     * imports and clip placement without native file dialogs. Holds no
     * privileges — every action is the same one the UI performs, and the main
     * process validates all IPC independently.
     */
    __stores?: { project: typeof useProjectStore }
  }
}

export {}
