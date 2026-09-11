import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../gsap'
import { CHANNELS } from '../content'
import { useLang } from '../i18n'
import type { Clip } from '../../server/youtube'
import { SectionHeader } from './SectionHeader'
import { SocialIcon } from './SocialIcon'

// Upload titles are mostly hashtags and "erickos007 v #Twitch"; keep the human part.
function cleanTitle(title: string, fallback: string) {
  let s = title.replace(/#\S+/g, ' ').replace(/\berickos007\b/gi, ' ')
  for (let i = 0; i < 3; i++) s = s.trim().replace(/(\s+v|[|·•:,-])$/i, '').replace(/^[|·•:,-]\s*/, '')
  s = s.replace(/\s{2,}/g, ' ').trim()
  return s.length >= 3 ? s : fallback
}

export function Clips() {
  const root = useRef<HTMLElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const [clips, setClips] = useState<Clip[] | null>(null)
  const { t, lang } = useLang()

  useEffect(() => {
    fetch('/api/youtube')
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Clip[]) => setClips(list))
      .catch(() => setClips([]))
  }, [])

  useGSAP(
    () => {
      if (!clips?.length) return
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', toggleActions: 'play none none reverse' } })
        .fromTo(header.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .fromTo('.clip-item', { y: 40, opacity: 0, rotate: -2 }, { y: 0, opacity: 1, rotate: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.3')
    },
    { scope: root, dependencies: [clips] },
  )

  // No uploads (or the feed is down): leave the section out entirely.
  if (!clips?.length) return null

  const date = new Intl.DateTimeFormat(lang === 'cs' ? 'cs-CZ' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <section ref={root} id="clips" className="relative flex w-full flex-col items-center overflow-hidden border-t border-line-2 bg-surface-2 px-6 py-16 text-ink md:px-16 lg:px-24">
      <SectionHeader ref={header} label={t.clips.label} title={t.clips.title} />

      <div className="z-10 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {clips.map((c) => (
          <a
            key={c.id}
            href={`https://www.youtube.com/watch?v=${c.id}`}
            target="_blank"
            rel="noreferrer"
            className="clip-item group relative overflow-hidden rounded-2xl border border-line bg-black shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_10px_30px_rgb(var(--glow)/0.2)]"
          >
            {/* oar2 = the upright Shorts frame. Regular videos don't have one and YouTube answers with a
                120x90 grey placeholder instead of an error, so fall back to the wide thumbnail by size. */}
            <img
              src={`https://i.ytimg.com/vi/${c.id}/oar2.jpg`}
              onLoad={(e) => {
                const img = e.currentTarget
                if (img.naturalWidth <= 120 && !img.src.includes('hq720')) img.src = `https://i.ytimg.com/vi/${c.id}/hq720.jpg`
              }}
              onError={(e) => (e.currentTarget.src = `https://i.ytimg.com/vi/${c.id}/hqdefault.jpg`)}
              alt=""
              loading="lazy"
              className="aspect-[9/16] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600">
              <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="line-clamp-2 text-sm font-black uppercase leading-tight tracking-tight text-white">{cleanTitle(c.title, t.clips.fallback)}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/60">{date.format(new Date(c.published))}</p>
            </div>
          </a>
        ))}
      </div>

      <a
        href={CHANNELS.youtube}
        target="_blank"
        rel="noreferrer"
        className="z-10 mt-8 flex items-center gap-2 rounded-xl border border-accent/30 bg-surface px-5 py-2.5 text-sm font-bold tracking-wide text-accent shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-accent-ink"
      >
        <SocialIcon id="youtube" className="h-4 w-4" />
        {t.clips.channel}
      </a>
    </section>
  )
}
