import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import '../index.css'
import { LangProvider } from '../i18n'
import { CaseStudy } from './CaseStudy'
import { caseStudy } from './content'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider meta={{ cs: caseStudy.cs.meta, en: caseStudy.en.meta }}>
      <CaseStudy />
    </LangProvider>
  </StrictMode>,
)
