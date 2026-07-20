import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  phase: number
}

/**
 * Flowing emerald particle field — inspired by the Signal mock wave.
 */
export function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let particles: Particle[] = []
    let w = 0
    let h = 0
    let t = 0

    function resize() {
      const parent = canvas!.parentElement
      w = parent?.clientWidth ?? window.innerWidth
      h = parent?.clientHeight ?? Math.min(420, window.innerHeight * 0.45)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.floor((w * h) / 2800)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.35 + Math.random() * 0.65,
        vx: 0.15 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, w, h)
      const grad = ctx!.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, 'rgba(0,0,0,0)')
      grad.addColorStop(0.35, 'rgba(16, 56, 40, 0.15)')
      grad.addColorStop(1, 'rgba(52, 211, 153, 0.12)')
      ctx!.fillStyle = grad
      ctx!.fillRect(0, 0, w, h)

      for (const p of particles) {
        const wave =
          Math.sin(p.x * 0.008 + p.phase) * 28 * p.z +
          Math.sin(p.x * 0.02 + 1.2) * 12
        const y = h * 0.55 + wave + (p.y - h * 0.5) * 0.15
        const r = 1.1 + p.z * 1.8
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(110, 231, 183, ${0.15 + p.z * 0.55})`
        ctx!.arc(p.x, y, r, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function frame() {
      t += 0.016
      ctx!.clearRect(0, 0, w, h)

      const grad = ctx!.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, 'rgba(0,0,0,0)')
      grad.addColorStop(0.3, 'rgba(16, 56, 40, 0.18)')
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.08)')
      ctx!.fillStyle = grad
      ctx!.fillRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx * p.z
        if (p.x > w + 10) p.x = -10

        const wave =
          Math.sin(p.x * 0.008 + t * 0.9 + p.phase) * 32 * p.z +
          Math.sin(p.x * 0.018 + t * 1.4) * 14 +
          Math.cos(t * 0.5 + p.phase) * 6
        const y = h * 0.52 + wave + (p.y - h * 0.5) * 0.12
        const r = 1 + p.z * 2.2

        ctx!.beginPath()
        ctx!.fillStyle = `rgba(167, 243, 208, ${0.12 + p.z * 0.6})`
        ctx!.arc(p.x, y, r, 0, Math.PI * 2)
        ctx!.fill()

        if (p.z > 0.7) {
          ctx!.beginPath()
          ctx!.fillStyle = `rgba(52, 211, 153, ${0.08 * p.z})`
          ctx!.arc(p.x, y, r * 3.5, 0, Math.PI * 2)
          ctx!.fill()
        }
      }

      raf = requestAnimationFrame(frame)
    }

    resize()
    if (reduced) {
      drawStatic()
    } else {
      raf = requestAnimationFrame(frame)
    }

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="particle-wave" aria-hidden>
      <canvas ref={canvasRef} />
      <div className="particle-fade" />
    </div>
  )
}
