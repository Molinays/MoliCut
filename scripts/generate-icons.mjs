#!/usr/bin/env node
// Dependency-free PNG generator so the repo ships a real icon and CI does not
// need ImageMagick. Produces resources/icon.png (512x512, RGBA).
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SIZE = 512
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) {
    c ^= byte
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function inRoundedRect(x, y, left, top, right, bottom, radius) {
  if (x < left || x > right || y < top || y > bottom) return false
  const cx = Math.max(left + radius, Math.min(x, right - radius))
  const cy = Math.max(top + radius, Math.min(y, bottom - radius))
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))
  const x = x1 + t * dx
  const y = y1 + t * dy
  return Math.hypot(px - x, py - y)
}

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1))
const r = 112
for (let y = 0; y < SIZE; y++) {
  const rowStart = y * (SIZE * 4 + 1)
  raw[rowStart] = 0
  for (let x = 0; x < SIZE; x++) {
    const offset = rowStart + 1 + x * 4
    let rgba = [0, 0, 0, 0]
    if (inRoundedRect(x, y, 8, 8, SIZE - 8, SIZE - 8, r)) {
      const t = (x + y) / (SIZE * 2)
      const r1 = 30
      const g1 = 34
      const b1 = 44
      const r2 = 10
      const g2 = 12
      const b2 = 17
      rgba = [
        Math.round(r1 + (r2 - r1) * t),
        Math.round(g1 + (g2 - g1) * t),
        Math.round(b1 + (b2 - b1) * t),
        255
      ]
      // MoliCut "M": two stems plus two diagonals meeting above the baseline.
      const isM =
        inRoundedRect(x, y, 138, 126, 184, 392, 14) ||
        inRoundedRect(x, y, 328, 126, 374, 392, 14) ||
        distToSegment(x, y, 160, 134, 256, 276) < 19 ||
        distToSegment(x, y, 352, 134, 256, 276) < 19
      if (isM) rgba = [244, 247, 255, 255]
    }
    raw[offset] = rgba[0]
    raw[offset + 1] = rgba[1]
    raw[offset + 2] = rgba[2]
    raw[offset + 3] = rgba[3]
  }
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(SIZE, 0)
ihdr.writeUInt32BE(SIZE, 4)
ihdr[8] = 8
ihdr[9] = 6
ihdr[10] = 0
ihdr[11] = 0
ihdr[12] = 0
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
])

mkdirSync(resolve(root, 'resources'), { recursive: true })
writeFileSync(resolve(root, 'resources/icon.png'), png)
console.log(`wrote resources/icon.png (${png.length} bytes)`)
