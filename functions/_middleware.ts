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

export const onRequest = async ({ request, next }: { request: Request; next: () => Promise<Response> }) => {
  const url = new URL(request.url)
  if (REDIRECT_FROM.has(url.hostname)) {
    url.hostname = CANONICAL
    return Response.redirect(url.toString(), 301)
  }
  return next()
}
