import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync, copyFileSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { dialog, type BrowserWindow } from 'electron'
import type { Project, Sequence } from '@shared/schemas'
import { projectSchema } from '@shared/schemas'
import { createProject } from '@shared/projectFactory'
import { getDb } from './db'
import { exportEdl, exportFcpXml, exportPremiereXml } from './interchange'
import { logger } from './logger'
import { appPaths } from './paths'
import { assertWritablePath, safeRealPath } from './security'
import { settings } from './settings'

const MAX_PROJECT_BYTES = 64 * 1024 * 1024

export class ProjectService {
  newProject(name: string): Project {
    const project = createProject(name.trim() || 'Untitled Project')
    logger.info('project', `created ${project.id} (${project.name})`)
    return project
  }

  recent(): string[] {
    return getDb()
      .prepare('SELECT path FROM recent_projects ORDER BY opened_at DESC LIMIT 12')
      .all<{ path: string }>()
      .map((r) => r.path)
      .filter((p) => existsSync(p))
  }

  private addRecent(path: string): void {
    getDb()
      .prepare('INSERT INTO recent_projects (path, opened_at) VALUES (?, ?) ON CONFLICT(path) DO UPDATE SET opened_at=excluded.opened_at')
      .run(path, new Date().toISOString())
    const items = this.recent()
    settings.update({ recentProjects: items })
  }

  async openWithDialog(parent: BrowserWindow | null): Promise<{ canceled: boolean; project?: Project; path?: string }> {
    // .ncut is the legacy NovaCut extension: keep opening old projects.
    const filters = [{ name: 'MoliCut Project', extensions: ['mcut', 'ncut'] }]
    const result = parent
      ? await dialog.showOpenDialog(parent, { title: 'Apri progetto MoliCut', filters, properties: ['openFile'] })
      : await dialog.showOpenDialog({ title: 'Apri progetto MoliCut', filters, properties: ['openFile'] })
    if (result.canceled || result.filePaths.length === 0) return { canceled: true }
    const opened = await this.open(result.filePaths[0]!)
    return { canceled: false, ...opened }
  }

  async open(path: string): Promise<{ project: Project; path: string }> {
    const real = safeRealPath(path)
    if (!existsSync(real)) throw new Error('Progetto non trovato')
    const stats = statSync(real)
    if (stats.size > MAX_PROJECT_BYTES) throw new Error('Progetto troppo grande o corrotto')
    const raw = JSON.parse(readFileSync(real, 'utf8')) as unknown
    const parsed = projectSchema.parse(raw)
    // Mark offline media so the UI can offer relink without mutating paths.
    for (const asset of parsed.media) {
      asset.status = existsSync(asset.path) ? 'online' : 'offline'
      asset.proxyPath = asset.proxyPath && existsSync(asset.proxyPath) ? asset.proxyPath : null
    }
    this.addRecent(real)
    logger.info('project', `opened ${real} (${parsed.sequences.length} sequences)`)
    return { project: parsed, path: real }
  }

  async save(
    parent: BrowserWindow | null,
    project: Project,
    requestedPath?: string
  ): Promise<{ path: string; savedAt: string; canceled: boolean }> {
    const parsed = projectSchema.parse({ ...project, modifiedAt: new Date().toISOString() })
    let target = requestedPath
    if (!target) {
      const suggested = join(appPaths().projects, `${parsed.name.replace(/[<>:"/\\|?*]/g, '_')}.mcut`)
      const result = parent
        ? await dialog.showSaveDialog(parent, {
            title: 'Salva progetto',
            defaultPath: suggested,
            filters: [{ name: 'MoliCut Project', extensions: ['mcut'] }]
          })
        : await dialog.showSaveDialog({
            title: 'Salva progetto',
            defaultPath: suggested,
            filters: [{ name: 'MoliCut Project', extensions: ['mcut'] }]
          })
      if (result.canceled || !result.filePath) return { path: '', savedAt: '', canceled: true }
      target = result.filePath
    }
    const targetExt = extname(target).toLowerCase()
    if (targetExt !== '.mcut' && targetExt !== '.ncut') target = `${target}.mcut`
    const real = safeRealPath(target)
    assertWritablePath(real)
    if (!existsSync(dirname(real))) mkdirSync(dirname(real), { recursive: true })

    if (existsSync(real)) this.snapshot(real)
    const tmp = `${real}.tmp-${process.pid}`
    writeFileSync(tmp, JSON.stringify(parsed, null, 2), { encoding: 'utf8', mode: 0o600 })
    renameSync(tmp, real)
    this.addRecent(real)
    logger.info('project', `saved ${real}`)
    return { path: real, savedAt: parsed.modifiedAt, canceled: false }
  }

