// Latest uploads from the YouTube channel's public RSS feed. Shared by the Vite dev server and the
// Cloudflare Pages function at /api/youtube (YouTube sends no CORS headers, so the browser can't read it).

export type Clip = { id: string; title: string; published: string }

const CHANNEL_ID = 'UCLxpYwapavqjQy9vtq5KM3g'

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

export async function getClips(limit = 4): Promise<Clip[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) return []
    const xml = await res.text()
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .map(([, entry]) => ({
        id: entry.match(/<yt:videoId>([^<]+)</)?.[1] ?? '',
        title: decode(entry.match(/<title>([^<]*)</)?.[1] ?? ''),
        published: entry.match(/<published>([^<]+)</)?.[1] ?? '',
      }))
      .filter((c) => c.id)
      .sort((a, b) => b.published.localeCompare(a.published))
      .slice(0, limit)
  } catch {
    return []
  }
}
