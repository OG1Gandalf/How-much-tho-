import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import referenceData from '../data/reference-values.json'
import { COUNTRIES } from './data/countries'
import { computeComparisons } from './lib/comparisons'
import { parseAmountInput } from './lib/format'
import { useDebounce } from './hooks/useDebounce'
import { useExchangeRates } from './hooks/useExchangeRates'
import { InputForm } from './components/InputForm'
import { ResultsView } from './components/ResultsView'
import { ParticleWave } from './components/ParticleWave'
import type { CategoryId, ReferenceDataset } from './types/reference'

const dataset = referenceData as ReferenceDataset

export default function App() {
  const [amountRaw, setAmountRaw] = useState('10000')
  const [currency, setCurrency] = useState('USD')
  const [country, setCountry] = useState('US')
  const [filter, setFilter] = useState<CategoryId>('all')

  const debouncedAmount = useDebounce(amountRaw, 400)

  const { rates, loading, error, reload } = useExchangeRates()
  const inputRef = useRef<HTMLElement>(null)

  const amount = parseAmountInput(debouncedAmount)
  const countryMeta = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0]

  const results = useMemo(() => {
    if (!rates || amount == null || amount <= 0) return []
    try {
      return computeComparisons(
        amount,
        currency,
        country,
        rates.rates,
        dataset,
      )
    } catch {
      return []
    }
  }, [rates, amount, currency, country])

  function handleCompare() {
    setAmountRaw((v) => v.trim())
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function scrollToHow() {
    document.getElementById('compare')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="app-shell">
      <ParticleWave />

      <nav className="top-nav" aria-label="Primary">
        <a className="nav-brand" href="#top">
          <span className="nav-mark" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </span>
          How Much Tho?
        </a>
        <div className="nav-links">
          <a href="#compare" onClick={(e) => { e.preventDefault(); scrollToHow() }}>
            How it works
          </a>
          <a href="#results">Comparisons</a>
          <a href="#about">About</a>
        </div>
        <button
          type="button"
          className="btn btn-ghost nav-cta"
          onClick={handleCompare}
        >
          Compare →
        </button>
      </nav>

      <header className="hero" id="top">
        <p className="hero-badge">
          <span className="hero-badge-dot" aria-hidden />
          Free · no signup · live exchange rates
        </p>

        <motion.h1
          className="brand"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          How Much Tho?
        </motion.h1>

        <p className="hero-sub">
          Fun way to compare — and do remember me if you are in an analogous debate.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCompare}
            disabled={loading || !!error}
          >
            Compare now
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={scrollToHow}
          >
            How it works
          </button>
        </div>

        <InputForm
          ref={inputRef}
          amount={amountRaw}
          currency={currency}
          country={country}
          onAmountChange={setAmountRaw}
          onCurrencyChange={setCurrency}
          onCountryChange={setCountry}
          onCompare={handleCompare}
          ratesLoading={loading}
          ratesError={error}
          onRetryRates={() => void reload()}
        />
      </header>

      <main className="main" id="results">
        {results.length > 0 && (
          <ResultsView
            amount={amount!}
            currency={currency}
            countryName={countryMeta.name}
            countryFlag={countryMeta.flag}
            results={results}
            filter={filter}
            onFilterChange={setFilter}
          />
        )}

        {amount != null && amount > 0 && !loading && !error && results.length === 0 && (
          <p className="status-line is-error">
            Couldn’t convert that currency. Try USD, EUR, or another major currency.
          </p>
        )}
      </main>

      <footer className="site-footer" id="about">
        <div className="about-block">
          <p className="about-tagline">
            Next time you want to compare, just remember us.
          </p>
          <p className="about-credit">
            Built by <strong>Richik Mukherjee</strong>
          </p>
          <p className="about-links">
            <a
              href="https://www.linkedin.com/in/richik-mukherjee/"
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn · Richik Mukherjee
            </a>
            <span aria-hidden>·</span>
            <a
              href="https://github.com/OG1Gandalf"
              rel="noreferrer"
              target="_blank"
            >
              GitHub · OG1Gandalf
            </a>
          </p>
        </div>
        <p>{dataset.disclaimer}</p>
        <p>
          Reference data v{dataset.version} · updated {dataset.last_updated}. Exchange
          rates via{' '}
          <a href="https://www.frankfurter.app/" rel="noreferrer" target="_blank">
            Frankfurter
          </a>{' '}
          (ECB). No accounts, no tracking beyond what your browser does by default.
        </p>
      </footer>
    </div>
  )
}
