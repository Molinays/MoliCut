import { PROJECT_SCHEMA_VERSION, type Project, type Sequence, type Track } from './schemas'
import { uid } from './utils'

export const VIDEO_COLORS = ['#4c8dff', '#7c5cff', '#ff5c8a', '#ffb547', '#38d9a9', '#f06595']

export function createTrack(kind: Track['kind'], index: number): Track {
  const prefix =
    kind === 'video'
      ? 'V'
      : kind === 'audio'
        ? 'A'
        : kind === 'subtitle'
          ? 'T'
          : kind === 'adjustment'
            ? 'ADJ'
            : 'N'
  return {
    id: uid('trk'),
    kind,
    name: `${prefix}${index}`,
    height: kind === 'audio' ? 56 : kind === 'subtitle' ? 48 : 72,
    mute: false,
    solo: false,
    locked: false,
    volume: 1,
    pan: 0,
    clips: []
  }
}

export function createSequence(name = 'Sequence 01', width = 1920, height = 1080, fps = 30): Sequence {
  return {
    id: uid('seq'),
    name,
    width,
    height,
    fps,
    duration: 300,
    colorSpace: 'rec709',
    tracks: [createTrack('video', 2), createTrack('video', 1), createTrack('subtitle', 1), createTrack('audio', 1)],
    markers: []
  }
}

export function createProject(name = 'Untitled Project'): Project {
  const sequence = createSequence('Sequence 01')
  const now = new Date().toISOString()
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: uid('prj'),
    name,
    createdAt: now,
    modifiedAt: now,
    activeSequenceId: sequence.id,
    sequences: [sequence],
    media: []
  }
}

export function getActiveSequence(project: Project): Sequence {
  return project.sequences.find((s) => s.id === project.activeSequenceId) ?? project.sequences[0]!
}

/** End of the last clip: what playback must honour, not the padded ruler length. */
export function sequenceContentDuration(sequence: Sequence): number {
  let end = 0
  for (const track of sequence.tracks) {
    for (const clip of track.clips) end = Math.max(end, clip.start + clip.duration)
  }
  return end
}

/**
 * Keep the stored sequence duration in sync with the edit. It is only the
 * ruler/transport length (content + tail, at least 30 s); playback stops at
 * `sequenceContentDuration` so an empty timeline does not "play" five minutes.
 */
export function refreshSequenceDurations(project: Project): void {
  for (const sequence of project.sequences) {
    const end = sequenceContentDuration(sequence)
    sequence.duration = Math.max(30, Math.ceil((end + 5) / 5) * 5)
  }
}
