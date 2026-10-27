import { useEffect, useRef, useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { call, platform } from '../bridge'
import { useCommands, type Command } from '../commands'
import { useProjectStore } from '../store/projectStore'
import { useQueueStore } from '../store/queueStore'
import { useUiStore } from '../store/uiStore'
import { Icon } from './Icon'
import { Brand, BrandName } from './Brand'

interface MenuDefinition {
  key: string
  groups: string[][]
}

const MENUS: MenuDefinition[] = [
  { key: 'menu.file', groups: [['project.new', 'project.open', 'project.save', 'project.saveAs'], ['media.import', 'export.open', 'export.fcpxml'], ['app.settings', 'app.quit']] },
  {
    key: 'menu.edit',
    groups: [
      ['edit.undo', 'edit.redo'],
      ['edit.split', 'edit.rippleDelete', 'edit.delete', 'edit.duplicate', 'edit.selectAll'],
      ['edit.snap', 'edit.keyframe']
    ]
  },
  {
    key: 'menu.sequence',
    groups: [['sequence.videoTrack', 'sequence.audioTrack', 'sequence.subtitleTrack'], ['sequence.title', 'sequence.marker']]
  },
  { key: 'menu.view', groups: [['sequence.scopes', 'sequence.safeArea'], ['window.queue', 'window.debug', 'window.palette']] },
  { key: 'menu.help', groups: [['help.about']] }
]

export function TitleBar(): JSX.Element {
  const { t } = useTranslation()
  const commands = useCommands()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const project = useProjectStore((s) => s.project)
  const dirty = useProjectStore((s) => s.dirty)
  const saveProject = useProjectStore((s) => s.saveProject)
  const queueStats = useQueueStore((s) => s.stats)
  const openModal = useUiStore((s) => s.openModal)
  const isMac = platform() === 'darwin'

  useEffect(() => {
    const close = (event: MouseEvent): void => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) setOpenMenu(null)
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [])

  const byId = new Map(commands.map((c) => [c.id, c]))
  const run = (command?: Command): void => {
    setOpenMenu(null)
    void command?.run()
  }

  return (
    <div
      className={`titlebar ${isMac ? 'mac' : ''}`}
      ref={barRef}
      onDoubleClick={(event) => {
        // Native frameless titlebars lose double-click-to-maximize: restore it.
        if ((event.target as HTMLElement).closest('button, a, input, select')) return
        void call('window:control', { action: 'maximize' })
      }}
    >
      <div className="titlebar-left">
        <div className="brand">
          <Brand />
          <BrandName />
        </div>

        <nav className="menubar" aria-label="Menu principale">
          {MENUS.map((menu) => (
            <div className="menu-root" key={menu.key}>
              <button
                className={`menu-trigger ${openMenu === menu.key ? 'active' : ''}`}
                onClick={() => setOpenMenu(openMenu === menu.key ? null : menu.key)}
                onMouseEnter={() => openMenu && setOpenMenu(menu.key)}
                aria-haspopup="menu"
                aria-expanded={openMenu === menu.key}
              >
                {t(menu.key)}
              </button>
              {openMenu === menu.key && (
                <div className="menu-popover" role="menu">
                  {menu.groups.map((group, gi) => (
                    <div key={gi} className="menu-group">
                      {group.map((id) => {
                        const command = byId.get(id)
                        if (!command) return null
                        return (
                          <button key={id} role="menuitem" className="menu-item" onClick={() => run(command)}>
                            <Icon name={command.icon} size={14} />
                            <span>{command.label}</span>
                            {command.shortcut && <kbd>{command.shortcut}</kbd>}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="project-identity" title={useProjectStore.getState().projectPath ?? 'Progetto non salvato'}>
        <span className="project-name">{project.name}</span>
        {dirty && <span className="dirty-dot" title="Modifiche non salvate" />}
        <span className="project-sep">/</span>
        <span className="sequence-name">{useProjectStore.getState().sequence()?.name ?? 'Sequence'}</span>
      </div>

      <div className="titlebar-right">
        <button className="chip-btn" onClick={() => openModal('debug')} title="Debug (Ctrl+Shift+D)">
          <Icon name="chip" size={14} />
          <span>{project.sequences[0]?.colorSpace === 'rec2020' ? 'HDR' : 'SDR'}</span>
        </button>
        <button className="queue-chip" onClick={() => void useQueueStore.getState().openWindow()} title="Render Queue">
          <Icon name="queue" size={14} />
          <span>{queueStats.running > 0 ? `${queueStats.progress}%` : queueStats.queued > 0 ? queueStats.queued : 'Coda'}</span>
          {queueStats.running > 0 && <span className="pulse-dot" />}
        </button>
        <button className="btn btn-accent btn-sm" onClick={() => openModal('export')}>
          <Icon name="export" size={14} />
          Esporta
        </button>
        <button className="icon-btn" onClick={() => void saveProject()} title="Salva (Ctrl+S)" aria-label="Salva">
          <Icon name="save" />
        </button>

        {!isMac && (
          <div className="window-controls">
            <button onClick={() => void call('window:control', { action: 'minimize' })} aria-label="Minimizza">
              <Icon name="minimize" size={14} />
            </button>
            <button onClick={() => void call('window:control', { action: 'maximize' })} aria-label="Massimizza">
              <Icon name="maximize" size={13} />
            </button>
            <button className="close" onClick={() => void call('window:control', { action: 'close' })} aria-label="Chiudi">
              <Icon name="close" size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
