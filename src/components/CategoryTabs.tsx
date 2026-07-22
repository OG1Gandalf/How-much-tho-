import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { CategoryId, ComparisonResult } from '../types/reference'
import { CATEGORY_ORDER } from '../lib/comparisons'
import referenceData from '../../data/reference-values.json'
import { categoryCrossfade, categoryDirection } from '../lib/motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ComparisonCard } from './ComparisonCard'

interface CategoryTabsProps {
  active: CategoryId
  onChange: (id: CategoryId) => void
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const tabs: { id: CategoryId; label: string }[] = [
    { id: 'all', label: 'All' },
    ...CATEGORY_ORDER.map((id) => ({
      id,
      label: referenceData.categories[id].short_label,
    })),
  ]

  return (
    <div className="category-tabs" role="tablist" aria-label="Comparison categories">
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`category-tab${isActive ? ' is-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

interface ResultsGridProps {
  results: ComparisonResult[]
  filter: CategoryId
}

export function ResultsGrid({ results, filter }: ResultsGridProps) {
  const reduced = usePrefersReducedMotion()
  const prevFilter = useRef(filter)
  const [direction, setDirection] = useState<1 | -1>(1)

  useEffect(() => {
    if (prevFilter.current !== filter) {
      setDirection(categoryDirection(prevFilter.current, filter))
      prevFilter.current = filter
    }
  }, [filter])

  const visible =
    filter === 'all' ? results : results.filter((r) => r.categoryId === filter)

  const crossfade = categoryCrossfade(direction, reduced)

  return (
    <div className="results-grid-shell">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={filter}
          className="results-grid"
          variants={crossfade}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {visible.map((result, i) => (
            <ComparisonCard
              key={`${filter}-${result.categoryId}`}
              result={result}
              index={i}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
