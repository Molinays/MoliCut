import { readFileSync, writeFileSync } from 'node:fs'
import { encodePresetSchema, type EncodePreset, type MediaAsset } from '@shared/schemas'
import { builtinPresets } from '@shared/builtinPresets'
import { uid } from '@shared/utils'
import { z } from 'zod'
import { getDb } from './db'
import { logger } from './logger'

/**
 * Built-ins live in code and are never mutated. Custom presets are stored as
 * validated JSON in SQLite; importing a preset with an existing id bumps its
 * version instead of silently overwriting it.
 */
export class PresetService {
  private cached: EncodePreset[] | null = null

  list(): EncodePreset[] {
    if (this.cached) return this.cached
    return this.reload()
  }

  reload(): EncodePreset[] {
    const rows = getDb().prepare('SELECT payload FROM presets ORDER BY name ASC').all<{ payload: string }>()
    const custom: EncodePreset[] = []
    for (const row of rows) {
      try {
        const parsed = encodePresetSchema.safeParse(JSON.parse(row.payload))
        if (parsed.success) custom.push(parsed.data)
      } catch {
        logger.warn('presets', 'skipping corrupted preset row')
      }
    }
    this.cached = [...builtinPresets(), ...custom]
    return this.cached
  }

  get(id: string): EncodePreset | undefined {
    return this.list().find((p) => p.id === id)
  }

  save(input: EncodePreset): EncodePreset {
    const preset = encodePresetSchema.parse(input)
    if (preset.builtin) throw new Error('I preset integrati non sono modificabili: crea una copia')
    const existing = this.get(preset.id)
    if (existing) {
      preset.version = existing.version + 1
    }
    preset.updatedAt = new Date().toISOString()
    getDb()
      .prepare(
        'INSERT INTO presets (id, name, builtin, updated_at, payload) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, updated_at=excluded.updated_at, payload=excluded.payload'
      )
      .run(preset.id, preset.name, 0, preset.updatedAt, JSON.stringify(preset))
    this.cached = null
    logger.info('presets', `saved ${preset.id} v${preset.version}`)
    return preset
  }

  delete(id: string): EncodePreset[] {
    getDb().prepare('DELETE FROM presets WHERE id = ? AND builtin = 0').run(id)
    this.cached = null
    return this.list()
  }

  exportToFile(path: string, ids?: string[]): void {
    const presets = this.list().filter((p) => !ids || ids.includes(p.id)).map((p) => ({ ...p, builtin: false }))
    const payload = { schemaVersion: 1, exportedAt: new Date().toISOString(), presets }
    writeFileSync(path, JSON.stringify(payload, null, 2), { encoding: 'utf8', mode: 0o600 })
    logger.info('presets', `exported ${presets.length} presets`)
  }

  importFromFile(path: string): EncodePreset[] {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown
    const containerSchema = z.object({ presets: z.array(z.unknown()) }).or(z.array(z.unknown()))
    const parsed = containerSchema.parse(raw)
    const list = Array.isArray(parsed) ? parsed : parsed.presets
    const imported: EncodePreset[] = []
    for (const item of list) {
      const candidate = encodePresetSchema.safeParse(item)
      if (!candidate.success) {
        logger.warn('presets', `skipping invalid imported preset: ${candidate.error.issues[0]?.message}`)
        continue
      }
      const preset: EncodePreset = { ...candidate.data, builtin: false, id: uid('pst') }
      imported.push(this.save(preset))
    }
    return imported
  }

  /** Heuristic matching: resolution, HDR, orientation, duration, audio-only. */
  suggest(asset: MediaAsset): EncodePreset[] {
    const all = this.list()
    const pick = (id: string): EncodePreset | undefined => all.find((p) => p.id === id)
    const result: EncodePreset[] = []
    if (asset.kind === 'audio') {
      result.push(pick('builtin-audio-wav')!, pick('builtin-audio-aac')!)
      return result.filter(Boolean)
    }
    if (asset.isHDR) result.push(pick('builtin-master-hdr10')!, pick('builtin-master-hlg')!)
    if (asset.height > 0 && asset.width > 0 && asset.height > asset.width) {
      result.push(pick('builtin-tiktok')!, pick('builtin-instagram-reels')!)
    }
    if (asset.height >= 2000) result.push(pick('builtin-youtube-4k')!)
    result.push(pick('builtin-youtube-1080p')!, pick('builtin-webm-vp9')!, pick('builtin-broadcast-prores-422hq')!)
    return [...new Set(result.filter(Boolean))].slice(0, 5)
  }
}

export const presets = new PresetService()
