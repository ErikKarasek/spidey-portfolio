import { useRef } from 'react'
import { gsap, useGSAP } from '../gsap'
import { useLang } from '../i18n'
import { SectionHeader } from './SectionHeader'

/** Career timeline: the thread spins down as you scroll and each job swings in from its side. */
export function Experience() {
  const root = useRef<HTMLElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const web = useRef<HTMLImageElement>(null)
  const { t } = useLang()

  useGSAP(
    () => {
      gsap.fromTo(header.current, { y: 20, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      })
      gsap.fromTo('.xp-line', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: { trigger: '.xp-list', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 },
      })
      gsap.utils.toArray<HTMLElement>('.xp-item').forEach((item, i) => {
        const st = { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' }
        gsap.fromTo(item.querySelector('.xp-card'), { x: i % 2 ? 60 : -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)', scrollTrigger: st })
        gsap.fromTo(item.querySelector('.xp-dot'), { scale: 0 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', scrollTrigger: st })
      })
      gsap.to(web.current, { rotation: -8, scale: 1.1, opacity: 0.07, repeat: -1, yoyo: true, duration: 5, ease: 'sine.inOut' })
    },
    { scope: root, dependencies: [t] },
  )

  return (
    <section ref={root} id="experience" className="relative flex w-full flex-col items-center overflow-hidden border-t border-line-2 bg-surface px-6 py-16 text-ink md:px-16 lg:px-24">
      <div className="pointer-events-none absolute left-0 top-0 z-0 overflow-hidden">
        <img ref={web} src="/img/web.webp" alt="" className="web-img h-[500px] w-[500px] -translate-x-1/4 -translate-y-1/4 object-contain opacity-[0.04] md:h-[650px] md:w-[650px]" />
      </div>

      <SectionHeader ref={header} label={t.experience.label} title={t.experience.title} />

      <div className="xp-list relative z-10 w-full max-w-4xl">
        <div className="xp-line absolute bottom-0 left-4 top-0 w-[2px] bg-linear-to-b from-accent via-accent/60 to-transparent md:left-1/2 md:-translate-x-1/2" />

        {t.experience.items.map((job, i) => {
          const left = i % 2 === 0
          return (
            <div key={i} className={`xp-item relative mb-8 pl-12 last:mb-0 md:w-1/2 ${left ? 'md:pl-0 md:pr-12' : 'md:ml-auto md:pl-12'} ${i > 0 ? 'md:-mt-24' : ''}`}>
              <span
                className={`xp-dot absolute left-4 top-7 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-surface bg-accent shadow-[0_0_0_2px_var(--color-accent),0_0_14px_rgb(var(--glow)/0.5)] ${
                  left ? 'md:left-auto md:right-0 md:translate-x-1/2' : 'md:left-0'
                }`}
              />
              <div className="xp-card group relative overflow-hidden rounded-2xl border border-line bg-surface-2/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_10px_30px_rgb(var(--glow)/0.15)]">
                <div className="absolute left-0 top-0 h-1 w-full -translate-x-full bg-accent transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent">{job.when}</span>
                  {job.current && (
                    <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-accent-ink">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-ink" />
                      {t.experience.now}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">{job.role}</h3>
                <p className="mb-3 text-xs font-semibold text-mute">{job.company}</p>
                <ul className="space-y-1.5 text-xs font-medium leading-relaxed text-ink-3 md:text-sm">
                  {job.points.map((p) => (
                    <li key={p} className="relative pl-4 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
