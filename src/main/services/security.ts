import { createHash } from 'node:crypto'
import { createReadStream, realpathSync, statSync } from 'node:fs'
import { extname, isAbsolute, relative, resolve, sep } from 'node:path'
import { Readable } from 'node:stream'
import { app, protocol, session, type BrowserWindow, type Session } from 'electron'
import { appPaths, writableRoots } from './paths'
import { logger } from './logger'

/* ------------------------------------------------------------------ */
/* Custom media protocol                                               */
/* ------------------------------------------------------------------ */

export const MEDIA_SCHEME = 'molicut-media'
let allowedMediaRoots: () => string[] = () => []

/** Must be called before app.whenReady(). */
export function registerPrivilegedSchemes(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: MEDIA_SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        stream: true,
        bypassCSP: false,
        corsEnabled: true
      }
    }
  ])
}

const MIME: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
  '.avi': 'video/x-msvideo',
  '.mxf': 'application/mxf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.flac': 'audio/flac',
  '.aac': 'audio/aac',
  '.ogg': 'audio/ogg',
  '.opus': 'audio/opus',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.exr': 'image/x-exr',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.lut': 'text/plain',
  '.cube': 'text/plain'
}

export function mediaUrl(absolutePath: string): string {
  return `${MEDIA_SCHEME}://media/${encodeURIComponent(absolutePath)}`
}

function isPathInside(parent: string, child: string): boolean {
  const rel = relative(resolve(parent), resolve(child))
  if (rel === '') return true
  return !rel.startsWith('..') && !rel.startsWith(`..${sep}`) && !isAbsolute(rel)
}

/**
 * Resolve symlinks for the deepest existing ancestor, so a symlink inside an
 * allowed root cannot point outside it. This closes symlink-escape attacks on
 * import, proxy and media serving paths.
 */
export function safeRealPath(input: string): string {
  if (input.includes('\0')) throw new Error('Invalid path: null byte')
  if (!isAbsolute(input)) throw new Error('Invalid path: must be absolute')
  let probe = resolve(input)
  const suffix: string[] = []
  for (let i = 0; i < 64; i++) {
    try {
      const real = realpathSync(probe)
      return suffix.length ? resolve(real, ...suffix.reverse()) : real
    } catch {
      const parent = resolve(probe, '..')
      if (parent === probe) break
      suffix.push(probe.slice(parent.length).replace(/^[\\/]/, ''))
      probe = parent
    }
  }
  return resolve(input)
}

export function assertInsideAnyRoot(filePath: string, roots: string[]): string {
  const real = safeRealPath(filePath)
  const ok = roots.some((root) => isPathInside(safeRealPath(root), real))
  if (!ok) throw new Error('Path outside allowed roots')
  return real
}

export function assertWritablePath(filePath: string, extraRoots: string[] = []): string {
  const real = safeRealPath(filePath)
  const blocklist = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i
  const segments = real.split(/[\\/]/)
  if (segments.some((s) => blocklist.test(s))) throw new Error('Reserved device name in path')
  return assertInsideAnyRoot(real, [...writableRoots(), ...extraRoots])
}

export function setMediaRoots(provider: () => string[]): void {
  allowedMediaRoots = provider
}

function mediaRoots(): string[] {
  const paths = appPaths()
  return [paths.proxies, paths.thumbnails, paths.cache, paths.temp, ...allowedMediaRoots()]
}

export function registerMediaProtocol(): void {
  protocol.handle(MEDIA_SCHEME, async (request) => {
    try {
      const url = new URL(request.url)
      if (url.hostname !== 'media') return new Response('Not found', { status: 404 })
      const raw = decodeURIComponent(url.pathname.replace(/^\//, ''))
      const filePath = assertInsideAnyRoot(raw, mediaRoots())
      const stat = statSync(filePath)
      if (!stat.isFile()) return new Response('Not a file', { status: 404 })

      const type = MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
      const range = request.headers.get('range')
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim())
        if (!match) return new Response('Bad range', { status: 416 })
        const start = match[1] ? Number(match[1]) : 0
        const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1
        if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
          return new Response('Range not satisfiable', {
            status: 416,
            headers: { 'Content-Range': `bytes */${stat.size}` }
          })
        }
        const stream = createReadStream(filePath, { start, end })
        return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
          status: 206,
          headers: {
            'Content-Type': type,
            'Content-Length': String(end - start + 1),
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-store'
          }
        })
      }
      const stream = createReadStream(filePath)
      return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
        status: 200,
        headers: {
          'Content-Type': type,
          'Content-Length': String(stat.size),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-store'
        }
      })
    } catch (err) {
      logger.warn('security', `media protocol rejected: ${(err as Error).message}`)
      return new Response('Forbidden', { status: 403 })
    }
  })
}

/* ------------------------------------------------------------------ */
/* CSP + session hardening                                             */
/* ------------------------------------------------------------------ */

