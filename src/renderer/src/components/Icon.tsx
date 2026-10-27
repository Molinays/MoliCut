import type { CSSProperties, JSX } from 'react'

export type IconName =
  | 'play'
  | 'pause'
  | 'stop'
  | 'rewind'
  | 'forward'
  | 'skipStart'
  | 'skipEnd'
  | 'undo'
  | 'redo'
  | 'cut'
  | 'export'
  | 'queue'
  | 'settings'
  | 'folder'
  | 'plus'
  | 'trash'
  | 'eye'
  | 'eyeOff'
  | 'lock'
  | 'unlock'
  | 'volume'
  | 'search'
  | 'film'
  | 'image'
  | 'audio'
  | 'chevronDown'
  | 'chevronRight'
  | 'close'
  | 'minimize'
  | 'maximize'
  | 'bug'
  | 'waveform'
  | 'grid'
  | 'list'
  | 'keyframe'
  | 'magnet'
  | 'check'
  | 'warning'
  | 'refresh'
  | 'chip'
  | 'download'
  | 'save'
  | 'command'
  | 'sparkles'
  | 'zoomIn'
  | 'zoomOut'
  | 'external'
  | 'layers'
  | 'gauge'
  | 'shield'
  | 'file'

const paths: Record<IconName, JSX.Element> = {
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="7" y="5" width="3.4" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.6" y="5" width="3.4" height="14" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  stop: <rect x="6.5" y="6.5" width="11" height="11" rx="1.6" fill="currentColor" stroke="none" />,
  rewind: (
    <>
      <path d="M11 6.5v11L3.5 12z" fill="currentColor" stroke="none" />
      <path d="M20.5 6.5v11L13 12z" fill="currentColor" stroke="none" />
    </>
  ),
  forward: (
    <>
      <path d="M13 6.5v11L20.5 12z" fill="currentColor" stroke="none" />
      <path d="M3.5 6.5v11L11 12z" fill="currentColor" stroke="none" />
    </>
  ),
  skipStart: (
    <>
      <path d="M7 5v14" />
      <path d="M19 6.5v11L9 12z" fill="currentColor" stroke="none" />
    </>
  ),
  skipEnd: (
    <>
      <path d="M17 5v14" />
      <path d="M5 6.5v11L15 12z" fill="currentColor" stroke="none" />
    </>
  ),
  undo: <path d="M9 7H4v5M4 12a8 8 0 1015.5 3" />,
  redo: <path d="M15 7h5v5m0 0A8 8 0 013.5 15" />,
  cut: (
    <>
      <circle cx="6.5" cy="7" r="2.6" />
      <circle cx="6.5" cy="17" r="2.6" />
      <path d="M8.7 8.6L20 19M8.7 15.4L20 5" />
    </>
  ),
  export: <path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v4a1 1 0 001 1h12a1 1 0 001-1v-4" />,
  queue: (
    <>
      <path d="M4 6h11M4 12h11M4 18h7" />
      <path d="M18.5 12.5v6l4-3z" fill="currentColor" stroke="none" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 2.6v2.2M12 19.2v2.2M4.4 7.2l1.9 1.1M17.7 15.7l1.9 1.1M4.4 16.8l1.9-1.1M17.7 8.3l1.9-1.1" />
    </>
  ),
  folder: <path d="M3.5 6.5a1.5 1.5 0 011.5-1.5h4l2 2.5h8A1.5 1.5 0 0120.5 9v8a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 17z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M9 7V4.5h6V7m-8.5 0l.8 13h9.4l.8-13M10 11v5M14 11v5" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  eyeOff: <path d="M4 4l16 16M10.6 6.1A9.6 9.6 0 0112 6c6 0 9.5 6 9.5 6a17 17 0 01-3 3.5M6.4 8.1A17 17 0 002.5 12S6 18 12 18a9 9 0 003.4-.6M9.9 9.9a3 3 0 004.2 4.2" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 018 0v2.5" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 017.5-2" />
    </>
  ),
  volume: (
    <>
      <path d="M4 9.5h3L12 5.5v13L7 14.5H4z" />
      <path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="M15 15l4.5 4.5" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M7 4.5v15M17 4.5v15M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.8" />
      <path d="M4 17l5-5 4 4 3-3 4 4" />
    </>
  ),
  audio: <path d="M4 13V9m4 8V7m4 10V5m4 9v-4m4 5V9" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  minimize: <path d="M5 12h14" />,
  maximize: <rect x="5.5" y="5.5" width="13" height="13" rx="1.5" />,
  bug: (
    <>
      <rect x="7.5" y="7" width="9" height="12" rx="4.5" />
      <path d="M9 7V5.5a3 3 0 016 0V7M4 10h3M17 10h3M4 15h3M17 15h3M12 7v12" />
    </>
  ),
  waveform: <path d="M3 12h2m3-6v12m4-9v6m4-9v12m4-6h2" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  list: <path d="M4 7h16M4 12h16M4 17h16" />,
  keyframe: <path d="M12 4l7 8-7 8-7-8z" />,
  magnet: <path d="M5 5v7a7 7 0 0014 0V5h-4v7a3 3 0 01-6 0V5z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  warning: <path d="M12 4l9 16H3zM12 10v4.5M12 17.5v.01" />,
  refresh: <path d="M20 7v5h-5M4 17v-5h5M5.5 8A8 8 0 0119 9.5M18.5 16A8 8 0 015 14.5" />,
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
    </>
  ),
  download: <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" />,
  save: <path d="M5 4h11l3 3v13H5zM8 4v5h6V4M8 20v-6h8v6" />,
  command: <path d="M9 6a3 3 0 11-3 3h12a3 3 0 11-3-3v12a3 3 0 113-3H6a3 3 0 113 3z" />,
  sparkles: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z" />,
  zoomIn: <path d="M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15 15l4.5 4.5M10.5 8v5M8 10.5h5" />,
  zoomOut: <path d="M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15 15l4.5 4.5M8 10.5h5" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />,
  layers: <path d="M12 3l9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" />,
  gauge: (
    <>
      <path d="M4 18a8 8 0 1116 0" />
      <path d="M12 18l4-6" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4.5" />,
  file: <path d="M6 3h7l5 5v13H6zM13 3v5h5" />
}

interface IconProps {
  name: IconName
  size?: number
  className?: string
  style?: CSSProperties
  strokeWidth?: number
}

export function Icon({ name, size = 16, className, style, strokeWidth = 1.7 }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}
