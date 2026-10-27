import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import './i18n'
import { App } from './App'
import { QueueApp } from './features/queue-window/QueueApp'
import { initTheme } from './theme'
import { useProjectStore } from './store/projectStore'
import { ErrorBoundary } from './components/ErrorBoundary'
import { installGlobalErrorReporting, reportClientError } from './observability'

const params = new URLSearchParams(window.location.search)
const view = params.get('view') === 'queue' ? 'queue' : 'editor'

initTheme()
installGlobalErrorReporting()

// Boot the project store once for the editor; a corrupt document must not prevent
// the shell (and its recovery/debug tools) from rendering. The queue window does
// not need a project and must not consume the one-shot crash recovery flag.
if (view === 'editor') {
  void useProjectStore
    .getState()
    .bootstrap()
    .catch((err) => reportClientError('project.bootstrap', err))
  // E2E seam (see Window.__stores in env.d.ts): renderer state only.
  window.__stores = { project: useProjectStore }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary name={view === 'queue' ? 'Render Queue' : 'Editor'}>
      {view === 'queue' ? <QueueApp /> : <App />}
    </ErrorBoundary>
  </React.StrictMode>
)
