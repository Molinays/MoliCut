import { create } from 'zustand'
import type { Clip, MediaAsset, Project, Sequence, Track } from '@shared/schemas'
import { getActiveSequence, createTrack, refreshSequenceDurations } from '@shared/projectFactory'
import { clamp, deepClone, uid } from '@shared/utils'
import { call } from '../bridge'

interface ProjectState {
  project: Project
  projectPath: string | null
  dirty: boolean
  history: { past: Project[]; future: Project[] }
  selection: { clipIds: string[]; trackId: string | null }
  playhead: number
  playing: boolean
  speed: number
  zoom: number
  tool: 'select' | 'blade' | 'slip' | 'slide'
  snapping: boolean
  waveforms: Record<string, number[]>
  bootstrapped: boolean
  autosaveAt: string | null
  error: string | null

  bootstrap: () => Promise<void>
  setProject: (project: Project, path?: string | null) => void
  newProject: (name?: string) => Promise<void>
  openProject: () => Promise<void>
  saveProject: (saveAs?: boolean) => Promise<void>
  autosave: () => Promise<void>
  importMedia: () => Promise<MediaAsset[]>
  addMedia: (assets: MediaAsset[]) => void
  removeMedia: (mediaId: string) => void
  relinkMedia: (mediaId: string) => Promise<void>
  loadWaveform: (mediaId: string) => Promise<void>
  addClip: (mediaId: string, trackId?: string, start?: number) => void
  moveClip: (clipId: string, start: number, trackId: string, recordHistory?: boolean) => void
  trimClip: (clipId: string, edge: 'left' | 'right', deltaSeconds: number, recordHistory?: boolean) => void
  splitAtPlayhead: () => void
  deleteSelected: () => void
  rippleDeleteSelected: () => void
  duplicateSelected: () => void
  addTextClip: (content?: string) => void
  selectClip: (clipId: string | null, additive?: boolean) => void
  selectAllClips: () => void
  updateClip: (clipId: string, patch: Partial<Clip>, recordHistory?: boolean) => void
  updateEffect: (
    clipId: string,
    effectId: string,
    patch: { enabled?: boolean; params?: Record<string, number | string | boolean> },
    recordHistory?: boolean
  ) => void
  addEffect: (clipId: string, type: string) => void
  removeEffect: (clipId: string, effectId: string) => void
  toggleKeyframe: (clipId: string, property: string, value: number) => void
  setPlayhead: (seconds: number) => void
  setPlaying: (playing: boolean) => void
  togglePlay: () => void
  setZoom: (zoom: number) => void
  setTool: (tool: ProjectState['tool']) => void
  toggleSnap: () => void
  addTrack: (kind: Track['kind']) => void
  updateTrack: (trackId: string, patch: Partial<Track>, recordHistory?: boolean) => void
  addMarker: (label: string) => void
  setActiveSequence: (sequenceId: string) => void
  pushHistory: () => void
  undo: () => void
  redo: () => void
  sequence: () => Sequence
  selectedClip: () => { clip: Clip; track: Track } | null
}

const MAX_HISTORY = 80

function touch(project: Project): Project {
  return { ...project, modifiedAt: new Date().toISOString() }
}

/** Drop selection ids that no longer exist after an undo/redo. */
function pruneSelection(
  project: Project,
  selection: { clipIds: string[]; trackId: string | null }
): { clipIds: string[]; trackId: string | null } {
  const ids = new Set<string>()
  for (const sequence of project.sequences) {
    for (const track of sequence.tracks) for (const clip of track.clips) ids.add(clip.id)
  }
  const clipIds = selection.clipIds.filter((id) => ids.has(id))
  return { clipIds, trackId: clipIds.length > 0 ? selection.trackId : null }
}

