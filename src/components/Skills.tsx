import { useRef } from 'react'
import { gsap, useGSAP } from '../gsap'
import { useLang } from '../i18n'
import { Hanging } from './Hanging'
import { SectionHeader } from './SectionHeader'

export function Skills() {
  const root = useRef<HTMLElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const web = useRef<HTMLImageElement>(null)
  const spidey = useRef<HTMLDivElement>(null)
  const { t } = useLang()

  useGSAP(
    () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', toggleActions: 'play none none reverse' } })
        .fromTo(header.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .fromTo('.matrix-item', { y: 30, opacity: 0, x: -15 }, { y: 0, opacity: 1, x: 0, duration: 0.5, stagger: 0.04, ease: 'back.out(1.5)' }, '-=0.3')
      gsap.to(web.current, { scale: 1.05, opacity: 0.06, repeat: -1, yoyo: true, duration: 5, ease: 'sine.inOut' })
      gsap.to(spidey.current, { rotation: 5, transformOrigin: 'top center', repeat: -1, yoyo: true, duration: 3.2, ease: 'sine.inOut' })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="skills" className="relative flex w-full flex-col items-center justify-center overflow-hidden border-t border-line-2 bg-surface px-6 py-16 text-ink md:px-16 lg:px-24">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <img ref={web} src="/img/web.webp" alt="" className="web-img h-[600px] w-[600px] object-contain opacity-[0.04] md:h-[800px] md:w-[800px]" />
      </div>
      <Hanging ref={spidey} className="right-8 max-lg:hidden md:right-16" />

      <SectionHeader ref={header} label={t.skills.label} title={t.skills.title} />

      <div className="z-10 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        {t.skills.items.map((s, i) => (
          <div
            key={i}
            className="matrix-item group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-line bg-surface-2/90 px-5 py-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-accent hover:shadow-[0_8px_20px_rgb(var(--glow)/0.25)]"
          >
            <div className="absolute inset-0 z-0 -translate-x-full bg-accent transition-transform duration-[400ms] ease-out group-hover:translate-x-0" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--glow)/0.6)] transition-colors duration-300 group-hover:bg-accent-ink" />
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-tight text-ink transition-colors duration-300 group-hover:text-accent-ink md:text-base">{s.name}</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-mute-2 transition-colors duration-300 group-hover:text-accent-ink/70">{s.category}</span>
              </div>
            </div>
            <div className="relative z-10">
              <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-2 shadow-sm transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                {s.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
