import { useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppSettings } from '@shared/schemas'
import { useUiStore } from '../store/uiStore'
import { Icon } from './Icon'
import { Modal } from './Modal'

const ACCENTS = ['#4f8dff', '#22d3ee', '#38d9a9', '#ffb547', '#ff5c8a', '#a78bfa']

export function SettingsModal(): JSX.Element {
  const { t } = useTranslation()
  const settings = useUiStore((s) => s.settings)
  const update = useUiStore((s) => s.updateSettings)
  const close = useUiStore((s) => s.closeModal)
  const toast = useUiStore((s) => s.toast)
  const [draft, setDraft] = useState<AppSettings>(settings)
  const [saving, setSaving] = useState(false)

  const patch = (value: Partial<AppSettings>): void => setDraft((d) => ({ ...d, ...value }))

  const save = async (): Promise<void> => {
    setSaving(true)
    try {
      await update(draft)
      toast('success', 'Impostazioni salvate')
      close()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={t('settings.title')}
      subtitle="Preferenze persistite in SQLite · nessuna telemetria"
      onClose={close}
      width={820}
      footer={
        <>
          <button className="btn" onClick={close}>{t('common.cancel')}</button>
          <button className="btn btn-accent" onClick={() => void save()} disabled={saving}>
            <Icon name="save" size={14} /> {t('settings.save')}
          </button>
        </>
      }
    >
      <div className="settings-grid">
        <section className="settings-section">
          <h3>{t('settings.general')}</h3>
          <label className="field">
            <span>{t('settings.language')}</span>
            <select className="select" value={draft.language} onChange={(e) => patch({ language: e.target.value as 'it' | 'en' })}>
              <option value="it">Italiano</option>
              <option value="en">English</option>
            </select>
          </label>
          <label className="field">
            <span>{t('settings.theme')}</span>
            <select className="select" value={draft.theme} onChange={(e) => patch({ theme: e.target.value as AppSettings['theme'] })}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </label>
          <div className="field">
            <span>{t('settings.accent')}</span>
            <div className="accent-swatches">
              {ACCENTS.map((color) => (
                <button
                  key={color}
                  className={`swatch ${draft.accent === color ? 'active' : ''}`}
                  style={{ background: color }}
                  onClick={() => patch({ accent: color })}
                  aria-label={`Accent ${color}`}
                />
              ))}
              <input type="color" value={draft.accent} onChange={(e) => patch({ accent: e.target.value })} aria-label="Accent personalizzato" />
            </div>
          </div>
          <Toggle label={t('settings.notifications')} checked={draft.notifications} onChange={(v) => patch({ notifications: v })} />
          <Toggle label={t('settings.startMinimized')} checked={draft.startMinimized} onChange={(v) => patch({ startMinimized: v })} />
          <Toggle label={t('settings.runAtLogin')} checked={draft.runAtLogin} onChange={(v) => patch({ runAtLogin: v })} />
          <Toggle label={t('settings.watch')} checked={draft.watchEnabled} onChange={(v) => patch({ watchEnabled: v })} />
          <div className="telemetry-row">
            <Icon name="shield" size={14} />
            <span>{t('settings.telemetry')}</span>
            <span className="badge">OFF</span>
          </div>
        </section>

        <section className="settings-section">
          <h3>{t('settings.performance')}</h3>
          <RangeField label={t('queue.concurrency')} value={draft.maxConcurrentJobs} min={1} max={8} step={1} onChange={(v) => patch({ maxConcurrentJobs: v })} />
          <RangeField label="CPU limit (%)" value={draft.cpuLimitPercent} min={10} max={100} step={5} onChange={(v) => patch({ cpuLimitPercent: v })} />
          <RangeField label={t('settings.memory')} value={draft.memoryLimitMB} min={1024} max={65536} step={512} onChange={(v) => patch({ memoryLimitMB: v })} />
          <RangeField label={t('settings.cache')} value={draft.cacheSizeMB} min={512} max={16384} step={512} onChange={(v) => patch({ cacheSizeMB: v })} />
          <RangeField label={t('settings.autosave')} value={draft.autosaveSeconds} min={15} max={600} step={15} onChange={(v) => patch({ autosaveSeconds: v })} />
          <label className="field">
            <span>{t('preview.quality')}</span>
            <select className="select" value={draft.previewQuality} onChange={(e) => patch({ previewQuality: e.target.value as AppSettings['previewQuality'] })}>
              <option value="auto">Auto (adattiva)</option>
              <option value="full">Piena</option>
              <option value="half">1/2</option>
              <option value="quarter">1/4</option>
            </select>
          </label>
          <label className="field">
            <span>{t('settings.hardware')}</span>
            <select className="select" value={draft.hardwareOverride} onChange={(e) => patch({ hardwareOverride: e.target.value as AppSettings['hardwareOverride'] })}>
              <option value="auto">Auto (GPU-first)</option>
              <option value="nvidia">NVIDIA NVENC</option>
              <option value="amd">AMD AMF</option>
              <option value="intel">Intel QSV</option>
              <option value="apple">Apple VideoToolbox</option>
              <option value="vaapi">VAAPI (Linux)</option>
              <option value="software">Solo software</option>
            </select>
          </label>
          <Toggle
            label="Solo GPU (nessun fallback CPU)"
            checked={draft.gpuOnly}
            onChange={(v) => patch({ gpuOnly: v })}
          />
          <p className="muted small">
            Con una GPU rilevata l'export usa solo NVENC/AMF/QSV/VideoToolbox. Se l'encoder non è disponibile il job
            fallisce invece di passare alla CPU.
          </p>
          <Toggle label={t('settings.safeMode')} checked={draft.safeMode} onChange={(v) => patch({ safeMode: v })} danger />
        </section>

        <section className="settings-section wide">
          <h3>{t('settings.shortcuts')}</h3>
          <div className="shortcuts-grid">
            {Object.entries(draft.shortcuts).map(([id, key]) => (
              <div className="shortcut-row" key={id}>
                <span>{shortcutLabel(id)}</span>
                <kbd>{key}</kbd>
              </div>
            ))}
          </div>
          <p className="muted small">La rimappatura completa è prevista in roadmap (UX-3); i valori sono persistiti e validati.</p>
        </section>
      </div>
    </Modal>
  )
}

function Toggle({ label, checked, onChange, danger }: { label: string; checked: boolean; onChange: (v: boolean) => void; danger?: boolean }): JSX.Element {
  return (
    <label className={`toggle-row ${danger ? 'danger' : ''}`}>
      <span>{label}</span>
      <button role="switch" aria-checked={checked} className={`toggle ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)} type="button">
        <span />
      </button>
    </label>
  )
}

function RangeField({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }): JSX.Element {
  return (
    <label className="field range">
      <span>{label}</span>
      <div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <strong>{value}</strong>
      </div>
    </label>
  )
}

function shortcutLabel(id: string): string {
  const map: Record<string, string> = {
    'command.palette': 'Command palette',
    'debug.panel': 'Debug panel',
    'timeline.split': 'Dividi clip',
    'timeline.rippleDelete': 'Elimina con ripple',
    'timeline.addTitle': 'Aggiungi testo',
    'timeline.snap': 'Snap',
    'timeline.delete': 'Elimina',
    'playback.playPause': 'Play / Pausa',
    'project.save': 'Salva progetto',
    'project.saveAs': 'Salva con nome',
    'export.dialog': 'Apri export',
    'queue.window': 'Render queue'
  }
  return map[id] ?? id
}
