import { existsSync, readdirSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import chokidar, { type FSWatcher } from 'chokidar'
import type { AppSettings, WatchFolder, WatchLogEntry } from '@shared/schemas'
import { watchFolderSchema } from '@shared/schemas'
import { basenameNoExt, globToRegExp, uid } from '@shared/utils'
import { getDb } from './db'
import { outputExtension, uniqueOutputPath } from './encoder'
import { logger } from './logger'
import { media } from './media'
import { presets } from './presets'
import { queue } from './queue'
import { assertInsideAnyRoot, safeRealPath } from './security'

/**
 * Watch folder pipeline (all rules enforced in main, never trusted from UI):
 *   add -> extension/pattern filters -> stability (chokidar) -> symlink check
 *   -> conflict policy -> queue / proxy / ignore -> structured log.
 * Dry-run performs everything except the queue/proxy side effect.
 */

type NewWatchFolder = Omit<WatchFolder, 'id' | 'createdAt'>

export class WatchService {
  private watchers = new Map<string, FSWatcher>()
  private inFlight = new Set<string>()
  private settingsProvider: () => AppSettings = () => ({ watchEnabled: true }) as AppSettings
  onLog: ((entry: WatchLogEntry) => void) | null = null

  setSettingsProvider(provider: () => AppSettings): void {
    this.settingsProvider = provider
  }

  private save(folder: WatchFolder): void {
    getDb().prepare('INSERT INTO watch_folders (id, payload) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(folder.id, JSON.stringify(folder))
  }

  list(): WatchFolder[] {
    return getDb()
      .prepare('SELECT payload FROM watch_folders')
      .all<{ payload: string }>()
      .flatMap((row) => {
        try {
          const parsed = watchFolderSchema.safeParse(JSON.parse(row.payload))
          return parsed.success ? [parsed.data] : []
        } catch {
          return []
        }
      })
  }

  get(id: string): WatchFolder | undefined {
    return this.list().find((f) => f.id === id)
  }

  init(): void {
    if (!this.settingsProvider().watchEnabled) {
      logger.info('watch', 'watch folder disabled in settings')
      return
    }
    for (const folder of this.list()) {
      if (folder.enabled) this.start(folder)
    }
  }

  syncEnabled(enabled: boolean): void {
    if (!enabled) {
      this.stopAll()
      logger.info('watch', 'all watchers stopped (disabled)')
      return
    }
    for (const folder of this.list()) {
      if (folder.enabled && !this.watchers.has(folder.id)) this.start(folder)
    }
  }

  add(input: NewWatchFolder): WatchFolder {
    const real = this.validateFolder(input.path)
    const parsed = watchFolderSchema.parse({ ...input, path: real, id: uid('wf'), createdAt: new Date().toISOString() })
    this.save(parsed)
    if (parsed.enabled && this.settingsProvider().watchEnabled) this.start(parsed)
    this.log(parsed.id, 'info', `Cartella monitorata: ${parsed.path}`)
    return parsed
  }

  update(folder: WatchFolder): WatchFolder {
    const parsed = watchFolderSchema.parse({ ...folder, path: this.validateFolder(folder.path) })
    this.stop(parsed.id)
    this.save(parsed)
    if (parsed.enabled && this.settingsProvider().watchEnabled) this.start(parsed)
    return parsed
  }

  remove(id: string): WatchFolder[] {
    this.stop(id)
    getDb().prepare('DELETE FROM watch_folders WHERE id = ?').run(id)
    getDb().prepare('DELETE FROM watch_logs WHERE folder_id = ?').run(id)
    return this.list()
  }

  private validateFolder(folderPath: string): string {
    if (!existsSync(folderPath)) throw new Error('Cartella non trovata')
    const stats = statSync(folderPath)
    if (!stats.isDirectory()) throw new Error('Il path non è una cartella')
    return safeRealPath(folderPath)
  }

  private start(folder: WatchFolder): void {
    if (this.watchers.has(folder.id)) return
    try {
      const watcher = chokidar.watch(folder.path, {
        ignored: (path: string) => {
          if (path === folder.path) return false
          const name = basename(path)
          return name.startsWith('.') || name.endsWith('.tmp') || name.endsWith('.part')
        },
        ignoreInitial: true,
        persistent: true,
        depth: folder.recursive ? undefined : 0,
        followSymlinks: false,
        awaitWriteFinish: { stabilityThreshold: folder.stabilityMs, pollInterval: 150 }
      })
      watcher.on('add', (filePath) => void this.handleFile(folder, filePath))
      watcher.on('error', (err) => this.log(folder.id, 'error', `Watcher error: ${(err as Error).message}`))
      this.watchers.set(folder.id, watcher)
      logger.info('watch', `watching ${folder.path} (${folder.action})`)
    } catch (err) {
      this.log(folder.id, 'error', `Impossibile avviare watcher: ${(err as Error).message}`)
    }
  }

  private stop(id: string): void {
    const watcher = this.watchers.get(id)
    if (watcher) {
      void watcher.close()
      this.watchers.delete(id)
    }
  }

  stopAll(): void {
    for (const id of [...this.watchers.keys()]) this.stop(id)
  }

  private matches(folder: WatchFolder, filePath: string): boolean {
    const ext = extname(filePath).slice(1).toLowerCase()
    const allowed = folder.extensions.map((e) => e.replace(/^\./, '').toLowerCase())
    if (!allowed.includes(ext)) return false
    const name = basename(filePath)
    if (folder.namePattern && !globToRegExp(folder.namePattern).test(name)) return false
    if (folder.excludePattern && globToRegExp(folder.excludePattern).test(name)) return false
    return true
  }

  private async handleFile(folder: WatchFolder, filePath: string): Promise<void> {
    if (this.inFlight.has(filePath)) return
    this.inFlight.add(filePath)
    try {
      if (!this.matches(folder, filePath)) return
      // symlinks must resolve inside the watched root (symlink escape protection)
      const real = assertInsideAnyRoot(filePath, [folder.path])
      const preset = presets.get(folder.presetId)
      if (!preset) {
        this.log(folder.id, 'error', `Preset ${folder.presetId} non trovato`, real)
        return
      }
      const already = queue.list().find((j) => j.sourcePath === real && ['queued', 'running', 'paused'].includes(j.state))
      if (already) {
        this.log(folder.id, 'warn', 'File già presente in coda, ignorato', real)
        return
      }
      if (folder.dryRun) {
        this.log(folder.id, 'info', `[dry-run] ${folder.action} → ${basename(real)} (preset ${preset.name})`, real)
        return
      }
      if (folder.action === 'ignore') {
        this.log(folder.id, 'info', `Ignorato per regola: ${basename(real)}`, real)
        return
      }
      if (folder.action === 'proxy') {
        const asset = await media.probe(real)
        const proxy = await media.generateProxy(asset)
        this.log(folder.id, 'info', `Proxy generato: ${proxy}`, real)
        return
      }

      const target = join(folder.outputDir, `${basenameNoExt(real)}.${outputExtension(preset)}`)
      if (folder.conflict === 'skip' && existsSync(target)) {
        this.log(folder.id, 'warn', 'Output esistente, skip per policy', real)
        return
      }
      const outputPath = folder.conflict === 'overwrite' ? target : uniqueOutputPath(target, existsSync)
      await queue.add(
        [
          {
            sourcePath: real,
            presetId: preset.id,
            outputPath,
            priority: 40,
            maxRetries: 3
          }
        ],
        [folder.outputDir]
      )
      this.log(folder.id, 'info', `Accodato ${basename(real)} → ${outputPath}`, real)
    } catch (err) {
      this.log(folder.id, 'error', `Errore: ${(err as Error).message}`, filePath)
    } finally {
      setTimeout(() => this.inFlight.delete(filePath), 1000)
    }
  }

  /** Non-destructive scan used by the UI "Test regole" button. */
  test(id: string): { matches: string[]; scanned: number } {
    const folder = this.get(id)
    if (!folder) throw new Error('Watch folder non trovata')
    const results: string[] = []
    let scanned = 0
    const walk = (dir: string, depth: number): void => {
      if (depth > 6 || scanned > 5000) return
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name)
        if (entry.isDirectory()) {
          if (folder.recursive) walk(full, depth + 1)
          continue
        }
        if (!entry.isFile()) continue
        scanned++
        if (this.matches(folder, full)) results.push(full)
      }
    }
    walk(folder.path, 0)
    return { matches: results, scanned }
  }

  logs(limit = 200): WatchLogEntry[] {
    return getDb()
      .prepare('SELECT at, folder_id, level, message, file FROM watch_logs ORDER BY id DESC LIMIT ?')
      .all<{ at: string; folder_id: string; level: string; message: string; file: string | null }>(limit)
      .map((row) => ({
        at: row.at,
        folderId: row.folder_id,
        level: row.level as WatchLogEntry['level'],
        message: row.message,
        file: row.file ?? undefined
      }))
  }

  private log(folderId: string, level: WatchLogEntry['level'], message: string, file?: string): void {
    const entry: WatchLogEntry = {
      at: new Date().toISOString(),
      folderId,
      level,
      message: message.slice(0, 2000),
      file: file?.slice(0, 4096)
    }
    try {
      getDb()
        .prepare('INSERT INTO watch_logs (at, folder_id, level, message, file) VALUES (?, ?, ?, ?, ?)')
        .run(entry.at, folderId, level, entry.message, entry.file ?? null)
      getDb().prepare('DELETE FROM watch_logs WHERE id NOT IN (SELECT id FROM watch_logs ORDER BY id DESC LIMIT 5000)').run()
    } catch (err) {
      logger.warn('watch', `log persist failed: ${(err as Error).message}`)
    }
    if (level === 'error') logger.error('watch', message)
    else if (level === 'warn') logger.warn('watch', message)
    else logger.info('watch', message)
    this.onLog?.(entry)
  }

  watchedIds(): string[] {
    return [...this.watchers.keys()]
  }
}

export const watch = new WatchService()
