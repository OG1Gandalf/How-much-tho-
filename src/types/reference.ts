export type CategoryId =
  | 'bottled_water'
  | 'trees'
  | 'football_pitch'
  | 'school'
  | 'hospital'
  | 'cancer_surgery'
  | 'syringe'
  | 'first_aid_kit'
  | 'ambulance'
  | 'biryani'
  | 'all'

export interface ReferenceValue {
  value: number
  currency: string
  unit_label: string
  source: string
  last_updated: string
  notes?: string
}

export interface CategoryDefinition {
  id: Exclude<CategoryId, 'all'>
  label: string
  unit: string
  unit_plural: string
  short_label: string
  tagline: string
  accent: string
  accent_soft: string
  meta?: {
    area_m2?: number
    area_note?: string
  }
  global_default: ReferenceValue
  regions: Record<string, ReferenceValue>
}

export interface ReferenceDataset {
  version: string
  last_updated: string
  disclaimer: string
  constants: {
    football_pitch_m2: number
    football_pitch_note: string
  }
  categories: Record<Exclude<CategoryId, 'all'>, CategoryDefinition>
}

export interface Country {
  code: string
  name: string
  currency: string
  flag: string
}

export interface CurrencyOption {
  code: string
  name: string
  symbol: string
}

export interface ComparisonResult {
  categoryId: Exclude<CategoryId, 'all'>
  label: string
  unitPlural: string
  quantity: number
  accent: string
  accentSoft: string
  reference: ReferenceValue
  usedFallback: boolean
  footnote: string
  pitchAreaM2?: number
}
