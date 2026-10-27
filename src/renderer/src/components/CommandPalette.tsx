import { useEffect, useMemo, useRef, useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useCommands } from '../commands'
import { useUiStore } from '../store/uiStore'
import { Icon } from './Icon'

export function CommandPalette(): JSX.Element {
  const { t } = useTranslation()
  const commands = useCommands()
  const close = useUiStore((s) => s.closeModal)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => `${c.label} ${c.category} ${c.id}`.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setIndex(0)
  }, [query])

  const run = (i: number): void => {
    const command = filtered[i]
    close()
    void command?.run()
  }

  return (
    <div className="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="palette" role="dialog" aria-label={t('menu.commandPalette')}>
        <div className="palette-input">
          <Icon name="search" size={17} />
          <input
            ref={inputRef}
            value={query}
            placeholder={t('palette.placeholder')}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') close()
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setIndex((i) => Math.min(filtered.length - 1, i + 1))
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setIndex((i) => Math.max(0, i - 1))
              }
              if (e.key === 'Enter') run(index)
            }}
            aria-label="Cerca comandi"
          />
          <kbd>Esc</kbd>
        </div>
        <div className="palette-results" role="listbox">
          {filtered.length === 0 && <div className="palette-empty">Nessun comando trovato</div>}
          {filtered.map((command, i) => (
            <button
              key={command.id}
              role="option"
              aria-selected={i === index}
              className={`palette-item ${i === index ? 'selected' : ''}`}
              onMouseEnter={() => setIndex(i)}
              onClick={() => run(i)}
            >
              <span className="palette-icon">
                <Icon name={command.icon} size={15} />
              </span>
              <span className="palette-label">{command.label}</span>
              <span className="palette-cat">{command.category}</span>
              {command.shortcut && <kbd>{command.shortcut}</kbd>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
