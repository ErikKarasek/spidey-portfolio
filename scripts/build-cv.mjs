// Renders scripts/cv/content.mjs into A4 PDFs in public/cv/ (Czech + English) with the site's look.
// Usage: npm run cv   (needs Google Chrome installed; set CHROME to override its path)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'
import QRCode from 'qrcode'
import { cv, PHONE } from './cv/content.mjs'


const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Scans straight to the portfolio from a printed copy.
const QR = await QRCode.toString('https://erik-karasek.pages.dev', { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#111827', light: '#0000' } })

function html(d) {
  const photo = `data:image/jpeg;base64,${readFileSync(d.photo).toString('base64')}`
  // Real <a href>s, so Chrome writes link annotations into the PDF. Without them every
  // address in the CV was dead text — which is the only reason a Word copy was ever needed.
  const url = (v) => (/^https?:\/\//.test(v) ? v : `https://${v}`)
  const a = (label, href) => `<a href="${esc(href)}">${esc(label)}</a>`
  const contact = [
    PHONE && esc(PHONE),
    a(d.email, `mailto:${d.email}`),
    esc(d.city),
    a(d.github, url(d.github)),
    a(d.web, url(d.web)),
  ].filter(Boolean).join('<i>·</i>')
  const head = (label) => `<h2><span></span>${esc(label)}</h2>`
  const pair = ([k, v]) => `<div class="pair"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`
  const list = (points) => `<ul>${points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`

  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 12mm 13mm 11mm }
  * { box-sizing: border-box; margin: 0; padding: 0 }
  body { font: 500 9.4pt/1.38 Outfit, sans-serif; color: #1f2937; -webkit-print-color-adjust: exact; print-color-adjust: exact }
  .page { padding: 1mm 1mm 0 }
  header { display: flex; align-items: center; gap: 9mm; padding-bottom: 6mm; border-bottom: 2px solid #a31515; }
  .photo { width: 34mm; height: 34mm; border-radius: 50%; border: 1.6mm solid #a31515; padding: 1mm; background: #fff; flex: none; box-shadow: 0 0 6mm rgba(163,21,21,.25) }
  .photo img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block }
  .qr { margin-left: auto; flex: none; text-align: center } .qr svg { width: 22mm; height: 22mm; display: block }
  .qr span { display: block; margin-top: 1.4mm; font-size: 7pt; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #a31515 }
  h1 { font-size: 30pt; line-height: .95; font-weight: 900; font-style: italic; text-transform: uppercase; letter-spacing: -.03em; color: #111827; text-shadow: 1.2pt 1.2pt 0 #ef4444, 2.2pt 2.2pt 0 #a31515 }
  .title { margin-top: 2.5mm; font-size: 10pt; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #a31515 }
  .contact { margin-top: 2.5mm; font-size: 8.6pt; color: #4b5563; font-weight: 600 }
  a { color: inherit; text-decoration: none }
  .contact i { font-style: normal; color: #a31515; margin: 0 1.6mm }
  .cols { display: grid; grid-template-columns: 1fr 62mm; gap: 8mm; margin-top: 6mm }
  h2 { display: flex; align-items: center; gap: 2mm; font-size: 8.6pt; font-weight: 800; letter-spacing: .22em; text-transform: uppercase; color: #a31515; margin: 4.2mm 0 2.2mm }
  h2 span { width: 3mm; height: 2.2mm; background: #a31515; border-radius: .4mm }
  section:first-child h2 { margin-top: 0 }
  .profile { color: #374151 }
  .item { margin-bottom: 3.0mm; break-inside: avoid }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 3mm }
  .role { font-weight: 900; font-size: 10.2pt; text-transform: uppercase; letter-spacing: -.01em; color: #111827 }
  .when { font-size: 8pt; font-weight: 700; color: #a31515; white-space: nowrap }
  .where { font-size: 8.4pt; color: #6b7280; font-weight: 600; margin: .3mm 0 1.2mm }
  ul { padding-left: 3.6mm } li { margin: .5mm 0 } li::marker { color: #a31515 }
  aside { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 3mm; padding: 5mm 4.5mm; align-self: start; -webkit-box-decoration-break: clone; box-decoration-break: clone }
  aside h2 { letter-spacing: .16em }
  .pair { break-inside: avoid }
  .chips { display: flex; flex-wrap: wrap; gap: 1.4mm }
  .chips b { font-size: 7.8pt; font-weight: 700; color: #a31515; background: #fff; border: 1px solid rgba(163,21,21,.3); border-radius: 1.6mm; padding: .7mm 2mm }
  dl dt { font-weight: 800; color: #111827; font-size: 8.8pt } dl dd { color: #4b5563; font-size: 8.4pt; margin-bottom: 1.8mm }
  .edu { margin-bottom: 2.4mm } .edu b { display: block; font-size: 8.8pt; color: #111827 } .edu span { display: block; font-size: 8.2pt; color: #6b7280 }
</style></head><body><div class="page">
  <header>
    <div class="photo"><img src="${photo}"></div>
    <div>
      <h1>${esc(d.name)}.</h1>
      <p class="title">${esc(d.title)}</p>
      <p class="contact">${contact}</p>
    </div>
    <div class="qr">${QR}<span>${esc(d.labels.qr)}</span></div>
  </header>
  <div class="cols">
    <main>
      <section>${head(d.labels.profile)}<p class="profile">${esc(d.profile)}</p></section>
      <section>${head(d.labels.experience)}${d.jobs
        .map((j) => `<div class="item"><div class="row"><span class="role">${esc(j.role)}</span><span class="when">${esc(j.when)}</span></div><p class="where">${esc(j.where)}</p>${list(j.points)}</div>`)
        .join('')}</section>
      <section>${head(d.labels.projects)}${d.projects
        .map(
          (p) =>
            `<div class="item"><div class="row"><span class="role">${esc(p.name)}</span><span class="when">${esc(p.when)}</span></div><p class="where">${a(p.link, url(p.link))}${
              // a project with a case study carries the link to it, so a reader can go one click deeper
              p.study ? ` <b>·</b> ${esc(d.studyLabel)}: ${a(p.study, url(p.study))}` : ''
            }</p>${list(p.points)}</div>`,
        )
        .join('')}</section>
    </main>
    <aside>
      <section>${head(d.labels.tech)}<div class="chips">${d.tech.map((t) => `<b>${esc(t)}</b>`).join('')}</div></section>
      <section>${head(d.labels.strengths)}<dl>${d.strengths.map(pair).join('')}</dl></section>
      <section>${head(d.labels.skills)}<dl>${d.skills.map(pair).join('')}</dl></section>
      <section>${head(d.labels.education)}${d.education.map((e) => `<div class="edu pair"><b>${esc(e.what)}</b><span>${esc(e.where)}</span><span>${esc(e.when)}</span></div>`).join('')}</section>
      <section>${head(d.labels.other)}<dl>${d.other.map(pair).join('')}</dl></section>
    </aside>
  </div>
</div></body></html>`
}

mkdirSync('public/cv', { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
for (const [lang, d] of Object.entries(cv)) {
  const page = await browser.newPage()
  await page.setContent(html(d), { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true })
  writeFileSync(`public/cv/${d.file}`, pdf)
  if (process.env.CV_PREVIEW) writeFileSync(`${process.env.CV_PREVIEW}/cv-${lang}.html`, html(d))
  console.log(`public/cv/${d.file}  (${Math.round(pdf.length / 1024)} kB)`)
}
await browser.close()
