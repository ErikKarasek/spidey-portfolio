// Cloudflare Pages function → POST /api/contact
// Checks the Turnstile token, then hands the message to FormSubmit. The form only posts here once a
// site key is set in src/content.ts; without one it talks to FormSubmit directly, as it always did.
import { profile } from '../../src/content'

type Env = { TURNSTILE_SECRET?: string }
type Body = { name?: string; email?: string; message?: string; subject?: string; token?: string }

const VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const body = (await request.json().catch(() => ({}))) as Body

  // No secret configured yet: refuse rather than quietly forwarding unverified messages.
  if (!env.TURNSTILE_SECRET) return Response.json({ success: 'false', message: 'Spam protection is not configured.' }, { status: 503 })

  const form = new FormData()
  form.append('secret', env.TURNSTILE_SECRET)
  form.append('response', body.token ?? '')
  const ip = request.headers.get('CF-Connecting-IP')
  if (ip) form.append('remoteip', ip)

  const check = (await fetch(VERIFY, { method: 'POST', body: form })
    .then((r) => r.json())
    .catch(() => ({ success: false }))) as { success?: boolean }
  if (!check.success) return Response.json({ success: 'false', message: 'Spam check failed. Please try again.' }, { status: 400 })

  const relayed = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: body.name ?? '',
      email: body.email ?? '',
      message: body.message ?? '',
      _subject: body.subject ?? 'Portfolio message',
      _template: 'table',
    }),
  })
  // FormSubmit's own answer (including the one-time "activate the form" notice) goes back untouched.
  return new Response(await relayed.text(), { status: relayed.status, headers: { 'Content-Type': 'application/json' } })
}
