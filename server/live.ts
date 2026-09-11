// Shared by the Vite dev server and the Cloudflare Pages function at /api/live.
// Kick's API has no CORS headers, so the browser can't ask it directly.

export type LiveStatus = { twitch: boolean; kick: boolean }

const CHANNEL = 'erickos007'

/** Upstream HTTP status per source (0 = network error) — `/api/live?debug=1` shows it, to tell "offline" from "blocked". */
export async function probeSources(): Promise<Record<'twitch' | 'kick', number>> {
  const status = (url: string, init?: RequestInit) =>
    fetch(url, { ...init, signal: AbortSignal.timeout(6000) }).then((r) => r.status, () => 0)
  const [twitch, kick] = await Promise.all([
    status(`https://decapi.me/twitch/uptime/${CHANNEL}`),
    status(`https://kick.com/api/v2/channels/${CHANNEL}`, { headers: { Accept: 'application/json', 'User-Agent': UA } }),
  ])
  return { twitch, kick }
}
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'

async function twitchLive(): Promise<boolean> {
  try {
    const res = await fetch(`https://decapi.me/twitch/uptime/${CHANNEL}`, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) return false
    // Live → an uptime like "1 hour, 4 minutes"; otherwise "erickos007 is offline" or an error message.
    return !/offline|not found|error|invalid/i.test(await res.text())
  } catch {
    return false
  }
}

async function kickLive(): Promise<boolean> {
  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${CHANNEL}`, {
      headers: { Accept: 'application/json', 'User-Agent': UA },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { livestream?: { is_live?: boolean } | null }
    return !!data.livestream && data.livestream.is_live !== false
  } catch {
    return false
  }
}

export async function getLiveStatus(): Promise<LiveStatus> {
  const [twitch, kick] = await Promise.all([twitchLive(), kickLive()])
  return { twitch, kick }
}
