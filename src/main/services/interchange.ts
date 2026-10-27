import { pathToFileURL } from 'node:url'
import type { Project, Sequence } from '@shared/schemas'
import { formatTimecode } from '@shared/utils'

/**
 * Interchange exporters. They operate on the validated project model and never
 * touch the filesystem, which makes them unit-testable and safe to run on any
 * sequence. Round-trip import is tracked in ROADMAP (INT-1).
 */

function xmlEscape(input: string): string {
  return input.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c] ?? c)
}

function mediaPath(project: Project, mediaId: string | null): string | null {
  if (!mediaId) return null
  return project.media.find((m) => m.id === mediaId)?.path ?? null
}

export function exportEdl(project: Project, sequence: Sequence): string {
  const lines: string[] = []
  const fps = Math.round(sequence.fps)
  lines.push(`TITLE: ${sequence.name}`)
  lines.push('FCM: NON-DROP FRAME')
  lines.push('')
  let eventNumber = 1
  const videoTracks = sequence.tracks.filter((t) => t.kind === 'video')
  for (const track of videoTracks) {
    const clips = [...track.clips].sort((a, b) => a.start - b.start)
    for (const clip of clips) {
      const reel = mediaPath(project, clip.mediaId) ? 'AX' : 'BL'
      const srcIn = formatTimecode(clip.inPoint, fps)
      const srcOut = formatTimecode(clip.inPoint + clip.duration, fps)
      const recIn = formatTimecode(clip.start, fps)
      const recOut = formatTimecode(clip.start + clip.duration, fps)
      lines.push(`${String(eventNumber).padStart(3, '0')}  ${reel.padEnd(8)} V     C        ${srcIn} ${srcOut} ${recIn} ${recOut}`)
      lines.push(`* FROM CLIP NAME: ${clip.name}`)
      if (track.kind === 'video' && track.name) lines.push(`* TRACK: ${track.name}`)
      lines.push('')
      eventNumber++
    }
  }
  return lines.join('\n')
}

export function exportFcpXml(project: Project, sequence: Sequence): string {
  const frameDuration = `1/${Math.round(sequence.fps)}s`
  const items = sequence.tracks
    .filter((t) => t.kind === 'video')
    .flatMap((t) => t.clips)
    .sort((a, b) => a.start - b.start)
    .map((clip) => {
      const path = mediaPath(project, clip.mediaId)
      const assetName = clip.name
      return [
        `        <clip offset="${clip.start}s" duration="${clip.duration}s" name="${xmlEscape(assetName)}" start="${clip.inPoint}s">`,
        `          <video ref="r1"/>`,
        path ? `          <note>${xmlEscape(path)}</note>` : '',
        '        </clip>'
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <resources>
    <format id="r1" name="FFVideoFormat_${sequence.width}x${sequence.height}_${Math.round(sequence.fps)}" frameDuration="${frameDuration}" width="${sequence.width}" height="${sequence.height}"/>
  </resources>
  <library>
    <event name="MoliCut Export">
      <project name="${xmlEscape(sequence.name)}">
        <sequence format="r1" duration="${sequence.duration}s" tcStart="0s" tcFormat="NDF">
          <spine>
${items}
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
`
}

export function exportPremiereXml(project: Project, sequence: Sequence): string {
  const fps = Math.round(sequence.fps)
  const toFrames = (seconds: number): number => Math.round(seconds * fps)
  const videoTracks = sequence.tracks.filter((t) => t.kind === 'video')
  let clipIndex = 1
  let fileIndex = 1
  const tracks = videoTracks
    .map((track) => {
      const items = [...track.clips]
        .sort((a, b) => a.start - b.start)
        .map((clip) => {
          const path = mediaPath(project, clip.mediaId)
          const fileId = `file-${fileIndex++}`
          const fileBlock = path
            ? `<file id="${fileId}"><name>${xmlEscape(clip.name)}</name><pathurl>${xmlEscape(pathToFileURL(path).href)}</pathurl><rate><timebase>${fps}</timebase><ntsc>FALSE</ntsc></rate></file>`
            : ''
          return `<clipitem id="clipitem-${clipIndex++}"><name>${xmlEscape(clip.name)}</name><enabled>TRUE</enabled><duration>${toFrames(clip.duration)}</duration><rate><timebase>${fps}</timebase><ntsc>FALSE</ntsc></rate><start>${toFrames(clip.start)}</start><end>${toFrames(clip.start + clip.duration)}</end><in>${toFrames(clip.inPoint)}</in><out>${toFrames(clip.inPoint + clip.duration)}</out>${fileBlock}</clipitem>`
        })
        .join('')
      return `<track>${items}</track>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4">
  <sequence id="sequence-1">
    <name>${xmlEscape(sequence.name)}</name>
    <duration>${toFrames(sequence.duration)}</duration>
    <rate><timebase>${fps}</timebase><ntsc>FALSE</ntsc></rate>
    <media>
      <video>
        <format><samplecharacteristics><width>${sequence.width}</width><height>${sequence.height}</height><pixelaspectratio>square</pixelaspectratio></samplecharacteristics></format>
        ${tracks}
      </video>
    </media>
  </sequence>
</xmeml>
`
}
