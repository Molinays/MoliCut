import { copyFileSync, existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { appPaths, databaseFile } from './paths'
import { logger } from './logger'

/**
 * Persistence strategy (security + portability):
 *  1. better-sqlite3 (native, fastest) when the ABI matches Electron.
 *  2. sql.js (SQLite compiled to WASM) as a guaranteed fallback: no native
 *     rebuild, works in CI and on machines without a build toolchain.
 *  3. in-memory driver only for unit tests.
 * Both real drivers use the same SQL schema and the same repository code.
 */

export type Row = Record<string, unknown>

export interface DbStatement {
  run(...params: unknown[]): { changes: number }
  get<T = Row>(...params: unknown[]): T | undefined
  all<T = Row>(...params: unknown[]): T[]
}

export interface DbDriver {
  kind: 'better-sqlite3' | 'sql.js' | 'memory'
  exec(sql: string): void
  prepare(sql: string): DbStatement
  flush(): void
  close(): void
}

let db: DbDriver | null = null
let initPromise: Promise<DbDriver> | null = null

class MemoryDriver implements DbDriver {
  kind = 'memory' as const
  exec(): void {}
  prepare(): DbStatement {
    return { run: () => ({ changes: 0 }), get: () => undefined, all: () => [] }
  }
  flush(): void {}
  close(): void {}
}

function wrapBetterSqlite(handle: any): DbDriver {
  const cache = new Map<string, any>()
  return {
    kind: 'better-sqlite3',
    exec: (sql) => handle.exec(sql),
    prepare: (sql) => {
      let stmt = cache.get(sql)
      if (!stmt) {
        stmt = handle.prepare(sql)
        cache.set(sql, stmt)
      }
      return {
        run: (...params) => ({ changes: Number(stmt.run(...params).changes ?? 0) }),
        get: <T = Row>(...params: unknown[]): T | undefined => stmt.get(...params) as T | undefined,
        all: <T = Row>(...params: unknown[]): T[] => stmt.all(...params) as T[]
      }
    },
    flush: () => {
      try {
        handle.pragma('wal_checkpoint(TRUNCATE)')
      } catch {
        /* ignore */
      }
    },
    close: () => {
      cache.clear()
      handle.close()
    }
  }
}

function wrapSqlJs(handle: any, persist: () => void): DbDriver {
  return {
    kind: 'sql.js',
    exec: (sql) => {
      handle.exec(sql)
      persist()
    },
    prepare: (sql) => ({
      run: (...params) => {
        handle.run(sql, params)
        persist()
        return { changes: handle.getRowsModified() }
      },
      get: <T = Row>(...params: unknown[]): T | undefined => {
        const stmt = handle.prepare(sql)
        try {
          stmt.bind(params)
          if (stmt.step()) return stmt.getAsObject() as T
          return undefined
        } finally {
          stmt.free()
        }
      },
      all: <T = Row>(...params: unknown[]): T[] => {
        const stmt = handle.prepare(sql)
        const rows: T[] = []
        try {
          stmt.bind(params)
          while (stmt.step()) rows.push(stmt.getAsObject() as T)
        } finally {
          stmt.free()
        }
        return rows
      }
    }),
    flush: persist,
    close: () => {
      persist()
      handle.close()
    }
  }
}

async function createDriver(): Promise<DbDriver> {
  const file = databaseFile()
  if (process.env.MOLICUT_TEST_DB === 'memory') return new MemoryDriver()
  const require = createRequire(typeof __filename !== 'undefined' ? __filename : process.cwd())

  // 1) native SQLite
  try {
    const BetterSqlite3 = require('better-sqlite3')
    const handle = new BetterSqlite3(file)
    handle.pragma('journal_mode = WAL')
    handle.pragma('synchronous = NORMAL')
    handle.pragma('foreign_keys = ON')
    logger.info('db', 'driver=better-sqlite3')
    return wrapBetterSqlite(handle)
  } catch (err) {
    logger.warn('db', `better-sqlite3 unavailable (${(err as Error).message}); trying sql.js`)
  }

  // 2) WASM SQLite
  try {
    const initSqlJs = require('sql.js')
    const sqlJsDir = dirname(require.resolve('sql.js'))
    const SQL = await (typeof initSqlJs === 'function' ? initSqlJs : initSqlJs.default)({
      locateFile: (name: string) => join(sqlJsDir, name)
    })
    const data = existsSync(file) ? new Uint8Array(readFileSync(file)) : undefined
    const handle = new SQL.Database(data)
    let timer: NodeJS.Timeout | null = null
    const persist = (): void => {
      if (timer) return
      timer = setTimeout(() => {
        timer = null
        try {
          const exported = handle.export() as Uint8Array
          const tmp = `${file}.tmp`
          writeFileSync(tmp, exported)
          renameSync(tmp, file)
        } catch (err) {
          logger.error('db', `sql.js persistence failed: ${(err as Error).message}`)
        }
      }, 250)
      timer.unref?.()
    }
    logger.info('db', 'driver=sql.js (WASM fallback)')
    return wrapSqlJs(handle, persist)
  } catch (err) {
    logger.error('db', `sql.js unavailable (${(err as Error).message}); using in-memory driver`)
    return new MemoryDriver()
  }
}

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL);`,
  `CREATE TABLE IF NOT EXISTS queue_jobs (
     id TEXT PRIMARY KEY,
     state TEXT NOT NULL,
     priority INTEGER NOT NULL DEFAULT 50,
     created_at TEXT NOT NULL,
     updated_at TEXT NOT NULL,
     payload TEXT NOT NULL
   );`,
  `CREATE INDEX IF NOT EXISTS idx_queue_state_priority ON queue_jobs(state, priority DESC, created_at ASC);`,
  `CREATE TABLE IF NOT EXISTS presets (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     builtin INTEGER NOT NULL DEFAULT 0,
     updated_at TEXT NOT NULL,
     payload TEXT NOT NULL
   );`,
  `CREATE TABLE IF NOT EXISTS watch_folders (id TEXT PRIMARY KEY, payload TEXT NOT NULL);`,
  `CREATE TABLE IF NOT EXISTS watch_logs (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     at TEXT NOT NULL,
     folder_id TEXT NOT NULL,
     level TEXT NOT NULL,
     message TEXT NOT NULL,
     file TEXT
   );`,
  `CREATE TABLE IF NOT EXISTS hardware_profile (
     hash TEXT PRIMARY KEY,
     scanned_at TEXT NOT NULL,
     payload TEXT NOT NULL
   );`,
  `CREATE TABLE IF NOT EXISTS recent_projects (path TEXT PRIMARY KEY, opened_at TEXT NOT NULL);`,
  `CREATE TABLE IF NOT EXISTS schema_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);`
]

export async function initDatabase(): Promise<DbDriver> {
  if (db) return db
  if (initPromise) return initPromise
  initPromise = (async () => {
    const driver = await createDriver()
    driver.exec(MIGRATIONS.join('\n'))
    driver.prepare(`INSERT OR REPLACE INTO schema_meta (key, value) VALUES ('version', ?)`).run('1')
    db = driver
    return driver
  })()
  return initPromise
}

export function getDb(): DbDriver {
  if (!db) throw new Error('Database not initialised')
  return db
}

export function closeDatabase(): void {
  if (!db) return
  try {
    db.flush()
    db.close()
  } catch (err) {
    logger.error('db', `close failed: ${(err as Error).message}`)
  }
  db = null
  initPromise = null
}

export function getKv<T>(key: string, fallback: T): T {
  const row = getDb().prepare('SELECT value FROM kv WHERE key = ?').get<{ value: string }>(key)
  if (!row) return fallback
  try {
    return JSON.parse(row.value) as T
  } catch {
    return fallback
  }
}

export function setKv(key: string, value: unknown): void {
  getDb()
    .prepare('INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .run(key, JSON.stringify(value))
}

/** Copies the database before destructive maintenance; returns the backup path. */
export function backupDatabase(tag: string): string | null {
  const file = databaseFile()
  if (!existsSync(file)) return null
  const target = join(appPaths().backups, `molicut-${tag}-${Date.now()}.sqlite`)
  try {
    getDb().flush()
    copyFileSync(file, target)
    logger.info('db', `backup created: ${target}`)
    return target
  } catch (err) {
    logger.error('db', `backup failed: ${(err as Error).message}`)
    return null
  }
}
