import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { call } from './bridge'
import { useProjectStore } from './store/projectStore'
import { useUiStore } from './store/uiStore'
import { useQueueStore } from './store/queueStore'
import type { IconName } from './components/Icon'

export interface Command {
  id: string
  label: string
  category: string
  shortcut?: string
  icon: IconName
  run: () => void | Promise<void>
}

/** Single command registry: menu bar, palette and keyboard all use it. */
export function useCommands(): Command[] {
  const { t } = useTranslation()
  const project = useProjectStore()
  const ui = useUiStore()
  const queue = useQueueStore()

  return useMemo<Command[]>(() => {
    const commands: Command[] = [
      {
        id: 'project.new',
        label: t('menu.new'),
        category: 'File',
        shortcut: 'Ctrl+N',
        icon: 'file',
        run: () => void project.newProject()
      },
      { id: 'project.open', label: t('menu.open'), category: 'File', shortcut: 'Ctrl+O', icon: 'folder', run: () => void project.openProject() },
      { id: 'project.save', label: t('menu.save'), category: 'File', shortcut: 'Ctrl+S', icon: 'save', run: () => void project.saveProject() },
      { id: 'project.saveAs', label: t('menu.saveAs'), category: 'File', shortcut: 'Ctrl+Shift+S', icon: 'save', run: () => void project.saveProject(true) },
      { id: 'media.import', label: t('menu.import'), category: 'File', shortcut: 'Ctrl+I', icon: 'plus', run: () => void project.importMedia() },
      { id: 'export.open', label: t('menu.export'), category: 'File', shortcut: 'Ctrl+M', icon: 'export', run: () => ui.openModal('export') },
      {
        id: 'export.fcpxml',
        label: t('menu.exportInterchange'),
        category: 'File',
        icon: 'external',
        run: () =>
          void call('project:exportInterchange', {
            project: project.project,
            sequenceId: project.sequence().id,
            format: 'fcpxml'
          }).then(() => ui.toast('success', 'Sequenza esportata in FCPXML'))
      },
      { id: 'app.settings', label: t('menu.settings'), category: 'File', shortcut: 'Ctrl+,', icon: 'settings', run: () => ui.openModal('settings') },
      { id: 'app.quit', label: t('menu.quit'), category: 'File', icon: 'close', run: () => void call('window:control', { action: 'close' }) },

      { id: 'edit.undo', label: t('menu.undo'), category: 'Modifica', shortcut: 'Ctrl+Z', icon: 'undo', run: () => project.undo() },
      { id: 'edit.redo', label: t('menu.redo'), category: 'Modifica', shortcut: 'Ctrl+Shift+Z', icon: 'redo', run: () => project.redo() },
      { id: 'edit.split', label: t('menu.cut'), category: 'Modifica', shortcut: 'Ctrl+K', icon: 'cut', run: () => project.splitAtPlayhead() },
      { id: 'edit.snap', label: 'Snap (aggancio)', category: 'Modifica', shortcut: 'S', icon: 'magnet', run: () => project.toggleSnap() },
      { id: 'edit.delete', label: t('menu.delete'), category: 'Modifica', shortcut: 'Delete', icon: 'trash', run: () => project.deleteSelected() },
      { id: 'edit.rippleDelete', label: 'Elimina con ripple (chiudi buco)', category: 'Modifica', shortcut: 'Shift+Delete', icon: 'trash', run: () => project.rippleDeleteSelected() },
      { id: 'edit.selectAll', label: t('menu.selectAll'), category: 'Modifica', shortcut: 'Ctrl+A', icon: 'layers', run: () => project.selectAllClips() },
      { id: 'edit.duplicate', label: t('menu.duplicate'), category: 'Modifica', shortcut: 'Ctrl+D', icon: 'layers', run: () => project.duplicateSelected() },
      { id: 'edit.keyframe', label: 'Keyframe opacità al playhead', category: 'Modifica', icon: 'keyframe', run: () => {
        const selected = project.selectedClip()
        if (selected) project.toggleKeyframe(selected.clip.id, 'opacity', selected.clip.transform.opacity)
      } },

      { id: 'sequence.videoTrack', label: t('menu.addVideoTrack'), category: 'Sequenza', icon: 'film', run: () => project.addTrack('video') },
      { id: 'sequence.audioTrack', label: t('menu.addAudioTrack'), category: 'Sequenza', icon: 'audio', run: () => project.addTrack('audio') },
      { id: 'sequence.subtitleTrack', label: t('menu.addSubtitleTrack'), category: 'Sequenza', icon: 'file', run: () => project.addTrack('subtitle') },
      { id: 'sequence.title', label: t('menu.addTitle'), category: 'Sequenza', shortcut: 'T', icon: 'sparkles', run: () => project.addTextClip() },
      { id: 'sequence.marker', label: t('menu.addMarker'), category: 'Sequenza', shortcut: 'M', icon: 'keyframe', run: () => project.addMarker('') },
      { id: 'sequence.scopes', label: t('preview.scopes'), category: 'Vista', icon: 'gauge', run: () => ui.toggleScopes() },
      { id: 'sequence.safeArea', label: t('preview.safeArea'), category: 'Vista', icon: 'shield', run: () => ui.toggleSafeArea() },

      { id: 'window.queue', label: t('menu.queue'), category: 'Finestra', shortcut: 'Ctrl+Shift+Q', icon: 'queue', run: () => void queue.openWindow() },
      { id: 'window.debug', label: t('menu.debug'), category: 'Finestra', shortcut: 'Ctrl+Shift+D', icon: 'bug', run: () => ui.openModal('debug') },
      { id: 'window.palette', label: t('menu.commandPalette'), category: 'Finestra', shortcut: 'Ctrl+Shift+P', icon: 'command', run: () => ui.openModal('palette') },
      {
        id: 'help.about',
        label: t('menu.about'),
        category: 'Aiuto',
        icon: 'sparkles',
        run: () =>
          void call('app:info', {}).then((info) =>
            ui.toast('info', `MoliCut ${info.version} · Electron ${info.electron} · ${info.dbDriver}`)
          )
      }
    ]
    return commands
  }, [project, queue, t, ui])
}
