import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
// Photo slots swap in a PNG instead of the SVG mask, so some selectors legitimately match nothing.
gsap.config({ nullTargetWarn: false })

// "Reduce motion" in the OS: keep the one-off entrances, but everything that loops forever
// (spinning webs, racing tapes, swinging Spideys, bobbing pills) settles straight into its end pose.
export const reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

if (reducedMotion) {
  const settle = (vars?: gsap.TweenVars) => (vars?.repeat === -1 ? { ...vars, repeat: 0, yoyo: false, duration: 0, delay: 0 } : vars)
  const to = gsap.to.bind(gsap)
  const fromTo = gsap.fromTo.bind(gsap)
  gsap.to = ((targets: gsap.TweenTarget, vars: gsap.TweenVars) => to(targets, settle(vars)!)) as typeof gsap.to
  gsap.fromTo = ((targets: gsap.TweenTarget, from: gsap.TweenVars, vars: gsap.TweenVars) => fromTo(targets, from, settle(vars)!)) as typeof gsap.fromTo
}

export { gsap, ScrollTrigger, useGSAP }
