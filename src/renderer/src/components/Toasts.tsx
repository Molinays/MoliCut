import type { JSX } from 'react'
import { useUiStore } from '../store/uiStore'
import { Icon } from './Icon'

const iconFor = { info: 'sparkles', success: 'check', warn: 'warning', error: 'warning' } as const

export function Toasts(): JSX.Element {
  const toasts = useUiStore((s) => s.toasts)
  const dismiss = useUiStore((s) => s.dismissToast)
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.kind}`}>
          <Icon name={iconFor[toast.kind]} size={16} />
          <span>{toast.message}</span>
          <button onClick={() => dismiss(toast.id)} aria-label="Chiudi notifica">
            <Icon name="close" size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}