export const useProjectStore = create<ProjectState>((set, get) => {
  const mutate = (fn: (draft: Project) => void, options: { history?: boolean } = {}): void => {
    const state = get()
    const snapshot = options.history === false ? null : deepClone(state.project)
    const draft = deepClone(state.project)
    fn(draft)
    // Ruler length follows the edit (kept as a padded minimum so the timeline
    // does not collapse); playback uses the exact content end instead.
    refreshSequenceDurations(draft)
    set({
      project: touch(draft),
      dirty: true,
      history: snapshot
        ? { past: [...state.history.past, snapshot].slice(-MAX_HISTORY), future: [] }
        : state.history
    })
  }

  const findClip = (clipId: string): { clip: Clip; track: Track } | null => {
    for (const track of get().sequence().tracks) {
      const clip = track.clips.find((c) => c.id === clipId)
      if (clip) return { clip, track }
    }
    return null
  }

  return {
    project: {
      schemaVersion: 1,
      id: 'prj_boot',
      name: 'Loading',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      activeSequenceId: 'seq_boot',
      sequences: [
        {
          id: 'seq_boot',
          name: 'Sequence 01',
          width: 1920,
          height: 1080,
          fps: 30,
          duration: 300,
          colorSpace: 'rec709',
          tracks: [],
          markers: []
        }
      ],
      media: []
    },
    projectPath: null,
    dirty: false,
    history: { past: [], future: [] },
    selection: { clipIds: [], trackId: null },
    playhead: 0,
    playing: false,
    speed: 1,
    zoom: 42,
    tool: 'select',
    snapping: true,
    waveforms: {},
    bootstrapped: false,
    autosaveAt: null,
    error: null,

    sequence: () => getActiveSequence(get().project),

    bootstrap: async () => {
      try {
        const { settings } = await call('settings:get', {})
        const info = await call('app:info', {})
        let restored = false
        if (info.recoveredFromCrash) {
          try {
            const recovery = await call('project:recoverAutosave', {})
            if (recovery) {
              get().setProject(recovery.project)
              set({ autosaveAt: recovery.savedAt })
              restored = true
            }
          } catch (err) {
            // A corrupt autosave must never block a clean new project.
            set({ error: (err as Error).message })
          }
        }
        if (!restored) {
          const { project } = await call('project:new', { name: 'Untitled Project' })
          get().setProject(project)
        }
        set({ zoom: settings.previewQuality === 'quarter' ? 28 : 42, bootstrapped: true })
      } catch (err) {
        set({ error: (err as Error).message, bootstrapped: true })
      }
    },

    setProject: (project, path = null) =>
      set({
        project,
        projectPath: path,
        dirty: false,
        history: { past: [], future: [] },
        selection: { clipIds: [], trackId: null },
        playhead: 0,
        playing: false,
        waveforms: {}
      }),

    newProject: async (name = 'Untitled Project') => {
      const { project } = await call('project:new', { name })
      get().setProject(project)
    },

    openProject: async () => {
      const result = await call('project:openDialog', {})
      if (result.canceled || !result.project) return
      get().setProject(result.project, result.path ?? null)
    },

    saveProject: async (saveAs = false) => {
      const result = await call('project:save', { project: get().project, path: saveAs ? undefined : get().projectPath ?? undefined })
      if (result.canceled) return
      set({ projectPath: result.path, dirty: false })
    },

    autosave: async () => {
      if (!get().dirty) return
      const result = await call('project:autosave', { project: get().project })
      set({ autosaveAt: result.savedAt, dirty: false })
    },

    importMedia: async () => {
      const result = await call('media:importDialog', { generateProxies: false })
      if (result.canceled) return []
      get().addMedia(result.assets)
      return result.assets
    },

    addMedia: (assets) => {
      const existing = new Set(get().project.media.map((m) => m.path))
      const fresh = assets.filter((a) => !existing.has(a.path))
      if (fresh.length === 0) return
      mutate((draft) => {
        draft.media.push(...fresh)
      })
    },

    removeMedia: (mediaId) =>
      mutate((draft) => {
        draft.media = draft.media.filter((m) => m.id !== mediaId)
        for (const sequence of draft.sequences) {
          for (const track of sequence.tracks) {
            track.clips = track.clips.filter((c) => c.mediaId !== mediaId)
          }
        }
      }),

    relinkMedia: async (mediaId) => {
      const current = get().project.media.find((m) => m.id === mediaId)
      const result = await call('media:chooseRelink', { assetId: mediaId, name: current?.name })
      if (result.canceled || !result.asset) return
      mutate((draft) => {
        draft.media = draft.media.map((m) => (m.id === mediaId ? { ...result.asset!, status: 'online' } : m))
      })
    },

    loadWaveform: async (mediaId) => {
      if (get().waveforms[mediaId]) return
      const asset = get().project.media.find((m) => m.id === mediaId)
      if (!asset) return
      try {
        const { peaks } = await call('media:waveform', { path: asset.path, buckets: 600 })
        set((state) => ({ waveforms: { ...state.waveforms, [mediaId]: peaks } }))
      } catch {
        /* waveform is decorative; ignore failures */
      }
    },

    addClip: (mediaId, trackId, start) => {
      const asset = get().project.media.find((m) => m.id === mediaId)
      if (!asset) return
      const sequence = get().sequence()
      const requested = trackId ? sequence.tracks.find((t) => t.id === trackId && !t.locked) : undefined
      const hasAudio = asset.kind === 'audio' || (asset.audioCodec !== '' && asset.channels > 0)
      const at = Math.max(0, start ?? get().playhead)
      // A drop inserts the whole source. The old 10 s cap silently truncated
      // every imported clip; stills keep a 5 s default length.
      const duration = asset.kind === 'image' ? 5 : Math.max(0.1, asset.durationSec || 5)
      const audioTracks = sequence.tracks.filter((t) => t.kind === 'audio' && !t.locked)
      const videoTracks = sequence.tracks.filter((t) => (t.kind === 'video' || t.kind === 'adjustment') && !t.locked)
      // Dropping a video on an A track isolates its audio instead of putting a
      // picture clip in an audio lane next to a duplicate twin.
      const audioOnly = asset.kind === 'audio' || (asset.kind === 'video' && hasAudio && requested?.kind === 'audio')
      const target = audioOnly
        ? requested ?? [...audioTracks].reverse()[0]
        : requested && (requested.kind === 'video' || requested.kind === 'adjustment')
          ? requested
          : [...videoTracks].reverse()[0]
      if (!target) return
      const clip: Clip = {
        id: uid('clip'),
        name: asset.name,
        trackId: target.id,
        mediaId: asset.id,
        start: at,
        duration,
        inPoint: 0,
        speed: 1,
        color: audioOnly ? '#ffb547' : '#4c8dff',
        volume: 1,
        transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
        effects: [],
        keyframes: {}
      }
      // A/V separation: video with sound also lands an audio clip on a free A
      // track (same span, same history step, selected together, shared linkId).
      let twin: Clip | null = null
      if (!audioOnly && asset.kind === 'video' && hasAudio) {
        const audioTarget = [...audioTracks].reverse()[0]
        if (audioTarget) {
          clip.linkId = uid('link')
          twin = {
            ...clip,
            id: uid('clip'),
            trackId: audioTarget.id,
            color: '#ffb547'
          }
        }
      }
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId)
        const targetTrack = seq?.tracks.find((t) => t.id === target.id)
        targetTrack?.clips.push(clip)
        if (twin) {
          const twinTrack = seq?.tracks.find((t) => t.id === twin!.trackId)
          twinTrack?.clips.push(twin)
        }
      })
      set({
        selection: {
          clipIds: twin ? [clip.id, twin.id] : [clip.id],
          trackId: target.id
        }
      })
      if (target.kind === 'audio' || twin) void get().loadWaveform(mediaId)
    },

    moveClip: (clipId, start, trackId, recordHistory = true) =>
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId)
        if (!seq) return
        let found: Clip | null = null
        let originTrack: Track | null = null
        for (const track of seq.tracks) {
          const clip = track.clips.find((c) => c.id === clipId)
          if (clip) {
            found = clip
            originTrack = track
            break
          }
        }
        if (!found || !originTrack) return
        const moving: Clip = found
        const from: Track = originTrack
        const requested = seq.tracks.find((t) => t.id === trackId)
        const isAudioClip = from.kind === 'audio'
        // Audio clips stay on audio tracks and pictures on video ones: dragging
        // an A clip over a V lane used to move it to an illegal track.
        const compatible =
          requested !== undefined &&
          !requested.locked &&
          (isAudioClip ? requested.kind === 'audio' : requested.kind === 'video' || requested.kind === 'adjustment')
        const target = compatible ? requested : from
        // Linked clips move as one group and never cross zero independently.
        const linked: Clip[] = []
        if (moving.linkId) {
          for (const sequence of draft.sequences) {
            for (const track of sequence.tracks) {
              for (const clip of track.clips) {
                if (clip.id !== moving.id && clip.linkId === moving.linkId) linked.push(clip)
              }
            }
          }
        }
        const minStart = Math.min(moving.start, ...linked.map((c) => c.start))
        const delta = Math.max(Math.max(0, start) - moving.start, -minStart)
        for (const clip of linked) clip.start = Math.max(0, clip.start + delta)
        moving.start = Math.max(0, moving.start + delta)
        if (target.id !== from.id) {
          const index = from.clips.findIndex((c) => c.id === moving.id)
          if (index >= 0) from.clips.splice(index, 1)
          target.clips.push(moving)
        }
        moving.trackId = target.id
      }, { history: recordHistory }),

    trimClip: (clipId, edge, deltaSeconds, recordHistory = true) =>
      mutate((draft) => {
        const locate = (id: string): Clip | null => {
          for (const sequence of draft.sequences) {
            for (const track of sequence.tracks) {
              const clip = track.clips.find((c) => c.id === id)
              if (clip) return clip
            }
          }
          return null
        }
        const main = locate(clipId)
        if (!main) return
        const applyTrim = (clip: Clip, delta: number): number => {
          if (edge === 'left') {
            // Dragging the head consumes source at the clip's speed (a 2× clip
            // advances twice as much source per timeline second).
            const speed = Math.max(0.05, clip.speed)
            const by = clamp(delta, -clip.inPoint / speed, clip.duration - 0.1)
            clip.start += by
            clip.inPoint = Math.max(0, clip.inPoint + by * speed)
            clip.duration = Math.max(0.1, clip.duration - by)
            return by
          }
          // Right edge: also clamp to the source container length — dragging
          // past the media's end used to create a silent/black overflow tail.
          const asset = draft.media.find((m) => m.id === clip.mediaId)
          const sourceMax =
            asset && asset.durationSec > 0
              ? (asset.durationSec - clip.inPoint) / Math.max(0.01, clip.speed) - clip.duration
              : Number.POSITIVE_INFINITY
          const by = clamp(delta, -(clip.duration - 0.1), sourceMax)
          clip.duration = Math.max(0.1, clip.duration + by)
          return by
        }
        const applied = applyTrim(main, deltaSeconds)
        if (main.linkId) {
          // Linked twin receives the SAME applied delta (already clamped by the
          // main clip) through its own bounds, so the pair never drifts apart.
          for (const sequence of draft.sequences) {
            for (const track of sequence.tracks) {
              for (const c of track.clips) {
                if (c.id !== main.id && c.linkId === main.linkId) applyTrim(c, applied)
              }
            }
          }
        }
      }, { history: recordHistory }),

    splitAtPlayhead: () => {
      const time = get().playhead
      const selected = get().selection.clipIds
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId)
        if (!seq) return
        // A blade cut through one half of an A/V pair must cut the twin too,
        // even when only the picture clip is selected.
        const selectedLinks = new Set<string>()
        for (const track of seq.tracks) {
          for (const clip of track.clips) {
            if (clip.linkId && selected.includes(clip.id)) selectedLinks.add(clip.linkId)
          }
        }
        // Each cut splits a link group in two: the right halves get one fresh
        // linkId, otherwise all four clips stay glued across the edit point.
        const rightLinks = new Map<string, string>()
        for (const track of seq.tracks) {
          if (track.locked) continue
          const additions: Clip[] = []
          for (const clip of track.clips) {
            const inside = time > clip.start + 0.01 && time < clip.start + clip.duration - 0.01
            if (!inside) continue
            if (selected.length > 0 && !selected.includes(clip.id) && !(clip.linkId && selectedLinks.has(clip.linkId))) continue
            const offset = time - clip.start
            const right: Clip = {
              ...deepClone(clip),
              id: uid('clip'),
              start: time,
              duration: clip.duration - offset,
              // Source time advances at the clip's speed, not at 1×.
              inPoint: clip.inPoint + offset * clip.speed
            }
            if (clip.linkId) {
              const link = rightLinks.get(clip.linkId) ?? uid('link')
              rightLinks.set(clip.linkId, link)
              right.linkId = link
            }
            clip.duration = offset
            additions.push(right)
          }
          track.clips.push(...additions)
        }
      })
    },

    addTextClip: (content = 'Titolo') => {
      const sequence = get().sequence()
      const at = Math.max(0, get().playhead)
      const text = content.trim() || 'Titolo'
      let target = sequence.tracks.find((track) => track.kind === 'subtitle' && !track.locked) ?? null
      const clip: Clip = {
        id: uid('clip'),
        name: text.slice(0, 48),
        trackId: target?.id ?? 'pending',
        mediaId: null,
        start: at,
        duration: 5,
        inPoint: 0,
        speed: 1,
        color: '#c8b6ff',
        volume: 1,
        transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
        effects: [],
        keyframes: {},
        text: {
          content: text,
          fontSize: Math.max(24, Math.round(sequence.height * 0.07)),
          color: '#ffffff',
          align: 'center',
          x: 0.5,
          y: 0.82,
          background: true
        }
      }
      let trackId = target?.id ?? ''
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId)
        if (!seq) return
        if (!target) {
          const created = createTrack('subtitle', seq.tracks.filter((t) => t.kind === 'subtitle').length + 1)
          seq.tracks.unshift(created)
          target = created
          trackId = created.id
        }
        const live = seq.tracks.find((t) => t.id === target!.id)
        if (!live) return
        clip.trackId = live.id
        live.clips.push(clip)
      })
      if (trackId) set({ selection: { clipIds: [clip.id], trackId } })
    },

    deleteSelected: () => {
      const ids = new Set(get().selection.clipIds)
      if (ids.size === 0) return
      mutate((draft) => {
        // Deleting one half of an A/V pair removes the twin in the same step
        for (const sequence of draft.sequences) {
          for (const track of sequence.tracks) {
            for (const c of track.clips) {
              if (!c.linkId || !ids.has(c.id)) continue
              for (const track2 of sequence.tracks) {
                for (const c2 of track2.clips) if (c2.linkId === c.linkId) ids.add(c2.id)
              }
            }
          }
        }
        for (const sequence of draft.sequences) {
          for (const track of sequence.tracks) track.clips = track.clips.filter((c) => !ids.has(c.id))
        }
      })
      set({ selection: { clipIds: [], trackId: null } })
    },

    rippleDeleteSelected: () => {
      const ids = new Set(get().selection.clipIds)
      if (ids.size === 0) return
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId)
        if (!seq) return
        // Deleting one half of an A/V pair removes the twin in the same step.
        for (const track of seq.tracks) {
          for (const clip of track.clips) {
            if (!clip.linkId || !ids.has(clip.id)) continue
            for (const other of seq.tracks.flatMap((t) => t.clips)) if (other.linkId === clip.linkId) ids.add(other.id)
          }
        }
        // Close the gap left on each track independently (Premiere ripple delete).
        const gaps = new Map<string, Array<{ start: number; end: number }>>()
        for (const track of seq.tracks) {
          for (const clip of track.clips) {
            if (!ids.has(clip.id)) continue
            const list = gaps.get(track.id) ?? []
            list.push({ start: clip.start, end: clip.start + clip.duration })
            gaps.set(track.id, list)
          }
        }
        for (const track of seq.tracks) {
          const ranges = (gaps.get(track.id) ?? []).sort((a, b) => a.start - b.start)
          track.clips = track.clips.filter((clip) => !ids.has(clip.id))
          if (ranges.length === 0) continue
          for (const clip of track.clips) {
            let shift = 0
            for (const range of ranges) {
              if (range.end <= clip.start + 0.0001) shift += range.end - range.start
              else if (range.start < clip.start) clip.start = Math.max(range.start, clip.start - (clip.start - range.start))
            }
            clip.start = Math.max(0, clip.start - shift)
          }
        }
      })
      set({ selection: { clipIds: [], trackId: null } })
    },

    duplicateSelected: () => {
      const ids = new Set(get().selection.clipIds)
      const created: string[] = []
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId)
        if (!seq) return
        // Duplicate linked twins alongside their partner, keeping the copies
        // linked to each other under one fresh linkId (original pair untouched)
        const links = new Set<string>()
        for (const track of seq.tracks) {
          for (const c of track.clips) if (c.linkId && ids.has(c.id)) links.add(c.linkId)
        }
        for (const track of seq.tracks) {
          for (const c of track.clips) if (c.linkId && links.has(c.linkId)) ids.add(c.id)
        }
        const linkRemap = new Map<string, string>()
        for (const track of seq.tracks) {
          const copies = track.clips
            .filter((c) => ids.has(c.id))
            .map((c) => {
              let link: string | undefined
              if (c.linkId) {
                link = linkRemap.get(c.linkId) ?? uid('link')
                linkRemap.set(c.linkId, link)
              }
              const copy = { ...deepClone(c), id: uid('clip'), start: c.start + c.duration }
              if (link) copy.linkId = link
              created.push(copy.id)
              return copy
            })
          track.clips.push(...copies)
        }
      })
      if (created.length) set({ selection: { clipIds: created, trackId: get().selection.trackId } })
    },

    selectAllClips: () => {
      const sequence = get().sequence()
      const clipIds = sequence.tracks.flatMap((track) => track.clips.map((clip) => clip.id))
      set({ selection: { clipIds, trackId: get().selection.trackId ?? sequence.tracks[0]?.id ?? null } })
    },

    selectClip: (clipId, additive = false) => {
      if (!clipId) {
        set({ selection: { clipIds: [], trackId: null } })
        return
      }
      const found = findClip(clipId)
      const current = get().selection.clipIds
      const base = additive
        ? current.includes(clipId)
          ? current.filter((id) => id !== clipId)
          : [...current, clipId]
        : [clipId]
      // The A/V pair selects and deselects together (linkId), so trim/move and
      // the inspector always act on the unit the user clicked.
      let next = base
      if (found?.clip.linkId) {
        const linkId = found.clip.linkId
        const dropping = !base.includes(clipId)
        for (const track of get().sequence().tracks) {
          for (const c of track.clips) {
            if (c.linkId !== linkId || c.id === clipId) continue
            if (dropping) next = next.filter((id) => id !== c.id)
            else if (!next.includes(c.id)) next = [...next, c.id]
          }
        }
      }
      set({ selection: { clipIds: next, trackId: found?.track.id ?? null } })
    },

    updateClip: (clipId, patch, recordHistory = true) =>
      mutate((draft) => {
        for (const sequence of draft.sequences) {
          for (const track of sequence.tracks) {
            const clip = track.clips.find((c) => c.id === clipId)
            if (!clip) continue
            Object.assign(clip, patch)
            // Audible edits follow the linked twin: the preview plays sound
            // from the AUDIO clip, so a volume change on the picture clip had
            // no audible effect at all otherwise.
            if (clip.linkId && patch.volume !== undefined) {
              for (const track2 of sequence.tracks) {
                for (const c2 of track2.clips) {
                  if (c2.id !== clip.id && c2.linkId === clip.linkId) c2.volume = patch.volume
                }
              }
            }
          }
        }
      }, { history: recordHistory }),

    updateEffect: (clipId, effectId, patch, recordHistory = true) =>
      mutate((draft) => {
        for (const sequence of draft.sequences) {
          for (const track of sequence.tracks) {
            const clip = track.clips.find((c) => c.id === clipId)
            const effect = clip?.effects.find((e) => e.id === effectId)
            if (effect) {
              if (patch.enabled !== undefined) effect.enabled = patch.enabled
              if (patch.params) effect.params = { ...effect.params, ...patch.params }
            }
          }
        }
      }, { history: recordHistory }),

    addEffect: (clipId, type) => {
      const effect = {
        id: uid('fx'),
        type,
        enabled: true,
        params: defaultEffectParams(type)
      }
      get().updateClip(clipId, {
        effects: [...(findClip(clipId)?.clip.effects ?? []), effect]
      })
    },

    removeEffect: (clipId, effectId) => {
      const clip = findClip(clipId)?.clip
      if (!clip) return
      get().updateClip(clipId, { effects: clip.effects.filter((e) => e.id !== effectId) })
    },

    toggleKeyframe: (clipId, property, value) => {
      const found = findClip(clipId)
      if (!found) return
      const time = get().playhead - found.clip.start
      const existing = found.clip.keyframes?.[property] ?? []
      const at = existing.find((k) => Math.abs(k.time - time) < 0.05)
      const next = at
        ? existing.filter((k) => k.id !== at.id)
        : [...existing, { id: uid('kf'), time, value, easing: 'easeInOut' as const }]
      get().updateClip(clipId, { keyframes: { ...(found.clip.keyframes ?? {}), [property]: next } })
    },

    setPlayhead: (seconds) => set({ playhead: Math.max(0, seconds) }),
    setPlaying: (playing) => set({ playing }),
    togglePlay: () => set((s) => ({ playing: !s.playing, speed: s.speed })),
    setZoom: (zoom) => set({ zoom: clamp(zoom, 8, 320) }),
    setTool: (tool) => set({ tool }),
    toggleSnap: () => set((s) => ({ snapping: !s.snapping })),

    addTrack: (kind) => {
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId)
        if (!seq) return
        const count = seq.tracks.filter((t) => t.kind === kind).length + 1
        const created = createTrack(kind, count)
        if (kind === 'video' || kind === 'adjustment') {
          const lastVideo = seq.tracks.map((t) => t.kind).lastIndexOf('video')
          seq.tracks.splice(lastVideo >= 0 ? lastVideo + 1 : 0, 0, created)
        } else if (kind === 'subtitle') {
          const lastText = seq.tracks.map((t) => t.kind).lastIndexOf('subtitle')
          if (lastText >= 0) {
            seq.tracks.splice(lastText + 1, 0, created)
          } else {
            const firstAudio = seq.tracks.findIndex((t) => t.kind === 'audio')
            seq.tracks.splice(firstAudio >= 0 ? firstAudio : seq.tracks.length, 0, created)
          }
        } else {
          seq.tracks.push(created)
        }
      })
    },

    updateTrack: (trackId, patch, recordHistory = true) =>
      mutate((draft) => {
        for (const sequence of draft.sequences) {
          const track = sequence.tracks.find((t) => t.id === trackId)
          if (track) Object.assign(track, patch)
        }
      }, { history: recordHistory }),

    addMarker: (label) =>
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId)
        if (!seq) return
        seq.markers.push({ id: uid('mk'), time: get().playhead, label: label || `Marker ${seq.markers.length + 1}`, color: '#ffb547' })
      }),

    setActiveSequence: (sequenceId) => {
      const seq = get().project.sequences.find((s) => s.id === sequenceId)
      if (!seq) return
      mutate((draft) => {
        draft.activeSequenceId = sequenceId
      }, { history: false })
      set({ playhead: 0, playing: false })
    },

    pushHistory: () => {
      const state = get()
      const snapshot = deepClone(state.project)
      set({ history: { past: [...state.history.past, snapshot].slice(-MAX_HISTORY), future: [] } })
    },

    undo: () => {
      const { history, project } = get()
      const previous = history.past[history.past.length - 1]
      if (!previous) return
      set({
        project: previous,
        history: { past: history.past.slice(0, -1), future: [deepClone(project), ...history.future].slice(0, MAX_HISTORY) },
        dirty: true,
        selection: pruneSelection(previous, get().selection)
      })
    },

    redo: () => {
      const { history, project } = get()
      const next = history.future[0]
      if (!next) return
      set({
        project: next,
        history: { past: [...history.past, deepClone(project)].slice(-MAX_HISTORY), future: history.future.slice(1) },
        dirty: true,
        selection: pruneSelection(next, get().selection)
      })
    },

    selectedClip: () => {
      const id = get().selection.clipIds[0]
      return id ? findClip(id) : null
    }
  }
})

