import type { JSX } from 'react'
import { Icon } from './Icon'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  format?: (value: number) => string
  onChange: (value: number) => void
  onBegin?: () => void
  hasKeyframe?: boolean
  onKeyframe?: () => void
  disabled?: boolean
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  format,
  onChange,
  onBegin,
  hasKeyframe,
  onKeyframe,
  disabled
}: SliderProps): JSX.Element {
  return (
    <div className={`slider-row ${disabled ? 'disabled' : ''}`}>
      <div className="slider-label">
        <span>{label}</span>
        <div className="slider-value">
          <input
            type="number"
            value={Number.isFinite(value) ? Number(value.toFixed(2)) : 0}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            // Typing the value is a gesture too: snapshot once when the field is
            // focused (the range's onPointerDown never fires for it).
            onFocus={onBegin}
            onChange={(e) => {
              const next = Number(e.target.value)
              if (Number.isFinite(next)) onChange(next)
            }}
            aria-label={label}
          />
          {unit && <em>{unit}</em>}
          {onKeyframe && (
            <button
              className={`keyframe-btn ${hasKeyframe ? 'active' : ''}`}
              onClick={onKeyframe}
              title={hasKeyframe ? 'Rimuovi keyframe al playhead' : 'Aggiungi keyframe al playhead'}
              aria-label="Keyframe"
            >
              <Icon name="keyframe" size={11} />
            </button>
          )}
        </div>
      </div>
      <input
        className="slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onPointerDown={onBegin}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={format ? format(value) : `${value}${unit}`}
      />
    </div>
  )
}
