import { useSyncExternalStore, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { playSymbiote } from './sound'

// Symbiote mode = the black suit. index.html applies the saved choice before first paint.

// Every Spider-Man picture has a black-suit twin in public/img/symbiote/ (built by scripts/symbiote.sh).
const HERO = ['/img/hero-mask.webp', '/img/hero-face.webp']
const SUITS = [...HERO, '/img/spidey-hang.webp', '/img/spidey-stand.webp', '/img/spidey-band.webp', '/img/me-suit.webp']
const blackSuit = (src: string) => (SUITS.includes(src) ? src.replace('/img/', '/img/symbiote/') : src)

const listeners = new Set<() => void>()
const read = () => document.documentElement.classList.contains('symbiote')
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => void listeners.delete(listener)
}

function setSymbiote(on: boolean) {
  document.documentElement.classList.toggle('symbiote', on)
  try {
    localStorage.setItem('symbiote', on ? '1' : '0')
  } catch {
    // not persisted, fine
  }
  listeners.forEach((l) => l())
}

export const useIsSymbiote = () => useSyncExternalStore(subscribe, read)

// Without a choice of their own, visitors get the suit their system is set to (index.html does the
// same before first paint). Once they pick a suit, the system stops deciding for them.
if (typeof matchMedia !== 'undefined') {
  const dark = matchMedia('(prefers-color-scheme: dark)')
  dark.addEventListener('change', (e) => {
    try {
      if (localStorage.getItem('symbiote') !== null) return
    } catch {
      // storage blocked: no saved choice to respect either
    }
    void preloadSuit(e.matches).then(() => {
      document.documentElement.classList.toggle('symbiote', e.matches)
      listeners.forEach((l) => l())
    })
  })
}

/** Returns a function mapping a Spider-Man image to the suit currently worn. */
export function useSuit() {
  const on = useIsSymbiote()
  return (src: string) => (on ? blackSuit(src) : src)
}

/** Loads and decodes one suit's pictures (or just the hero pair) so switching never flashes half-loaded images. */
export function preloadSuit(symbiote: boolean, heroOnly = false) {
  return Promise.all(
    (heroOnly ? HERO : SUITS).map((src) => {
      const img = new Image()
      img.src = symbiote ? blackSuit(src) : src
      return img.decode().catch(() => {})
    }),
  )
}

/** Switches suits; the black one spreads out from (x, y) like the symbiote taking over. */
export async function switchSuit(next: boolean, x = innerWidth / 2, y = innerHeight / 2) {
  playSymbiote(next)
  await preloadSuit(next)
  const apply = () => flushSync(() => setSymbiote(next))
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduced) return apply()

  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(apply)
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 800, easing: 'cubic-bezier(0.7, 0, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  })
}

export function useSymbiote() {
  const on = useIsSymbiote()
  const toggle = (e: MouseEvent) => switchSuit(!on, e.clientX, e.clientY)
  return { on, toggle }
}
