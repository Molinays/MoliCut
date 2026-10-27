import { lazy, Suspense, useEffect, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { sequenceContentDuration } from '@shared/projectFactory'
import { useProjectStore } from './store/projectStore'
import { useUiStore } from './store/uiStore'
import { useQueueStore } from './store/queueStore'
import { TitleBar } from './components/TitleBar'
import { Toasts } from './components/Toasts'

import { Onboarding } from './components/Onboarding'
import { StatusBar } from './components/StatusBar'
import { MediaBin } from './features/media-bin/MediaBin'
import { Preview } from './features/preview/Preview'
import { Inspector } from './features/inspector/Inspector'
import { Timeline } from './features/timeline/Timeline'
import { ErrorBoundary } from './components/ErrorBoundary'

// Heavy, rarely-open surfaces are split out of the editor's first paint.
const ExportDialog = lazy(() => import('./features/export/ExportDialog').then((m) => ({ default: m.ExportDialog })))
const DebugPanel = lazy(() => import('./features/debug/DebugPanel').then((m) => ({ default: m.DebugPanel })))
const SettingsModal = lazy(() => import('./components/SettingsModal').then((m) => ({ default: m.SettingsModal })))
const CommandPalette = lazy(() => import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette })))

export function App(): JSX.Element {
  useTranslation()
  const modal = useUiStore((s) => s.modal)
  const openModal = useUiStore((s) => s.openModal)
  const closeModal = useUiStore((s) => s.closeModal)
  const initUi = useUiStore((s) => s.init)
  const onboardingDone = useUiStore((s) => s.onboardingDone)
  const settings = useUiStore((s) => s.settings)
  const initQueue = useQueueStore((s) => s.init)

  useEffect(() => {
    void initUi()
    void initQueue()
  }, [initQueue, initUi])

  useEffect(() => {
    /** Premiere-style edit points: clip heads/tails, markers and playhead. */
    const editPoints = (): number[] => {
      const project = useProjectStore.getState()
      const sequence = project.sequence()
      const points = new Set<number>([0, sequenceContentDuration(sequence)])
      for (const track of sequence.tracks) {
        for (const clip of track.clips) {
          points.add(clip.start)
          points.add(clip.start + clip.duration)
        }
      }
      return [...points].filter((point) => Number.isFinite(point)).sort((a, b) => a - b)
    }

    const onKey = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)
      ) {
        return
      }
      const project = useProjectStore.getState()
      const sequence = project.sequence()
      const mod = event.ctrlKey || event.metaKey
      const key = event.key.toLowerCase()
      const frame = 1 / sequence.fps

      if (mod) {
        if (event.shiftKey && key === 's') {
          event.preventDefault()
          void project.saveProject(true)
        } else if (event.shiftKey && key === 'p') {
          event.preventDefault()
          openModal('palette')
        } else if (event.shiftKey && key === 'd') {
          event.preventDefault()
          openModal('debug')
        } else if (event.shiftKey && key === 'q') {
          event.preventDefault()
          void useQueueStore.getState().openWindow()
        } else if (event.shiftKey && key === 'k') {
          event.preventDefault()
          project.splitAtPlayhead()
        } else if (key === 'k') {
          event.preventDefault()
          project.splitAtPlayhead()
        } else if (key === 'm') {
          event.preventDefault()
          openModal('export')
        } else if (key === 'i') {
          event.preventDefault()
          void project.importMedia()
        } else if (key === 'n') {
          event.preventDefault()
          void project.newProject()
        } else if (key === 'o') {
          event.preventDefault()
          void project.openProject()
        } else if (key === 's') {
          event.preventDefault()
          void project.saveProject()
        } else if (key === 'z' && event.shiftKey) {
          event.preventDefault()
          project.redo()
        } else if (key === 'y') {
          event.preventDefault()
          project.redo()
        } else if (key === 'z') {
          event.preventDefault()
          project.undo()
        } else if (key === 'd') {
          event.preventDefault()
          project.duplicateSelected()
        } else if (key === 'a') {
          event.preventDefault()
          project.selectAllClips()
        } else if (event.key === ',') {
          event.preventDefault()
          openModal('settings')
        }
        return
      }

      if (event.code === 'Space') {
        event.preventDefault()
        project.togglePlay()
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        if (event.shiftKey) project.rippleDeleteSelected()
        else project.deleteSelected()
      } else if (event.key === 'ArrowLeft' && event.altKey) {
        event.preventDefault()
        const points = editPoints().filter((point) => point < project.playhead - 0.0001)
        project.setPlayhead(points[points.length - 1] ?? 0)
      } else if (event.key === 'ArrowRight' && event.altKey) {
        event.preventDefault()
        const points = editPoints().filter((point) => point > project.playhead + 0.0001)
        project.setPlayhead(points[0] ?? sequenceContentDuration(sequence))
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        project.setPlayhead(Math.max(0, project.playhead - (event.shiftKey ? frame * 5 : frame)))
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        project.setPlayhead(project.playhead + (event.shiftKey ? frame * 5 : frame))
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        const points = editPoints().filter((point) => point < project.playhead - 0.0001)
        project.setPlayhead(points[points.length - 1] ?? 0)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        const points = editPoints().filter((point) => point > project.playhead + 0.0001)
        project.setPlayhead(points[0] ?? sequenceContentDuration(sequence))
      } else if (event.key === 'Home') {
        event.preventDefault()
        project.setPlayhead(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        project.setPlayhead(sequenceContentDuration(sequence))
      } else if (key === 'm') {
        event.preventDefault()
        if (event.shiftKey) {
          const next = sequence.markers.filter((marker) => marker.time > project.playhead + 0.0001).sort((a, b) => a.time - b.time)[0]
          if (next) project.setPlayhead(next.time)
        } else {
          project.addMarker('')
        }
      } else if (key === 'j') {
        event.preventDefault()
        project.setPlaying(false)
        project.setPlayhead(Math.max(0, project.playhead - 1))
      } else if (key === 'k') {
        event.preventDefault()
        project.setPlaying(false)
      } else if (key === 'l') {
        event.preventDefault()
        project.setPlaying(true)
      } else if (key === 's') {
        event.preventDefault()
        project.toggleSnap()
      } else if (key === 't') {
        event.preventDefault()
        project.addTextClip()
      } else if (key === 'v') {
        event.preventDefault()
        project.setTool('select')
      } else if (key === 'c') {
        event.preventDefault()
        project.setTool('blade')
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        project.setZoom(project.zoom * 1.25)
      } else if (event.key === '-' || event.key === '_') {
        event.preventDefault()
        project.setZoom(project.zoom / 1.25)
      } else if (event.key === 'Escape' && modal) {
        closeModal()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal, modal, openModal])

  useEffect(() => {
    if (!settings.autosaveSeconds) return
    const interval = setInterval(() => {
      void useProjectStore.getState().autosave()
    }, Math.max(15, settings.autosaveSeconds) * 1000)
    return () => clearInterval(interval)
  }, [settings.autosaveSeconds])

  return (
    <div className="app">
      <TitleBar />
      <div className="app-body">
        <div className="upper">
          <ErrorBoundary name="Media Bin" compact><MediaBin /></ErrorBoundary>
          <ErrorBoundary name="Program Monitor" compact><Preview /></ErrorBoundary>
          <ErrorBoundary name="Inspector" compact><Inspector /></ErrorBoundary>
        </div>
        <ErrorBoundary name="Timeline" compact><Timeline /></ErrorBoundary>
      </div>
      <StatusBar />
      <Suspense fallback={null}>
        {modal === 'export' && <ErrorBoundary name="Export"><ExportDialog /></ErrorBoundary>}
        {modal === 'settings' && <ErrorBoundary name="Impostazioni"><SettingsModal /></ErrorBoundary>}
        {modal === 'debug' && <ErrorBoundary name="Debug"><DebugPanel /></ErrorBoundary>}
        {modal === 'palette' && <ErrorBoundary name="Command Palette"><CommandPalette /></ErrorBoundary>}
      </Suspense>
      {!onboardingDone && <Onboarding />}
      <Toasts />
    </div>
  )
}
