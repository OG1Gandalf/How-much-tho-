export function formatQuantity(value: number): string {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)

  if (abs === 0) return '0'
  if (abs < 0.01) return value.toExponential(1)
  if (abs < 1) return value.toFixed(2)
  if (abs < 10) return value.toFixed(1)
  if (abs < 1000) return Math.round(value).toLocaleString()
  if (abs < 1_000_000) return `${(value / 1000).toFixed(abs < 10_000 ? 1 : 0)}k`
  if (abs < 1_000_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  return `${(value / 1_000_000_000).toFixed(1)}B`
}

export function formatFullQuantity(value: number): string {
  if (!Number.isFinite(value)) return '—'
  if (Math.abs(value) < 1) return value.toFixed(2)
  if (Math.abs(value) < 10) return value.toFixed(1)
  return Math.round(value).toLocaleString()
}

export function formatMoneyAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount)
  } catch {
    return `${amount.toLocaleString()} ${currency}`
  }
}

export function parseAmountInput(raw: string): number | null {
  const cleaned = raw.replace(/,/g, '').trim()
  if (!cleaned) return null
  const n = Number(cleaned)
  if (!Number.isFinite(n) || n < 0) return null
  return n
}
