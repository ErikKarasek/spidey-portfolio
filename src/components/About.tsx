import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../gsap'
import { profile } from '../content'
import { useLang } from '../i18n'
import { useSuit } from '../theme'

// Your portrait in the suit, cropped from the hero shot so it has a Symbiote twin too
// (public/img/me.webp is the plain photo the CV uses). Falls back to the Spider-Man portrait.
const PHOTO = '/img/me-suit.webp'
const PHOTO_FALLBACK = '/img/spidey-band.webp'

export function About() {
  const root = useRef<HTMLElement>(null)
  const hanger = useRef<HTMLDivElement>(null)
  const webL = useRef<HTMLDivElement>(null)
  const webR = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const pills = useRef<HTMLDivElement>(null)
  const [photo, setPhoto] = useState(PHOTO)
  const { t } = useLang()
  const suit = useSuit()

  useGSAP(
    () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom center', toggleActions: 'play none none reverse' } })
        .fromTo([webL.current, webR.current], { y: -600, opacity: 0 }, { y: 0, opacity: 1, duration: 1.8, ease: 'elastic.out(0.8, 0.4)', stagger: 0.3 })
        .fromTo(
          label.current,
          { x: -50, opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' },
          { x: 0, opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', duration: 0.8, ease: 'power3.out' },
          '-=1.4',
        )
        .fromTo(
          title.current,
          { y: 50, opacity: 0, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
          { y: 0, opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', duration: 0.8, ease: 'power3.out' },
          '-=1.0',
        )
        .fromTo(hanger.current, { y: -800, opacity: 0 }, { y: 0, opacity: 1, duration: 1.8, ease: 'elastic.out(0.7, 0.4)' }, '-=0.8')
        .fromTo(copy.current!.children, { y: 40, opacity: 0, rotationX: -45 }, { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.15, ease: 'back.out(1.2)' }, '-=1.2')
        .fromTo(pills.current!.children, { scale: 0.5, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.8')

      gsap.to(hanger.current, { rotation: 2.5, transformOrigin: 'top center', yoyo: true, repeat: -1, duration: 3.2, ease: 'sine.inOut', delay: 2 })
      gsap.to('.bg-web-left', { rotation: 360, transformOrigin: 'center center', repeat: -1, duration: 70, ease: 'linear' })
      gsap.to('.bg-web-right', { rotation: -360, transformOrigin: 'center center', repeat: -1, duration: 90, ease: 'linear' })
      gsap.to('.tech-pill', { y: -4, yoyo: true, repeat: -1, duration: 1.5, ease: 'sine.inOut', stagger: { each: 0.2, from: 'random' }, delay: 1.5 })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-surface-2 py-24 text-ink">
      <div ref={webL} className="pointer-events-none absolute left-[-5%] top-[-50px] z-0 flex flex-col items-center md:left-[2%]">
        <div className="h-[250px] w-px bg-linear-to-b from-transparent to-line md:h-[350px]" />
        <img src="/img/web.webp" alt="" className="bg-web-left web-img -mt-12 h-64 w-64 object-contain opacity-[0.12] md:h-96 md:w-96" />
      </div>
      <div ref={webR} className="pointer-events-none absolute right-[-5%] top-[-50px] z-0 flex flex-col items-center md:right-[2%]">
        <div className="h-[200px] w-px bg-linear-to-b from-transparent to-line md:h-[300px]" />
        <img src="/img/web.webp" alt="" className="bg-web-right web-img -mt-10 h-56 w-56 object-contain opacity-[0.12] md:h-80 md:w-80" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-12 px-6 md:px-12 lg:flex-row lg:items-start lg:gap-20 lg:px-24">
        <div className="relative z-20 mt-10 flex flex-1 flex-col gap-6 lg:mt-0">
          <div className="overflow-hidden">
            <span ref={label} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent md:text-sm">
              <img src={suit('/img/spidey-band.webp')} alt="" className="suit-img h-5 w-5 object-contain drop-shadow-sm" />
              {t.about.label}
            </span>
          </div>
          <div className="overflow-hidden py-2 pr-2">
            <h2 ref={title} className="text-4xl font-black italic uppercase tracking-tighter text-ink [text-shadow:2px_2px_0_var(--color-accent-soft)] md:text-5xl lg:text-7xl">
              {profile.first} {profile.last}.
            </h2>
          </div>
          <div ref={copy} className="mt-2 flex max-w-xl flex-col gap-6 text-base font-medium leading-relaxed text-ink-2 [perspective:600px] md:text-lg">
            {t.about.paragraphs.map((p, i) => (
              <p key={i} className="origin-bottom">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="mb-6 inline-block border-b border-line pb-2 text-xs font-bold uppercase tracking-widest text-mute">{t.about.stack}</h3>
            <div ref={pills} className="flex flex-wrap gap-3">
              {profile.stack.map((s) => (
                <div
                  key={s}
                  className="tech-pill cursor-default rounded-xl border border-accent/30 bg-surface px-5 py-2.5 text-sm font-bold tracking-wider text-accent shadow-sm transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink hover:shadow-[0_8px_20px_rgb(var(--glow)/0.3)]"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <h3 className="mb-4 inline-block border-b border-line pb-2 text-xs font-bold uppercase tracking-widest text-mute">{t.about.certs.heading}</h3>
            <div className="flex flex-wrap gap-3">
              {t.about.certs.items.map((cert) => (
                <div key={cert.title} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-sm">
                  {/* A rosette: reads as a certificate without needing an image. */}
                  <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                    <circle cx="12" cy="9" r="6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 14.5-1.5 6L12 18.5l4.5 2-1.5-6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.8 9 1.5 1.6L14.4 7.5" />
                  </svg>
                  <div>
                    <div className="text-sm font-black uppercase tracking-tight text-ink">{cert.title}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-mute">{cert.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[550px] w-full flex-1 items-start justify-center">
          <div ref={hanger} className="group z-30 flex flex-col items-center">
            <div className="h-[200px] w-[2px] bg-linear-to-b from-transparent via-accent/60 to-accent md:h-[350px]" />
            <div className="glow-frame relative h-64 w-64 rounded-full border-[6px] border-accent bg-surface p-2 transition-transform duration-500 group-hover:scale-105 md:h-[340px] md:w-[340px]">
              <img
                src={suit(photo)}
                onError={() => setPhoto(PHOTO_FALLBACK)}
                alt={`${profile.first} ${profile.last}`}
                className="h-full w-full rounded-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
