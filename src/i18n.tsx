import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { content, type Lang } from './content'

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void } | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'cs' || saved === 'en') return saved
  } catch {
    // storage blocked — fall through to the browser language
  }
  return /^(cs|sk)/i.test(navigator.language) ? 'cs' : 'en'
}

type Meta = Record<Lang, { title: string; description: string }>

/** `meta` lets a second page (the case study) keep its own title and description when the language changes. */
export function LangProvider({ children, meta }: { children: ReactNode; meta?: Meta }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    const page = meta?.[lang] ?? content[lang].meta
    document.documentElement.lang = lang
    document.title = page.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', page.description)
    try {
      localStorage.setItem('lang', lang)
    } catch {
      // not persisted — fine
    }
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return { ...ctx, t: content[ctx.lang] }
}
