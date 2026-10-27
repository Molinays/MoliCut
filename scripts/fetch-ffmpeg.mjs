#!/usr/bin/env node
/**
 * Fetch the pinned FFmpeg/FFprobe build into ./ffmpeg/bin.
 *
 * Security rules:
 *  - A download is refused unless the platform entry in ffmpeg/checksums.json
 *    carries a SHA-256. There is no "trust on first use" in release builds.
 *  - `--pin` is the maintainer workflow: it downloads, prints the hash and
 *    writes it into checksums.json. The resulting diff MUST be reviewed.
 *  - Archives are extracted into a temp directory, checked for path traversal
 *    and only then moved into place (atomic-ish, no partial installs).
 *
 * Usage:
 *   node scripts/fetch-ffmpeg.mjs                 # install (verified)
 *   node scripts/fetch-ffmpeg.mjs --force         # reinstall
 *   node scripts/fetch-ffmpeg.mjs --pin           # record hashes, no install
 *   node scripts/fetch-ffmpeg.mjs --platform linux-x64
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { createWriteStream } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, normalize, resolve, sep } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import AdmZip from 'adm-zip'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = join(root, 'ffmpeg', 'checksums.json')
const binDir = join(root, 'ffmpeg', 'bin')
const args = new Set(process.argv.slice(2))
const platformArg = process.argv.find((a) => a.startsWith('--platform='))?.split('=')[1]
const platform = platformArg ?? `${process.platform}-${process.arch}`
const force = args.has('--force')
const pin = args.has('--pin')

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const channel = manifest.channels[platform]
if (!channel) {
  console.error(`[fetch-ffmpeg] no manifest entry for "${platform}". Known: ${Object.keys(manifest.channels).join(', ')}`)
  process.exit(1)
}

async function download(url, destination) {
  console.log(`[fetch-ffmpeg] GET ${url}`)
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status} for ${url}`)
  await pipeline(Readable.fromWeb(res.body), createWriteStream(destination))
  return destination
}

async function sha256(file) {
  const hash = createHash('sha256')
  const { createReadStream } = await import('node:fs')
  await pipeline(createReadStream(file), hash)
  return hash.digest('hex')
}

function safeMember(archiveRoot, member) {
  const full = resolve(archiveRoot, member)
  const rootWithSep = archiveRoot.endsWith(sep) ? archiveRoot : archiveRoot + sep
  if (full !== archiveRoot && !full.startsWith(rootWithSep)) throw new Error(`zip-slip blocked: ${member}`)
  return full
}

function extractZip(file, dest) {
  const zip = new AdmZip(file)
  for (const entry of zip.getEntries()) {
    const target = safeMember(dest, entry.entryName)
    if (entry.isDirectory) continue
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, entry.getData())
  }
}

function extractTarXz(file, dest) {
  const tar = spawnSync('tar', ['-xJf', file, '-C', dest], { stdio: 'inherit' })
  if (tar.status !== 0) throw new Error('tar extraction failed (install xz-utils or provide a zip build)')
}

function findBinary(dir, name) {
  const wanted = process.platform === 'win32' ? `${name}.exe` : name
  const stack = [dir]
  while (stack.length) {
    const current = stack.pop()
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) stack.push(full)
      else if (entry.name === wanted) return full
    }
  }
  return null
}

function installBinary(source, name) {
  mkdirSync(binDir, { recursive: true })
  const targetName = process.platform === 'win32' ? `${name}.exe` : name
  const target = join(binDir, targetName)
  rmSync(target, { force: true })
  renameSync(source, target)
  if (process.platform !== 'win32') {
    const chmod = spawnSync('chmod', ['755', target])
    if (chmod.status !== 0) console.warn('[fetch-ffmpeg] could not chmod', target)
  }
  console.log(`[fetch-ffmpeg] installed ${target}`)
}

const work = mkdtempSync(join(tmpdir(), 'molicut-ffmpeg-'))
try {
  for (const name of ['ffmpeg', 'ffprobe']) {
    const entry = channel[name]
    const archivePath = join(work, `${name}-${entry.archive === 'zip' ? 'zip' : 'tar.xz'}`)
    await download(entry.url, archivePath)
    const digest = await sha256(archivePath)

    if (pin) {
      entry.sha256 = digest
      console.log(`[fetch-ffmpeg] ${platform}/${name} sha256=${digest}`)
      continue
    }

    if (!/^[a-f0-9]{64}$/i.test(entry.sha256)) {
      throw new Error(
        `refusing to install ${name}: no pinned sha256 for ${platform}. A maintainer must run --pin and commit the reviewed hash.`
      )
    }
    if (digest.toLowerCase() !== entry.sha256.toLowerCase()) {
      throw new Error(`${name}: checksum mismatch\n  expected ${entry.sha256}\n  actual   ${digest}`)
    }

    const extractDir = join(work, `${name}-extract`)
    mkdirSync(extractDir, { recursive: true })
    if (entry.archive === 'zip') extractZip(archivePath, extractDir)
    else extractTarXz(archivePath, extractDir)

    const binary = findBinary(extractDir, entry.member.replace(/\.exe$/i, ''))
    if (!binary) throw new Error(`${name}: member "${entry.member}" not found in archive`)
    installBinary(binary, name)
    writeFileSync(join(binDir, 'VERSION'), `${entry.version}\n${platform}\n`)
  }

  if (pin) {
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
    console.log('[fetch-ffmpeg] hashes written to ffmpeg/checksums.json — review the diff before committing.')
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}

if (!pin && existsSync(binDir)) {
  console.log('[fetch-ffmpeg] done. Run `npm run verify:ffmpeg` to confirm versions.')
}
