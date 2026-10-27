import { useCallback, useEffect, useMemo, useRef, useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import type { DependencyStatus, HardwareProfile, LogEntry, MetricsSnapshot } from '@shared/schemas'
import type { BenchmarkResult, EncoderTest, IpcStats } from '@shared/ipc'
import { formatBytes, formatClock, formatNumber, roundTo } from '@shared/utils'
import { call, on } from '../../bridge'
import { useQueueStore } from '../../store/queueStore'
import { useUiStore, type DebugTab } from '../../store/uiStore'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'

const TABS: Array<{ id: DebugTab; label: string; icon: 'chip' | 'gauge' | 'download' | 'file' | 'settings' }> = [
  { id: 'system', label: 'debug.system', icon: 'chip' },
  { id: 'gpu', label: 'debug.gpu', icon: 'gauge' },
  { id: 'deps', label: 'debug.deps', icon: 'download' },
  { id: 'logs', label: 'debug.logs', icon: 'file' },
  { id: 'actions', label: 'debug.actions', icon: 'settings' }
]

export function DebugPanel(): JSX.Element {
  const { t } = useTranslation()
  const close = useUiStore((s) => s.closeModal)
  const tab = useUiStore((s) => s.debugTab)
  const setTab = useUiStore((s) => s.setDebugTab)
  const toast = useUiStore((s) => s.toast)
  const jobs = useQueueStore((s) => s.jobs)
  const queueStats = useQueueStore((s) => s.stats)
  const refreshQueue = useQueueStore((s) => s.refresh)

  const [profile, setProfile] = useState<HardwareProfile | null>(null)
  const [deps, setDeps] = useState<DependencyStatus[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [ipc, setIpc] = useState<IpcStats | null>(null)
  const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null)
  const [history, setHistory] = useState<MetricsSnapshot[]>([])
  const [scan, setScan] = useState<{ percent: number; message: string } | null>(null)
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(null)
  const [tests, setTests] = useState<Record<string, EncoderTest | 'running'>>({})
  const [gpuBench, setGpuBench] = useState<number | null>(null)
  const [gpuBenchRunning, setGpuBenchRunning] = useState(false)
  const [logLevel, setLogLevel] = useState<'all' | LogEntry['level']>('all')
  const [logSearch, setLogSearch] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const gpuCanvas = useRef<HTMLCanvasElement | null>(null)

  const load = useCallback(async () => {
    const [p, d, l, i] = await Promise.allSettled([
      call('system:profile', {}),
      call('deps:status', {}),
      call('debug:logs', { limit: 800 }),
      call('debug:ipcStats', {})
    ])
    if (p.status === 'fulfilled') setProfile(p.value.profile)
    if (d.status === 'fulfilled') setDeps(d.value.dependencies)
    if (l.status === 'fulfilled') setLogs(l.value.logs)
    if (i.status === 'fulfilled') setIpc(i.value)
    void refreshQueue()
  }, [refreshQueue])

  useEffect(() => {
    void load()
    const off = on('scan:progress', ({ percent, message }) => setScan({ percent, message }))
    const interval = setInterval(() => {
      void call('debug:metrics', {})
        .then((m) => {
          setMetrics(m)
          setHistory((prev) => [...prev.slice(-59), m])
        })
        .catch(() => undefined)
      void call('debug:logs', { limit: 800 }).then((r) => setLogs(r.logs)).catch(() => undefined)
      void call('debug:ipcStats', {}).then(setIpc).catch(() => undefined)
    }, 2500)
    return () => {
      off()
      clearInterval(interval)
    }
  }, [load])

  const scanHardware = async (): Promise<void> => {
    setBusy('scan')
    setScan({ percent: 0, message: 'Avvio scansione…' })
    try {
      const { profile: next } = await call('system:scan', { force: true })
      setProfile(next)
      toast('success', `Scan completato · backend ${next.acceleration.preferredBackend.toUpperCase()}`)
    } catch (err) {
      toast('error', (err as Error).message)
    } finally {
      setBusy(null)
      setScan(null)
    }
  }

  const runBenchmark = async (): Promise<void> => {
    setBusy('benchmark')
    try {
      setBenchmark(await call('system:benchmark', {}))
      toast('success', 'Benchmark completato')
    } catch (err) {
      toast('error', (err as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const testEncoder = async (encoderId: string, codec: 'h264' | 'hevc' | 'av1'): Promise<void> => {
    setTests((prev) => ({ ...prev, [encoderId]: 'running' }))
    try {
      const result = await call('system:testEncoder', { encoderId, codec })
      setTests((prev) => ({ ...prev, [encoderId]: result }))
    } catch (err) {
      setTests((prev) => ({
        ...prev,
        [encoderId]: { encoderId, ok: false, encodeFps: null, detail: (err as Error).message, durationMs: 0 }
      }))
    }
  }

  const runGpuBenchmark = async (): Promise<void> => {
    setGpuBenchRunning(true)
    await new Promise((r) => setTimeout(r, 40))
    try {
      const canvas = gpuCanvas.current ?? document.createElement('canvas')
      canvas.width = 1280
      canvas.height = 720
      const gl = canvas.getContext('webgl2', { antialias: false })
      if (!gl) {
        setGpuBench(0)
        return
      }
      const frame = (): void => {
        gl.clearColor(Math.random() * 0.2, 0.1, 0.3, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.finish()
      }
      frame()
      const start = performance.now()
      let frames = 0
      while (performance.now() - start < 1200) {
        frame()
        frames++
      }
      setGpuBench(roundTo((frames * 1000) / (performance.now() - start), 1))
    } finally {
      setGpuBenchRunning(false)
    }
  }

  const action = async (name: string): Promise<void> => {
    setBusy(name)
    try {
      const result = await call('debug:action', { action: name as never })
      toast('success', result.detail)
      if (name === 'redetect-hardware' || name === 'restart-engine') await load()
    } catch (err) {
      toast('error', (err as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const diagnosticBundle = async (): Promise<void> => {
    setBusy('bundle')
    try {
      const { path } = await call('debug:bundle', {})
      toast('success', `Report diagnostico: ${path}`)
    } catch (err) {
      toast('error', (err as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const filteredLogs = useMemo(
    () =>
      logs.filter((entry) => {
        if (logLevel !== 'all' && entry.level !== logLevel) return false
        if (!logSearch.trim()) return true
        return `${entry.scope} ${entry.message}`.toLowerCase().includes(logSearch.toLowerCase())
      }),
    [logLevel, logSearch, logs]
  )

  const activeJob = jobs.find((j) => j.state === 'running')

  return (
    <Modal title={t('debug.title')} subtitle="Diagnostica locale · nessun invio remoto" onClose={close} width={1080} className="debug-modal">
      <div className="debug-tabs" role="tablist">
        {TABS.map((item) => (
          <button key={item.id} role="tab" aria-selected={tab === item.id} className={`debug-tab ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
            <Icon name={item.icon} size={14} /> {t(item.label)}
          </button>
        ))}
        <div className="debug-tabs-right">
          <span className={`live-dot ${busy ? 'busy' : ''}`} />
          <span>{busy ? 'Operazione in corso…' : 'Live'}</span>
        </div>
      </div>

      {scan && (
        <div className="scan-progress">
          <div className="scan-bar"><i style={{ width: `${scan.percent}%` }} /></div>
          <span>{scan.message}</span>
          <em>{scan.percent}%</em>
        </div>
      )}

      <div className="debug-body">
        {tab === 'system' && (
          <div className="debug-grid">
            <div className="debug-actions-row">
              <button className="btn btn-sm btn-accent" onClick={() => void scanHardware()} disabled={busy === 'scan'}>
                <Icon name="refresh" size={13} /> {t('debug.scan')}
              </button>
              <button className="btn btn-sm" onClick={() => void runBenchmark()} disabled={busy === 'benchmark'}>
                <Icon name="gauge" size={13} /> {t('debug.benchmark')}
              </button>
              {profile && <span className="muted small">hash {profile.hardwareHash.slice(0, 12)}… · {new Date(profile.scannedAt).toLocaleString()}</span>}
            </div>
            {profile ? (
              <>
                <div className="card span2">
                  <h3><Icon name="chip" size={14} /> CPU</h3>
                  <div className="kv">
                    <span>Modello</span><strong>{profile.cpu.manufacturer} {profile.cpu.brand}</strong>
                    <span>Core / Thread</span><strong>{profile.cpu.physicalCores} / {profile.cpu.cores}</strong>
                    <span>Frequenza</span><strong>{profile.cpu.speedGHz} GHz</strong>
                    <span>Istruzioni</span><strong>{profile.cpu.flags.join(' · ') || 'n/d'}</strong>
                  </div>
                </div>
                <div className="card">
                  <h3><Icon name="gauge" size={14} /> Memoria</h3>
                  <div className="kv">
                    <span>Totale</span><strong>{profile.memoryTotalGB} GB</strong>
                    <span>Libera</span><strong>{profile.memoryFreeGB} GB</strong>
                  </div>
                  <div className="mini-bar"><i style={{ width: `${Math.round((1 - profile.memoryFreeGB / Math.max(1, profile.memoryTotalGB)) * 100)}%` }} /></div>
                </div>
                <div className="card">
                  <h3><Icon name="chip" size={14} /> Accelerazione</h3>
                  <div className="backend-pill">{profile.acceleration.preferredBackend.toUpperCase()}</div>
                  <div className="kv">
                    <span>Hardware</span><strong>{profile.acceleration.hardwareAvailable ? 'disponibile' : 'assente'}</strong>
                    <span>WebGL2</span><strong>{profile.acceleration.webgl2 ? 'sì' : 'no'}</strong>
                    <span>WebGPU</span><strong>{profile.acceleration.webgpu ? 'sì' : 'no'}</strong>
                  </div>
                </div>
                <div className="card span2">
                  <h3><Icon name="film" size={14} /> GPU</h3>
                  {profile.gpus.length === 0 && <p className="muted">Nessuna GPU rilevata.</p>}
                  {profile.gpus.map((gpu) => (
                    <div className="gpu-row" key={gpu.model}>
                      <div>
                        <strong>{gpu.model}</strong>
                        <span>{gpu.vendor} · {gpu.vramMB} MB VRAM · driver {gpu.driverVersion}</span>
                      </div>
                      <div className="api-chips">
                        {gpu.api.map((api) => <em key={api}>{api}</em>)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <h3><Icon name="file" size={14} /> OS</h3>
                  <div className="kv">
                    <span>Sistema</span><strong>{profile.os.distro} {profile.os.release}</strong>
                    <span>Kernel</span><strong>{profile.os.kernel}</strong>
                    <span>Build</span><strong>{profile.os.build}</strong>
                  </div>
                </div>
                <div className="card">
                  <h3><Icon name="layers" size={14} /> Dischi</h3>
                  {profile.disks.map((disk) => (
                    <div className="disk-row" key={disk.mount}>
                      <div><strong>{disk.mount}</strong><span>{disk.fs} · {disk.kind.toUpperCase()}</span></div>
                      <div className="disk-bar"><i style={{ width: `${Math.round(((disk.sizeGB - disk.freeGB) / Math.max(1, disk.sizeGB)) * 100)}%` }} /></div>
                      <span>{disk.freeGB} GB liberi</span>
                    </div>
                  ))}
                </div>
                <div className="card span2">
                  <h3><Icon name="warning" size={14} /> Bottleneck analysis</h3>
                  <ul className="analysis-list">
                    {profile.acceleration.notes.map((note, i) => <li key={i}>{note}</li>)}
                    <li>{profile.cpu.cores >= 16 ? 'CPU ad alto parallelismo: worker pool preview dimensionato su 16+ thread.' : 'CPU modesta: la preview riduce automaticamente la risoluzione.'}</li>
                    <li>{profile.gpus[0] ? `GPU ${profile.gpus[0].model}: decode/encode hardware prioritari.` : 'Nessuna GPU: decode software e preview a risoluzione ridotta.'}</li>
                  </ul>
                </div>
                {benchmark && (
                  <div className="card span2">
                    <h3><Icon name="gauge" size={14} /> Benchmark</h3>
                    <div className="bench-grid">
                      <div><span>CPU score</span><strong>{formatNumber(benchmark.cpuScore)}</strong></div>
                      <div><span>GPU score</span><strong>{benchmark.gpuScore ?? '—'}</strong></div>
                      <div><span>Disk read</span><strong>{benchmark.diskReadMBs} MB/s</strong></div>
                      <div><span>Disk write</span><strong>{benchmark.diskWriteMBs} MB/s</strong></div>
                      <div><span>Render 1080p</span><strong>{benchmark.renderFps ?? '—'} fps</strong></div>
                      <div><span>Durata</span><strong>{benchmark.durationMs} ms</strong></div>
                    </div>
                    <ul className="analysis-list">{benchmark.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                )}
              </>
            ) : (
              <div className="debug-loading">Scansione hardware in corso…</div>
            )}
          </div>
        )}

        {tab === 'gpu' && (
          <div className="debug-grid">
            <div className={`gpu-banner ${profile?.acceleration.hardwareAvailable ? 'ok' : 'warn'}`}>
              <Icon name={profile?.acceleration.hardwareAvailable ? 'chip' : 'warning'} size={22} />
              <div>
                <strong>{profile?.acceleration.preferredBackend.toUpperCase() ?? 'SCAN'}</strong>
                <span>
                  {profile?.acceleration.hardwareAvailable
                    ? 'GPU-first attivo: decode/encode/preview usano l’accelerazione hardware. Il fallback software è esplicito e loggato.'
                    : 'Nessun encoder hardware: fallback software esplicito (mai silenzioso).'}
                </span>
              </div>
              <button className="btn btn-sm" onClick={() => void scanHardware()}>
                <Icon name="refresh" size={13} /> Re-detection
              </button>
            </div>
            <div className="card span2">
              <h3><Icon name="chip" size={14} /> Encoder hardware</h3>
              <div className="encoder-table">
                <div className="encoder-head"><span>Backend</span><span>Codec</span><span>Test 1s</span><span>Esito</span></div>
                {(profile?.encoders ?? []).map((encoder) => {
                  const test = tests[encoder.id]
                  return (
                    <div className={`encoder-row ${encoder.available ? '' : 'unavailable'}`} key={encoder.id}>
                      <span><strong>{encoder.name}</strong><em>{encoder.id}</em></span>
                      <span>{encoder.codecs.join(', ') || '—'}</span>
                      <span>
                        <button
                          className="btn btn-xs"
                          disabled={!encoder.available || test === 'running' || encoder.id === 'software'}
                          onClick={() => void testEncoder(encoder.id === 'software' ? 'libx264' : encoder.id === 'nvenc' ? 'h264_nvenc' : encoder.id === 'amf' ? 'h264_amf' : encoder.id === 'qsv' ? 'h264_qsv' : encoder.id === 'videotoolbox' ? 'h264_videotoolbox' : 'h264_vaapi', 'h264')}
                        >
                          {test === 'running' ? 'Test…' : t('debug.testEncoders')}
                        </button>
                      </span>
                      <span>
                        {test && test !== 'running' ? (
                          <em className={test.ok ? 'ok-text' : 'err-text'}>{test.ok ? `${test.encodeFps ?? '?'} fps` : test.detail.slice(0, 60)}</em>
                        ) : encoder.testedOk === null ? (
                          <em className="muted">non testato</em>
                        ) : (
                          <em className={encoder.testedOk ? 'ok-text' : 'err-text'}>{encoder.testedOk ? 'ok' : 'fallito'}</em>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="card">
              <h3><Icon name="gauge" size={14} /> WebGL2 / WebGPU</h3>
              <div className="kv">
                <span>WebGL2</span><strong>{profile?.acceleration.webgl2 ? 'supportato' : 'non disponibile'}</strong>
                <span>WebGPU</span><strong>{profile?.acceleration.webgpu ? 'supportato' : 'non disponibile'}</strong>
                <span>Benchmark locale</span><strong>{gpuBench === null ? '—' : `${gpuBench} fps`}</strong>
              </div>
              <button className="btn btn-sm full" onClick={() => void runGpuBenchmark()} disabled={gpuBenchRunning}>
                <Icon name="play" size={12} /> {gpuBenchRunning ? 'Esecuzione…' : 'Benchmark WebGL2'}
              </button>
              <canvas ref={gpuCanvas} className="hidden-canvas" width={8} height={8} />
            </div>
            <div className="card">
              <h3><Icon name="warning" size={14} /> Hot-unplug / driver crash</h3>
              <p className="muted small">
                Se la GPU sparisce a runtime il motore annulla il job hardware, logga l’evento, notifica l’utente e ritenta in software.
                Il backend attivo è sempre visibile nella status bar e in questa scheda.
              </p>
              <div className="kv">
                <span>Fallback</span><strong>esplicito + notifica</strong>
                <span>Retry</span><strong>automatico</strong>
              </div>
            </div>
            <div className="card span2">
              <h3><Icon name="film" size={14} /> hwaccels FFmpeg</h3>
              <div className="api-chips">{profile?.hwaccels.map((h) => <em key={h}>{h}</em>) ?? <span className="muted">—</span>}</div>
            </div>
          </div>
        )}

        {tab === 'deps' && (
          <div className="debug-grid">
            <div className="debug-actions-row">
              <button className="btn btn-sm btn-accent" onClick={() => void call('deps:download', { component: 'all' }).then(() => load()).catch((e) => toast('error', (e as Error).message))}>
                <Icon name="download" size={13} /> Scarica dipendenze mancanti
              </button>
              <button className="btn btn-sm" onClick={() => void load()}><Icon name="refresh" size={13} /> Verifica</button>
              <span className="muted small">Download firmato · verifica SHA-256 · estrazione atomica</span>
            </div>
            {deps.map((dep) => (
              <div className={`card dep-card ${dep.status}`} key={dep.id}>
                <div className="dep-head">
                  <Icon name={dep.status === 'ok' ? 'check' : dep.status === 'missing' ? 'warning' : 'warning'} size={16} />
                  <strong>{dep.name}</strong>
                  <span className={`status-chip ${dep.status}`}>{dep.status}</span>
                </div>
                <div className="kv">
                  <span>Versione</span><strong>{dep.version ?? '—'}</strong>
                  <span>Path</span><strong className="truncate" title={dep.path ?? ''}>{dep.path ?? 'non trovato'}</strong>
                  <span>SHA-256 atteso</span><strong className="mono">{dep.expectedSha256?.slice(0, 16) ?? '—'}…</strong>
                  <span>SHA-256 reale</span><strong className="mono">{dep.actualSha256?.slice(0, 16) ?? '—'}…</strong>
                </div>
                <p className="dep-detail">{dep.detail}</p>
              </div>
            ))}
            <div className="card span2">
              <h3><Icon name="shield" size={14} /> Rollback atomico</h3>
              <p className="muted small">Le dipendenze vengono estratte in una directory temporanea, verificate e spostate con rename atomico. Un aggiornamento fallito non sostituisce il binario funzionante (ROADMAP DEP-2).</p>
            </div>
          </div>
        )}

        {tab === 'logs' && (
          <div className="logs-layout">
            <div className="logs-main">
              <div className="logs-toolbar">
                <select className="select select-sm" value={logLevel} onChange={(e) => setLogLevel(e.target.value as typeof logLevel)} aria-label="Livello log">
                  <option value="all">Tutti i livelli</option>
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warn</option>
                  <option value="error">Error</option>
                </select>
                <div className="search-field compact">
                  <Icon name="search" size={12} />
                  <input value={logSearch} onChange={(e) => setLogSearch(e.target.value)} placeholder="Filtra log…" aria-label="Filtra log" />
                </div>
                <button className="btn btn-xs" onClick={() => void diagnosticBundle()} disabled={busy === 'bundle'}>
                  <Icon name="download" size={12} /> Bundle ZIP
                </button>
              </div>
              <div className="log-list" role="log">
                {filteredLogs.map((entry) => (
                  <div className={`log-row ${entry.level}`} key={entry.id}>
                    <span className="log-time">{new Date(entry.at).toLocaleTimeString()}</span>
                    <span className="log-level">{entry.level}</span>
                    <span className="log-scope">{entry.scope}</span>
                    <span className="log-msg">{entry.message}</span>
                  </div>
                ))}
                {filteredLogs.length === 0 && <div className="muted padded">Nessun log con questi filtri.</div>}
              </div>
            </div>
            <div className="logs-side">
              <div className="card">
                <h3><Icon name="gauge" size={14} /> Risorse live</h3>
                <Sparkline values={history.map((h) => h.cpuPercent)} color="#7c5cff" label="CPU" suffix="%" />
                <Sparkline values={history.map((h) => h.memoryUsedMB)} color="#38bdd8" label="RAM" suffix=" MB" />
                <div className="kv">
                  <span>GPU</span><strong>{metrics?.gpuPercent === null ? 'n/d' : `${metrics?.gpuPercent?.toFixed(0)}%`}</strong>
                  <span>Cache render</span><strong>{formatBytes((metrics?.renderCacheMB ?? 0) * 1024 ** 2)}</strong>
                  <span>Preview</span><strong>{metrics?.previewFps.toFixed(0)} fps</strong>
                </div>
              </div>
              <div className="card">
                <h3><Icon name="queue" size={14} /> Render queue</h3>
                <div className="kv">
                  <span>Attivi</span><strong>{queueStats.running}</strong>
                  <span>In coda</span><strong>{queueStats.queued}</strong>
                  <span>Errori</span><strong>{queueStats.error}</strong>
                  <span>FPS aggregati</span><strong>{queueStats.aggregateFps}</strong>
                </div>
                {activeJob && (
                  <div className="active-job-mini">
                    <span>{activeJob.name}</span>
                    <div className="progress"><i style={{ width: `${activeJob.progress}%` }} /></div>
                    <em>{activeJob.fps} fps · ETA {formatClock(activeJob.etaSec)}</em>
                  </div>
                )}
              </div>
              <div className="card">
                <h3><Icon name="layers" size={14} /> IPC Inspector</h3>
                <div className="ipc-table">
                  {(ipc?.channels ?? []).slice(0, 8).map((channel) => (
                    <div className="ipc-row" key={channel.channel}>
                      <span title={channel.channel}>{channel.channel}</span>
                      <em>{channel.calls}</em>
                      <em className={channel.errors > 0 ? 'err-text' : ''}>{channel.errors}</em>
                      <em>{channel.avgMs}ms</em>
                    </div>
                  ))}
                </div>
                <p className="muted small">{ipc?.totalCalls ?? 0} chiamate · {ipc?.totalErrors ?? 0} errori</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'actions' && (
          <div className="debug-grid">
            <div className="card span2">
              <h3><Icon name="settings" size={14} /> Manutenzione</h3>
              <div className="action-grid">
                <ActionButton icon="refresh" label="Reset cache" detail="Thumbnail, waveform e frame cache" onClick={() => void action('reset-cache')} busy={busy === 'reset-cache'} />
                <ActionButton icon="film" label="Rigenera proxy" detail="Elimina i proxy esistenti" onClick={() => void action('regenerate-proxies')} busy={busy === 'regenerate-proxies'} />
                <ActionButton icon="sparkles" label="Flush shader cache" detail="Reset contesto WebGL/WebGPU" onClick={() => void action('flush-shaders')} busy={busy === 'flush-shaders'} />
                <ActionButton icon="chip" label="Riavvia motore media" detail="Ri-risolve FFmpeg e hardware" onClick={() => void action('restart-engine')} busy={busy === 'restart-engine'} />
                <ActionButton icon="gauge" label="Re-detect encoder" detail="Forza la scansione hardware" onClick={() => void action('redetect-hardware')} busy={busy === 'redetect-hardware'} />
                <ActionButton icon="queue" label="Ripara DB coda" detail="Backup automatico + requeue" onClick={() => void action('repair-queue-db')} busy={busy === 'repair-queue-db'} />
                <ActionButton icon="trash" label="Pulisci log" detail="Svuota buffer e file" onClick={() => void action('clear-logs')} busy={busy === 'clear-logs'} />
                <ActionButton icon="download" label="Report diagnostico" detail="ZIP redatto da PII" onClick={() => void diagnosticBundle()} busy={busy === 'bundle'} />
              </div>
            </div>
            <div className="card">
              <h3><Icon name="shield" size={14} /> Safe mode</h3>
              <p className="muted small">Disabilita plugin, accelerazione GPU e automazioni di avvio per il troubleshooting.</p>
              <button className="btn btn-sm full" onClick={() => void action(useUiStore.getState().settings.safeMode ? 'safe-mode-off' : 'safe-mode-on')} disabled={busy === 'safe-mode-on' || busy === 'safe-mode-off'}>
                <Icon name="warning" size={13} /> {useUiStore.getState().settings.safeMode ? 'Disattiva safe mode' : 'Attiva safe mode'}
              </button>
            </div>
            <div className="card">
              <h3><Icon name="file" size={14} /> Configurazione</h3>
              <p className="muted small">Backup e ripristino impostazioni sono persistiti in SQLite (kv settings).</p>
              <button className="btn btn-sm full" onClick={() => void call('updater:check', {}).then((r) => toast('info', r.message ?? r.status)).catch((e) => toast('error', (e as Error).message))}>
                <Icon name="refresh" size={13} /> Verifica aggiornamenti
              </button>
            </div>
            <div className="card span2 danger-card">
              <h3><Icon name="warning" size={14} /> Attenzione</h3>
              <p className="muted small">Queste azioni modificano cache, proxy o database. Un backup viene creato prima delle operazioni distruttive sulla coda. Il safe mode richiede un riavvio per disabilitare completamente i plugin.</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

function Sparkline({ values, color, label, suffix }: { values: number[]; color: string; label: string; suffix: string }): JSX.Element {
  const max = Math.max(1, ...values)
  const width = 220
  const height = 42
  const points = values
    .map((v, i) => `${(i / Math.max(1, values.length - 1)) * width},${height - (v / max) * (height - 4) - 2}`)
    .join(' ')
  return (
    <div className="spark">
      <div className="spark-head"><span>{label}</span><strong>{values[values.length - 1]?.toFixed(1) ?? '—'}{suffix}</strong></div>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" />
        <polyline points={`0,${height} ${points} ${width},${height}`} fill={color} opacity="0.08" stroke="none" />
      </svg>
    </div>
  )
}

function ActionButton({ icon, label, detail, onClick, busy }: { icon: 'refresh' | 'film' | 'sparkles' | 'chip' | 'gauge' | 'queue' | 'trash' | 'download'; label: string; detail: string; onClick: () => void; busy: boolean }): JSX.Element {
  return (
    <button className="action-button" onClick={onClick} disabled={busy}>
      <span className="action-icon"><Icon name={icon} size={16} /></span>
      <span className="action-text"><strong>{label}</strong><em>{detail}</em></span>
      {busy && <span className="spinner" />}
    </button>
  )
}
