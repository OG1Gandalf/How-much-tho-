import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { formatFullQuantity } from '../lib/format'
import type { ComparisonResult } from '../types/reference'
import { IconGrid } from './IconGrid'

const KIND_MAP = {
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
} as const

interface ComparisonCardProps {
  result: ComparisonResult
  index: number
}

export function ComparisonCard({ result, index }: ComparisonCardProps) {
  const animated = useCountUp(result.quantity)
  const kind = KIND_MAP[result.categoryId]

  return (
    <motion.article
      className="comparison-card"
      style={
        {
          '--card-accent': result.accent,
          '--card-soft': result.accentSoft,
        } as CSSProperties
      }
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      layout
    >
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
      <p className="comparison-number" aria-live="polite">
        {formatFullQuantity(animated)}
      </p>
      <p className="comparison-unit">{result.unitPlural}</p>

      <IconGrid count={result.quantity} accent={result.accent} kind={kind} />

      <p className="comparison-footnote">{result.footnote}</p>
    </motion.article>
  )
}
