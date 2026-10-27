import { useEffect, useRef, useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { formatTimecode } from '@shared/utils'
import { sequenceContentDuration } from '@shared/projectFactory'
import { useProjectStore } from '../../store/projectStore'
import { useUiStore } from '../../store/uiStore'
import { Icon } from '../../components/Icon'
import { PreviewEngine } from './playback'

export function Preview(): JSX.Element {
  const { t } = useTranslation()
  const project = useProjectStore((s) => s.project)
  const sequence = useProjectStore((s) => s.sequence())
  const playhead = useProjectStore((s) => s.playhead)
  const playing = useProjectStore((s) => s.playing)
  const setPlayhead = useProjectStore((s) => s.setPlayhead)
  const setPlaying = useProjectStore((s) => s.setPlaying)
  const togglePlay = useProjectStore((s) => s.togglePlay)
  const settings = useUiStore((s) => s.settings)
  const updateSettings = useUiStore((s) => s.updateSettings)
  const showScopes = useUiStore((s) => s.showScopes)
  const showSafeArea = useUiStore((s) => s.showSafeArea)
  const toggleScopes = useUiStore((s) => s.toggleScopes)
  const toggleSafeArea = useUiStore((s) => s.toggleSafeArea)
  const [fps, setFps] = useState(60)
  const [muted, setMuted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<PreviewEngine | null>(null)
  const frame = 1 / sequence.fps

  useEffect(() => {
    if (!canvasRef.current || !overlayRef.current) return
    const engine = new PreviewEngine(canvasRef.current, overlayRef.current)
    engine.onTime = (time) => useProjectStore.getState().setPlayhead(time)
    engine.onStats = (value) => setFps(value)
    engine.onEnded = () => {
      const state = useProjectStore.getState()
      state.setPlaying(false)
      state.setPlayhead(sequenceContentDuration(state.sequence()))
    }
    engineRef.current = engine
    return () => {
      engine.dispose()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.update({
      project: useProjectStore.getState().project,
      sequence: useProjectStore.getState().sequence(),
      time: playhead,
      playing,
      muted,
      showScopes,
      showSafeArea,
      quality: settings.previewQuality
    })
  }, [muted, project, playhead, playing, settings.previewQuality, showSafeArea, showScopes, sequence])

  const hasSolo = sequence.tracks.some((t) => t.solo)
  const activeClip = sequence.tracks
    .filter((t) => (t.kind === 'video' || t.kind === 'adjustment') && !t.mute && (!hasSolo || t.solo))
    .flatMap((t) => t.clips)
    .find((c) => playhead >= c.start && playhead < c.start + c.duration)

  const contentEnd = sequenceContentDuration(sequence)
  const aspect = sequence.width / sequence.height

  return (
    <section className="panel preview-panel" aria-label="Program monitor">
      <header className="panel-head">
        <div className="panel-title">
          <Icon name="film" size={15} />
          <h2>{t('preview.title')}</h2>
          <span className="badge subtle">{sequence.name}</span>
        </div>
        <div className="preview-meta">
          <span>{sequence.width}×{sequence.height}</span>
          <span>{sequence.fps} fps</span>
          <span className="meta-dot" />
          <span className={sequence.colorSpace === 'rec709' ? '' : 'hdr-text'}>{sequence.colorSpace.toUpperCase()}</span>
        </div>
        <div className="panel-actions">
          <button className={`icon-btn ${showScopes ? 'active' : ''}`} onClick={toggleScopes} title={t('preview.scopes')}>
            <Icon name="gauge" size={14} />
          </button>
          <button className={`icon-btn ${showSafeArea ? 'active' : ''}`} onClick={toggleSafeArea} title={t('preview.safeArea')}>
            <Icon name="shield" size={14} />
          </button>
          <select
            className="select select-sm"
            value={settings.previewQuality}
            onChange={(e) => void updateSettings({ previewQuality: e.target.value as typeof settings.previewQuality })}
            title={t('preview.quality')}
          >
            <option value="auto">{t('preview.auto')}</option>
            <option value="full">{t('preview.full')}</option>
            <option value="half">{t('preview.half')}</option>
            <option value="quarter">{t('preview.quarter')}</option>
          </select>
        </div>
      </header>

      <div className="preview-stage">
        <div className="preview-frame" style={{ aspectRatio: `${aspect}` }} onClick={() => togglePlay()}>
          <canvas ref={canvasRef} className="preview-canvas" />
          <canvas ref={overlayRef} className="preview-overlay" />
          {activeClip && (
            <div className="preview-clip-tag">
              <span className="tag-dot" />
              {activeClip.name}
              {activeClip.effects.length > 0 && <span className="fx-count">FX {activeClip.effects.length}</span>}
            </div>
          )}
          <div className="preview-hud">
            <span>{formatTimecode(playhead, sequence.fps)}</span>
            <span>{fps.toFixed(0)} fps</span>
            <span>{settings.previewQuality === 'auto' ? 'AUTO' : settings.previewQuality.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="transport">
        <div className="transport-left">
          <button className="icon-btn" title="Vai all'inizio" onClick={() => setPlayhead(0)}>
            <Icon name="skipStart" />
          </button>
          <button className="icon-btn" title="Frame precedente" onClick={() => setPlayhead(Math.max(0, playhead - frame))}>
            <Icon name="rewind" />
          </button>
          <button className="play-btn" onClick={() => togglePlay()} aria-label={playing ? 'Pausa' : 'Play'}>
            <Icon name={playing ? 'pause' : 'play'} size={18} />
          </button>
          <button className="icon-btn" title="Frame successivo" onClick={() => setPlayhead(playhead + frame)}>
            <Icon name="forward" />
          </button>
          <button className="icon-btn" title="Fine" onClick={() => setPlayhead(contentEnd)}>
            <Icon name="skipEnd" />
          </button>
          <button className="icon-btn" title="Stop" onClick={() => { setPlaying(false); setPlayhead(0) }}>
            <Icon name="stop" />
          </button>
        </div>
        <div className="timecode">
          <span className="tc-current">{formatTimecode(playhead, sequence.fps)}</span>
          <span className="tc-sep">/</span>
          <span className="tc-total">{formatTimecode(Math.max(contentEnd, playhead), sequence.fps)}</span>
        </div>
        <div className="transport-right">
          <button className={`icon-btn ${muted ? 'active' : ''}`} title="Muto monitor" onClick={() => setMuted(!muted)}>
            <Icon name={muted ? 'eyeOff' : 'volume'} size={15} />
          </button>
          <span className="audio-meter" aria-hidden="true">
            <i style={{ height: playing ? '68%' : '18%' }} />
            <i style={{ height: playing ? '44%' : '12%' }} />
            <i style={{ height: playing ? '82%' : '22%' }} />
          </span>
        </div>
      </div>
    </section>
  )
}
