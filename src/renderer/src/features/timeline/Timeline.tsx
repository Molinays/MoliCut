import { memo, useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type JSX, type PointerEvent as ReactPointerEvent } from 'react'
import type { Clip, Track } from '@shared/schemas'
import { clamp, formatTimecode } from '@shared/utils'
import { call, filePath } from '../../bridge'
import { useProjectStore } from '../../store/projectStore'
import { useUiStore } from '../../store/uiStore'
import { Icon } from '../../components/Icon'

/**
 * Timeline interactions are implemented with pointer capture and a single
 * history snapshot per gesture (not per pixel). Times are snapped to frames and
 * optionally to clip edges/playhead; all mutations go through the store.
 */

const HEADER_WIDTH = 186
const RULER_HEIGHT = 28
const STEPS = [0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300]

interface DropPlan {
  start: number
  duration: number
  label: string
  kind: 'video' | 'audio' | 'image'
  videoTrackId?: string
  audioTrackId?: string
}

interface DragState {
  mode: 'move' | 'trim-left' | 'trim-right'
  clipId: string
  startX: number
  startY: number
  originStart: number
  originDuration: number
  originIn: number
  originTrackId: string
  /** True when the grabbed clip lives on an audio lane (drop targets must match). */
  isAudio: boolean
  /** Grab + linked twin: never snap the drag onto its own edges. */
  ignoreIds: string[]
  /** One history snapshot per gesture, taken on the first real movement. */
  historyPushed: boolean
  /** Lane rects captured at drag start: hit-testing without forced layout per event. */
  rows: Array<{ id: string; top: number; bottom: number }>
}

