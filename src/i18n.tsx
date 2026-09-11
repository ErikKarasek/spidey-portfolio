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

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = content[lang].meta.title
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
