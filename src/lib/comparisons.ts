import type {
  CategoryDefinition,
  CategoryId,
  ComparisonResult,
  ReferenceDataset,
  ReferenceValue,
} from '../types/reference'
import { convertAmount } from './currency'

export function resolveReference(
  category: CategoryDefinition,
  countryCode: string,
): { reference: ReferenceValue; usedFallback: boolean } {
  const regional = category.regions[countryCode]
  if (regional) {
    return { reference: regional, usedFallback: false }
  }
  const hasRegionalData = Object.keys(category.regions).length > 0
  return {
    reference: category.global_default,
    usedFallback: hasRegionalData,
  }
}

function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: value >= 100 ? 0 : 2,
    }).format(value)
  } catch {
    return `${currency} ${value}`
  }
}

function buildFootnote(
  reference: ReferenceValue,
  usedFallback: boolean,
): string {
  const base = `Based on ~${formatMoney(reference.value, reference.currency)} ${reference.unit_label}`
  const fallback = usedFallback ? ' · using global default for this country' : ''
  return `${base}${fallback}`
}

export function computeComparisons(
  amount: number,
  currency: string,
  countryCode: string,
  rates: Record<string, number>,
  dataset: ReferenceDataset,
): ComparisonResult[] {
  if (!Number.isFinite(amount) || amount <= 0) return []

  const pitchM2 = dataset.constants.football_pitch_m2

  return CATEGORY_ORDER.map((categoryId) => {
      const category = dataset.categories[categoryId]
      const { reference, usedFallback } = resolveReference(category, countryCode)

      const amountInRefCurrency = convertAmount(
        amount,
        currency,
        reference.currency,
        rates,
      )

      let quantity: number
      let pitchAreaM2: number | undefined

      if (categoryId === 'football_pitch') {
        const m2Affordable = amountInRefCurrency / reference.value
        quantity = m2Affordable / pitchM2
        pitchAreaM2 = pitchM2
      } else {
        quantity = amountInRefCurrency / reference.value
      }

      return {
        categoryId,
        label: category.label,
        unitPlural: category.unit_plural,
        quantity,
        accent: category.accent,
        accentSoft: category.accent_soft,
        reference,
        usedFallback,
        footnote: buildFootnote(reference, usedFallback),
        pitchAreaM2,
      }
    })
}

export const CATEGORY_ORDER: Exclude<CategoryId, 'all'>[] = [
  'bottled_water',
  'trees',
  'football_pitch',
  'school',
  'hospital',
  'cancer_surgery',
  'syringe',
  'first_aid_kit',
  'ambulance',
  'biryani',
]