export function defaultEffectParams(type: string): Record<string, number | string | boolean> {
  switch (type) {
    case 'Gaussian Blur':
      return { radius: 8 }
    case 'Box Blur':
      return { radius: 6 }
    case 'Directional Blur':
      return { angle: 0, length: 12 }
    case 'Sharpen':
      return { amount: 0.5 }
    case 'Glow':
      return { threshold: 0.7, radius: 16, intensity: 0.8 }
    case 'Film Grain':
      return { amount: 0.25, size: 1.2 }
    case 'Chroma Key':
      return { hue: 120, tolerance: 0.25, spill: 0.1 }
    case 'Opacity':
      return { opacity: 1 }
    case 'Crop':
      return { top: 0, right: 0, bottom: 0, left: 0 }
    case 'Cinematic LUT':
      return { intensity: 0.8, contrast: 1.05 }
    case 'Color Wheels':
      // Every parameter exposed by the colour tab must exist from creation,
      // otherwise the first slider move rewrote only one of them.
      return { temperature: 0, tint: 0, contrast: 1.05, saturation: 1.05, lift: 0, gamma: 0, gain: 0 }
    case 'Timecode Burn-in':
      return { size: 18, x: 40, y: 40 }
    default:
      return { amount: 0.5 }
  }
}

export const EFFECT_CATALOG = [
  'Transform',
  'Crop',
  'Opacity',
  'Gaussian Blur',
  'Box Blur',
  'Directional Blur',
  'Sharpen',
  'Glow',
  'Film Grain',
  'Chroma Key',
  'Luma Key',
  'Cinematic LUT',
  'Color Wheels',
  'Timecode Burn-in',
  'Text Generator',
  'Noise'
]
