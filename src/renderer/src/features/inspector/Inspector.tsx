import { useMemo, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import type { Clip } from '@shared/schemas'
import { formatTimecode, interpolateKeyframes } from '@shared/utils'
import { useProjectStore, EFFECT_CATALOG, defaultEffectParams } from '../../store/projectStore'
import { useUiStore } from '../../store/uiStore'
import { Icon } from '../../components/Icon'
import { Slider } from '../../components/Slider'

export function Inspector(): JSX.Element {
  const { t } = useTranslation()
  const tab = useUiStore((s) => s.inspectorTab)
  const setTab = useUiStore((s) => s.setInspectorTab)
  const toast = useUiStore((s) => s.toast)
  const project = useProjectStore((s) => s.project)
  const sequence = useProjectStore((s) => s.sequence())
  const selection = useProjectStore((s) => s.selection)
  const found = useMemo(() => {
    const id = selection.clipIds[0]
    if (!id) return null
    for (const track of sequence.tracks) {
      const clip = track.clips.find((c) => c.id === id)
      if (clip) return { clip, track }
    }
    return null
  }, [selection.clipIds, sequence.tracks])
  const clip = found?.clip ?? null
  const track = found?.track ?? null
  const playhead = useProjectStore((s) => s.playhead)
  const updateClip = useProjectStore((s) => s.updateClip)
  const updateTrack = useProjectStore((s) => s.updateTrack)
  const updateEffect = useProjectStore((s) => s.updateEffect)
  const addEffect = useProjectStore((s) => s.addEffect)
  const removeEffect = useProjectStore((s) => s.removeEffect)
  const toggleKeyframe = useProjectStore((s) => s.toggleKeyframe)
  const pushHistory = useProjectStore((s) => s.pushHistory)
  const splitAtPlayhead = useProjectStore((s) => s.splitAtPlayhead)
  const duplicate = useProjectStore((s) => s.duplicateSelected)
  const removeSelected = useProjectStore((s) => s.deleteSelected)

  const asset = useMemo(() => (clip?.mediaId ? project.media.find((m) => m.id === clip.mediaId) : null), [clip?.mediaId, project.media])
  // The colour tab edits one Color Wheels effect; the LUT stays independent.
  const colorEffect = clip?.effects.find((e) => e.type === 'Color Wheels')

  if (!clip || !track) {
    return (
      <section className="panel inspector" aria-label={t('inspector.title')}>
        <header className="panel-head">
          <div className="panel-title">
            <Icon name="settings" size={15} />
            <h2>{t('inspector.title')}</h2>
          </div>
        </header>
        <div className="inspector-empty">
          <span className="empty-icon">
            <Icon name="keyframe" size={22} />
          </span>
          <h3>{t('inspector.noSelection')}</h3>
          <p>{t('inspector.noSelectionHint')}</p>
          <div className="empty-shortcuts">
            <span><kbd>V</kbd> Selezione</span>
            <span><kbd>C</kbd> Forbici</span>
            <span><kbd>Ctrl</kbd>+<kbd>K</kbd> Dividi</span>
            <span><kbd>T</kbd> Aggiungi testo</span>
            <span><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> Comandi</span>
          </div>
        </div>
      </section>
    )
  }

  const localTime = playhead - clip.start
  const animated = (key: keyof Clip['transform']): number =>
    interpolateKeyframes(clip.keyframes?.[key] ?? [], localTime, clip.transform[key] as number)
  const hasKf = (key: string): boolean => (clip.keyframes?.[key] ?? []).some((k) => Math.abs(k.time - localTime) < 0.05)
  const setTransform = (key: keyof Clip['transform'], value: number): void => {
    updateClip(clip.id, { transform: { ...clip.transform, [key]: value } }, false)
  }
  const setColor = (key: string, value: number): void => {
    if (colorEffect) {
      updateEffect(clip.id, colorEffect.id, { params: { [key]: value } }, false)
      return
    }
    // First touch creates the grading effect; the store updates synchronously,
    // so the new instance is already available (no setTimeout race).
    addEffect(clip.id, 'Color Wheels')
    const created = useProjectStore.getState().selectedClip()?.clip.effects.find((e) => e.type === 'Color Wheels')
    if (created) useProjectStore.getState().updateEffect(clip.id, created.id, { params: { [key]: value } }, false)
  }
  const colorValue = (key: string, fallback: number): number => Number(colorEffect?.params[key] ?? fallback)

  return (
    <section className="panel inspector" aria-label={t('inspector.title')}>
      <header className="panel-head">
        <div className="panel-title">
          <Icon name="settings" size={15} />
          <h2>{t('inspector.title')}</h2>
        </div>
        <span className="badge" title={`${clip.start} → ${clip.start + clip.duration}`}>
          {formatTimecode(clip.duration, sequence.fps)}
        </span>
      </header>

      <div className="clip-summary">
        <span className="clip-summary-color" style={{ background: clip.color }} />
        <div>
          <strong>{clip.name}</strong>
          <span>{track.name} · {asset ? `${asset.codec.toUpperCase()} ${asset.width}×${asset.height}` : 'generator'}</span>
        </div>
        <div className="clip-summary-actions">
          <button className="icon-btn" title="Dividi" onClick={splitAtPlayhead}><Icon name="cut" size={13} /></button>
          <button className="icon-btn" title="Duplica" onClick={duplicate}><Icon name="layers" size={13} /></button>
          <button className="icon-btn danger" title="Elimina" onClick={removeSelected}><Icon name="trash" size={13} /></button>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {(['video', 'audio', 'color', 'effects'] as const).map((key) => (
          <button key={key} role="tab" aria-selected={tab === key} className={`tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
            {t(`inspector.${key}`)}
          </button>
        ))}
      </div>

      <div className="inspector-body">
        {tab === 'video' && (
          <>
            {clip.text && (
              <div className="text-editor">
                <div className="section-title"><span>Testo / Titolo</span></div>
                <textarea
                  value={clip.text.content}
                  onFocus={pushHistory}
                  onChange={(e) => {
                    const content = e.target.value
                    updateClip(
                      clip.id,
                      { text: { ...clip.text!, content }, name: content.trim().slice(0, 48) || 'Titolo' },
                      false
                    )
                  }}
                  aria-label="Contenuto testo"
                />
                <div className="text-editor-row">
                  <label>
                    Font{' '}
                    <input
                      type="number"
                      min={8}
                      max={400}
                      value={Math.round(clip.text.fontSize)}
                      onFocus={pushHistory}
                      onChange={(e) =>
                        updateClip(clip.id, { text: { ...clip.text!, fontSize: Number(e.target.value) || 8 } }, false)
                      }
                    />
                  </label>
                  <input
                    type="color"
                    value={clip.text.color.startsWith('#') ? clip.text.color : '#ffffff'}
                    onFocus={pushHistory}
                    onChange={(e) => updateClip(clip.id, { text: { ...clip.text!, color: e.target.value } }, false)}
                    aria-label="Colore testo"
                  />
                  <select
                    value={clip.text.align}
                    onFocus={pushHistory}
                    onChange={(e) =>
                      updateClip(clip.id, { text: { ...clip.text!, align: e.target.value as 'left' | 'center' | 'right' } }, false)
                    }
                    aria-label="Allineamento testo"
                  >
                    <option value="left">Sinistra</option>
                    <option value="center">Centro</option>
                    <option value="right">Destra</option>
                  </select>
                  <label>
                    <input
                      type="checkbox"
                      checked={clip.text.background}
                      onChange={(e) => updateClip(clip.id, { text: { ...clip.text!, background: e.target.checked } })}
                    />{' '}
                    Box
                  </label>
                </div>
                <div className="text-editor-row">
                  <span>X</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={clip.text.x}
                    onPointerDown={pushHistory}
                    onChange={(e) => updateClip(clip.id, { text: { ...clip.text!, x: Number(e.target.value) } }, false)}
                  />
                  <span>Y</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={clip.text.y}
                    onPointerDown={pushHistory}
                    onChange={(e) => updateClip(clip.id, { text: { ...clip.text!, y: Number(e.target.value) } }, false)}
                  />
                </div>
              </div>
            )}
            <div className="section-title">
              <span>{t('inspector.transform')}</span>
              <button
                className="link-btn"
                onClick={() =>
                  updateClip(clip.id, { transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } })
                }
              >
                {t('inspector.reset')}
              </button>
            </div>
            <Slider label={t('inspector.position') + ' X'} value={animated('x')} min={-sequence.width} max={sequence.width} step={1} unit="px" onBegin={pushHistory} onChange={(v) => setTransform('x', v)} hasKeyframe={hasKf('x')} onKeyframe={() => toggleKeyframe(clip.id, 'x', clip.transform.x)} />
            <Slider label={t('inspector.position') + ' Y'} value={animated('y')} min={-sequence.height} max={sequence.height} step={1} unit="px" onBegin={pushHistory} onChange={(v) => setTransform('y', v)} hasKeyframe={hasKf('y')} onKeyframe={() => toggleKeyframe(clip.id, 'y', clip.transform.y)} />
            <Slider label={t('inspector.scale')} value={animated('scale')} min={0.1} max={4} step={0.01} unit="×" onBegin={pushHistory} onChange={(v) => setTransform('scale', v)} hasKeyframe={hasKf('scale')} onKeyframe={() => toggleKeyframe(clip.id, 'scale', clip.transform.scale)} />
            <Slider label={t('inspector.rotation')} value={animated('rotation')} min={-180} max={180} step={0.5} unit="°" onBegin={pushHistory} onChange={(v) => setTransform('rotation', v)} hasKeyframe={hasKf('rotation')} onKeyframe={() => toggleKeyframe(clip.id, 'rotation', clip.transform.rotation)} />
            <Slider label={t('inspector.opacity')} value={animated('opacity')} min={0} max={1} step={0.01} onBegin={pushHistory} onChange={(v) => setTransform('opacity', v)} hasKeyframe={hasKf('opacity')} onKeyframe={() => toggleKeyframe(clip.id, 'opacity', clip.transform.opacity)} />
            <Slider label={t('inspector.speed')} value={clip.speed} min={0.1} max={8} step={0.05} unit="×" onBegin={pushHistory} onChange={(v) => updateClip(clip.id, { speed: v }, false)} />
            <div className="info-grid">
              <span>{t('media.duration')}</span>
              <strong>{formatTimecode(clip.duration, sequence.fps)}</strong>
              <span>In point</span>
              <strong>{formatTimecode(clip.inPoint, sequence.fps)}</strong>
              <span>Sorgente</span>
              <strong className="truncate" title={asset?.path}>{asset?.name ?? '—'}</strong>
              <span>Keyframe</span>
              <strong>{Object.values(clip.keyframes ?? {}).reduce((s, list) => s + list.length, 0)}</strong>
            </div>
          </>
        )}

        {tab === 'audio' && (
          <>
            <div className="section-title"><span>{t('inspector.audio')}</span></div>
            <Slider label={t('inspector.volume')} value={clip.volume} min={0} max={2} step={0.01} onBegin={pushHistory} onChange={(v) => updateClip(clip.id, { volume: v }, false)} />
            <Slider label={`Pan ${track.name}`} value={track.pan} min={-1} max={1} step={0.01} onBegin={pushHistory} onChange={(v) => updateTrack(track.id, { pan: v }, false)} />
            <Slider label={`Volume ${track.name}`} value={track.volume} min={0} max={1.5} step={0.01} onBegin={pushHistory} onChange={(v) => updateTrack(track.id, { volume: v }, false)} />
            <div className="meters">
              {['L', 'R'].map((ch) => (
                <div key={ch} className="meter">
                  <span>{ch}</span>
                  <div className="meter-bar"><i style={{ width: `${Math.min(100, clip.volume * 55 + 12)}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="hint-card">
              <Icon name="waveform" size={16} />
              <div>
                <strong>Loudness EBU R128</strong>
                <p>La normalizzazione loudness è applicata dai preset in export (target −14/−16 LUFS).</p>
              </div>
            </div>
            <div className="section-title"><span>Routing</span></div>
            <div className="info-grid">
              <span>Canali</span><strong>{asset?.channels ?? 2}</strong>
              <span>Sample rate</span><strong>{asset?.sampleRate ?? 48000} Hz</strong>
              <span>Bus</span><strong>Master</strong>
            </div>
          </>
        )}

        {tab === 'color' && (
          <>
            <div className="section-title">
              <span>Color grading</span>
              <button className="link-btn" onClick={() => addEffect(clip.id, 'Cinematic LUT')}>+ LUT</button>
            </div>
            <Slider label={t('inspector.temperature')} value={colorValue('temperature', 0)} min={-1} max={1} step={0.01} onBegin={pushHistory} onChange={(v) => setColor('temperature', v)} />
            <Slider label={t('inspector.tint')} value={colorValue('tint', 0)} min={-1} max={1} step={0.01} onBegin={pushHistory} onChange={(v) => setColor('tint', v)} />
            <Slider label={t('inspector.contrast')} value={colorValue('contrast', 1.05)} min={0.5} max={2} step={0.01} onBegin={pushHistory} onChange={(v) => setColor('contrast', v)} />
            <Slider label={t('inspector.saturation')} value={colorValue('saturation', 1)} min={0} max={2} step={0.01} onBegin={pushHistory} onChange={(v) => setColor('saturation', v)} />
            <div className="color-wheels">
              {(['lift', 'gamma', 'gain'] as const).map((wheel) => (
                <div className="wheel" key={wheel}>
                  <div className="wheel-dial" style={{ background: `conic-gradient(from 0deg, #ff5c5c, #ffb547, #4cd964, #38bdf8, #7c5cff, #ff5c8a, #ff5c5c)` }}>
                    <div className="wheel-pick" style={{ transform: `translate(${colorValue(wheel, 0) * 14}px, ${colorValue(wheel, 0) * -10}px)` }} />
                  </div>
                  <span>{wheel.toUpperCase()}</span>
                  <input type="range" min={-1} max={1} step={0.01} value={colorValue(wheel, 0)} onPointerDown={pushHistory} onChange={(e) => setColor(wheel, Number(e.target.value))} aria-label={wheel} />
                </div>
              ))}
            </div>
            <div className="hint-card">
              <Icon name="gauge" size={16} />
              <div>
                <strong>{sequence.colorSpace.toUpperCase()} · {asset?.isHDR ? 'HDR' : 'SDR'}</strong>
                <p>La conversione colore è trasparente in preview e export (Rec.709 / Rec.2020 / P3 / ACES).</p>
              </div>
            </div>
          </>
        )}

        {tab === 'effects' && (
          <>
            <div className="add-effect">
              <select
                className="select"
                defaultValue=""
                onChange={(e) => {
                  if (!e.target.value) return
                  addEffect(clip.id, e.target.value)
                  toast('success', `Effetto ${e.target.value} aggiunto`)
                  e.target.value = ''
                }}
                aria-label="Aggiungi effetto"
              >
                <option value="">{t('inspector.addEffect')}…</option>
                {EFFECT_CATALOG.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            {clip.effects.length === 0 && <p className="muted padded">Nessun effetto. Aggiungine uno dal menu qui sopra.</p>}
            <div className="effects-stack">
              {clip.effects.map((effect) => (
                <div key={effect.id} className={`effect ${effect.enabled ? '' : 'disabled'}`}>
                  <div className="effect-head">
                    <button className="eye" onClick={() => updateEffect(clip.id, effect.id, { enabled: !effect.enabled })}>
                      <Icon name={effect.enabled ? 'eye' : 'eyeOff'} size={13} />
                    </button>
                    <span>{effect.type}</span>
                    <button className="icon-btn danger" onClick={() => removeEffect(clip.id, effect.id)} aria-label="Rimuovi effetto">
                      <Icon name="close" size={12} />
                    </button>
                  </div>
                  <div className="effect-body">
                    {Object.entries(effect.params)
                      .filter(([, v]) => typeof v === 'number')
                      .map(([key, value]) => (
                        <Slider
                          key={key}
                          label={key}
                          value={Number(value)}
                          min={numericRange(effect.type, key).min}
                          max={numericRange(effect.type, key).max}
                          step={0.01}
                          onBegin={pushHistory}
                          onChange={(v) => updateEffect(clip.id, effect.id, { params: { [key]: v } }, false)}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-ghost btn-sm full"
              onClick={() => {
                const existing = clip.effects.find((e) => e.type === 'Adjustment Layer')
                void existing
                toast('info', 'Preset effetti: salvataggio in roadmap (FX-4)')
              }}
            >
              <Icon name="save" size={13} /> Salva preset effetti
            </button>
          </>
        )}
      </div>
    </section>
  )
}

function numericRange(type: string, key: string): { min: number; max: number } {
  if (/opacity/i.test(key)) return { min: 0, max: 1 }
  if (/radius|threshold|amount|intensity|tolerance|spill|size/i.test(`${key} ${type}`)) return { min: 0, max: type === 'Crop' ? 100 : 2 }
  if (/angle|rotation/i.test(key)) return { min: -180, max: 180 }
  if (/contrast|saturation|gain/i.test(key)) return { min: 0, max: 2 }
  const params = defaultEffectParams(type)
  void params
  return { min: -100, max: 100 }
}
