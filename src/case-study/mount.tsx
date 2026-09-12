import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import '../index.css'
import { LangProvider } from '../i18n'
import { CaseStudy } from './CaseStudy'
import { studies, type StudySlug } from './content'

/** Every case study page is this same app with a different slug. */
export function mountCaseStudy(slug: StudySlug) {
  const study = studies[slug]
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LangProvider meta={{ cs: study.cs.meta, en: study.en.meta }}>
        <CaseStudy slug={slug} />
      </LangProvider>
    </StrictMode>,
  )
}