function contentSecurityPolicy(): string {
  const dev = !app.isPackaged
  const scriptExtra = dev ? " 'unsafe-inline' 'unsafe-eval'" : ''
  const connectExtra = dev ? ' ws://127.0.0.1:* ws://localhost:* http://127.0.0.1:* http://localhost:*' : ''
  return [
    "default-src 'none'",
    `script-src 'self'${scriptExtra}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: molicut-media:",
    "media-src 'self' blob: data: molicut-media:",
    "font-src 'self' data:",
    `connect-src 'self'${connectExtra}`,
    "worker-src 'self' blob:",
    "child-src 'none'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'"
  ].join('; ')
}

export function applySessionHardening(target: Session = session.defaultSession): void {
  target.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...(details.responseHeaders ?? {}) }
    headers['Content-Security-Policy'] = [contentSecurityPolicy()]
    headers['X-Content-Type-Options'] = ['nosniff']
    headers['Referrer-Policy'] = ['no-referrer']
    callback({ responseHeaders: headers })
  })

  target.setPermissionRequestHandler((_wc, permission, callback) => {
    // Clipboard read for paste, fullscreen for preview: everything else denied.
    const allowed = permission === 'clipboard-read' || permission === 'fullscreen'
    if (!allowed) logger.warn('security', `permission denied: ${permission}`)
    callback(allowed)
  })
  target.setPermissionCheckHandler((_wc, permission) => permission === 'clipboard-read')
  target.on('will-download', (event, item) => {
    // Downloads are performed by the app itself, never by renderer navigation.
    if (!app.isPackaged) return
    event.preventDefault()
    logger.warn('security', `download blocked: ${item.getFilename()}`)
  })
}

const trustedWebContents = new Set<number>()
export function trustWebContents(id: number): void {
  trustedWebContents.add(id)
}
export function untrustWebContents(id: number): void {
  trustedWebContents.delete(id)
}
export function isTrustedWebContents(id: number): boolean {
  return trustedWebContents.has(id)
}

export function hardenWindow(win: BrowserWindow, allowedUrlPrefixes: string[]): void {
  const wc = win.webContents
  const allowed = (url: string): boolean =>
    allowedUrlPrefixes.some((prefix) => url.startsWith(prefix)) || url.startsWith(`${MEDIA_SCHEME}://`)

  wc.setWindowOpenHandler(({ url }) => {
    logger.warn('security', `window.open blocked: ${url}`)
    return { action: 'deny' }
  })
  wc.on('will-navigate', (event, url) => {
    if (!allowed(url)) {
      event.preventDefault()
      logger.warn('security', `navigation blocked: ${url}`)
    }
  })
  wc.on('will-attach-webview', (event) => {
    event.preventDefault()
    logger.warn('security', 'webview attach blocked')
  })
  win.webContents.on('render-process-gone', (_event, details) => {
    logger.error('security', `renderer gone: ${details.reason}`)
  })
  win.webContents.on('preload-error', (_event, preloadPath, error) => {
    logger.error('security', `preload error (${preloadPath}): ${error.message}`)
  })
}

/* ------------------------------------------------------------------ */
/* Checksums, path/zip validation                                      */
/* ------------------------------------------------------------------ */

export async function sha256File(filePath: string): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(filePath)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolvePromise(hash.digest('hex')))
  })
}

export function checksumEquals(expected: string, actual: string): boolean {
  if (!expected || expected.length !== actual.length) return false
  try {
    return createHash('sha256').update(expected).digest('hex') === createHash('sha256').update(actual).digest('hex')
  } catch {
    return false
  }
}

const MEDIA_EXTENSIONS = new Set([
  'mp4', 'm4v', 'mov', 'mkv', 'avi', 'webm', 'mxf', 'prores', 'dnxhd', 'dnxhr', 'mts', 'm2ts',
  'h264', 'h265', 'hevc', 'av1', 'vp9', 'ogv', 'wmv', 'flv',
  'wav', 'mp3', 'aac', 'flac', 'ogg', 'opus', 'aiff', 'm4a',
  'png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff', 'exr', 'dpx', 'bmp', 'gif'
])

export function isSupportedMediaFile(filePath: string): boolean {
  const ext = extname(filePath).slice(1).toLowerCase()
  return MEDIA_EXTENSIONS.has(ext)
}

/** Zip-slip safe entry validation used by dependency/plugin importers. */
export function assertZipEntrySafe(entryName: string, destinationRoot: string): string {
  if (entryName.includes('\0')) throw new Error('Invalid zip entry')
  const normalized = entryName.replace(/\\/g, '/')
  if (normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized)) throw new Error('Absolute zip entry')
  const dest = resolve(destinationRoot, normalized)
  if (!isPathInside(resolve(destinationRoot), dest)) throw new Error('Zip entry escapes destination')
  return dest
}
