import { useId, type JSX } from 'react'

/**
 * Single brand mark for every renderer surface. The SVG is inline (no request,
 * no flash) and the gradient id is scoped per instance to avoid collisions when
 * the editor and queue window share a bundle.
 */
export function Brand({ size = 22 }: { size?: number }): JSX.Element {
  const gradient = useId()
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="7" fill="#1a2232" />
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="6.5" fill="none" stroke="rgba(79,141,255,.38)" />
        <path d="M7.5 24V8h3.2l5.3 8.1L21.3 8h3.2v16h-3.3V13.6l-4.6 6.9h-1.2l-4.6-6.9V24z" fill={`url(#${gradient})`} />
      </svg>
    </span>
  )
}

export function BrandName(): JSX.Element {
  return (
    <span className="brand-name">
      Moli<span className="brand-name-accent">Cut</span>
    </span>
  )
}
