// Cloudflare Pages function → POST /api/contact
// Checks the Turnstile token, then sends the message through Resend.
//
// This used to relay to FormSubmit, which needs its form activated by a link it e-mails on the
// first submission. That e-mail never reached the centrum.cz inbox, so the form never left the
// "waiting for activation" state, and its own rate limit kicked in on retries. Resend is already
// what Subscription Tracker sends with, and sending from the verified erikkarasek.cz domain is far
// more likely to get past a Czech mailbox's spam filter than a relay service is.
import { profile } from '../../src/content'

type Env = {
  TURNSTILE_SECRET?: string
  RESEND_API_KEY?: string
  /** Sender address. Needs a domain verified in Resend; see CONTACT_FROM below for the default. */
  CONTACT_FROM?: string
}
type Body = { name?: string; email?: string; message?: string; subject?: string; token?: string }

const VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const CONTACT_FROM = 'Portfolio <formular@erikkarasek.cz>'

// Generous for a contact message, small enough that the endpoint can't be used to mail out novels.
const MAX = { name: 200, email: 320, message: 10_000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fail = (message: string, status: number) => Response.json({ success: 'false', message }, { status })

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const body = (await request.json().catch(() => ({}))) as Body

  // Not configured: refuse, rather than accept a message that goes nowhere.
  if (!env.TURNSTILE_SECRET || !env.RESEND_API_KEY) return fail('The contact form is not configured.', 503)

  const name = (body.name ?? '').trim()
  const email = (body.email ?? '').trim()
  const message = (body.message ?? '').trim()
  if (!email || !message) return fail('E-mail and message are required.', 400)
  if (!EMAIL.test(email) || email.length > MAX.email) return fail('That e-mail address does not look right.', 400)
  if (name.length > MAX.name || message.length > MAX.message) return fail('The message is too long.', 400)

  const form = new FormData()
  form.append('secret', env.TURNSTILE_SECRET)
  form.append('response', body.token ?? '')
  const ip = request.headers.get('CF-Connecting-IP')
  if (ip) form.append('remoteip', ip)

  const check = (await fetch(VERIFY, { method: 'POST', body: form })
    .then((r) => r.json())
    .catch(() => ({ success: false }))) as { success?: boolean }
  if (!check.success) return fail('Spam check failed. Please try again.', 400)

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || CONTACT_FROM,
      to: [profile.email],
      // Replying in the mail client answers the visitor, not the no-reply sender.
      reply_to: email,
      subject: (body.subject || `Message from ${name || email}`).slice(0, 200),
      text: `${message}\n\n—\n${name ? `${name} · ` : ''}${email}\nSent from the contact form on erikkarasek.cz`,
    }),
  })

  if (!sent.ok) {
    // The details are for the logs; the visitor only needs to know it didn't go through.
    console.error('[contact] Resend refused', sent.status, await sent.text().catch(() => ''))
    return fail('The message could not be sent. Please try again later.', 502)
  }
  return Response.json({ success: 'true' })
}
