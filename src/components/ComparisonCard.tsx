import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { formatFullQuantity } from '../lib/format'
import {
  cardEntranceDelay,
  cardHoverLift,
  cardHoverTransition,
  cardStaggerEntrance,
  isMilestoneResult,
} from '../lib/motion'
import type { ComparisonResult } from '../types/reference'
import { IconGrid, type IconKind } from './IconGrid'

const KIND_MAP: Record<ComparisonResult['categoryId'], IconKind> = {
  bottled_water: 'bottle',
  trees: 'tree',
  football_pitch: 'pitch',
  school: 'school',
  hospital: 'hospital',
  cancer_surgery: 'surgery',
  syringe: 'syringe',
  first_aid_kit: 'firstaid',
  ambulance: 'ambulance',
  biryani: 'biryani',
}

interface ComparisonCardProps {
  result: ComparisonResult
  index: number
}

export function ComparisonCard({ result, index }: ComparisonCardProps) {
  const reduced = usePrefersReducedMotion()
  const animated = useCountUp(result.quantity)
  const kind = KIND_MAP[result.categoryId]
  const milestone = isMilestoneResult(result)
  const [celebrate, setCelebrate] = useState(false)

  useEffect(() => {
    if (!milestone || reduced) {
      setCelebrate(false)
      return
    }
    setCelebrate(true)
    const t = window.setTimeout(() => setCelebrate(false), 900)
    return () => window.clearTimeout(t)
  }, [milestone, result.quantity, result.categoryId, reduced])

  const entrance = cardStaggerEntrance(reduced)
  const staggerOffset = cardEntranceDelay(index, reduced)

  return (
    <motion.article
      className={`comparison-card${celebrate ? ' is-milestone' : ''}`}
      style={
        {
          '--card-accent': result.accent,
          '--card-soft': result.accentSoft,
        } as CSSProperties
      }
      custom={index}
      variants={entrance}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={
        reduced
          ? undefined
          : { ...cardHoverLift.hover, transition: cardHoverTransition(false) }
      }
      whileTap={
        reduced
          ? undefined
          : { ...cardHoverLift.tap, transition: { duration: 0.12 } }
      }
    >
      {celebrate && (
        <span className="milestone-burst" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <span className="milestone-spark" key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </span>
      )}

      <div className="comparison-card-top">
        <span className="comparison-chip">{result.label}</span>
        <details className="comparison-tip">
          <summary aria-label="Reference source">ⓘ</summary>
          <div className="comparison-tip-body">
            <p>{result.footnote}</p>
            <p className="muted">{result.reference.source}</p>
            <p className="muted">Updated {result.reference.last_updated}</p>
            {result.reference.notes && (
              <p className="muted">{result.reference.notes}</p>
            )}
          </div>
        </details>
      </div>

      <p className="comparison-lead">Roughly equivalent to</p>
      <p
        className={`comparison-number${celebrate ? ' is-pulse' : ''}`}
        aria-live="polite"
      >
        {formatFullQuantity(animated)}
      </p>
      <p className="comparison-unit">{result.unitPlural}</p>

      <IconGrid
        count={result.quantity}
        accent={result.accent}
        kind={kind}
        staggerOffset={staggerOffset}
      />

      <p className="comparison-footnote">{result.footnote}</p>
    </motion.article>
  )
}
