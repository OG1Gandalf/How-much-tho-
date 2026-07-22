/** Shimmer skeleton shown while FX rates load — not a spinner. */
export function ResultsSkeleton() {
  return (
    <div className="results-skeleton" aria-busy="true" aria-label="Loading comparisons">
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-kicker shimmer" />
        <div className="skeleton-line skeleton-title shimmer" />
        <div className="skeleton-line skeleton-sub shimmer" />
      </div>
      <div className="skeleton-tabs">
        {Array.from({ length: 5 }, (_, i) => (
          <div className="skeleton-tab shimmer" key={i} />
        ))}
      </div>
      <div className="results-grid">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-line skeleton-chip shimmer" />
            <div className="skeleton-line skeleton-lead shimmer" />
            <div className="skeleton-line skeleton-number shimmer" />
            <div className="skeleton-line skeleton-unit shimmer" />
            <div className="skeleton-icons">
              {Array.from({ length: 8 }, (_, j) => (
                <div className="skeleton-icon shimmer" key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
