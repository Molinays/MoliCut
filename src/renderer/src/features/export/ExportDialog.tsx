import { useEffect, useMemo, useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import type { EncodePreset, HardwareProfile } from '@shared/schemas'
import { sequenceContentDuration } from '@shared/projectFactory'
import { formatBytes, formatClock } from '@shared/utils'
import { call } from '../../bridge'
import { useProjectStore } from '../../store/projectStore'
import { useQueueStore } from '../../store/queueStore'
import { useUiStore } from '../../store/uiStore'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'

export function ExportDialog(): JSX.Element {
  const { t } = useTranslation()
  const close = useUiStore((s) => s.closeModal)
  const toast = useUiStore((s) => s.toast)
  const gpuOnly = useUiStore((s) => s.settings.gpuOnly)
  const project = useProjectStore((s) => s.project)
  const sequence = useProjectStore((s) => s.sequence())
  const presets = useQueueStore((s) => s.presets)
  const loadPresets = useQueueStore((s) => s.loadPresets)
  const enqueue = useQueueStore((s) => s.enqueue)
  const [presetId, setPresetId] = useState('builtin-youtube-1080p')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const [profile, setProfile] = useState<HardwareProfile | null>(null)

  useEffect(() => {
    if (presets.length === 0) void loadPresets()
    void call('system:profile', {})
      .then(({ profile: loaded }) => setProfile(loaded))
      .catch(() => setProfile(null))
  }, [loadPresets, presets.length])

  const selectedPreset: EncodePreset | undefined = presets.find((p) => p.id === presetId)
  const durationSec = sequenceContentDuration(sequence)
  const clipCount = sequence.tracks.reduce((sum, track) => sum + track.clips.length, 0)
  const assetById = useMemo(() => new Map(project.media.map((asset) => [asset.id, asset])), [project.media])
  const hasAudio = sequence.tracks
    .filter((track) => track.kind === 'audio')
    .flatMap((track) => track.clips)
    .some((clip) => (clip.mediaId ? (assetById.get(clip.mediaId)?.channels ?? 0) > 0 : false))

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return presets.filter((p) => !q || `${p.name} ${p.description} ${p.tags.join(' ')}`.toLowerCase().includes(q))
  }, [presets, search])

  const estimated = useMemo(() => {
    if (!selectedPreset) return 0
    const videoKbps = selectedPreset.video.codec === 'none' ? 0 : selectedPreset.video.bitrateKbps
    const audioKbps = selectedPreset.audio.codec === 'none' || !hasAudio ? 0 : selectedPreset.audio.bitrateKbps
    return Math.round(((videoKbps + audioKbps) * 1000 * durationSec) / 8)
  }, [durationSec, hasAudio, selectedPreset])

  const gpuEncoder = profile?.encoders.find((encoder) => encoder.available && encoder.id !== 'software') ?? null
  const gpuSupportsPreset =
    !gpuEncoder || !selectedPreset || selectedPreset.video.codec === 'none'
      ? true
      : gpuEncoder.codecs.includes(selectedPreset.video.codec)
  const strictGpu = gpuOnly && Boolean(gpuEncoder)

  const addToQueue = async (): Promise<void> => {
    if (!selectedPreset) return
    if (durationSec <= 0 || clipCount === 0) {
      toast('warn', 'La timeline è vuota: aggiungi almeno una clip prima di esportare.')
      return
    }
    setBusy(true)
    try {
      await enqueue([
        {
          name: `${project.name} — ${sequence.name} → ${selectedPreset.name}`,
          timeline: { project, sequenceId: sequence.id },
          presetId: selectedPreset.id,
          durationSec,
          hasAudio,
          priority: 60,
          maxRetries: 1
        }
      ])
      toast(
        'success',
        `Timeline accodata in ${strictGpu ? 'GPU-only' : 'export'}: ${sequence.name} (${formatClock(durationSec)})`
      )
      close()
    } catch (err) {
      toast('error', (err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const extension = selectedPreset?.container === 'image2' ? 'png' : selectedPreset?.container ?? 'mp4'

  return (
    <Modal
      title={t('export.title')}
      subtitle={t('export.subtitle')}
      onClose={close}
      width={980}
      footer={
        <>
          <div className="export-summary-foot">
            <span>
              {selectedPreset?.container.toUpperCase()} · {selectedPreset?.video.codec.toUpperCase()} ·{' '}
              {strictGpu ? 'GPU ONLY' : 'AUTO'}
            </span>
            <span>
              {t('export.estimated')}: {formatBytes(estimated)}
            </span>
          </div>
          <button className="btn" onClick={close}>
            {t('common.cancel')}
          </button>
          <button className="btn btn-accent" onClick={() => void addToQueue()} disabled={busy || clipCount === 0}>
            <Icon name="queue" size={14} /> {t('export.queue')}
          </button>
        </>
      }
    >
      <div className="export-grid">
        <div className="export-col">
          <h3 className="export-h">Timeline da esportare</h3>
          <div className="output-card export-sequence-card">
            <Icon name="layers" size={18} />
            <div>
              <strong>{sequence.name}</strong>
              <span>
                {project.name} · {formatClock(durationSec)} · {clipCount} clip
              </span>
            </div>
          </div>
          <div className="export-source-info">
            <span>Progetto</span>
            <strong>{project.name}</strong>
            <span>Sequenza</span>
            <strong>{sequence.name}</strong>
            <span>Risoluzione</span>
            <strong>
              {sequence.width}×{sequence.height}
            </strong>
            <span>FPS</span>
            <strong>{sequence.fps}</strong>
            <span>Colore</span>
            <strong>{sequence.colorSpace}</strong>
            <span>Tracce</span>
            <strong>{sequence.tracks.length}</strong>
            <span>Clip</span>
            <strong>{clipCount}</strong>
            <span>Audio</span>
            <strong>{hasAudio ? 'mix timeline' : 'nessuno'}</strong>
          </div>
          <div className="note-card">
            <Icon name="layers" size={14} />
            <span>L'export renderizza l'intera timeline: overlay video, mix audio e titoli. Non esporta i media singoli.</span>
          </div>
          <div className={`note-card ${gpuSupportsPreset || !strictGpu ? '' : 'warn-card'}`}>
            <Icon name={strictGpu ? 'chip' : 'warning'} size={14} />
            <span>
              {gpuEncoder
                ? strictGpu
                  ? gpuSupportsPreset
                    ? `Solo GPU attiva: ${gpuEncoder.name} (${gpuEncoder.codecs.join(', ')}). Nessun fallback CPU.`
                    : `${gpuEncoder.name} non supporta ${selectedPreset?.video.codec.toUpperCase()}. Scegli H.264/HEVC/AV1 o disattiva Solo GPU.`
                  : `GPU rilevata (${gpuEncoder.name}) ma Solo GPU è disattivata nelle Impostazioni.`
                : 'Nessun encoder GPU rilevato: l’export userà il software, unica opzione disponibile su questa macchina.'}
            </span>
          </div>
        </div>

        <div className="export-col">
          <div className="export-col-head">
            <h3 className="export-h">{t('export.preset')}</h3>
            <div className="search-field compact">
              <Icon name="search" size={12} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca preset…"
                aria-label="Cerca preset"
              />
            </div>
          </div>
          <div className="preset-list">
            {filtered.map((preset) => (
              <button
                key={preset.id}
                className={`preset-row ${presetId === preset.id ? 'active' : ''}`}
                onClick={() => setPresetId(preset.id)}
              >
                <div className="preset-main">
                  <strong>{preset.name}</strong>
                  <span>{preset.description}</span>
                  <div className="preset-tags">
                    {preset.tags.slice(0, 4).map((tag) => (
                      <em key={tag}>{tag}</em>
                    ))}
                    {preset.video.hdr !== 'none' && <em className="hdr">{preset.video.hdr.toUpperCase()}</em>}
                  </div>
                </div>
                <div className="preset-spec">
                  <span>{preset.video.width ? `${preset.video.width}×${preset.video.height}` : 'sorgente'}</span>
                  <span>{preset.video.codec.toUpperCase()}</span>
                  <span>
                    {preset.video.bitrateMode === 'crf'
                      ? `CRF ${preset.video.crf}`
                      : `${Math.round(preset.video.bitrateKbps / 1000)} Mbps`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="export-col side">
          <h3 className="export-h">{t('export.output')}</h3>
          {selectedPreset && (
            <>
              <div className="output-card">
                <Icon name="folder" size={18} />
                <div>
                  <strong>
                    {project.name}_{sequence.name}
                    {selectedPreset.output.suffix}.{extension}
                  </strong>
                  <span>Video/MoliCut/</span>
                </div>
              </div>
              <div className="spec-list">
                <div>
                  <span>Contenuto</span>
                  <strong>Timeline completa</strong>
                </div>
                <div>
                  <span>Container</span>
                  <strong>{selectedPreset.container}</strong>
                </div>
                <div>
                  <span>Video</span>
                  <strong>
                    {selectedPreset.video.codec.toUpperCase()} ·{' '}
                    {strictGpu ? gpuEncoder!.name : selectedPreset.video.encoderPolicy}
                  </strong>
                </div>
                <div>
                  <span>Bitrate</span>
                  <strong>
                    {selectedPreset.video.bitrateMode.toUpperCase()}{' '}
                    {Math.round(selectedPreset.video.bitrateKbps / 1000)} Mbps
                  </strong>
                </div>
                <div>
                  <span>GOP</span>
                  <strong>{selectedPreset.video.gopSeconds}s</strong>
                </div>
                <div>
                  <span>Colore</span>
                  <strong>{selectedPreset.video.colorSpace.toUpperCase()}</strong>
                </div>
                <div>
                  <span>HDR</span>
                  <strong>{selectedPreset.video.hdr === 'none' ? '—' : selectedPreset.video.hdr.toUpperCase()}</strong>
                </div>
                <div>
                  <span>Audio</span>
                  <strong>
                    {selectedPreset.audio.codec.toUpperCase()}{' '}
                    {selectedPreset.audio.codec === 'none' ? '' : `${selectedPreset.audio.bitrateKbps}k`}
                  </strong>
                </div>
                <div>
                  <span>Loudness</span>
                  <strong>
                    {selectedPreset.audio.loudness.enabled ? `${selectedPreset.audio.loudness.targetLufs} LUFS` : 'off'}
                  </strong>
                </div>
              </div>
              {selectedPreset.video.hdr !== 'none' && (
                <div className="hdr-note">
                  <Icon name="sparkles" size={14} /> {t('export.hdr')} · mastering metadata
                </div>
              )}
            </>
          )}
          <div className="export-sequence-note">
            <span>Destinazione predefinita</span>
            <strong>Video/MoliCut/</strong>
            <span>La cartella viene creata automaticamente al primo export.</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
