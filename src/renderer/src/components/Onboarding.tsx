import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '../store/uiStore'
import { useProjectStore } from '../store/projectStore'
import { Icon } from './Icon'
import { Brand } from './Brand'

export function Onboarding(): JSX.Element {
  const { t } = useTranslation()
  const complete = useUiStore((s) => s.completeOnboarding)
  const openModal = useUiStore((s) => s.openModal)

  const features = [
    { icon: 'chip' as const, title: 'GPU-first', body: 'NVENC, AMF, QSV, VideoToolbox e VAAPI rilevati all’avvio, con fallback software esplicito.' },
    { icon: 'queue' as const, title: 'Coda persistente', body: 'Render in background con editor chiuso, watch folder e preset Media Encoder.' },
    { icon: 'bug' as const, title: 'Debug integrato', body: 'Hardware, dipendenze, log, IPC inspector e report diagnostico redatto.' }
  ]

  return (
    <div className="onboarding-backdrop">
      <div className="onboarding">
        <div className="onboarding-hero">
          <Brand size={44} />
          <div>
            <h1>{t('onboarding.title')}</h1>
            <p>{t('app.tagline')}</p>
          </div>
        </div>
        <p className="onboarding-copy">{t('onboarding.body')}</p>
        <div className="onboarding-features">
          {features.map((f) => (
            <div className="onboarding-feature" key={f.title}>
              <span className="feature-icon">
                <Icon name={f.icon} size={18} />
              </span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="onboarding-actions">
          <button
            className="btn"
            onClick={() => {
              complete()
              openModal('debug')
            }}
          >
            <Icon name="bug" size={14} /> Apri Debug
          </button>
          <button
            className="btn btn-accent"
            onClick={() => {
              complete()
              void useProjectStore.getState().importMedia()
            }}
          >
            <Icon name="plus" size={14} /> Importa media e inizia
          </button>
        </div>
        <button className="onboarding-skip" onClick={complete}>
          {t('onboarding.skip')}
        </button>
      </div>
    </div>
  )
}
