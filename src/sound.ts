import { useSyncExternalStore } from 'react'

// All sounds are synthesised with the Web Audio API: no audio files, nothing to license or download.
// Browsers only allow audio after a user gesture, and every sound here is triggered by one.

let ctx: AudioContext | null = null
let master: GainNode | null = null

function audio() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.35
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return { c: ctx, out: master! }
}

// ── mute switch (remembered) ────────────────────────────────────────────────
const listeners = new Set<() => void>()
let muted = (() => {
  try {
    return localStorage.getItem('muted') === '1'
  } catch {
    return false
  }
})()

export function setMuted(next: boolean) {
  muted = next
  try {
    localStorage.setItem('muted', next ? '1' : '0')
  } catch {
    // not persisted, fine
  }
  listeners.forEach((l) => l())
}

export const useMuted = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => void listeners.delete(l)
    },
    () => muted,
  )

// ── building blocks ─────────────────────────────────────────────────────────
function noise(c: AudioContext, seconds: number) {
  const buffer = c.createBuffer(1, Math.ceil(seconds * c.sampleRate), c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  return src
}

/** Gain node with a fast attack and an exponential fade — the envelope every sound here uses. */
function envelope(c: AudioContext, t: number, peak: number, attack: number, release: number) {
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release)
  return g
}

// ── the sounds ──────────────────────────────────────────────────────────────

/** "Thwip!": a hiss of web fluid swept down through a band-pass, plus a quick zip. */
export function playThwip() {
  if (muted) return
  const { c, out } = audio()
  const t = c.currentTime

  const hiss = noise(c, 0.25)
  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.Q.value = 1.4
  band.frequency.setValueAtTime(4500, t)
  band.frequency.exponentialRampToValueAtTime(650, t + 0.18)
  hiss.connect(band).connect(envelope(c, t, 0.55, 0.008, 0.19)).connect(out)
  hiss.start(t)
  hiss.stop(t + 0.25)

  const zip = c.createOscillator()
  zip.type = 'triangle'
  zip.frequency.setValueAtTime(1900 + Math.random() * 300, t)
  zip.frequency.exponentialRampToValueAtTime(240, t + 0.12)
  zip.connect(envelope(c, t, 0.16, 0.006, 0.13)).connect(out)
  zip.start(t)
  zip.stop(t + 0.16)
}

/** The symbiote: a low growl that sinks when it takes over and rises when it lets go. */
export function playSymbiote(takingOver: boolean) {
  if (muted) return
  const { c, out } = audio()
  const t = c.currentTime

  const low = c.createBiquadFilter()
  low.type = 'lowpass'
  low.frequency.setValueAtTime(takingOver ? 900 : 300, t)
  low.frequency.exponentialRampToValueAtTime(takingOver ? 180 : 1100, t + 0.7)
  const env = envelope(c, t, 0.5, 0.06, 0.75)
  low.connect(env).connect(out)

  for (const detune of [-12, 0, 9]) {
    const o = c.createOscillator()
    o.type = 'sawtooth'
    o.detune.value = detune
    o.frequency.setValueAtTime(takingOver ? 95 : 48, t)
    o.frequency.exponentialRampToValueAtTime(takingOver ? 42 : 105, t + 0.8)
    o.connect(low)
    o.start(t)
    o.stop(t + 0.9)
  }

  const rumble = noise(c, 0.9)
  const rumbleFilter = c.createBiquadFilter()
  rumbleFilter.type = 'lowpass'
  rumbleFilter.frequency.value = 260
  rumble.connect(rumbleFilter).connect(envelope(c, t, 0.35, 0.05, 0.8)).connect(out)
  rumble.start(t)
  rumble.stop(t + 0.9)
}

/** A whoosh that rises and falls, for Spider-Man swinging past. */
export function playSwoosh(seconds = 2.2) {
  if (muted) return
  const { c, out } = audio()
  const t = c.currentTime
  const air = noise(c, seconds)
  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.Q.value = 0.9
  band.frequency.setValueAtTime(300, t)
  band.frequency.exponentialRampToValueAtTime(1800, t + seconds / 2)
  band.frequency.exponentialRampToValueAtTime(300, t + seconds)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.4, t + seconds / 2)
  g.gain.exponentialRampToValueAtTime(0.0001, t + seconds)
  air.connect(band).connect(g).connect(out)
  air.start(t)
  air.stop(t + seconds)
}
