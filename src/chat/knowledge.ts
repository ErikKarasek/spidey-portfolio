// What the chat assistant (functions/api/chat.ts) knows: the site's own text, flattened.
//
// Built from src/content.ts and the case studies rather than written out a second time, so a
// change to the site is a change to what the assistant says. Only the Czech copy goes in: the
// English is the same facts, and doubling it would double what every question costs.
import { content, profile, socials } from '../content'
import { studies, type StudySlug } from '../case-study/content'

const cs = content.cs

const lines = (items: string[]) => items.map((i) => `- ${i}`).join('\n')

const about = cs.about.paragraphs.join('\n')

const experience = cs.experience.items
  .map((j) => `### ${j.role}, ${j.company} (${j.when})\n${lines(j.points)}`)
  .join('\n\n')

const skills = lines(cs.skills.items.map((s) => `${s.name} (${s.category}): ${s.level}`))

const projects = cs.projects.items
  .map((p) => {
    const slug = p.study?.replaceAll('/', '') as StudySlug | undefined
    const study = slug ? studies[slug]?.cs : undefined
    const where = [p.link && `Odkaz: ${p.link}`, p.study && `Případová studie: https://erikkarasek.cz${p.study}`]
      .filter(Boolean)
      .join('\n')
    const detail = study
      ? [
          study.lead,
          study.problem.body.join(' '),
          `Jak je postavený:\n${lines(study.build.items.map((b) => `${b.title}: ${b.text}`))}`,
          `Stav: ${study.status.body.join(' ')}`,
        ].join('\n')
      : ''
    return `### ${p.title}\n${p.description}\nTechnologie: ${p.tags.join(', ')}\n${where}\n${detail}`.trim()
  })
  .join('\n\n')

export const knowledge = `# Erik Karásek
E-mail: ${profile.email}
GitHub: ${profile.github}
Web: https://erikkarasek.cz (kontaktní formulář je dole na stránce)
Životopis: https://erikkarasek.cz${cs.hero.cvHref}
Sítě: ${socials.map((s) => `${s.label} ${s.href}`).join(', ')}

## O mně
${about}
Certifikáty: ${cs.about.certs.items.map((c) => `${c.title} (${c.subtitle})`).join(', ')}

## Zkušenosti
${experience}

## Dovednosti
${skills}

## Projekty
${projects}`
