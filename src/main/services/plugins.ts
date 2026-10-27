import { createPublicKey, verify as cryptoVerify } from 'node:crypto'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { basename, join } from 'node:path'
import { tmpdir } from 'node:os'
import { app } from 'electron'
import AdmZip from 'adm-zip'
import { z } from 'zod'
import type { PluginInfo } from '@shared/ipc'
import { getKv, setKv } from './db'
import { logger } from './logger'
import { appPaths } from './paths'
import { assertZipEntrySafe } from './security'
import { settings } from './settings'

/**
 * Plugin host (v1 scope: lifecycle + trust).
 * Plugins are NEVER loaded into the main process or with Node access. The
 * runtime is a sandboxed Worker/WASM host (ROADMAP PLUG-2); this service owns
 * manifests, permissions, signature checks and enable/disable state.
 */

const ALLOWED_PERMISSIONS = new Set([
  'video:effect',
  'audio:effect',
  'exporter',
  'importer',
  'generator',
  'encoder-preset',
  'watch-rule',
  'ui:panel',
  'media:read',
  'media:write'
])

const manifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9._-]{1,80}$/i),
  name: z.string().min(1).max(120),
  version: z.string().min(1).max(32),
  vendor: z.string().min(1).max(120),
  description: z.string().max(2000).default(''),
  entry: z.string().max(512).default('index.js'),
  permissions: z.array(z.string()).max(32).default([]),
  capabilities: z.array(z.string()).max(32).default([])
})
type PluginManifest = z.infer<typeof manifestSchema>

function pluginsDir(): string {
  return join(appPaths().userData, 'plugins')
}

function trustedKeys(): string[] {
  const path = join(process.resourcesPath ?? '', 'plugin-keys.json')
  const fallback = join(app.getAppPath(), 'resources', 'plugin-keys.json')
  const file = existsSync(path) ? path : existsSync(fallback) ? fallback : null
  if (!file) return []
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as unknown
    return z.array(z.string().min(32)).parse(parsed)
  } catch {
    return []
  }
}

function verifyManifest(raw: Buffer, signatureBase64: string): boolean {
  const keys = trustedKeys()
  if (keys.length === 0) return false
  const signature = Buffer.from(signatureBase64, 'base64')
  for (const key of keys) {
    try {
      if (cryptoVerify('sha256', raw, createPublicKey(key), signature)) return true
    } catch {
      /* try next key */
    }
  }
  return false
}

export class PluginService {
  private enabledState(): Record<string, boolean> {
    return getKv<Record<string, boolean>>('plugins.enabled', {})
  }

  private readPlugin(dir: string): PluginInfo | null {
    try {
      const manifestFile = join(dir, 'manifest.json')
      if (!existsSync(manifestFile)) return null
      const raw = readFileSync(manifestFile)
      const manifest = manifestSchema.parse(JSON.parse(raw.toString('utf8'))) as PluginManifest
      const sigFile = join(dir, 'manifest.sig')
      const signed = existsSync(sigFile)
      const verified = signed && verifyManifest(raw, readFileSync(sigFile, 'utf8').trim())
      const permissions = manifest.permissions.filter((p) => ALLOWED_PERMISSIONS.has(p))
      const safeMode = settings.isSafeMode()
      return {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        vendor: manifest.vendor,
        description: manifest.description,
        permissions,
        enabled: !safeMode && verified && (this.enabledState()[manifest.id] ?? false),
        signed,
        verified,
        path: dir
      }
    } catch (err) {
      logger.warn('plugins', `invalid plugin at ${dir}: ${(err as Error).message}`)
      return null
    }
  }

  list(): PluginInfo[] {
    const dir = pluginsDir()
    if (!existsSync(dir)) return []
    return readdirSync(dir)
      .map((name) => join(dir, name))
      .filter((p) => {
        try {
          return statSync(p).isDirectory()
        } catch {
          return false
        }
      })
      .map((p) => this.readPlugin(p))
      .filter((p): p is PluginInfo => p !== null)
  }

  toggle(id: string, enabled: boolean): PluginInfo[] {
    const plugin = this.list().find((p) => p.id === id)
    if (!plugin) throw new Error('Plugin non trovato')
    if (enabled && !plugin.verified) throw new Error('Plugin non firmato o firma non valida: impossibile abilitarlo')
    const state = this.enabledState()
    state[id] = enabled
    setKv('plugins.enabled', state)
    logger.info('plugins', `${id} ${enabled ? 'enabled' : 'disabled'}`)
    return this.list()
  }

  async install(archivePath: string): Promise<PluginInfo> {
    const dir = pluginsDir()
    mkdirSync(dir, { recursive: true, mode: 0o700 })
    const work = mkdtempSync(join(tmpdir(), 'molicut-plugin-'))
    try {
      if (archivePath.toLowerCase().endsWith('.zip')) {
        const zip = new AdmZip(archivePath)
        for (const entry of zip.getEntries()) {
          const target = assertZipEntrySafe(entry.entryName, work)
          if (entry.isDirectory) {
            mkdirSync(target, { recursive: true })
          } else {
            mkdirSync(join(target, '..'), { recursive: true })
            writeFileSync(target, entry.getData())
          }
        }
      } else {
        const sourceManifest = join(archivePath, 'manifest.json')
        if (!existsSync(sourceManifest)) throw new Error('manifest.json mancante')
        for (const name of readdirSync(archivePath)) {
          const src = join(archivePath, name)
          if (statSync(src).isFile()) copyFileSync(src, join(work, name))
        }
      }
      const manifestFile = join(work, 'manifest.json')
      if (!existsSync(manifestFile)) throw new Error('manifest.json mancante')
      const raw = readFileSync(manifestFile)
      const manifest = manifestSchema.parse(JSON.parse(raw.toString('utf8')))
      const sigFile = join(work, 'manifest.sig')
      const verified = existsSync(sigFile) && verifyManifest(raw, readFileSync(sigFile, 'utf8').trim())
      if (app.isPackaged && !verified) throw new Error('Plugin rifiutato: firma assente o non valida')
      const destination = join(dir, manifest.id)
      mkdirSync(destination, { recursive: true, mode: 0o700 })
      for (const name of readdirSync(work)) copyFileSync(join(work, name), join(destination, basename(name)))
      const info = this.readPlugin(destination)
      if (!info) throw new Error('Plugin installato ma non valido')
      logger.info('plugins', `installed ${manifest.id} (${verified ? 'verified' : 'unsigned, disabled'})`)
      return info
    } finally {
      rmSync(work, { recursive: true, force: true })
    }
  }
}

export const plugins = new PluginService()
