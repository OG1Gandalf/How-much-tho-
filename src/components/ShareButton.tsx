import { useState } from 'react'
import type { ComparisonResult } from '../types/reference'
import { shareResult } from '../lib/share'

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
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleShare() {
    setBusy(true)
    setStatus(null)
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
