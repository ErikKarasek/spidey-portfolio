import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../gsap'
import { playThwip } from '../sound'

type Splat = { id: number; x: number; y: number; angle: number }

/** Click anywhere that isn't a control and a web splats onto the screen. */
export function WebShooter() {
  const [splats, setSplats] = useState<Splat[]>([])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, input, textarea, select, label')) return
      const splat = { id: performance.now() + Math.random(), x: e.clientX, y: e.clientY, angle: Math.random() * 360 }
      setSplats((list) => [...list.slice(-6), splat])
      playThwip()
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {splats.map((s) => (
        <SplatView key={s.id} {...s} onDone={() => setSplats((list) => list.filter((x) => x.id !== s.id))} />
      ))}
    </div>
  )
}

function SplatView({ x, y, angle, onDone }: Splat & { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap
        .timeline({ onComplete: onDone })
        .from('.splat-web', { scale: 0.1, rotate: -60, duration: 0.4, ease: 'back.out(2)' })
        .from('.thwip', { scale: 0, rotate: -30, duration: 0.4, ease: 'back.out(3)' }, 0.05)
        .to(ref.current, { autoAlpha: 0, duration: 0.6, delay: 0.7 })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="absolute" style={{ left: x - 75, top: y - 75, width: 150, height: 150 }}>
      <img src="/img/web.webp" alt="" className="splat-web web-img size-full opacity-80" style={{ rotate: `${angle}deg` }} />
      <span className="thwip">THWIP!</span>
    </div>
  )
}
