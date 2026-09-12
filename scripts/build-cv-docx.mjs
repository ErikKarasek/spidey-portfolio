// Word versions of the résumé, laid out like the PDFs and built from the same content: `npm run cv:docx`.
// Word is what a lot of recruiters ask for, and unlike the PDF its links stay clickable after the file
// is re-saved or pasted elsewhere. Output lands in cv-docx/ (not published with the site).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import {
  BorderStyle,
  Document,
  ExternalHyperlink,
  ImageRun,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'
import QRCode from 'qrcode'
import { cv, PHONE } from './cv/content.mjs'

// The PDF rounds the photo with CSS; Word has no such thing, so the round crop is baked
// into its own file. Screen-sized on purpose — Word draws it an inch wide.
const PHOTO = 'scripts/cv/portrait-round.jpg'

// Arial is on every Mac and every Windows; Aptos ships with Office, so elsewhere Word
// silently swaps it for Times and the whole page reflows.
const FONT = 'Arial'

// Half-points. Arial sets wider than the PDF's Outfit, so the Word copy runs at a
// notch smaller to keep the same one-page shape.
const BASE = 18
const LEADING = 196  // 240ths of a line — Word's own "single" leaves the page airier than the PDF

const ACCENT = 'A31515'
const INK = '111827'
const BODY = '1F2937'
const MUTE = '4B5563'
const GREY = '6B7280'

// Page: A4 with 12mm margins, same as the PDF.
const MARGIN = 560
const CONTENT = 11906 - 2 * MARGIN
const MAIN = Math.round(CONTENT * 0.63)
const SIDE = CONTENT - MAIN

const qr = await QRCode.toBuffer('https://erik-karasek.pages.dev', { margin: 0, width: 110, color: { dark: '#111827', light: '#ffffff' } })

const text = (value, opts = {}) => new TextRun({ text: value, font: FONT, size: BASE, color: BODY, ...opts })
const link = (label, url, opts = {}) => new ExternalHyperlink({ link: url, children: [text(label, { color: ACCENT, underline: {}, ...opts })] })
const url = (value) => (value.startsWith('http') ? value : `https://${value}`)
const NONE = Object.fromEntries(['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical'].map((k) => [k, { style: BorderStyle.NONE }]))

/** Section heading: small red caps over a thin red rule, like the PDF's. */
const heading = (label, first = false) =>
  new Paragraph({
    spacing: { before: first ? 0 : 75, after: 35 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 3 } },
    children: [text(label.toUpperCase(), { bold: true, size: BASE - 2, color: ACCENT, characterSpacing: 60 })],
  })

/** "Role" on the left, "when" pushed to the right edge of its column. */
const titleRow = (left, right, width) =>
  new Paragraph({
    spacing: { before: 50, after: 0 },
    tabStops: [{ type: 'right', position: width - 220 }],
    children: [text(left.toUpperCase(), { bold: true, size: BASE + 1, color: INK }), text('\t'), text(right, { bold: true, size: BASE - 2, color: ACCENT })],
  })

const where = (children) => new Paragraph({ spacing: { after: 14 }, children })
const bullets = (items) =>
  items.map((item) =>
    new Paragraph({ bullet: { level: 0 }, indent: { left: 200, hanging: 150 }, spacing: { after: 8 }, children: [text(item)] }),
  )

/** Sidebar entry: bold term, muted description under it. */
const pairs = (rows) =>
  rows.flatMap(([term, value]) => [
    new Paragraph({ spacing: { before: 48, after: 0 }, children: [text(term, { bold: true, size: BASE - 1, color: INK })] }),
    new Paragraph({ spacing: { after: 14 }, children: [text(value, { size: BASE - 2, color: MUTE })] }),
  ])

