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

// Word embeds the photo as-is, so a screen-sized copy keeps the file small; the PDF keeps the print one.
const PHOTO = process.env.CV_DOCX_PHOTO  // round portrait on white, like the PDF's framed one

const ACCENT = 'A31515'
const INK = '111827'
const BODY = '1F2937'
const MUTE = '4B5563'
const GREY = '6B7280'

// Page: A4 with 12mm margins, same as the PDF.
const MARGIN = 680
const CONTENT = 11906 - 2 * MARGIN
const MAIN = Math.round(CONTENT * 0.63)
const SIDE = CONTENT - MAIN

const qr = await QRCode.toBuffer('https://erik-karasek.pages.dev', { margin: 0, width: 110, color: { dark: '#111827', light: '#ffffff' } })

const text = (value, opts = {}) => new TextRun({ text: value, font: 'Aptos', size: 18, color: BODY, ...opts })
const link = (label, url) => new ExternalHyperlink({ link: url, children: [text(label, { color: ACCENT, underline: {} })] })
const url = (value) => (value.startsWith('http') ? value : `https://${value}`)
const NONE = Object.fromEntries(['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical'].map((k) => [k, { style: BorderStyle.NONE }]))

/** Section heading: small red caps over a thin red rule, like the PDF's. */
const heading = (label, first = false) =>
  new Paragraph({
    spacing: { before: first ? 0 : 150, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 3 } },
    children: [text(label.toUpperCase(), { bold: true, size: 15, color: ACCENT, characterSpacing: 60 })],
  })

/** "Role" on the left, "when" pushed to the right edge of its column. */
const titleRow = (left, right, width) =>
  new Paragraph({
    spacing: { before: 100, after: 0 },
    tabStops: [{ type: 'right', position: width - 220 }],
    children: [text(left.toUpperCase(), { bold: true, size: 19, color: INK }), text('\t'), text(right, { bold: true, size: 15, color: ACCENT })],
  })

const where = (children) => new Paragraph({ spacing: { after: 20 }, children })
const bullets = (items) => items.map((item) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 0, line: 225, lineRule: 'auto' }, children: [text(item)] }))

/** Sidebar entry: bold term, muted description under it. */
const pairs = (rows) =>
  rows.flatMap(([term, value]) => [
    new Paragraph({ spacing: { before: 70, after: 0 }, children: [text(term, { bold: true, size: 17, color: INK })] }),
    new Paragraph({ spacing: { after: 20 }, children: [text(value, { size: 16, color: MUTE })] }),
  ])

function header(d) {
  const photo = new Paragraph({
    children: [new ImageRun({ type: 'jpg', data: readFileSync(PHOTO), transformation: { width: 92, height: 92 } })],
  })
  const contact = [
    ...(PHONE ? [text(PHONE, { size: 16, color: MUTE }), text('  ·  ', { color: ACCENT })] : []),
    link(d.email, `mailto:${d.email}`),
    text('  ·  ', { color: ACCENT }),
    text(d.city, { size: 16, color: MUTE }),
    text('  ·  ', { color: ACCENT }),
    link(d.github, url(d.github)),
    text('  ·  ', { color: ACCENT }),
    link(d.web, url(d.web)),
  ]
  const about = [
    new Paragraph({ children: [text(`${d.name}.`, { bold: true, italics: true, allCaps: true, size: 44, color: INK })] }),
    new Paragraph({ spacing: { before: 60, after: 60 }, children: [text(d.title.toUpperCase(), { bold: true, size: 16, color: ACCENT, characterSpacing: 30 })] }),
    new Paragraph({ children: contact }),
  ]
  const code = [
    new Paragraph({ children: [new ImageRun({ type: 'png', data: qr, transformation: { width: 62, height: 62 } })] }),
    new Paragraph({ spacing: { before: 20 }, children: [text(d.labels.qr.toUpperCase(), { bold: true, size: 13, color: ACCENT, characterSpacing: 40 })] }),
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
    out.push(titleRow(job.role, job.when, MAIN), where([text(job.where, { size: 16, color: GREY })]), ...bullets(job.points))
  }
  out.push(heading(d.labels.projects))
  for (const p of d.projects) {
    out.push(titleRow(p.name, p.when, MAIN))
    const line = [link(p.link, url(p.link))]
    if (p.study) line.push(text('  ·  ', { color: ACCENT }), text(`${d.studyLabel}: `, { size: 15, color: GREY }), link(p.study, url(p.study)))
    out.push(where(line), ...bullets(p.points))
  }
  return out
}

function sidebar(d) {
  const out = [heading(d.labels.tech, true), new Paragraph({ children: [text(d.tech.join(' · '), { size: 16, color: ACCENT, bold: true })] })]
  out.push(heading(d.labels.strengths), ...pairs(d.strengths))
  out.push(heading(d.labels.skills), ...pairs(d.skills))
  out.push(heading(d.labels.education))
  for (const e of d.education) {
    out.push(
      new Paragraph({ spacing: { before: 80 }, children: [text(e.what, { bold: true, size: 17, color: INK })] }),
      new Paragraph({ children: [text(e.where, { size: 16, color: GREY })] }),
      new Paragraph({ spacing: { after: 20 }, children: [text(e.when, { size: 16, color: GREY })] }),
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
          new TableCell({ children: main(d), width: { size: MAIN, type: WidthType.DXA }, margins: { right: 340, top: 160 } }),
          new TableCell({
            children: sidebar(d),
            width: { size: SIDE, type: WidthType.DXA },
            margins: { top: 200, bottom: 200, left: 240, right: 240 },
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
    styles: { default: { document: { run: { font: 'Aptos', size: 18, color: BODY } } } },
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