export function Timeline(): JSX.Element {
  const project = useProjectStore((s) => s.project)
  const sequence = useProjectStore((s) => s.sequence())
  const playhead = useProjectStore((s) => s.playhead)
  const zoom = useProjectStore((s) => s.zoom)
  const tool = useProjectStore((s) => s.tool)
  const snapping = useProjectStore((s) => s.snapping)
  const selection = useProjectStore((s) => s.selection)
  const waveforms = useProjectStore((s) => s.waveforms)
  const setPlayhead = useProjectStore((s) => s.setPlayhead)
  const setPlaying = useProjectStore((s) => s.setPlaying)
  const setZoom = useProjectStore((s) => s.setZoom)
  const setTool = useProjectStore((s) => s.setTool)
  const toggleSnap = useProjectStore((s) => s.toggleSnap)
  const selectClip = useProjectStore((s) => s.selectClip)
  const addTrack = useProjectStore((s) => s.addTrack)
  const addTextClip = useProjectStore((s) => s.addTextClip)
  const addMedia = useProjectStore((s) => s.addMedia)
  const updateTrack = useProjectStore((s) => s.updateTrack)
  const addMarker = useProjectStore((s) => s.addMarker)
  const undo = useProjectStore((s) => s.undo)
  const redo = useProjectStore((s) => s.redo)
  const canUndo = useProjectStore((s) => s.history.past.length > 0)
  const canRedo = useProjectStore((s) => s.history.future.length > 0)
  const toast = useUiStore((s) => s.toast)
  const scrollRef = useRef<HTMLDivElement>(null)
  const laneRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const dragFrameRef = useRef(0)
  const dragPendingRef = useRef<{ x: number; y: number } | null>(null)
  const rulerFrameRef = useRef(0)
  const rulerPendingRef = useRef<number | null>(null)
  const hoverFrameRef = useRef(0)
  const hoverPendingRef = useRef<number | null>(null)
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const [dropPreview, setDropPreview] = useState<DropPlan | null>(null)

  const duration = useMemo(() => {
    // Ruler length follows the edit in 30 s steps: tying it to the playhead made
    // the scrollable width grow on every playback frame (layout thrash).
    const end = Math.max(30, ...sequence.tracks.flatMap((t) => t.clips.map((c) => c.start + c.duration)))
    return Math.ceil((end + 10) / 30) * 30
  }, [sequence.tracks])

  const width = duration * zoom
  const fps = sequence.fps
  const frame = 1 / fps
  const tickStep = STEPS.find((s) => s * zoom >= 72) ?? 300
  const ticks = Math.ceil(duration / tickStep)

  const clips = useMemo(() => sequence.tracks.flatMap((t) => t.clips.map((c) => ({ clip: c, track: t }))), [sequence.tracks])

  const mediaById = useMemo(() => new Map(project.media.map((asset) => [asset.id, asset])), [project.media])

  /** Mirrors addClip's target selection so the ghost shows the real placement. */
  const planForMedia = useCallback(
    (mediaId: string, trackId: string, start: number): DropPlan | null => {
      const asset = mediaById.get(mediaId)
      if (!asset) return null
      const requested = sequence.tracks.find((track) => track.id === trackId && !track.locked)
      const videoTracks = sequence.tracks.filter((track) => (track.kind === 'video' || track.kind === 'adjustment') && !track.locked)
      const audioTracks = sequence.tracks.filter((track) => track.kind === 'audio' && !track.locked)
      const hasAudio = asset.kind === 'audio' || (asset.audioCodec !== '' && asset.channels > 0)
      const audioOnly = asset.kind === 'audio' || (asset.kind === 'video' && hasAudio && requested?.kind === 'audio')
      const duration = asset.kind === 'image' ? 5 : Math.max(0.1, asset.durationSec || 5)
      if (audioOnly) {
        const target = requested?.kind === 'audio' ? requested : [...audioTracks].reverse()[0]
        if (!target) return null
        return { start, duration, label: asset.name, kind: 'audio', audioTrackId: target.id }
      }
      const videoTarget = requested && (requested.kind === 'video' || requested.kind === 'adjustment') ? requested : [...videoTracks].reverse()[0]
      if (!videoTarget) return null
      const audioTarget = asset.kind === 'video' && hasAudio ? [...audioTracks].reverse()[0] : undefined
      return {
        start,
        duration,
        label: asset.name,
        kind: asset.kind === 'image' ? 'image' : 'video',
        videoTrackId: videoTarget.id,
        audioTrackId: audioTarget?.id
      }
    },
    [mediaById, sequence.tracks]
  )

  /** External files: the duration is unknown until FFprobe, so ghost 5 s. */
  const planForKind = useCallback(
    (kind: 'video' | 'audio' | 'image', trackId: string, start: number, label: string): DropPlan | null => {
      const requested = sequence.tracks.find((track) => track.id === trackId && !track.locked)
      const videoTracks = sequence.tracks.filter((track) => (track.kind === 'video' || track.kind === 'adjustment') && !track.locked)
      const audioTracks = sequence.tracks.filter((track) => track.kind === 'audio' && !track.locked)
      if (kind === 'audio') {
        const target = requested?.kind === 'audio' ? requested : [...audioTracks].reverse()[0]
        return target ? { start, duration: 5, label, kind, audioTrackId: target.id } : null
      }
      const videoTarget = requested && (requested.kind === 'video' || requested.kind === 'adjustment') ? requested : [...videoTracks].reverse()[0]
      if (!videoTarget) return null
      return {
        start,
        duration: 5,
        label,
        kind,
        videoTrackId: videoTarget.id,
        audioTrackId: kind === 'video' ? [...audioTracks].reverse()[0]?.id : undefined
      }
    },
    [sequence.tracks]
  )

  const snapTime = useCallback(
    (time: number, ignoreIds?: string[]): number => {
      const frameSnapped = Math.round(time / frame) * frame
      if (!snapping) return frameSnapped
      const threshold = 7 / zoom
      const ignore = ignoreIds && ignoreIds.length > 0 ? new Set(ignoreIds) : null
      const candidates: number[] = [0, playhead, ...sequence.markers.map((m) => m.time)]
      for (const item of clips) {
        if (ignore?.has(item.clip.id)) continue
        candidates.push(item.clip.start, item.clip.start + item.clip.duration)
      }
      let best = frameSnapped
      let bestDelta = threshold
      for (const candidate of candidates) {
        const delta = Math.abs(candidate - frameSnapped)
        if (delta < bestDelta) {
          best = candidate
          bestDelta = delta
        }
      }
      return Math.max(0, best)
    },
    [clips, frame, playhead, sequence.markers, snapping, zoom]
  )

  const timeFromClientX = useCallback(
    (clientX: number): number => {
      const lane = laneRef.current
      if (!lane) return 0
      // `.lanes` spans the full grid: the track headers (HEADER_WIDTH) sit at
      // its left edge, so the time origin is HEADER_WIDTH px right of rect.left.
      const rect = lane.getBoundingClientRect()
      return Math.max(0, (clientX - rect.left - HEADER_WIDTH) / zoom)
    },
    [zoom]
  )

  /** Seek target: exact frame under the pointer, no clip/playhead snapping. */
  const seekTo = useCallback(
    (clientX: number): number => {
      const time = timeFromClientX(clientX)
      return Math.max(0, Math.round(time / frame) * frame)
    },
    [frame, timeFromClientX]
  )

  /**
   * Pointer events fire at device rate (a 1000Hz mouse sends 4x per frame).
   * Coalescing to one store write per animation frame keeps scrubbing and
   * dragging smooth instead of flooding React with re-renders.
   */
  const queueSeek = (clientX: number): void => {
    rulerPendingRef.current = clientX
    if (rulerFrameRef.current) return
    rulerFrameRef.current = requestAnimationFrame(() => {
      rulerFrameRef.current = 0
      const x = rulerPendingRef.current
      rulerPendingRef.current = null
      if (x !== null) setPlayhead(seekTo(x))
    })
  }

  const queueHover = (time: number | null): void => {
    hoverPendingRef.current = time
    if (hoverFrameRef.current) return
    hoverFrameRef.current = requestAnimationFrame(() => {
      hoverFrameRef.current = 0
      setHoverTime(hoverPendingRef.current)
    })
  }

  const onRulerPointer = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setPlaying(false)
    queueSeek(event.clientX)
  }

  const onRulerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      queueSeek(event.clientX)
    }
  }

  const onClipPointerDown = (event: ReactPointerEvent<HTMLDivElement>, clip: Clip, track: Track): void => {
    event.stopPropagation()
    if (track.locked) return
    setPlaying(false)
    selectClip(clip.id, event.ctrlKey || event.metaKey)
    if (tool === 'blade') {
      const time = seekTo(event.clientX)
      useProjectStore.getState().setPlayhead(time)
      useProjectStore.getState().splitAtPlayhead()
      return
    }
    const target = event.target as HTMLElement
    // Trim zones are reachable even on an UNSELECTED clip: an 8 px band at
    // either visual edge starts a trim (matches the handle size), so the user
    // does not have to select first and then grab a tiny handle. Handles keep
    // precedence when the clip is selected and the pointer is on them.
    const clipRect = event.currentTarget.getBoundingClientRect()
    const zone = 8
    const wide = clipRect.width > zone * 2 + 4
    const nearLeft = wide && event.clientX - clipRect.left <= zone
    const nearRight = wide && clipRect.right - event.clientX <= zone
    const mode =
      target.dataset.handle === 'left' || (target.dataset.handle === undefined && nearLeft)
        ? 'trim-left'
        : target.dataset.handle === 'right' || (target.dataset.handle === undefined && nearRight)
          ? 'trim-right'
          : 'move'
    // History is snapshotted on the first real movement (applyDrag), not on
    // every mousedown: plain clicks used to fill undo with no-op states.
    const ignoreIds = clip.linkId
      ? useProjectStore
          .getState()
          .sequence()
          .tracks.flatMap((t) => t.clips)
          .filter((c) => c.linkId === clip.linkId)
          .map((c) => c.id)
      : [clip.id]
    // Measure lane rects once: `elementFromPoint` per pointermove forced a
    // synchronous layout on every event — a major source of drag lag.
    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-track-id]')).map((el) => {
      const rect = el.getBoundingClientRect()
      return { id: el.dataset.trackId ?? '', top: rect.top, bottom: rect.bottom }
    })
    dragRef.current = {
      mode,
      clipId: clip.id,
      startX: event.clientX,
      startY: event.clientY,
      originStart: clip.start,
      originDuration: clip.duration,
      originIn: clip.inPoint,
      originTrackId: track.id,
      isAudio: track.kind === 'audio',
      ignoreIds,
      historyPushed: false,
      rows
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const applyDrag = useCallback(
    (clientX: number, clientY: number): void => {
      const drag = dragRef.current
      if (!drag) return
      // Ignore sub-pixel jitter so a plain click never creates a drag/history.
      if (Math.abs(clientX - drag.startX) < 2 && Math.abs(clientY - drag.startY) < 2) return
      if (!drag.historyPushed) {
        useProjectStore.getState().pushHistory()
        drag.historyPushed = true
      }
      const state = useProjectStore.getState()
      const live = state
        .sequence()
        .tracks.flatMap((t) => t.clips)
        .find((c) => c.id === drag.clipId)
      if (!live) return
      const delta = (clientX - drag.startX) / zoom
      if (drag.mode === 'move') {
        const start = snapTime(Math.max(0, drag.originStart + delta), drag.ignoreIds)
        let trackId = drag.originTrackId
        const row = drag.rows.find((r) => clientY >= r.top && clientY < r.bottom)
        if (row?.id) {
          const candidate = sequence.tracks.find((t) => t.id === row.id)
          const allowed =
            candidate !== undefined &&
            !candidate.locked &&
            (drag.isAudio
              ? candidate.kind === 'audio'
              : candidate.kind === 'video' || candidate.kind === 'adjustment')
          if (allowed) trackId = candidate.id
        }
        state.moveClip(drag.clipId, start, trackId, false)
      } else if (drag.mode === 'trim-left') {
        // Targets are absolute (origin + pointer delta). Passing that value as
        // an increment on every rAF made the edge accelerate away from the
        // pointer; the delta must be measured against the clip's live state.
        const targetStart = snapTime(Math.max(0, drag.originStart + delta), drag.ignoreIds)
        state.trimClip(drag.clipId, 'left', targetStart - live.start, false)
      } else {
        const targetEnd = snapTime(drag.originStart + drag.originDuration + delta, drag.ignoreIds)
        state.trimClip(drag.clipId, 'right', targetEnd - (live.start + live.duration), false)
      }
    },
    [sequence.tracks, snapTime, zoom]
  )

  const onClipPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!dragRef.current) return
    dragPendingRef.current = { x: event.clientX, y: event.clientY }
    if (dragFrameRef.current) return
    dragFrameRef.current = requestAnimationFrame(() => {
      dragFrameRef.current = 0
      const pending = dragPendingRef.current
      dragPendingRef.current = null
      if (pending) applyDrag(pending.x, pending.y)
    })
  }

  const onClipPointerUp = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (dragFrameRef.current) {
      cancelAnimationFrame(dragFrameRef.current)
      dragFrameRef.current = 0
    }
    // Flush the last position so the clip never rests where the rAF left off.
    const pending = dragPendingRef.current
    dragPendingRef.current = null
    if (pending) applyDrag(pending.x, pending.y)
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const clearDropPreview = (): void => {
    setDropPreview(null)
    useUiStore.getState().setDraggedMediaId(null)
  }

  const onTrackDragOver = (event: DragEvent<HTMLDivElement>, track: Track): void => {
    const types = Array.from(event.dataTransfer.types)
    const hasMedia = types.includes('application/x-molicut-media')
    const hasFiles = types.includes('Files')
    if (!hasMedia && !hasFiles) return
    event.preventDefault()
    if (event.dataTransfer.dropEffect !== 'none') event.dataTransfer.dropEffect = 'copy'
    const time = snapTime(timeFromClientX(event.clientX))
    if (hasMedia) {
      const mediaId = useUiStore.getState().draggedMediaId
      setDropPreview(mediaId ? planForMedia(mediaId, track.id, time) : null)
      return
    }
    const items = Array.from(event.dataTransfer.items ?? []).filter((item) => item.kind === 'file')
    const mime = items[0]?.type ?? ''
    const kind: DropPlan['kind'] = mime.startsWith('audio/') ? 'audio' : mime.startsWith('image/') ? 'image' : 'video'
    const label = items.length > 1 ? `${items.length} file` : kind === 'audio' ? 'File audio' : kind === 'image' ? 'Immagine' : 'Video'
    setDropPreview(planForKind(kind, track.id, time, label))
  }

  const onDrop = (event: DragEvent<HTMLDivElement>, track: Track): void => {
    event.preventDefault()
    if (track.locked) {
      toast('warn', 'Traccia bloccata')
      clearDropPreview()
      return
    }
    const time = dropPreview?.start ?? snapTime(timeFromClientX(event.clientX))
    const files = Array.from(event.dataTransfer.files ?? [])
    if (files.length > 0) {
      const paths = files.map((file) => filePath(file)).filter((path) => path.length > 0)
      const plan = dropPreview
      clearDropPreview()
      if (paths.length === 0) {
        toast('warn', 'Impossibile leggere il percorso dei file trascinati.')
        return
      }
      void (async () => {
        try {
          const { assets } = await call('media:importPaths', { paths, generateProxies: false })
          if (assets.length === 0) {
            toast('warn', 'Nessun file importabile (formato non supportato).')
            return
          }
          addMedia(assets)
          const targetTrack = plan?.videoTrackId ?? plan?.audioTrackId ?? track.id
          let cursor = time
          for (const asset of assets) {
            useProjectStore.getState().addClip(asset.id, targetTrack, cursor)
            cursor += asset.kind === 'image' ? 5 : Math.max(0.1, asset.durationSec || 5)
          }
          toast('success', `${assets.length} file importati nella timeline`)
        } catch (err) {
          toast('error', (err as Error).message)
        }
      })()
      return
    }

    const mediaId = event.dataTransfer.getData('application/x-molicut-media')
    const plan = mediaId ? planForMedia(mediaId, track.id, time) : null
    clearDropPreview()
    if (!mediaId || !plan) return
    useProjectStore.getState().addClip(mediaId, plan.videoTrackId ?? plan.audioTrackId ?? track.id, plan.start)
  }

  const fitZoom = (): void => {
    const scroll = scrollRef.current
    if (!scroll) return
    setZoom(clamp((scroll.clientWidth - HEADER_WIDTH - 40) / Math.max(20, duration), 8, 320))
    scroll.scrollLeft = 0
  }

  /** Zoom around the viewport centre instead of its left edge. */
  const applyZoom = (next: number): void => {
    const scroll = scrollRef.current
    const clamped = clamp(next, 8, 320)
    if (!scroll || clamped === zoom) return
    const viewport = Math.max(80, scroll.clientWidth - HEADER_WIDTH)
    const anchorTime = (scroll.scrollLeft + viewport / 2) / zoom
    setZoom(clamped)
    requestAnimationFrame(() => {
      scroll.scrollLeft = Math.max(0, anchorTime * clamped - viewport / 2)
    })
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      // Never steal Ctrl+C / Ctrl+V from the browser clipboard.
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (event.key === 'v' || event.key === 'V') setTool('select')
      if (event.key === 'c' || event.key === 'C') setTool('blade')
    }
    const onDragEnd = (): void => clearDropPreview()
    window.addEventListener('keydown', onKey)
    window.addEventListener('dragend', onDragEnd)
    window.addEventListener('drop', onDragEnd)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('dragend', onDragEnd)
      window.removeEventListener('drop', onDragEnd)
    }
  }, [setTool])

  useEffect(
    () => () => {
      if (dragFrameRef.current) cancelAnimationFrame(dragFrameRef.current)
      if (rulerFrameRef.current) cancelAnimationFrame(rulerFrameRef.current)
      if (hoverFrameRef.current) cancelAnimationFrame(hoverFrameRef.current)
    },
    []
  )

  return (
    <section className={`panel timeline tool-${tool}`} aria-label="Timeline" data-tool={tool}>
      <header className="panel-head timeline-head">
        <div className="panel-title">
          <Icon name="layers" size={15} />
          <h2>Timeline</h2>
          <span className="badge subtle">{sequence.name}</span>
        </div>
        <div className="timeline-tools">
          <div className="tool-group">
            <button className={`tool ${tool === 'select' ? 'active' : ''}`} onClick={() => setTool('select')} title="Selezione (V)">
              <Icon name="keyframe" size={14} />
            </button>
            <button className={`tool ${tool === 'blade' ? 'active' : ''}`} onClick={() => setTool('blade')} title="Forbici (C)">
              <Icon name="cut" size={14} />
            </button>
          </div>
          <button className={`tool ${snapping ? 'active' : ''}`} onClick={toggleSnap} title="Snap">
            <Icon name="magnet" size={14} />
          </button>
          <div className="tool-sep" />
          <button className="icon-btn" onClick={undo} disabled={!canUndo} title="Annulla">
            <Icon name="undo" size={14} />
          </button>
          <button className="icon-btn" onClick={redo} disabled={!canRedo} title="Ripeti">
            <Icon name="redo" size={14} />
          </button>
          <div className="tool-sep" />
          <button className="icon-btn" onClick={() => addTrack('video')} title="Aggiungi traccia video">
            <Icon name="film" size={14} />
            <span className="mini-plus">+</span>
          </button>
          <button className="icon-btn" onClick={() => addTrack('audio')} title="Aggiungi traccia audio">
            <Icon name="audio" size={14} />
            <span className="mini-plus">+</span>
          </button>
          <button className="icon-btn" onClick={() => addTrack('subtitle')} title="Aggiungi traccia testo">
            <Icon name="file" size={14} />
            <span className="mini-plus">+</span>
          </button>
          <button className="icon-btn" onClick={() => addTextClip()} title="Aggiungi testo (T)">
            <Icon name="sparkles" size={14} />
            <span className="mini-plus">T</span>
          </button>
          <button className="icon-btn" onClick={() => addMarker('')} title="Marker (M)">
            <Icon name="keyframe" size={13} />
            <span className="mini-plus">+</span>
          </button>
        </div>
        <div className="zoom-control">
          <button className="icon-btn" onClick={() => applyZoom(zoom / 1.25)} aria-label="Zoom out">
            <Icon name="zoomOut" size={14} />
          </button>
          <input type="range" min={8} max={320} value={zoom} onChange={(e) => applyZoom(Number(e.target.value))} aria-label="Zoom timeline" />
          <button className="icon-btn" onClick={() => applyZoom(zoom * 1.25)} aria-label="Zoom in">
            <Icon name="zoomIn" size={14} />
          </button>
          <button className="btn btn-ghost btn-xs" onClick={fitZoom}>
            Fit
          </button>
        </div>
      </header>

      <div className="timeline-scroll" ref={scrollRef}>
        <div className="timeline-grid" style={{ width: width + HEADER_WIDTH }}>
          <div className="ruler-row" style={{ height: RULER_HEIGHT }}>
            <div className="ruler-spacer" style={{ width: HEADER_WIDTH }}>
              <span className="ruler-hint">{formatTimecode(playhead, fps)}</span>
            </div>
            <div
              className="ruler"
              style={{ width }}
              onPointerDown={onRulerPointer}
              onPointerMove={onRulerMove}
              onPointerLeave={() => queueHover(null)}
              onMouseMove={(e) => queueHover(timeFromClientX(e.clientX))}
              role="slider"
              aria-label="Playhead"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={playhead}
              tabIndex={0}
            >
              {Array.from({ length: ticks + 1 }, (_, i) => {
                const time = i * tickStep
                return (
                  <div key={i} className="tick" style={{ left: time * zoom }}>
                    <span>{formatTimecode(time, fps).slice(3, 8)}</span>
                  </div>
                )
              })}
              {sequence.markers.map((marker) => (
                <div key={marker.id} className="marker" style={{ left: marker.time * zoom, background: marker.color }} title={marker.label} />
              ))}
              {hoverTime !== null && <div className="ruler-hover" style={{ left: hoverTime * zoom }} />}
            </div>
          </div>

          <div className="lanes" ref={laneRef}>
            {sequence.tracks.map((track) => (
              <div className={`track-row ${track.kind} ${track.locked ? 'locked' : ''}`} key={track.id} style={{ height: track.height }}>
                <div className="track-header" style={{ width: HEADER_WIDTH }}>
                  <div className="track-title">
                    <Icon name={track.kind === 'audio' ? 'audio' : track.kind === 'subtitle' ? 'file' : 'film'} size={13} />
                    <span>{track.name}</span>
                  </div>
                  <div className="track-controls">
                    <button className={track.mute ? 'on' : ''} onClick={() => updateTrack(track.id, { mute: !track.mute })} title="Mute">
                      <Icon name={track.mute ? 'eyeOff' : 'volume'} size={12} />
                    </button>
                    <button className={track.solo ? 'on solo' : ''} onClick={() => updateTrack(track.id, { solo: !track.solo })} title="Solo">
                      S
                    </button>
                    <button className={track.locked ? 'on' : ''} onClick={() => updateTrack(track.id, { locked: !track.locked })} title="Blocca">
                      <Icon name={track.locked ? 'lock' : 'unlock'} size={12} />
                    </button>
                  </div>
                  {track.kind === 'audio' && (
                    <input
                      className="track-volume"
                      type="range"
                      min={0}
                      max={1.5}
                      step={0.01}
                      value={track.volume}
                      onPointerDown={() => useProjectStore.getState().pushHistory()}
                      onChange={(e) => updateTrack(track.id, { volume: Number(e.target.value) }, false)}
                      aria-label={`Volume ${track.name}`}
                    />
                  )}
                </div>
                <div
                  className="track-lane"
                  style={{ width }}
                  data-track-id={track.id}
                  onDragOver={(e) => onTrackDragOver(e, track)}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropPreview(null)
                  }}
                  onDrop={(e) => onDrop(e, track)}
                  onPointerDown={(e) => {
                    if (e.target === e.currentTarget) {
                      selectClip(null)
                      setPlaying(false)
                      setPlayhead(seekTo(e.clientX))
                    }
                  }}
                >
                  {track.clips.map((clip) => {
                    const selected = selection.clipIds.includes(clip.id)
                    const isAudio = track.kind === 'audio'
                    return (
                      <div
                        key={clip.id}
                        className={`clip ${selected ? 'selected' : ''} ${isAudio ? 'audio-clip' : ''} ${clip.text ? 'text-clip' : ''}`}
                        style={{ left: clip.start * zoom, width: Math.max(3, clip.duration * zoom), borderColor: clip.color }}
                        onPointerDown={(e) => onClipPointerDown(e, clip, track)}
                        onPointerMove={onClipPointerMove}
                        onPointerUp={onClipPointerUp}
                        onDragStart={(e) => e.preventDefault()}
                        onDoubleClick={() => {
                          const asset = project.media.find((m) => m.id === clip.mediaId)
                          if (asset) useProjectStore.getState().loadWaveform(asset.id)
                          useUiStore.getState().openModal('export', { mediaId: clip.mediaId })
                        }}
                        title={`${clip.name} · ${formatTimecode(clip.start, fps)} → ${formatTimecode(clip.start + clip.duration, fps)}`}
                      >
                        <ClipBody clip={clip} isAudio={isAudio} waveform={waveforms[clip.mediaId ?? '']} />
                        {selected && (
                          <>
                            <span className="trim-handle left" data-handle="left" />
                            <span className="trim-handle right" data-handle="right" />
                          </>
                        )}
                      </div>
                    )
                  })}
                  {dropPreview &&
                    (dropPreview.videoTrackId === track.id || dropPreview.audioTrackId === track.id) && (
                      <div
                        className={`drop-ghost ${dropPreview.videoTrackId === track.id ? 'video' : 'audio'}`}
                        style={{
                          left: dropPreview.start * zoom,
                          width: Math.max(6, dropPreview.duration * zoom)
                        }}
                      >
                        <span>{dropPreview.label}</span>
                        <em>
                          {dropPreview.audioTrackId === track.id && dropPreview.videoTrackId !== track.id
                            ? 'AUDIO'
                            : dropPreview.kind === 'image'
                              ? 'IMMAGINE'
                              : 'VIDEO'}
                        </em>
                      </div>
                    )}
                  {track.clips.length === 0 && !dropPreview && <span className="lane-empty">Trascina media qui</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="playhead" style={{ left: HEADER_WIDTH + playhead * zoom, top: 0, height: RULER_HEIGHT + sequence.tracks.reduce((s, t) => s + t.height, 0) }}>
            <span className="playhead-cap" />
          </div>
        </div>
      </div>
      <div className="timeline-foot">
        <span>{formatTimecode(playhead, fps)}</span>
        <span className="foot-dim">{tool === 'blade' ? 'Forbici: clicca una clip per dividerla' : 'Trascina clip, usa i bordi per il trim'}</span>
        <span className="foot-dim">{Math.round(zoom)} px/s · {sequence.tracks.length} tracce</span>
      </div>
    </section>
  )
}

function pseudoWave(seed: string): number[] {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 9973
  return Array.from({ length: 420 }, (_, i) => {
    const n = Math.abs(Math.sin((i + hash) / 9) * 0.55 + Math.sin((i + hash) / 2.7) * 0.25)
    return Math.min(1, n + (i % 17 === 0 ? 0.32 : 0))
  })
}

/**
 * Heavy per-clip visuals (waveform bars, stripes, badges). Memoized so a clip
 * drag re-renders only the mutated clip: the other rows skip their hundreds of
 * bar nodes, which is what made dragging lag.
 */
const ClipBody = memo(function ClipBody({
  clip,
  isAudio,
  waveform
}: {
  clip: Clip
  isAudio: boolean
  waveform: number[] | undefined
}) {
  const fallback = useMemo(() => pseudoWave(clip.id), [clip.id])
  const peaks = waveform ?? fallback
  return (
    <>
      <span className="clip-color" style={{ background: clip.color }} />
      <div className="clip-content">
        <span className="clip-name">
          {clip.name}
          {clip.effects.length > 0 && <em className="clip-fx">FX {clip.effects.length}</em>}
          {clip.speed !== 1 && <em className="clip-speed">{clip.speed}x</em>}
        </span>
        {clip.text ? (
          <span className="clip-text-chip">TESTO · {clip.text.content}</span>
        ) : isAudio ? (
          <div className="clip-wave">
            {peaks.slice(0, Math.max(8, Math.floor(clip.duration * 18))).map((peak, i) => (
              <i key={i} style={{ height: `${Math.max(8, peak * 100)}%` }} />
            ))}
          </div>
        ) : (
          <div className="clip-stripes">
            {Array.from({ length: Math.max(1, Math.floor(clip.duration)) }, (_, i) => (
              <i key={i} style={{ opacity: 0.12 + (i % 3) * 0.05 }} />
            ))}
          </div>
        )}
        {Object.keys(clip.keyframes ?? {}).some((k) => (clip.keyframes?.[k]?.length ?? 0) > 0) && (
          <span className="clip-keyframes">
            <Icon name="keyframe" size={9} /> Keyframed
          </span>
        )}
      </div>
    </>
  )
})
