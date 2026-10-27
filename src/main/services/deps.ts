import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createWriteStream } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { Readable } from 'node:stream'
import { app } from 'electron'
import AdmZip from 'adm-zip'
import { z } from 'zod'
import type { DependencyStatus } from '@shared/schemas'
import { ffmpeg } from './ffmpeg'
import { logger } from './logger'
import { appPaths } from './paths'
import { assertZipEntrySafe, sha256File } from './security'
import { getDb } from './db'

/**
 * Dependency manager. Downloads are fail-closed: a component is installed only
 * if the manifest pins a SHA-256 for this platform. Archives are extracted with
 * zip-slip validation into a temp dir and atomically moved into userData/bin.
 */

const downloadEntrySchema = z.object({
  url: z.string().url(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/i).or(z.literal('')),
  version: z.string(),
  archive: z.enum(['zip', 'tar.xz']),
  member: z.string()
})

const manifestSchema = z.object({
  schemaVersion: z.number(),
  channels: z.record(z.object({ ffmpeg: downloadEntrySchema, ffprobe: downloadEntrySchema }))
})
type DownloadEntry = z.infer<typeof downloadEntrySchema>

function manifestPath(): string | null {
  const candidates = [
    join(process.resourcesPath ?? '', 'ffmpeg', 'checksums.json'),
    join(app.getAppPath(), 'ffmpeg', 'checksums.json')
  ]
  return candidates.find((p) => existsSync(p)) ?? null
}

function loadManifest(): z.infer<typeof manifestSchema> | null {
  const path = manifestPath()
  if (!path) return null
  try {
    return manifestSchema.parse(JSON.parse(readFileSync(path, 'utf8')))
  } catch (err) {
    logger.error('deps', `invalid dependency manifest: ${(err as Error).message}`)
    return null
  }
}

const hashCache = new Map<string, { key: string; hash: string }>()

async function cachedSha256(path: string): Promise<string> {
  const stats = statSync(path)
  const key = `${stats.size}:${stats.mtimeMs}`
  const cached = hashCache.get(path)
  if (cached?.key === key) return cached.hash
  const hash = await sha256File(path)
  hashCache.set(path, { key, hash })
  return hash
}

export class DependencyService {
  private entryFor(id: 'ffmpeg' | 'ffprobe'): DownloadEntry | null {
    const manifest = loadManifest()
    if (!manifest) return null
    const key = `${process.platform}-${process.arch}`
    return manifest.channels[key]?.[id] ?? null
  }

  async status(): Promise<DependencyStatus[]> {
    const binaries = ffmpeg.binaries()
    const results: DependencyStatus[] = []
    for (const id of ['ffmpeg', 'ffprobe'] as const) {
      const info = binaries[id]
      const entry = this.entryFor(id)
      const path = info.path
      const isFile = Boolean(path && existsSync(path))
      if (!isFile && info.source === 'system') {
        const version = await ffmpeg.version(id)
        results.push({
          id,
          name: id === 'ffmpeg' ? 'FFmpeg' : 'FFprobe',
          required: id === 'ffmpeg',
          path: null,
          version: version?.split(' ').slice(0, 3).join(' ') ?? null,
          expectedSha256: entry?.sha256 || null,
          actualSha256: null,
          status: version ? 'ok' : id === 'ffmpeg' ? 'missing' : 'missing',
          detail: version ? `Binary di sistema nel PATH (${version.slice(0, 80)}). Checksum non verificabile.` : 'Non trovato: installa FFmpeg o usa "Scarica dipendenze".'
        })
        continue
      }
      if (!isFile) {
        results.push({
          id,
          name: id === 'ffmpeg' ? 'FFmpeg' : 'FFprobe',
          required: id === 'ffmpeg',
          path: null,
          version: null,
          expectedSha256: entry?.sha256 || null,
          actualSha256: null,
          status: 'missing',
          detail: 'Binario mancante'
        })
        continue
      }
      const actual = await cachedSha256(path!)
      const expected = entry?.sha256 ?? ''
      const version = await ffmpeg.version(id)
      let status: DependencyStatus['status'] = 'ok'
      let detail = `Firma SHA-256 verificata (${actual.slice(0, 12)}…).`
      if (!version) {
        status = 'unsupported'
        detail = 'Il binario non risponde a -version'
      } else if (!expected) {
        detail = 'Checksum non pinnato nel manifest: verifica manuale richiesta.'
      } else if (expected.toLowerCase() !== actual.toLowerCase()) {
        status = 'corrupt'
        detail = `Checksum non corrispondente (atteso ${expected.slice(0, 12)}…, trovato ${actual.slice(0, 12)}…).`
      }
      results.push({
        id,
        name: id === 'ffmpeg' ? 'FFmpeg' : 'FFprobe',
        required: id === 'ffmpeg',
        path: path!,
        version: version?.split(' ').slice(0, 3).join(' ') ?? null,
        expectedSha256: expected || null,
        actualSha256: actual,
        status,
        detail
      })
    }

    let dbKind = 'unknown'
    try {
      dbKind = getDb().kind
    } catch {
      /* db not ready */
    }
    results.push({
      id: 'sqlite',
      name: 'SQLite (better-sqlite3 / sql.js)',
      required: false,
      path: null,
      version: dbKind,
      expectedSha256: null,
      actualSha256: null,
      status: dbKind === 'better-sqlite3' || dbKind === 'sql.js' ? 'ok' : 'unsupported',
      detail: dbKind === 'better-sqlite3' ? 'Driver nativo attivo.' : dbKind === 'sql.js' ? 'Fallback WASM attivo (nessun rebuild nativo).' : 'Nessun driver SQLite disponibile.'
    })
    return results
  }

