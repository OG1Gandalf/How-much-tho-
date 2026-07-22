import { animate, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState } from 'react'
import { countUpDuration, EASE_OUT_EXPO } from '../lib/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/** Ease-out count-up; snaps instantly when prefers-reduced-motion. */
export function useCountUp(target: number): number {
  const reduced = usePrefersReducedMotion()
  const motion = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useMotionValueEvent(motion, 'change', (v) => setDisplay(v))

  useEffect(() => {
    if (reduced) {
      motion.set(target)
      setDisplay(target)
      return
    }

    const current = motion.get()
    if (
      current > 0 &&
      (target / current < 0.5 ||
        target / current > 2 ||
        Math.abs(target - current) > 50)
    ) {
      motion.set(0)
    }

    const controls = animate(motion, target, {
      duration: countUpDuration(target, false),
      // Ease-out: races up early, settles at the end (not linear slot-machine tick)
      ease: EASE_OUT_EXPO,
    })
    return () => controls.stop()
  }, [target, reduced, motion])

  return display
}
