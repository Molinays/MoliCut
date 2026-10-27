import { useEffect, useMemo, useRef, useState, type DragEvent, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import type { MediaAsset } from '@shared/schemas'
import { formatBytes, formatClock } from '@shared/utils'
import { call, filePath } from '../../bridge'
import { useProjectStore } from '../../store/projectStore'
import { useUiStore } from '../../store/uiStore'
import { Icon } from '../../components/Icon'

const kindIcon = { video: 'film', audio: 'waveform', image: 'image' } as const

export function MediaBin(): JSX.Element {
  const { t } = useTranslation()
  const media = useProjectStore((s) => s.project.media)
  const importMedia = useProjectStore((s) => s.importMedia)
  const addClip = useProjectStore((s) => s.addClip)
  const relink = useProjectStore((s) => s.relinkMedia)
  const removeMedia = useProjectStore((s) => s.removeMedia)
  const toast = useUiStore((s) => s.toast)
  const view = useUiStore((s) => s.mediaView)
  const setView = useUiStore((s) => s.setMediaView)
  const search = useUiStore((s) => s.mediaSearch)
  const setSearch = useUiStore((s) => s.setMediaSearch)
  const setDraggedMediaId = useUiStore((s) => s.setDraggedMediaId)
  const [thumbs, setThumbs] = useState<Record<string, string>>({})
  const [kind, setKind] = useState<'all' | MediaAsset['kind']>('all')
  const [dragOver, setDragOver] = useState(false)
  const requested = useRef(new Set<string>())

  useEffect(() => {
    for (const asset of media) {
      if (thumbs[asset.id] || requested.current.has(asset.id)) continue
      requested.current.add(asset.id)
      void call('media:thumbnail', { path: asset.path, timeSec: 1 })
        .then(({ dataUrl }) => setThumbs((prev) => ({ ...prev, [asset.id]: dataUrl })))
        .catch(() => setThumbs((prev) => ({ ...prev, [asset.id]: '' })))
    }
  }, [media, thumbs])

  const filtered = useMemo(
    () =>
      media.filter((asset) => {
        if (kind !== 'all' && asset.kind !== kind) return false
        if (!search.trim()) return true
        return asset.name.toLowerCase().includes(search.toLowerCase())
      }),
    [kind, media, search]
  )

  const onDropFiles = async (event: DragEvent): Promise<void> => {
    event.preventDefault()
    setDragOver(false)
    // Electron 32+ removed File.path; resolve through the preload's webUtils bridge.
    const paths = Array.from(event.dataTransfer.files ?? [])
      .map((file) => filePath(file))
      .filter((p): p is string => Boolean(p))
    if (paths.length === 0) {
      toast('warn', 'Impossibile leggere il percorso dei file trascinati.')
      return
    }
    try {
      const { assets } = await call('media:importPaths', { paths, generateProxies: false })
      useProjectStore.getState().addMedia(assets)
    } catch (err) {
      toast('error', (err as Error).message)
    }
  }

  const totalDuration = media.reduce((sum, m) => sum + m.durationSec, 0)

  return (
    <section
      className={`panel media-bin ${dragOver ? 'drag-over' : ''}`}
      aria-label={t('media.title')}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('Files')) {
          e.preventDefault()
          setDragOver(true)
        }
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => void onDropFiles(e)}
    >
      <header className="panel-head">
        <div className="panel-title">
          <Icon name="film" size={15} />
          <h2>{t('media.title')}</h2>
          <span className="badge">{media.length}</span>
        </div>
        <div className="panel-actions">
          <button className="icon-btn" title={view === 'grid' ? 'Vista lista' : 'Vista griglia'} onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
            <Icon name={view === 'grid' ? 'list' : 'grid'} size={14} />
          </button>
          <button className="btn btn-sm" onClick={() => void importMedia()}>
            <Icon name="plus" size={14} /> {t('media.import')}
          </button>
        </div>
      </header>

      <div className="media-toolbar">
        <div className="search-field">
          <Icon name="search" size={13} />
          <input value={search} placeholder={t('media.search')} onChange={(e) => setSearch(e.target.value)} aria-label={t('media.search')} />
        </div>
      </div>
      <div className="filter-row">
        {(['all', 'video', 'audio', 'image'] as const).map((k) => (
          <button key={k} className={`filter-chip ${kind === k ? 'active' : ''}`} onClick={() => setKind(k)}>
            {k === 'all' ? 'Tutti' : k === 'video' ? 'Video' : k === 'audio' ? 'Audio' : 'Immagini'}
          </button>
        ))}
        <span className="media-summary">{t('media.duration')}: {formatClock(totalDuration)} · {formatBytes(media.reduce((s, m) => s + m.fileSize, 0))}</span>
      </div>

      <div className={`media-list ${view}`} role="list">
        {filtered.length === 0 && (
          <div className="media-empty">
            <Icon name="film" size={26} />
            <p>{t('media.empty')}</p>
            <button className="btn btn-sm" onClick={() => void importMedia()}>
              <Icon name="plus" size={13} /> {t('media.import')}
            </button>
          </div>
        )}
        {filtered.map((asset) => (
          <article
            key={asset.id}
            className={`media-card ${asset.status === 'offline' ? 'offline' : ''}`}
            role="listitem"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/x-molicut-media', asset.id)
              e.dataTransfer.setData('text/plain', asset.name)
              e.dataTransfer.effectAllowed = 'copy'
              setDraggedMediaId(asset.id)
            }}
            onDragEnd={() => setDraggedMediaId(null)}
            onDoubleClick={() => addClip(asset.id)}
            title={`${asset.name}\n${asset.width}×${asset.height} · ${asset.fps} fps · ${asset.codec}\n${asset.path}`}
          >
            <div className="thumb">
              {thumbs[asset.id] ? (
                <img src={thumbs[asset.id]} alt="" draggable={false} />
              ) : (
                <div className="thumb-placeholder">
                  <Icon name={kindIcon[asset.kind]} size={22} />
                </div>
              )}
              <span className="kind-badge">
                <Icon name={kindIcon[asset.kind]} size={11} />
              </span>
              <span className="duration-badge">{formatClock(asset.durationSec)}</span>
              {asset.isHDR && <span className="hdr-badge">HDR</span>}
              {asset.proxyPath && <span className="proxy-badge">PROXY</span>}
              {asset.status === 'offline' && (
                <div className="offline-overlay">
                  <Icon name="warning" size={16} />
                  <span>{t('media.offline')}</span>
                </div>
              )}
              <div className="media-hover">
                <button title={t('media.addToTimeline')} onClick={() => addClip(asset.id)}>
                  <Icon name="plus" size={14} />
                </button>
                <button title="Rilink" onClick={() => void relink(asset.id)}>
                  <Icon name="refresh" size={14} />
                </button>
                <button title={t('media.remove')} onClick={() => removeMedia(asset.id)}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
            {view === 'list' && (
              <div className="media-meta">
                <span className="media-name">{asset.name}</span>
                <span className="media-sub">
                  {asset.width > 0 ? `${asset.width}×${asset.height}` : 'Audio'} · {asset.codec.toUpperCase()} ·{' '}
                  {asset.kind === 'audio' ? `${asset.channels}ch ${asset.sampleRate / 1000}kHz` : `${asset.fps} fps`}
                </span>
              </div>
            )}
            {view === 'grid' && (
              <div className="media-footer">
                <span className="media-name">{asset.name}</span>
                <span className="media-sub">{asset.codec.toUpperCase()} · {asset.width > 0 ? `${asset.width}×${asset.height}` : 'audio'}</span>
              </div>
            )}
          </article>
        ))}
      </div>

      {dragOver && (
        <div className="drop-hint">
          <Icon name="download" size={22} />
          <span>Rilascia per importare</span>
        </div>
      )}
    </section>
  )
}