  private async downloadToFile(url: string, destination: string, expectedSha: string): Promise<void> {
    const response = await fetch(url, { redirect: 'follow' })
    if (!response.ok || !response.body) throw new Error(`Download fallito: HTTP ${response.status}`)
    const length = Number(response.headers.get('content-length') ?? 0)
    if (length > 500 * 1024 * 1024) throw new Error('Archivio troppo grande (limite 500 MB)')
    const hash = createHash('sha256')
    const file = createWriteStream(destination, { mode: 0o600 })
    const body = Readable.fromWeb(response.body as Parameters<typeof Readable.fromWeb>[0])
    await new Promise<void>((resolvePromise, reject) => {
      body.on('data', (chunk: Buffer) => hash.update(chunk))
      body.on('error', reject)
      file.on('error', reject)
      file.on('finish', () => resolvePromise())
      body.pipe(file)
    })
    const actual = hash.digest('hex')
    if (actual.toLowerCase() !== expectedSha.toLowerCase()) {
      throw new Error(`Checksum download non valido: atteso ${expectedSha.slice(0, 12)}…, ottenuto ${actual.slice(0, 12)}…`)
    }
  }

  private async extractMember(entry: DownloadEntry, archivePath: string, workDir: string): Promise<string> {
    if (entry.archive === 'zip') {
      const zip = new AdmZip(archivePath)
      const found = zip.getEntries().find((e) => basename(e.entryName) === entry.member)
      if (!found) throw new Error(`${entry.member} non presente nell'archivio`)
      const target = assertZipEntrySafe(found.entryName, workDir)
      mkdirSync(join(target, '..'), { recursive: true })
      writeFileSync(target, found.getData())
      return target
    }
    // tar.xz: validate every member before extracting (zip-slip equivalent).
    const list = await run('tar', ['-tJf', archivePath])
    if (list.code !== 0) throw new Error('Archivio tar.xz non valido')
    for (const line of list.stdout.split(/\r?\n/)) {
      if (line.trim()) assertZipEntrySafe(line.trim(), workDir)
    }
    const extract = await run('tar', ['-xJf', archivePath, '-C', workDir])
    if (extract.code !== 0) throw new Error('Estrazione tar.xz fallita')
    const stack = [workDir]
    while (stack.length) {
      const dir = stack.pop()!
      for (const name of readdirSync(dir)) {
        const full = join(dir, name)
        if (statSync(full).isDirectory()) stack.push(full)
        else if (name === entry.member) return full
      }
    }
    throw new Error(`${entry.member} non presente nell'archivio`)
  }

  async download(component: 'ffmpeg' | 'ffprobe' | 'all'): Promise<{ dependencies: DependencyStatus[]; detail: string }> {
    const ids: Array<'ffmpeg' | 'ffprobe'> = component === 'all' ? ['ffmpeg', 'ffprobe'] : [component]
    const binDir = appPaths().bin
    mkdirSync(binDir, { recursive: true, mode: 0o700 })
    const messages: string[] = []

    for (const id of ids) {
      const entry = this.entryFor(id)
      if (!entry) throw new Error(`Nessuna sorgente configurata per ${process.platform}-${process.arch}`)
      if (!/^[a-f0-9]{64}$/i.test(entry.sha256)) {
        throw new Error(
          `Download bloccato: checksum SHA-256 non pinnato per ${id} (${process.platform}-${process.arch}). Un maintainer deve aggiornare ffmpeg/checksums.json.`
        )
      }
      const workDir = mkdtempSync(join(tmpdir(), 'molicut-deps-'))
      const archive = join(workDir, 'archive')
      try {
        logger.info('deps', `downloading ${id} from ${entry.url}`)
        await this.downloadToFile(entry.url, archive, entry.sha256)
        const binary = await this.extractMember(entry, archive, workDir)
        const target = join(binDir, basename(binary))
        const staging = `${target}.new`
        copyFileSync(binary, staging)
        if (process.platform !== 'win32') chmodSync(staging, 0o755)
        renameSync(staging, target)
        ffmpeg.invalidate()
        messages.push(`${id} installato in ${target}`)
        logger.info('deps', `installed ${id} -> ${target}`)
      } finally {
        try {
          rmSync(workDir, { recursive: true, force: true })
        } catch {
          /* ignore */
        }
      }
    }

    return { dependencies: await this.status(), detail: messages.join('; ') }
  }
}

function run(bin: string, args: string[]): Promise<{ code: number; stdout: string }> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { windowsHide: true, shell: false })
    let stdout = ''
    child.stdout.on('data', (d: Buffer) => {
      stdout += d.toString('utf8')
    })
    child.on('error', reject)
    child.on('close', (code) => resolvePromise({ code: code ?? -1, stdout }))
  })
}

export const dependencies = new DependencyService()
