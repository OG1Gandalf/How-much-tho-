import { AnimatePresence, motion } from 'framer-motion'
import type { CategoryId, ComparisonResult } from '../types/reference'
import { CATEGORY_ORDER } from '../lib/comparisons'
import referenceData from '../../data/reference-values.json'
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
  const visible =
    filter === 'all' ? results : results.filter((r) => r.categoryId === filter)

  return (
    <div className="results-grid">
      <AnimatePresence mode="popLayout">
        {visible.map((result, i) => (
          <motion.div
            key={result.categoryId}
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28 }}
          >
            <ComparisonCard result={result} index={i} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