function header(d) {
  const photo = new Paragraph({
    children: [new ImageRun({ type: 'jpg', data: readFileSync(PHOTO), transformation: { width: 92, height: 92 }, altText: { name: 'portrait', title: 'Erik Karásek', description: d.name, id: '1' } })],
  })
  // Two deliberate lines: the whole lot on one row only fits beside the QR at a size
  // nobody would read, and letting it wrap on its own breaks the web address in half.
  const small = { size: BASE - 3 }
  const dot = () => text('  ·  ', { color: ACCENT })
  const reach = [
    ...(PHONE ? [text(PHONE, { ...small, color: MUTE }), dot()] : []),
    link(d.email, `mailto:${d.email}`, small),
    dot(),
    text(d.city, { ...small, color: MUTE }),
  ]
  const online = [link(d.github, url(d.github), small), dot(), link(d.web, url(d.web), small)]
  const about = [
    new Paragraph({ children: [text(`${d.name}.`, { bold: true, italics: true, allCaps: true, size: 40, color: INK })] }),
    new Paragraph({ spacing: { before: 60, after: 60 }, children: [text(d.title.toUpperCase(), { bold: true, size: BASE - 2, color: ACCENT, characterSpacing: 30 })] }),
    new Paragraph({ children: reach }),
    new Paragraph({ spacing: { before: 20 }, children: online }),
  ]
  const code = [
    new Paragraph({ children: [new ImageRun({ type: 'png', data: qr, transformation: { width: 62, height: 62 }, altText: { name: 'qr', title: d.labels.qr, description: 'erik-karasek.pages.dev', id: '2' } })] }),
    new Paragraph({ spacing: { before: 20 }, children: [text(d.labels.qr.toUpperCase(), { bold: true, size: BASE - 5, color: ACCENT, characterSpacing: 15 })] }),
  ]
  const cell = (children, size) => new TableCell({ children, width: { size, type: WidthType.DXA }, margins: { right: 200 }, verticalAlign: 'center' })
  return new Table({
    columnWidths: [1500, CONTENT - 1500 - 1300, 1300],
    width: { size: CONTENT, type: WidthType.DXA },
    borders: { ...NONE, bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 6 } },
    rows: [new TableRow({ children: [cell([photo], 1500), cell(about, CONTENT - 1500 - 1300), cell(code, 1300)] })],
  })
}

function main(d) {
  const out = [heading(d.labels.profile, true), new Paragraph({ children: [text(d.profile)] }), heading(d.labels.experience)]
  for (const job of d.jobs) {
    out.push(titleRow(job.role, job.when, MAIN), where([text(job.where, { size: BASE - 2, color: GREY })]), ...bullets(job.points))
  }
  out.push(heading(d.labels.projects))
  for (const p of d.projects) {
    out.push(titleRow(p.name, p.when, MAIN))
    const line = [link(p.link, url(p.link))]
    if (p.study) line.push(text('  ·  ', { color: ACCENT }), text(`${d.studyLabel}: `, { size: BASE - 3, color: GREY }), link(p.study, url(p.study)))
    out.push(where(line), ...bullets(p.points))
  }
  return out
}

function sidebar(d) {
  const out = [heading(d.labels.tech, true), new Paragraph({ children: [text(d.tech.join(' · '), { size: BASE - 2, color: ACCENT, bold: true })] })]
  out.push(heading(d.labels.strengths), ...pairs(d.strengths))
  out.push(heading(d.labels.skills), ...pairs(d.skills))
  out.push(heading(d.labels.education))
  for (const e of d.education) {
    out.push(
      new Paragraph({ spacing: { before: 55 }, children: [text(e.what, { bold: true, size: BASE - 1, color: INK })] }),
      new Paragraph({ children: [text(e.where, { size: BASE - 2, color: GREY })] }),
      new Paragraph({ spacing: { after: 14 }, children: [text(e.when, { size: BASE - 2, color: GREY })] }),
    )
  }
  out.push(heading(d.labels.other), ...pairs(d.other))
  return out
}

/** The PDF's two columns: work on the left, the grey card of skills and schooling on the right. */
const body = (d) =>
  new Table({
    columnWidths: [MAIN, SIDE],
    width: { size: CONTENT, type: WidthType.DXA },
    borders: NONE,
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: main(d), width: { size: MAIN, type: WidthType.DXA }, margins: { right: 260, top: 110 } }),
          new TableCell({
            children: sidebar(d),
            width: { size: SIDE, type: WidthType.DXA },
            margins: { top: 130, bottom: 130, left: 200, right: 200 },
            shading: { type: ShadingType.CLEAR, fill: 'F9FAFB' },
            borders: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' }, left: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' }, right: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' } },
          }),
        ],
      }),
    ],
  })

mkdirSync('cv-docx', { recursive: true })
for (const d of Object.values(cv)) {
  const doc = new Document({
    creator: d.name,
    title: `${d.name} — ${d.title}`,
    styles: { default: { document: { run: { font: FONT, size: BASE, color: BODY }, paragraph: { spacing: { line: LEADING, lineRule: 'auto' } } } } },
    sections: [
      {
        properties: { page: { margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
        children: [header(d), new Paragraph({ spacing: { after: 60 }, children: [] }), body(d)],
      },
    ],
  })
  const file = d.file.replace('.pdf', '.docx')
  writeFileSync(`cv-docx/${file}`, await Packer.toBuffer(doc))
  console.log(`cv-docx/${file}`)
}
