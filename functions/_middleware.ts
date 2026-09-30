// One canonical address: erikkarasek.cz.
//
// The site answers on three hostnames — the custom domain, its www, and the project's own
// erik-karasek.pages.dev, which CVs sent before the move still point at. Serving the same
// pages on all three splits search ranking and link previews between them, so the other two
// send a permanent redirect here, keeping the path and query.
//
// Matched exactly, not by suffix: preview deployments live on <hash>.erik-karasek.pages.dev
// and must keep working on their own address.

const CANONICAL = 'erikkarasek.cz'
const REDIRECT_FROM = new Set(['www.erikkarasek.cz', 'erik-karasek.pages.dev'])

// Short addresses on this domain for apps that live on a Worker of their own. LinkedIn refuses
// *.workers.dev and *.pages.dev links in a profile (Featured, Projects), the same reason the site
// moved to erikkarasek.cz in the first place, so anything meant to be linked from there gets an
// address here. 302, not 301: the target can move, and a permanent redirect would stick in caches.
const SHORTCUTS: Record<string, string> = {
  '/reels': 'https://github-reels.erikkarasek2005.workers.dev',
  '/board': 'https://job-tracker-10s.pages.dev',
}

export const onRequest = async ({ request, next }: { request: Request; next: () => Promise<Response> }) => {
  const url = new URL(request.url)
  if (REDIRECT_FROM.has(url.hostname)) {
    url.hostname = CANONICAL
    return Response.redirect(url.toString(), 301)
  }
  const target = SHORTCUTS[url.pathname.replace(/\/$/, '')]
  if (target) return Response.redirect(target, 302)
  return next()
}
