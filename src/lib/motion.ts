import type { Transition, Variants } from 'framer-motion'
import type { CategoryId, ComparisonResult } from '../types/reference'
import { CATEGORY_ORDER } from './comparisons'

/** Named animation kit — each moment has its own variant, not one generic fade. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Card stagger: ~90ms apart, last start capped so full sequence ≤ ~700ms. */
export const CARD_STAGGER_S = 0.09
export const CARD_STAGGER_MAX_S = 0.55

export function cardEntranceDelay(index: number, reduced: boolean): number {
  if (reduced) return 0
  return Math.min(index * CARD_STAGGER_S, CARD_STAGGER_MAX_S)
}

/** Results first appear — staggered fade + upward slide. */
export function cardStaggerEntrance(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.12 } },
      exit: { opacity: 0, transition: { duration: 0.08 } },
    }
  }
  return {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: cardEntranceDelay(i, false),
        duration: 0.42,
        ease: EASE_OUT_EXPO,
      },
    }),
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.18, ease: EASE_OUT_SOFT },
    },
  }
}

/** Category switch — cross-fade + slight horizontal slide. */
export function categoryCrossfade(direction: 1 | -1, reduced: boolean): Variants {
  if (reduced) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1, transition: { duration: 0.12 } },
      exit: { opacity: 0, transition: { duration: 0.08 } },
    }
  }
  const x = direction * 28
  return {
    enter: { opacity: 0, x },
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.32, ease: EASE_OUT_EXPO },
    },
    exit: {
      opacity: 0,
      x: -x * 0.6,
      transition: { duration: 0.22, ease: EASE_OUT_SOFT },
    },
  }
}

export function categoryDirection(
  from: CategoryId,
  to: CategoryId,
): 1 | -1 {
  const order: CategoryId[] = ['all', ...CATEGORY_ORDER]
  const a = order.indexOf(from)
  const b = order.indexOf(to)
  if (a < 0 || b < 0) return 1
  return b >= a ? 1 : -1
}

/** Icon fill — scale-bounce pop, staggered. GPU: transform + opacity only. */
export function iconFillContainer(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: {},
      visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
    }
  }
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.022,
        delayChildren: 0.12,
      },
    },
  }
}

export function iconFillItem(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 0.9, transition: { duration: 0.08 } },
    }
  }
  return {
    hidden: { opacity: 0, scale: 0.55 },
    visible: {
      opacity: 0.9,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 520,
        damping: 22,
        mass: 0.55,
      },
    },
  }
}

/** Gentle card lift on hover/tap. */
export const cardHoverLift = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.015, y: -3 },
  tap: { scale: 0.99, y: 0 },
}

export function cardHoverTransition(reduced: boolean): Transition {
  if (reduced) return { duration: 0 }
  return { type: 'spring', stiffness: 420, damping: 28, mass: 0.6 }
}

/**
 * Notable / "big number" thresholds for celebratory micro-animation.
 * - Everyday commodities (water, syringes, etc.): ≥ 1,000,000 units
 * - Mid-scale (trees, kits, trips, plates, bed-days): ≥ 10,000
 * - Major assets (school, cancer surgery, pitch ≥ 1): full unit or more
 */
export function isMilestoneResult(result: ComparisonResult): boolean {
  const q = result.quantity
  if (!Number.isFinite(q) || q <= 0) return false

  switch (result.categoryId) {
    case 'school':
    case 'cancer_surgery':
      return q >= 1
    case 'football_pitch':
      return q >= 1
    case 'hospital':
    case 'ambulance':
    case 'first_aid_kit':
    case 'biryani':
    case 'trees':
      return q >= 10_000
    case 'bottled_water':
    case 'syringe':
      return q >= 1_000_000
    default:
      return q >= 100_000
  }
}

/** Count-up easing — ease-out (fast start, soft settle). Instant when reduced. */
export function countUpDuration(target: number, reduced: boolean): number {
  if (reduced) return 0
  if (target < 1) return 0.55
  if (target < 100) return 0.75
  if (target < 10_000) return 0.95
  return 1.1
}
