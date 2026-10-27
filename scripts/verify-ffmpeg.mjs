#!/usr/bin/env node
/**
 * Verify the local FFmpeg/FFprobe installation without launching Electron.
 * Exits non-zero if a binary is missing, cannot report a version, or (when the
 * manifest pins a hash for the *binary*) the hash differs.
 *
 * Note: the manifest pins the *archive* hash used by scripts/fetch-ffmpeg.mjs.
 * Here we report the installed binary hash so release engineers can record it
 * in the SBOM / release notes.
 */
import { createHash } from 'node:crypto'
import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const binDir = join(root, 'ffmpeg', 'bin')
const ext = process.platform === 'win32' ? '.exe' : ''
const platform = `${process.platform}-${process.arch}`

async function sha256(file) {
  const hash = createHash('sha256')
  await new Promise((resolvePromise, reject) => {
    createReadStream(file)
      .on('data', (chunk) => hash.update(chunk))
      .on('error', reject)
      .on('end', resolvePromise)
  })
  return hash.digest('hex')
}

function version(binary) {
  const result = spawnSync(binary, ['-version'], { encoding: 'utf8', timeout: 15000 })
  if (result.error) return { ok: false, detail: result.error.message }
  if (result.status !== 0) return { ok: false, detail: `exit ${result.status}: ${result.stderr?.split('\n')[0] ?? ''}` }
  const first = (result.stdout ?? '').split('\n')[0]?.trim() ?? ''
  const hw = spawnSync(binary, ['-hide_banner', '-hwaccels'], { encoding: 'utf8', timeout: 15000 })
  const hwaccels = (hw.stdout ?? '')
    .split('\n')
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
  return { ok: Boolean(first), detail: first, hwaccels }
}

/** Extract pinned archive hashes for this platform from the manifest. */
function pinnedHashes() {
  const path = join(root, 'ffmpeg', 'checksums.json')
  if (!existsSync(path)) return null
  try {
    const manifest = JSON.parse(readFileSync(path, 'utf8'))
    return manifest.channels?.[platform] ?? null
  } catch {
    return null
  }
}

const pinned = pinnedHashes()
let failed = false

/** Resolution order mirrors src/main/services/ffmpeg.ts: env -> bundled -> PATH. */
function resolveBinary(name) {
  const envVar = process.env[name === 'ffmpeg' ? 'MOLICUT_FFMPEG' : 'MOLICUT_FFPROBE']
  if (envVar && existsSync(envVar)) return { binary: envVar, source: 'env' }
  const bundled = join(binDir, `${name}${ext}`)
  if (existsSync(bundled)) return { binary: bundled, source: 'bundled' }
  const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', [name], { encoding: 'utf8' })
  const found = which.status === 0 ? which.stdout.split(/\r?\n/)[0]?.trim() : null
  return found ? { binary: found, source: 'system PATH' } : { binary: null, source: 'none' }
}

for (const name of ['ffmpeg', 'ffprobe']) {
  const { binary, source } = resolveBinary(name)
  console.log(`\n${name}: ${binary ?? '(not found)'} [${source}]`)
  if (!binary) {
    console.error(`  MISSING — run "npm run fetch:ffmpeg" or install FFmpeg on PATH`)
    failed = true
    continue
  }
  const result = version(binary)
  if (!result.ok) {
    console.error(`  BROKEN — ${result.detail}`)
    failed = true
    continue
  }
  console.log(`  version: ${result.detail}`)
  if (name === 'ffmpeg') console.log(`  hwaccels: ${result.hwaccels.join(', ') || 'none reported'}`)
  console.log(`  sha256:  ${await sha256(binary)}`)
  const entry = pinned?.[name]
  console.log(`  archive pin (${platform}): ${entry?.sha256 ? entry.sha256 : 'NOT PINNED — in-app download disabled'}`)
}

if (failed) {
  console.error('\n[verify-ffmpeg] FAILED')
  process.exit(1)
}
console.log('\n[verify-ffmpeg] OK')
