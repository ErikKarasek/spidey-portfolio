import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../gsap'
import { useLang } from '../i18n'
import { playSwoosh, playThwip } from '../sound'
import { switchSuit, useIsSymbiote, useSuit } from '../theme'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

/**
 * Typing "venom" anywhere switches suits; typing "spidey" (or the Konami code) sends Spider-Man swinging across the screen.
 * A hint waits in the browser console for anyone who opens dev tools.
 */
export function EasterEggs() {
  const { t } = useLang()
  const symbiote = useIsSymbiote()
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
  const [swing, setSwing] = useState(0)
  const live = useRef({ typed: '', keys: [] as string[], symbiote, t })
  live.current.symbiote = symbiote
  live.current.t = t

  useEffect(() => {
    console.log('%c🕷️ Psst… zkus na webu napsat „venom" nebo „spidey". / Try typing "venom" or "spidey" on the page.', 'color:#a31515;font:700 13px Outfit,sans-serif')
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
      const s = live.current
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      s.keys = [...s.keys, key].slice(-KONAMI.length)
      const swingNow = () => {
        setSwing((n) => n + 1)
        playThwip()
        playSwoosh(2.6)
      }
      if (s.keys.join() === KONAMI.join()) {
        s.keys = []
        swingNow()
      }
      if (key.length === 1) {
        s.typed = (s.typed + key).slice(-6)
        if (s.typed.endsWith('spidey')) {
          s.typed = ''
          swingNow()
        }
        if (s.typed.endsWith('venom')) {
          s.typed = ''
          const next = !s.symbiote
          void switchSuit(next)
          setToast({ id: Date.now(), text: next ? s.t.eggs.venomOn : s.t.eggs.venomOff })
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {toast && <Toast key={toast.id} text={toast.text} onDone={() => setToast(null)} />}
      {swing > 0 && <Swing key={swing} onDone={() => setSwing(0)} />}
    </>
  )
}

function Toast({ text, onDone }: { text: string; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    gsap
      .timeline({ onComplete: onDone })
      .fromTo(ref.current, { y: 40, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' })
      .to(ref.current, { y: 20, opacity: 0, duration: 0.4, delay: 2 })
  })
  return (
    <div ref={ref} className="pointer-events-none fixed bottom-8 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-accent px-5 py-2.5 text-sm font-black italic uppercase tracking-wider text-accent-ink shadow-[4px_4px_0_var(--color-band-dark)]">
      {text}
    </div>
  )
}

function Swing({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const suit = useSuit()
  useGSAP(
    () => {
      gsap
        .timeline({ onComplete: onDone })
        .fromTo('.swing-pivot', { rotation: -80 }, { rotation: 80, duration: 2.6, ease: 'sine.inOut' })
        .fromTo('.swing-pivot', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0)
        .fromTo('.swing-thwip', { scale: 0, rotate: -20 }, { scale: 1, rotate: -8, duration: 0.4, ease: 'back.out(3)' }, 0.1)
        .to('.swing-thwip', { opacity: 0, duration: 0.3 }, 1.2)
        .to('.swing-pivot', { opacity: 0, duration: 0.3 }, 2.3)
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      <span className="swing-thwip thwip !top-24 text-2xl">THWIP!</span>
      {/* A long pendulum hung above the screen: rotating it swings Spidey through an arc. */}
      <div className="swing-pivot absolute left-1/2 top-[-35vh] h-[100vh] w-0 origin-top">
        <div className="absolute left-0 top-0 h-[82vh] w-[2px] -translate-x-1/2 bg-linear-to-b from-transparent to-mute-2" />
        <img src={suit('/img/spidey-hang.webp')} alt="" className="suit-img absolute left-0 top-[80vh] w-32 max-w-none -translate-x-1/2 drop-shadow-2xl md:w-40 [.symbiote_&]:drop-shadow-[0_0_16px_rgba(255,255,255,0.55)]" />
      </div>
    </div>
  )
}
