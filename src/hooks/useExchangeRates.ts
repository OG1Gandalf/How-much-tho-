import { useCallback, useEffect, useState } from 'react'
import { fetchExchangeRates, type ExchangeRates } from '../lib/currency'

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchExchangeRates()
      setRates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load exchange rates')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { rates, loading, error, reload: load }
}
