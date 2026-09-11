import { useEffect, useState } from 'react'
import { profile, socials } from '../content'
import { useLang } from '../i18n'
import type { LiveStatus } from '../live'
import { setMuted, useMuted } from '../sound'
import { useSymbiote } from '../theme'

function SpiderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
      <path d="M10 9 6 5 3 6M14 9l4-4 3 1M9.5 11.5 4 10.5 2 13M14.5 11.5l5.5-1 2 2.5M9.5 13.5 5 16l-1 4M14.5 13.5 19 16l1 4M10.5 15 8.5 19v3M13.5 15l2 4v3" />
      <ellipse cx="12" cy="8.5" rx="1.9" ry="1.9" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="13" rx="2.6" ry="3.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LiveBadge({ live }: { live: LiveStatus }) {
  const where = socials.find((s) => s.live && live[s.live])
  if (!where) return null
  return (
    <a
      href="#live"
      className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_14px_rgba(220,38,38,0.6)] transition-transform hover:scale-105"
      title={where.label}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      Live
    </a>
  )
}

export function Nav({ live }: { live: LiveStatus }) {
  const { t, lang, setLang } = useLang()
  const symbiote = useSymbiote()
  const muted = useMuted()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || open
  const links = [
    { href: '#about', label: t.nav.about },
    { href: '#experience', label: t.nav.experience },
    { href: '#skills', label: t.nav.skills },
    { href: '#projects', label: t.nav.projects },
    { href: '#contact', label: t.nav.contact },
  ]

  const controls = (
    <div className="flex items-center gap-2">
      <LiveBadge live={live} />
      <button
        onClick={() => setLang(lang === 'cs' ? 'en' : 'cs')}
        className={`flex h-8 items-center rounded-full border px-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
          solid ? 'border-white/20' : 'border-line'
        }`}
        aria-label="Language"
      >
        {(['cs', 'en'] as const).map((l) => (
          <span
            key={l}
            className={`rounded-full px-2 py-1 transition-colors ${
              lang === l ? 'bg-accent text-accent-ink' : solid ? 'text-gray-400' : 'text-mute-2'
            }`}
          >
            {l}
          </span>
        ))}
      </button>
      <button
        onClick={() => setMuted(!muted)}
        title={muted ? t.nav.soundOff : t.nav.soundOn}
        aria-label={muted ? t.nav.soundOff : t.nav.soundOn}
        aria-pressed={!muted}
        className={`grid h-8 w-8 place-items-center rounded-full border transition-all duration-300 hover:scale-110 ${
          solid ? 'border-white/20 text-gray-300 hover:text-white' : 'border-line text-ink hover:border-ink'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
          {muted ? <path d="m22 9-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />}
        </svg>
      </button>
      <button
        onClick={symbiote.toggle}
        title={t.nav.symbiote}
        aria-label={t.nav.symbiote}
        aria-pressed={symbiote.on}
        className={`grid h-8 w-8 place-items-center rounded-full border transition-all duration-300 hover:scale-110 ${
          symbiote.on ? 'border-white bg-white text-black' : solid ? 'border-white/20 text-gray-300 hover:text-white' : 'border-line text-ink hover:border-ink'
        }`}
      >
        <SpiderIcon className="h-4 w-4" />
      </button>
    </div>
  )

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
        solid ? 'border-white/10 bg-black/85 py-3 backdrop-blur-md' : 'border-transparent bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 md:px-12">
        <a href="#top" className={`group flex items-center text-2xl font-black italic uppercase tracking-tighter ${solid ? 'text-white' : 'text-ink'}`}>
          <span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">{profile.first[0]}</span>
          <span className="transition-colors duration-300 group-hover:text-red-500">{profile.first.slice(1)}.</span>
        </a>

        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`group relative text-xs font-bold uppercase tracking-[0.15em] text-gray-400 xl:text-sm transition-colors duration-300 ${solid ? 'hover:text-white' : 'hover:text-ink'}`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <span className={`h-5 w-px ${solid ? 'bg-white/15' : 'bg-line'}`} />
          {controls}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LiveBadge live={live} />
          <button className="text-gray-400 transition-colors hover:text-red-600" onClick={() => setOpen((o) => !o)} aria-label={t.nav.menu}>
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-5 px-6 pb-4 pt-6 lg:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-bold uppercase tracking-[0.15em] text-gray-300 hover:text-white">
              {l.label}
            </a>
          ))}
          {controls}
        </div>
      )}
    </nav>
  )
}
