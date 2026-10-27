import { createHash } from 'node:crypto'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import si from 'systeminformation'
import type { HardwareEncoder, HardwareProfile } from '@shared/schemas'
import { hardwareProfileSchema } from '@shared/schemas'
import { clamp, percentile, roundTo } from '@shared/utils'
import { getDb } from './db'
import { ffmpeg } from './ffmpeg'
import { backendsFromEncoders, encoderTestArgs, type BackendId } from './encoder'
import { logger } from './logger'
import { appPaths } from './paths'

export type ScanProgress = (stage: string, percent: number, message: string) => void

const KNOWN_HW_ENCODERS: Array<{ backend: Exclude<BackendId, 'software'>; encoders: Array<[string, string]> }> = [
  { backend: 'nvenc', encoders: [['h264_nvenc', 'h264'], ['hevc_nvenc', 'hevc'], ['av1_nvenc', 'av1']] },
  { backend: 'amf', encoders: [['h264_amf', 'h264'], ['hevc_amf', 'hevc'], ['av1_amf', 'av1']] },
  { backend: 'qsv', encoders: [['h264_qsv', 'h264'], ['hevc_qsv', 'hevc'], ['av1_qsv', 'av1']] },
  { backend: 'videotoolbox', encoders: [['h264_videotoolbox', 'h264'], ['hevc_videotoolbox', 'hevc']] },
  { backend: 'vaapi', encoders: [['h264_vaapi', 'h264'], ['hevc_vaapi', 'hevc'], ['av1_vaapi', 'av1']] }
]

function vendorKey(vendor: string): HardwareEncoder['vendor'] {
  const v = vendor.toLowerCase()
  if (v.includes('nvidia')) return 'nvidia'
  if (v.includes('amd') || v.includes('advanced micro')) return 'amd'
  if (v.includes('intel')) return 'intel'
  if (v.includes('apple')) return 'apple'
  return 'software'
}

function vendorApis(vendor: string): string[] {
  const v = vendor.toLowerCase()
  if (v.includes('nvidia')) return ['CUDA', 'Vulkan', 'DX12', 'OpenCL']
  if (v.includes('amd')) return ['Vulkan', 'DX12', 'OpenCL']
  if (v.includes('intel')) return ['Vulkan', 'DX12', 'OpenCL', 'QSV']
  if (v.includes('apple')) return ['Metal', 'Vulkan (MoltenVK)']
  return []
}

export class HardwareService {
  private profile: HardwareProfile | null = null
  private scanning: Promise<HardwareProfile> | null = null

  cachedProfile(): HardwareProfile | null {
    if (this.profile) return this.profile
    const row = getDb()
      .prepare('SELECT payload FROM hardware_profile ORDER BY scanned_at DESC LIMIT 1')
      .get<{ payload: string }>()
    if (!row) return null
    try {
      const parsed = hardwareProfileSchema.safeParse(JSON.parse(row.payload))
      if (parsed.success) {
        this.profile = parsed.data
        return parsed.data
      }
    } catch {
      /* corrupted cache: ignore */
    }
    return null
  }

  backends(): BackendId[] {
    const profile = this.cachedProfile()
    if (!profile) return ['software']
    // ffmpeg -encoders lists every encoder compiled into the build, including
    // NVENC/AMF/QSV on machines that do not have that GPU. Cross-check with the
    // detected GPU vendors; otherwise a machine can try (and fail) the wrong
    // backend. VAAPI is device-based, so it is validated by the 1s probe.
    const vendors = new Set(profile.gpus.map((gpu) => vendorKey(gpu.vendor)))
    const ids = profile.encoders
      .filter((encoder) => encoder.available)
      .filter((encoder) => {
        if (encoder.id === 'software' || encoder.id === 'vaapi') return true
        return vendors.has(encoder.vendor)
      })
      .map((encoder) => encoder.id as BackendId)
    const hardware = [...new Set(ids.filter((id) => id !== 'software'))]
    return hardware.length > 0 ? [...hardware, 'software'] : ['software']
  }

