// Renders scripts/cv/content.mjs into A4 PDFs in public/cv/ (Czech + English) with the site's look.
// Usage: npm run cv   (needs Google Chrome installed; set CHROME to override its path)
//
// Three env vars, all optional, so a one-off copy can be built without touching the canonical pair:
//   CV_CONTENT  another content module exporting { cv, PHONE }. A relative path resolves against this
//               script's folder, an absolute one is taken as it is. Default ./cv/content.mjs.
//   CV_OUT      where the PDFs land. Default public/cv. Any other value also skips the write of
//               public/img/cv-name-shadow.png, so a fitted copy never dirties the repo.
//   CV_PREVIEW  a folder for the rendered HTML, to check the layout in a browser.
// A résumé fitted to one posting is built like this, and writes nowhere else:
//   CV_CONTENT=/tmp/fit/content.mjs CV_OUT=/tmp/fit npm run cv
// Paths inside the content module (the photo) stay relative to the repo root, where npm run cv runs.
//
// One column, on purpose. The layout used to put skills, education and strengths in a sidebar,
// which looked good and broke automated screening: in the PDF's text a role ended up next to
// whatever sat beside it, so a parser paired "Analytik / Tester" with the *next* job's employer.
// Everything now runs top to bottom, section by section, and the same file works for a person
// reading it and for the parser behind a careers portal.
//
// letter-spacing decides whether the spaces survive into the PDF at all. The safe window is
// measured, not guessed, and written out above the stylesheet below: keep every rule inside it.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'
import QRCode from 'qrcode'

const DEFAULT_CONTENT = './cv/content.mjs'
const DEFAULT_OUT = 'public/cv'
const OUT = process.env.CV_OUT ?? DEFAULT_OUT
const CONTENT_MODULE = process.env.CV_CONTENT ?? DEFAULT_CONTENT
// Loaded by hand rather than with a static import, so CV_CONTENT can point the build at another file.
const contentPath = isAbsolute(CONTENT_MODULE)
  ? CONTENT_MODULE
  : resolve(fileURLToPath(new URL('.', import.meta.url)), CONTENT_MODULE)
const { cv, PHONE } = await import(pathToFileURL(contentPath).href)

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Scans straight to the portfolio from a printed copy.
// The name's red offset shadow used to be a CSS text-shadow, which Chrome writes into the PDF as
// two more copies of the text: a résumé parser read "ERIKKARÁSEK. ERIKKARÁSEK. ERIKKARÁSEK.".
// Now the shadow is drawn once as an image, laid under the name, which is text exactly once.
// The same image is published for the fitted CV in the Job Tracker, which draws this header too.
// No letter-spacing on the name: with the tight -.03em tracking it used to have, Chrome leaves the
// space out of the PDF (even with the tracking on each word only, since it trails the last letter),
// and a parser read "ERIKKARÁSEK.". The shadow image is rendered from this same CSS, so the two
// still line up.
const NAME_CSS = "display: inline-block; padding: 0 3pt 3pt 0; font-family: SpaceFromArial, Outfit, sans-serif; font-size: 27pt; line-height: .95; font-weight: 900; font-style: italic; text-transform: uppercase"
const nameHtml = (name) => `${esc(name)}.`
const SPACE_FONT = "@font-face { font-family: SpaceFromArial; src: local('Arial'), local('Helvetica'); unicode-range: U+0020 }"
const FONT_LINK = '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=block" rel="stylesheet">'

async function renderNameShadow(browser, name) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 300, deviceScaleFactor: 4 })
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8">${FONT_LINK}<style>${SPACE_FONT}</style></head><body style="margin:0">` +
      `<h1 style="${NAME_CSS}; margin: 0; color: transparent; text-shadow: 1.2pt 1.2pt 0 #ef4444, 2.2pt 2.2pt 0 #a31515">${nameHtml(name)}</h1></body></html>`,
    { waitUntil: 'networkidle0' },
  )
  await page.evaluate(() => document.fonts.ready)
  const png = await (await page.$('h1')).screenshot({ omitBackground: true })
  await page.close()
  return png
}

