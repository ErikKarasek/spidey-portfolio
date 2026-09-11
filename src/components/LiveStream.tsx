import { useRef } from 'react'
import { gsap, useGSAP } from '../gsap'
import { CHANNELS, socials } from '../content'
import { useLang } from '../i18n'
import type { LiveStatus } from '../live'
import { SectionHeader } from './SectionHeader'

/** Only exists while you're live: the stream itself, right under the hero. Kick (the main channel) wins if both are on. */
export function LiveStream({ live }: { live: LiveStatus }) {
  const root = useRef<HTMLElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const { t } = useLang()
  const platform = live.kick ? 'kick' : live.twitch ? 'twitch' : null

  useGSAP(
    () => {
      if (!platform) return
      gsap.fromTo('.live-player', { y: 40, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' })
      gsap.fromTo(header.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
    },
    { scope: root, dependencies: [platform] },
  )

  if (!platform) return null

  // Twitch only plays inside pages it was told about, so pass whatever host is serving the site.
  const src =
    platform === 'twitch'
      ? `https://player.twitch.tv/?channel=${CHANNELS.twitch}&parent=${location.hostname}&muted=true&autoplay=true`
      : `https://player.kick.com/${CHANNELS.kick}?autoplay=true&muted=true`
  const link = socials.find((s) => s.live === platform)!

  return (
    <section ref={root} id="live" className="relative flex w-full flex-col items-center border-t border-line-2 bg-surface px-6 py-16 md:px-16 lg:px-24">
      <SectionHeader ref={header} label={t.live.label} title={t.live.title} />
      <div className="live-player relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border-2 border-red-600 bg-black shadow-[0_0_40px_rgba(220,38,38,0.35)]">
        <span className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          Live
        </span>
        <iframe src={src} title={`${link.label} stream`} allow="autoplay; fullscreen" allowFullScreen className="aspect-video w-full" />
      </div>
      <a href={link.href} target="_blank" rel="noreferrer" className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-mute transition-colors hover:text-accent">
        {t.live.openOn} {link.label} ↗
      </a>
    </section>
  )
}
