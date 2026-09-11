import { useRef, useState, type FormEvent } from 'react'
import { gsap, useGSAP } from '../gsap'
import { profile, socials } from '../content'
import { useLang } from '../i18n'
import type { LiveStatus } from '../live'
import { Hanging } from './Hanging'
import { SectionHeader } from './SectionHeader'
import { SocialIcon } from './SocialIcon'

// FormSubmit relays the form to your inbox — no account or backend. The very first message sends
// you an "Activate Form" e-mail instead; click it once and every later message arrives normally.
const ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`

const field =
  'w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium text-ink placeholder:text-mute-2 transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'
const labelCls = 'text-xs font-bold uppercase tracking-wider text-ink-3'

type Status = { state: 'idle' | 'sending' | 'sent' | 'error'; note?: string }

export function Contact({ live }: { live: LiveStatus }) {
  const root = useRef<HTMLElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const web = useRef<HTMLImageElement>(null)
  const spidey = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const { t } = useLang()
  const c = t.contact

  useGSAP(
    () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', toggleActions: 'play none none reverse' } })
        .fromTo(header.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .fromTo(card.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.3')
        .fromTo('.social-link', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.5)' }, '-=0.3')
      gsap.to(web.current, { scale: 1.15, opacity: 0.06, repeat: -1, yoyo: true, duration: 4.5, ease: 'sine.inOut' })
      gsap.to(spidey.current, { rotation: 8, transformOrigin: 'top center', repeat: -1, yoyo: true, duration: 2, ease: 'sine.inOut' })
    },
    { scope: root },
  )

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    if (form.get('_honey')) return // bots fill the hidden field, people don't
    const name = String(form.get('name') ?? '').trim()

    setStatus({ state: 'sending' })
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email: String(form.get('email') ?? '').trim(),
          message: String(form.get('message') ?? '').trim(),
          _subject: c.subject(name),
          _template: 'table',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string }
      if (res.ok && String(data.success) === 'true') {
        formEl.reset()
        setStatus({ state: 'sent' })
      } else if (data.message && /activat/i.test(data.message)) {
        setStatus({ state: 'error', note: c.activate })
      } else {
        setStatus({ state: 'error', note: data.message || c.failed })
      }
    } catch {
      setStatus({ state: 'error', note: c.offline })
    }
  }

  const sending = status.state === 'sending'

  return (
    <section ref={root} id="contact" className="relative flex w-full flex-col items-center justify-center overflow-hidden border-t border-line-2 bg-surface px-6 py-16 text-ink md:px-16 lg:px-24">
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 overflow-hidden">
        <img ref={web} src="/img/web.webp" alt="" className="web-img h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 object-contain opacity-[0.04] md:h-[700px] md:w-[700px]" />
      </div>
      <Hanging ref={spidey} className="right-8 max-lg:hidden md:right-20" threadClass="h-24 md:h-36" imgClass="w-40 md:w-60 drop-shadow-2xl" />

      <SectionHeader ref={header} label={c.label} title={c.title} icon />

      <div ref={card} className="relative z-10 w-full max-w-2xl rounded-2xl border border-line bg-surface-2/90 p-8 shadow-sm backdrop-blur-sm">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>{c.name}</span>
              <input name="name" required className={field} placeholder={c.namePh} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>{c.email}</span>
              <input name="email" type="email" required className={field} placeholder={c.emailPh} />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>{c.message}</span>
            <textarea name="message" required rows={4} className={`${field} resize-none`} placeholder={c.messagePh} />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="w-full cursor-pointer rounded-xl bg-accent py-3.5 text-xs font-bold uppercase tracking-widest text-accent-ink shadow-[0_4px_15px_rgb(var(--glow)/0.3)] transition-all duration-300 hover:bg-accent-dark hover:shadow-[0_6px_20px_rgb(var(--glow)/0.5)] disabled:cursor-wait disabled:opacity-70"
          >
            {sending ? c.sending : status.state === 'sent' ? c.sent : c.send}
          </button>
          {status.state === 'sent' && <p className="text-center text-sm font-semibold text-green-600">{c.sentNote}</p>}
          {status.state === 'error' && <p className="text-center text-sm font-semibold text-accent">{status.note}</p>}
        </form>
      </div>

      <div className="relative z-10 mt-10 flex w-full max-w-2xl flex-col items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-mute">{c.socials}</span>
        <div className="flex flex-wrap justify-center gap-3">
          {socials.map((s) => {
            const isLive = !!s.live && live[s.live]
            return (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className={`social-link group relative flex items-center gap-2 rounded-xl border bg-surface px-4 py-2.5 text-sm font-bold tracking-wide text-accent shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-accent-ink hover:shadow-[0_8px_20px_rgb(var(--glow)/0.3)] ${
                  isLive ? 'border-red-600 ring-2 ring-red-600/30' : 'border-accent/30'
                }`}
              >
                <SocialIcon id={s.id} className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                {s.label}
                {isLive && (
                  <span className="ml-1 flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    {c.liveNow}
                  </span>
                )}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
