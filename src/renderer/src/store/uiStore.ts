import { create } from 'zustand'
import type { AppSettings } from '@shared/schemas'
import { defaultSettings } from '@shared/schemas'
import { call, on } from '../bridge'
import { applyTheme } from '../theme'
import { setLanguage } from '../i18n'

export type ModalKind = 'export' | 'settings' | 'debug' | 'palette' | 'onboarding' | null
export type InspectorTab = 'video' | 'audio' | 'color' | 'effects'
export type DebugTab = 'system' | 'gpu' | 'deps' | 'logs' | 'actions'

export interface Toast {
  id: string
  kind: 'info' | 'success' | 'warn' | 'error'
  message: string
}

interface UiState {
  settings: AppSettings
  loaded: boolean
  modal: ModalKind
  modalPayload: Record<string, unknown> | null
  toasts: Toast[]
  inspectorTab: InspectorTab
  debugTab: DebugTab
  showScopes: boolean
  showSafeArea: boolean
  mediaView: 'grid' | 'list'
  mediaSearch: string
  /** Media card currently dragged to the timeline (DataTransfer hides data during dragover). */
  draggedMediaId: string | null
  onboardingDone: boolean
  init: () => Promise<void>
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>
  openModal: (modal: ModalKind, payload?: Record<string, unknown>) => void
  closeModal: () => void
  toast: (kind: Toast['kind'], message: string) => void
  dismissToast: (id: string) => void
  setInspectorTab: (tab: InspectorTab) => void
  setDebugTab: (tab: DebugTab) => void
  toggleScopes: () => void
  toggleSafeArea: () => void
  setMediaView: (view: 'grid' | 'list') => void
  setMediaSearch: (search: string) => void
  setDraggedMediaId: (mediaId: string | null) => void
  completeOnboarding: () => void
}

let subscribed = false

export const useUiStore = create<UiState>((set, get) => ({
  settings: defaultSettings,
  loaded: false,
  modal: null,
  modalPayload: null,
  toasts: [],
  inspectorTab: 'video',
  debugTab: 'system',
  showScopes: false,
  showSafeArea: false,
  mediaView: 'grid',
  mediaSearch: '',
  draggedMediaId: null,
  onboardingDone: (() => {
    try {
      return localStorage.getItem('molicut.onboarding') === 'done'
    } catch {
      return false
    }
  })(),

  init: async () => {
    if (subscribed) {
      if (!get().loaded) {
        const { settings } = await call('settings:get', {})
        set({ settings, loaded: true })
      }
      return
    }
    subscribed = true
    const { settings } = await call('settings:get', {})
    set({ settings, loaded: true })
    applyTheme(settings.theme, settings.accent)
    setLanguage(settings.language)
    on('settings:changed', ({ settings: next }) => {
      set({ settings: next })
      applyTheme(next.theme, next.accent)
      setLanguage(next.language)
    })
    on('toast', ({ kind, message }) => get().toast(kind, message))
    on('media:proxy-ready', () => {
      get().toast('success', 'Proxy generato e disponibile')
    })
  },

  updateSettings: async (patch) => {
    const current = get().settings
    const optimistic = { ...current, ...patch, shortcuts: { ...current.shortcuts, ...(patch.shortcuts ?? {}) } }
    set({ settings: optimistic })
    applyTheme(optimistic.theme, optimistic.accent)
    setLanguage(optimistic.language)
    try {
      const { settings: persisted } = await call('settings:set', { patch })
      set({ settings: persisted })
      applyTheme(persisted.theme, persisted.accent)
    } catch (err) {
      set({ settings: current })
      get().toast('error', (err as Error).message)
    }
  },

  openModal: (modal, payload) => set({ modal, modalPayload: payload ?? null }),
  closeModal: () => set({ modal: null, modalPayload: null }),

  toast: (kind, message) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    set((state) => ({ toasts: [...state.toasts.slice(-3), { id, kind, message }] }))
    setTimeout(() => get().dismissToast(id), kind === 'error' ? 7000 : 4200)
  },

  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  setInspectorTab: (tab) => set({ inspectorTab: tab }),
  setDebugTab: (tab) => set({ debugTab: tab }),
  toggleScopes: () => set((s) => ({ showScopes: !s.showScopes })),
  toggleSafeArea: () => set((s) => ({ showSafeArea: !s.showSafeArea })),
  setMediaView: (view) => set({ mediaView: view }),
  setMediaSearch: (search) => set({ mediaSearch: search }),
  setDraggedMediaId: (mediaId) => set({ draggedMediaId: mediaId }),
  completeOnboarding: () => {
    set({ onboardingDone: true })
    try {
      localStorage.setItem('molicut.onboarding', 'done')
    } catch {
      /* ignore */
    }
  }
}))
