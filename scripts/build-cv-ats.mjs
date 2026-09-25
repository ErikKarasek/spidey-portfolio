// The same CV as build-cv.mjs, in the shape a résumé parser can read: public/cv/*-ats.pdf.
// Usage: npm run cv:ats   (needs Google Chrome; set CHROME to override its path)
//
// Why a second file at all. The designed CV is two columns with a sidebar, and that is exactly
// what breaks automated screening: Chrome writes the text in a different order than it is read,
// so a parser that takes the content stream as it comes pairs a role with the next job's
// employer, and one that sorts by position glues each experience line to whatever sits beside it
// in the sidebar. Colour has nothing to do with it — a parser reads the text layer, not the look.
//
// So this version is one column, top to bottom, with no photo, no QR code, no chips and no
// letter-spacing (wide tracking makes "SILNÉ STRÁNKY" extract as "S I L N É S T RÁ N KY").
// Same facts, same file names plus `-ats`. Send the pretty one to a human, upload this one to a
// portal that asks for a file and never shows it to anyone until a keyword matches.
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'
import { cv, PHONE } from './cv/content.mjs'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function html(d) {
  const contact = [PHONE, d.email, d.city, d.github, d.web].filter(Boolean).map(esc).join(' | ')
  const list = (points) => `<ul>${points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`
  const head = (label) => `<h2>${esc(label)}</h2>`
  // One line per fact, in the order a parser expects: what, where, when.
  const job = (j) => `<div class="item">
      <p class="role">${esc(j.role)}</p>
      <p class="meta">${esc(j.where)}</p>
      <p class="meta">${esc(j.when)}</p>
      ${list(j.points)}
    </div>`
  const project = (p) => `<div class="item">
      <p class="role">${esc(p.name)}${p.when ? ` (${esc(p.when)})` : ''}</p>
      <p class="meta">${esc(p.link)}${p.study ? ` | ${esc(d.studyLabel)}: ${esc(p.study)}` : ''}</p>
      ${list(p.points)}
    </div>`
  const pairs = (items) => `<ul>${items.map(([k, v]) => `<li><b>${esc(k)}:</b> ${esc(v)}</li>`).join('')}</ul>`

  return `<!doctype html><html lang="${d.lang ?? 'cs'}"><head><meta charset="utf-8"><title>${esc(d.name)} — ${esc(d.title)}</title>
<style>
  /* A font every reader has, plain black on white, nothing decorative. */
  @page { size: A4; margin: 14mm 15mm }
  * { box-sizing: border-box; margin: 0; padding: 0 }
  body { font: 10.5pt/1.42 Arial, Helvetica, sans-serif; color: #000 }
  h1 { font-size: 20pt; margin-bottom: 1.5mm }
  .title { font-size: 11pt; font-weight: bold; margin-bottom: 1.5mm }
  .contact { font-size: 10pt; margin-bottom: 5mm }
  h2 { font-size: 12pt; margin: 5mm 0 2mm; border-bottom: 1px solid #000; padding-bottom: .8mm }
  .item { margin-bottom: 3.4mm; break-inside: avoid }
  .role { font-weight: bold }
  .meta { font-size: 10pt }
  ul { margin: 1mm 0 0 5mm } li { margin: .4mm 0 }
  a { color: #000; text-decoration: none }
</style></head><body>
  <h1>${esc(d.name)}</h1>
  <p class="title">${esc(d.title)}</p>
  <p class="contact">${contact}</p>

  <section>${head(d.labels.profile)}<p>${esc(d.profile)}</p></section>
  <section>${head(d.labels.experience)}${d.jobs.map(job).join('')}</section>
  <section>${head(d.labels.projects)}${d.projects.map(project).join('')}</section>
  <section>${head(d.labels.skills)}${pairs(d.skills)}</section>
  <section>${head(d.labels.tech)}<p>${d.tech.map(esc).join(', ')}</p></section>
  <section>${head(d.labels.education)}${d.education
    .map((e) => `<div class="item"><p class="role">${esc(e.what)}</p><p class="meta">${esc(e.where)}, ${esc(e.when)}</p></div>`)
    .join('')}</section>
  <section>${head(d.labels.other)}${pairs(d.other)}</section>
  <section>${head(d.labels.strengths)}${pairs(d.strengths)}</section>
</body></html>`
}

mkdirSync('public/cv', { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
for (const d of Object.values(cv)) {
  const page = await browser.newPage()
  await page.setContent(html(d), { waitUntil: 'load' })
  const out = d.file.replace(/\.pdf$/, '-ats.pdf')
  await page.pdf({ path: `public/cv/${out}`, format: 'A4', printBackground: false })
  await page.close()
  console.log(`public/cv/${out}`)
}
await browser.close()
