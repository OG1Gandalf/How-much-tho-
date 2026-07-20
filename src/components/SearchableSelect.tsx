import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

interface SearchableSelectProps<T> {
  label: string
  options: T[]
  value: string
  onChange: (value: string) => void
  getOptionValue: (option: T) => string
  getOptionLabel: (option: T) => string
  getOptionSearchText?: (option: T) => string
  renderOption?: (option: T) => ReactNode
  placeholder?: string
}

interface PanelPos {
  top: number
  left: number
  width: number
  maxHeight: number
}

export function SearchableSelect<T>({
  label,
  options,
  value,
  onChange,
  getOptionValue,
  getOptionLabel,
  getOptionSearchText,
  renderOption,
  placeholder = 'Search…',
}: SearchableSelectProps<T>) {
  const id = useId()
  const listId = `${id}-list`
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [pos, setPos] = useState<PanelPos | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selected = options.find((o) => getOptionValue(o) === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => {
      const text = (getOptionSearchText?.(o) ?? getOptionLabel(o)).toLowerCase()
      return text.includes(q) || getOptionValue(o).toLowerCase().includes(q)
    })
  }, [options, query, getOptionLabel, getOptionSearchText, getOptionValue])

  function updatePosition() {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const gap = 6
    const spaceBelow = window.innerHeight - rect.bottom - gap - 12
    const spaceAbove = rect.top - gap - 12
    const preferBelow = spaceBelow >= 180 || spaceBelow >= spaceAbove
    const maxHeight = Math.min(280, Math.max(140, preferBelow ? spaceBelow : spaceAbove))
    const top = preferBelow
      ? rect.bottom + gap
      : Math.max(12, rect.top - gap - maxHeight)

    setPos({
      top,
      left: rect.left,
      width: rect.width,
      maxHeight,
    })
  }

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    updatePosition()
    const onReposition = () => updatePosition()
    window.addEventListener('resize', onReposition)
    // capture scroll from any scrollable ancestor
    window.addEventListener('scroll', onReposition, true)
    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (rootRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
      setQuery('')
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [open])

  function selectOption(code: string) {
    onChange(code)
    setOpen(false)
    setQuery('')
    triggerRef.current?.focus()
  }

  const panel =
    open &&
    pos &&
    createPortal(
      <div
        ref={panelRef}
        className="select-panel select-panel-portal"
        role="listbox"
        id={listId}
        style={{
          top: pos.top,
          left: pos.left,
          width: pos.width,
          maxHeight: pos.maxHeight,
        }}
      >
        <input
          ref={inputRef}
          className="select-search"
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && filtered[0]) {
              e.preventDefault()
              selectOption(getOptionValue(filtered[0]))
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              const first = listRef.current?.querySelector<HTMLButtonElement>(
                '.select-option',
              )
              first?.focus()
            }
          }}
          aria-label={`Search ${label}`}
          autoComplete="off"
        />
        <ul
          ref={listRef}
          className="select-list"
          // Ensure wheel/trackpad scroll stays inside the list
          onWheel={(e) => e.stopPropagation()}
        >
          {filtered.length === 0 && (
            <li className="select-empty">No matches</li>
          )}
          {filtered.map((option) => {
            const code = getOptionValue(option)
            const active = code === value
            return (
              <li key={code}>
                <button
                  type="button"
                  className={`select-option${active ? ' is-active' : ''}`}
                  role="option"
                  aria-selected={active}
                  onClick={() => selectOption(code)}
                >
                  {renderOption ? renderOption(option) : getOptionLabel(option)}
                </button>
              </li>
            )
          })}
        </ul>
      </div>,
      document.body,
    )

  return (
    <div className="field" ref={rootRef}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="select-value">
          {selected
            ? renderOption
              ? renderOption(selected)
              : getOptionLabel(selected)
            : 'Select…'}
        </span>
        <span className="select-chevron" aria-hidden>
          ▾
        </span>
      </button>
      {panel}
    </div>
  )
}
