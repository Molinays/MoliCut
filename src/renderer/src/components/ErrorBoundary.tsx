import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportClientError } from '../observability'

/**
 * Crashing a panel must never take down the editor. Each boundary keeps its own
 * error state, reports once to the main log (best effort) and offers a local
 * retry before the heavier "reload window" path.
 */

interface Props {
  name: string
  children: ReactNode
  compact?: boolean
}

interface State {
  error: Error | null
  componentStack: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, componentStack: null }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const stack = info.componentStack ?? null
    this.setState({ componentStack: stack })
    reportClientError(this.props.name, error, stack)
  }

  private retry = (): void => {
    this.setState({ error: null, componentStack: null })
  }

  private reload = (): void => {
    window.location.reload()
  }

  private copy = (): void => {
    const { error, componentStack } = this.state
    const text = [
      `MoliCut panel: ${this.props.name}`,
      `Message: ${error?.message ?? 'unknown'}`,
      '',
      error?.stack ?? '',
      '',
      componentStack ?? ''
    ].join('\n')
    void navigator.clipboard?.writeText(text).catch(() => undefined)
  }

  render(): ReactNode {
    const { error, componentStack } = this.state
    if (!error) return this.props.children

    if (this.props.compact) {
      return (
        <div className="panel crash-panel" role="alert">
          <div className="crash-panel-body">
            <span className="crash-kicker">Pannello non disponibile</span>
            <strong>{this.props.name}</strong>
            <p className="muted">{error.message || 'Errore imprevisto'}</p>
            <div className="crash-actions">
              <button className="btn btn-xs" onClick={this.retry}>Riprova</button>
              <button className="btn btn-xs" onClick={this.reload}>Ricarica app</button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="crash-screen" role="alert">
        <div className="crash-card">
          <span className="crash-kicker">MoliCut ha isolato un errore</span>
          <h1>Il progetto è al sicuro</h1>
          <p>
            L’interfaccia ha incontrato un errore in <code>{this.props.name}</code>. L’autosave e la coda di
            rendering restano attivi nel processo principale.
          </p>
          <pre className="crash-detail">{error.message}</pre>
          {componentStack && <details className="crash-stack"><summary>Dettagli tecnici</summary><pre>{componentStack}</pre></details>}
          <div className="crash-actions">
            <button className="btn btn-accent" onClick={this.retry}>Riprova senza riavviare</button>
            <button className="btn" onClick={this.reload}>Ricarica finestra</button>
            <button className="btn btn-ghost" onClick={this.copy}>Copia dettagli</button>
          </div>
          <p className="muted small">Se l’errore persiste, avvia in Safe Mode dal Debug panel: plugin ed effetti GPU vengono disattivati.</p>
        </div>
      </div>
    )
  }
}
