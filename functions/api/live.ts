// Cloudflare Pages function → GET /api/live  (add ?debug=1 to see the upstream HTTP statuses)
import { getLiveStatus, probeSources, type LiveStatus } from '../../server/live'

// Remember the answer for a minute per worker instance, so a flood of requests can't turn into a
// flood of calls to Twitch/Kick (and get the site rate-limited there).
let cached: { at: number; body: LiveStatus } | null = null
const TTL = 60_000

export const onRequestGet = async ({ request }: { request: Request }) => {
  const debug = new URL(request.url).searchParams.has('debug')
  if (debug) {
    const body = { ...(await getLiveStatus()), upstream: await probeSources() }
    return Response.json(body, { headers: { 'Cache-Control': 'no-store' } })
  }
  if (!cached || Date.now() - cached.at > TTL) cached = { at: Date.now(), body: await getLiveStatus() }
  return Response.json(cached.body, { headers: { 'Cache-Control': 'public, max-age=60' } })
}
