import { forwardRef } from 'react'
import { CURRENCIES, COUNTRIES } from '../data/countries'
import { SearchableSelect } from './SearchableSelect'

interface InputFormProps {
  amount: string
  currency: string
  country: string
  onAmountChange: (v: string) => void
  onCurrencyChange: (v: string) => void
  onCountryChange: (v: string) => void
  onCompare: () => void
  ratesLoading: boolean
  ratesError: string | null
  onRetryRates: () => void
}

export const InputForm = forwardRef<HTMLElement, InputFormProps>(
  function InputForm(
    {
      amount,
      currency,
      country,
      onAmountChange,
      onCurrencyChange,
      onCountryChange,
      onCompare,
      ratesLoading,
      ratesError,
      onRetryRates,
    },
    ref,
  ) {
    return (
      <section
        className="input-panel"
        aria-label="Amount and location"
        ref={ref}
        id="compare"
      >
        <div className="field">
          <label className="field-label" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            className="amount-input"
            inputMode="decimal"
            type="text"
            placeholder="10,000"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onCompare()
            }}
            autoComplete="off"
          />
        </div>

        <SearchableSelect
          label="Currency"
          options={CURRENCIES}
          value={currency}
          onChange={onCurrencyChange}
          getOptionValue={(c) => c.code}
          getOptionLabel={(c) => `${c.code} — ${c.name}`}
          getOptionSearchText={(c) => `${c.code} ${c.name} ${c.symbol}`}
          renderOption={(c) => (
            <span className="option-row">
              <strong>{c.code}</strong>
              <span>{c.name}</span>
            </span>
          )}
          placeholder="Search currencies…"
        />

        <SearchableSelect
          label="Country"
          options={COUNTRIES}
          value={country}
          onChange={(code) => {
            onCountryChange(code)
            const match = COUNTRIES.find((c) => c.code === code)
            if (match) onCurrencyChange(match.currency)
          }}
          getOptionValue={(c) => c.code}
          getOptionLabel={(c) => `${c.flag} ${c.name}`}
          getOptionSearchText={(c) => `${c.name} ${c.code} ${c.currency}`}
          renderOption={(c) => (
            <span className="option-row">
              <span aria-hidden>{c.flag}</span>
              <strong>{c.name}</strong>
            </span>
          )}
          placeholder="Search countries…"
        />

        <div className="input-status">
          {ratesLoading && (
            <p className="status-line">Loading live exchange rates…</p>
          )}
          {ratesError && (
            <p className="status-line is-error">
              {ratesError}{' '}
              <button type="button" className="linkish" onClick={onRetryRates}>
                Retry
              </button>
            </p>
          )}
        </div>
      </section>
    )
  },
)
