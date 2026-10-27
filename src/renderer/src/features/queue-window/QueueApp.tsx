import { useEffect, useMemo, useRef, useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import type { QueueJob, WatchFolder } from '@shared/schemas'
import { formatBytes, formatClock, formatEta } from '@shared/utils'
import { call, isMock, platform } from '../../bridge'
import { useQueueStore, type QueueFilter } from '../../store/queueStore'
import { useUiStore } from '../../store/uiStore'
import { Icon, type IconName } from '../../components/Icon'
import { Toasts } from '../../components/Toasts'
import { Brand, BrandName } from '../../components/Brand'

type Panel = 'detail' | 'presets' | 'watch' | 'settings'

const FILTERS: Array<{ id: QueueFilter; label: string }> = [
  { id: 'all', label: 'queue.all' },
  { id: 'queued', label: 'queue.queued' },
  { id: 'running', label: 'queue.running' },
  { id: 'paused', label: 'queue.paused' },
  { id: 'done', label: 'queue.done' },
  { id: 'error', label: 'queue.errors' },
  { id: 'canceled', label: 'queue.canceled' }
]

const STATE_ICON: Record<QueueJob['state'], IconName> = {
  queued: 'queue',
  running: 'play',
  paused: 'pause',
  done: 'check',
  error: 'warning',
  canceled: 'close'
}

export function QueueApp(): JSX.Element {
  const { t } = useTranslation()
  const queue = useQueueStore()
  const ui = useUiStore()
  const [panel, setPanel] = useState<Panel>('detail')
  const [presetId, setPresetId] = useState('builtin-youtube-1080p')
  const [presetSearch, setPresetSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const selected = queue.jobs.find((j) => j.id === queue.selectedJobId) ?? null
  const logsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void queue.init()
    void ui.init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight
  }, [queue.liveLogs, selected?.id])

  const filtered = useMemo(() => {
    const q = queue.search.trim().toLowerCase()
    return queue.jobs.filter((job) => {
      if (queue.filter !== 'all' && job.state !== queue.filter) return false
      if (!q) return true
      return `${job.name} ${job.preset.name} ${job.sourcePath} ${job.outputPath}`.toLowerCase().includes(q)
    })
  }, [queue.filter, queue.jobs, queue.search])

  const addFiles = async (): Promise<void> => {
    setBusy(true)
    try {
      const result = await call('media:importDialog', { generateProxies: false })
      if (result.canceled || result.assets.length === 0) return
      await queue.enqueue(result.assets.map((asset) => ({ sourcePath: asset.path, mediaId: asset.id, presetId, priority: 50, maxRetries: 3 })))
      ui.toast('success', `${result.assets.length} file accodati`)
    } catch (err) {
      ui.toast('error', (err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const currentLogs = selected ? queue.liveLogs[selected.id] ?? selected.logs : []
  const presetFiltered = queue.presets.filter((p) =>
    !presetSearch.trim() || `${p.name} ${p.description} ${p.tags.join(' ')}`.toLowerCase().includes(presetSearch.toLowerCase())
  )

  return (
    <div className="queue-app">
      <header className="queue-titlebar">
        <div className="titlebar-left">
          <div className="brand">
            <Brand />
            <BrandName />
            <span className="window-label">Render Queue</span>
          </div>
        </div>
        <div className="queue-title-meta">
          {isMock() && <span className="badge subtle">DEMO</span>}
          <span className="status-chip running">{queue.stats.running} attivi</span>
          <span className="status-chip queued">{queue.stats.queued} in coda</span>
          <span className="status-chip done">{queue.stats.done} completati</span>
          {queue.stats.error > 0 && <span className="status-chip error">{queue.stats.error} errori</span>}
        </div>
        <div className="titlebar-right">
          <button className="btn btn-sm" onClick={() => void call('window:control', { action: 'open-editor' })}>
            <Icon name="film" size={13} /> Editor
          </button>
          {platform() !== 'darwin' && (
            <div className="window-controls">
              <button onClick={() => void call('window:control', { action: 'minimize' })} aria-label="Minimizza"><Icon name="minimize" size={14} /></button>
              <button onClick={() => void call('window:control', { action: 'maximize' })} aria-label="Massimizza"><Icon name="maximize" size={13} /></button>
              <button className="close" onClick={() => void call('window:control', { action: 'close' })} aria-label="Chiudi"><Icon name="close" size={14} /></button>
            </div>
          )}
        </div>
      </header>

      <div className="queue-body">
        <aside className="queue-sidebar">
          <div className="queue-actions">
            <button className="btn btn-accent full" onClick={() => void addFiles()} disabled={busy}>
              <Icon name="plus" size={14} /> {t('queue.addJobs')}
            </button>
            <div className="queue-selected-preset">
              <span>Preset</span>
              <select className="select select-sm" value={presetId} onChange={(e) => setPresetId(e.target.value)} aria-label="Preset per nuovi job">
                {queue.presets.map((preset) => (
                  <option key={preset.id} value={preset.id}>{preset.name}</option>
                ))}
              </select>
            </div>
          </div>

          <nav className="queue-filters" aria-label="Filtri coda">
            {FILTERS.map((filter) => {
              const count = filter.id === 'all' ? queue.stats.total : queue.stats[filter.id]
              return (
                <button key={filter.id} className={`filter-item ${queue.filter === filter.id ? 'active' : ''}`} onClick={() => queue.setFilter(filter.id)}>
                  <Icon name={filter.id === 'all' ? 'queue' : STATE_ICON[filter.id as QueueJob['state']]} size={13} />
                  <span>{t(filter.label)}</span>
                  <em>{count}</em>
                </button>
              )
            })}
          </nav>

          <div className="queue-sidebar-section">
            <span className="sidebar-label">Pannelli</span>
            {([
              ['detail', 'Dettaglio job', 'file'],
              ['presets', 'Preset manager', 'sparkles'],
              ['watch', 'Watch folder', 'folder'],
              ['settings', 'Impostazioni coda', 'settings']
            ] as Array<[Panel, string, IconName]>).map(([id, label, icon]) => (
              <button key={id} className={`filter-item ${panel === id ? 'active' : ''}`} onClick={() => setPanel(id)}>
                <Icon name={icon} size={13} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="queue-sidebar-foot">
            <div className="queue-progress-card">
              <div><span>Progresso coda</span><strong>{queue.stats.progress}%</strong></div>
              <div className="progress"><i style={{ width: `${queue.stats.progress}%` }} /></div>
              <em>{queue.stats.aggregateFps} fps aggregati · {queue.stats.running}/{queue.concurrency} worker</em>
            </div>
            <button className="btn btn-sm full" onClick={() => void queue.exportReport('csv')}>
              <Icon name="download" size={13} /> {t('queue.exportReport')}
            </button>
          </div>
        </aside>

        <main className="queue-main">
          <div className="queue-toolbar">
            <div className="search-field">
              <Icon name="search" size={13} />
              <input value={queue.search} onChange={(e) => queue.setSearch(e.target.value)} placeholder="Cerca job, preset, path…" aria-label="Cerca job" />
            </div>
            <div className="queue-toolbar-actions">
              <button className="btn btn-xs" onClick={() => void queue.action('pause-all')} disabled={queue.stats.running + queue.stats.queued === 0}>
                <Icon name="pause" size={12} /> Pausa
              </button>
              <button className="btn btn-xs" onClick={() => void queue.action('resume-all')} disabled={queue.stats.paused === 0}>
                <Icon name="play" size={12} /> Riprendi
              </button>
              <button className="btn btn-xs" onClick={() => void queue.action('clear-finished')}>
                <Icon name="trash" size={12} /> {t('queue.clearFinished')}
              </button>
            </div>
          </div>

          <div className="job-table" role="table" aria-label="Render queue jobs">
            <div className="job-head" role="row">
              <span>Stato</span>
              <span>Job</span>
              <span>Preset</span>
              <span>Progresso</span>
              <span>FPS</span>
              <span>ETA</span>
              <span>Dimensione</span>
              <span />
            </div>
            <div className="job-rows">
              {filtered.length === 0 && (
                <div className="queue-empty">
                  <Icon name="queue" size={28} />
                  <h3>{t('queue.noJobs')}</h3>
                  <p>Aggiungi file o invia una sequenza dall’editor. La coda sopravvive al riavvio.</p>
                  <button className="btn btn-accent btn-sm" onClick={() => void addFiles()}>
                    <Icon name="plus" size={13} /> {t('queue.addJobs')}
                  </button>
                </div>
              )}
              {filtered.map((job) => (
                <div
                  key={job.id}
                  role="row"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('application/x-molicut-job', job.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const id = e.dataTransfer.getData('application/x-molicut-job')
                    if (id) void queue.reorder(id, filtered.findIndex((j) => j.id === job.id))
                  }}
                  className={`job-row ${job.state} ${queue.selectedJobId === job.id ? 'selected' : ''}`}
                  onClick={() => { queue.selectJob(job.id); setPanel('detail') }}
                >
                  <span className={`job-state ${job.state}`} title={job.state}>
                    <Icon name={STATE_ICON[job.state]} size={13} />
                    <em>{job.state}</em>
                  </span>
                  <span className="job-name">
                    <strong title={job.name}>{job.name}</strong>
                    <em title={job.outputPath}>{job.error ? job.error.slice(0, 80) : job.outputPath}</em>
                  </span>
                  <span className="job-preset">{job.preset.name}<em>{job.preset.video.codec.toUpperCase()}</em></span>
                  <span className="job-progress">
                    <div className="progress"><i style={{ width: `${job.state === 'done' ? 100 : job.progress}%` }} /></div>
                    <em>{job.state === 'done' ? 100 : job.progress}%</em>
                  </span>
                  <span className="mono">{job.fps || '—'}</span>
                  <span className="mono">{job.state === 'running' ? formatEta(job.etaSec) : '—'}</span>
                  <span className="mono">{job.sizeBytes ? formatBytes(job.sizeBytes) : '—'}</span>
                  <span className="job-actions">
                    {job.state === 'running' && (
                      <button onClick={(e) => { e.stopPropagation(); void queue.action('pause', job.id) }} title="Pausa"><Icon name="pause" size={12} /></button>
                    )}
                    {job.state === 'paused' && (
                      <button onClick={(e) => { e.stopPropagation(); void queue.action('resume', job.id) }} title="Riprendi"><Icon name="play" size={12} /></button>
                    )}
                    {(job.state === 'error' || job.state === 'canceled') && (
                      <button onClick={(e) => { e.stopPropagation(); void queue.action('retry', job.id) }} title="Riprova"><Icon name="refresh" size={12} /></button>
                    )}
                    {(job.state === 'running' || job.state === 'queued' || job.state === 'paused') && (
                      <button onClick={(e) => { e.stopPropagation(); void queue.action('cancel', job.id) }} title="Annulla"><Icon name="close" size={12} /></button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); void queue.action('duplicate', job.id) }} title="Duplica"><Icon name="layers" size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); void queue.action('remove', job.id) }} title="Rimuovi"><Icon name="trash" size={12} /></button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <aside className="queue-detail">
          <div className="queue-detail-tabs">
            {(['detail', 'presets', 'watch', 'settings'] as Panel[]).map((id) => (
              <button key={id} className={panel === id ? 'active' : ''} onClick={() => setPanel(id)}>
                {id === 'detail' ? 'Job' : id === 'presets' ? 'Preset' : id === 'watch' ? 'Watch' : 'Setup'}
              </button>
            ))}
          </div>

          {panel === 'detail' && (
            selected ? (
              <div className="job-detail-scroll">
                <div className="detail-title">
                  <span className={`job-state ${selected.state}`}><Icon name={STATE_ICON[selected.state]} size={14} /></span>
                  <div>
                    <strong>{selected.name}</strong>
                    <em>{selected.preset.name} · {selected.preset.video.codec.toUpperCase()} {selected.preset.video.width ?? 'src'}×{selected.preset.video.height ?? 'src'}</em>
                  </div>
                </div>
                <div className="detail-progress">
                  <div className="progress large"><i style={{ width: `${selected.progress}%` }} /></div>
                  <div className="detail-stats">
                    <span><em>Progresso</em><strong>{selected.progress}%</strong></span>
                    <span><em>FPS</em><strong>{selected.fps || '—'}</strong></span>
                    <span><em>Speed</em><strong>{selected.speed || '—'}x</strong></span>
                    <span><em>ETA</em><strong>{formatEta(selected.etaSec)}</strong></span>
                  </div>
                </div>
                <div className="kv">
                  <span>Sorgente</span><strong className="truncate" title={selected.sourcePath}>{selected.sourcePath}</strong>
                  <span>Output</span><strong className="truncate" title={selected.outputPath}>{selected.outputPath}</strong>
                  <span>Durata</span><strong>{formatClock(selected.durationSec)}</strong>
                  <span>Tentativi</span><strong>{selected.attempts}/{selected.maxRetries + 1}</strong>
                  <span>Priorità</span><strong>{selected.priority}</strong>
                  <span>Encoder</span><strong>{selected.preset.video.encoderPolicy} · {selected.preset.video.codec.toUpperCase()}</strong>
                  <span>Creazione</span><strong>{new Date(selected.createdAt).toLocaleString()}</strong>
                  <span>Fine</span><strong>{selected.finishedAt ? new Date(selected.finishedAt).toLocaleString() : '—'}</strong>
                </div>
                {selected.error && <div className="detail-error"><Icon name="warning" size={14} /> {selected.error}</div>}
                <div className="detail-section">
                  <div className="detail-section-head"><span>Metriche</span></div>
                  <div className="metric-grid">
                    <div><em>FPS medi</em><strong>{selected.metrics.avgFps}</strong></div>
                    <div><em>Frame</em><strong>{selected.metrics.encodedFrames}</strong></div>
                    <div><em>Tempo</em><strong>{formatClock(selected.metrics.durationMs / 1000)}</strong></div>
                    <div><em>Output</em><strong>{formatBytes(selected.metrics.outputBytes || selected.sizeBytes)}</strong></div>
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-section-head">
                    <span>Log live</span>
                    <button className="link-btn" onClick={() => void useQueueStore.getState().exportReport('json')}>JSON</button>
                  </div>
                  <div className="queue-logs" ref={logsRef}>
                    {currentLogs.length === 0 && <p className="muted">Nessun log.</p>}
                    {currentLogs.map((line, i) => (
                      <div key={i} className={`queue-log ${/error|fail/i.test(line) ? 'err' : /warn|fallback/i.test(line) ? 'warn' : ''}`}>{line}</div>
                    ))}
                  </div>
                </div>
                <div className="detail-actions">
                  <button className="btn btn-sm" onClick={() => void queue.action('duplicate', selected.id)}><Icon name="layers" size={12} /> Duplica</button>
                  <button className="btn btn-sm" onClick={() => void call('shell:reveal', { path: selected.outputPath })}><Icon name="folder" size={12} /> Output</button>
                  <button className="btn btn-sm danger" onClick={() => void queue.action('remove', selected.id)}><Icon name="trash" size={12} /> Rimuovi</button>
                </div>
              </div>
            ) : (
              <div className="queue-detail-empty">
                <Icon name="file" size={24} />
                <p>{t('queue.noSelection')}</p>
              </div>
            )
          )}

          {panel === 'presets' && (
            <div className="detail-panel-scroll">
              <div className="search-field compact">
                <Icon name="search" size={12} />
                <input value={presetSearch} onChange={(e) => setPresetSearch(e.target.value)} placeholder="Cerca preset…" aria-label="Cerca preset" />
              </div>
              <div className="preset-mini-list">
                {presetFiltered.map((preset) => (
                  <button key={preset.id} className={`preset-mini ${presetId === preset.id ? 'active' : ''}`} onClick={() => setPresetId(preset.id)}>
                    <div>
                      <strong>{preset.name}</strong>
                      <em>{preset.container.toUpperCase()} · {preset.video.codec.toUpperCase()} · {preset.video.width ?? 'src'}×{preset.video.height ?? 'src'}</em>
                    </div>
                    {preset.video.hdr !== 'none' && <span className="status-chip hdr">{preset.video.hdr.toUpperCase()}</span>}
                    {presetId === preset.id && <Icon name="check" size={13} />}
                  </button>
                ))}
              </div>
              <div className="detail-actions">
                <button className="btn btn-sm" onClick={() => void queue.importPresets()}><Icon name="download" size={12} /> Importa</button>
                <button className="btn btn-sm" onClick={() => void queue.exportPresets()}><Icon name="export" size={12} /> Esporta</button>
              </div>
            </div>
          )}

          {panel === 'watch' && (
            <WatchPanel />
          )}

          {panel === 'settings' && (
            <div className="detail-panel-scroll">
              <div className="detail-section">
                <div className="detail-section-head"><span>Esecuzione</span></div>
                <label className="field range">
                  <span>{t('queue.concurrency')}</span>
                  <div>
                    <input type="range" min={1} max={8} value={queue.concurrency} onChange={(e) => void queue.setConcurrency(Number(e.target.value))} />
                    <strong>{queue.concurrency}</strong>
                  </div>
                </label>
                <button className="btn btn-sm full" onClick={() => void queue.action('stop-after-current', undefined, true)}>
                  <Icon name="stop" size={12} /> Stop a fine job corrente
                </button>
                <button className="btn btn-sm full" onClick={() => void queue.action('pause-all')}><Icon name="pause" size={12} /> Pausa intera coda</button>
                <button className="btn btn-sm full" onClick={() => void queue.action('resume-all')}><Icon name="play" size={12} /> Riprendi coda</button>
              </div>
              <div className="detail-section">
                <div className="detail-section-head"><span>Report</span></div>
                <button className="btn btn-sm full" onClick={() => void queue.exportReport('csv')}><Icon name="download" size={12} /> Report CSV</button>
                <button className="btn btn-sm full" onClick={() => void queue.exportReport('json')}><Icon name="download" size={12} /> Report JSON</button>
              </div>
              <div className="detail-section">
                <div className="detail-section-head"><span>Notifiche</span></div>
                <label className="toggle-row">
                  <span>Notifiche native</span>
                  <button role="switch" aria-checked={ui.settings.notifications} className={`toggle ${ui.settings.notifications ? 'on' : ''}`} onClick={() => void ui.updateSettings({ notifications: !ui.settings.notifications })} type="button"><span /></button>
                </label>
                <label className="toggle-row">
                  <span>Spegni PC a coda completata</span>
                  <button role="switch" aria-checked={ui.settings.shutdownAfterQueue} className={`toggle ${ui.settings.shutdownAfterQueue ? 'on' : ''}`} onClick={() => void ui.updateSettings({ shutdownAfterQueue: !ui.settings.shutdownAfterQueue })} type="button"><span /></button>
                </label>
              </div>
              <p className="muted small">La coda è persistente su SQLite: crash e riavvii non perdono i job. Limite e retention sono configurabili nelle Impostazioni.</p>
            </div>
          )}
        </aside>
      </div>

      <footer className="queue-foot">
        <span><Icon name="shield" size={11} /> Coda persistente · SQLite · retry con backoff</span>
        <span className="dim">{queue.stats.total} job · {queue.concurrency} worker · priorità dinamica</span>
        <span className="dim">{isMock() ? 'DEMO BROWSER' : `${platform()} · tray attivo`}</span>
      </footer>
      <Toasts />
    </div>
  )
}

function WatchPanel(): JSX.Element {
  const queue = useQueueStore()
  const ui = useUiStore()
  const [draft, setDraft] = useState({ path: '', outputDir: '', presetId: 'builtin-youtube-1080p', dryRun: true })
  const [test, setTest] = useState<{ id: string; matches: string[]; scanned: number } | null>(null)

  const add = async (): Promise<void> => {
    if (!draft.path.trim() || !draft.outputDir.trim()) {
      ui.toast('warn', 'Inserisci cartella sorgente e output')
      return
    }
    await queue.addFolder({
      path: draft.path.trim(),
      outputDir: draft.outputDir.trim(),
      presetId: draft.presetId,
      enabled: true,
      recursive: true,
      extensions: ['mp4', 'mov', 'mkv', 'wav', 'png', 'jpg'],
      namePattern: null,
      excludePattern: null,
      stabilityMs: 4000,
      action: 'queue',
      conflict: 'suffix',
      dryRun: draft.dryRun
    })
    ui.toast('success', 'Watch folder aggiunta')
    setDraft({ path: '', outputDir: '', presetId: draft.presetId, dryRun: true })
  }

  return (
    <div className="detail-panel-scroll">
      <div className="detail-section">
        <div className="detail-section-head"><span>Cartelle monitorate</span></div>
        {queue.folders.length === 0 && <p className="muted small">Nessuna watch folder configurata.</p>}
        {queue.folders.map((folder) => (
          <div className="watch-card" key={folder.id}>
            <div className="watch-head">
              <Icon name="folder" size={14} />
              <strong className="truncate" title={folder.path}>{folder.path}</strong>
              <button
                className={`toggle small ${folder.enabled ? 'on' : ''}`}
                role="switch"
                aria-checked={folder.enabled}
                onClick={() => void queue.updateFolder({ ...folder, enabled: !folder.enabled })}
              ><span /></button>
            </div>
            <div className="watch-meta">
              <span>→ {folder.outputDir}</span>
              <span>{folder.presetId.replace('builtin-', '')}</span>
              {folder.dryRun && <span className="status-chip hdr">DRY-RUN</span>}
              <span>{folder.conflict}</span>
            </div>
            <div className="watch-actions">
              <button className="btn btn-xs" onClick={() => void queue.testFolder(folder.id).then((r) => setTest({ id: folder.id, ...r }))}>
                <Icon name="search" size={11} /> Test regole
              </button>
              <button className="btn btn-xs" onClick={() => void queue.updateFolder({ ...folder, dryRun: !folder.dryRun })}>
                <Icon name="eye" size={11} /> Dry-run
              </button>
              <button className="btn btn-xs danger" onClick={() => void queue.removeFolder(folder.id)}>
                <Icon name="trash" size={11} />
              </button>
            </div>
            {test?.id === folder.id && (
              <div className="watch-test">
                {test.scanned} file scansionati · {test.matches.length} corrispondenze
                {test.matches.slice(0, 4).map((match) => <em key={match}>{match}</em>)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="detail-section">
        <div className="detail-section-head"><span>Nuova cartella</span></div>
        <input className="input" value={draft.path} onChange={(e) => setDraft({ ...draft, path: e.target.value })} placeholder="C:\\Watch\\Incoming" aria-label="Cartella sorgente" />
        <input className="input" value={draft.outputDir} onChange={(e) => setDraft({ ...draft, outputDir: e.target.value })} placeholder="C:\\Watch\\Output" aria-label="Cartella output" />
        <select className="select" value={draft.presetId} onChange={(e) => setDraft({ ...draft, presetId: e.target.value })} aria-label="Preset watch folder">
          {queue.presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}</option>)}
        </select>
        <label className="toggle-row">
          <span>Dry-run (non accoda)</span>
          <button role="switch" aria-checked={draft.dryRun} className={`toggle ${draft.dryRun ? 'on' : ''}`} onClick={() => setDraft({ ...draft, dryRun: !draft.dryRun })} type="button"><span /></button>
        </label>
        <button className="btn btn-sm btn-accent full" onClick={() => void add()}><Icon name="plus" size={12} /> Aggiungi watch folder</button>
      </div>

      <div className="detail-section">
        <div className="detail-section-head"><span>Log watch</span></div>
        <div className="queue-logs short">
          {queue.watchLogs.length === 0 && <p className="muted">Nessun evento.</p>}
          {queue.watchLogs.map((log, i) => (
            <div key={i} className={`queue-log ${log.level}`}>
              <span className="log-time">{new Date(log.at).toLocaleTimeString()}</span> {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
