// Cloudflare Pages function → GET /api/youtube
import { getClips, type Clip } from '../../server/youtube'

// The channel changes a few times a month: keep the list for an hour per worker instance so repeated
// requests never hammer YouTube's feed.
let cached: { at: number; body: Clip[] } | null = null
const TTL = 3_600_000

export const onRequestGet = async () => {
  if (!cached || Date.now() - cached.at > TTL) {
    const clips = await getClips()
    // Don't pin an empty list for an hour just because the feed hiccuped once.
    if (clips.length || !cached) cached = { at: clips.length ? Date.now() : Date.now() - TTL + 60_000, body: clips }
  }
  return Response.json(cached.body, { headers: { 'Cache-Control': 'public, max-age=3600' } })
}