  autosave(project: Project): { path: string; savedAt: string } {
    const parsed = projectSchema.parse(project)
    const dir = appPaths().projects
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    const path = join(dir, `${parsed.id}.autosave.mcut`)
    const tmp = `${path}.tmp`
    writeFileSync(tmp, JSON.stringify(parsed), 'utf8')
    renameSync(tmp, path)
    return { path, savedAt: new Date().toISOString() }
  }

  /** Newest valid autosave, used after an unclean shutdown. */
  latestAutosave(): { project: Project; path: string; savedAt: string } | null {
    const dir = appPaths().projects
    if (!existsSync(dir)) return null
    const candidates = readdirSync(dir)
      .filter((name) => name.toLowerCase().endsWith('.autosave.mcut'))
      .map((name) => {
        const path = join(dir, name)
        try {
          return { path, at: statSync(path).mtimeMs, size: statSync(path).size }
        } catch {
          return null
        }
      })
      .filter((item): item is { path: string; at: number; size: number } => item !== null && item.size <= MAX_PROJECT_BYTES)
      .sort((a, b) => b.at - a.at)

    for (const candidate of candidates.slice(0, 5)) {
      try {
        const project = projectSchema.parse(JSON.parse(readFileSync(candidate.path, 'utf8')) as unknown)
        logger.info('project', `recovered autosave ${candidate.path}`)
        return { project, path: candidate.path, savedAt: new Date(candidate.at).toISOString() }
      } catch (err) {
        logger.warn('project', `ignored corrupt autosave ${candidate.path}: ${(err as Error).message}`)
      }
    }
    return null
  }

  /** Keep the last 10 snapshots of a project next to the backups directory. */
  private snapshot(projectPath: string): void {
    try {
      const dir = appPaths().backups
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
      const ext = extname(projectPath).toLowerCase() || '.mcut'
      const stem = basename(projectPath, ext)
      copyFileSync(projectPath, join(dir, `${stem}-${Date.now()}${ext}`))
      const old = readdirSync(dir)
        .filter((f) => f.startsWith(`${stem}-`) && f.endsWith(ext))
        .sort()
      for (const file of old.slice(0, Math.max(0, old.length - 10))) {
        try {
          unlinkSync(join(dir, file))
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      logger.warn('project', `snapshot failed: ${(err as Error).message}`)
    }
  }

  async exportInterchange(
    parent: BrowserWindow | null,
    project: Project,
    sequenceId: string,
    format: 'edl' | 'fcpxml' | 'xml'
  ): Promise<{ path: string; canceled: boolean }> {
    const sequence: Sequence | undefined = project.sequences.find((s) => s.id === sequenceId)
    if (!sequence) throw new Error('Sequenza non trovata')
    const ext = format === 'edl' ? 'edl' : format === 'fcpxml' ? 'fcpxml' : 'xml'
    const result = await dialog.showSaveDialog(parent ?? undefined!, {
      title: `Esporta ${format.toUpperCase()}`,
      defaultPath: join(appPaths().projects, `${sequence.name.replace(/[<>:"/\\|?*]/g, '_')}.${ext}`),
      filters: [{ name: format.toUpperCase(), extensions: [ext] }]
    })
    if (result.canceled || !result.filePath) return { path: '', canceled: true }
    const target = safeRealPath(result.filePath)
    assertWritablePath(target)
    const content =
      format === 'edl' ? exportEdl(project, sequence) : format === 'fcpxml' ? exportFcpXml(project, sequence) : exportPremiereXml(project, sequence)
    writeFileSync(target, content, 'utf8')
    logger.info('project', `interchange exported ${format} -> ${target}`)
    return { path: target, canceled: false }
  }
}

export const projectService = new ProjectService()