const QR = await QRCode.toString('https://erikkarasek.cz', { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#111827', light: '#0000' } })

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
  const pair = ([k, v]) => `<p class="pair"><b>${esc(k)}:</b> ${esc(v)}</p>`
  const list = (points) => `<ul>${points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`

  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 12mm 13mm 11mm }
  * { box-sizing: border-box; margin: 0; padding: 0 }
  /* Chrome writes Outfit's text to the PDF glyph by glyph with no space glyph between words, so a
     parser has to guess the spaces from the gaps, and Outfit's gap (0.20em) is narrow enough that
     word-by-word extraction (pdftotext -raw) read "Juniorvývojář,kterýstaví…". Arial's space is
     written as a real space, so the space alone comes from Arial. It is 0.078em wider; narrowing it
     back with word-spacing or size-adjust makes Chrome drop the glyph again, so it stays.

     Borrowing Arial's space is necessary but not sufficient: letter-spacing can still throw it away.
     Measured by printing one string at many sizes and tracking values and reading the PDF back with
     pdftotext -raw. The cutoffs are the same at 7pt, 8.8pt, 9.6pt, 10pt and 27pt, so they are
     em-relative, not a rounding artifact of the point size:

         <= -.006em   Chrome omits the space from the PDF; words run together
         -.005em .. .26em   the space is written correctly  <- stay in here
         >= .28em     pdftotext splits the letters instead: "S I L N É  S T RÁ N KY"

     So any negative tracking is out of the question, however small it looks on screen. Two rules
     have already been bitten by this: the name (-.03em, extracted as "ERIKKARÁSEK.") and .role
     (-.01em, which made every job title and project name come out as "ICTTECHNIKL1",
     "SPECIALISTAZÁKAZNICKÉHOCENTRA", "NEXUSGRIND"). Both now carry no letter-spacing at all; the
     widest role still ends 300pt short of the date column, so there is nothing to win back.
     The positive values below (.06em, .08em, .1em) sit well inside the window and are fine.

     Check after any change to the type, never by eye:
       npm run cv && pdftotext -raw public/cv/erik-karasek-zivotopis.pdf - | grep -iE "ANALYTIK|TECHNIK|SPECIALISTA|NEXUS"
     One false alarm to expect: with -raw, poppler joins the last line of a page to the first line of
     the next without a newline, so a project name reads "…přes Gemini).JOB TRACKER". That is the
     extractor, not the PDF; plain pdftotext and -layout both keep them apart. */
  ${SPACE_FONT}
  body { font: 500 9.1pt/1.32 SpaceFromArial, Outfit, sans-serif; color: #1f2937; -webkit-print-color-adjust: exact; print-color-adjust: exact }
  .page { padding: 1mm 1mm 0 }
  header { display: flex; align-items: center; gap: 8mm; padding-bottom: 4mm; border-bottom: 2px solid #a31515; }
  .photo { width: 30mm; height: 30mm; border-radius: 50%; border: 1.6mm solid #a31515; padding: 1mm; background: #fff; flex: none; box-shadow: 0 0 6mm rgba(163,21,21,.25) }
  .photo img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block }
  .qr { margin-left: auto; flex: none; text-align: center } .qr svg { width: 20mm; height: 20mm; display: block }
  .qr span { display: block; margin-top: 1.4mm; font-size: 7pt; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #a31515 }
  h1 { ${NAME_CSS}; margin-bottom: -3pt; color: #111827; background: url(${d.nameShadow}) no-repeat 0 0 / 100% 100% }
  .title { margin-top: 2.2mm; font-size: 9.6pt; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #a31515 }
  .contact { margin-top: 2.2mm; font-size: 8.6pt; color: #4b5563; font-weight: 600 }
  a { color: inherit; text-decoration: none }
  .contact i { font-style: normal; color: #a31515; margin: 0 1.6mm }
  h2 { display: flex; align-items: center; gap: 2mm; font-size: 8.8pt; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #a31515; margin: 3.0mm 0 1.4mm }
  h2 span { width: 3mm; height: 2.2mm; background: #a31515; border-radius: .4mm }
  main > section:first-child h2 { margin-top: 3.4mm }
  .profile { color: #374151 }
  .item { margin-bottom: 2.0mm; break-inside: avoid }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 3mm }
  .role { font-weight: 900; font-size: 10pt; text-transform: uppercase; color: #111827 } /* no letter-spacing: see the window above */
  .when { font-size: 8pt; font-weight: 700; color: #a31515; white-space: nowrap }
  .where { font-size: 8.4pt; color: #6b7280; font-weight: 600; margin: .3mm 0 1.2mm }
  ul { padding-left: 3.4mm } li { margin: .25mm 0 } li::marker { color: #a31515 }
  .chips { display: flex; flex-wrap: wrap; gap: 1.4mm }
  .chips b { font-size: 7.8pt; font-weight: 700; color: #a31515; background: #fff; border: 1px solid rgba(163,21,21,.3); border-radius: 1.6mm; padding: .7mm 2mm }
  .pair { margin-bottom: .75mm; break-inside: avoid; color: #4b5563; font-size: 8.8pt }
  .pair b { color: #111827; font-weight: 800 }
  .edu { margin-bottom: 1.2mm; break-inside: avoid } .edu b { font-size: 9pt; color: #111827 } .edu span { color: #6b7280; font-size: 8.4pt }
</style></head><body><div class="page">
  <header>
    <div class="photo"><img src="${photo}"></div>
    <div>
      <h1>${nameHtml(d.name)}</h1>
      <p class="title">${esc(d.title)}</p>
      <p class="contact">${contact}</p>
    </div>
    <div class="qr">${QR}<span>${esc(d.labels.qr)}</span></div>
  </header>
  <main>
    <section>${head(d.labels.profile)}<p class="profile">${esc(d.profile)}</p></section>
    <section>${head(d.labels.tech)}<div class="chips">${d.tech.map((t) => `<b>${esc(t)}</b>`).join('')}</div></section>
    <section>${head(d.labels.experience)}${d.jobs
      .map((j) => `<div class="item"><div class="row"><span class="role">${esc(j.role)}</span><span class="when">${esc(j.when)}</span></div><p class="where">${esc(j.where)}</p>${list(j.points)}</div>`)
      .join('')}</section>
    <section>${head(d.labels.projects)}${d.projects
      .map(
        (p) =>
          `<div class="item"><div class="row"><span class="role">${esc(p.name)}</span><span class="when">${esc(p.when)}</span></div><p class="where">${[
            // a project may carry a repo link, a write-up, or only one of the two
            p.link && a(p.link, url(p.link)),
            p.study && `${esc(d.studyLabel)}: ${a(p.study, url(p.study))}`,
          ]
            .filter(Boolean)
            .join(' <b>·</b> ')}</p>${list(p.points)}</div>`,
      )
      .join('')}</section>
    <section>${head(d.labels.skills)}${d.skills.map(pair).join('')}</section>
    <section>${head(d.labels.education)}${d.education
      .map((e) => `<p class="edu"><b>${esc(e.what)}</b>, <span>${esc(e.where)}, ${esc(e.when)}</span></p>`)
      .join('')}</section>
    <section>${head(d.labels.strengths)}${d.strengths.map(pair).join('')}</section>
    <section>${head(d.labels.other)}${d.other.map(pair).join('')}</section>
  </main>
</div></body></html>`
}

mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const shadowPng = await renderNameShadow(browser, cv.cs.name)
// Publishing the shadow is the canonical build's job only: the Job Tracker's fitted CV reads it off
// the site, so a one-off build keeps its hands off the repo and just inlines its own copy below.
if (OUT === DEFAULT_OUT) {
  mkdirSync('public/img', { recursive: true })
  writeFileSync('public/img/cv-name-shadow.png', shadowPng)
}
const nameShadow = `data:image/png;base64,${Buffer.from(shadowPng).toString('base64')}`
for (const [lang, d] of Object.entries(cv)) {
  const page = await browser.newPage()
  await page.setContent(html({ ...d, nameShadow }), { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true })
  writeFileSync(join(OUT, d.file), pdf)
  if (process.env.CV_PREVIEW) writeFileSync(`${process.env.CV_PREVIEW}/cv-${lang}.html`, html({ ...d, nameShadow }))
  console.log(`${join(OUT, d.file)}  (${Math.round(pdf.length / 1024)} kB)`)
}
await browser.close()
