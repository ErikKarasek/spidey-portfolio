import { useEffect, useState } from 'react'
import type { LiveStatus } from '../server/live'

export type { LiveStatus }

/** Polls /api/live once a minute. `?live=twitch` or `?live=kick` in the URL fakes it for testing. */
export function useLive(): LiveStatus {
  const [status, setStatus] = useState<LiveStatus>({ twitch: false, kick: false })

  useEffect(() => {
    const fake = new URLSearchParams(location.search).get('live')
    if (fake) return setStatus({ twitch: fake.includes('twitch'), kick: fake.includes('kick') })

    let alive = true
    const load = () =>
      fetch('/api/live')
        .then((r) => (r.ok ? r.json() : null))
        .then((d: LiveStatus | null) => alive && d && setStatus({ twitch: !!d.twitch, kick: !!d.kick }))
        .catch(() => {})
    load()
    const id = setInterval(load, 60_000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  return status
}
