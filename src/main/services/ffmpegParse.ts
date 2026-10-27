/**
 * Dependency-free parsing helpers for FFmpeg CLI output.
 *
 * Kept separate from `ffmpeg.ts` (which imports Electron through `paths.ts`)
 * so the parsers can be unit tested in a plain Node environment.
 */

/**
 * Parse `ffmpeg -encoders`. Each row is `<type><5 capability flags>` then the
 * encoder name, e.g. ` V....D h264_nvenc  NVIDIA NVENC H.264 encoder`.
 *
 * The previous pattern consumed only four flag characters, so every row from a
 * modern FFmpeg build failed to match: NVENC/AMF/QSV were never detected and
 * the app silently rendered with the software backend.
 */
export function parseEncoderList(stdout: string): string[] {
  const out: string[] = []
  for (const line of stdout.split(/\r?\n/)) {
    const match = /^\s*[VAS][.FSXBD]{4,7}\s+([A-Za-z0-9_]+)\s/.exec(line)
    if (match?.[1]) out.push(match[1])
  }
  return out
}
