import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { ComparisonResult } from '../types/reference'
import { shareResult } from '../lib/share'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface ShareButtonProps {
  amount: number
  currency: string
  countryName: string
  comparisons: ComparisonResult[]
}

export function ShareButton({
  amount,
  currency,
  countryName,
  comparisons,
}: ShareButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState(false)

  async function handleShare() {
    setBusy(true)
    setStatus(null)
    if (!reduced) {
      setFlash(true)
      window.setTimeout(() => setFlash(false), 320)
    }
    try {
      const result = await shareResult({
        amount,
        currency,
        countryName,
        comparisons,
      })
      setStatus(
        result === 'shared'
          ? 'Shared!'
          : result === 'downloaded'
            ? 'Image saved'
            : 'Copied to clipboard',
      )
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setStatus('Could not share — try again')
      }
    } finally {
      setBusy(false)
      window.setTimeout(() => setStatus(null), 2500)
    }
  }

  return (
    <div className="share-wrap">
      <AnimatePresence>
        {flash && (
          <motion.div
            className="capture-flash"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut', times: [0, 0.18, 1] }}
          />
        )}
      </AnimatePresence>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => void handleShare()}
        disabled={busy || comparisons.length === 0}
      >
        {busy ? 'Preparing…' : 'Share result'}
      </button>
      {status && <span className="share-status">{status}</span>}
    </div>
  )
}
