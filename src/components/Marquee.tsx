import { useRef } from 'react'
import { gsap, useGSAP } from '../gsap'
import { useLang } from '../i18n'
import { useSuit } from '../theme'

function Track({ items, trackRef }: { items: string[]; trackRef: React.RefObject<HTMLDivElement | null> }) {
  const suit = useSuit()
  return (
    // Two identical halves, so sliding by -50% loops seamlessly.
    <div ref={trackRef} className="flex h-full w-max items-center">
      {[0, 1].map((half) => (
        <div key={half} className="flex h-full shrink-0 items-center" aria-hidden={half === 1}>
          {items.map((text, i) => (
            <span key={i} className="flex shrink-0 items-center">
              <span className="marquee-text mx-3 shrink-0 whitespace-nowrap text-sm font-black italic uppercase tracking-widest drop-shadow-sm sm:mx-4 md:mx-6 md:text-base lg:text-xl">
                {text}
              </span>
              <img
                src={i % 2 === 0 ? suit('/img/spidey-band.webp') : '/img/web.webp'}
                alt=""
                className={`mx-3 h-5 w-auto shrink-0 object-contain drop-shadow-md sm:mx-4 sm:h-6 md:mx-6 md:h-8 lg:h-10 ${i % 2 === 0 ? 'suit-img' : 'web-img'}`}
              />
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export function Marquee() {
  const root = useRef<HTMLElement>(null)
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const tweens = useRef<gsap.core.Tween[]>([])
  const { t } = useLang()
  const items = [...t.marquee, ...t.marquee]

  const { contextSafe } = useGSAP(
    () => {
      const ta = gsap.to(a.current, { x: '-50%', repeat: -1, duration: 15, ease: 'none' })
      gsap.set(b.current, { x: '-50%' })
      const tb = gsap.to(b.current, { x: '0%', repeat: -1, duration: 20, ease: 'none' })
      tweens.current = [ta, tb]
      gsap.to('.marquee-text', { y: -4, yoyo: true, repeat: -1, duration: 0.8, ease: 'sine.inOut', stagger: 0.1 })
    },
    { scope: root },
  )

  // Hovering the tapes slows them to a crawl so you can read them.
  const slow = contextSafe(() => gsap.to(tweens.current, { timeScale: 0.1, duration: 0.8, ease: 'power2.out' }))
  const resume = contextSafe(() => gsap.to(tweens.current, { timeScale: 1, duration: 0.8, ease: 'power2.out' }))

  return (
    <section
      ref={root}
      onMouseEnter={slow}
      onMouseLeave={resume}
      aria-label="Tech"
      className="relative z-40 flex h-[20vh] w-full items-center justify-center overflow-hidden bg-surface md:h-[30vh]"
    >
      <div className="absolute z-20 flex h-12 w-[110vw] -translate-y-4 rotate-[4deg] items-center overflow-hidden border-y-[3px] border-band-edge bg-accent text-accent-ink shadow-[0_10px_20px_rgba(0,0,0,0.4)] md:h-16 md:-translate-y-6 lg:h-20">
        <Track items={items} trackRef={a} />
      </div>
      <div className="absolute z-10 flex h-12 w-[110vw] translate-y-4 rotate-[-4deg] items-center overflow-hidden border-y-[3px] border-accent bg-band-dark text-accent shadow-[0_5px_15px_rgba(0,0,0,0.5)] md:h-16 md:translate-y-6 lg:h-20">
        <Track items={items} trackRef={b} />
      </div>
    </section>
  )
}
