"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_fs = require("node:fs");
const node_path = require("node:path");
const electron = require("electron");
const AdmZip = require("adm-zip");
const si = require("systeminformation");
const zod = require("zod");
const node_crypto = require("node:crypto");
const node_stream = require("node:stream");
const node_module = require("node:module");
const node_child_process = require("node:child_process");
const os = require("node:os");
const node_url = require("node:url");
const chokidar = require("chokidar");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const os__namespace = /* @__PURE__ */ _interopNamespaceDefault(os);
function uid(prefix = "id") {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && "randomUUID" in cryptoObj) return `${prefix}_${cryptoObj.randomUUID().slice(0, 8)}`;
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function roundTo(value, decimals = 2) {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}
function formatTimecode(seconds, fps = 30) {
  const safe = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const totalFrames = Math.round(safe * fps);
  const frames = totalFrames % Math.round(fps);
  const totalSeconds = Math.floor(totalFrames / fps);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}:${p(frames)}`;
}
function globToRegExp(pattern) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`, "i");
}
function basenameNoExt(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  const base = normalized.split("/").pop() ?? normalized;
  const dot = base.lastIndexOf(".");
  return dot > 0 ? base.slice(0, dot) : base;
}
function computeWaveformPeaks(samples, buckets2) {
  if (samples.length === 0 || buckets2 <= 0) return [];
  const out = [];
  const size = Math.max(1, Math.floor(samples.length / buckets2));
  for (let b = 0; b < buckets2; b++) {
    const start = b * size;
    const end = Math.min(samples.length, start + size);
    let peak = 0;
    for (let i = start; i < end; i++) {
      const v = Math.abs(samples[i] ?? 0);
      if (v > peak) peak = v;
    }
    out.push(roundTo(peak, 3));
  }
  return out;
}
function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = clamp(Math.floor(p / 100 * (sorted.length - 1)), 0, sorted.length - 1);
  return sorted[index] ?? 0;
}
function csvEscape(value) {
  const s = value === null || value === void 0 ? "" : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(rows, columns) {
  if (rows.length === 0) return "";
  const cols = columns ?? Object.keys(rows[0] ?? {});
  const header = cols.map(csvEscape).join(",");
  const body = rows.map((row) => cols.map((c) => csvEscape(row[c])).join(",")).join("\n");
  return `${header}
${body}`;
}
function redactSensitive(input) {
  let out = input;
  out = out.replace(/[A-Z]:\\Users\\[^\\\s"']+/gi, "%USERPROFILE%");
  out = out.replace(/\/Users\/[^/\s"']+/g, "/Users/%USER%");
  out = out.replace(/\/home\/[^/\s"']+/g, "/home/%USER%");
  out = out.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "%EMAIL%");
  out = out.replace(/\b(Bearer)\s+[A-Za-z0-9\-._~+/]+=*/gi, "$1 %TOKEN%");
  out = out.replace(/\b(api[_-]?key|token|secret|password)\b\s*[:=]\s*("[^"]*"|'[^']*'|\S+)/gi, "$1=%REDACTED%");
  out = out.replace(/\b[A-Fa-f0-9]{32,}\b/g, "%HASH%");
  return out;
}
const IPC_CHANNEL_LIST = [
  "app:info",
  "settings:get",
  "settings:set",
  "settings:reset",
  "project:new",
  "project:open",
  "project:openDialog",
  "project:save",
  "project:autosave",
  "project:recoverAutosave",
  "project:recent",
  "project:exportInterchange",
  "media:importDialog",
  "media:importPaths",
  "media:probe",
  "media:thumbnail",
  "media:waveform",
  "media:relink",
  "media:chooseRelink",
  "media:missing",
  "queue:list",
  "queue:add",
  "queue:action",
  "queue:reorder",
  "queue:setPriority",
  "queue:setConcurrency",
  "queue:openWindow",
  "queue:exportReport",
  "presets:list",
  "presets:save",
  "presets:delete",
  "presets:export",
  "presets:import",
  "presets:suggest",
  "watch:list",
  "watch:add",
  "watch:update",
  "watch:remove",
  "watch:logs",
  "watch:test",
  "system:profile",
  "system:scan",
  "system:benchmark",
  "system:testEncoder",
  "deps:status",
  "deps:download",
  "debug:logs",
  "debug:clientError",
  "debug:ipcStats",
  "debug:metrics",
  "debug:action",
  "debug:bundle",
  "window:control",
  "shell:reveal",
  "updater:check",
  "updater:install",
  "plugins:list",
  "plugins:install",
  "plugins:toggle"
];
const PROJECT_SCHEMA_VERSION = 1;
const idSchema = zod.z.string().min(1).max(96);
const pathSchema = zod.z.string().min(1).max(4096).refine((value) => /^[a-zA-Z]:[\\/]/.test(value) || value.startsWith("/") || value.startsWith("\\\\"), {
  message: "Il path deve essere assoluto"
});
const keyframeSchema = zod.z.object({
  id: idSchema,
  time: zod.z.number().min(0),
  value: zod.z.number(),
  easing: zod.z.enum(["linear", "easeIn", "easeOut", "easeInOut", "bezier"]),
  cubic: zod.z.tuple([zod.z.number(), zod.z.number(), zod.z.number(), zod.z.number()]).optional()
});
const transformSchema = zod.z.object({
  x: zod.z.number().min(-1e5).max(1e5),
  y: zod.z.number().min(-1e5).max(1e5),
  scale: zod.z.number().min(0.01).max(20),
  rotation: zod.z.number().min(-3600).max(3600),
  opacity: zod.z.number().min(0).max(1)
});
const effectSchema = zod.z.object({
  id: idSchema,
  type: zod.z.string().min(1).max(80),
  enabled: zod.z.boolean(),
  params: zod.z.record(zod.z.union([zod.z.number(), zod.z.string(), zod.z.boolean()])),
  keyframes: zod.z.record(zod.z.array(keyframeSchema)).optional()
});
const clipTextSchema = zod.z.object({
  content: zod.z.string().max(2e3),
  fontSize: zod.z.number().min(8).max(400),
  color: zod.z.string().max(32),
  align: zod.z.enum(["left", "center", "right"]),
  /** Normalised position in the sequence frame (0..1). */
  x: zod.z.number().min(0).max(1),
  y: zod.z.number().min(0).max(1),
  background: zod.z.boolean()
});
const clipSchema = zod.z.object({
  id: idSchema,
  name: zod.z.string().min(1).max(512),
  trackId: idSchema,
  mediaId: idSchema.nullable(),
  start: zod.z.number().min(0),
  duration: zod.z.number().min(1e-3),
  inPoint: zod.z.number().min(0),
  speed: zod.z.number().min(0.05).max(20),
  color: zod.z.string().max(32),
  volume: zod.z.number().min(0).max(4),
  transform: transformSchema,
  effects: zod.z.array(effectSchema).max(128),
  keyframes: zod.z.record(zod.z.array(keyframeSchema)).optional(),
  label: zod.z.string().max(64).optional(),
  nestedSequenceId: idSchema.nullable().optional(),
  // Shared by an imported A/V pair: the picture clip and its audio twin form
  // one edit unit — move/trim/split/delete/duplicate propagate across it.
  linkId: idSchema.optional(),
  // Title/generator clip: mediaId is null and this payload is rendered by the
  // preview overlay and by the timeline export's drawtext chain.
  text: clipTextSchema.optional()
});
const trackSchema = zod.z.object({
  id: idSchema,
  kind: zod.z.enum(["video", "audio", "subtitle", "adjustment", "nested"]),
  name: zod.z.string().min(1).max(96),
  height: zod.z.number().min(28).max(240),
  mute: zod.z.boolean(),
  solo: zod.z.boolean(),
  locked: zod.z.boolean(),
  volume: zod.z.number().min(0).max(4),
  pan: zod.z.number().min(-1).max(1),
  clips: zod.z.array(clipSchema).max(5e3)
});
const markerSchema = zod.z.object({
  id: idSchema,
  time: zod.z.number().min(0),
  label: zod.z.string().max(256),
  color: zod.z.string().max(32)
});
const sequenceSchema = zod.z.object({
  id: idSchema,
  name: zod.z.string().min(1).max(200),
  width: zod.z.number().int().min(16).max(16384),
  height: zod.z.number().int().min(16).max(16384),
  fps: zod.z.number().min(1).max(480),
  duration: zod.z.number().min(0),
  colorSpace: zod.z.enum(["rec709", "rec2020", "p3", "aces"]),
  tracks: zod.z.array(trackSchema).max(64),
  markers: zod.z.array(markerSchema).max(500)
});
const mediaAssetSchema = zod.z.object({
  id: idSchema,
  path: pathSchema,
  name: zod.z.string().min(1).max(512),
  kind: zod.z.enum(["video", "audio", "image"]),
  durationSec: zod.z.number().min(0),
  width: zod.z.number().int().min(0),
  height: zod.z.number().int().min(0),
  fps: zod.z.number().min(0),
  codec: zod.z.string().max(80),
  audioCodec: zod.z.string().max(80),
  channels: zod.z.number().int().min(0).max(64),
  sampleRate: zod.z.number().int().min(0).max(384e3),
  bitrate: zod.z.number().min(0),
  colorSpace: zod.z.string().max(80),
  // Raw ffprobe stream color metadata (matrix/primaries/range), optional for
  // backward compatibility with projects saved before it was recorded.
  colorMatrix: zod.z.string().max(80).optional(),
  colorPrimaries: zod.z.string().max(80).optional(),
  colorRange: zod.z.string().max(20).optional(),
  rotation: zod.z.number().min(-360).max(360),
  isHDR: zod.z.boolean(),
  timecode: zod.z.string().max(80).nullable(),
  fileSize: zod.z.number().min(0),
  proxyPath: zod.z.string().max(4096).nullable(),
  thumbnailPath: zod.z.string().max(4096).nullable(),
  status: zod.z.enum(["online", "offline", "processing", "error"]),
  importedAt: zod.z.string()
});
const projectSchema = zod.z.object({
  schemaVersion: zod.z.literal(PROJECT_SCHEMA_VERSION),
  id: idSchema,
  name: zod.z.string().min(1).max(200),
  createdAt: zod.z.string(),
  modifiedAt: zod.z.string(),
  activeSequenceId: idSchema,
  sequences: zod.z.array(sequenceSchema).min(1).max(64),
  media: zod.z.array(mediaAssetSchema).max(1e4),
  notes: zod.z.string().max(2e4).optional()
});
const videoCodecSchema = zod.z.enum(["h264", "hevc", "av1", "vp9", "prores", "dnxhr", "gif", "png", "mjpeg", "none"]);
const encoderPolicySchema = zod.z.enum(["auto", "hardware", "software"]);
const colorSpaceSchema = zod.z.enum(["rec709", "rec2020", "p3", "aces"]);
const hdrSchema = zod.z.enum(["none", "hdr10", "hlg"]);
const videoSettingsSchema = zod.z.object({
  codec: videoCodecSchema,
  encoderPolicy: encoderPolicySchema,
  width: zod.z.number().int().min(16).max(16384).nullable(),
  height: zod.z.number().int().min(16).max(16384).nullable(),
  fps: zod.z.number().min(1).max(480).nullable(),
  bitrateMode: zod.z.enum(["cbr", "vbr", "crf"]),
  bitrateKbps: zod.z.number().int().min(64).max(8e5),
  crf: zod.z.number().int().min(0).max(63),
  gopSeconds: zod.z.number().min(0.1).max(30),
  preset: zod.z.string().max(32),
  profile: zod.z.string().max(32).nullable(),
  pixelFormat: zod.z.string().max(32),
  colorSpace: colorSpaceSchema,
  hdr: hdrSchema,
  hdrMastering: zod.z.object({
    maxLuminance: zod.z.number().min(1).max(1e4),
    minLuminance: zod.z.number().min(0).max(1),
    maxCLL: zod.z.number().min(0).max(1e4),
    maxFALL: zod.z.number().min(0).max(1e4)
  }).optional()
});
const audioSettingsSchema = zod.z.object({
  codec: zod.z.enum(["aac", "mp3", "pcm_s16le", "pcm_s24le", "opus", "none"]),
  bitrateKbps: zod.z.number().int().min(32).max(8192),
  channels: zod.z.number().int().min(1).max(32),
  sampleRate: zod.z.number().int().min(8e3).max(384e3),
  loudness: zod.z.object({
    enabled: zod.z.boolean(),
    targetLufs: zod.z.number().min(-40).max(0),
    truePeakDb: zod.z.number().min(-9).max(0),
    lra: zod.z.number().min(1).max(50)
  })
});
const filterSettingsSchema = zod.z.object({
  lut: zod.z.string().max(4096).nullable(),
  burnSubtitles: zod.z.boolean(),
  subtitlePath: zod.z.string().max(4096).nullable(),
  scaleMode: zod.z.enum(["fit", "fill", "stretch"]),
  colorConversion: zod.z.boolean()
});
const encodePresetSchema = zod.z.object({
  id: idSchema,
  name: zod.z.string().min(1).max(120),
  description: zod.z.string().max(2e3),
  container: zod.z.enum(["mp4", "mov", "mkv", "webm", "wav", "mp3", "gif", "image2"]),
  video: videoSettingsSchema,
  audio: audioSettingsSchema,
  filters: filterSettingsSchema,
  output: zod.z.object({ suffix: zod.z.string().max(64), directory: zod.z.string().max(4096).nullable() }),
  tags: zod.z.array(zod.z.string().max(32)).max(20),
  version: zod.z.number().int().min(1),
  builtin: zod.z.boolean(),
  createdAt: zod.z.string(),
  updatedAt: zod.z.string()
});
const jobStateSchema = zod.z.enum(["queued", "running", "paused", "done", "error", "canceled"]);
const jobMetricsSchema = zod.z.object({
  avgFps: zod.z.number().min(0),
  encodedFrames: zod.z.number().min(0),
  durationMs: zod.z.number().min(0),
  outputBytes: zod.z.number().min(0),
  speed: zod.z.number().min(0)
});
const queueJobSchema = zod.z.object({
  id: idSchema,
  name: zod.z.string().min(1).max(300),
  sourcePath: pathSchema,
  sourceMediaId: idSchema.nullable(),
  sequenceId: idSchema.nullable(),
  /** Set for timeline exports: the exact project snapshot to render. */
  timeline: zod.z.object({
    project: projectSchema,
    sequenceId: idSchema
  }).nullable().optional(),
  preset: encodePresetSchema,
  outputPath: pathSchema,
  durationSec: zod.z.number().min(0),
  hasAudio: zod.z.boolean(),
  state: jobStateSchema,
  priority: zod.z.number().int().min(0).max(100),
  progress: zod.z.number().min(0).max(100),
  fps: zod.z.number().min(0),
  speed: zod.z.number().min(0),
  etaSec: zod.z.number().min(0),
  sizeBytes: zod.z.number().min(0),
  attempts: zod.z.number().int().min(0),
  maxRetries: zod.z.number().int().min(0).max(20),
  error: zod.z.string().max(8e3).nullable(),
  logs: zod.z.array(zod.z.string().max(4e3)).max(2e3),
  groupId: zod.z.string().max(96).nullable(),
  metrics: jobMetricsSchema,
  createdAt: zod.z.string(),
  startedAt: zod.z.string().nullable(),
  finishedAt: zod.z.string().nullable(),
  nextAttemptAt: zod.z.string().nullable()
});
const addJobInputSchema = zod.z.object({
  sourcePath: pathSchema.optional(),
  name: zod.z.string().min(1).max(300).optional(),
  mediaId: idSchema.nullable().optional(),
  sequenceId: idSchema.nullable().optional(),
  /** Timeline export: render the whole sequence instead of a single media file. */
  timeline: zod.z.object({
    project: projectSchema,
    sequenceId: idSchema
  }).optional(),
  presetId: idSchema.optional(),
  preset: encodePresetSchema.optional(),
  outputPath: pathSchema.optional(),
  durationSec: zod.z.number().min(0).optional(),
  hasAudio: zod.z.boolean().optional(),
  priority: zod.z.number().int().min(0).max(100).default(50),
  groupId: zod.z.string().max(96).nullable().optional(),
  maxRetries: zod.z.number().int().min(0).max(20).default(3)
});
const watchFolderSchema = zod.z.object({
  id: idSchema,
  path: pathSchema,
  presetId: idSchema,
  outputDir: pathSchema,
  enabled: zod.z.boolean(),
  recursive: zod.z.boolean(),
  extensions: zod.z.array(zod.z.string().max(16)).min(1).max(40),
  namePattern: zod.z.string().max(300).nullable(),
  excludePattern: zod.z.string().max(300).nullable(),
  stabilityMs: zod.z.number().int().min(500).max(12e4),
  action: zod.z.enum(["queue", "proxy", "ignore"]),
  conflict: zod.z.enum(["suffix", "overwrite", "skip"]),
  dryRun: zod.z.boolean(),
  createdAt: zod.z.string()
});
const watchLogSchema = zod.z.object({
  at: zod.z.string(),
  folderId: idSchema,
  level: zod.z.enum(["info", "warn", "error"]),
  message: zod.z.string().max(2e3),
  file: zod.z.string().max(4096).optional()
});
const hardwareEncoderSchema = zod.z.object({
  id: zod.z.string().max(40),
  name: zod.z.string().max(120),
  vendor: zod.z.enum(["nvidia", "amd", "intel", "apple", "software"]),
  available: zod.z.boolean(),
  codecs: zod.z.array(zod.z.string().max(32)),
  testedOk: zod.z.boolean().nullable(),
  testDetail: zod.z.string().max(2e3).nullable()
});
const gpuInfoSchema = zod.z.object({
  model: zod.z.string().max(200),
  vendor: zod.z.string().max(100),
  vramMB: zod.z.number().min(0),
  driverVersion: zod.z.string().max(80),
  api: zod.z.array(zod.z.string().max(24))
});
const diskInfoSchema = zod.z.object({
  mount: zod.z.string().max(40),
  fs: zod.z.string().max(32),
  sizeGB: zod.z.number().min(0),
  freeGB: zod.z.number().min(0),
  kind: zod.z.enum(["ssd", "hdd", "unknown"])
});
const hardwareProfileSchema = zod.z.object({
  hardwareHash: zod.z.string(),
  scannedAt: zod.z.string(),
  platform: zod.z.string(),
  arch: zod.z.string(),
  cpu: zod.z.object({
    manufacturer: zod.z.string(),
    brand: zod.z.string(),
    cores: zod.z.number(),
    physicalCores: zod.z.number(),
    speedGHz: zod.z.number(),
    flags: zod.z.array(zod.z.string().max(32))
  }),
  memoryTotalGB: zod.z.number(),
  memoryFreeGB: zod.z.number(),
  gpus: zod.z.array(gpuInfoSchema),
  disks: zod.z.array(diskInfoSchema),
  os: zod.z.object({
    platform: zod.z.string(),
    distro: zod.z.string(),
    release: zod.z.string(),
    kernel: zod.z.string(),
    build: zod.z.string()
  }),
  encoders: zod.z.array(hardwareEncoderSchema),
  hwaccels: zod.z.array(zod.z.string().max(40)),
  acceleration: zod.z.object({
    preferredBackend: zod.z.string().max(40),
    hardwareAvailable: zod.z.boolean(),
    webgpu: zod.z.boolean(),
    webgl2: zod.z.boolean(),
    recommendedConcurrency: zod.z.number().int().min(1).max(16),
    notes: zod.z.array(zod.z.string().max(500)).max(40)
  })
});
const dependencyStatusSchema = zod.z.object({
  id: zod.z.string().max(40),
  name: zod.z.string().max(120),
  required: zod.z.boolean(),
  path: zod.z.string().max(4096).nullable(),
  version: zod.z.string().max(120).nullable(),
  expectedSha256: zod.z.string().max(128).nullable(),
  actualSha256: zod.z.string().max(128).nullable(),
  status: zod.z.enum(["ok", "missing", "corrupt", "unsupported"]),
  detail: zod.z.string().max(2e3)
});
const logEntrySchema = zod.z.object({
  id: zod.z.number(),
  at: zod.z.string(),
  level: zod.z.enum(["debug", "info", "warn", "error"]),
  scope: zod.z.string().max(64),
  message: zod.z.string().max(8e3)
});
const metricsSnapshotSchema = zod.z.object({
  at: zod.z.string(),
  cpuPercent: zod.z.number(),
  memoryUsedMB: zod.z.number(),
  memoryTotalMB: zod.z.number(),
  gpuPercent: zod.z.number().nullable(),
  renderCacheMB: zod.z.number(),
  activeWorkers: zod.z.number(),
  previewFps: zod.z.number(),
  droppedFrames: zod.z.number()
});
const settingsSchema = zod.z.object({
  theme: zod.z.enum(["dark", "light", "system"]),
  accent: zod.z.string().max(24),
  language: zod.z.enum(["it", "en"]),
  hardwareOverride: zod.z.enum(["auto", "nvidia", "amd", "intel", "apple", "vaapi", "software"]),
  previewQuality: zod.z.enum(["auto", "quarter", "half", "full"]),
  maxConcurrentJobs: zod.z.number().int().min(1).max(16),
  queueMaxJobs: zod.z.number().int().min(10).max(1e4),
  queueRetentionDays: zod.z.number().int().min(1).max(365),
  cpuLimitPercent: zod.z.number().int().min(10).max(100),
  memoryLimitMB: zod.z.number().int().min(512).max(262144),
  cacheSizeMB: zod.z.number().int().min(256).max(1048576),
  notifications: zod.z.boolean(),
  startMinimized: zod.z.boolean(),
  runAtLogin: zod.z.boolean(),
  shutdownAfterQueue: zod.z.boolean(),
  watchEnabled: zod.z.boolean(),
  autosaveSeconds: zod.z.number().int().min(5).max(600),
  telemetry: zod.z.literal(false),
  safeMode: zod.z.boolean(),
  /** When true and a GPU encoder exists, export never falls back to CPU. */
  gpuOnly: zod.z.boolean().default(true),
  shortcuts: zod.z.record(zod.z.string().max(40)),
  recentProjects: zod.z.array(zod.z.string().max(4096)).max(12)
});
const defaultSettings = {
  theme: "dark",
  accent: "#4f8dff",
  language: "it",
  hardwareOverride: "auto",
  previewQuality: "auto",
  maxConcurrentJobs: 1,
  queueMaxJobs: 500,
  queueRetentionDays: 30,
  cpuLimitPercent: 85,
  memoryLimitMB: 8192,
  cacheSizeMB: 4096,
  notifications: true,
  startMinimized: false,
  runAtLogin: false,
  shutdownAfterQueue: false,
  watchEnabled: true,
  autosaveSeconds: 120,
  telemetry: false,
  safeMode: false,
  gpuOnly: true,
  shortcuts: {
    "command.palette": "Ctrl+Shift+P",
    "debug.panel": "Ctrl+Shift+D",
    "timeline.split": "Ctrl+K",
    "timeline.rippleDelete": "Shift+Delete",
    "timeline.addTitle": "T",
    "timeline.snap": "S",
    "timeline.delete": "Delete",
    "playback.playPause": "Space",
    "project.save": "Ctrl+S",
    "project.saveAs": "Ctrl+Shift+S",
    "export.dialog": "Ctrl+M",
    "queue.window": "Ctrl+Shift+Q"
  },
  recentProjects: []
};
const empty = zod.z.object({}).strict();
const okSchema = zod.z.object({ ok: zod.z.literal(true) });
const queueStatsSchema = zod.z.object({
  queued: zod.z.number(),
  running: zod.z.number(),
  paused: zod.z.number(),
  done: zod.z.number(),
  error: zod.z.number(),
  canceled: zod.z.number(),
  total: zod.z.number(),
  progress: zod.z.number(),
  aggregateFps: zod.z.number()
});
const appInfoSchema = zod.z.object({
  name: zod.z.string(),
  version: zod.z.string(),
  electron: zod.z.string(),
  chrome: zod.z.string(),
  node: zod.z.string(),
  platform: zod.z.string(),
  arch: zod.z.string(),
  userDataPath: zod.z.string(),
  isPackaged: zod.z.boolean(),
  recoveredFromCrash: zod.z.boolean(),
  ffmpegAvailable: zod.z.boolean(),
  dbDriver: zod.z.string()
});
const benchmarkResultSchema = zod.z.object({
  at: zod.z.string(),
  cpuScore: zod.z.number(),
  gpuScore: zod.z.number().nullable(),
  diskReadMBs: zod.z.number(),
  diskWriteMBs: zod.z.number(),
  renderFps: zod.z.number().nullable(),
  durationMs: zod.z.number(),
  details: zod.z.array(zod.z.string())
});
const encoderTestSchema = zod.z.object({
  encoderId: zod.z.string(),
  ok: zod.z.boolean(),
  encodeFps: zod.z.number().nullable(),
  detail: zod.z.string(),
  durationMs: zod.z.number()
});
const pluginInfoSchema = zod.z.object({
  id: zod.z.string(),
  name: zod.z.string(),
  version: zod.z.string(),
  vendor: zod.z.string(),
  description: zod.z.string(),
  permissions: zod.z.array(zod.z.string()),
  enabled: zod.z.boolean(),
  signed: zod.z.boolean(),
  verified: zod.z.boolean(),
  path: zod.z.string()
});
const ipcStatsSchema = zod.z.object({
  channels: zod.z.array(
    zod.z.object({
      channel: zod.z.string(),
      calls: zod.z.number(),
      errors: zod.z.number(),
      avgMs: zod.z.number(),
      lastMs: zod.z.number(),
      lastAt: zod.z.string().nullable()
    })
  ),
  totalCalls: zod.z.number(),
  totalErrors: zod.z.number()
});
const ipcRoutes = {
  "app:info": { input: empty, output: appInfoSchema },
  "settings:get": { input: empty, output: zod.z.object({ settings: settingsSchema }) },
  "settings:set": {
    input: zod.z.object({ patch: settingsSchema.partial() }),
    output: zod.z.object({ settings: settingsSchema })
  },
  "settings:reset": { input: empty, output: zod.z.object({ settings: settingsSchema }) },
  "project:new": { input: zod.z.object({ name: zod.z.string().min(1).max(200) }), output: zod.z.object({ project: projectSchema }) },
  "project:open": {
    input: zod.z.object({ path: pathSchema.optional() }),
    output: zod.z.object({ project: projectSchema, path: zod.z.string() })
  },
  "project:openDialog": {
    input: empty,
    output: zod.z.object({ canceled: zod.z.boolean(), project: projectSchema.optional(), path: zod.z.string().optional() })
  },
  "project:save": {
    input: zod.z.object({ project: projectSchema, path: pathSchema.optional() }),
    output: zod.z.object({ path: zod.z.string(), savedAt: zod.z.string(), canceled: zod.z.boolean() })
  },
  "project:autosave": {
    input: zod.z.object({ project: projectSchema }),
    output: zod.z.object({ path: zod.z.string(), savedAt: zod.z.string() })
  },
  "project:recoverAutosave": {
    input: empty,
    output: zod.z.object({ project: projectSchema, path: zod.z.string(), savedAt: zod.z.string() }).nullable()
  },
  "project:recent": { input: empty, output: zod.z.object({ items: zod.z.array(zod.z.string()) }) },
  "project:exportInterchange": {
    input: zod.z.object({
      project: projectSchema,
      sequenceId: zod.z.string(),
      format: zod.z.enum(["edl", "fcpxml", "xml"])
    }),
    output: zod.z.object({ path: zod.z.string().nullable(), canceled: zod.z.boolean() })
  },
  "media:importDialog": {
    input: zod.z.object({ generateProxies: zod.z.boolean().default(false) }),
    output: zod.z.object({ assets: zod.z.array(mediaAssetSchema), canceled: zod.z.boolean() })
  },
  "media:importPaths": {
    input: zod.z.object({ paths: zod.z.array(pathSchema).min(1).max(200), generateProxies: zod.z.boolean().default(false) }),
    output: zod.z.object({ assets: zod.z.array(mediaAssetSchema) })
  },
  "media:probe": { input: zod.z.object({ path: pathSchema }), output: zod.z.object({ asset: mediaAssetSchema }) },
  "media:thumbnail": {
    input: zod.z.object({ path: pathSchema, timeSec: zod.z.number().min(0).max(86400).default(1) }),
    output: zod.z.object({ dataUrl: zod.z.string(), fromCache: zod.z.boolean() })
  },
  "media:waveform": {
    input: zod.z.object({ path: pathSchema, buckets: zod.z.number().int().min(64).max(16384).default(2048) }),
    output: zod.z.object({ peaks: zod.z.array(zod.z.number()), durationSec: zod.z.number() })
  },
  "media:relink": {
    input: zod.z.object({ assetId: zod.z.string(), newPath: pathSchema }),
    output: zod.z.object({ asset: mediaAssetSchema })
  },
  "media:chooseRelink": {
    input: zod.z.object({ assetId: zod.z.string(), name: zod.z.string().optional() }),
    output: zod.z.object({ asset: mediaAssetSchema.nullable(), canceled: zod.z.boolean() })
  },
  "media:missing": {
    input: zod.z.object({ paths: zod.z.array(pathSchema).max(1e4) }),
    output: zod.z.object({ missing: zod.z.array(zod.z.string()) })
  },
  "queue:list": {
    input: empty,
    output: zod.z.object({ jobs: zod.z.array(queueJobSchema), stats: queueStatsSchema, concurrency: zod.z.number() })
  },
  "queue:add": {
    input: zod.z.object({ items: zod.z.array(addJobInputSchema).min(1).max(500) }),
    output: zod.z.object({ jobs: zod.z.array(queueJobSchema) })
  },
  "queue:action": {
    input: zod.z.object({
      action: zod.z.enum([
        "pause",
        "resume",
        "cancel",
        "retry",
        "remove",
        "duplicate",
        "stop-after-current",
        "pause-all",
        "resume-all",
        "clear-finished"
      ]),
      jobId: zod.z.string().optional(),
      value: zod.z.boolean().optional()
    }),
    output: zod.z.object({ jobs: zod.z.array(queueJobSchema) })
  },
  "queue:reorder": {
    input: zod.z.object({ jobId: zod.z.string(), toIndex: zod.z.number().int().min(0).max(1e5) }),
    output: zod.z.object({ jobs: zod.z.array(queueJobSchema) })
  },
  "queue:setPriority": {
    input: zod.z.object({ jobId: zod.z.string(), priority: zod.z.number().int().min(0).max(100) }),
    output: zod.z.object({ jobs: zod.z.array(queueJobSchema) })
  },
  "queue:setConcurrency": {
    input: zod.z.object({ value: zod.z.number().int().min(1).max(16) }),
    output: zod.z.object({ jobs: zod.z.array(queueJobSchema) })
  },
  "queue:openWindow": { input: empty, output: okSchema },
  "queue:exportReport": {
    input: zod.z.object({ format: zod.z.enum(["json", "csv"]), jobIds: zod.z.array(zod.z.string()).optional() }),
    output: zod.z.object({ path: zod.z.string(), canceled: zod.z.boolean() })
  },
  "presets:list": { input: empty, output: zod.z.object({ presets: zod.z.array(encodePresetSchema) }) },
  "presets:save": { input: zod.z.object({ preset: encodePresetSchema }), output: zod.z.object({ preset: encodePresetSchema }) },
  "presets:delete": { input: zod.z.object({ id: zod.z.string() }), output: zod.z.object({ presets: zod.z.array(encodePresetSchema) }) },
  "presets:export": {
    input: zod.z.object({ ids: zod.z.array(zod.z.string()).optional() }),
    output: zod.z.object({ path: zod.z.string().nullable(), canceled: zod.z.boolean() })
  },
  "presets:import": {
    input: empty,
    output: zod.z.object({ presets: zod.z.array(encodePresetSchema), canceled: zod.z.boolean() })
  },
  "presets:suggest": {
    input: zod.z.object({ asset: mediaAssetSchema }),
    output: zod.z.object({ presets: zod.z.array(encodePresetSchema) })
  },
  "watch:list": { input: empty, output: zod.z.object({ folders: zod.z.array(watchFolderSchema) }) },
  "watch:add": {
    input: zod.z.object({ folder: watchFolderSchema.omit({ id: true, createdAt: true }) }),
    output: zod.z.object({ folder: watchFolderSchema })
  },
  "watch:update": { input: zod.z.object({ folder: watchFolderSchema }), output: zod.z.object({ folder: watchFolderSchema }) },
  "watch:remove": { input: zod.z.object({ id: zod.z.string() }), output: zod.z.object({ folders: zod.z.array(watchFolderSchema) }) },
  "watch:logs": {
    input: zod.z.object({ limit: zod.z.number().int().min(1).max(1e3).default(200) }),
    output: zod.z.object({ logs: zod.z.array(watchLogSchema) })
  },
  "watch:test": {
    input: zod.z.object({ id: zod.z.string() }),
    output: zod.z.object({ matches: zod.z.array(zod.z.string()), scanned: zod.z.number() })
  },
  "system:profile": { input: empty, output: zod.z.object({ profile: hardwareProfileSchema.nullable() }) },
  "system:scan": { input: zod.z.object({ force: zod.z.boolean().default(false) }), output: zod.z.object({ profile: hardwareProfileSchema }) },
  "system:benchmark": { input: empty, output: benchmarkResultSchema },
  "system:testEncoder": {
    input: zod.z.object({ encoderId: zod.z.string(), codec: zod.z.enum(["h264", "hevc", "av1"]) }),
    output: encoderTestSchema
  },
  "deps:status": { input: empty, output: zod.z.object({ dependencies: zod.z.array(dependencyStatusSchema) }) },
  "deps:download": {
    input: zod.z.object({ component: zod.z.enum(["ffmpeg", "ffprobe", "all"]) }),
    output: zod.z.object({ dependencies: zod.z.array(dependencyStatusSchema), detail: zod.z.string() })
  },
  "debug:logs": {
    input: zod.z.object({ level: zod.z.enum(["debug", "info", "warn", "error"]).optional(), limit: zod.z.number().int().min(1).max(5e3).default(500) }),
    output: zod.z.object({ logs: zod.z.array(logEntrySchema) })
  },
  "debug:clientError": {
    input: zod.z.object({
      message: zod.z.string().min(1).max(8e3),
      stack: zod.z.string().max(16e3).optional(),
      componentStack: zod.z.string().max(16e3).optional(),
      source: zod.z.string().max(200).optional()
    }),
    output: okSchema
  },
  "debug:ipcStats": { input: empty, output: ipcStatsSchema },
  "debug:metrics": { input: empty, output: metricsSnapshotSchema },
  "debug:action": {
    input: zod.z.object({
      action: zod.z.enum([
        "reset-cache",
        "regenerate-proxies",
        "flush-shaders",
        "restart-engine",
        "redetect-hardware",
        "repair-queue-db",
        "safe-mode-on",
        "safe-mode-off",
        "clear-logs"
      ]),
      confirmation: zod.z.boolean().optional()
    }),
    output: zod.z.object({ ok: zod.z.boolean(), detail: zod.z.string() })
  },
  "debug:bundle": { input: empty, output: zod.z.object({ path: zod.z.string() }) },
  "window:control": {
    input: zod.z.object({ action: zod.z.enum(["minimize", "maximize", "close", "toggle-devtools", "open-queue", "open-editor"]) }),
    output: okSchema
  },
  "shell:reveal": { input: zod.z.object({ path: pathSchema }), output: okSchema },
  "updater:check": { input: empty, output: zod.z.object({ status: zod.z.enum(["disabled", "checking", "none", "available", "error"]), version: zod.z.string().optional(), message: zod.z.string().optional() }) },
  "updater:install": { input: empty, output: okSchema },
  "plugins:list": { input: empty, output: zod.z.object({ plugins: zod.z.array(pluginInfoSchema) }) },
  "plugins:install": { input: zod.z.object({ path: pathSchema }), output: zod.z.object({ plugin: pluginInfoSchema }) },
  "plugins:toggle": { input: zod.z.object({ id: zod.z.string(), enabled: zod.z.boolean() }), output: zod.z.object({ plugins: zod.z.array(pluginInfoSchema) }) }
};
const ROUTE_KEYS = Object.keys(ipcRoutes);
if (ROUTE_KEYS.some((channel) => !IPC_CHANNEL_LIST.includes(channel))) {
  throw new Error("IPC contract contains channels missing from channelList.ts");
}
zod.z.enum([
  "VALIDATION",
  "UNAUTHORIZED",
  "RATE_LIMITED",
  "NOT_FOUND",
  "CONFLICT",
  "CANCELED",
  "FFMPEG",
  "INTERNAL"
]);
({
  "queue:changed": zod.z.object({ jobs: zod.z.array(queueJobSchema), stats: queueStatsSchema }),
  "queue:progress": zod.z.object({
    jobId: zod.z.string(),
    progress: zod.z.number(),
    fps: zod.z.number(),
    speed: zod.z.number(),
    etaSec: zod.z.number(),
    sizeBytes: zod.z.number()
  }),
  "queue:log": zod.z.object({ jobId: zod.z.string(), line: zod.z.string() }),
  "scan:progress": zod.z.object({ stage: zod.z.string(), percent: zod.z.number(), message: zod.z.string() }),
  toast: zod.z.object({
    kind: zod.z.enum(["info", "success", "warn", "error"]),
    message: zod.z.string(),
    action: zod.z.object({ label: zod.z.string(), channel: zod.z.string(), payload: zod.z.unknown() }).optional()
  }),
  "relink:request": zod.z.object({ mediaId: zod.z.string(), path: zod.z.string() }),
  "updater:status": zod.z.object({ status: zod.z.string(), version: zod.z.string().optional(), message: zod.z.string().optional() }),
  "settings:changed": zod.z.object({ settings: settingsSchema }),
  "media:proxy-ready": zod.z.object({ mediaId: zod.z.string(), proxyPath: zod.z.string() })
});
let cached = null;
function appPaths() {
  if (cached) return cached;
  const userData = electron.app.getPath("userData");
  cached = {
    userData,
    projects: node_path.join(userData, "projects"),
    cache: node_path.join(userData, "cache"),
    proxies: node_path.join(userData, "proxies"),
    thumbnails: node_path.join(userData, "thumbnails"),
    waveforms: node_path.join(userData, "waveforms"),
    logs: node_path.join(userData, "logs"),
    temp: node_path.join(userData, "tmp"),
    overlays: node_path.join(userData, "overlays"),
    backups: node_path.join(userData, "backups"),
    bin: node_path.join(userData, "bin")
  };
  return cached;
}
function ensureAppDirs() {
  const paths = appPaths();
  for (const dir of Object.values(paths)) {
    if (!node_fs.existsSync(dir)) node_fs.mkdirSync(dir, { recursive: true, mode: 448 });
  }
  return paths;
}
function ffmpegResourcesDir() {
  const packaged = node_path.join(process.resourcesPath, "ffmpeg");
  if (electron.app.isPackaged && node_fs.existsSync(packaged)) return packaged;
  return node_path.join(electron.app.getAppPath(), "ffmpeg", "bin");
}
function writableRoots() {
  const p = appPaths();
  const roots = [p.userData, p.projects, p.cache, p.proxies, p.thumbnails, p.waveforms, p.temp, p.backups, p.bin];
  try {
    roots.push(electron.app.getPath("videos"), electron.app.getPath("downloads"), electron.app.getPath("documents"));
  } catch {
  }
  return roots;
}
function defaultExportDir() {
  let root = "";
  try {
    root = electron.app.getPath("videos");
  } catch {
    root = "";
  }
  const dir = root ? node_path.join(root, "MoliCut") : node_path.join(appPaths().userData, "exports");
  if (!node_fs.existsSync(dir)) node_fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function databaseFile() {
  return node_path.join(appPaths().userData, "molicut.sqlite");
}
const LEVEL_WEIGHT = { debug: 10, info: 20, warn: 30, error: 40 };
const MAX_BUFFER = 4e3;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
class Logger {
  buffer = [];
  listeners = /* @__PURE__ */ new Set();
  seq = 0;
  minLevel = "debug";
  filePath = null;
  fileEnabled = true;
  configure(options) {
    if (options.fileEnabled !== void 0) this.fileEnabled = options.fileEnabled;
    if (options.minLevel) this.minLevel = options.minLevel;
  }
  ensureFile() {
    if (this.filePath) return this.filePath;
    const dir = appPaths().logs;
    if (!node_fs.existsSync(dir)) node_fs.mkdirSync(dir, { recursive: true });
    this.filePath = node_path.join(dir, "molicut.log");
    return this.filePath;
  }
  rotateIfNeeded(path) {
    try {
      if (node_fs.existsSync(path) && node_fs.statSync(path).size > MAX_FILE_BYTES) {
        node_fs.renameSync(path, node_path.join(appPaths().logs, `molicut-${Date.now()}.log`));
      }
    } catch {
    }
  }
  write(level, scope, message) {
    const clean = redactSensitive(message);
    const entry = {
      id: ++this.seq,
      at: (/* @__PURE__ */ new Date()).toISOString(),
      level,
      scope: scope.slice(0, 64),
      message: clean.slice(0, 8e3)
    };
    if (LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[this.minLevel]) {
      this.buffer.push(entry);
      if (this.buffer.length > MAX_BUFFER) this.buffer.splice(0, this.buffer.length - MAX_BUFFER);
      for (const listener of this.listeners) {
        try {
          listener(entry);
        } catch {
        }
      }
      if (process.env.NODE_ENV !== "test") {
        const line = `[${entry.at}] ${level.toUpperCase().padEnd(5)} ${scope}: ${clean}`;
        if (level === "error") console.error(line);
        else if (level === "warn") console.warn(line);
        else console.log(line);
      }
      if (this.fileEnabled) {
        try {
          const path = this.ensureFile();
          this.rotateIfNeeded(path);
          node_fs.appendFileSync(path, `[${entry.at}] ${level.toUpperCase().padEnd(5)} ${scope}: ${clean}
`, "utf8");
        } catch {
        }
      }
    }
    return entry;
  }
  debug(scope, message) {
    this.write("debug", scope, message);
  }
  info(scope, message) {
    this.write("info", scope, message);
  }
  warn(scope, message) {
    this.write("warn", scope, message);
  }
  error(scope, message) {
    this.write("error", scope, message);
  }
  recent(limit = 500, level) {
    const filtered = level ? this.buffer.filter((e) => LEVEL_WEIGHT[e.level] >= LEVEL_WEIGHT[level]) : this.buffer;
    return filtered.slice(-limit);
  }
  clear() {
    const hadFile = this.filePath;
    this.buffer = [];
    this.listeners.clear();
    this.filePath = hadFile;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  logPath() {
    return this.filePath;
  }
}
const logger = new Logger();
const MEDIA_SCHEME = "molicut-media";
let allowedMediaRoots = () => [];
function registerPrivilegedSchemes() {
  electron.protocol.registerSchemesAsPrivileged([
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
  ]);
}
const MIME = {
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
  ".webm": "video/webm",
  ".avi": "video/x-msvideo",
  ".mxf": "application/mxf",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".flac": "audio/flac",
  ".aac": "audio/aac",
  ".ogg": "audio/ogg",
  ".opus": "audio/opus",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".exr": "image/x-exr",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".lut": "text/plain",
  ".cube": "text/plain"
};
function isPathInside(parent, child) {
  const rel = node_path.relative(node_path.resolve(parent), node_path.resolve(child));
  if (rel === "") return true;
  return !rel.startsWith("..") && !rel.startsWith(`..${node_path.sep}`) && !node_path.isAbsolute(rel);
}
function safeRealPath(input) {
  if (input.includes("\0")) throw new Error("Invalid path: null byte");
  if (!node_path.isAbsolute(input)) throw new Error("Invalid path: must be absolute");
  let probe = node_path.resolve(input);
  const suffix = [];
  for (let i = 0; i < 64; i++) {
    try {
      const real = node_fs.realpathSync(probe);
      return suffix.length ? node_path.resolve(real, ...suffix.reverse()) : real;
    } catch {
      const parent = node_path.resolve(probe, "..");
      if (parent === probe) break;
      suffix.push(probe.slice(parent.length).replace(/^[\\/]/, ""));
      probe = parent;
    }
  }
  return node_path.resolve(input);
}
function assertInsideAnyRoot(filePath, roots) {
  const real = safeRealPath(filePath);
  const ok = roots.some((root) => isPathInside(safeRealPath(root), real));
  if (!ok) throw new Error("Path outside allowed roots");
  return real;
}
function assertWritablePath(filePath, extraRoots = []) {
  const real = safeRealPath(filePath);
  const blocklist = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
  const segments = real.split(/[\\/]/);
  if (segments.some((s) => blocklist.test(s))) throw new Error("Reserved device name in path");
  return assertInsideAnyRoot(real, [...writableRoots(), ...extraRoots]);
}
function setMediaRoots(provider) {
  allowedMediaRoots = provider;
}
function mediaRoots() {
  const paths = appPaths();
  return [paths.proxies, paths.thumbnails, paths.cache, paths.temp, ...allowedMediaRoots()];
}
function registerMediaProtocol() {
  electron.protocol.handle(MEDIA_SCHEME, async (request) => {
    try {
      const url = new URL(request.url);
      if (url.hostname !== "media") return new Response("Not found", { status: 404 });
      const raw = decodeURIComponent(url.pathname.replace(/^\//, ""));
      const filePath = assertInsideAnyRoot(raw, mediaRoots());
      const stat = node_fs.statSync(filePath);
      if (!stat.isFile()) return new Response("Not a file", { status: 404 });
      const type = MIME[node_path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
      const range = request.headers.get("range");
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
        if (!match) return new Response("Bad range", { status: 416 });
        const start = match[1] ? Number(match[1]) : 0;
        const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
        if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
          return new Response("Range not satisfiable", {
            status: 416,
            headers: { "Content-Range": `bytes */${stat.size}` }
          });
        }
        const stream2 = node_fs.createReadStream(filePath, { start, end });
        return new Response(node_stream.Readable.toWeb(stream2), {
          status: 206,
          headers: {
            "Content-Type": type,
            "Content-Length": String(end - start + 1),
            "Content-Range": `bytes ${start}-${end}/${stat.size}`,
            "Accept-Ranges": "bytes",
            "Cache-Control": "no-store"
          }
        });
      }
      const stream = node_fs.createReadStream(filePath);
      return new Response(node_stream.Readable.toWeb(stream), {
        status: 200,
        headers: {
          "Content-Type": type,
          "Content-Length": String(stat.size),
          "Accept-Ranges": "bytes",
          "Cache-Control": "no-store"
        }
      });
    } catch (err) {
      logger.warn("security", `media protocol rejected: ${err.message}`);
      return new Response("Forbidden", { status: 403 });
    }
  });
}
function contentSecurityPolicy() {
  const dev = !electron.app.isPackaged;
  const scriptExtra = dev ? " 'unsafe-inline' 'unsafe-eval'" : "";
  const connectExtra = dev ? " ws://127.0.0.1:* ws://localhost:* http://127.0.0.1:* http://localhost:*" : "";
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
  ].join("; ");
}
function applySessionHardening(target = electron.session.defaultSession) {
  target.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...details.responseHeaders ?? {} };
    headers["Content-Security-Policy"] = [contentSecurityPolicy()];
    headers["X-Content-Type-Options"] = ["nosniff"];
    headers["Referrer-Policy"] = ["no-referrer"];
    callback({ responseHeaders: headers });
  });
  target.setPermissionRequestHandler((_wc, permission, callback) => {
    const allowed = permission === "clipboard-read" || permission === "fullscreen";
    if (!allowed) logger.warn("security", `permission denied: ${permission}`);
    callback(allowed);
  });
  target.setPermissionCheckHandler((_wc, permission) => permission === "clipboard-read");
  target.on("will-download", (event, item) => {
    if (!electron.app.isPackaged) return;
    event.preventDefault();
    logger.warn("security", `download blocked: ${item.getFilename()}`);
  });
}
const trustedWebContents = /* @__PURE__ */ new Set();
function trustWebContents(id) {
  trustedWebContents.add(id);
}
function untrustWebContents(id) {
  trustedWebContents.delete(id);
}
function isTrustedWebContents(id) {
  return trustedWebContents.has(id);
}
function hardenWindow(win, allowedUrlPrefixes) {
  const wc = win.webContents;
  const allowed = (url) => allowedUrlPrefixes.some((prefix) => url.startsWith(prefix)) || url.startsWith(`${MEDIA_SCHEME}://`);
  wc.setWindowOpenHandler(({ url }) => {
    logger.warn("security", `window.open blocked: ${url}`);
    return { action: "deny" };
  });
  wc.on("will-navigate", (event, url) => {
    if (!allowed(url)) {
      event.preventDefault();
      logger.warn("security", `navigation blocked: ${url}`);
    }
  });
  wc.on("will-attach-webview", (event) => {
    event.preventDefault();
    logger.warn("security", "webview attach blocked");
  });
  win.webContents.on("render-process-gone", (_event, details) => {
    logger.error("security", `renderer gone: ${details.reason}`);
  });
  win.webContents.on("preload-error", (_event, preloadPath, error) => {
    logger.error("security", `preload error (${preloadPath}): ${error.message}`);
  });
}
async function sha256File(filePath) {
  return new Promise((resolvePromise, reject) => {
    const hash = node_crypto.createHash("sha256");
    const stream = node_fs.createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolvePromise(hash.digest("hex")));
  });
}
const MEDIA_EXTENSIONS = /* @__PURE__ */ new Set([
  "mp4",
  "m4v",
  "mov",
  "mkv",
  "avi",
  "webm",
  "mxf",
  "prores",
  "dnxhd",
  "dnxhr",
  "mts",
  "m2ts",
  "h264",
  "h265",
  "hevc",
  "av1",
  "vp9",
  "ogv",
  "wmv",
  "flv",
  "wav",
  "mp3",
  "aac",
  "flac",
  "ogg",
  "opus",
  "aiff",
  "m4a",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "tif",
  "tiff",
  "exr",
  "dpx",
  "bmp",
  "gif"
]);
function isSupportedMediaFile(filePath) {
  const ext = node_path.extname(filePath).slice(1).toLowerCase();
  return MEDIA_EXTENSIONS.has(ext);
}
function assertZipEntrySafe(entryName, destinationRoot) {
  if (entryName.includes("\0")) throw new Error("Invalid zip entry");
  const normalized = entryName.replace(/\\/g, "/");
  if (normalized.startsWith("/") || /^[a-zA-Z]:/.test(normalized)) throw new Error("Absolute zip entry");
  const dest = node_path.resolve(destinationRoot, normalized);
  if (!isPathInside(node_path.resolve(destinationRoot), dest)) throw new Error("Zip entry escapes destination");
  return dest;
}
const stats = /* @__PURE__ */ new Map();
const buckets = /* @__PURE__ */ new Map();
const RATE_LIMITS = {
  "system:scan": { max: 3, windowMs: 6e4 },
  "system:benchmark": { max: 2, windowMs: 12e4 },
  "system:testEncoder": { max: 10, windowMs: 6e4 },
  "deps:download": { max: 2, windowMs: 3e5 },
  "queue:add": { max: 30, windowMs: 6e4 },
  "debug:bundle": { max: 3, windowMs: 12e4 },
  "debug:clientError": { max: 20, windowMs: 6e4 }
};
function rateLimited(event, channel) {
  const limits = RATE_LIMITS[channel] ?? { max: 120, windowMs: 1e4 };
  const key = `${event.sender.id}:${channel}`;
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < limits.windowMs);
  hits.push(now);
  buckets.set(key, hits);
  return hits.length > limits.max;
}
function statsFor(channel) {
  let s = stats.get(channel);
  if (!s) {
    s = { calls: 0, errors: 0, totalMs: 0, lastMs: 0, lastAt: null };
    stats.set(channel, s);
  }
  return s;
}
function handle(channel, handler) {
  electron.ipcMain.removeHandler(channel);
  electron.ipcMain.handle(channel, async (event, rawInput) => {
    const started = performance.now();
    const s = statsFor(channel);
    s.calls++;
    s.lastAt = (/* @__PURE__ */ new Date()).toISOString();
    try {
      if (!isTrustedWebContents(event.sender.id)) {
        throw Object.assign(new Error("Sender non autorizzato"), { code: "UNAUTHORIZED" });
      }
      if (rateLimited(event, channel)) {
        throw Object.assign(new Error(`Rate limit superato su ${channel}`), { code: "RATE_LIMITED" });
      }
      const schema = ipcRoutes[channel].input;
      const parsed = schema.safeParse(rawInput ?? {});
      if (!parsed.success) {
        throw Object.assign(new Error("Payload IPC non valido"), {
          code: "VALIDATION",
          details: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }))
        });
      }
      const data = await handler(parsed.data, { event, channel });
      s.lastMs = Math.round(performance.now() - started);
      s.totalMs += s.lastMs;
      return { ok: true, data };
    } catch (err) {
      s.errors++;
      const error = {
        code: err.code ?? "INTERNAL",
        message: err.message ?? "Errore interno",
        details: err.details
      };
      if (error.code === "INTERNAL") logger.error("ipc", `${channel}: ${error.message}`);
      else logger.debug("ipc", `${channel} rejected (${error.code}): ${error.message}`);
      s.lastMs = Math.round(performance.now() - started);
      s.totalMs += s.lastMs;
      return { ok: false, error };
    }
  });
}
function ipcStats() {
  return {
    channels: [...stats.entries()].map(([channel, s]) => ({
      channel,
      calls: s.calls,
      errors: s.errors,
      avgMs: s.calls > 0 ? Math.round(s.totalMs / s.calls * 10) / 10 : 0,
      lastMs: s.lastMs,
      lastAt: s.lastAt
    })).sort((a, b) => b.calls - a.calls),
    totalCalls: [...stats.values()].reduce((sum, s) => sum + s.calls, 0),
    totalErrors: [...stats.values()].reduce((sum, s) => sum + s.errors, 0)
  };
}
class BackendInfo {
  current = "software";
  selectedBy = "auto";
  set(backend, selectedBy = "auto") {
    this.current = backend;
    this.selectedBy = selectedBy;
  }
  get() {
    return { backend: this.current, selectedBy: this.selectedBy };
  }
  reset() {
    this.current = "software";
    this.selectedBy = "auto";
  }
}
const backendInfo = new BackendInfo();
class RecoveryState {
  recovered = false;
  set(recovered) {
    this.recovered = recovered;
  }
  get() {
    return this.recovered;
  }
}
const recoveryState = new RecoveryState();
let db = null;
let initPromise = null;
class MemoryDriver {
  kind = "memory";
  exec() {
  }
  prepare() {
    return { run: () => ({ changes: 0 }), get: () => void 0, all: () => [] };
  }
  flush() {
  }
  close() {
  }
}
function wrapBetterSqlite(handle2) {
  const cache = /* @__PURE__ */ new Map();
  return {
    kind: "better-sqlite3",
    exec: (sql) => handle2.exec(sql),
    prepare: (sql) => {
      let stmt = cache.get(sql);
      if (!stmt) {
        stmt = handle2.prepare(sql);
        cache.set(sql, stmt);
      }
      return {
        run: (...params) => ({ changes: Number(stmt.run(...params).changes ?? 0) }),
        get: (...params) => stmt.get(...params),
        all: (...params) => stmt.all(...params)
      };
    },
    flush: () => {
      try {
        handle2.pragma("wal_checkpoint(TRUNCATE)");
      } catch {
      }
    },
    close: () => {
      cache.clear();
      handle2.close();
    }
  };
}
function wrapSqlJs(handle2, persist) {
  return {
    kind: "sql.js",
    exec: (sql) => {
      handle2.exec(sql);
      persist();
    },
    prepare: (sql) => ({
      run: (...params) => {
        handle2.run(sql, params);
        persist();
        return { changes: handle2.getRowsModified() };
      },
      get: (...params) => {
        const stmt = handle2.prepare(sql);
        try {
          stmt.bind(params);
          if (stmt.step()) return stmt.getAsObject();
          return void 0;
        } finally {
          stmt.free();
        }
      },
      all: (...params) => {
        const stmt = handle2.prepare(sql);
        const rows = [];
        try {
          stmt.bind(params);
          while (stmt.step()) rows.push(stmt.getAsObject());
        } finally {
          stmt.free();
        }
        return rows;
      }
    }),
    flush: persist,
    close: () => {
      persist();
      handle2.close();
    }
  };
}
async function createDriver() {
  const file = databaseFile();
  if (process.env.MOLICUT_TEST_DB === "memory") return new MemoryDriver();
  const require2 = node_module.createRequire(typeof __filename !== "undefined" ? __filename : process.cwd());
  try {
    const BetterSqlite3 = require2("better-sqlite3");
    const handle2 = new BetterSqlite3(file);
    handle2.pragma("journal_mode = WAL");
    handle2.pragma("synchronous = NORMAL");
    handle2.pragma("foreign_keys = ON");
    logger.info("db", "driver=better-sqlite3");
    return wrapBetterSqlite(handle2);
  } catch (err) {
    logger.warn("db", `better-sqlite3 unavailable (${err.message}); trying sql.js`);
  }
  try {
    const initSqlJs = require2("sql.js");
    const sqlJsDir = node_path.dirname(require2.resolve("sql.js"));
    const SQL = await (typeof initSqlJs === "function" ? initSqlJs : initSqlJs.default)({
      locateFile: (name) => node_path.join(sqlJsDir, name)
    });
    const data = node_fs.existsSync(file) ? new Uint8Array(node_fs.readFileSync(file)) : void 0;
    const handle2 = new SQL.Database(data);
    let timer = null;
    const persist = () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        try {
          const exported = handle2.export();
          const tmp = `${file}.tmp`;
          node_fs.writeFileSync(tmp, exported);
          node_fs.renameSync(tmp, file);
        } catch (err) {
          logger.error("db", `sql.js persistence failed: ${err.message}`);
        }
      }, 250);
      timer.unref?.();
    };
    logger.info("db", "driver=sql.js (WASM fallback)");
    return wrapSqlJs(handle2, persist);
  } catch (err) {
    logger.error("db", `sql.js unavailable (${err.message}); using in-memory driver`);
    return new MemoryDriver();
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
];
async function initDatabase() {
  if (db) return db;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const driver = await createDriver();
    driver.exec(MIGRATIONS.join("\n"));
    driver.prepare(`INSERT OR REPLACE INTO schema_meta (key, value) VALUES ('version', ?)`).run("1");
    db = driver;
    return driver;
  })();
  return initPromise;
}
function getDb() {
  if (!db) throw new Error("Database not initialised");
  return db;
}
function closeDatabase() {
  if (!db) return;
  try {
    db.flush();
    db.close();
  } catch (err) {
    logger.error("db", `close failed: ${err.message}`);
  }
  db = null;
  initPromise = null;
}
function getKv(key, fallback) {
  const row = getDb().prepare("SELECT value FROM kv WHERE key = ?").get(key);
  if (!row) return fallback;
  try {
    return JSON.parse(row.value);
  } catch {
    return fallback;
  }
}
function setKv(key, value) {
  getDb().prepare("INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, JSON.stringify(value));
}
function backupDatabase(tag) {
  const file = databaseFile();
  if (!node_fs.existsSync(file)) return null;
  const target = node_path.join(appPaths().backups, `molicut-${tag}-${Date.now()}.sqlite`);
  try {
    getDb().flush();
    node_fs.copyFileSync(file, target);
    logger.info("db", `backup created: ${target}`);
    return target;
  } catch (err) {
    logger.error("db", `backup failed: ${err.message}`);
    return null;
  }
}
function parseEncoderList(stdout) {
  const out = [];
  for (const line of stdout.split(/\r?\n/)) {
    const match = /^\s*[VAS][.FSXBD]{4,7}\s+([A-Za-z0-9_]+)\s/.exec(line);
    if (match?.[1]) out.push(match[1]);
  }
  return out;
}
const isWindows = process.platform === "win32";
const exe = (name) => isWindows ? `${name}.exe` : name;
function findBundled(name) {
  const candidates = [node_path.join(ffmpegResourcesDir(), exe(name)), node_path.join(appPaths().bin, exe(name))];
  return candidates.find((candidate) => node_fs.existsSync(candidate)) ?? null;
}
class FfmpegService {
  cache = null;
  resolveOne(name) {
    const envVar = name === "ffmpeg" ? process.env.MOLICUT_FFMPEG : process.env.MOLICUT_FFPROBE;
    if (envVar && node_fs.existsSync(envVar)) return { path: envVar, version: null, source: "env" };
    const bundled = findBundled(name);
    if (bundled) return { path: bundled, version: null, source: "bundled" };
    return { path: exe(name), version: null, source: "system" };
  }
  binaries() {
    this.cache ??= { ffmpeg: this.resolveOne("ffmpeg"), ffprobe: this.resolveOne("ffprobe") };
    return this.cache;
  }
  invalidate() {
    this.cache = null;
  }
  async version(which = "ffmpeg") {
    const info = this.binaries()[which];
    if (!info.path) return null;
    try {
      const res = await this.run(info.path, ["-version"], { timeoutMs: 8e3 });
      if (res.code !== 0) return null;
      return res.stdout.split("\n")[0] ?? null;
    } catch {
      return null;
    }
  }
  async available() {
    return await this.version("ffmpeg") !== null;
  }
  run(bin, args, options = {}) {
    return new Promise((resolvePromise, reject) => {
      let child;
      try {
        child = node_child_process.spawn(bin, args, {
          windowsHide: true,
          stdio: ["ignore", "pipe", "pipe"],
          env: { ...process.env, ...options.env },
          // never pass a shell: args are always an array
          shell: false
        });
      } catch (err) {
        reject(err);
        return;
      }
      const stdout = [];
      const stderr = [];
      let stdoutBytes = 0;
      let stderrBytes = 0;
      let canceled = false;
      let timedOut = false;
      let settled = false;
      let killTimer = null;
      const MAX_CAPTURE = 4 * 1024 * 1024;
      const handleLine = (chunk, sink, onLine, bytes = 0) => {
        const text = chunk.toString("utf8");
        if (bytes < MAX_CAPTURE) sink.push(text);
        if (onLine) {
          for (const line of text.split(/\r?\n/)) {
            if (line.trim().length > 0) onLine(line);
          }
        }
        return bytes + chunk.length;
      };
      child.stdout?.on("data", (chunk) => {
        stdoutBytes = handleLine(chunk, stdout, options.onStdout, stdoutBytes);
      });
      child.stderr?.on("data", (chunk) => {
        stderrBytes = handleLine(chunk, stderr, options.onStderr, stderrBytes);
      });
      const terminate = () => {
        if (child.exitCode !== null) return;
        try {
          child.kill("SIGTERM");
        } catch {
        }
        killTimer = setTimeout(() => {
          try {
            child.kill("SIGKILL");
          } catch {
          }
        }, 2500);
        killTimer.unref?.();
      };
      const onAbort = () => {
        canceled = true;
        terminate();
      };
      if (options.signal) {
        if (options.signal.aborted) onAbort();
        else options.signal.addEventListener("abort", onAbort, { once: true });
      }
      let timeout = null;
      if (options.timeoutMs && options.timeoutMs > 0) {
        timeout = setTimeout(() => {
          timedOut = true;
          terminate();
        }, options.timeoutMs);
        timeout.unref?.();
      }
      if (options.lowPriority && child.pid) {
        try {
          os__namespace.setPriority(child.pid, os__namespace.constants.priority.PRIORITY_BELOW_NORMAL);
        } catch {
        }
      }
      const cleanup = () => {
        if (killTimer) clearTimeout(killTimer);
        if (timeout) clearTimeout(timeout);
        options.signal?.removeEventListener("abort", onAbort);
      };
      child.on("error", (err) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(err);
      });
      child.on("close", (code) => {
        if (settled) return;
        settled = true;
        cleanup();
        const result = {
          code: code ?? -1,
          stdout: stdout.join(""),
          stderr: stderr.join(""),
          canceled,
          timedOut
        };
        if (canceled) logger.debug("ffmpeg", `canceled: ${args.slice(0, 4).join(" ")}`);
        resolvePromise(result);
      });
    });
  }
  async runFfmpeg(args, options = {}) {
    const info = this.binaries().ffmpeg;
    if (!info.path) throw new Error("FFmpeg non disponibile");
    return this.run(info.path, ["-hide_banner", "-nostdin", "-y", ...args], options);
  }
  async runFfprobe(args, options = {}) {
    const info = this.binaries().ffprobe;
    if (!info.path) throw new Error("FFprobe non disponibile");
    return this.run(info.path, ["-hide_banner", ...args], options);
  }
  async listEncoders() {
    const info = this.binaries().ffmpeg;
    if (!info.path) return [];
    try {
      const res = await this.run(info.path, ["-hide_banner", "-encoders"], { timeoutMs: 15e3 });
      return parseEncoderList(res.stdout);
    } catch {
      return [];
    }
  }
  async listHwaccels() {
    const info = this.binaries().ffmpeg;
    if (!info.path) return [];
    try {
      const res = await this.run(info.path, ["-hide_banner", "-hwaccels"], { timeoutMs: 15e3 });
      return res.stdout.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0 && !l.toLowerCase().startsWith("hardware acceleration"));
    } catch {
      return [];
    }
  }
}
const ffmpeg = new FfmpegService();
const downloadEntrySchema = zod.z.object({
  url: zod.z.string().url(),
  sha256: zod.z.string().regex(/^[a-f0-9]{64}$/i).or(zod.z.literal("")),
  version: zod.z.string(),
  archive: zod.z.enum(["zip", "tar.xz"]),
  member: zod.z.string()
});
const manifestSchema$1 = zod.z.object({
  schemaVersion: zod.z.number(),
  channels: zod.z.record(zod.z.object({ ffmpeg: downloadEntrySchema, ffprobe: downloadEntrySchema }))
});
function manifestPath() {
  const candidates = [
    node_path.join(process.resourcesPath ?? "", "ffmpeg", "checksums.json"),
    node_path.join(electron.app.getAppPath(), "ffmpeg", "checksums.json")
  ];
  return candidates.find((p) => node_fs.existsSync(p)) ?? null;
}
function loadManifest() {
  const path = manifestPath();
  if (!path) return null;
  try {
    return manifestSchema$1.parse(JSON.parse(node_fs.readFileSync(path, "utf8")));
  } catch (err) {
    logger.error("deps", `invalid dependency manifest: ${err.message}`);
    return null;
  }
}
const hashCache = /* @__PURE__ */ new Map();
async function cachedSha256(path) {
  const stats2 = node_fs.statSync(path);
  const key = `${stats2.size}:${stats2.mtimeMs}`;
  const cached2 = hashCache.get(path);
  if (cached2?.key === key) return cached2.hash;
  const hash = await sha256File(path);
  hashCache.set(path, { key, hash });
  return hash;
}
class DependencyService {
  entryFor(id) {
    const manifest = loadManifest();
    if (!manifest) return null;
    const key = `${process.platform}-${process.arch}`;
    return manifest.channels[key]?.[id] ?? null;
  }
  async status() {
    const binaries = ffmpeg.binaries();
    const results = [];
    for (const id of ["ffmpeg", "ffprobe"]) {
      const info = binaries[id];
      const entry = this.entryFor(id);
      const path = info.path;
      const isFile = Boolean(path && node_fs.existsSync(path));
      if (!isFile && info.source === "system") {
        const version2 = await ffmpeg.version(id);
        results.push({
          id,
          name: id === "ffmpeg" ? "FFmpeg" : "FFprobe",
          required: id === "ffmpeg",
          path: null,
          version: version2?.split(" ").slice(0, 3).join(" ") ?? null,
          expectedSha256: entry?.sha256 || null,
          actualSha256: null,
          status: version2 ? "ok" : id === "ffmpeg" ? "missing" : "missing",
          detail: version2 ? `Binary di sistema nel PATH (${version2.slice(0, 80)}). Checksum non verificabile.` : 'Non trovato: installa FFmpeg o usa "Scarica dipendenze".'
        });
        continue;
      }
      if (!isFile) {
        results.push({
          id,
          name: id === "ffmpeg" ? "FFmpeg" : "FFprobe",
          required: id === "ffmpeg",
          path: null,
          version: null,
          expectedSha256: entry?.sha256 || null,
          actualSha256: null,
          status: "missing",
          detail: "Binario mancante"
        });
        continue;
      }
      const actual = await cachedSha256(path);
      const expected = entry?.sha256 ?? "";
      const version = await ffmpeg.version(id);
      let status = "ok";
      let detail = `Firma SHA-256 verificata (${actual.slice(0, 12)}…).`;
      if (!version) {
        status = "unsupported";
        detail = "Il binario non risponde a -version";
      } else if (!expected) {
        detail = "Checksum non pinnato nel manifest: verifica manuale richiesta.";
      } else if (expected.toLowerCase() !== actual.toLowerCase()) {
        status = "corrupt";
        detail = `Checksum non corrispondente (atteso ${expected.slice(0, 12)}…, trovato ${actual.slice(0, 12)}…).`;
      }
      results.push({
        id,
        name: id === "ffmpeg" ? "FFmpeg" : "FFprobe",
        required: id === "ffmpeg",
        path,
        version: version?.split(" ").slice(0, 3).join(" ") ?? null,
        expectedSha256: expected || null,
        actualSha256: actual,
        status,
        detail
      });
    }
    let dbKind = "unknown";
    try {
      dbKind = getDb().kind;
    } catch {
    }
    results.push({
      id: "sqlite",
      name: "SQLite (better-sqlite3 / sql.js)",
      required: false,
      path: null,
      version: dbKind,
      expectedSha256: null,
      actualSha256: null,
      status: dbKind === "better-sqlite3" || dbKind === "sql.js" ? "ok" : "unsupported",
      detail: dbKind === "better-sqlite3" ? "Driver nativo attivo." : dbKind === "sql.js" ? "Fallback WASM attivo (nessun rebuild nativo)." : "Nessun driver SQLite disponibile."
    });
    return results;
  }
  async downloadToFile(url, destination, expectedSha) {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok || !response.body) throw new Error(`Download fallito: HTTP ${response.status}`);
    const length = Number(response.headers.get("content-length") ?? 0);
    if (length > 500 * 1024 * 1024) throw new Error("Archivio troppo grande (limite 500 MB)");
    const hash = node_crypto.createHash("sha256");
    const file = node_fs.createWriteStream(destination, { mode: 384 });
    const body = node_stream.Readable.fromWeb(response.body);
    await new Promise((resolvePromise, reject) => {
      body.on("data", (chunk) => hash.update(chunk));
      body.on("error", reject);
      file.on("error", reject);
      file.on("finish", () => resolvePromise());
      body.pipe(file);
    });
    const actual = hash.digest("hex");
    if (actual.toLowerCase() !== expectedSha.toLowerCase()) {
      throw new Error(`Checksum download non valido: atteso ${expectedSha.slice(0, 12)}…, ottenuto ${actual.slice(0, 12)}…`);
    }
  }
  async extractMember(entry, archivePath, workDir) {
    if (entry.archive === "zip") {
      const zip = new AdmZip(archivePath);
      const found = zip.getEntries().find((e) => node_path.basename(e.entryName) === entry.member);
      if (!found) throw new Error(`${entry.member} non presente nell'archivio`);
      const target = assertZipEntrySafe(found.entryName, workDir);
      node_fs.mkdirSync(node_path.join(target, ".."), { recursive: true });
      node_fs.writeFileSync(target, found.getData());
      return target;
    }
    const list = await run("tar", ["-tJf", archivePath]);
    if (list.code !== 0) throw new Error("Archivio tar.xz non valido");
    for (const line of list.stdout.split(/\r?\n/)) {
      if (line.trim()) assertZipEntrySafe(line.trim(), workDir);
    }
    const extract = await run("tar", ["-xJf", archivePath, "-C", workDir]);
    if (extract.code !== 0) throw new Error("Estrazione tar.xz fallita");
    const stack = [workDir];
    while (stack.length) {
      const dir = stack.pop();
      for (const name of node_fs.readdirSync(dir)) {
        const full = node_path.join(dir, name);
        if (node_fs.statSync(full).isDirectory()) stack.push(full);
        else if (name === entry.member) return full;
      }
    }
    throw new Error(`${entry.member} non presente nell'archivio`);
  }
  async download(component) {
    const ids = component === "all" ? ["ffmpeg", "ffprobe"] : [component];
    const binDir = appPaths().bin;
    node_fs.mkdirSync(binDir, { recursive: true, mode: 448 });
    const messages = [];
    for (const id of ids) {
      const entry = this.entryFor(id);
      if (!entry) throw new Error(`Nessuna sorgente configurata per ${process.platform}-${process.arch}`);
      if (!/^[a-f0-9]{64}$/i.test(entry.sha256)) {
        throw new Error(
          `Download bloccato: checksum SHA-256 non pinnato per ${id} (${process.platform}-${process.arch}). Un maintainer deve aggiornare ffmpeg/checksums.json.`
        );
      }
      const workDir = node_fs.mkdtempSync(node_path.join(os.tmpdir(), "molicut-deps-"));
      const archive = node_path.join(workDir, "archive");
      try {
        logger.info("deps", `downloading ${id} from ${entry.url}`);
        await this.downloadToFile(entry.url, archive, entry.sha256);
        const binary = await this.extractMember(entry, archive, workDir);
        const target = node_path.join(binDir, node_path.basename(binary));
        const staging = `${target}.new`;
        node_fs.copyFileSync(binary, staging);
        if (process.platform !== "win32") node_fs.chmodSync(staging, 493);
        node_fs.renameSync(staging, target);
        ffmpeg.invalidate();
        messages.push(`${id} installato in ${target}`);
        logger.info("deps", `installed ${id} -> ${target}`);
      } finally {
        try {
          node_fs.rmSync(workDir, { recursive: true, force: true });
        } catch {
        }
      }
    }
    return { dependencies: await this.status(), detail: messages.join("; ") };
  }
}
function run(bin, args) {
  return new Promise((resolvePromise, reject) => {
    const child = node_child_process.spawn(bin, args, { windowsHide: true, shell: false });
    let stdout = "";
    child.stdout.on("data", (d) => {
      stdout += d.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => resolvePromise({ code: code ?? -1, stdout }));
  });
}
const dependencies = new DependencyService();
const HARDWARE_ENCODERS = {
  nvenc: { h264: "h264_nvenc", hevc: "hevc_nvenc", av1: "av1_nvenc" },
  amf: { h264: "h264_amf", hevc: "hevc_amf", av1: "av1_amf" },
  qsv: { h264: "h264_qsv", hevc: "hevc_qsv", av1: "av1_qsv" },
  videotoolbox: { h264: "h264_videotoolbox", hevc: "hevc_videotoolbox" },
  vaapi: { h264: "h264_vaapi", hevc: "hevc_vaapi", av1: "av1_vaapi" }
};
const SOFTWARE_ENCODERS = {
  h264: "libx264",
  hevc: "libx265",
  av1: "libsvtav1",
  vp9: "libvpx-vp9",
  prores: "prores_ks",
  dnxhr: "dnxhd",
  gif: "gif",
  png: "png",
  mjpeg: "mjpeg"
};
const BACKEND_LABEL = {
  nvenc: "NVIDIA NVENC",
  amf: "AMD AMF",
  qsv: "Intel Quick Sync",
  videotoolbox: "Apple VideoToolbox",
  vaapi: "VAAPI",
  software: "Software (CPU)"
};
const DEFAULT_PRIORITY = process.platform === "darwin" ? ["videotoolbox", "software"] : process.platform === "linux" ? ["nvenc", "vaapi", "qsv", "amf", "software"] : ["nvenc", "qsv", "amf", "software"];
function backendsFromEncoders(encoders) {
  const found = [];
  for (const backend of Object.keys(HARDWARE_ENCODERS)) {
    if (Object.values(HARDWARE_ENCODERS[backend]).some((enc) => enc && encoders.includes(enc))) {
      found.push(backend);
    }
  }
  if (!found.includes("software")) found.push("software");
  return found;
}
function chooseEncoder(codec, policy, backends, override = "auto") {
  const software = (reason) => ({
    encoder: SOFTWARE_ENCODERS[codec] ?? "libx264",
    backend: "software",
    hardware: false,
    label: "Software (CPU)",
    reason
  });
  if (codec === "gif" || codec === "png" || codec === "mjpeg" || !SOFTWARE_ENCODERS[codec]) {
    return codec === "none" ? { encoder: "none", backend: "software", hardware: false, label: "Nessuno", reason: "nessun video" } : software("codec senza encoder hardware");
  }
  if (policy === "software") return software("policy=software");
  if (override === "software") return software("override=software");
  if (backends.length === 0) return software("nessun backend rilevato");
  const order = override === "auto" ? DEFAULT_PRIORITY : [override, ...DEFAULT_PRIORITY];
  for (const candidate of order) {
    if (candidate === "software") continue;
    if (!backends.includes(candidate)) continue;
    const encoder = HARDWARE_ENCODERS[candidate][codec];
    if (!encoder) continue;
    return { encoder, backend: candidate, hardware: true, label: BACKEND_LABEL[candidate], reason: `backend ${candidate} disponibile` };
  }
  return software("nessun encoder hardware per questo codec");
}
function nvencPreset(preset) {
  const map = {
    ultrafast: "p1",
    superfast: "p2",
    veryfast: "p3",
    faster: "p4",
    fast: "p4",
    medium: "p5",
    slow: "p6",
    slower: "p6",
    veryslow: "p7"
  };
  return map[preset] ?? "p5";
}
function bitrateArgs(preset, choice, fps) {
  const v = preset.video;
  const args = [];
  if (preset.video.codec === "prores" || preset.video.codec === "dnxhr" || preset.video.codec === "png") return args;
  if (v.bitrateMode === "crf") {
    switch (choice.backend) {
      case "software":
        if (v.codec === "vp9") args.push("-crf", String(v.crf), "-b:v", "0");
        else if (v.codec === "av1") args.push("-crf", String(v.crf), "-preset", v.preset || "6");
        else args.push("-crf", String(v.crf));
        break;
      case "nvenc":
        args.push("-rc", "vbr", "-cq", String(v.crf), "-b:v", "0");
        break;
      case "qsv":
        args.push("-global_quality", String(v.crf));
        break;
      case "amf":
        args.push("-rc", "cqp", "-qp_i", String(v.crf), "-qp_p", String(v.crf));
        break;
      case "videotoolbox":
        args.push("-q:v", String(Math.round(1 + v.crf / 63 * 99)));
        break;
      case "vaapi":
        args.push("-qp", String(v.crf));
        break;
    }
    return args;
  }
  args.push("-b:v", `${v.bitrateKbps}k`);
  if (v.bitrateMode === "cbr") {
    args.push("-maxrate", `${v.bitrateKbps}k`, "-bufsize", `${v.bitrateKbps * 2}k`);
    if (choice.backend === "nvenc") args.push("-rc", "cbr");
  } else if (choice.backend === "nvenc") {
    args.push("-rc", "vbr");
  }
  if (fps && v.gopSeconds > 0) {
    const gop = Math.max(1, Math.round(fps * v.gopSeconds));
    args.push("-g", String(gop), "-keyint_min", String(Math.max(1, Math.floor(gop / 2))));
  }
  return args;
}
function proresProfile(profile) {
  const map = { proxy: "0", lt: "1", standard: "2", hq: "3", "4444": "4" };
  return map[profile ?? "hq"] ?? "3";
}
function dnxhrProfile(profile) {
  const p = (profile ?? "hqx").toLowerCase();
  return p.startsWith("dnxhr_") ? p : `dnxhr_${p}`;
}
function colorArgs(preset) {
  const { colorSpace, hdr } = preset.video;
  const args = [];
  const isHdr = hdr === "hdr10" || hdr === "hlg";
  if (isHdr) {
    args.push(
      "-color_primaries",
      "bt2020",
      "-color_trc",
      hdr === "hdr10" ? "smpte2084" : "arib-std-b67",
      "-colorspace",
      "bt2020nc"
    );
    return args;
  }
  switch (colorSpace) {
    case "rec2020":
      args.push("-color_primaries", "bt2020", "-color_trc", "bt2020-10", "-colorspace", "bt2020nc");
      break;
    case "p3":
      args.push("-color_primaries", "smpte432", "-color_trc", "bt709", "-colorspace", "bt2020nc");
      break;
    case "aces":
      args.push("-color_primaries", "bt2020", "-color_trc", "linear", "-colorspace", "bt2020nc");
      break;
    default:
      args.push("-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709");
  }
  return args;
}
function hdrParams(preset, choice) {
  if (preset.video.hdr !== "hdr10") return [];
  const m = preset.video.hdrMastering ?? { maxLuminance: 1e3, minLuminance: 5e-3, maxCLL: 1e3, maxFALL: 400 };
  if (choice.encoder === "libx265") {
    const master = `G(13250,34500)B(7500,3000)R(34000,16000)WP(15635,16450)L(${Math.round(m.maxLuminance * 1e4)},${Math.max(1, Math.round(m.minLuminance * 1e4))})`;
    return [
      "-x265-params",
      `hdr-opt=1:repeat-headers=1:colorprim=bt2020:transfer=smpte2084:colormatrix=bt2020nc:master-display=${master}:max-cll=${m.maxCLL},${m.maxFALL}`
    ];
  }
  return [];
}
function escapeFilterPath$1(filePath) {
  return filePath.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "\\'");
}
function appendVideoCodecArgs(args, preset, choice, fps) {
  const v = preset.video;
  if (v.codec === "none") {
    args.push("-vn");
    return;
  }
  args.push("-c:v", choice.encoder);
  if (choice.backend === "nvenc") args.push("-preset", nvencPreset(v.preset));
  else if (choice.backend === "software" && v.codec !== "gif" && v.codec !== "png") args.push("-preset", v.preset);
  if (choice.backend === "amf") args.push("-quality", "quality");
  if (v.codec === "prores") {
    args.push("-profile:v", proresProfile(v.profile), "-vendor", "apl0");
  } else if (v.codec === "dnxhr") {
    args.push("-profile:v", dnxhrProfile(v.profile));
  } else if (v.profile && v.codec !== "gif" && v.codec !== "png") {
    args.push("-profile:v", v.profile);
  }
  if (v.pixelFormat && choice.backend !== "vaapi" && v.codec !== "gif") args.push("-pix_fmt", v.pixelFormat);
  args.push(...bitrateArgs(preset, choice, fps));
  args.push(...colorArgs(preset));
  args.push(...hdrParams(preset, choice));
  if (preset.container === "mp4" && v.codec === "hevc") args.push("-tag:v", "hvc1");
}
function appendAudioCodecArgs(args, preset, hasAudio) {
  const a = preset.audio;
  if (a.codec === "none" || !hasAudio || preset.video.codec === "gif") {
    args.push("-an");
    return;
  }
  const codecMap = {
    aac: "aac",
    mp3: "libmp3lame",
    pcm_s16le: "pcm_s16le",
    pcm_s24le: "pcm_s24le",
    opus: "libopus"
  };
  args.push("-c:a", codecMap[a.codec] ?? "aac");
  if (a.codec !== "pcm_s16le" && a.codec !== "pcm_s24le") args.push("-b:a", `${a.bitrateKbps}k`);
  args.push("-ac", String(a.channels), "-ar", String(a.sampleRate));
}
function appendContainerArgs(args, preset, output, testMode) {
  if (preset.container === "mp4" || preset.container === "mov") args.push("-movflags", "+faststart");
  if (preset.container === "gif") args.push("-loop", "0");
  if (preset.container === "image2") args.push("-f", "image2", "-start_number", "1");
  if (preset.container === "webm") args.push("-f", "webm");
  if (testMode) args.push("-f", "null");
  args.push(testMode ? "-" : output);
}
function buildEncodeArgs(options) {
  const { input, output, preset, choice } = options;
  const v = preset.video;
  const a = preset.audio;
  const args = [];
  const fps = v.fps;
  const filters = [];
  const audioFilters = [];
  if (options.sourceIsImage && options.durationSec) {
    args.push("-loop", "1", "-t", String(options.durationSec));
  }
  if (choice.backend === "vaapi" && process.platform === "linux") {
    args.push("-vaapi_device", process.env.MOLICUT_VAAPI_DEVICE ?? "/dev/dri/renderD128");
  }
  args.push("-i", input);
  if (v.codec === "gif") {
    const width = v.width ?? 720;
    filters.push(`fps=${v.fps ?? 15}`, `scale=${width}:-1:flags=lanczos`, "split[s0][s1]", "[s0]palettegen=max_colors=256[p]", "[s1][p]paletteuse=dither=sierra2_4a");
  } else {
    if (v.width && v.height) {
      if (preset.filters.scaleMode === "fit") {
        filters.push(
          `scale=${v.width}:${v.height}:force_original_aspect_ratio=decrease`,
          `pad=${v.width}:${v.height}:(ow-iw)/2:(oh-ih)/2:color=black`
        );
      } else if (preset.filters.scaleMode === "fill") {
        filters.push(`scale=${v.width}:${v.height}:force_original_aspect_ratio=increase`, `crop=${v.width}:${v.height}`);
      } else {
        filters.push(`scale=${v.width}:${v.height}`);
      }
    } else if (v.width) {
      filters.push(`scale=${v.width}:-2`);
    } else if (v.height) {
      filters.push(`scale=-2:${v.height}`);
    }
    if (fps) filters.push(`fps=${fps}`);
    if (preset.filters.lut) filters.push(`lut3d=file='${escapeFilterPath$1(preset.filters.lut)}'`);
    if (preset.filters.burnSubtitles && preset.filters.subtitlePath) {
      filters.push(`subtitles=filename='${escapeFilterPath$1(preset.filters.subtitlePath)}'`);
    }
    if (preset.filters.colorConversion !== false) {
      const matrix = v.colorSpace === "rec709" ? "bt709" : "bt2020";
      filters.push(`scale=out_color_matrix=${matrix}:out_range=tv`);
    }
    if (choice.backend === "vaapi") filters.push("format=nv12,hwupload");
    else if (v.pixelFormat) filters.push(`format=${v.pixelFormat}`);
  }
  if (a.loudness.enabled && a.codec !== "none") {
    audioFilters.push(`loudnorm=I=${a.loudness.targetLufs}:TP=${a.loudness.truePeakDb}:LRA=${a.loudness.lra}`);
  }
  if (filters.length > 0) args.push("-vf", filters.join(","));
  if (audioFilters.length > 0) args.push("-af", audioFilters.join(","));
  appendVideoCodecArgs(args, preset, choice, fps);
  appendAudioCodecArgs(args, preset, options.hasAudio);
  appendContainerArgs(args, preset, output, options.testMode);
  return args;
}
function buildGraphEncodeArgs(options) {
  const { preset, choice, durationSec } = options;
  const fids = ["-filter_complex", options.filterGraph];
  if (preset.video.codec !== "none") fids.push("-map", `[${options.videoLabel}]`);
  if (options.hasAudio && options.audioLabel && preset.audio.codec !== "none" && preset.video.codec !== "gif") {
    fids.push("-map", `[${options.audioLabel}]`);
  }
  fids.push("-t", String(Math.max(0.05, durationSec)));
  appendVideoCodecArgs(fids, preset, choice, preset.video.fps);
  appendAudioCodecArgs(fids, preset, options.hasAudio);
  appendContainerArgs(fids, preset, options.output, options.testMode);
  return fids;
}
function safeFileStem(value, fallback = "MoliCut") {
  const stem = value.normalize("NFKD").replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").trim().replace(/[. ]+$/g, "").slice(0, 100);
  return stem || fallback;
}
function encoderTestArgs(encoderId, codec) {
  const args = [
    "-f",
    "lavfi",
    "-i",
    "testsrc2=size=640x360:rate=30:duration=1",
    "-c:v",
    encoderId,
    "-pix_fmt",
    "yuv420p",
    "-f",
    "null",
    "-"
  ];
  if (encoderId === "libsvtav1") args.splice(args.indexOf("-pix_fmt"), 2, "-preset", "10");
  if (encoderId.endsWith("_vaapi")) args.splice(0, 0, "-vaapi_device", process.env.MOLICUT_VAAPI_DEVICE ?? "/dev/dri/renderD128");
  return args;
}
function outputExtension(preset) {
  if (preset.container === "image2") return preset.video.codec === "png" ? "png" : "jpg";
  return preset.container;
}
function defaultOutputPath(preset, sourcePath, directory) {
  const desired = preset.output.directory ?? directory;
  const suffix = preset.output.suffix || "";
  return node_path.join(desired, `${basenameNoExt(sourcePath)}${suffix}.${outputExtension(preset)}`);
}
function uniqueOutputPath(path, exists) {
  if (!exists(path)) return path;
  const ext = node_path.extname(path);
  const stem = node_path.basename(path, ext);
  for (let i = 1; i < 500; i++) {
    const candidate = node_path.join(path.slice(0, path.length - node_path.basename(path).length), `${stem}_${i}${ext}`);
    if (!exists(candidate)) return candidate;
  }
  return path;
}
const KNOWN_HW_ENCODERS = [
  { backend: "nvenc", encoders: [["h264_nvenc", "h264"], ["hevc_nvenc", "hevc"], ["av1_nvenc", "av1"]] },
  { backend: "amf", encoders: [["h264_amf", "h264"], ["hevc_amf", "hevc"], ["av1_amf", "av1"]] },
  { backend: "qsv", encoders: [["h264_qsv", "h264"], ["hevc_qsv", "hevc"], ["av1_qsv", "av1"]] },
  { backend: "videotoolbox", encoders: [["h264_videotoolbox", "h264"], ["hevc_videotoolbox", "hevc"]] },
  { backend: "vaapi", encoders: [["h264_vaapi", "h264"], ["hevc_vaapi", "hevc"], ["av1_vaapi", "av1"]] }
];
function vendorKey(vendor) {
  const v = vendor.toLowerCase();
  if (v.includes("nvidia")) return "nvidia";
  if (v.includes("amd") || v.includes("advanced micro")) return "amd";
  if (v.includes("intel")) return "intel";
  if (v.includes("apple")) return "apple";
  return "software";
}
function vendorApis(vendor) {
  const v = vendor.toLowerCase();
  if (v.includes("nvidia")) return ["CUDA", "Vulkan", "DX12", "OpenCL"];
  if (v.includes("amd")) return ["Vulkan", "DX12", "OpenCL"];
  if (v.includes("intel")) return ["Vulkan", "DX12", "OpenCL", "QSV"];
  if (v.includes("apple")) return ["Metal", "Vulkan (MoltenVK)"];
  return [];
}
class HardwareService {
  profile = null;
  scanning = null;
  cachedProfile() {
    if (this.profile) return this.profile;
    const row = getDb().prepare("SELECT payload FROM hardware_profile ORDER BY scanned_at DESC LIMIT 1").get();
    if (!row) return null;
    try {
      const parsed = hardwareProfileSchema.safeParse(JSON.parse(row.payload));
      if (parsed.success) {
        this.profile = parsed.data;
        return parsed.data;
      }
    } catch {
    }
    return null;
  }
  backends() {
    const profile = this.cachedProfile();
    if (!profile) return ["software"];
    const vendors = new Set(profile.gpus.map((gpu) => vendorKey(gpu.vendor)));
    const ids = profile.encoders.filter((encoder) => encoder.available).filter((encoder) => {
      if (encoder.id === "software" || encoder.id === "vaapi") return true;
      return vendors.has(encoder.vendor);
    }).map((encoder) => encoder.id);
    const hardware2 = [...new Set(ids.filter((id) => id !== "software"))];
    return hardware2.length > 0 ? [...hardware2, "software"] : ["software"];
  }
  store(profile) {
    this.profile = profile;
    getDb().prepare("INSERT INTO hardware_profile (hash, scanned_at, payload) VALUES (?, ?, ?)").run(profile.hardwareHash, profile.scannedAt, JSON.stringify(profile));
    getDb().prepare(
      "DELETE FROM hardware_profile WHERE hash NOT IN (SELECT hash FROM hardware_profile ORDER BY scanned_at DESC LIMIT 3)"
    ).run();
  }
  async scan(force, onProgress = () => {
  }) {
    if (!force) {
      const cached2 = this.cachedProfile();
      if (cached2) {
        onProgress("cache", 100, "Profilo hardware in cache");
        return cached2;
      }
    }
    if (this.scanning) return this.scanning;
    this.scanning = this.doScan(onProgress).finally(() => {
      this.scanning = null;
    });
    return this.scanning;
  }
  async doScan(onProgress) {
    onProgress("cpu", 5, "Lettura CPU e memoria");
    const [cpu, mem, osInfo, graphics, fsSize, layouts] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.graphics(),
      si.fsSize(),
      si.diskLayout().catch(() => [])
    ]);
    onProgress("gpu", 25, "Rilevamento GPU");
    const gpus = (graphics.controllers ?? []).map((gpu) => ({
      model: gpu.model ?? "GPU sconosciuta",
      vendor: gpu.vendor ?? "unknown",
      vramMB: Math.round(gpu.vram ?? 0),
      driverVersion: gpu.driverVersion ?? "unknown",
      api: vendorApis(`${gpu.vendor ?? ""} ${gpu.model ?? ""}`)
    }));
    const hash = node_crypto.createHash("sha256").update(
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
      ].join("|")
    ).digest("hex").slice(0, 32);
    onProgress("ffmpeg", 45, "Interrogazione FFmpeg (-encoders, -hwaccels)");
    const [encoders, hwaccels] = await Promise.all([ffmpeg.listEncoders(), ffmpeg.listHwaccels()]);
    onProgress("strategy", 70, "Calcolo strategia di accelerazione");
    const detected = [];
    for (const { backend, encoders: candidates } of KNOWN_HW_ENCODERS) {
      const availableCodecs = candidates.filter(([id]) => encoders.includes(id)).map(([, codec]) => codec);
      if (availableCodecs.length === 0) continue;
      detected.push({
        id: backend,
        name: backend === "nvenc" ? "NVIDIA NVENC" : backend === "amf" ? "AMD AMF" : backend === "qsv" ? "Intel Quick Sync" : backend === "videotoolbox" ? "Apple VideoToolbox" : "VAAPI",
        vendor: backend === "nvenc" ? "nvidia" : backend === "amf" ? "amd" : backend === "qsv" ? "intel" : backend === "videotoolbox" ? "apple" : vendorKey(gpus[0]?.vendor ?? ""),
        available: true,
        codecs: availableCodecs,
        testedOk: null,
        testDetail: null
      });
    }
    detected.push({
      id: "software",
      name: "Software (CPU)",
      vendor: "software",
      available: encoders.includes("libx264") || encoders.length > 0,
      codecs: ["h264", "hevc", "av1", "vp9", "prores", "dnxhr"].filter(
        (c) => encoders.some((e) => e.includes(c.replace("h264", "x264").replace("hevc", "x265")))
      ),
      testedOk: true,
      testDetail: null
    });
    const ordered = backendsFromEncoders(encoders);
    const preferred = ordered.find((b) => b !== "software") ?? "software";
    const notes = [];
    if (preferred === "software") {
      notes.push("Nessun encoder hardware rilevato: export e preview useranno la CPU (fallback esplicito).");
    } else {
      notes.push(`Backend preferito: ${preferred}. Selezione automatica all'avvio; override manuale nelle Impostazioni.`);
    }
    if (gpus.length > 0 && preferred === "software") {
      notes.push("GPU presente ma senza encoder supportati da FFmpeg su questa build.");
    }
    if (!node_fs.existsSync(ffmpeg.binaries().ffmpeg.path ?? "")) {
      notes.push("Binario FFmpeg non trovato: esegui npm run fetch:ffmpeg o installa FFmpeg nel PATH.");
    }
    if (process.env.MOLICUT_SAFE_MODE === "1") notes.push("Safe mode attivo: accelerazione hardware disabilitata.");
    const disks = (fsSize ?? []).filter((d) => d.size > 0).slice(0, 8).map((d) => {
      const layout = (layouts ?? []).find((l) => l.device && d.mount && l.device.includes(d.mount.replace("/dev/", "")));
      const kindRaw = String(layout?.type ?? "").toLowerCase();
      return {
        mount: d.mount ?? "?",
        fs: d.fs ?? "?",
        sizeGB: roundTo(d.size / 1024 ** 3, 1),
        freeGB: roundTo(d.available / 1024 ** 3, 1),
        kind: kindRaw.includes("ssd") ? "ssd" : kindRaw.includes("hdd") ? "hdd" : "unknown"
      };
    });
    const memoryTotalGB = roundTo(mem.total / 1024 ** 3, 1);
    const physicalCores = cpu.physicalCores ?? cpu.cores ?? 4;
    const recommendedConcurrency = clamp(Math.floor(physicalCores / 4), 1, 4);
    const profile = {
      hardwareHash: hash,
      scannedAt: (/* @__PURE__ */ new Date()).toISOString(),
      platform: process.platform,
      arch: process.arch,
      cpu: {
        manufacturer: cpu.manufacturer ?? "unknown",
        brand: cpu.brand ?? "unknown",
        cores: cpu.cores ?? 0,
        physicalCores,
        speedGHz: roundTo(cpu.speed ?? 0, 2),
        flags: (cpu.flags ?? "").split(" ").filter((f) => /^(avx|avx2|avx512|sse4|fma)/.test(f)).slice(0, 12)
      },
      memoryTotalGB,
      memoryFreeGB: roundTo(mem.available / 1024 ** 3, 1),
      gpus,
      disks,
      os: {
        platform: osInfo.platform ?? process.platform,
        distro: osInfo.distro ?? "",
        release: osInfo.release ?? "",
        kernel: osInfo.kernel ?? "",
        build: osInfo.build ?? ""
      },
      encoders: detected,
      hwaccels,
      acceleration: {
        preferredBackend: preferred,
        hardwareAvailable: preferred !== "software",
        webgpu: process.env.MOLICUT_DISABLE_GPU !== "1",
        webgl2: true,
        recommendedConcurrency,
        notes
      }
    };
    onProgress("persist", 95, "Salvataggio profilo hardware");
    this.store(profile);
    onProgress("done", 100, "Scansione completata");
    logger.info(
      "hardware",
      `scan complete: cpu=${profile.cpu.brand} gpu=${profile.gpus.map((g) => g.model).join(", ") || "none"} backend=${preferred}`
    );
    return profile;
  }
  async testEncoder(encoderId, codec) {
    const started = Date.now();
    const args = encoderTestArgs(encoderId);
    try {
      const result = await ffmpeg.runFfmpeg(args, { timeoutMs: 3e4 });
      const ms = Date.now() - started;
      if (result.code !== 0) {
        return { ok: false, fps: null, detail: lastError(result.stderr), ms };
      }
      const fpsMatch = /fps=\s*([\d.]+)/g;
      let fps = null;
      let match;
      while ((match = fpsMatch.exec(result.stderr)) !== null) fps = Number(match[1]);
      if (fps === null) fps = roundTo(30 / (ms / 1e3), 1);
      this.markTested(encoderId, true, `ok in ${ms}ms, ${fps} fps`);
      return { ok: true, fps, detail: `Encode 1s completato in ${ms}ms`, ms };
    } catch (err) {
      return { ok: false, fps: null, detail: err.message, ms: Date.now() - started };
    }
  }
  markTested(encoderId, ok, detail) {
    const profile = this.cachedProfile();
    if (!profile) return;
    const enc = profile.encoders.find((e) => e.id === encoderId);
    if (!enc) return;
    enc.testedOk = ok;
    enc.testDetail = detail;
    profile.scannedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.store(profile);
  }
  async benchmark() {
    const started = Date.now();
    const details = [];
    const samples = [];
    const deadline = Date.now() + 450;
    let iterations = 0;
    while (Date.now() < deadline) {
      const t0 = performance.now();
      node_crypto.createHash("sha256").update(`molicut-${iterations}`).digest("hex");
      samples.push(performance.now() - t0);
      iterations++;
    }
    const avgMs = samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length);
    const p95 = percentile(samples, 95);
    const cpuScore = Math.round(1e4 / Math.max(0.01, p95));
    details.push(`CPU hash: ${iterations} ops in 450ms, avg ${roundTo(avgMs, 3)}ms, p95 ${roundTo(p95, 3)}ms`);
    const testFile = node_path.join(appPaths().temp, `bench-${Date.now()}.bin`);
    const block = Buffer.alloc(1024 * 1024, 7);
    let diskWriteMBs = 0;
    let diskReadMBs = 0;
    try {
      const t0 = performance.now();
      const fd = await import("node:fs/promises");
      const handle2 = await fd.open(testFile, "w");
      for (let i = 0; i < 32; i++) await handle2.write(block);
      await handle2.close();
      const writeMs = performance.now() - t0;
      diskWriteMBs = roundTo(32 / (writeMs / 1e3), 1);
      const t1 = performance.now();
      const data = node_fs.readFileSync(testFile);
      const readMs = performance.now() - t1;
      diskReadMBs = roundTo(data.byteLength / 1024 ** 2 / (readMs / 1e3), 1);
      node_fs.unlinkSync(testFile);
      details.push(`Disco: ${diskWriteMBs} MB/s write, ${diskReadMBs} MB/s read (32 MB)`);
    } catch (err) {
      details.push(`Disco: benchmark non disponibile (${err.message})`);
    }
    let renderFps = null;
    try {
      const res = await ffmpeg.runFfmpeg(
        ["-f", "lavfi", "-i", "testsrc2=size=1920x1080:rate=30:duration=2", "-c:v", "libx264", "-preset", "veryfast", "-f", "null", "-"],
        { timeoutMs: 6e4 }
      );
      if (res.code === 0) {
        const matches = [...res.stderr.matchAll(/fps=\s*([\d.]+)/g)];
        const last = matches[matches.length - 1];
        renderFps = last ? roundTo(Number(last[1]), 1) : null;
        details.push(`Encode CPU 1080p: ${renderFps ?? "n/d"} fps (libx264 veryfast)`);
      }
    } catch {
      details.push("Encode benchmark non disponibile (FFmpeg assente)");
    }
    return {
      at: (/* @__PURE__ */ new Date()).toISOString(),
      cpuScore,
      gpuScore: null,
      diskReadMBs,
      diskWriteMBs,
      renderFps,
      durationMs: Date.now() - started,
      details
    };
  }
}
function lastError(stderr) {
  const lines = stderr.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lines.slice(-6).join(" | ").slice(0, 2e3);
}
const hardware = new HardwareService();
const IMAGE_CODECS = /* @__PURE__ */ new Set(["png", "mjpeg", "jpeg", "bmp", "tiff", "webp", "exr", "dpx", "gif"]);
const IMAGE_EXTS = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "bmp", "tif", "tiff", "webp", "exr", "dpx", "gif"]);
function mediaIdFor(filePath) {
  const real = node_fs.existsSync(filePath) ? safeRealPath(filePath) : filePath;
  return `med_${node_crypto.createHash("sha1").update(real.toLowerCase()).digest("hex").slice(0, 12)}`;
}
function parseRate(rate) {
  if (!rate || rate === "0/0") return 0;
  const [num, den] = rate.split("/").map(Number);
  if (num === void 0 || den === void 0 || Number.isNaN(num) || Number.isNaN(den) || den === 0) return 0;
  return roundTo(num / den, 3);
}
function placeholderThumb(name, kind) {
  const color = kind === "audio" ? "#38d9a9" : kind === "image" ? "#ffb547" : "#7c5cff";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#15161d"/><rect x="1" y="1" width="318" height="178" fill="none" stroke="${color}" stroke-opacity=".35"/><text x="160" y="84" font-family="Inter,system-ui,sans-serif" font-size="13" fill="${color}" text-anchor="middle">${kind.toUpperCase()}</text><text x="160" y="106" font-family="Inter,system-ui,sans-serif" font-size="10" fill="#8b8fa3" text-anchor="middle">${escapeXml(name).slice(0, 34)}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
function escapeXml(input) {
  return input.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c] ?? c);
}
class MediaService {
  roots = /* @__PURE__ */ new Set();
  onProxyReady = null;
  registerRoot(filePath) {
    try {
      this.roots.add(node_path.dirname(safeRealPath(filePath)));
    } catch {
      this.roots.add(node_path.dirname(filePath));
    }
  }
  mediaRoots() {
    return [...this.roots];
  }
  async probe(filePath) {
    if (!node_fs.existsSync(filePath)) throw new Error("File non trovato");
    if (!isSupportedMediaFile(filePath)) throw new Error(`Formato non supportato: ${node_path.extname(filePath)}`);
    const real = safeRealPath(filePath);
    const stats2 = node_fs.statSync(real);
    const res = await ffmpeg.runFfprobe(["-v", "error", "-print_format", "json", "-show_format", "-show_streams", real], {
      timeoutMs: 3e4
    });
    if (res.code !== 0) throw new Error(`FFprobe ha fallito: ${res.stderr.slice(-800)}`);
    const data = JSON.parse(res.stdout);
    const streams = data.streams ?? [];
    const format = data.format ?? {};
    const video = streams.find((s) => s.codec_type === "video" && s.disposition !== void 0 && s.disposition.attached_pic !== 1);
    const audio = streams.find((s) => s.codec_type === "audio");
    const ext = node_path.extname(real).slice(1).toLowerCase();
    const isImage = IMAGE_EXTS.has(ext) && !audio && (!video || IMAGE_CODECS.has(String(video.codec_name)));
    const tags = format.tags ?? {};
    const videoTags = video?.tags ?? {};
    const transfer = String(video?.color_transfer ?? "");
    const sideData = video?.side_data_list ?? [];
    const rotation = Number(
      videoTags.rotate ?? sideData.find((s) => s.rotation !== void 0)?.rotation ?? 0
    );
    const duration = isImage ? 5 : Number(format.duration ?? video?.duration ?? audio?.duration ?? 0);
    const asset = {
      id: mediaIdFor(real),
      path: real,
      name: node_path.basename(real),
      kind: isImage ? "image" : audio && !video ? "audio" : "video",
      durationSec: roundTo(Math.max(0, duration), 3),
      width: Number(video?.width ?? 0),
      height: Number(video?.height ?? 0),
      fps: parseRate(video?.avg_frame_rate) || parseRate(video?.r_frame_rate) || (isImage ? 30 : 0),
      codec: String(video?.codec_name ?? audio?.codec_name ?? "unknown"),
      audioCodec: String(audio?.codec_name ?? ""),
      channels: Number(audio?.channels ?? 0),
      sampleRate: Number(audio?.sample_rate ?? 0),
      bitrate: Number(format.bit_rate ?? 0),
      colorSpace: transfer || "unknown",
      // Per-stream color tags: previously only the transfer was read, so no
      // downstream step could know the real matrix (601 vs 709) or range.
      colorMatrix: String(video?.color_space ?? ""),
      colorPrimaries: String(video?.color_primaries ?? ""),
      colorRange: String(video?.color_range ?? ""),
      rotation: Number.isFinite(rotation) ? rotation : 0,
      isHDR: transfer === "smpte2084" || transfer === "arib-std-b67",
      timecode: tags.timecode ?? null,
      fileSize: stats2.size,
      proxyPath: null,
      thumbnailPath: null,
      status: "online",
      importedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.registerRoot(real);
    return asset;
  }
  async thumbnail(filePath, timeSec = 1) {
    const key = node_crypto.createHash("sha1").update(`${filePath}:${Math.round(timeSec * 10)}`).digest("hex").slice(0, 16);
    const dir = appPaths().thumbnails;
    if (!node_fs.existsSync(dir)) node_fs.mkdirSync(dir, { recursive: true });
    const cacheFile = node_path.join(dir, `${key}.jpg`);
    if (node_fs.existsSync(cacheFile)) {
      return { dataUrl: `data:image/jpeg;base64,${node_fs.readFileSync(cacheFile).toString("base64")}`, fromCache: true };
    }
    try {
      const isImage = IMAGE_EXTS.has(node_path.extname(filePath).slice(1).toLowerCase());
      const args = isImage ? ["-i", filePath, "-frames:v", "1", "-vf", "scale=480:-2", "-q:v", "3", cacheFile] : ["-ss", String(timeSec), "-i", filePath, "-frames:v", "1", "-vf", "scale=480:-2", "-q:v", "3", cacheFile];
      const res = await ffmpeg.runFfmpeg(args, { timeoutMs: 3e4 });
      if (res.code !== 0 || !node_fs.existsSync(cacheFile)) throw new Error(res.stderr.slice(-300));
      return { dataUrl: `data:image/jpeg;base64,${node_fs.readFileSync(cacheFile).toString("base64")}`, fromCache: false };
    } catch (err) {
      logger.debug("media", `thumbnail placeholder for ${filePath}: ${err.message}`);
      return { dataUrl: placeholderThumb(node_path.basename(filePath), node_path.extname(filePath).match(/\.(wav|mp3|aac|flac|ogg)$/i) ? "audio" : "video"), fromCache: false };
    }
  }
  async waveform(filePath, buckets2) {
    const cacheFile = node_path.join(appPaths().waveforms, `${node_crypto.createHash("sha1").update(`${filePath}:${buckets2}`).digest("hex").slice(0, 16)}.json`);
    if (node_fs.existsSync(cacheFile)) {
      try {
        const parsed = JSON.parse(node_fs.readFileSync(cacheFile, "utf8"));
        if (Array.isArray(parsed.peaks)) return parsed;
      } catch {
      }
    }
    const info = ffmpeg.binaries().ffmpeg;
    const binPath = info.path;
    if (!binPath) throw new Error("FFmpeg non disponibile per la waveform");
    const result = await new Promise((resolvePromise, reject) => {
      const child = node_child_process.spawn(
        binPath,
        ["-hide_banner", "-v", "error", "-i", filePath, "-ac", "1", "-ar", "8000", "-f", "f32le", "-"],
        { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] }
      );
      let pending = Buffer.alloc(0);
      const WINDOW_SAMPLES = 160;
      const windows2 = [];
      let windowPeak = 0;
      let windowCount = 0;
      let totalSamples = 0;
      let bytes = 0;
      child.stdout.on("data", (chunk) => {
        bytes += chunk.length;
        if (bytes > 128 * 1024 * 1024) {
          child.kill();
          return;
        }
        const buf = pending.length ? Buffer.concat([pending, chunk]) : chunk;
        const usable = buf.length - buf.length % 4;
        pending = buf.subarray(usable);
        for (let i = 0; i < usable; i += 4) {
          const value = Math.abs(buf.readFloatLE(i));
          if (value > windowPeak) windowPeak = value;
          windowCount++;
          totalSamples++;
          if (windowCount >= WINDOW_SAMPLES) {
            windows2.push(windowPeak);
            windowPeak = 0;
            windowCount = 0;
          }
        }
      });
      child.on("error", reject);
      child.on("close", () => {
        if (windowCount > 0) windows2.push(windowPeak);
        const out = [];
        const step = windows2.length / Math.max(1, buckets2);
        for (let b = 0; b < buckets2; b++) {
          const start = Math.floor(b * step);
          const end = Math.min(windows2.length, Math.max(start + 1, Math.floor((b + 1) * step)));
          let peak = 0;
          for (let i = start; i < end; i++) peak = Math.max(peak, windows2[i] ?? 0);
          out.push(roundTo(peak, 3));
        }
        resolvePromise({ peaks: out, durationSec: roundTo(totalSamples / 8e3, 2) });
      });
    });
    const normalized = result.peaks.length ? result.peaks : computeWaveformPeaks(new Float32Array(0), buckets2);
    node_fs.writeFileSync(cacheFile, JSON.stringify({ peaks: normalized, durationSec: result.durationSec }), "utf8");
    return { peaks: normalized, durationSec: result.durationSec };
  }
  async generateProxy(asset, height = 540) {
    const dir = node_path.join(appPaths().proxies, asset.id);
    if (!node_fs.existsSync(dir)) node_fs.mkdirSync(dir, { recursive: true });
    const out = node_path.join(dir, `${asset.id}_${height}p.mp4`);
    if (node_fs.existsSync(out)) return out;
    const res = await ffmpeg.runFfmpeg(
      [
        "-i",
        asset.path,
        "-vf",
        `scale=-2:${height}`,
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "28",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-movflags",
        "+faststart",
        out
      ],
      { timeoutMs: 30 * 60 * 1e3, lowPriority: true }
    );
    if (res.code !== 0) throw new Error(`Proxy fallito: ${res.stderr.slice(-800)}`);
    logger.info("media", `proxy ready: ${asset.id} -> ${out}`);
    return out;
  }
  startProxy(asset) {
    void this.generateProxy(asset).then((proxyPath) => this.onProxyReady?.(asset.id, proxyPath)).catch((err) => logger.warn("media", `proxy failed for ${asset.id}: ${err.message}`));
  }
  missingFiles(paths) {
    return paths.filter((p) => !node_fs.existsSync(p));
  }
}
const media = new MediaService();
class SettingsService {
  current = defaultSettings;
  listeners = /* @__PURE__ */ new Set();
  init() {
    const raw = getKv("settings", null);
    const parsed = raw ? settingsSchema.safeParse(raw) : null;
    if (parsed && parsed.success) {
      this.current = parsed.data;
    } else {
      if (raw) logger.warn("settings", "stored settings invalid, falling back to defaults");
      this.current = defaultSettings;
      setKv("settings", this.current);
    }
    return this.current;
  }
  get() {
    return this.current;
  }
  update(patch) {
    const merged = {
      ...this.current,
      ...patch,
      shortcuts: { ...this.current.shortcuts, ...patch.shortcuts ?? {} },
      telemetry: false
    };
    const parsed = settingsSchema.parse(merged);
    this.current = parsed;
    setKv("settings", parsed);
    for (const listener of this.listeners) listener(parsed);
    logger.info("settings", `updated: ${Object.keys(patch).join(", ") || "no-op"}`);
    return parsed;
  }
  reset() {
    this.current = { ...defaultSettings };
    setKv("settings", this.current);
    for (const listener of this.listeners) listener(this.current);
    logger.info("settings", "reset to defaults");
    return this.current;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  /** Safe mode disables plugins, GPU acceleration and most startup automation. */
  isSafeMode() {
    return this.current.safeMode || process.env.MOLICUT_SAFE_MODE === "1";
  }
}
const settings = new SettingsService();
const ALLOWED_PERMISSIONS = /* @__PURE__ */ new Set([
  "video:effect",
  "audio:effect",
  "exporter",
  "importer",
  "generator",
  "encoder-preset",
  "watch-rule",
  "ui:panel",
  "media:read",
  "media:write"
]);
const manifestSchema = zod.z.object({
  id: zod.z.string().regex(/^[a-z0-9][a-z0-9._-]{1,80}$/i),
  name: zod.z.string().min(1).max(120),
  version: zod.z.string().min(1).max(32),
  vendor: zod.z.string().min(1).max(120),
  description: zod.z.string().max(2e3).default(""),
  entry: zod.z.string().max(512).default("index.js"),
  permissions: zod.z.array(zod.z.string()).max(32).default([]),
  capabilities: zod.z.array(zod.z.string()).max(32).default([])
});
function pluginsDir() {
  return node_path.join(appPaths().userData, "plugins");
}
function trustedKeys() {
  const path = node_path.join(process.resourcesPath ?? "", "plugin-keys.json");
  const fallback = node_path.join(electron.app.getAppPath(), "resources", "plugin-keys.json");
  const file = node_fs.existsSync(path) ? path : node_fs.existsSync(fallback) ? fallback : null;
  if (!file) return [];
  try {
    const parsed = JSON.parse(node_fs.readFileSync(file, "utf8"));
    return zod.z.array(zod.z.string().min(32)).parse(parsed);
  } catch {
    return [];
  }
}
function verifyManifest(raw, signatureBase64) {
  const keys = trustedKeys();
  if (keys.length === 0) return false;
  const signature = Buffer.from(signatureBase64, "base64");
  for (const key of keys) {
    try {
      if (node_crypto.verify("sha256", raw, node_crypto.createPublicKey(key), signature)) return true;
    } catch {
    }
  }
  return false;
}
class PluginService {
  enabledState() {
    return getKv("plugins.enabled", {});
  }
  readPlugin(dir) {
    try {
      const manifestFile = node_path.join(dir, "manifest.json");
      if (!node_fs.existsSync(manifestFile)) return null;
      const raw = node_fs.readFileSync(manifestFile);
      const manifest = manifestSchema.parse(JSON.parse(raw.toString("utf8")));
      const sigFile = node_path.join(dir, "manifest.sig");
      const signed = node_fs.existsSync(sigFile);
      const verified = signed && verifyManifest(raw, node_fs.readFileSync(sigFile, "utf8").trim());
      const permissions = manifest.permissions.filter((p) => ALLOWED_PERMISSIONS.has(p));
      const safeMode = settings.isSafeMode();
      return {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        vendor: manifest.vendor,
        description: manifest.description,
        permissions,
        enabled: !safeMode && verified && (this.enabledState()[manifest.id] ?? false),
        signed,
        verified,
        path: dir
      };
    } catch (err) {
      logger.warn("plugins", `invalid plugin at ${dir}: ${err.message}`);
      return null;
    }
  }
  list() {
    const dir = pluginsDir();
    if (!node_fs.existsSync(dir)) return [];
    return node_fs.readdirSync(dir).map((name) => node_path.join(dir, name)).filter((p) => {
      try {
        return node_fs.statSync(p).isDirectory();
      } catch {
        return false;
      }
    }).map((p) => this.readPlugin(p)).filter((p) => p !== null);
  }
  toggle(id, enabled) {
    const plugin = this.list().find((p) => p.id === id);
    if (!plugin) throw new Error("Plugin non trovato");
    if (enabled && !plugin.verified) throw new Error("Plugin non firmato o firma non valida: impossibile abilitarlo");
    const state = this.enabledState();
    state[id] = enabled;
    setKv("plugins.enabled", state);
    logger.info("plugins", `${id} ${enabled ? "enabled" : "disabled"}`);
    return this.list();
  }
  async install(archivePath) {
    const dir = pluginsDir();
    node_fs.mkdirSync(dir, { recursive: true, mode: 448 });
    const work = node_fs.mkdtempSync(node_path.join(os.tmpdir(), "molicut-plugin-"));
    try {
      if (archivePath.toLowerCase().endsWith(".zip")) {
        const zip = new AdmZip(archivePath);
        for (const entry of zip.getEntries()) {
          const target = assertZipEntrySafe(entry.entryName, work);
          if (entry.isDirectory) {
            node_fs.mkdirSync(target, { recursive: true });
          } else {
            node_fs.mkdirSync(node_path.join(target, ".."), { recursive: true });
            node_fs.writeFileSync(target, entry.getData());
          }
        }
      } else {
        const sourceManifest = node_path.join(archivePath, "manifest.json");
        if (!node_fs.existsSync(sourceManifest)) throw new Error("manifest.json mancante");
        for (const name of node_fs.readdirSync(archivePath)) {
          const src = node_path.join(archivePath, name);
          if (node_fs.statSync(src).isFile()) node_fs.copyFileSync(src, node_path.join(work, name));
        }
      }
      const manifestFile = node_path.join(work, "manifest.json");
      if (!node_fs.existsSync(manifestFile)) throw new Error("manifest.json mancante");
      const raw = node_fs.readFileSync(manifestFile);
      const manifest = manifestSchema.parse(JSON.parse(raw.toString("utf8")));
      const sigFile = node_path.join(work, "manifest.sig");
      const verified = node_fs.existsSync(sigFile) && verifyManifest(raw, node_fs.readFileSync(sigFile, "utf8").trim());
      if (electron.app.isPackaged && !verified) throw new Error("Plugin rifiutato: firma assente o non valida");
      const destination = node_path.join(dir, manifest.id);
      node_fs.mkdirSync(destination, { recursive: true, mode: 448 });
      for (const name of node_fs.readdirSync(work)) node_fs.copyFileSync(node_path.join(work, name), node_path.join(destination, node_path.basename(name)));
      const info = this.readPlugin(destination);
      if (!info) throw new Error("Plugin installato ma non valido");
      logger.info("plugins", `installed ${manifest.id} (${verified ? "verified" : "unsigned, disabled"})`);
      return info;
    } finally {
      node_fs.rmSync(work, { recursive: true, force: true });
    }
  }
}
const plugins = new PluginService();
const FIXED_DATE = "2026-01-01T00:00:00.000Z";
const baseVideo = {
  codec: "h264",
  encoderPolicy: "auto",
  width: null,
  height: null,
  fps: null,
  bitrateMode: "vbr",
  bitrateKbps: 12e3,
  crf: 20,
  gopSeconds: 2,
  preset: "medium",
  profile: null,
  pixelFormat: "yuv420p",
  colorSpace: "rec709",
  hdr: "none"
};
const baseAudio = {
  codec: "aac",
  bitrateKbps: 192,
  channels: 2,
  sampleRate: 48e3,
  loudness: { enabled: false, targetLufs: -16, truePeakDb: -1, lra: 11 }
};
function seed(input) {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    container: input.container,
    video: { ...baseVideo, ...input.video },
    audio: { ...baseAudio, ...input.audio },
    filters: { lut: null, burnSubtitles: false, subtitlePath: null, scaleMode: "fit", colorConversion: true },
    output: { suffix: input.suffix ?? "", directory: null },
    tags: input.tags,
    version: 1,
    builtin: true,
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE
  };
}
function builtinPresets() {
  return [
    seed({
      id: "builtin-youtube-1080p",
      name: "YouTube 1080p",
      description: "H.264 1080p30 VBR 12 Mbps, AAC 192 kbps, faststart.",
      container: "mp4",
      video: { width: 1920, height: 1080, fps: 30, bitrateKbps: 12e3, preset: "medium", profile: "high" },
      audio: { codec: "aac", bitrateKbps: 192 },
      tags: ["web", "youtube", "h264"]
    }),
    seed({
      id: "builtin-youtube-4k",
      name: "YouTube 4K",
      description: "H.265/HEVC 2160p VBR 45 Mbps con fallback hardware automatico.",
      container: "mp4",
      video: {
        codec: "hevc",
        width: 3840,
        height: 2160,
        fps: 30,
        bitrateKbps: 45e3,
        preset: "slow",
        profile: "main10",
        pixelFormat: "yuv420p10le"
      },
      audio: { bitrateKbps: 256 },
      tags: ["web", "youtube", "hevc", "4k"]
    }),
    seed({
      id: "builtin-vimeo-1080p",
      name: "Vimeo 1080p",
      description: "H.264 1080p VBR 10 Mbps, audio AAC 192 kbps.",
      container: "mp4",
      video: { width: 1920, height: 1080, bitrateKbps: 1e4 },
      tags: ["web", "vimeo"]
    }),
    seed({
      id: "builtin-instagram-reels",
      name: "Instagram Reels",
      description: "Verticale 1080x1920 30 fps, 8 Mbps, AAC 128 kbps.",
      container: "mp4",
      video: { width: 1080, height: 1920, fps: 30, bitrateKbps: 8e3, preset: "veryfast" },
      audio: { bitrateKbps: 128 },
      tags: ["social", "vertical", "instagram"]
    }),
    seed({
      id: "builtin-tiktok",
      name: "TikTok 1080x1920",
      description: "Verticale 9:16, GOP 1s, bitrate 8 Mbps, loudness -14 LUFS.",
      container: "mp4",
      video: { width: 1080, height: 1920, fps: 30, bitrateKbps: 8e3, gopSeconds: 1, preset: "veryfast" },
      audio: { bitrateKbps: 128, loudness: { enabled: true, targetLufs: -14, truePeakDb: -1, lra: 9 } },
      tags: ["social", "vertical", "tiktok"]
    }),
    seed({
      id: "builtin-broadcast-prores-422hq",
      name: "ProRes 422 HQ",
      description: "Master broadcast Apple ProRes 422 HQ 1080p, PCM 24-bit 48 kHz.",
      container: "mov",
      video: { codec: "prores", width: 1920, height: 1080, fps: 25, bitrateMode: "vbr", bitrateKbps: 22e4, profile: "hq", pixelFormat: "yuv422p10le" },
      audio: { codec: "pcm_s24le", bitrateKbps: 2304 },
      tags: ["broadcast", "prores", "master"]
    }),
    seed({
      id: "builtin-broadcast-dnxhr-hqx",
      name: "DNxHR HQX",
      description: "Avid DNxHR HQX 10-bit 1080p per workflow broadcast.",
      container: "mov",
      video: { codec: "dnxhr", width: 1920, height: 1080, fps: 25, bitrateKbps: 18e4, profile: "hqx", pixelFormat: "yuv422p10le" },
      audio: { codec: "pcm_s24le", bitrateKbps: 2304 },
      tags: ["broadcast", "dnxhr", "master"]
    }),
    seed({
      id: "builtin-master-hdr10",
      name: "Master HDR10",
      description: "HEVC 10-bit, Rec.2020 PQ, metadata HDR10 statici, 60 Mbps.",
      container: "mp4",
      video: {
        codec: "hevc",
        width: 3840,
        height: 2160,
        fps: 24,
        bitrateKbps: 6e4,
        profile: "main10",
        pixelFormat: "yuv420p10le",
        colorSpace: "rec2020",
        hdr: "hdr10",
        hdrMastering: { maxLuminance: 1e3, minLuminance: 5e-3, maxCLL: 1e3, maxFALL: 400 }
      },
      audio: { bitrateKbps: 320 },
      tags: ["hdr", "master", "hdr10"]
    }),
    seed({
      id: "builtin-master-hlg",
      name: "Master HLG",
      description: "HEVC 10-bit HLG per distribuzione broadcast HDR.",
      container: "mp4",
      video: {
        codec: "hevc",
        width: 3840,
        height: 2160,
        fps: 25,
        bitrateKbps: 5e4,
        profile: "main10",
        pixelFormat: "yuv420p10le",
        colorSpace: "rec2020",
        hdr: "hlg"
      },
      tags: ["hdr", "hlg", "broadcast"]
    }),
    seed({
      id: "builtin-audio-wav",
      name: "WAV 48 kHz 24-bit",
      description: "Solo audio PCM 24-bit, loudness normalization opzionale.",
      container: "wav",
      video: { codec: "none" },
      audio: { codec: "pcm_s24le", bitrateKbps: 2304, sampleRate: 48e3 },
      tags: ["audio", "wav"]
    }),
    seed({
      id: "builtin-audio-mp3",
      name: "MP3 320 kbps",
      description: "Audio MP3 CBR 320 kbps 44.1 kHz.",
      container: "mp3",
      video: { codec: "none" },
      audio: { codec: "mp3", bitrateKbps: 320, sampleRate: 44100 },
      tags: ["audio", "mp3"]
    }),
    seed({
      id: "builtin-audio-aac",
      name: "AAC 256 kbps",
      description: "Audio AAC-LC 256 kbps dentro container MP4 (solo audio).",
      container: "mp4",
      video: { codec: "none" },
      audio: { codec: "aac", bitrateKbps: 256 },
      tags: ["audio", "aac"]
    }),
    seed({
      id: "builtin-gif",
      name: "GIF 720p",
      description: "GIF 15 fps, palette 256 colori, larghezza 720.",
      container: "gif",
      video: { codec: "gif", width: 720, height: null, fps: 15, bitrateMode: "crf", crf: 0 },
      audio: { codec: "none" },
      tags: ["image", "gif", "social"]
    }),
    seed({
      id: "builtin-webm-vp9",
      name: "WebM VP9",
      description: "VP9 CRF 32 + Opus 128 kbps, per web moderno.",
      container: "webm",
      video: { codec: "vp9", bitrateMode: "crf", crf: 32, preset: "good", pixelFormat: "yuv420p" },
      audio: { codec: "opus", bitrateKbps: 128 },
      tags: ["web", "webm", "vp9"]
    }),
    seed({
      id: "builtin-av1",
      name: "AV1 SVT 1080p",
      description: "SVT-AV1 CRF 30, massima efficienza, fallback software.",
      container: "mp4",
      video: { codec: "av1", width: 1920, height: 1080, bitrateMode: "crf", crf: 30, preset: "6" },
      tags: ["web", "av1", "efficient"]
    }),
    seed({
      id: "builtin-image-png",
      name: "Sequenza PNG",
      description: "Image sequence PNG RGBA, un frame per file.",
      container: "image2",
      video: { codec: "png", bitrateMode: "crf", crf: 0, pixelFormat: "rgba" },
      audio: { codec: "none" },
      suffix: "_%04d",
      tags: ["image", "sequence", "vfx"]
    })
  ];
}
class PresetService {
  cached = null;
  list() {
    if (this.cached) return this.cached;
    return this.reload();
  }
  reload() {
    const rows = getDb().prepare("SELECT payload FROM presets ORDER BY name ASC").all();
    const custom = [];
    for (const row of rows) {
      try {
        const parsed = encodePresetSchema.safeParse(JSON.parse(row.payload));
        if (parsed.success) custom.push(parsed.data);
      } catch {
        logger.warn("presets", "skipping corrupted preset row");
      }
    }
    this.cached = [...builtinPresets(), ...custom];
    return this.cached;
  }
  get(id) {
    return this.list().find((p) => p.id === id);
  }
  save(input) {
    const preset = encodePresetSchema.parse(input);
    if (preset.builtin) throw new Error("I preset integrati non sono modificabili: crea una copia");
    const existing = this.get(preset.id);
    if (existing) {
      preset.version = existing.version + 1;
    }
    preset.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    getDb().prepare(
      "INSERT INTO presets (id, name, builtin, updated_at, payload) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, updated_at=excluded.updated_at, payload=excluded.payload"
    ).run(preset.id, preset.name, 0, preset.updatedAt, JSON.stringify(preset));
    this.cached = null;
    logger.info("presets", `saved ${preset.id} v${preset.version}`);
    return preset;
  }
  delete(id) {
    getDb().prepare("DELETE FROM presets WHERE id = ? AND builtin = 0").run(id);
    this.cached = null;
    return this.list();
  }
  exportToFile(path, ids) {
    const presets2 = this.list().filter((p) => !ids || ids.includes(p.id)).map((p) => ({ ...p, builtin: false }));
    const payload = { schemaVersion: 1, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), presets: presets2 };
    node_fs.writeFileSync(path, JSON.stringify(payload, null, 2), { encoding: "utf8", mode: 384 });
    logger.info("presets", `exported ${presets2.length} presets`);
  }
  importFromFile(path) {
    const raw = JSON.parse(node_fs.readFileSync(path, "utf8"));
    const containerSchema = zod.z.object({ presets: zod.z.array(zod.z.unknown()) }).or(zod.z.array(zod.z.unknown()));
    const parsed = containerSchema.parse(raw);
    const list = Array.isArray(parsed) ? parsed : parsed.presets;
    const imported = [];
    for (const item of list) {
      const candidate = encodePresetSchema.safeParse(item);
      if (!candidate.success) {
        logger.warn("presets", `skipping invalid imported preset: ${candidate.error.issues[0]?.message}`);
        continue;
      }
      const preset = { ...candidate.data, builtin: false, id: uid("pst") };
      imported.push(this.save(preset));
    }
    return imported;
  }
  /** Heuristic matching: resolution, HDR, orientation, duration, audio-only. */
  suggest(asset) {
    const all = this.list();
    const pick = (id) => all.find((p) => p.id === id);
    const result = [];
    if (asset.kind === "audio") {
      result.push(pick("builtin-audio-wav"), pick("builtin-audio-aac"));
      return result.filter(Boolean);
    }
    if (asset.isHDR) result.push(pick("builtin-master-hdr10"), pick("builtin-master-hlg"));
    if (asset.height > 0 && asset.width > 0 && asset.height > asset.width) {
      result.push(pick("builtin-tiktok"), pick("builtin-instagram-reels"));
    }
    if (asset.height >= 2e3) result.push(pick("builtin-youtube-4k"));
    result.push(pick("builtin-youtube-1080p"), pick("builtin-webm-vp9"), pick("builtin-broadcast-prores-422hq"));
    return [...new Set(result.filter(Boolean))].slice(0, 5);
  }
}
const presets = new PresetService();
function createTrack(kind, index) {
  const prefix = kind === "video" ? "V" : kind === "audio" ? "A" : kind === "subtitle" ? "T" : kind === "adjustment" ? "ADJ" : "N";
  return {
    id: uid("trk"),
    kind,
    name: `${prefix}${index}`,
    height: kind === "audio" ? 56 : kind === "subtitle" ? 48 : 72,
    mute: false,
    solo: false,
    locked: false,
    volume: 1,
    pan: 0,
    clips: []
  };
}
function createSequence(name = "Sequence 01", width = 1920, height = 1080, fps = 30) {
  return {
    id: uid("seq"),
    name,
    width,
    height,
    fps,
    duration: 300,
    colorSpace: "rec709",
    tracks: [createTrack("video", 2), createTrack("video", 1), createTrack("subtitle", 1), createTrack("audio", 1)],
    markers: []
  };
}
function createProject(name = "Untitled Project") {
  const sequence = createSequence("Sequence 01");
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: uid("prj"),
    name,
    createdAt: now,
    modifiedAt: now,
    activeSequenceId: sequence.id,
    sequences: [sequence],
    media: []
  };
}
function sequenceContentDuration(sequence) {
  let end = 0;
  for (const track of sequence.tracks) {
    for (const clip of track.clips) end = Math.max(end, clip.start + clip.duration);
  }
  return end;
}
function xmlEscape(input) {
  return input.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c] ?? c);
}
function mediaPath(project, mediaId) {
  if (!mediaId) return null;
  return project.media.find((m) => m.id === mediaId)?.path ?? null;
}
function exportEdl(project, sequence) {
  const lines = [];
  const fps = Math.round(sequence.fps);
  lines.push(`TITLE: ${sequence.name}`);
  lines.push("FCM: NON-DROP FRAME");
  lines.push("");
  let eventNumber = 1;
  const videoTracks = sequence.tracks.filter((t) => t.kind === "video");
  for (const track of videoTracks) {
    const clips = [...track.clips].sort((a, b) => a.start - b.start);
    for (const clip of clips) {
      const reel = mediaPath(project, clip.mediaId) ? "AX" : "BL";
      const srcIn = formatTimecode(clip.inPoint, fps);
      const srcOut = formatTimecode(clip.inPoint + clip.duration, fps);
      const recIn = formatTimecode(clip.start, fps);
      const recOut = formatTimecode(clip.start + clip.duration, fps);
      lines.push(`${String(eventNumber).padStart(3, "0")}  ${reel.padEnd(8)} V     C        ${srcIn} ${srcOut} ${recIn} ${recOut}`);
      lines.push(`* FROM CLIP NAME: ${clip.name}`);
      if (track.kind === "video" && track.name) lines.push(`* TRACK: ${track.name}`);
      lines.push("");
      eventNumber++;
    }
  }
  return lines.join("\n");
}
function exportFcpXml(project, sequence) {
  const frameDuration = `1/${Math.round(sequence.fps)}s`;
  const items = sequence.tracks.filter((t) => t.kind === "video").flatMap((t) => t.clips).sort((a, b) => a.start - b.start).map((clip) => {
    const path = mediaPath(project, clip.mediaId);
    const assetName = clip.name;
    return [
      `        <clip offset="${clip.start}s" duration="${clip.duration}s" name="${xmlEscape(assetName)}" start="${clip.inPoint}s">`,
      `          <video ref="r1"/>`,
      path ? `          <note>${xmlEscape(path)}</note>` : "",
      "        </clip>"
    ].filter(Boolean).join("\n");
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <resources>
    <format id="r1" name="FFVideoFormat_${sequence.width}x${sequence.height}_${Math.round(sequence.fps)}" frameDuration="${frameDuration}" width="${sequence.width}" height="${sequence.height}"/>
  </resources>
  <library>
    <event name="MoliCut Export">
      <project name="${xmlEscape(sequence.name)}">
        <sequence format="r1" duration="${sequence.duration}s" tcStart="0s" tcFormat="NDF">
          <spine>
${items}
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
`;
}
function exportPremiereXml(project, sequence) {
  const fps = Math.round(sequence.fps);
  const toFrames = (seconds) => Math.round(seconds * fps);
  const videoTracks = sequence.tracks.filter((t) => t.kind === "video");
  let clipIndex = 1;
  let fileIndex = 1;
  const tracks = videoTracks.map((track) => {
    const items = [...track.clips].sort((a, b) => a.start - b.start).map((clip) => {
      const path = mediaPath(project, clip.mediaId);
      const fileId = `file-${fileIndex++}`;
      const fileBlock = path ? `<file id="${fileId}"><name>${xmlEscape(clip.name)}</name><pathurl>${xmlEscape(node_url.pathToFileURL(path).href)}</pathurl><rate><timebase>${fps}</timebase><ntsc>FALSE</ntsc></rate></file>` : "";
      return `<clipitem id="clipitem-${clipIndex++}"><name>${xmlEscape(clip.name)}</name><enabled>TRUE</enabled><duration>${toFrames(clip.duration)}</duration><rate><timebase>${fps}</timebase><ntsc>FALSE</ntsc></rate><start>${toFrames(clip.start)}</start><end>${toFrames(clip.start + clip.duration)}</end><in>${toFrames(clip.inPoint)}</in><out>${toFrames(clip.inPoint + clip.duration)}</out>${fileBlock}</clipitem>`;
    }).join("");
    return `<track>${items}</track>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4">
  <sequence id="sequence-1">
    <name>${xmlEscape(sequence.name)}</name>
    <duration>${toFrames(sequence.duration)}</duration>
    <rate><timebase>${fps}</timebase><ntsc>FALSE</ntsc></rate>
    <media>
      <video>
        <format><samplecharacteristics><width>${sequence.width}</width><height>${sequence.height}</height><pixelaspectratio>square</pixelaspectratio></samplecharacteristics></format>
        ${tracks}
      </video>
    </media>
  </sequence>
</xmeml>
`;
}
const MAX_PROJECT_BYTES = 64 * 1024 * 1024;
class ProjectService {
  newProject(name) {
    const project = createProject(name.trim() || "Untitled Project");
    logger.info("project", `created ${project.id} (${project.name})`);
    return project;
  }
  recent() {
    return getDb().prepare("SELECT path FROM recent_projects ORDER BY opened_at DESC LIMIT 12").all().map((r) => r.path).filter((p) => node_fs.existsSync(p));
  }
  addRecent(path) {
    getDb().prepare("INSERT INTO recent_projects (path, opened_at) VALUES (?, ?) ON CONFLICT(path) DO UPDATE SET opened_at=excluded.opened_at").run(path, (/* @__PURE__ */ new Date()).toISOString());
    const items = this.recent();
    settings.update({ recentProjects: items });
  }
  async openWithDialog(parent) {
    const filters = [{ name: "MoliCut Project", extensions: ["mcut", "ncut"] }];
    const result = parent ? await electron.dialog.showOpenDialog(parent, { title: "Apri progetto MoliCut", filters, properties: ["openFile"] }) : await electron.dialog.showOpenDialog({ title: "Apri progetto MoliCut", filters, properties: ["openFile"] });
    if (result.canceled || result.filePaths.length === 0) return { canceled: true };
    const opened = await this.open(result.filePaths[0]);
    return { canceled: false, ...opened };
  }
  async open(path) {
    const real = safeRealPath(path);
    if (!node_fs.existsSync(real)) throw new Error("Progetto non trovato");
    const stats2 = node_fs.statSync(real);
    if (stats2.size > MAX_PROJECT_BYTES) throw new Error("Progetto troppo grande o corrotto");
    const raw = JSON.parse(node_fs.readFileSync(real, "utf8"));
    const parsed = projectSchema.parse(raw);
    for (const asset of parsed.media) {
      asset.status = node_fs.existsSync(asset.path) ? "online" : "offline";
      asset.proxyPath = asset.proxyPath && node_fs.existsSync(asset.proxyPath) ? asset.proxyPath : null;
    }
    this.addRecent(real);
    logger.info("project", `opened ${real} (${parsed.sequences.length} sequences)`);
    return { project: parsed, path: real };
  }
  async save(parent, project, requestedPath) {
    const parsed = projectSchema.parse({ ...project, modifiedAt: (/* @__PURE__ */ new Date()).toISOString() });
    let target = requestedPath;
    if (!target) {
      const suggested = node_path.join(appPaths().projects, `${parsed.name.replace(/[<>:"/\\|?*]/g, "_")}.mcut`);
      const result = parent ? await electron.dialog.showSaveDialog(parent, {
        title: "Salva progetto",
        defaultPath: suggested,
        filters: [{ name: "MoliCut Project", extensions: ["mcut"] }]
      }) : await electron.dialog.showSaveDialog({
        title: "Salva progetto",
        defaultPath: suggested,
        filters: [{ name: "MoliCut Project", extensions: ["mcut"] }]
      });
      if (result.canceled || !result.filePath) return { path: "", savedAt: "", canceled: true };
      target = result.filePath;
    }
    const targetExt = node_path.extname(target).toLowerCase();
    if (targetExt !== ".mcut" && targetExt !== ".ncut") target = `${target}.mcut`;
    const real = safeRealPath(target);
    assertWritablePath(real);
    if (!node_fs.existsSync(node_path.dirname(real))) node_fs.mkdirSync(node_path.dirname(real), { recursive: true });
    if (node_fs.existsSync(real)) this.snapshot(real);
    const tmp = `${real}.tmp-${process.pid}`;
    node_fs.writeFileSync(tmp, JSON.stringify(parsed, null, 2), { encoding: "utf8", mode: 384 });
    node_fs.renameSync(tmp, real);
    this.addRecent(real);
    logger.info("project", `saved ${real}`);
    return { path: real, savedAt: parsed.modifiedAt, canceled: false };
  }
  autosave(project) {
    const parsed = projectSchema.parse(project);
    const dir = appPaths().projects;
    if (!node_fs.existsSync(dir)) node_fs.mkdirSync(dir, { recursive: true });
    const path = node_path.join(dir, `${parsed.id}.autosave.mcut`);
    const tmp = `${path}.tmp`;
    node_fs.writeFileSync(tmp, JSON.stringify(parsed), "utf8");
    node_fs.renameSync(tmp, path);
    return { path, savedAt: (/* @__PURE__ */ new Date()).toISOString() };
  }
  /** Newest valid autosave, used after an unclean shutdown. */
  latestAutosave() {
    const dir = appPaths().projects;
    if (!node_fs.existsSync(dir)) return null;
    const candidates = node_fs.readdirSync(dir).filter((name) => name.toLowerCase().endsWith(".autosave.mcut")).map((name) => {
      const path = node_path.join(dir, name);
      try {
        return { path, at: node_fs.statSync(path).mtimeMs, size: node_fs.statSync(path).size };
      } catch {
        return null;
      }
    }).filter((item) => item !== null && item.size <= MAX_PROJECT_BYTES).sort((a, b) => b.at - a.at);
    for (const candidate of candidates.slice(0, 5)) {
      try {
        const project = projectSchema.parse(JSON.parse(node_fs.readFileSync(candidate.path, "utf8")));
        logger.info("project", `recovered autosave ${candidate.path}`);
        return { project, path: candidate.path, savedAt: new Date(candidate.at).toISOString() };
      } catch (err) {
        logger.warn("project", `ignored corrupt autosave ${candidate.path}: ${err.message}`);
      }
    }
    return null;
  }
  /** Keep the last 10 snapshots of a project next to the backups directory. */
  snapshot(projectPath) {
    try {
      const dir = appPaths().backups;
      if (!node_fs.existsSync(dir)) node_fs.mkdirSync(dir, { recursive: true });
      const ext = node_path.extname(projectPath).toLowerCase() || ".mcut";
      const stem = node_path.basename(projectPath, ext);
      node_fs.copyFileSync(projectPath, node_path.join(dir, `${stem}-${Date.now()}${ext}`));
      const old = node_fs.readdirSync(dir).filter((f) => f.startsWith(`${stem}-`) && f.endsWith(ext)).sort();
      for (const file of old.slice(0, Math.max(0, old.length - 10))) {
        try {
          node_fs.unlinkSync(node_path.join(dir, file));
        } catch {
        }
      }
    } catch (err) {
      logger.warn("project", `snapshot failed: ${err.message}`);
    }
  }
  async exportInterchange(parent, project, sequenceId, format) {
    const sequence = project.sequences.find((s) => s.id === sequenceId);
    if (!sequence) throw new Error("Sequenza non trovata");
    const ext = format === "edl" ? "edl" : format === "fcpxml" ? "fcpxml" : "xml";
    const result = await electron.dialog.showSaveDialog(parent ?? void 0, {
      title: `Esporta ${format.toUpperCase()}`,
      defaultPath: node_path.join(appPaths().projects, `${sequence.name.replace(/[<>:"/\\|?*]/g, "_")}.${ext}`),
      filters: [{ name: format.toUpperCase(), extensions: [ext] }]
    });
    if (result.canceled || !result.filePath) return { path: "", canceled: true };
    const target = safeRealPath(result.filePath);
    assertWritablePath(target);
    const content = format === "edl" ? exportEdl(project, sequence) : format === "fcpxml" ? exportFcpXml(project, sequence) : exportPremiereXml(project, sequence);
    node_fs.writeFileSync(target, content, "utf8");
    logger.info("project", `interchange exported ${format} -> ${target}`);
    return { path: target, canceled: false };
  }
}
const projectService = new ProjectService();
function isTransientError(message) {
  return /file lock|text file busy|resource busy|ebusy|eagain|temporarily|gpu.*(busy|occup)|device.*(busy|in use)|cannot open|sharing violation|lock/i.test(
    message
  );
}
function nextAttemptDelay(attempts) {
  return Math.min(300, 5 * 2 ** Math.max(0, attempts - 1));
}
function escapeFilterPath(filePath) {
  return filePath.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "\\'");
}
function escapeDrawText(value) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/:/g, "\\:").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/%/g, "\\%").replace(/\r?\n/g, "\\n");
}
function findFontFile() {
  const candidates = process.platform === "win32" ? [
    "C:\\Windows\\Fonts\\segoeui.ttf",
    "C:\\Windows\\Fonts\\segoeuib.ttf",
    "C:\\Windows\\Fonts\\arial.ttf",
    "C:\\Windows\\Fonts\\calibri.ttf"
  ] : process.platform === "darwin" ? ["/System/Library/Fonts/Helvetica.ttc", "/System/Library/Fonts/SFNS.ttf", "/Library/Fonts/Arial.ttf"] : [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/TTF/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
  ];
  return candidates.find((candidate) => node_fs.existsSync(candidate)) ?? null;
}
function colorValue(value) {
  return /^#[0-9a-f]{6}$/i.test(value ?? "") ? `0x${value.slice(1)}` : "0xffffff";
}
function numberParam(effectParams, key, fallback) {
  const raw = effectParams[key];
  const value = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(value) ? value : fallback;
}
function effectFilters(clip, notes) {
  const filters = [];
  for (const effect of clip.effects) {
    if (!effect.enabled) continue;
    switch (effect.type) {
      case "Gaussian Blur": {
        const radius = Math.max(0, numberParam(effect.params, "radius", 8));
        if (radius > 0) filters.push(`gblur=sigma=${roundTo(radius / 2, 2)}`);
        break;
      }
      case "Box Blur": {
        const radius = Math.max(0, Math.round(numberParam(effect.params, "radius", 6)));
        if (radius > 0) filters.push(`boxblur=${radius}:1`);
        break;
      }
      case "Directional Blur": {
        const length = Math.max(0, numberParam(effect.params, "length", 12));
        if (length > 0) filters.push(`gblur=sigma=${roundTo(length / 4, 2)}`);
        break;
      }
      case "Sharpen": {
        const amount = clamp(numberParam(effect.params, "amount", 0.5), 0, 2);
        filters.push(`unsharp=5:5:${roundTo(amount, 3)}`);
        break;
      }
      case "Film Grain":
      case "Noise": {
        const amount = clamp(numberParam(effect.params, "amount", 0.25), 0, 1);
        filters.push(`noise=alls=${Math.round(amount * 40)}:allf=t`);
        break;
      }
      case "Chroma Key": {
        const tolerance = clamp(numberParam(effect.params, "tolerance", 0.25), 0, 1);
        const spill = clamp(numberParam(effect.params, "spill", 0.1), 0, 1);
        filters.push(`format=rgba`, `colorkey=0x00ff00:${roundTo(tolerance, 3)}:${roundTo(spill, 3)}`);
        break;
      }
      case "Crop": {
        const left = clamp(numberParam(effect.params, "left", 0) / 100, 0, 0.95);
        const right = clamp(numberParam(effect.params, "right", 0) / 100, 0, 0.95);
        const top = clamp(numberParam(effect.params, "top", 0) / 100, 0, 0.95);
        const bottom = clamp(numberParam(effect.params, "bottom", 0) / 100, 0, 0.95);
        if (left + right < 0.95 && top + bottom < 0.95) {
          filters.push(
            `crop=iw*${roundTo(1 - left - right, 4)}:ih*${roundTo(1 - top - bottom, 4)}:iw*${roundTo(left, 4)}:ih*${roundTo(top, 4)}`
          );
        }
        break;
      }
      case "Color Wheels":
      case "Cinematic LUT": {
        const contrast = clamp(numberParam(effect.params, "contrast", 1.05), 0.2, 3);
        const saturation = clamp(numberParam(effect.params, "saturation", 1), 0, 3);
        const brightness = clamp(numberParam(effect.params, "lift", 0) * 0.15, -1, 1);
        filters.push(`eq=contrast=${roundTo(contrast, 3)}:saturation=${roundTo(saturation, 3)}:brightness=${roundTo(brightness, 3)}`);
        break;
      }
      case "Glow":
        filters.push(`gblur=sigma=${roundTo(Math.max(1, numberParam(effect.params, "radius", 16) / 4), 2)}`);
        break;
      case "Timecode Burn-in":
      case "Text Generator":
      case "Opacity":
      case "Luma Key":
      case "Transform":
        break;
      default:
        notes.push(`Effetto "${effect.type}" non riproducibile in export: ignorato.`);
    }
  }
  return filters;
}
function audible(track, hasSolo) {
  return !track.mute && (!hasSolo || track.solo);
}
function atempoChain(speed) {
  let remaining = clamp(speed, 0.05, 20);
  const filters = [];
  while (remaining > 2.0001) {
    filters.push("atempo=2");
    remaining /= 2;
  }
  while (remaining < 0.4999) {
    filters.push("atempo=0.5");
    remaining /= 0.5;
  }
  if (Math.abs(remaining - 1) > 1e-3) filters.push(`atempo=${roundTo(remaining, 5)}`);
  return filters;
}
function buildTimelineGraph(project, sequence, preset, options = {}) {
  const notes = [];
  const assets = new Map(project.media.map((asset) => [asset.id, asset]));
  const hasSolo = sequence.tracks.some((track) => track.solo);
  const videoTracks = sequence.tracks.filter(
    (track) => (track.kind === "video" || track.kind === "adjustment") && audible(track, hasSolo)
  );
  const audioTracks = sequence.tracks.filter((track) => track.kind === "audio" && audible(track, hasSolo));
  const textTracks = sequence.tracks.filter((track) => audible(track, hasSolo));
  const videoClips = [];
  for (const track of videoTracks) {
    for (const clip of track.clips) {
      if (clip.text) continue;
      const asset = clip.mediaId ? assets.get(clip.mediaId) : null;
      if (asset && (asset.kind === "video" || asset.kind === "image")) videoClips.push({ clip, track });
    }
  }
  const audioClips = [];
  for (const track of audioTracks) {
    for (const clip of track.clips) {
      const asset = clip.mediaId ? assets.get(clip.mediaId) : null;
      if (asset && asset.channels > 0) audioClips.push({ clip, track });
    }
  }
  const textClips = [];
  for (const track of textTracks) {
    for (const clip of track.clips) if (clip.text?.content.trim()) textClips.push({ clip, track });
  }
  const specs = /* @__PURE__ */ new Map();
  const ensureSpec = (mediaId) => {
    const asset = assets.get(mediaId);
    if (!asset) return null;
    let spec = specs.get(mediaId);
    if (!spec) {
      spec = {
        index: specs.size,
        path: asset.path,
        loop: asset.kind === "image",
        videoCount: 0,
        audioCount: 0,
        videoLabels: [],
        audioLabels: [],
        videoCursor: 0,
        audioCursor: 0
      };
      specs.set(mediaId, spec);
    }
    return spec;
  };
  for (const { clip } of videoClips) if (clip.mediaId) ensureSpec(clip.mediaId).videoCount += 1;
  for (const { clip } of audioClips) if (clip.mediaId) ensureSpec(clip.mediaId).audioCount += 1;
  for (const [mediaId, spec] of specs) {
    for (let i = 0; i < spec.videoCount; i++) spec.videoLabels.push(`src${spec.index}_v${i}`);
    for (let i = 0; i < spec.audioCount; i++) spec.audioLabels.push(`src${spec.index}_a${i}`);
  }
  const durationSec = Math.max(0.1, sequenceContentDuration(sequence));
  const width = sequence.width;
  const height = sequence.height;
  const fps = sequence.fps;
  const filters = [];
  filters.push(`color=c=black:s=${width}x${height}:r=${fps}:d=${roundTo(durationSec, 3)}[base]`);
  for (const spec of specs.values()) {
    if (spec.videoCount > 1) {
      const labels = spec.videoLabels.map((label) => `[${label}]`).join("");
      filters.push(`[${spec.index}:v]split=${spec.videoCount}${labels}`);
    } else if (spec.videoCount === 1) {
      spec.videoLabels[0] = `${spec.index}:v`;
    }
    if (spec.audioCount > 1) {
      const labels = spec.audioLabels.map((label) => `[${label}]`).join("");
      filters.push(`[${spec.index}:a]asplit=${spec.audioCount}${labels}`);
    } else if (spec.audioCount === 1) {
      spec.audioLabels[0] = `${spec.index}:a`;
    }
  }
  let last = "base";
  let overlayIndex = 0;
  for (const track of [...videoTracks].reverse()) {
    for (const clip of track.clips) {
      if (clip.text) continue;
      const asset = clip.mediaId ? assets.get(clip.mediaId) : null;
      if (!asset) continue;
      const spec = specs.get(asset.id);
      if (!spec || spec.videoLabels.length === 0) continue;
      const source = spec.videoLabels[spec.videoCursor++];
      const speed = clamp(clip.speed || 1, 0.05, 20);
      const sourceIn = Math.max(0, clip.inPoint);
      const sourceOut = sourceIn + clip.duration * speed;
      const chain = [
        `trim=start=${roundTo(sourceIn, 3)}:end=${roundTo(sourceOut, 3)}`,
        `setpts=(PTS-STARTPTS)/${roundTo(speed, 5)}+${roundTo(clip.start, 3)}/TB`
      ];
      const effects = effectFilters(clip, notes);
      if (effects.length > 0) chain.push(...effects);
      const rotation = clip.transform.rotation;
      if (Math.abs(rotation) > 0.01) {
        const radians = rotation * Math.PI / 180;
        chain.push(`rotate=${roundTo(radians, 6)}:ow=rotw(${roundTo(radians, 6)}):oh=roth(${roundTo(radians, 6)}):c=none`);
      }
      chain.push(`scale=${width}:${height}:force_original_aspect_ratio=decrease`, "setsar=1");
      const scale = clamp(clip.transform.scale || 1, 0.05, 20);
      if (Math.abs(scale - 1) > 1e-3) {
        chain.push(`scale=trunc(iw*${roundTo(scale, 4)}/2)*2:trunc(ih*${roundTo(scale, 4)}/2)*2`);
      }
      const opacity = clamp(clip.transform.opacity, 0, 1);
      if (opacity < 0.999) {
        chain.push("format=rgba", `colorchannelmixer=aa=${roundTo(opacity, 3)}`);
      } else {
        chain.push("format=rgba");
      }
      const label = `vclip${overlayIndex}`;
      const composed = `vstage${overlayIndex}`;
      filters.push(`[${source}]${chain.join(",")}[${label}]`);
      const xExpr = `(W-w)/2+${roundTo(clip.transform.x, 2)}`;
      const yExpr = `(H-h)/2+${roundTo(-clip.transform.y, 2)}`;
      filters.push(
        `[${last}][${label}]overlay=x=${xExpr}:y=${yExpr}:eof_action=pass:format=auto:enable='between(t,${roundTo(clip.start, 3)},${roundTo(clip.start + clip.duration, 3)})'[${composed}]`
      );
      last = composed;
      overlayIndex += 1;
    }
  }
  const fontFile = options.fontFile === void 0 ? findFontFile() : options.fontFile;
  let textIndex = 0;
  for (const { clip } of textClips) {
    const text = clip.text;
    if (!fontFile) {
      notes.push(`Nessun font di sistema trovato: il titolo "${text.content.slice(0, 32)}" non può essere esportato.`);
      continue;
    }
    const label = `vtext${textIndex}`;
    const color = colorValue(text.color);
    const box = text.background ? `:box=1:boxcolor=black@0.38:boxborderw=14` : "";
    filters.push(
      `[${last}]drawtext=fontfile='${escapeFilterPath(fontFile)}':text='${escapeDrawText(text.content)}':fontcolor=${color}:fontsize=${Math.round(text.fontSize)}:x=(w-text_w)*${roundTo(text.x, 3)}:y=h*${roundTo(text.y, 3)}-text_h/2${box}:enable='between(t,${roundTo(clip.start, 3)},${roundTo(clip.start + clip.duration, 3)})'[${label}]`
    );
    last = label;
    textIndex += 1;
  }
  const outputWidth = preset.video.width;
  const outputHeight = preset.video.height;
  const outputFps = preset.video.fps ?? fps;
  const tail2 = [];
  if (outputWidth && outputHeight) {
    if (preset.filters.scaleMode === "fill") {
      tail2.push(
        `scale=${outputWidth}:${outputHeight}:force_original_aspect_ratio=increase`,
        `crop=${outputWidth}:${outputHeight}`
      );
    } else if (preset.filters.scaleMode === "stretch") {
      tail2.push(`scale=${outputWidth}:${outputHeight}`);
    } else {
      tail2.push(
        `scale=${outputWidth}:${outputHeight}:force_original_aspect_ratio=decrease`,
        `pad=${outputWidth}:${outputHeight}:(ow-iw)/2:(oh-ih)/2:color=black`
      );
    }
  } else if (outputWidth) {
    tail2.push(`scale=${outputWidth}:-2`);
  } else if (outputHeight) {
    tail2.push(`scale=-2:${outputHeight}`);
  }
  if (preset.filters.lut) tail2.push(`lut3d=file='${escapeFilterPath(preset.filters.lut)}'`);
  if (preset.filters.burnSubtitles && preset.filters.subtitlePath) {
    tail2.push(`subtitles=filename='${escapeFilterPath(preset.filters.subtitlePath)}'`);
  }
  if (preset.filters.colorConversion !== false) {
    const matrix = preset.video.colorSpace === "rec709" ? "bt709" : "bt2020";
    tail2.push(`scale=out_color_matrix=${matrix}:out_range=tv`);
  }
  tail2.push(`fps=${outputFps}`, "setsar=1");
  if (options.choice?.backend === "vaapi" && process.platform === "linux") {
    tail2.push("format=nv12", "hwupload");
  } else {
    tail2.push(`format=${preset.video.pixelFormat || "yuv420p"}`);
  }
  filters.push(`[${last}]${tail2.join(",")}[vout]`);
  const audioChains = [];
  let audioIndex = 0;
  for (const { clip, track } of audioClips) {
    const asset = clip.mediaId ? assets.get(clip.mediaId) : null;
    if (!asset) continue;
    const spec = specs.get(asset.id);
    if (!spec || spec.audioLabels.length === 0) continue;
    const source = spec.audioLabels[spec.audioCursor++];
    const speed = clamp(clip.speed || 1, 0.05, 20);
    const sourceIn = Math.max(0, clip.inPoint);
    const sourceOut = sourceIn + clip.duration * speed;
    const chain = [
      `atrim=start=${roundTo(sourceIn, 3)}:end=${roundTo(sourceOut, 3)}`,
      "asetpts=PTS-STARTPTS",
      ...atempoChain(speed),
      `volume=${roundTo(clamp(clip.volume * track.volume, 0, 8), 3)}`
    ];
    if (clip.start > 1e-3) chain.push(`adelay=${Math.round(clip.start * 1e3)}:all=1`);
    filters.push(`[${source}]${chain.join(",")}[a${audioIndex}]`);
    audioChains.push(`[a${audioIndex}]`);
    audioIndex += 1;
  }
  let audioLabel = null;
  if (audioChains.length === 1) {
    filters.push(`${audioChains[0]}anull[aout]`);
    audioLabel = "aout";
  } else if (audioChains.length > 1) {
    filters.push(
      `${audioChains.join("")}amix=inputs=${audioChains.length}:normalize=0:duration=longest,alimiter=limit=0.95[aout]`
    );
    audioLabel = "aout";
  }
  return {
    inputs: [...specs.values()].map((spec) => ({ path: spec.path, loop: spec.loop })),
    filterGraph: filters.join(";"),
    durationSec,
    hasAudio: audioLabel !== null,
    videoLabel: "vout",
    audioLabel,
    notes: [...new Set(notes)]
  };
}
class RenderCanceledError extends Error {
  constructor() {
    super("Render annullato");
    this.name = "RenderCanceledError";
  }
}
const healthCache = /* @__PURE__ */ new Map();
class RenderEngine {
  async ensureHardwareProfile(log) {
    if (hardware.cachedProfile()) return;
    log("[hw] profilo hardware assente: scansione automatica…");
    try {
      await hardware.scan(false, (stage, percent, message) => {
        log(`[hw] ${message} (${percent}% · ${stage})`);
      });
    } catch (err) {
      log(`[hw] scansione fallita: ${err.message}`);
    }
  }
  async resolveChoice(preset, override, log) {
    await this.ensureHardwareProfile(log);
    const current = settings.get();
    const gpuOnly = current.gpuOnly && !current.safeMode;
    const backends = current.safeMode ? ["software"] : hardware.backends();
    const hardwareBackends = backends.filter((backend) => backend !== "software");
    const hardwareAvailable = hardwareBackends.length > 0;
    const policy = preset.video.encoderPolicy;
    const overrideMap = {
      auto: "auto",
      nvidia: "nvenc",
      amd: "amf",
      intel: "qsv",
      apple: "videotoolbox",
      vaapi: "vaapi",
      software: "software"
    };
    const requestedOverride = override ?? overrideMap[current.hardwareOverride] ?? "auto";
    if (gpuOnly && hardwareAvailable && preset.video.codec !== "none") {
      const forced = chooseEncoder(
        preset.video.codec,
        "hardware",
        hardwareBackends,
        requestedOverride === "software" ? "auto" : requestedOverride
      );
      if (!forced.hardware) {
        throw new Error(
          `Codec ${preset.video.codec.toUpperCase()} non supportato dalla GPU (${hardwareBackends.join(", ")}). La modalità Solo GPU è attiva: scegli H.264, HEVC o AV1 oppure disattivala nelle Impostazioni.`
        );
      }
      log(`[hw] solo GPU: ${forced.encoder} (nessun fallback CPU consentito)`);
      return { choice: forced, gpuOnly: true, hardwareAvailable };
    }
    const choice = chooseEncoder(preset.video.codec, policy, backends, requestedOverride);
    if (gpuOnly && hardwareAvailable) {
      log(`[hw] codec ${preset.video.codec}: nessun encoder GPU applicabile (audio/immagine).`);
    } else if (gpuOnly && !hardwareAvailable) {
      log("[hw] nessun encoder GPU rilevato: export software (la macchina non offre alternative).");
    }
    return { choice, gpuOnly, hardwareAvailable };
  }
  async ensureHealthy(choice, log) {
    if (!choice.hardware) return true;
    const cached2 = healthCache.get(choice.encoder);
    if (cached2 !== void 0) return cached2;
    log(`[hw] test rapido encoder ${choice.encoder} (1s)…`);
    const codec = choice.encoder.includes("hevc") ? "hevc" : choice.encoder.includes("av1") ? "av1" : "h264";
    const test = await hardware.testEncoder(choice.encoder, codec);
    healthCache.set(choice.encoder, test.ok);
    if (test.ok) log(`[hw] ${choice.encoder} operativo (${test.fps ?? "?"} fps)`);
    else log(`[hw] ${choice.encoder} FALLITO: ${test.detail}`);
    return test.ok;
  }
  async render(spec) {
    if (!node_fs.existsSync(spec.input)) throw new Error(`Sorgente non trovata: ${spec.input}`);
    if (!node_fs.existsSync(node_path.dirname(spec.output))) node_fs.mkdirSync(node_path.dirname(spec.output), { recursive: true });
    const resolved = await this.resolveChoice(spec.preset, spec.hardwareOverride, spec.onLog);
    let choice = resolved.choice;
    let fallback = false;
    spec.onLog(`[render] backend=${choice.backend} encoder=${choice.encoder} (${choice.reason})`);
    if (choice.hardware && !await this.ensureHealthy(choice, spec.onLog)) {
      if (resolved.gpuOnly) {
        throw new Error(
          `Encoder GPU ${choice.encoder} non operativo. Export annullato: modalità Solo GPU attiva (nessun fallback CPU).`
        );
      }
      const software = chooseEncoder(spec.preset.video.codec, "software", ["software"]);
      spec.onLog(`[hw] fallback esplicito a ${software.encoder}: encoder hardware non disponibile.`);
      choice = software;
      fallback = true;
    }
    const makeArgs = (encoder) => buildEncodeArgs({
      input: spec.input,
      output: spec.output,
      preset: spec.preset,
      choice: encoder,
      durationSec: spec.durationSec,
      hasAudio: spec.hasAudio
    });
    try {
      return await this.execute(spec, choice, fallback, makeArgs);
    } catch (err) {
      if (err instanceof RenderCanceledError) throw err;
      if (!choice.hardware) throw err;
      if (resolved.gpuOnly) {
        throw new Error(
          `Encode GPU (${choice.encoder}) fallito: ${err.message}
Modalità Solo GPU attiva: nessun fallback alla CPU. Controlla driver/encoder o disattivala nelle Impostazioni.`
        );
      }
      const software = chooseEncoder(spec.preset.video.codec, "software", ["software"]);
      spec.onLog(`[hw] errore encoder ${choice.encoder}: ${err.message}`);
      spec.onLog(`[hw] retry con fallback software ${software.encoder}`);
      logger.warn("render", `hardware encode failed, falling back: ${err.message}`);
      healthCache.set(choice.encoder, false);
      try {
        return await this.execute(spec, software, true, makeArgs);
      } catch (retryErr) {
        if (retryErr instanceof RenderCanceledError) throw retryErr;
        throw new Error(`Encode fallito (hardware e software): ${retryErr.message}`);
      }
    }
  }
  /** Render the whole timeline (overlaid tracks + audio mix + titles). */
  async renderTimeline(spec) {
    const sequence = spec.project.sequences.find((item) => item.id === spec.sequenceId);
    if (!sequence) throw new Error("Sequenza non trovata nel progetto");
    if (sequenceContentDuration(sequence) <= 0.01) throw new Error("Timeline vuota: aggiungi almeno una clip prima di esportare.");
    const initialGraph = buildTimelineGraph(spec.project, sequence, spec.preset);
    for (const input of initialGraph.inputs) {
      if (!node_fs.existsSync(input.path)) throw new Error(`Sorgente non trovata: ${input.path}`);
    }
    if (!node_fs.existsSync(node_path.dirname(spec.output))) node_fs.mkdirSync(node_path.dirname(spec.output), { recursive: true });
    const resolved = await this.resolveChoice(spec.preset, spec.hardwareOverride, spec.onLog);
    let choice = resolved.choice;
    let fallback = false;
    spec.onLog(`[render] timeline "${sequence.name}" backend=${choice.backend} encoder=${choice.encoder} (${choice.reason})`);
    if (choice.hardware && !await this.ensureHealthy(choice, spec.onLog)) {
      if (resolved.gpuOnly) {
        throw new Error(
          `Encoder GPU ${choice.encoder} non operativo. Export annullato: modalità Solo GPU attiva (nessun fallback CPU).`
        );
      }
      const software = chooseEncoder(spec.preset.video.codec, "software", ["software"]);
      spec.onLog(`[hw] fallback esplicito a ${software.encoder}: encoder hardware non disponibile.`);
      choice = software;
      fallback = true;
    }
    const baseSpec = {
      jobId: spec.jobId,
      input: initialGraph.inputs[0]?.path ?? "",
      output: spec.output,
      preset: spec.preset,
      durationSec: initialGraph.durationSec,
      hasAudio: initialGraph.hasAudio,
      hardwareOverride: spec.hardwareOverride,
      signal: spec.signal,
      lowPriority: spec.lowPriority,
      onProgress: spec.onProgress,
      onLog: spec.onLog
    };
    const makeArgs = (encoder) => {
      const graph = buildTimelineGraph(spec.project, sequence, spec.preset, { choice: encoder });
      for (const note of graph.notes) spec.onLog(`[timeline] ${note}`);
      const inputs = [];
      for (const input of graph.inputs) {
        if (input.loop) inputs.push("-loop", "1");
        inputs.push("-i", input.path);
      }
      return [
        ...inputs,
        ...buildGraphEncodeArgs({
          output: spec.output,
          preset: spec.preset,
          choice: encoder,
          filterGraph: graph.filterGraph,
          videoLabel: graph.videoLabel,
          audioLabel: graph.audioLabel,
          durationSec: graph.durationSec,
          hasAudio: graph.hasAudio
        })
      ];
    };
    try {
      return await this.execute(baseSpec, choice, fallback, makeArgs);
    } catch (err) {
      if (err instanceof RenderCanceledError) throw err;
      if (!choice.hardware) throw err;
      if (resolved.gpuOnly) {
        throw new Error(
          `Encode GPU (${choice.encoder}) fallito: ${err.message}
Modalità Solo GPU attiva: nessun fallback alla CPU. Controlla driver/encoder o disattivala nelle Impostazioni.`
        );
      }
      const software = chooseEncoder(spec.preset.video.codec, "software", ["software"]);
      spec.onLog(`[hw] errore encoder ${choice.encoder}: ${err.message}`);
      spec.onLog(`[hw] retry con fallback software ${software.encoder}`);
      logger.warn("render", `timeline hardware encode failed, falling back: ${err.message}`);
      healthCache.set(choice.encoder, false);
      try {
        return await this.execute(baseSpec, software, true, makeArgs);
      } catch (retryErr) {
        if (retryErr instanceof RenderCanceledError) throw retryErr;
        throw new Error(`Encode timeline fallito (hardware e software): ${retryErr.message}`);
      }
    }
  }
  async execute(spec, choice, fallback, makeArgs) {
    const args = makeArgs(choice);
    const fullArgs = ["-progress", "pipe:1", "-nostats", ...args];
    const started = Date.now();
    const latest = {
      percent: 0,
      timeSec: 0,
      frame: 0,
      fps: 0,
      speed: 0,
      etaSec: 0,
      sizeBytes: 0
    };
    let lastEmit = 0;
    let lastFrame = 0;
    const parseProgress = (line) => {
      const idx = line.indexOf("=");
      if (idx <= 0) return;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key === "out_time_us" || key === "out_time_ms") {
        const us = Number(value);
        if (Number.isFinite(us)) latest.timeSec = us / 1e6;
      } else if (key === "frame") {
        latest.frame = Number(value) || 0;
      } else if (key === "fps") {
        latest.fps = Number(value) || 0;
      } else if (key === "speed") {
        latest.speed = Number(value.replace("x", "")) || 0;
      } else if (key === "total_size") {
        latest.sizeBytes = Number(value) || 0;
      } else if (key === "progress" && value === "end") {
        latest.percent = 100;
      }
      if (spec.durationSec && spec.durationSec > 0) {
        latest.percent = Math.max(latest.percent, Math.min(99.5, latest.timeSec / spec.durationSec * 100));
        const remaining = Math.max(0, spec.durationSec - latest.timeSec);
        latest.etaSec = latest.speed > 0 ? remaining / latest.speed : 0;
      }
      if (latest.fps > 0) lastFrame = latest.frame;
      const now = Date.now();
      if (now - lastEmit > 250) {
        lastEmit = now;
        spec.onProgress({ ...latest, percent: roundTo(latest.percent, 1) });
      }
    };
    spec.onLog(`[ffmpeg] ${choice.encoder} → ${spec.output}`);
    const result = await ffmpeg.runFfmpeg(fullArgs, {
      signal: spec.signal,
      lowPriority: spec.lowPriority ?? true,
      onStdout: parseProgress,
      onStderr: (line) => {
        if (line.includes("Error") || line.includes("error") || line.includes("Invalid")) spec.onLog(`[ffmpeg] ${line}`);
      }
    });
    if (result.canceled) {
      try {
        if (node_fs.existsSync(spec.output)) node_fs.unlinkSync(spec.output);
      } catch {
      }
      throw new RenderCanceledError();
    }
    if (result.code !== 0) {
      throw new Error(tail(result.stderr));
    }
    if (!node_fs.existsSync(spec.output)) throw new Error("FFmpeg ha terminato senza produrre output");
    const outputBytes = node_fs.statSync(spec.output).size;
    const durationMs = Date.now() - started;
    const avgFps = latest.timeSec > 0 ? roundTo(lastFrame / latest.timeSec, 2) : 0;
    spec.onProgress({ ...latest, percent: 100, sizeBytes: outputBytes, etaSec: 0 });
    spec.onLog(`[render] completato in ${(durationMs / 1e3).toFixed(1)}s (${outputBytes} byte, ${avgFps} fps medi)`);
    logger.info("render", `done job=${spec.jobId} encoder=${choice.encoder} ms=${durationMs} bytes=${outputBytes}`);
    return {
      outputBytes,
      durationMs,
      avgFps,
      encodedFrames: lastFrame,
      encoder: choice,
      fallback
    };
  }
  /** Single-frame export (still) used by "Esporta frame". */
  async renderStill(input, output, timeSec, width) {
    if (!node_fs.existsSync(node_path.dirname(output))) node_fs.mkdirSync(node_path.dirname(output), { recursive: true });
    const args = ["-ss", String(timeSec), "-i", input, "-frames:v", "1"];
    if (width) args.push("-vf", `scale=${width}:-2`);
    args.push("-q:v", "2", output);
    const res = await ffmpeg.runFfmpeg(args, { timeoutMs: 12e4 });
    if (res.code !== 0) throw new Error(tail(res.stderr));
  }
}
function tail(stderr) {
  const lines = stderr.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lines.slice(-12).join("\n").slice(0, 4e3) || "Errore FFmpeg sconosciuto";
}
const renderEngine = new RenderEngine();
class RenderQueue {
  jobs = /* @__PURE__ */ new Map();
  running = /* @__PURE__ */ new Map();
  concurrency = 1;
  pausedAll = false;
  stopAfterCurrent = false;
  timer = null;
  lastPersist = /* @__PURE__ */ new Map();
  started = false;
  settingsProvider = () => ({ maxConcurrentJobs: 1 });
  events = {};
  init(settings2) {
    this.settingsProvider = () => settings2;
    this.concurrency = Math.max(1, Math.min(16, settings2.maxConcurrentJobs));
    const rows = getDb().prepare("SELECT payload FROM queue_jobs").all();
    this.jobs.clear();
    for (const row of rows) {
      try {
        const parsed = queueJobSchema.safeParse(JSON.parse(row.payload));
        if (!parsed.success) continue;
        const job = { ...parsed.data };
        if (job.state === "running") {
          job.state = "queued";
          job.startedAt = null;
          job.logs.push(`[queue] Ripristino dopo arresto imprevisto, job riaccodato (${(/* @__PURE__ */ new Date()).toISOString()})`);
        }
        this.jobs.set(job.id, job);
      } catch {
        logger.warn("queue", "skipping corrupted job row");
      }
    }
    this.prune(settings2);
    this.started = true;
    logger.info("queue", `restored ${this.jobs.size} jobs, concurrency=${this.concurrency}`);
    this.broadcast();
    this.schedule();
  }
  setSettings(settings2) {
    this.concurrency = Math.max(1, Math.min(16, settings2.maxConcurrentJobs));
    this.settingsProvider = () => settings2;
    this.schedule();
  }
  setEvents(events) {
    this.events = events;
  }
  /** Default delivery folder: <Videos>/MoliCut (not userData/exports). */
  defaultDir() {
    return defaultExportDir();
  }
  save(job) {
    getDb().prepare(
      "INSERT INTO queue_jobs (id, state, priority, created_at, updated_at, payload) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET state=excluded.state, priority=excluded.priority, updated_at=excluded.updated_at, payload=excluded.payload"
    ).run(job.id, job.state, job.priority, job.createdAt, (/* @__PURE__ */ new Date()).toISOString(), JSON.stringify(job));
  }
  removeRow(id) {
    getDb().prepare("DELETE FROM queue_jobs WHERE id = ?").run(id);
  }
  prune(settings2) {
    const cutoff = Date.now() - settings2.queueRetentionDays * 864e5;
    for (const job of [...this.jobs.values()]) {
      if (job.state === "done" && job.finishedAt && new Date(job.finishedAt).getTime() < cutoff) {
        this.jobs.delete(job.id);
        this.removeRow(job.id);
      }
    }
    if (this.jobs.size > settings2.queueMaxJobs) {
      const removable = [...this.jobs.values()].filter((j) => j.state === "done" || j.state === "canceled").sort((a, b) => (a.finishedAt ?? a.createdAt).localeCompare(b.finishedAt ?? b.createdAt));
      for (const job of removable) {
        if (this.jobs.size <= settings2.queueMaxJobs) break;
        this.jobs.delete(job.id);
        this.removeRow(job.id);
      }
    }
  }
  sortedJobs() {
    return [...this.jobs.values()].sort((a, b) => {
      const active = Number(b.state === "running") - Number(a.state === "running");
      if (active !== 0) return active;
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.createdAt.localeCompare(b.createdAt);
    });
  }
  stats() {
    const jobs = [...this.jobs.values()];
    const count = (state) => jobs.filter((j) => j.state === state).length;
    const runningJobs = jobs.filter((j) => j.state === "running");
    const aggregateFps = runningJobs.reduce((sum, j) => sum + j.fps, 0);
    const total = jobs.length;
    const progress = total === 0 ? 0 : roundTo(jobs.reduce((sum, j) => sum + (j.state === "done" ? 100 : j.progress), 0) / total, 1);
    return {
      queued: count("queued"),
      running: runningJobs.length,
      paused: count("paused"),
      done: count("done"),
      error: count("error"),
      canceled: count("canceled"),
      total,
      progress,
      aggregateFps: roundTo(aggregateFps, 1)
    };
  }
  broadcast() {
    this.events.changed?.(this.sortedJobs(), this.stats());
  }
  log(job, line) {
    const clean = line.slice(0, 4e3);
    job.logs.push(clean);
    if (job.logs.length > 800) job.logs.splice(0, job.logs.length - 800);
    this.events.log?.(job.id, clean);
  }
  async add(inputs, extraOutputRoots = []) {
    if (!this.started) throw new Error("Coda non inizializzata");
    const created = [];
    const fallbackPreset = builtinPresets()[0];
    for (const input of inputs) {
      const preset = input.preset ?? (input.presetId ? presets.get(input.presetId) : void 0) ?? fallbackPreset;
      const timeline = input.timeline;
      const sequence = timeline ? timeline.project.sequences.find((item) => item.id === timeline.sequenceId) ?? null : null;
      if (timeline && !sequence) throw new Error("Sequenza da esportare non trovata nel progetto");
      if (!timeline && !input.sourcePath) throw new Error("sourcePath richiesto per un job media");
      if (!timeline && input.sourcePath && !node_fs.existsSync(input.sourcePath)) {
        throw new Error(`Sorgente non trovata: ${input.sourcePath}`);
      }
      let durationSec = input.durationSec ?? 0;
      let hasAudio = input.hasAudio ?? false;
      let sourcePath = input.sourcePath ?? "";
      if (timeline && sequence) {
        durationSec = durationSec || sequenceContentDuration(sequence);
        if (input.hasAudio === void 0) {
          const mediaById = new Map(timeline.project.media.map((asset) => [asset.id, asset]));
          hasAudio = sequence.tracks.filter((track) => track.kind === "audio").flatMap((track) => track.clips).some((clip) => clip.mediaId ? (mediaById.get(clip.mediaId)?.channels ?? 0) > 0 : false);
        }
        sourcePath = sourcePath || node_path.join(appPaths().projects, `${safeFileStem(timeline.project.name)}.mcut`);
      } else if (input.sourcePath) {
        if (!durationSec || input.hasAudio === void 0) {
          try {
            const asset = await media.probe(input.sourcePath);
            durationSec = durationSec || asset.durationSec;
            hasAudio = input.hasAudio ?? asset.channels > 0;
          } catch (err) {
            logger.warn("queue", `probe failed for ${input.sourcePath}: ${err.message}`);
          }
        }
      }
      const outputDir = preset.output.directory ?? this.defaultDir();
      if (!node_fs.existsSync(outputDir)) node_fs.mkdirSync(outputDir, { recursive: true });
      const requested = input.outputPath ?? (timeline && sequence ? node_path.join(
        outputDir,
        `${safeFileStem(timeline.project.name)}_${safeFileStem(sequence.name)}${preset.output.suffix}.${outputExtension(preset)}`
      ) : defaultOutputPath(preset, input.sourcePath ?? "", outputDir));
      assertWritablePath(requested, [node_path.dirname(sourcePath || outputDir), outputDir, ...extraOutputRoots]);
      const outputPath = uniqueOutputPath(requested, node_fs.existsSync);
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const job = {
        id: uid("job"),
        name: input.name ?? (timeline && sequence ? `${timeline.project.name} — ${sequence.name} → ${preset.name}` : `${node_path.basename(input.sourcePath ?? "media")} → ${preset.name}`),
        sourcePath,
        sourceMediaId: input.mediaId ?? null,
        sequenceId: input.sequenceId ?? sequence?.id ?? null,
        timeline: timeline ?? null,
        preset,
        outputPath,
        durationSec: roundTo(durationSec, 3),
        hasAudio,
        state: "queued",
        priority: input.priority,
        progress: 0,
        fps: 0,
        speed: 0,
        etaSec: 0,
        sizeBytes: 0,
        attempts: 0,
        maxRetries: input.maxRetries,
        error: null,
        logs: [`[queue] accodato ${now}`],
        groupId: input.groupId ?? null,
        metrics: { avgFps: 0, encodedFrames: 0, durationMs: 0, outputBytes: 0, speed: 0 },
        createdAt: now,
        startedAt: null,
        finishedAt: null,
        nextAttemptAt: null
      };
      this.save(job);
      this.jobs.set(job.id, job);
      created.push(job);
      logger.info("queue", `job queued ${job.id} (${preset.name})`);
    }
    this.broadcast();
    this.schedule();
    return created;
  }
  schedule() {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.pump();
    }, 40);
    this.timer.unref?.();
  }
  async pump() {
    if (!this.started || this.pausedAll) return;
    if (this.stopAfterCurrent && this.running.size > 0) return;
    const now = Date.now();
    const candidates = [...this.jobs.values()].filter((j) => j.state === "queued").filter((j) => !j.nextAttemptAt || new Date(j.nextAttemptAt).getTime() <= now).sort((a, b) => b.priority - a.priority || a.createdAt.localeCompare(b.createdAt));
    for (const job of candidates) {
      if (this.running.size >= this.concurrency) break;
      if (this.stopAfterCurrent) break;
      void this.startJob(job);
    }
  }
  async startJob(job) {
    if (this.running.has(job.id)) return;
    const controller = new AbortController();
    this.running.set(job.id, controller);
    job.state = "running";
    job.startedAt = (/* @__PURE__ */ new Date()).toISOString();
    job.finishedAt = null;
    job.error = null;
    job.pauseRequested = false;
    job.cancelRequested = false;
    job.attempts += 1;
    job.progress = 0;
    job.fps = 0;
    job.speed = 0;
    job.etaSec = 0;
    job.nextAttemptAt = null;
    this.log(job, `[queue] avvio tentativo ${job.attempts}/${job.maxRetries + 1}`);
    this.save(job);
    this.broadcast();
    try {
      const onLog = (line) => {
        this.log(job, line);
        this.events.log?.(job.id, line);
      };
      let result;
      if (job.timeline) {
        this.log(job, "[queue] export timeline (sequenza, non singolo media)");
        result = await renderEngine.renderTimeline({
          jobId: job.id,
          project: job.timeline.project,
          sequenceId: job.timeline.sequenceId,
          output: job.outputPath,
          preset: job.preset,
          signal: controller.signal,
          lowPriority: true,
          onProgress: (p) => this.handleProgress(job, p),
          onLog
        });
      } else {
        if (!job.durationSec || !node_fs.existsSync(job.sourcePath)) {
          const asset = await media.probe(job.sourcePath);
          job.durationSec = asset.durationSec;
          job.hasAudio = asset.channels > 0;
        }
        result = await renderEngine.render({
          jobId: job.id,
          input: job.sourcePath,
          output: job.outputPath,
          preset: job.preset,
          durationSec: job.durationSec,
          hasAudio: job.hasAudio,
          signal: controller.signal,
          lowPriority: true,
          onProgress: (p) => this.handleProgress(job, p),
          onLog
        });
      }
      job.state = "done";
      job.progress = 100;
      job.finishedAt = (/* @__PURE__ */ new Date()).toISOString();
      job.sizeBytes = result.outputBytes;
      job.metrics = {
        avgFps: result.avgFps,
        encodedFrames: result.encodedFrames,
        durationMs: result.durationMs,
        outputBytes: result.outputBytes,
        speed: job.speed
      };
      job.etaSec = 0;
      this.log(job, `[queue] completato con ${result.encoder.encoder}${result.fallback ? " (fallback software)" : ""}`);
      if (result.fallback) this.events.fallback?.(`Job ${job.name}: encoder hardware non disponibile, usato ${result.encoder.encoder}`);
      this.events.notify?.("Render completato", `${job.name} → ${job.outputPath}`, "success");
    } catch (err) {
      const message = err instanceof RenderCanceledError ? "Annullato" : err.message;
      if (job.pauseRequested) {
        job.state = "paused";
        this.log(job, "[queue] job in pausa");
      } else if (job.cancelRequested || err instanceof RenderCanceledError) {
        job.state = "canceled";
        job.finishedAt = (/* @__PURE__ */ new Date()).toISOString();
        this.log(job, "[queue] job annullato");
      } else if (isTransientError(message) && job.attempts <= job.maxRetries) {
        const delay = nextAttemptDelay(job.attempts);
        job.state = "queued";
        job.nextAttemptAt = new Date(Date.now() + delay * 1e3).toISOString();
        job.error = message;
        this.log(job, `[queue] errore transitorio, retry tra ${delay}s: ${message}`);
      } else {
        job.state = "error";
        job.error = message;
        job.finishedAt = (/* @__PURE__ */ new Date()).toISOString();
        this.log(job, `[queue] errore definitivo: ${message}`);
        this.events.notify?.("Render fallito", `${job.name}: ${message.slice(0, 180)}`, "error");
      }
    } finally {
      this.running.delete(job.id);
      job.pauseRequested = false;
      job.cancelRequested = false;
      this.save(job);
      this.lastPersist.delete(job.id);
      this.prune(this.settingsProvider());
      this.broadcast();
      this.schedule();
    }
  }
  handleProgress(job, p) {
    job.progress = Math.min(100, p.percent);
    job.fps = roundTo(p.fps, 2);
    job.speed = roundTo(p.speed, 2);
    job.etaSec = Math.round(p.etaSec);
    job.sizeBytes = p.sizeBytes;
    this.events.progress?.(job.id, p);
    const now = Date.now();
    if (now - (this.lastPersist.get(job.id) ?? 0) > 2e3) {
      this.lastPersist.set(job.id, now);
      this.save(job);
    }
  }
  withJob(jobId, fn) {
    if (!jobId) return;
    const job = this.jobs.get(jobId);
    if (!job) throw new Error("Job non trovato");
    fn(job);
    this.save(job);
    this.broadcast();
  }
  pause(jobId) {
    if (!jobId) {
      this.pausedAll = true;
      for (const job2 of this.jobs.values()) {
        if (job2.state === "running") {
          job2.pauseRequested = true;
          this.running.get(job2.id)?.abort();
        }
      }
      this.broadcast();
      return this.sortedJobs();
    }
    const job = this.jobs.get(jobId);
    if (!job) throw new Error("Job non trovato");
    if (job.state === "running") {
      job.pauseRequested = true;
      this.running.get(jobId)?.abort();
    } else if (job.state === "queued") {
      job.state = "paused";
      this.save(job);
    }
    this.broadcast();
    return this.sortedJobs();
  }
  resume(jobId) {
    if (!jobId) {
      this.pausedAll = false;
      for (const job of this.jobs.values()) {
        if (job.state === "paused") {
          job.state = "queued";
          job.nextAttemptAt = null;
          this.save(job);
        }
      }
      this.broadcast();
      this.schedule();
      return this.sortedJobs();
    }
    this.withJob(jobId, (job) => {
      if (job.state === "paused") {
        job.state = "queued";
        job.nextAttemptAt = null;
      }
    });
    this.schedule();
    return this.sortedJobs();
  }
  cancel(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error("Job non trovato");
    if (job.state === "running") {
      job.cancelRequested = true;
      this.running.get(jobId)?.abort();
    } else if (job.state === "queued" || job.state === "paused") {
      job.state = "canceled";
      job.finishedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.save(job);
    }
    this.broadcast();
    return this.sortedJobs();
  }
  retry(jobId) {
    this.withJob(jobId, (job) => {
      if (job.state === "error" || job.state === "canceled") {
        job.state = "queued";
        job.error = null;
        job.progress = 0;
        job.nextAttemptAt = null;
        this.log(job, "[queue] retry manuale");
      }
    });
    this.schedule();
    return this.sortedJobs();
  }
  remove(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error("Job non trovato");
    if (job.state === "running") {
      job.cancelRequested = true;
      this.running.get(jobId)?.abort();
    }
    this.jobs.delete(jobId);
    this.removeRow(jobId);
    this.broadcast();
    return this.sortedJobs();
  }
  duplicate(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error("Job non trovato");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const copy = {
      ...structuredClone(job),
      id: uid("job"),
      state: "queued",
      progress: 0,
      fps: 0,
      speed: 0,
      etaSec: 0,
      sizeBytes: 0,
      attempts: 0,
      error: null,
      logs: [`[queue] duplicato da ${job.id}`],
      createdAt: now,
      startedAt: null,
      finishedAt: null,
      nextAttemptAt: null,
      outputPath: uniqueOutputPath(job.outputPath.replace(/(\.[^.\\/]+)$/, "_copy$1"), node_fs.existsSync)
    };
    this.save(copy);
    this.jobs.set(copy.id, copy);
    this.broadcast();
    this.schedule();
    return this.sortedJobs();
  }
  reorder(jobId, toIndex) {
    const list = this.sortedJobs();
    const from = list.findIndex((j) => j.id === jobId);
    if (from < 0) throw new Error("Job non trovato");
    const [moved] = list.splice(from, 1);
    if (!moved) return this.sortedJobs();
    list.splice(Math.max(0, Math.min(list.length, toIndex)), 0, moved);
    list.forEach((job, index) => {
      const target = this.jobs.get(job.id);
      if (target) {
        target.priority = Math.max(0, 100 - index);
        this.save(target);
      }
    });
    this.broadcast();
    this.schedule();
    return this.sortedJobs();
  }
  setPriority(jobId, priority) {
    this.withJob(jobId, (job) => {
      job.priority = Math.max(0, Math.min(100, Math.round(priority)));
    });
    this.schedule();
    return this.sortedJobs();
  }
  setConcurrency(value) {
    this.concurrency = Math.max(1, Math.min(16, Math.round(value)));
    this.schedule();
    this.broadcast();
    return this.sortedJobs();
  }
  setStopAfterCurrent(enabled) {
    this.stopAfterCurrent = enabled;
    this.broadcast();
    return this.sortedJobs();
  }
  clearFinished() {
    for (const job of [...this.jobs.values()]) {
      if (job.state === "done" || job.state === "canceled") {
        this.jobs.delete(job.id);
        this.removeRow(job.id);
      }
    }
    this.broadcast();
    return this.sortedJobs();
  }
  list() {
    return this.sortedJobs();
  }
  exportReport(format, jobIds) {
    const jobs = this.sortedJobs().filter((j) => !jobIds || jobIds.includes(j.id));
    if (format === "json") {
      return JSON.stringify(
        { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), stats: this.stats(), jobs },
        null,
        2
      );
    }
    return toCsv(
      jobs.map((j) => ({
        id: j.id,
        name: j.name,
        state: j.state,
        preset: j.preset.name,
        encoder: j.preset.video.codec,
        source: j.sourcePath,
        output: j.outputPath,
        progress: j.progress,
        fps: j.fps,
        attempts: j.attempts,
        sizeBytes: j.sizeBytes,
        durationMs: j.metrics.durationMs,
        error: j.error,
        createdAt: j.createdAt,
        finishedAt: j.finishedAt
      })),
      ["id", "name", "state", "preset", "encoder", "source", "output", "progress", "fps", "attempts", "sizeBytes", "durationMs", "error", "createdAt", "finishedAt"]
    );
  }
  async shutdown() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    for (const controller of this.running.values()) controller.abort();
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  get runningCount() {
    return this.running.size;
  }
}
const queue = new RenderQueue();
class UpdaterService {
  status = { status: "disabled", message: "Updater attivo solo nei pacchetti firmati" };
  updater = null;
  async load() {
    if (!electron.app.isPackaged || settings.isSafeMode() || process.env.MOLICUT_DISABLE_UPDATER === "1") return null;
    if (this.updater) return this.updater;
    const { autoUpdater } = await import("electron-updater");
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.allowPrerelease = false;
    autoUpdater.on("checking-for-update", () => {
      this.status = { status: "checking" };
    });
    autoUpdater.on("update-not-available", () => {
      this.status = { status: "none" };
    });
    autoUpdater.on("update-available", (info) => {
      this.status = { status: "available", version: info.version };
      logger.info("updater", `update available: ${info.version}`);
    });
    autoUpdater.on("error", (err) => {
      this.status = { status: "error", message: err.message };
      logger.warn("updater", `error: ${err.message}`);
    });
    this.updater = autoUpdater;
    return autoUpdater;
  }
  async check() {
    const updater2 = await this.load();
    if (!updater2) return this.status;
    try {
      const result = await updater2.checkForUpdates();
      if (result?.updateInfo) {
        this.status = {
          status: result.updateInfo.version === electron.app.getVersion() ? "none" : "available",
          version: result.updateInfo.version
        };
      }
      return { ...this.status, message: this.status.message ?? (this.status.status === "none" ? "Nessun aggiornamento disponibile" : void 0) };
    } catch (err) {
      this.status = { status: "error", message: err.message };
      return this.status;
    }
  }
  install() {
    if (!this.updater) throw new Error("Updater non inizializzato");
    this.updater.quitAndInstall(true, true);
  }
}
const updater = new UpdaterService();
class WatchService {
  watchers = /* @__PURE__ */ new Map();
  inFlight = /* @__PURE__ */ new Set();
  settingsProvider = () => ({ watchEnabled: true });
  onLog = null;
  setSettingsProvider(provider) {
    this.settingsProvider = provider;
  }
  save(folder) {
    getDb().prepare("INSERT INTO watch_folders (id, payload) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload").run(folder.id, JSON.stringify(folder));
  }
  list() {
    return getDb().prepare("SELECT payload FROM watch_folders").all().flatMap((row) => {
      try {
        const parsed = watchFolderSchema.safeParse(JSON.parse(row.payload));
        return parsed.success ? [parsed.data] : [];
      } catch {
        return [];
      }
    });
  }
  get(id) {
    return this.list().find((f) => f.id === id);
  }
  init() {
    if (!this.settingsProvider().watchEnabled) {
      logger.info("watch", "watch folder disabled in settings");
      return;
    }
    for (const folder of this.list()) {
      if (folder.enabled) this.start(folder);
    }
  }
  syncEnabled(enabled) {
    if (!enabled) {
      this.stopAll();
      logger.info("watch", "all watchers stopped (disabled)");
      return;
    }
    for (const folder of this.list()) {
      if (folder.enabled && !this.watchers.has(folder.id)) this.start(folder);
    }
  }
  add(input) {
    const real = this.validateFolder(input.path);
    const parsed = watchFolderSchema.parse({ ...input, path: real, id: uid("wf"), createdAt: (/* @__PURE__ */ new Date()).toISOString() });
    this.save(parsed);
    if (parsed.enabled && this.settingsProvider().watchEnabled) this.start(parsed);
    this.log(parsed.id, "info", `Cartella monitorata: ${parsed.path}`);
    return parsed;
  }
  update(folder) {
    const parsed = watchFolderSchema.parse({ ...folder, path: this.validateFolder(folder.path) });
    this.stop(parsed.id);
    this.save(parsed);
    if (parsed.enabled && this.settingsProvider().watchEnabled) this.start(parsed);
    return parsed;
  }
  remove(id) {
    this.stop(id);
    getDb().prepare("DELETE FROM watch_folders WHERE id = ?").run(id);
    getDb().prepare("DELETE FROM watch_logs WHERE folder_id = ?").run(id);
    return this.list();
  }
  validateFolder(folderPath) {
    if (!node_fs.existsSync(folderPath)) throw new Error("Cartella non trovata");
    const stats2 = node_fs.statSync(folderPath);
    if (!stats2.isDirectory()) throw new Error("Il path non è una cartella");
    return safeRealPath(folderPath);
  }
  start(folder) {
    if (this.watchers.has(folder.id)) return;
    try {
      const watcher = chokidar.watch(folder.path, {
        ignored: (path) => {
          if (path === folder.path) return false;
          const name = node_path.basename(path);
          return name.startsWith(".") || name.endsWith(".tmp") || name.endsWith(".part");
        },
        ignoreInitial: true,
        persistent: true,
        depth: folder.recursive ? void 0 : 0,
        followSymlinks: false,
        awaitWriteFinish: { stabilityThreshold: folder.stabilityMs, pollInterval: 150 }
      });
      watcher.on("add", (filePath) => void this.handleFile(folder, filePath));
      watcher.on("error", (err) => this.log(folder.id, "error", `Watcher error: ${err.message}`));
      this.watchers.set(folder.id, watcher);
      logger.info("watch", `watching ${folder.path} (${folder.action})`);
    } catch (err) {
      this.log(folder.id, "error", `Impossibile avviare watcher: ${err.message}`);
    }
  }
  stop(id) {
    const watcher = this.watchers.get(id);
    if (watcher) {
      void watcher.close();
      this.watchers.delete(id);
    }
  }
  stopAll() {
    for (const id of [...this.watchers.keys()]) this.stop(id);
  }
  matches(folder, filePath) {
    const ext = node_path.extname(filePath).slice(1).toLowerCase();
    const allowed = folder.extensions.map((e) => e.replace(/^\./, "").toLowerCase());
    if (!allowed.includes(ext)) return false;
    const name = node_path.basename(filePath);
    if (folder.namePattern && !globToRegExp(folder.namePattern).test(name)) return false;
    if (folder.excludePattern && globToRegExp(folder.excludePattern).test(name)) return false;
    return true;
  }
  async handleFile(folder, filePath) {
    if (this.inFlight.has(filePath)) return;
    this.inFlight.add(filePath);
    try {
      if (!this.matches(folder, filePath)) return;
      const real = assertInsideAnyRoot(filePath, [folder.path]);
      const preset = presets.get(folder.presetId);
      if (!preset) {
        this.log(folder.id, "error", `Preset ${folder.presetId} non trovato`, real);
        return;
      }
      const already = queue.list().find((j) => j.sourcePath === real && ["queued", "running", "paused"].includes(j.state));
      if (already) {
        this.log(folder.id, "warn", "File già presente in coda, ignorato", real);
        return;
      }
      if (folder.dryRun) {
        this.log(folder.id, "info", `[dry-run] ${folder.action} → ${node_path.basename(real)} (preset ${preset.name})`, real);
        return;
      }
      if (folder.action === "ignore") {
        this.log(folder.id, "info", `Ignorato per regola: ${node_path.basename(real)}`, real);
        return;
      }
      if (folder.action === "proxy") {
        const asset = await media.probe(real);
        const proxy = await media.generateProxy(asset);
        this.log(folder.id, "info", `Proxy generato: ${proxy}`, real);
        return;
      }
      const target = node_path.join(folder.outputDir, `${basenameNoExt(real)}.${outputExtension(preset)}`);
      if (folder.conflict === "skip" && node_fs.existsSync(target)) {
        this.log(folder.id, "warn", "Output esistente, skip per policy", real);
        return;
      }
      const outputPath = folder.conflict === "overwrite" ? target : uniqueOutputPath(target, node_fs.existsSync);
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
      );
      this.log(folder.id, "info", `Accodato ${node_path.basename(real)} → ${outputPath}`, real);
    } catch (err) {
      this.log(folder.id, "error", `Errore: ${err.message}`, filePath);
    } finally {
      setTimeout(() => this.inFlight.delete(filePath), 1e3);
    }
  }
  /** Non-destructive scan used by the UI "Test regole" button. */
  test(id) {
    const folder = this.get(id);
    if (!folder) throw new Error("Watch folder non trovata");
    const results = [];
    let scanned = 0;
    const walk = (dir, depth) => {
      if (depth > 6 || scanned > 5e3) return;
      for (const entry of node_fs.readdirSync(dir, { withFileTypes: true })) {
        const full = node_path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (folder.recursive) walk(full, depth + 1);
          continue;
        }
        if (!entry.isFile()) continue;
        scanned++;
        if (this.matches(folder, full)) results.push(full);
      }
    };
    walk(folder.path, 0);
    return { matches: results, scanned };
  }
  logs(limit = 200) {
    return getDb().prepare("SELECT at, folder_id, level, message, file FROM watch_logs ORDER BY id DESC LIMIT ?").all(limit).map((row) => ({
      at: row.at,
      folderId: row.folder_id,
      level: row.level,
      message: row.message,
      file: row.file ?? void 0
    }));
  }
  log(folderId, level, message, file) {
    const entry = {
      at: (/* @__PURE__ */ new Date()).toISOString(),
      folderId,
      level,
      message: message.slice(0, 2e3),
      file: file?.slice(0, 4096)
    };
    try {
      getDb().prepare("INSERT INTO watch_logs (at, folder_id, level, message, file) VALUES (?, ?, ?, ?, ?)").run(entry.at, folderId, level, entry.message, entry.file ?? null);
      getDb().prepare("DELETE FROM watch_logs WHERE id NOT IN (SELECT id FROM watch_logs ORDER BY id DESC LIMIT 5000)").run();
    } catch (err) {
      logger.warn("watch", `log persist failed: ${err.message}`);
    }
    if (level === "error") logger.error("watch", message);
    else if (level === "warn") logger.warn("watch", message);
    else logger.info("watch", message);
    this.onLog?.(entry);
  }
  watchedIds() {
    return [...this.watchers.keys()];
  }
}
const watch = new WatchService();
const isMac = process.platform === "darwin";
class WindowManager {
  mainWindow = null;
  queueWindow = null;
  isQuitting = false;
  crashTimes = /* @__PURE__ */ new Map();
  loadFailures = /* @__PURE__ */ new Map();
  baseWebPreferences() {
    return {
      preload: node_path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false,
      devTools: !electron.app.isPackaged || process.env.MOLICUT_DEVTOOLS === "1",
      webviewTag: false,
      safeDialogs: true,
      navigateOnDragDrop: false
    };
  }
  allowedPrefixes() {
    const dev = process.env.ELECTRON_RENDERER_URL;
    return dev ? [dev] : ["file://"];
  }
  createMainWindow() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) return this.mainWindow;
    const startHidden = settings.get().startMinimized || settings.get().runAtLogin;
    const win = new electron.BrowserWindow({
      width: 1480,
      height: 920,
      minWidth: 920,
      minHeight: 560,
      show: false,
      resizable: true,
      maximizable: true,
      minimizable: true,
      fullscreenable: true,
      // Frameless windows need the native thick frame on Windows to expose
      // the OS resize border; otherwise the edge drag does nothing.
      thickFrame: true,
      backgroundColor: "#0e0f13",
      title: "MoliCut",
      icon: node_path.join(electron.app.getAppPath(), "resources", "icon.png"),
      ...isMac ? { titleBarStyle: "hidden", trafficLightPosition: { x: 14, y: 14 } } : { frame: false },
      webPreferences: this.baseWebPreferences()
    });
    this.mainWindow = win;
    const winId = win.id;
    const contentsId = win.webContents.id;
    trustWebContents(contentsId);
    hardenWindow(win, this.allowedPrefixes());
    this.installCrashRecovery(win);
    win.on("ready-to-show", () => {
      if (!startHidden) win.show();
    });
    win.on("close", (event) => {
      if (this.isQuitting) return;
      const active = queue.list().some((j) => j.state === "queued" || j.state === "running" || j.state === "paused");
      if (active) {
        event.preventDefault();
        win.hide();
        logger.info("windows", "editor hidden: queue still active (background mode)");
      } else {
        this.isQuitting = true;
        electron.app.quit();
      }
    });
    win.on("closed", () => {
      this.crashTimes.delete(winId);
      this.loadFailures.delete(winId);
      untrustWebContents(contentsId);
      this.mainWindow = null;
    });
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (/^https:\/\//.test(url)) void electron.shell.openExternal(url);
      return { action: "deny" };
    });
    this.load(win, "editor");
    return win;
  }
  createQueueWindow() {
    if (this.queueWindow && !this.queueWindow.isDestroyed()) {
      this.queueWindow.show();
      this.queueWindow.focus();
      return this.queueWindow;
    }
    const win = new electron.BrowserWindow({
      width: 1320,
      height: 820,
      minWidth: 820,
      minHeight: 520,
      show: false,
      resizable: true,
      maximizable: true,
      minimizable: true,
      fullscreenable: true,
      thickFrame: true,
      backgroundColor: "#0e0f13",
      title: "MoliCut — Render Queue",
      icon: node_path.join(electron.app.getAppPath(), "resources", "icon.png"),
      ...isMac ? { titleBarStyle: "hidden", trafficLightPosition: { x: 14, y: 14 } } : { frame: false },
      webPreferences: this.baseWebPreferences()
    });
    this.queueWindow = win;
    const winId = win.id;
    const contentsId = win.webContents.id;
    trustWebContents(contentsId);
    hardenWindow(win, this.allowedPrefixes());
    this.installCrashRecovery(win);
    win.on("ready-to-show", () => win.show());
    win.on("close", (event) => {
      if (this.isQuitting) return;
      event.preventDefault();
      win.hide();
    });
    win.on("closed", () => {
      this.crashTimes.delete(winId);
      this.loadFailures.delete(winId);
      untrustWebContents(contentsId);
      this.queueWindow = null;
    });
    this.load(win, "queue");
    return win;
  }
  /**
   * Renderer resilience: a crashed surface is reloaded a bounded number of
   * times, an unresponsive one offers a human decision, and neither path can
   * spin forever. Queue rendering lives in main, so it keeps running.
   */
  installCrashRecovery(win) {
    const wc = win.webContents;
    const view = () => win === this.queueWindow ? "queue" : "editor";
    let dialogOpen = false;
    wc.on("render-process-gone", (_event, details) => {
      if (this.isQuitting || details.reason === "clean-exit") return;
      const now = Date.now();
      const recent = (this.crashTimes.get(win.id) ?? []).filter((at) => now - at < 6e4);
      recent.push(now);
      this.crashTimes.set(win.id, recent);
      logger.error("windows", `${view()} renderer gone (${details.reason}), attempt ${recent.length}/3`);
      if (view() === "editor") recoveryState.set(true);
      if (recent.length > 3) {
        electron.dialog.showErrorBox(
          "MoliCut — ripristino non riuscito",
          "La finestra continua a chiudersi. I job in coda restano al sicuro nel processo principale.\n\nRiavvia MoliCut; se il problema persiste avvia in Safe Mode con MOLICUT_SAFE_MODE=1."
        );
        return;
      }
      setTimeout(() => {
        if (!win.isDestroyed() && !this.isQuitting) this.load(win, view());
      }, 350 * recent.length);
    });
    wc.on("unresponsive", () => {
      if (dialogOpen || this.isQuitting) return;
      dialogOpen = true;
      logger.warn("windows", `${view()} renderer unresponsive`);
      void electron.dialog.showMessageBox(win, {
        type: "warning",
        title: "MoliCut non risponde",
        message: "La finestra è temporaneamente bloccata.",
        detail: "Puoi attendere oppure ricaricare la finestra. La coda di rendering non viene interrotta.",
        buttons: ["Attendi", "Ricarica finestra"],
        defaultId: 0,
        cancelId: 0
      }).then(({ response }) => {
        if (response === 1 && !win.isDestroyed()) win.reload();
      }).finally(() => {
        dialogOpen = false;
      });
    });
    wc.on("did-fail-load", (_event, code, description, _url, isMainFrame) => {
      if (!isMainFrame || code === -3 || this.isQuitting) return;
      const failures = (this.loadFailures.get(win.id) ?? 0) + 1;
      this.loadFailures.set(win.id, failures);
      logger.error("windows", `${view()} load failed (${code} ${description}), attempt ${failures}/2`);
      if (failures <= 2) {
        setTimeout(() => {
          if (!win.isDestroyed()) this.load(win, view());
        }, 500 * failures);
      } else {
        electron.dialog.showErrorBox("MoliCut — caricamento fallito", `Impossibile caricare l'interfaccia (${code} ${description}).`);
      }
    });
    wc.on("did-finish-load", () => this.loadFailures.set(win.id, 0));
  }
  load(win, view) {
    const devUrl = process.env.ELECTRON_RENDERER_URL;
    if (devUrl) {
      void win.loadURL(`${devUrl}?view=${view}`);
    } else {
      void win.loadFile(node_path.join(__dirname, "../renderer/index.html"), { query: { view } });
    }
  }
  showMain() {
    const win = this.mainWindow && !this.mainWindow.isDestroyed() ? this.mainWindow : this.createMainWindow();
    win.show();
    win.focus();
  }
  showQueue() {
    const win = this.queueWindow && !this.queueWindow.isDestroyed() ? this.queueWindow : this.createQueueWindow();
    win.show();
    win.focus();
  }
  toggleQueue() {
    if (this.queueWindow?.isVisible()) this.queueWindow.hide();
    else this.showQueue();
  }
  broadcast(channel, payload) {
    for (const win of [this.mainWindow, this.queueWindow]) {
      if (win && !win.isDestroyed() && !win.webContents.isDestroyed()) {
        win.webContents.send(channel, payload);
      }
    }
  }
  allWindows() {
    return [this.mainWindow, this.queueWindow].filter((w) => Boolean(w && !w.isDestroyed()));
  }
}
const windows = new WindowManager();
class TrayController {
  tray = null;
  interval = null;
  create() {
    if (this.tray) return;
    try {
      const icon = electron.nativeImage.createFromPath(node_path.join(electron.app.getAppPath(), "resources", "icon.png")).resize({ width: 32, height: 32 });
      this.tray = new electron.Tray(icon.isEmpty() ? electron.nativeImage.createEmpty() : icon);
      this.tray.on("click", () => windows.showMain());
      this.tray.on("double-click", () => windows.showMain());
      this.rebuild();
      this.interval = setInterval(() => this.rebuild(), 5e3);
      this.interval.unref?.();
      logger.info("tray", "tray icon created");
    } catch (err) {
      logger.warn("tray", `tray unavailable: ${err.message}`);
    }
  }
  rebuild() {
    if (!this.tray) return;
    const stats2 = queue.stats();
    const paused = stats2.paused > 0;
    this.tray.setToolTip(
      stats2.running > 0 || stats2.queued > 0 ? `MoliCut — ${stats2.running} attivi / ${stats2.queued} in coda (${stats2.progress}%)` : "MoliCut"
    );
    if (process.platform === "darwin" || process.platform === "linux") {
      try {
        electron.app.setBadgeCount(stats2.running + stats2.queued);
      } catch {
      }
    }
    const menu = electron.Menu.buildFromTemplate([
      { label: "Apri MoliCut", click: () => windows.showMain() },
      { label: "Render Queue", click: () => windows.showQueue() },
      { type: "separator" },
      { label: `In coda: ${stats2.queued} · Attivi: ${stats2.running} · Errori: ${stats2.error}`, enabled: false },
      {
        label: paused ? "Riprendi tutta la coda" : "Metti in pausa la coda",
        enabled: stats2.running + stats2.queued + stats2.paused > 0,
        click: () => {
          if (paused) queue.resume();
          else queue.pause();
          this.rebuild();
        }
      },
      { label: "Apri cartella export", click: () => void import("electron").then(({ shell }) => shell.openPath(node_path.join(electron.app.getPath("userData"), "exports"))) },
      { type: "separator" },
      {
        label: "Esci",
        click: () => {
          windows.isQuitting = true;
          electron.app.quit();
        }
      }
    ]);
    this.tray.setContextMenu(menu);
  }
  notify(title, body, kind = "info") {
    if (!settings.get().notifications) return;
    if (!electron.Notification.isSupported()) return;
    try {
      const notification = new electron.Notification({ title, body: body.slice(0, 400), urgency: kind === "error" ? "critical" : "normal" });
      notification.on("click", () => windows.showQueue());
      notification.show();
    } catch (err) {
      logger.warn("tray", `notification failed: ${err.message}`);
    }
  }
  destroy() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.tray?.destroy();
    this.tray = null;
  }
}
const tray = new TrayController();
let metricsCache = null;
function dirSize(dir) {
  try {
    return node_fs.readdirSync(dir, { withFileTypes: true }).reduce((sum, entry) => {
      const full = node_path.join(dir, entry.name);
      if (entry.isDirectory()) return sum + dirSize(full);
      try {
        return sum + node_fs.statSync(full).size;
      } catch {
        return sum;
      }
    }, 0);
  } catch {
    return 0;
  }
}
async function sampleMetrics() {
  if (metricsCache && Date.now() - metricsCache.at < 1500) return metricsCache.value;
  const [load, mem] = await Promise.all([si.currentLoad().catch(() => null), si.mem().catch(() => null)]);
  const cacheBytes = dirSize(appPaths().thumbnails) + dirSize(appPaths().waveforms) + dirSize(appPaths().proxies);
  const value = {
    at: (/* @__PURE__ */ new Date()).toISOString(),
    cpuPercent: roundTo(load?.currentLoad ?? 0, 1),
    memoryUsedMB: Math.round((mem?.active ?? 0) / 1024 ** 2),
    memoryTotalMB: Math.round((mem?.total ?? 0) / 1024 ** 2),
    gpuPercent: null,
    renderCacheMB: Math.round(cacheBytes / 1024 ** 2 * 10) / 10,
    activeWorkers: queue.runningCount,
    previewFps: 0,
    droppedFrames: 0
  };
  metricsCache = { at: Date.now(), value };
  return value;
}
async function importPaths(paths, generateProxies) {
  const assets = [];
  for (const path of paths) {
    try {
      const asset = await media.probe(path);
      assets.push(asset);
      media.registerRoot(path);
      if (generateProxies && asset.kind === "video") media.startProxy(asset);
    } catch (err) {
      logger.warn("media", `import failed for ${path}: ${err.message}`);
      windows.broadcast("toast", { kind: "warn", message: `Import ignorato: ${node_path.basename(path)} — ${err.message}` });
    }
  }
  return assets;
}
function applySettingsSideEffects(updated) {
  queue.setSettings(updated);
  watch.syncEnabled(updated.watchEnabled);
  if (electron.app.isPackaged) {
    try {
      electron.app.setLoginItemSettings({ openAtLogin: updated.runAtLogin, openAsHidden: updated.startMinimized });
    } catch {
    }
  }
  windows.broadcast("settings:changed", { settings: updated });
}
async function buildDiagnosticBundle() {
  const dir = node_path.join(appPaths().userData, "diagnostics");
  node_fs.mkdirSync(dir, { recursive: true });
  const target = node_path.join(dir, `molicut-diagnostic-${Date.now()}.zip`);
  const zip = new AdmZip();
  const report = {
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    app: {
      version: electron.app.getVersion(),
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
      platform: process.platform,
      arch: process.arch,
      packaged: electron.app.isPackaged
    },
    hardware: hardware.cachedProfile(),
    dependencies: await dependencies.status(),
    settings: settings.get(),
    ipc: ipcStats(),
    queue: { stats: queue.stats(), jobs: queue.list().slice(0, 200) },
    logs: logger.recent(2e3)
  };
  zip.addFile("report.json", Buffer.from(redactSensitive(JSON.stringify(report, null, 2)), "utf8"));
  const logPath = node_path.join(appPaths().logs, "molicut.log");
  if (node_fs.existsSync(logPath)) {
    zip.addFile("molicut.log", Buffer.from(redactSensitive(node_fs.readFileSync(logPath, "utf8").slice(-2e6)), "utf8"));
  }
  zip.addFile("README.txt", Buffer.from("MoliCut diagnostic bundle. PII redacted. No telemetry was sent.\n", "utf8"));
  zip.writeZip(target);
  logger.info("debug", `diagnostic bundle written: ${target}`);
  return target;
}
function registerIpcHandlers() {
  handle("app:info", () => ({
    name: electron.app.getName(),
    version: electron.app.getVersion(),
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    userDataPath: electron.app.getPath("userData"),
    isPackaged: electron.app.isPackaged,
    recoveredFromCrash: (() => {
      const recovered = recoveryState.get();
      recoveryState.set(false);
      return recovered;
    })(),
    ffmpegAvailable: Boolean(ffmpeg.binaries().ffmpeg.path && (node_fs.existsSync(ffmpeg.binaries().ffmpeg.path) || ffmpeg.binaries().ffmpeg.source === "system")),
    dbDriver: (() => {
      try {
        return getDb().kind;
      } catch {
        return "unknown";
      }
    })()
  }));
  handle("settings:get", () => ({ settings: settings.get() }));
  handle("settings:set", (input) => {
    const updated = settings.update(input.patch);
    applySettingsSideEffects(updated);
    return { settings: updated };
  });
  handle("settings:reset", () => {
    const updated = settings.reset();
    applySettingsSideEffects(updated);
    return { settings: updated };
  });
  handle("project:new", (input) => ({ project: projectService.newProject(input.name) }));
  handle("project:open", async (input) => {
    if (!input.path) throw new Error("Path richiesto");
    const opened = await projectService.open(input.path);
    for (const asset of opened.project.media) media.registerRoot(asset.path);
    return opened;
  });
  handle("project:openDialog", async (_input, { event }) => {
    const parent = electron.BrowserWindow.fromWebContents(event.sender);
    const opened = await projectService.openWithDialog(parent);
    for (const asset of opened.project?.media ?? []) media.registerRoot(asset.path);
    return opened;
  });
  handle("project:save", async (input, { event }) => {
    const parent = electron.BrowserWindow.fromWebContents(event.sender);
    return projectService.save(parent, input.project, input.path);
  });
  handle("project:autosave", (input) => projectService.autosave(input.project));
  handle("project:recoverAutosave", () => {
    const recovered = projectService.latestAutosave();
    if (!recovered) return null;
    for (const asset of recovered.project.media) media.registerRoot(asset.path);
    return recovered;
  });
  handle("project:recent", () => ({ items: projectService.recent() }));
  handle("project:exportInterchange", async (input, { event }) => {
    const result = await projectService.exportInterchange(
      electron.BrowserWindow.fromWebContents(event.sender),
      input.project,
      input.sequenceId,
      input.format
    );
    return { path: result.canceled ? null : result.path, canceled: result.canceled };
  });
  handle("media:importDialog", async (input, { event }) => {
    const parent = electron.BrowserWindow.fromWebContents(event.sender);
    const options = {
      title: "Importa media",
      properties: ["openFile", "multiSelections"],
      filters: [
        { name: "Media", extensions: ["mp4", "mov", "mkv", "avi", "webm", "mxf", "m4v", "mts", "m2ts", "wav", "mp3", "aac", "flac", "ogg", "png", "jpg", "jpeg", "tif", "tiff", "exr", "dpx", "gif"] },
        { name: "Tutti i file", extensions: ["*"] }
      ]
    };
    const result = parent ? await electron.dialog.showOpenDialog(parent, options) : await electron.dialog.showOpenDialog(options);
    if (result.canceled || result.filePaths.length === 0) return { assets: [], canceled: true };
    return { assets: await importPaths(result.filePaths, input.generateProxies), canceled: false };
  });
  handle("media:importPaths", async (input) => ({ assets: await importPaths(input.paths, input.generateProxies) }));
  handle("media:probe", async (input) => {
    const asset = await media.probe(input.path);
    media.registerRoot(input.path);
    return { asset };
  });
  handle("media:thumbnail", (input) => media.thumbnail(input.path, input.timeSec));
  handle("media:waveform", (input) => media.waveform(input.path, input.buckets));
  handle("media:relink", async (input) => {
    const asset = await media.probe(input.newPath);
    media.registerRoot(input.newPath);
    return { asset: { ...asset, id: input.assetId } };
  });
  handle("media:chooseRelink", async (input, { event }) => {
    const parent = electron.BrowserWindow.fromWebContents(event.sender);
    const options = {
      title: `Rilink ${input.name ?? "media"}`,
      properties: ["openFile"],
      filters: [{ name: "Media", extensions: ["mp4", "mov", "mkv", "avi", "webm", "mxf", "wav", "mp3", "png", "jpg", "exr", "dpx"] }]
    };
    const result = parent ? await electron.dialog.showOpenDialog(parent, options) : await electron.dialog.showOpenDialog(options);
    if (result.canceled || result.filePaths.length === 0) return { asset: null, canceled: true };
    const asset = await media.probe(result.filePaths[0]);
    media.registerRoot(result.filePaths[0]);
    return { asset: { ...asset, id: input.assetId }, canceled: false };
  });
  handle("media:missing", (input) => ({ missing: media.missingFiles(input.paths) }));
  handle("queue:list", () => ({
    jobs: queue.list(),
    stats: queue.stats(),
    concurrency: settings.get().maxConcurrentJobs
  }));
  handle("queue:add", async (input) => {
    const jobs = await queue.add(input.items);
    windows.broadcast("toast", {
      kind: "success",
      message: `${jobs.length} job accodat${jobs.length === 1 ? "o" : "i"}`
    });
    return { jobs };
  });
  handle("queue:action", (input) => {
    switch (input.action) {
      case "pause":
        return { jobs: queue.pause(input.jobId) };
      case "resume":
        return { jobs: queue.resume(input.jobId) };
      case "cancel":
        if (!input.jobId) throw new Error("jobId richiesto");
        return { jobs: queue.cancel(input.jobId) };
      case "retry":
        if (!input.jobId) throw new Error("jobId richiesto");
        return { jobs: queue.retry(input.jobId) };
      case "remove":
        if (!input.jobId) throw new Error("jobId richiesto");
        return { jobs: queue.remove(input.jobId) };
      case "duplicate":
        if (!input.jobId) throw new Error("jobId richiesto");
        return { jobs: queue.duplicate(input.jobId) };
      case "stop-after-current":
        return { jobs: queue.setStopAfterCurrent(input.value ?? true) };
      case "pause-all":
        return { jobs: queue.pause() };
      case "resume-all":
        return { jobs: queue.resume() };
      case "clear-finished":
        return { jobs: queue.clearFinished() };
      default:
        throw new Error("Azione non supportata");
    }
  });
  handle("queue:reorder", (input) => ({ jobs: queue.reorder(input.jobId, input.toIndex) }));
  handle("queue:setPriority", (input) => ({ jobs: queue.setPriority(input.jobId, input.priority) }));
  handle("queue:setConcurrency", (input) => {
    const updated = settings.update({ maxConcurrentJobs: input.value });
    queue.setSettings(updated);
    return { jobs: queue.setConcurrency(input.value) };
  });
  handle("queue:openWindow", () => {
    windows.showQueue();
    return { ok: true };
  });
  handle("queue:exportReport", async (input, { event }) => {
    const parent = electron.BrowserWindow.fromWebContents(event.sender);
    const ext = input.format === "json" ? "json" : "csv";
    const options = {
      title: "Esporta report coda",
      defaultPath: node_path.join(appPaths().userData, `molicut-report-${Date.now()}.${ext}`),
      filters: [{ name: ext.toUpperCase(), extensions: [ext] }]
    };
    const result = parent ? await electron.dialog.showSaveDialog(parent, options) : await electron.dialog.showSaveDialog(options);
    if (result.canceled || !result.filePath) return { path: "", canceled: true };
    node_fs.writeFileSync(result.filePath, queue.exportReport(input.format, input.jobIds), "utf8");
    return { path: result.filePath, canceled: false };
  });
  handle("presets:list", () => ({ presets: presets.list() }));
  handle("presets:save", (input) => ({ preset: presets.save(input.preset) }));
  handle("presets:delete", (input) => ({ presets: presets.delete(input.id) }));
  handle("presets:export", async (input, { event }) => {
    const parent = electron.BrowserWindow.fromWebContents(event.sender);
    const options = {
      title: "Esporta preset",
      defaultPath: node_path.join(appPaths().userData, "molicut-presets.json"),
      filters: [{ name: "JSON", extensions: ["json"] }]
    };
    const result = parent ? await electron.dialog.showSaveDialog(parent, options) : await electron.dialog.showSaveDialog(options);
    if (result.canceled || !result.filePath) return { path: null, canceled: true };
    presets.exportToFile(result.filePath, input.ids);
    return { path: result.filePath, canceled: false };
  });
  handle("presets:import", async (_input, { event }) => {
    const parent = electron.BrowserWindow.fromWebContents(event.sender);
    const options = {
      title: "Importa preset",
      properties: ["openFile"],
      filters: [{ name: "JSON", extensions: ["json"] }]
    };
    const result = parent ? await electron.dialog.showOpenDialog(parent, options) : await electron.dialog.showOpenDialog(options);
    if (result.canceled || result.filePaths.length === 0) return { presets: [], canceled: true };
    return { presets: presets.importFromFile(result.filePaths[0]), canceled: false };
  });
  handle("presets:suggest", (input) => ({ presets: presets.suggest(input.asset) }));
  handle("watch:list", () => ({ folders: watch.list() }));
  handle("watch:add", (input) => ({ folder: watch.add(input.folder) }));
  handle("watch:update", (input) => ({ folder: watch.update(input.folder) }));
  handle("watch:remove", (input) => ({ folders: watch.remove(input.id) }));
  handle("watch:logs", (input) => ({ logs: watch.logs(input.limit) }));
  handle("watch:test", (input) => watch.test(input.id));
  handle("system:profile", () => ({ profile: hardware.cachedProfile() }));
  handle("system:scan", async (input) => {
    const profile = await hardware.scan(input.force, (stage, percent, message) => {
      windows.broadcast("scan:progress", { stage, percent, message });
    });
    windows.broadcast("toast", {
      kind: "info",
      message: `Hardware: ${profile.gpus[0]?.model ?? profile.cpu.brand} · backend ${profile.acceleration.preferredBackend}`
    });
    return { profile };
  });
  handle("system:benchmark", () => hardware.benchmark());
  handle("system:testEncoder", (input) => {
    const test = hardware.testEncoder(input.encoderId, input.codec);
    return test.then((t) => ({
      encoderId: input.encoderId,
      ok: t.ok,
      encodeFps: t.fps,
      detail: t.detail,
      durationMs: t.ms
    }));
  });
  handle("deps:status", async () => ({ dependencies: await dependencies.status() }));
  handle("deps:download", (input) => dependencies.download(input.component));
  handle("debug:logs", (input) => ({ logs: logger.recent(input.limit, input.level) }));
  handle("debug:clientError", (input) => {
    const where = input.source ?? "renderer";
    const detail = [input.message, input.stack, input.componentStack].filter(Boolean).join("\n");
    logger.error("renderer", `[${where}] ${detail}`.slice(0, 2e4));
    return { ok: true };
  });
  handle("debug:ipcStats", () => ipcStats());
  handle("debug:metrics", () => sampleMetrics());
  handle("debug:action", async (input) => {
    switch (input.action) {
      case "reset-cache": {
        for (const dir of [appPaths().thumbnails, appPaths().waveforms, appPaths().cache]) {
          node_fs.rmSync(dir, { recursive: true, force: true });
          node_fs.mkdirSync(dir, { recursive: true });
        }
        return { ok: true, detail: "Cache thumbnail, waveform e render svuotata." };
      }
      case "regenerate-proxies": {
        node_fs.rmSync(appPaths().proxies, { recursive: true, force: true });
        node_fs.mkdirSync(appPaths().proxies, { recursive: true });
        return { ok: true, detail: "Proxy eliminati: verranno rigenerati al prossimo import (vedi ROADMAP MEDIA-3)." };
      }
      case "flush-shaders":
        windows.broadcast("toast", { kind: "info", message: "Flush shader cache richiesto al renderer" });
        return { ok: true, detail: "Richiesta inviata al renderer (WebGL2/WebGPU context reset)." };
      case "restart-engine": {
        ffmpeg.invalidate();
        await hardware.scan(true, (stage, percent, message) => windows.broadcast("scan:progress", { stage, percent, message }));
        backendInfo.reset();
        return { ok: true, detail: "Motore media riavviato: binari ri-risolti e hardware riscansionato." };
      }
      case "redetect-hardware": {
        const profile = await hardware.scan(true, (stage, percent, message) => windows.broadcast("scan:progress", { stage, percent, message }));
        backendInfo.set(profile.acceleration.preferredBackend);
        return { ok: true, detail: `Encoder rilevati: ${profile.encoders.filter((e) => e.available).map((e) => e.id).join(", ")}` };
      }
      case "repair-queue-db": {
        const backup = backupDatabase("pre-repair");
        getDb().prepare("UPDATE queue_jobs SET state = 'queued' WHERE state = 'running'").run();
        return { ok: true, detail: `Coda riparata. Backup: ${backup ?? "non creato (DB assente)"}` };
      }
      case "safe-mode-on": {
        applySettingsSideEffects(settings.update({ safeMode: true }));
        queue.pause();
        return { ok: true, detail: "Safe mode attivo: plugin, GPU e automazioni disabilitati. Riavvia per applicare tutto." };
      }
      case "safe-mode-off": {
        applySettingsSideEffects(settings.update({ safeMode: false }));
        return { ok: true, detail: "Safe mode disattivato." };
      }
      case "clear-logs":
        logger.clear();
        return { ok: true, detail: "Buffer log svuotato." };
      default:
        throw new Error("Azione debug non supportata");
    }
  });
  handle("debug:bundle", async () => ({ path: await buildDiagnosticBundle() }));
  handle("window:control", (input, { event }) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    switch (input.action) {
      case "minimize":
        win?.minimize();
        break;
      case "maximize":
        if (win?.isMaximized()) win.unmaximize();
        else win?.maximize();
        break;
      case "close":
        win?.close();
        break;
      case "toggle-devtools":
        if (win && (!electron.app.isPackaged || process.env.MOLICUT_DEVTOOLS === "1")) win.webContents.toggleDevTools();
        break;
      case "open-queue":
        windows.showQueue();
        break;
      case "open-editor":
        windows.showMain();
        break;
    }
    return { ok: true };
  });
  handle("shell:reveal", (input) => {
    if (!node_fs.existsSync(input.path)) throw new Error("Path non trovato");
    electron.shell.showItemInFolder(input.path);
    return { ok: true };
  });
  handle("updater:check", () => updater.check());
  handle("updater:install", () => {
    updater.install();
    return { ok: true };
  });
  handle("plugins:list", () => ({ plugins: plugins.list() }));
  handle("plugins:install", async (input) => ({ plugin: await plugins.install(input.path) }));
  handle("plugins:toggle", (input) => ({ plugins: plugins.toggle(input.id, input.enabled) }));
  logger.info("ipc", "handlers registered");
}
electron.app.setName("MoliCut");
if (process.platform === "win32") electron.app.setAppUserModelId("studio.molicut.app");
if (process.env.MOLICUT_USER_DATA) electron.app.setPath("userData", process.env.MOLICUT_USER_DATA);
electron.app.commandLine.appendSwitch("enable-gpu-rasterization");
electron.app.commandLine.appendSwitch("enable-zero-copy");
registerPrivilegedSchemes();
const gotLock = electron.app.requestSingleInstanceLock();
if (!gotLock) {
  electron.app.quit();
} else {
  electron.app.on("second-instance", () => windows.showMain());
  process.on("uncaughtException", (err) => {
    logger.error("main", `uncaught exception: ${err.stack ?? err.message}`);
    try {
      const dir = node_path.join(electron.app.getPath("userData"), "logs");
      node_fs.mkdirSync(dir, { recursive: true });
      node_fs.writeFileSync(node_path.join(dir, `uncaught-${Date.now()}.json`), JSON.stringify({ at: (/* @__PURE__ */ new Date()).toISOString(), message: err.message, stack: err.stack }, null, 2));
    } catch {
    }
  });
  process.on("unhandledRejection", (reason) => {
    logger.error("main", `unhandled rejection: ${String(reason)}`);
  });
  electron.app.whenReady().then(async () => {
    ensureAppDirs();
    recoveredFromCrash = detectUncleanShutdown();
    recoveryState.set(recoveredFromCrash);
    await initDatabase();
    settings.init();
    logger.info("main", `MoliCut ${electron.app.getVersion()} starting (${process.platform}-${process.arch})`);
    queue.setEvents({
      changed: (jobs, stats2) => windows.broadcast("queue:changed", { jobs, stats: stats2 }),
      progress: (jobId, p) => windows.broadcast("queue:progress", {
        jobId,
        progress: p.percent,
        fps: p.fps,
        speed: p.speed,
        etaSec: p.etaSec,
        sizeBytes: p.sizeBytes
      }),
      log: (jobId, line) => windows.broadcast("queue:log", { jobId, line }),
      notify: (title, body, kind) => tray.notify(title, body, kind),
      fallback: (message) => windows.broadcast("toast", { kind: "warn", message })
    });
    queue.init(settings.get());
    watch.setSettingsProvider(() => settings.get());
    watch.onLog = (entry) => windows.broadcast("watch:log", entry);
    watch.init();
    media.onProxyReady = (mediaId, proxyPath) => windows.broadcast("media:proxy-ready", { mediaId, proxyPath });
    setMediaRoots(() => media.mediaRoots());
    applySessionHardening(electron.session.defaultSession);
    registerMediaProtocol();
    registerIpcHandlers();
    electron.Menu.setApplicationMenu(null);
    windows.createMainWindow();
    tray.create();
    logger.subscribe((entry) => windows.broadcast("log", entry));
    electron.app.on("web-contents-created", (_event, contents) => {
      contents.setWindowOpenHandler(() => ({ action: "deny" }));
      contents.on("will-navigate", (event) => event.preventDefault());
    });
    electron.app.on("render-process-gone", (_event, _contents, details) => {
      logger.error("main", `renderer crashed: ${details.reason}`);
      try {
        const crashDir = appPaths().logs;
        node_fs.mkdirSync(crashDir, { recursive: true });
        node_fs.writeFileSync(node_path.join(crashDir, `crash-${Date.now()}.json`), JSON.stringify(details, null, 2), "utf8");
      } catch {
      }
    });
    electron.app.on("child-process-gone", (_event, details) => {
      if (details.reason === "clean-exit") return;
      logger.warn("main", `child process gone: ${details.type} ${details.reason}`);
      if (details.type === "GPU") {
        windows.broadcast("toast", {
          kind: "warn",
          message: "Processo GPU riavviato: la preview continua in fallback. Controlla la scheda Debug ▸ GPU."
        });
      }
    });
    electron.app.on("activate", () => windows.showMain());
    setTimeout(() => {
      void hardware.scan(false, (stage, percent, message) => windows.broadcast("scan:progress", { stage, percent, message })).then((profile) => {
        backendInfo.set(profile.acceleration.preferredBackend);
        logger.info("main", `acceleration strategy: ${profile.acceleration.preferredBackend}`);
        if (!settings.isSafeMode()) {
          const backend = profile.acceleration.preferredBackend;
          windows.broadcast("toast", {
            kind: backend === "software" ? "warn" : "success",
            message: backend === "software" ? "Nessun encoder hardware: export e preview useranno la CPU (fallback esplicito)." : `Accelerazione hardware attiva: ${backend.toUpperCase()}`
          });
        }
      }).catch((err) => logger.error("main", `hardware scan failed: ${err.message}`));
    }, 900);
    if (recoveredFromCrash) {
      setTimeout(() => {
        windows.broadcast("toast", {
          kind: "warn",
          message: "MoliCut ripristinato dopo una chiusura imprevista. Recupero l’ultimo autosave disponibile."
        });
      }, 1600);
    }
    logger.info("main", "ready");
  }).catch((err) => {
    const error = err instanceof Error ? err : new Error(String(err));
    logger.error("main", `bootstrap failed: ${error.stack ?? error.message}`);
    electron.dialog.showErrorBox(
      "MoliCut non è riuscito ad avviarsi",
      `${error.message}

Avvia con MOLICUT_SAFE_MODE=1 per disattivare accelerazione hardware e plugin.`
    );
    electron.app.quit();
  });
  electron.app.on("window-all-closed", () => {
    if (process.platform === "darwin") return;
    const active = queue.list().some((j) => ["queued", "running", "paused"].includes(j.state));
    if (!active) electron.app.quit();
  });
  let shuttingDown = false;
  electron.app.on("before-quit", (event) => {
    if (shuttingDown) return;
    event.preventDefault();
    shuttingDown = true;
    windows.isQuitting = true;
    logger.info("main", "shutdown requested");
    void (async () => {
      try {
        await queue.shutdown();
        watch.stopAll();
        tray.destroy();
        closeDatabase();
      } catch (err) {
        logger.error("main", `shutdown error: ${err.message}`);
      } finally {
        markCleanShutdown();
        electron.app.quit();
      }
    })();
  });
}
let recoveredFromCrash = false;
function sessionMarkerPath() {
  return node_path.join(electron.app.getPath("userData"), "logs", "session.json");
}
function detectUncleanShutdown() {
  const marker = sessionMarkerPath();
  let unclean = false;
  try {
    if (node_fs.existsSync(marker)) {
      const parsed = JSON.parse(node_fs.readFileSync(marker, "utf8"));
      unclean = parsed.clean === false;
    }
  } catch {
    unclean = false;
  }
  try {
    node_fs.mkdirSync(node_path.join(electron.app.getPath("userData"), "logs"), { recursive: true });
    node_fs.writeFileSync(marker, JSON.stringify({ clean: false, pid: process.pid, startedAt: (/* @__PURE__ */ new Date()).toISOString() }, null, 2));
  } catch {
  }
  return unclean;
}
function markCleanShutdown() {
  try {
    node_fs.writeFileSync(sessionMarkerPath(), JSON.stringify({ clean: true, at: (/* @__PURE__ */ new Date()).toISOString() }, null, 2));
  } catch {
  }
}
function trustedWindows() {
  return windows.allWindows();
}
exports.hardenWindow = hardenWindow;
exports.trustedWindows = trustedWindows;