  private store(profile: HardwareProfile): void {
    this.profile = profile
    getDb()
      .prepare('INSERT INTO hardware_profile (hash, scanned_at, payload) VALUES (?, ?, ?)')
      .run(profile.hardwareHash, profile.scannedAt, JSON.stringify(profile))
    // keep only the last 3 profiles
    getDb()
      .prepare(
        'DELETE FROM hardware_profile WHERE hash NOT IN (SELECT hash FROM hardware_profile ORDER BY scanned_at DESC LIMIT 3)'
      )
      .run()
  }

  async scan(force: boolean, onProgress: ScanProgress = () => {}): Promise<HardwareProfile> {
    if (!force) {
      const cached = this.cachedProfile()
      if (cached) {
        onProgress('cache', 100, 'Profilo hardware in cache')
        return cached
      }
    }
    if (this.scanning) return this.scanning
    this.scanning = this.doScan(onProgress).finally(() => {
      this.scanning = null
    })
    return this.scanning
  }

  private async doScan(onProgress: ScanProgress): Promise<HardwareProfile> {
    onProgress('cpu', 5, 'Lettura CPU e memoria')
    const [cpu, mem, osInfo, graphics, fsSize, layouts] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.graphics(),
      si.fsSize(),
      si.diskLayout().catch(() => [])
    ])

    onProgress('gpu', 25, 'Rilevamento GPU')
    const gpus = (graphics.controllers ?? []).map((gpu) => ({
      model: gpu.model ?? 'GPU sconosciuta',
      vendor: gpu.vendor ?? 'unknown',
      vramMB: Math.round(gpu.vram ?? 0),
      driverVersion: gpu.driverVersion ?? 'unknown',
      api: vendorApis(`${gpu.vendor ?? ''} ${gpu.model ?? ''}`)
    }))

    const hash = createHash('sha256')
      .update(
        [
          process.platform,
          process.arch,
          cpu.manufacturer,
          cpu.brand,
          String(cpu.cores),
          String(Math.round(mem.total / 1024 ** 3)),
          ...gpus.map((g) => `${g.vendor}:${g.model}:${g.vramMB}`),
          osInfo.platform,
          osInfo.release
        ].join('|')
      )
      .digest('hex')
      .slice(0, 32)

    onProgress('ffmpeg', 45, 'Interrogazione FFmpeg (-encoders, -hwaccels)')
    const [encoders, hwaccels] = await Promise.all([ffmpeg.listEncoders(), ffmpeg.listHwaccels()])

    onProgress('strategy', 70, 'Calcolo strategia di accelerazione')
    const detected: HardwareEncoder[] = []
    for (const { backend, encoders: candidates } of KNOWN_HW_ENCODERS) {
      const availableCodecs = candidates.filter(([id]) => encoders.includes(id)).map(([, codec]) => codec)
      if (availableCodecs.length === 0) continue
      detected.push({
        id: backend,
        name:
          backend === 'nvenc'
            ? 'NVIDIA NVENC'
            : backend === 'amf'
              ? 'AMD AMF'
              : backend === 'qsv'
                ? 'Intel Quick Sync'
                : backend === 'videotoolbox'
                  ? 'Apple VideoToolbox'
                  : 'VAAPI',
        vendor: backend === 'nvenc' ? 'nvidia' : backend === 'amf' ? 'amd' : backend === 'qsv' ? 'intel' : backend === 'videotoolbox' ? 'apple' : vendorKey(gpus[0]?.vendor ?? ''),
        available: true,
        codecs: availableCodecs,
        testedOk: null,
        testDetail: null
      })
    }
    detected.push({
      id: 'software',
      name: 'Software (CPU)',
      vendor: 'software',
      available: encoders.includes('libx264') || encoders.length > 0,
      codecs: ['h264', 'hevc', 'av1', 'vp9', 'prores', 'dnxhr'].filter((c) =>
        encoders.some((e) => e.includes(c.replace('h264', 'x264').replace('hevc', 'x265')))
      ),
      testedOk: true,
      testDetail: null
    })

    const ordered = backendsFromEncoders(encoders)
    const preferred = ordered.find((b) => b !== 'software') ?? 'software'
    const notes: string[] = []
    if (preferred === 'software') {
      notes.push('Nessun encoder hardware rilevato: export e preview useranno la CPU (fallback esplicito).')
    } else {
      notes.push(`Backend preferito: ${preferred}. Selezione automatica all'avvio; override manuale nelle Impostazioni.`)
    }
    if (gpus.length > 0 && preferred === 'software') {
      notes.push('GPU presente ma senza encoder supportati da FFmpeg su questa build.')
    }
    if (!existsSync(ffmpeg.binaries().ffmpeg.path ?? '')) {
      notes.push('Binario FFmpeg non trovato: esegui npm run fetch:ffmpeg o installa FFmpeg nel PATH.')
    }
    if (process.env.MOLICUT_SAFE_MODE === '1') notes.push('Safe mode attivo: accelerazione hardware disabilitata.')

    const disks = (fsSize ?? [])
      .filter((d) => d.size > 0)
      .slice(0, 8)
      .map((d) => {
        const layout = (layouts ?? []).find((l) => l.device && d.mount && l.device.includes(d.mount.replace('/dev/', '')))
        const kindRaw = String((layout as { type?: string } | undefined)?.type ?? '').toLowerCase()
        return {
          mount: d.mount ?? '?',
          fs: d.fs ?? '?',
          sizeGB: roundTo(d.size / 1024 ** 3, 1),
          freeGB: roundTo(d.available / 1024 ** 3, 1),
          kind: (kindRaw.includes('ssd') ? 'ssd' : kindRaw.includes('hdd') ? 'hdd' : 'unknown') as 'ssd' | 'hdd' | 'unknown'
        }
      })

    const memoryTotalGB = roundTo(mem.total / 1024 ** 3, 1)
    const physicalCores = cpu.physicalCores ?? cpu.cores ?? 4
    const recommendedConcurrency = clamp(Math.floor(physicalCores / 4), 1, 4)

    const profile: HardwareProfile = {
      hardwareHash: hash,
      scannedAt: new Date().toISOString(),
      platform: process.platform,
      arch: process.arch,
      cpu: {
        manufacturer: cpu.manufacturer ?? 'unknown',
        brand: cpu.brand ?? 'unknown',
        cores: cpu.cores ?? 0,
        physicalCores,
        speedGHz: roundTo(cpu.speed ?? 0, 2),
        flags: (cpu.flags ?? '').split(' ').filter((f) => /^(avx|avx2|avx512|sse4|fma)/.test(f)).slice(0, 12)
      },
      memoryTotalGB,
      memoryFreeGB: roundTo(mem.available / 1024 ** 3, 1),
      gpus,
      disks,
      os: {
        platform: osInfo.platform ?? process.platform,
        distro: osInfo.distro ?? '',
        release: osInfo.release ?? '',
        kernel: osInfo.kernel ?? '',
        build: osInfo.build ?? ''
      },
      encoders: detected,
      hwaccels,
      acceleration: {
        preferredBackend: preferred,
        hardwareAvailable: preferred !== 'software',
        webgpu: process.env.MOLICUT_DISABLE_GPU !== '1',
        webgl2: true,
        recommendedConcurrency,
        notes
      }
    }

    onProgress('persist', 95, 'Salvataggio profilo hardware')
    this.store(profile)
    onProgress('done', 100, 'Scansione completata')
    logger.info(
      'hardware',
      `scan complete: cpu=${profile.cpu.brand} gpu=${profile.gpus.map((g) => g.model).join(', ') || 'none'} backend=${preferred}`
    )
    return profile
  }

  async testEncoder(encoderId: string, codec: 'h264' | 'hevc' | 'av1'): Promise<{ ok: boolean; fps: number | null; detail: string; ms: number }> {
    const started = Date.now()
    const args = encoderTestArgs(encoderId, codec)
    try {
      const result = await ffmpeg.runFfmpeg(args, { timeoutMs: 30000 })
      const ms = Date.now() - started
      if (result.code !== 0) {
        return { ok: false, fps: null, detail: lastError(result.stderr), ms }
      }
      const fpsMatch = /fps=\s*([\d.]+)/g
      let fps: number | null = null
      let match: RegExpExecArray | null
      while ((match = fpsMatch.exec(result.stderr)) !== null) fps = Number(match[1])
      if (fps === null) fps = roundTo(30 / (ms / 1000), 1)
      this.markTested(encoderId, true, `ok in ${ms}ms, ${fps} fps`)
      return { ok: true, fps, detail: `Encode 1s completato in ${ms}ms`, ms }
    } catch (err) {
      return { ok: false, fps: null, detail: (err as Error).message, ms: Date.now() - started }
    }
  }

  private markTested(encoderId: string, ok: boolean, detail: string): void {
    const profile = this.cachedProfile()
    if (!profile) return
    const enc = profile.encoders.find((e) => e.id === encoderId)
    if (!enc) return
    enc.testedOk = ok
    enc.testDetail = detail
    profile.scannedAt = new Date().toISOString()
    this.store(profile)
  }

  async benchmark(): Promise<{
    at: string
    cpuScore: number
    gpuScore: number | null
    diskReadMBs: number
    diskWriteMBs: number
    renderFps: number | null
    durationMs: number
    details: string[]
  }> {
    const started = Date.now()
    const details: string[] = []
    const samples: number[] = []
    const deadline = Date.now() + 450
    let iterations = 0
    while (Date.now() < deadline) {
      const t0 = performance.now()
      createHash('sha256').update(`molicut-${iterations}`).digest('hex')
      samples.push(performance.now() - t0)
      iterations++
    }
    const avgMs = samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length)
    const p95 = percentile(samples, 95)
    const cpuScore = Math.round(10000 / Math.max(0.01, p95))
    details.push(`CPU hash: ${iterations} ops in 450ms, avg ${roundTo(avgMs, 3)}ms, p95 ${roundTo(p95, 3)}ms`)

    const testFile = join(appPaths().temp, `bench-${Date.now()}.bin`)
    const block = Buffer.alloc(1024 * 1024, 7)
    let diskWriteMBs = 0
    let diskReadMBs = 0
    try {
      const t0 = performance.now()
      const fd = await import('node:fs/promises')
      const handle = await fd.open(testFile, 'w')
      for (let i = 0; i < 32; i++) await handle.write(block)
      await handle.close()
      const writeMs = performance.now() - t0
      diskWriteMBs = roundTo(32 / (writeMs / 1000), 1)
      const t1 = performance.now()
      const data = readFileSync(testFile)
      const readMs = performance.now() - t1
      diskReadMBs = roundTo(data.byteLength / 1024 ** 2 / (readMs / 1000), 1)
      unlinkSync(testFile)
      details.push(`Disco: ${diskWriteMBs} MB/s write, ${diskReadMBs} MB/s read (32 MB)`)
    } catch (err) {
      details.push(`Disco: benchmark non disponibile (${(err as Error).message})`)
    }
    void tmpdir

    let renderFps: number | null = null
    try {
      const res = await ffmpeg.runFfmpeg(
        ['-f', 'lavfi', '-i', 'testsrc2=size=1920x1080:rate=30:duration=2', '-c:v', 'libx264', '-preset', 'veryfast', '-f', 'null', '-'],
        { timeoutMs: 60000 }
      )
      if (res.code === 0) {
        const matches = [...res.stderr.matchAll(/fps=\s*([\d.]+)/g)]
        const last = matches[matches.length - 1]
        renderFps = last ? roundTo(Number(last[1]), 1) : null
        details.push(`Encode CPU 1080p: ${renderFps ?? 'n/d'} fps (libx264 veryfast)`)
      }
    } catch {
      details.push('Encode benchmark non disponibile (FFmpeg assente)')
    }

    return {
      at: new Date().toISOString(),
      cpuScore,
      gpuScore: null,
      diskReadMBs,
      diskWriteMBs,
      renderFps,
      durationMs: Date.now() - started,
      details
    }
  }
}

function lastError(stderr: string): string {
  const lines = stderr.split(/\r?\n/).filter((l) => l.trim().length > 0)
  return lines.slice(-6).join(' | ').slice(0, 2000)
}

export const hardware = new HardwareService()
export { lastError }
