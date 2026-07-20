interface IconGridProps {
  count: number
  accent: string
  kind:
    | 'bottle'
    | 'tree'
    | 'pitch'
    | 'school'
    | 'hospital'
    | 'surgery'
    | 'syringe'
    | 'firstaid'
    | 'ambulance'
    | 'biryani'
  maxIcons?: number
}

function BottleIcon() {
  return (
    <svg viewBox="0 0 24 32" fill="currentColor" aria-hidden>
      <path d="M9 2h6v3l1.5 2v3H7.5V7L9 5V2zm-1.5 8h9v18a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V10z" />
    </svg>
  )
}

function TreeIcon() {
  return (
    <svg viewBox="0 0 24 32" fill="currentColor" aria-hidden>
      <path d="M12 2c-3.5 0-6 2.8-6 5.8 0 1.4.5 2.7 1.3 3.7C5.5 12.2 4 14.2 4 16.5 4 19.5 6.5 22 10 22h1v6h2v-6h1c3.5 0 6-2.5 6-5.5 0-2.3-1.5-4.3-3.3-5C17.5 10.5 18 9.2 18 7.8 18 4.8 15.5 2 12 2z" />
    </svg>
  )
}

function PitchIcon() {
  return (
    <svg viewBox="0 0 32 22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="1" y="1" width="30" height="20" rx="1.5" />
      <line x1="16" y1="1" x2="16" y2="21" />
      <circle cx="16" cy="11" r="3.5" />
      <rect x="1" y="6" width="5" height="10" />
      <rect x="26" y="6" width="5" height="10" />
    </svg>
  )
}

function SchoolIcon() {
  return (
    <svg viewBox="0 0 28 26" fill="currentColor" aria-hidden>
      <path d="M14 2 1 9l13 7 11-5.9V18h2V9L14 2zm-7 14.2V20l7 3.8 7-3.8v-3.8l-7 3.8-7-3.8z" />
    </svg>
  )
}

function HospitalIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="currentColor" aria-hidden>
      <path d="M4 26V8l10-6 10 6v18H4zm10-20v4h-3v3h3v4h3v-4h3v-3h-3V6h-3z" />
    </svg>
  )
}

function SurgeryIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 22 18 10l3 3L9 25H6v-3z" />
      <path d="m18 10 2-2 3 3-2 2" />
      <circle cx="8" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SyringeIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M18 3l7 7-2 2-1.5-1.5-8 8L11 16l8-8L17.5 6.5 18 3z" />
      <path d="m11 16-6 6" />
      <path d="M14 13h4M12 15h4" />
    </svg>
  )
}

function FirstAidIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="currentColor" aria-hidden>
      <rect x="3" y="7" width="22" height="16" rx="2" />
      <path d="M12 11h4v3h3v4h-3v3h-4v-3h-3v-4h3v-3z" fill="#000" opacity="0.35" />
    </svg>
  )
}

function AmbulanceIcon() {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" aria-hidden>
      <path d="M2 16V9h14l4 5h6v2H2zm16-5.5V14h3.5l-2-3.5H18z" />
      <circle cx="8" cy="18" r="2.5" />
      <circle cx="24" cy="18" r="2.5" />
      <path d="M10 4h4v2h2v3h-2v2h-4v-2H8V6h2V4z" />
    </svg>
  )
}

function BiryaniIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="currentColor" aria-hidden>
      <ellipse cx="14" cy="18" rx="11" ry="5" />
      <path d="M5 17c1.5-6 4-10 9-10s7.5 4 9 10" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="10" cy="14" r="1.2" />
      <circle cx="14" cy="12" r="1.2" />
      <circle cx="18" cy="14" r="1.2" />
    </svg>
  )
}

const ICONS = {
  bottle: BottleIcon,
  tree: TreeIcon,
  pitch: PitchIcon,
  school: SchoolIcon,
  hospital: HospitalIcon,
  surgery: SurgeryIcon,
  syringe: SyringeIcon,
  firstaid: FirstAidIcon,
  ambulance: AmbulanceIcon,
  biryani: BiryaniIcon,
}

export function IconGrid({ count, accent, kind, maxIcons = 24 }: IconGridProps) {
  const Icon = ICONS[kind]
  const shown = Math.min(Math.max(0, Math.round(count)), maxIcons)
  const overflow = Math.max(0, Math.round(count) - maxIcons)
  const displayCount = count < 1 ? 1 : shown

  return (
    <div className="icon-grid" style={{ color: accent }}>
      {Array.from({ length: Math.min(displayCount, maxIcons) }, (_, i) => (
        <span
          className="icon-grid-item"
          key={i}
          style={{ animationDelay: `${i * 18}ms` }}
        >
          <Icon />
        </span>
      ))}
      {overflow > 0 && (
        <span className="icon-grid-more">×{overflow.toLocaleString()} more</span>
      )}
      {count > 0 && count < 1 && (
        <span className="icon-grid-more">a fraction of one</span>
      )}
    </div>
  )
}
