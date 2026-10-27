import { useEffect, useState, type JSX } from 'react'
import type { HardwareProfile } from '@shared/schemas'
import { formatClock } from '@shared/utils'
import { call, isMock, on, platform } from '../bridge'
import { useProjectStore } from '../store/projectStore'
import { useQueueStore } from '../store/queueStore'
import { useUiStore } from '../store/uiStore'
import { Icon } from './Icon'

export function StatusBar(): JSX.Element {
  const project = useProjectStore((s) => s.project)
  const dirty = useProjectStore((s) => s.dirty)
  const autosaveAt = useProjectStore((s) => s.autosaveAt)
  const sequence = useProjectStore((s) => s.sequence())
  const stats = useQueueStore((s) => s.stats)
  const openModal = useUiStore((s) => s.openModal)
  const [profile, setProfile] = useState<HardwareProfile | null>(null)
  const [scan, setScan] = useState<{ percent: number; message: string } | null>(null)

  useEffect(() => {
    void call('system:profile', {})
      .then(({ profile: p }) => setProfile(p))
      .catch(() => undefined)
    return on('scan:progress', ({ percent, message }) => {
      setScan({ percent, message })
      if (percent >= 100) {
        setTimeout(() => setScan(null), 1200)
        void call('system:profile', {}).then(({ profile: p }) => setProfile(p)).catch(() => undefined)
      }
    })
  }, [])

  const backend = profile?.acceleration.preferredBackend ?? 'software'
  const hardware = backend !== 'software'

  return (
    <footer className="statusbar">
      <div className="status-left">
        <span className="status-item">
          <span className={`status-led ${dirty ? 'dirty' : 'ok'}`} />
          {dirty ? 'Modifiche non salvate' : autosaveAt ? `Autosave ${new Date(autosaveAt).toLocaleTimeString()}` : 'Pronto'}
        </span>
        <span className="status-divider" />
        <span className="status-item">
          <Icon name="film" size={12} /> {sequence.name}
        </span>
        <span className="status-item dim">{sequence.width}×{sequence.height} · {sequence.fps}fps</span>
        <span className="status-divider" />
        <span className="status-item dim">{project.media.length} media · {sequence.tracks.length} tracce</span>
      </div>

      <div className="status-right">
        {scan && (
          <span className="status-item scanning">
            <span className="spinner" /> {scan.message} {scan.percent}%
          </span>
        )}
        <button className={`status-item backend ${hardware ? 'hw' : 'sw'}`} onClick={() => openModal('debug')} title="Apri debug / GPU">
          <Icon name="chip" size={12} /> {backend.toUpperCase()}
          {profile && <span className="dim">· {profile.gpus[0]?.model ?? profile.cpu.brand}</span>}
        </button>
        <button className="status-item" onClick={() => useQueueStore.getState().openWindow()} title="Render queue">
          <Icon name="queue" size={12} /> {stats.running > 0 ? `${stats.running} attivi · ${stats.progress}%` : `${stats.queued} in coda`}
          {stats.error > 0 && <span className="err-text"> · {stats.error} errori</span>}
        </button>
        <span className="status-divider" />
        <span className="status-item dim">{isMock() ? 'DEMO BROWSER' : `${platform()} · ${navigator.hardwareConcurrency} thread`}</span>
        <span className="status-item dim">{formatClock(project.media.reduce((s, m) => s + m.durationSec, 0))}</span>
      </div>
    </footer>
  )
}
