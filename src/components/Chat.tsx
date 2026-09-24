import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLang } from '../i18n'

// Talks to functions/api/chat.ts, which answers from the site's own text on Workers AI.
const ENDPOINT = '/api/chat'

// `failed` replies are shown but never sent back as context.
type Message = { role: 'user' | 'assistant'; content: string; failed?: boolean }

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12Z" />
    </svg>
  )
}

export function Chat() {
  const { t } = useLang()
  const c = t.chat
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const list = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function ask(question: string) {
    const q = question.trim()
    if (!q || busy) return
    const next: Message[] = [...messages, { role: 'user', content: q }]
    setMessages(next)
    setDraft('')
    setBusy(true)
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.filter((m) => !m.failed).map(({ role, content }) => ({ role, content })) }),
      })
      const data = (await res.json().catch(() => ({}))) as { answer?: string }
      setMessages([...next, res.ok && data.answer ? { role: 'assistant', content: data.answer } : { role: 'assistant', content: c.failed, failed: true }])
    } catch {
      setMessages([...next, { role: 'assistant', content: c.failed, failed: true }])
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void ask(draft)
  }

  const bubble = 'max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed'

  return (
    <div data-no-web className="fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <section
          role="dialog"
          aria-label={c.title}
          className="flex h-[min(34rem,calc(100dvh-6rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[6px_6px_0_var(--color-band-dark)]"
        >
          <header className="flex items-center justify-between bg-accent px-4 py-3 text-accent-ink">
            <h2 className="text-sm font-black uppercase italic tracking-wider">{c.title}</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label={c.close} className="rounded-full p-1 transition-opacity hover:opacity-70">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div ref={list} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite">
            <p className={`${bubble} self-start bg-surface-2 text-ink-2`}>{c.intro}</p>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {c.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void ask(s)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) =>
              m.role === 'user' ? (
                <p key={i} className={`${bubble} self-end bg-accent text-accent-ink`}>{m.content}</p>
              ) : (
                <p key={i} className={`${bubble} self-start bg-surface-2 text-ink`}>{m.content}</p>
              ),
            )}
            {busy && <p className={`${bubble} self-start animate-pulse bg-surface-2 text-mute`}>{c.thinking}</p>}
          </div>

          <form onSubmit={onSubmit} className="border-t border-line p-3">
            <div className="flex gap-2">
              <input
                ref={input}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={500}
                placeholder={c.placeholder}
                aria-label={c.placeholder}
                className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-mute-2 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                className="rounded-xl bg-accent px-4 py-2 text-xs font-black uppercase tracking-wider text-accent-ink transition-opacity disabled:opacity-40"
              >
                {c.send}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-mute">{c.note}</p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? c.close : c.open}
        className="flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-black uppercase italic tracking-wider text-accent-ink shadow-[4px_4px_0_var(--color-band-dark)] transition-transform hover:-translate-y-0.5"
      >
        <ChatIcon className="h-5 w-5" />
        <span className="hidden sm:inline">{c.open}</span>
      </button>
    </div>
  )
}
