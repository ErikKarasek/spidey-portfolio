import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../gsap'
import { profile } from '../content'
import { useLang } from '../i18n'
import { useSuit } from '../theme'

// public/img/hero-face.webp = you in the suit without the mask (16:9, white background).
// public/img/hero-mask.webp = the same shot with the mask on. (The .jpg next to them are the masters.) With both, the cursor peels the mask off
// exactly like the original. With only the face, it uncovers a black & white copy. With neither,
// a standing Spidey holds the spot.
const FACE = '/img/hero-face.webp'
const MASK = '/img/hero-mask.webp'
const PLACEHOLDER = '/img/spidey-stand.webp'

const exists = (src: string) =>
  new Promise<boolean>((done) => Object.assign(new Image(), { onload: () => done(true), onerror: () => done(false), src }))

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const webs = useRef<HTMLDivElement>(null)
  const { t } = useLang()
  const suit = useSuit()
  // Assume the photo pair is there (it is on the live site) so the hero never lays out twice;
  // fall back to the placeholder only if they fail to load.
  const [art, setArt] = useState({ face: true, mask: true })
  // The hole the cursor cuts: opaque and tiny at rest, blown wide open on hover.
  const lens = useRef({ x: 0, y: 0, alpha: 1, size: 50 }).current

  useEffect(() => {
    Promise.all([exists(FACE), exists(MASK)]).then(([face, mask]) => setArt({ face, mask: face && mask }))
  }, [])

  // Hero intro — same beats as the original: webs bloom, tagline slides, name skews in, buttons pop.
  useGSAP(
    () => {
      if (!ready) return
      gsap
        .timeline({ defaults: { ease: 'back.out(1.7)' } })
        .fromTo(webs.current!.children, { opacity: 0, scale: 0.5 }, { opacity: 0.5, scale: 1, duration: 2, stagger: 0.4, ease: 'power3.out' })
        .fromTo('.hero-tag', { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2 }, '-=1.5')
        .fromTo('.hero-title', { x: -150, opacity: 0, skewX: -15 }, { x: 0, opacity: 1, skewX: 0, duration: 1.2 }, '-=1.0')
        .fromTo('.hero-cta > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(2)' }, '-=0.8')
      gsap.to(webs.current!.children, { rotation: 360, duration: 120, repeat: -1, ease: 'linear' })
      gsap.to(webs.current!.children, { scale: 1.1, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 })
    },
    { scope: root, dependencies: [ready] },
  )

  const { contextSafe } = useGSAP(
    () => {
      const r = top.current!.getBoundingClientRect()
      lens.x = r.width / 2
      lens.y = r.height / 2
      const paint = () => {
        const { x, y, alpha, size } = lens
        // A clear window with a feathered rim and a fully opaque mask outside it. The original's
        // 85%-opaque ramp let the two (not pixel-identical) shots ghost through each other, and a
        // small window put the blend right on the head, where hair and smooth mask don't match.
        const mask = `radial-gradient(circle ${size}px at ${x}px ${y}px, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,${alpha}) 60%, rgba(0,0,0,1) 100%)`
        if (top.current) {
          top.current.style.webkitMaskImage = mask
          top.current.style.maskImage = mask
        }
      }
      gsap.ticker.add(paint)
      return () => gsap.ticker.remove(paint)
    },
    { scope: root },
  )

  const quick = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null)
  const move = contextSafe((e: React.MouseEvent) => {
    quick.current ??= {
      x: gsap.quickTo(lens, 'x', { duration: 0.3, ease: 'power4.out' }),
      y: gsap.quickTo(lens, 'y', { duration: 0.3, ease: 'power4.out' }),
    }
    const r = top.current!.getBoundingClientRect()
    quick.current.x(e.clientX - r.left)
    quick.current.y(e.clientY - r.top)
  })
  // Sized to the hero so hovering the face clears the whole head, hair included, on any screen;
  // the feathered rim then lands on suit and background, where both shots look alike.
  const enter = contextSafe(() =>
    gsap.to(lens, { alpha: 0, size: root.current!.offsetHeight * 0.56, duration: 0.8, ease: 'elastic.out(1, 0.7)', overwrite: 'auto' }),
  )
  const leave = contextSafe(() => gsap.to(lens, { alpha: 1, size: 50, duration: 1.2, ease: 'power4.inOut', overwrite: 'auto' }))

  const photo = art.face ? FACE : PLACEHOLDER
  // Your photo fills the hero like the original; the transparent cut-out stands on the right.
  const layers = art.face ? 'absolute inset-0' : 'absolute inset-x-0 bottom-0 top-20'
  const fit = art.face ? 'object-cover object-center' : 'object-contain object-[78%_100%]'
  const tone = art.face ? 'photo-img' : 'suit-img'

  return (
    <section
      ref={root}
      onMouseMove={move}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-surface"
    >
      {/* Bottom = what the cursor uncovers: your face, or a black & white copy until the masked shot exists. */}
      <div className={`${layers} pointer-events-none`}>
        <img
          src={suit(photo)}
          fetchPriority="high"
          alt={`${profile.first} ${profile.last}`}
          className={`${tone} absolute inset-0 z-10 h-full w-full ${fit} ${art.mask ? '' : 'contrast-125 grayscale'}`}
        />
        <div ref={top} className="absolute inset-0 z-20">
          <img src={suit(art.mask ? MASK : photo)} fetchPriority="high" alt="" className={`${tone} h-full w-full ${fit}`} />
        </div>
      </div>

      <div ref={webs} className="pointer-events-none absolute inset-0 z-[25] overflow-hidden">
        <img src="/img/web.webp" alt="" className="web-img absolute left-0 top-0 h-44 w-44 -translate-x-1/4 -translate-y-1/4 object-contain opacity-0 sm:h-64 sm:w-64 md:h-[400px] md:w-[400px]" />
        <img src="/img/web.webp" alt="" className="web-img absolute bottom-0 right-0 h-52 w-52 translate-x-1/4 translate-y-1/4 object-contain opacity-0 sm:h-72 sm:w-72 md:h-[500px] md:w-[500px]" />
      </div>

      {/* On phones and portrait tablets the portrait fills the top; the copy sits on a fade at the bottom so it stays readable. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[26] h-[62%] bg-linear-to-t from-surface via-surface/85 to-transparent lg:hidden" />

      <div className="pointer-events-none absolute bottom-10 left-6 right-6 z-30 flex max-w-lg flex-col gap-3 drop-shadow-md md:left-12 lg:bottom-auto lg:left-24 lg:right-auto lg:top-1/2 lg:w-full lg:-translate-y-1/2">
        <span className="hero-tag text-xs font-bold uppercase tracking-[0.2em] text-accent opacity-0 md:text-sm">{t.hero.tagline}</span>
        <h1 className="hero-title pr-4 text-5xl font-black italic uppercase leading-none tracking-tighter text-ink opacity-0 [text-shadow:4px_4px_0_var(--color-accent-bright),7px_7px_0_var(--color-accent)] md:text-6xl lg:text-7xl">
          {profile.first} {profile.last}.
        </h1>
        <div className="hero-cta pointer-events-auto mt-6 flex flex-wrap items-center gap-4 md:w-max md:flex-nowrap">
          <a
            href="#projects"
            className="relative cursor-pointer overflow-hidden rounded-lg border border-accent bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wide text-accent-ink opacity-0 transition-all duration-300 hover:-translate-y-1 hover:bg-accent-dark hover:shadow-[0_10px_20px_rgb(var(--glow)/0.4)]"
          >
            {t.hero.cta}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-transparent bg-gray-900 px-6 py-3 text-sm font-bold uppercase text-white opacity-0 transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] [.symbiote_&]:border-white/20"
          >
            <svg className="h-4 w-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 16 16" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
          {/* Like the original's resume button: opens the PDF for the current language (npm run cv rebuilds it). */}
          <a
            href={t.hero.cvHref}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-line bg-surface px-6 py-3 text-sm font-bold uppercase text-ink opacity-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent hover:shadow-[0_10px_20px_rgb(var(--glow)/0.2)]"
          >
            <svg className="h-4 w-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24" aria-hidden>
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            {t.hero.cv}
          </a>
        </div>
      </div>
    </section>
  )
}
