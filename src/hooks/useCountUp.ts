import { animate, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState } from 'react'

export function useCountUp(target: number, duration = 0.9): number {
  const motion = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useMotionValueEvent(motion, 'change', (v) => setDisplay(v))

  useEffect(() => {
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
      duration,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [target, duration, motion])

  return display
}
