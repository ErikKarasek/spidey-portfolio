import { Downloads } from '../components/Downloads'
import { useLang } from '../i18n'
import { useSuit, useSymbiote } from '../theme'
import { studies, type StudySlug } from './content'

/** A project case study (its own page at /<slug>/), sharing the site's look and both languages. */
export function CaseStudy({ slug }: { slug: StudySlug }) {
  const { lang, setLang } = useLang()
  const c = studies[slug][lang]
  const suit = useSuit()
  const symbiote = useSymbiote()

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <a href="/" className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-ink transition-colors hover:text-accent">
            <span aria-hidden>←</span>
            {c.back}
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'cs' ? 'en' : 'cs')}
              className="flex h-8 items-center rounded-full border border-line px-1 text-[10px] font-black uppercase tracking-wider"
              aria-label="Language"
            >
              {(['cs', 'en'] as const).map((l) => (
                <span key={l} className={`rounded-full px-2 py-1 transition-colors ${lang === l ? 'bg-accent text-accent-ink' : 'text-mute-2'}`}>
                  {l}
                </span>
              ))}
            </button>
            <button
              onClick={symbiote.toggle}
              aria-label="Symbiote mode"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <img src={suit('/img/spidey-band.webp')} alt="" className="suit-img h-4 w-4 object-contain" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <section className="border-b border-line py-14 md:py-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent md:text-xs">{c.label}</span>
          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-tighter text-ink [text-shadow:3px_3px_0_var(--color-accent-soft)] md:text-6xl">{c.title}</h1>
          <p className="mt-5 max-w-2xl text-sm font-medium leading-relaxed text-ink-3 md:text-base">{c.lead}</p>
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {c.stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-surface-2/90 p-4">
                <dt className="text-2xl font-black italic tracking-tight text-accent md:text-3xl">{s.value}</dt>
                <dd className="mt-1 text-[10px] font-bold uppercase tracking-wider text-mute md:text-xs">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Section heading={c.problem.heading}>
          {c.problem.body.map((p) => (
            <p key={p} className="max-w-2xl text-sm font-medium leading-relaxed text-ink-3 md:text-base">
              {p}
            </p>
          ))}
        </Section>

        <Section heading={c.shotsHeading}>
          <div className="flex flex-col gap-12">
            {c.shots.map((s) => (
              <figure key={s.src}>
                <div className="overflow-hidden rounded-2xl border border-line bg-black shadow-[0_10px_30px_rgb(var(--glow)/0.12)]">
                  <img src={s.src} alt={s.title} loading="lazy" width={1600} height={1029} className="h-auto w-full" />
                </div>
                <figcaption className="mt-3">
                  <strong className="text-sm font-black uppercase tracking-tight text-ink md:text-base">{s.title}</strong>
                  <p className="mt-1 max-w-2xl text-sm font-medium leading-relaxed text-ink-3">{s.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section heading={c.build.heading}>
          <Cards items={c.build.items} />
        </Section>

        <Section heading={c.decisions.heading}>
          <Cards items={c.decisions.items} />
        </Section>

        <Section heading={c.status.heading}>
          {c.status.body.map((p) => (
            <p key={p} className="max-w-2xl text-sm font-medium leading-relaxed text-ink-3 md:text-base">
              {p}
            </p>
          ))}
        </Section>

        <section className="mt-14 rounded-2xl border border-line bg-surface-2/90 p-8 text-center">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-ink md:text-3xl">{c.cta.text}</h2>
          <div className="mx-auto mt-6 max-w-sm text-left">
            {c.cta.href ? (
              <a
                href={c.cta.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-accent bg-accent px-4 py-3 text-xs font-bold uppercase tracking-wider text-accent-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_8px_20px_rgb(var(--glow)/0.3)]"
              >
                {c.cta.button}
                <span aria-hidden>↗</span>
              </a>
            ) : (
              <Downloads />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line py-12 md:py-16">
      <h2 className="mb-6 text-2xl font-black italic uppercase tracking-tighter text-ink md:text-4xl">
        {heading}
        <span className="mt-2 block h-1 w-12 rounded-full bg-accent" />
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Cards({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-line bg-surface-2/90 p-6 transition-colors hover:border-accent">
          <h3 className="text-base font-black uppercase tracking-tight text-ink">{item.title}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink-3">{item.text}</p>
        </div>
      ))}
    </div>
  )
}
