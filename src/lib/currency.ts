import { FALLBACK_USD_RATES } from '../data/countries'

export interface ExchangeRates {
  base: string
  date: string
  /** Units of currency per 1 USD */
  rates: Record<string, number>
}

const CACHE_KEY = 'real-worth-rates-v1'
const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour

function readCache(): ExchangeRates | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { savedAt: number; data: ExchangeRates }
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeCache(data: ExchangeRates) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }))
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Fetch latest rates via Frankfurter (ECB), normalized to USD base.
 * https://api.frankfurter.dev/v1/latest
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  const cached = readCache()
  if (cached) return cached

  const url = 'https://api.frankfurter.dev/v1/latest?base=USD'
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Exchange rate API error (${res.status})`)
  }

  const json = (await res.json()) as {
    base: string
    date: string
    rates: Record<string, number>
  }

  const rates: Record<string, number> = { USD: 1, ...json.rates, ...FALLBACK_USD_RATES }
  // Prefer live rates over fallbacks when both exist
  for (const [code, rate] of Object.entries(json.rates)) {
    rates[code] = rate
  }
  rates.USD = 1

  const data: ExchangeRates = {
    base: 'USD',
    date: json.date,
    rates,
  }
  writeCache(data)
  return data
}

/** Convert `amount` from `from` currency into `to` currency. */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number {
  if (from === to) return amount
  const fromRate = rates[from]
  const toRate = rates[to]
  if (fromRate == null || toRate == null) {
    throw new Error(`Missing exchange rate for ${from} or ${to}`)
  }
  const inUsd = amount / fromRate
  return inUsd * toRate
}

export function hasRate(code: string, rates: Record<string, number>): boolean {
  return rates[code] != null
}
