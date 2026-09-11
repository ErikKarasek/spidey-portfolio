import { useRef } from 'react'
import { gsap, useGSAP } from '../gsap'
import { useLang } from '../i18n'
import { useSuit } from '../theme'
import { Downloads } from './Downloads'
import { SectionHeader } from './SectionHeader'

export function Projects() {
  const root = useRef<HTMLElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const web = useRef<HTMLImageElement>(null)
  const spidey = useRef<HTMLImageElement>(null)
  const { t } = useLang()
  const suit = useSuit()

  useGSAP(
    () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', toggleActions: 'play none none reverse' } })
        .fromTo(header.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .fromTo('.project-item', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)' }, '-=0.3')
        .fromTo(spidey.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4')
      gsap.set(web.current, { transformOrigin: 'top right' })
      gsap.to(web.current, { rotation: 8, repeat: -1, yoyo: true, duration: 6, ease: 'sine.inOut' })
      gsap.to(web.current, { scale: 1.1, opacity: 0.07, repeat: -1, yoyo: true, duration: 4, ease: 'sine.inOut' })
      gsap.to(spidey.current, { y: -10, repeat: -1, yoyo: true, duration: 2.5, ease: 'sine.inOut' })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="projects" className="relative flex w-full flex-col items-center justify-center overflow-hidden border-t border-line-2 bg-surface px-6 py-16 text-ink md:px-16 lg:px-24">
      <div className="pointer-events-none absolute right-0 top-0 z-0 overflow-hidden">
        <img ref={web} src="/img/web.webp" alt="" className="web-img h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 object-contain opacity-[0.04] md:h-[700px] md:w-[700px]" />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-4 z-30 max-lg:hidden md:left-12">
        <img ref={spidey} src={suit('/img/spidey-stand.webp')} alt="" data-spidey className="suit-img h-auto w-32 object-contain drop-shadow-2xl md:w-48" />
      </div>

      <SectionHeader ref={header} label={t.projects.label} title={t.projects.title} />

      <div className="z-10 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {t.projects.items.map((p) => {
          // A card with download buttons can't itself be a link (no links inside links).
          const Card = p.link && !p.downloads ? 'a' : 'div'
          return (
            <Card
              key={p.image}
              {...(Card === 'a' ? { href: p.link, target: '_blank', rel: 'noreferrer' } : {})}
              className="project-item group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface-2/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_10px_30px_rgb(var(--glow)/0.15)]"
            >
              <div className="absolute left-0 top-0 h-1 w-full -translate-x-full bg-accent transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <div>
                <div className="mb-5 aspect-[16/9] overflow-hidden rounded-xl border border-line bg-black">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-black uppercase tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">{p.title}</h3>
                  {Card === 'a' && (
                    <svg className="h-5 w-5 shrink-0 text-mute-2 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </div>
                <p className="mb-6 text-xs font-medium leading-relaxed text-ink-3 md:text-sm">{p.description}</p>
                {p.downloads && <Downloads />}
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line/60 pt-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-line bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-3 transition-colors duration-300 group-hover:border-accent/30 group-hover:text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
