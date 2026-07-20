import type { ComparisonResult } from '../types/reference'
import { formatFullQuantity, formatMoneyAmount } from './format'

const W = 1080
const H = 1350

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

/** Draw a shareable result card on canvas — avoids blank html-to-image captures. */
export async function exportShareImage(opts: {
  amount: number
  currency: string
  countryName: string
  comparisons: ComparisonResult[]
}): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not available')

  // Background
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, W, H)

  // Soft mint glow at bottom
  const glow = ctx.createRadialGradient(W / 2, H * 0.92, 40, W / 2, H * 0.92, W * 0.55)
  glow.addColorStop(0, 'rgba(167, 243, 208, 0.22)')
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  const pad = 72
  let y = pad

  // Brand
  ctx.fillStyle = '#A7F3D0'
  ctx.font = '700 64px Sora, system-ui, sans-serif'
  ctx.fillText('How Much Tho?', pad, y + 56)
  y += 110

  // Amount line
  const amountLine = `${formatMoneyAmount(opts.amount, opts.currency)} in ${opts.countryName}`
  ctx.fillStyle = '#9CA3AF'
  ctx.font = '500 36px Sora, system-ui, sans-serif'
  wrapText(ctx, amountLine, pad, y, W - pad * 2, 46)
  y += 90

  // Top comparisons
  const top = opts.comparisons.slice(0, 3)
  for (const item of top) {
    roundRect(ctx, pad, y, W - pad * 2, 150, 28)
    ctx.fillStyle = '#111111'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 2
    ctx.stroke()

    const qty =
      item.quantity < 10
        ? item.quantity.toFixed(item.quantity < 1 ? 2 : 1)
        : Math.round(item.quantity).toLocaleString()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '700 52px Sora, system-ui, sans-serif'
    ctx.fillText(qty, pad + 36, y + 68)

    ctx.fillStyle = '#A7F3D0'
    ctx.font = '500 30px Sora, system-ui, sans-serif'
    ctx.fillText(item.unitPlural, pad + 36, y + 112)

    y += 178
  }

  // Footer
  ctx.fillStyle = '#6B7280'
  ctx.font = '400 26px Sora, system-ui, sans-serif'
  ctx.fillText('Illustrative estimates · howmuchtho.app', pad, H - pad)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to encode image'))),
      'image/png',
      1,
    )
  })
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy)
      line = word
      yy += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, yy)
}

export function buildShareText(
  amount: number,
  currency: string,
  countryName: string,
  comparisons: ComparisonResult[],
): string {
  const top = comparisons.slice(0, 3)
  const lines = top.map(
    (c) => `• roughly ${formatFullQuantity(c.quantity)} ${c.unitPlural}`,
  )
  return [
    `${formatMoneyAmount(amount, currency)} in ${countryName} is roughly equivalent to:`,
    ...lines,
    '',
    'Illustrative estimates via How Much Tho?',
  ].join('\n')
}

export async function shareResult(opts: {
  amount: number
  currency: string
  countryName: string
  comparisons: ComparisonResult[]
  imageNode?: HTMLElement | null
}): Promise<'shared' | 'copied' | 'downloaded'> {
  const text = buildShareText(
    opts.amount,
    opts.currency,
    opts.countryName,
    opts.comparisons,
  )

  let blob: Blob | null = null
  try {
    blob = await exportShareImage({
      amount: opts.amount,
      currency: opts.currency,
      countryName: opts.countryName,
      comparisons: opts.comparisons,
    })
  } catch {
    blob = null
  }

  if (navigator.share) {
    try {
      const files =
        blob != null
          ? [new File([blob], 'how-much-tho.png', { type: 'image/png' })]
          : undefined
      const canShareFiles =
        files && navigator.canShare?.({ files }) ? files : undefined
      await navigator.share({
        title: 'How Much Tho?',
        text,
        files: canShareFiles,
      })
      return 'shared'
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err
      // fall through
    }
  }

  if (blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'how-much-tho.png'
    a.click()
    URL.revokeObjectURL(url)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // ignore
    }
    return 'downloaded'
  }

  await navigator.clipboard.writeText(text)
  return 'copied'
}
