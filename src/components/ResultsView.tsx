import type { CategoryId, ComparisonResult } from '../types/reference'
import { formatMoneyAmount } from '../lib/format'
import { CategoryTabs, ResultsGrid } from './CategoryTabs'
import { ShareButton } from './ShareButton'

interface ResultsViewProps {
  amount: number
  currency: string
  countryName: string
  countryFlag: string
  results: ComparisonResult[]
  filter: CategoryId
  onFilterChange: (id: CategoryId) => void
}

export function ResultsView({
  amount,
  currency,
  countryName,
  countryFlag,
  results,
  filter,
  onFilterChange,
}: ResultsViewProps) {
  return (
    <section className="results-panel" aria-live="polite">
      <div className="results-header">
        <div>
          <p className="results-kicker">In real terms</p>
          <h2 className="results-title">
            {formatMoneyAmount(amount, currency)}
            <span className="results-place">
              {' '}
              in {countryFlag} {countryName}
            </span>
          </h2>
          <p className="results-sub">
            Roughly equivalent to everyday things — illustrative, not exact.
          </p>
        </div>
        <ShareButton
          amount={amount}
          currency={currency}
          countryName={countryName}
          comparisons={results}
        />
      </div>

      <CategoryTabs active={filter} onChange={onFilterChange} />
      <ResultsGrid results={results} filter={filter} />
    </section>
  )
}
