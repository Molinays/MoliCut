#!/usr/bin/env node
/**
 * Minimal CycloneDX 1.5 SBOM generator (no network, no extra dependency).
 * Scans node_modules for installed packages and emits components with name,
 * version, license and purl. Attach the output to release artifacts.
 *
 * Usage: node scripts/sbom.mjs [--out sbom.cdx.json]
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outIndex = process.argv.indexOf('--out')
const out = outIndex > -1 ? resolve(process.argv[outIndex + 1]) : join(root, 'sbom.cdx.json')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

function licenseOf(meta) {
  if (!meta.license) return []
  if (typeof meta.license === 'string') return [{ license: { id: meta.license } }]
  if (meta.license.type) return [{ license: { id: meta.license.type } }]
  return []
}

const components = []
function walk(dir, depth = 0) {
  if (depth > 6 || !existsSync(dir)) return
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue
    const full = join(dir, entry)
    try {
      if (!statSync(full).isDirectory()) continue
      if (entry.startsWith('@')) {
        walk(full, depth + 1)
        continue
      }
      const metaPath = join(full, 'package.json')
      if (existsSync(metaPath)) {
        const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
        if (meta.name && meta.version) {
          components.push({
            type: 'library',
            name: meta.name,
            version: meta.version,
            purl: `pkg:npm/${meta.name.replace('@', '%40')}@${meta.version}`,
            licenses: licenseOf(meta),
            properties: [{ name: 'molicut:direct', value: String(Boolean(pkg.dependencies?.[meta.name] || pkg.devDependencies?.[meta.name])) }]
          })
        }
        walk(join(full, 'node_modules'), depth + 1)
      }
    } catch {
      /* unreadable package: skip, the SBOM is best effort over installed tree */
    }
  }
}
walk(join(root, 'node_modules'))

const deduped = [...new Map(components.map((c) => [`${c.name}@${c.version}`, c])).values()].sort((a, b) =>
  a.name.localeCompare(b.name)
)

const sbom = {
  bomFormat: 'CycloneDX',
  specVersion: '1.5',
  version: 1,
  metadata: {
    timestamp: new Date().toISOString(),
    tools: [{ vendor: 'MoliCut', name: 'scripts/sbom.mjs', version: '1' }],
    component: { type: 'application', name: pkg.name, version: pkg.version }
  },
  components: deduped
}

writeFileSync(out, `${JSON.stringify(sbom, null, 2)}\n`)
console.log(`[sbom] wrote ${out} (${deduped.length} components)`)
