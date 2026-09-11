import { useRef } from 'react'
import { gsap, reducedMotion, useGSAP } from '../gsap'
import { profile } from '../content'
import { useLang } from '../i18n'
import { preloadSuit, useIsSymbiote } from '../theme'

/** Suit-up screen: preloads the hero art, then lifts away like a mask coming off. */
export function Loader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const pct = useRef<HTMLSpanElement>(null)
  const { t } = useLang()
  const symbiote = useIsSymbiote()

  useGSAP(
    () => {
      let cancelled = false
      document.documentElement.style.overflow = 'hidden'

      const web = new Image()
      web.src = '/img/web.webp'
      // Only what the first screen shows; the rest of the art loads behind it.
      const loaded = Promise.all([preloadSuit(symbiote, true), web.decode().catch(() => {})])

      // Reduced motion: no suit-up show, just get out of the way once the first screen is ready.
      if (reducedMotion) {
        loaded.then(() => {
          if (cancelled) return
          document.documentElement.style.overflow = ''
          onDone()
        })
        return () => {
          cancelled = true
          document.documentElement.style.overflow = ''
        }
      }

      const progress = { v: 0 }
      const intro = gsap
        .timeline()
        .fromTo('.ld-web', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 0.5, duration: 1.2, ease: 'power3.out' })
        .fromTo('.ld-name', { x: -120, skewX: -15, opacity: 0 }, { x: 0, skewX: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)' }, 0.15)
        .fromTo('.ld-sub', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.5)
        .to(
          progress,
          {
            v: 100,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
              bar.current!.style.transform = `scaleX(${progress.v / 100})`
              pct.current!.textContent = `${Math.round(progress.v)}%`
            },
          },
          0.2,
        )
      gsap.to('.ld-web', { rotation: 360, duration: 30, repeat: -1, ease: 'none' })

      Promise.all([loaded, intro.then()]).then(() => {
        if (cancelled) return
        gsap
          .timeline({
            onComplete: () => {
              document.documentElement.style.overflow = ''
              onDone()
            },
          })
          .to('.ld-inner', { scale: 1.12, opacity: 0, duration: 0.45, ease: 'power2.in' })
          .to(ref.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power4.inOut' }, '-=0.1')
      })

      return () => {
        cancelled = true
        document.documentElement.style.overflow = ''
      }
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="fixed inset-0 z-[100] flex items-center justify-center bg-surface" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
      <img src="/img/web.webp" alt="" className="ld-web web-img pointer-events-none absolute h-[70vmin] w-[70vmin] object-contain opacity-0" />
      <div className="ld-inner relative flex flex-col items-center gap-5">
        <p className="ld-name text-6xl font-black italic uppercase leading-none tracking-tighter text-ink [text-shadow:4px_4px_0_var(--color-accent-bright),7px_7px_0_var(--color-accent)] md:text-8xl">
          <span className="text-red-600">{profile.first[0]}</span>
          {profile.first.slice(1)}.
        </p>
        <div className="ld-sub flex w-56 flex-col items-center gap-2">
          <div className="h-1 w-full overflow-hidden rounded-full bg-line">
            <div ref={bar} className="h-full w-full origin-left scale-x-0 rounded-full bg-accent" />
          </div>
          <p className="flex w-full justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-mute">
            <span>{t.loader}</span>
            <span ref={pct}>0%</span>
          </p>
        </div>
      </div>
    </div>
  )
}
