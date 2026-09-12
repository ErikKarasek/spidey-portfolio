// Word versions of the résumé, from the same content as the PDFs: `npm run cv:docx`.
// Word is what a lot of recruiters ask for, and unlike the PDF its links stay clickable after
// the file is re-saved or pasted into another document. Output lands in cv-docx/ (not published).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'
import { cv, PHONE } from './cv/content.mjs'

// Word embeds the photo as-is, so use a screen-sized copy: the PDF's print-resolution one would
// triple the file size for no visible gain.
const PHOTO = process.env.CV_DOCX_PHOTO

const ACCENT = 'A31515'
const INK = '1F2937'
const MUTE = '4B5563'

const text = (value, opts = {}) => new TextRun({ text: value, font: 'Aptos', size: 19, color: INK, ...opts })
const link = (label, url) => new ExternalHyperlink({ link: url, children: [text(label, { color: ACCENT, underline: {} })] })
const url = (value) => (value.startsWith('http') ? value : `https://${value}`)

const heading = (label) =>
  new Paragraph({
    spacing: { before: 260, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
    children: [text(label.toUpperCase(), { bold: true, size: 18, color: ACCENT, characterSpacing: 40 })],
  })

/** "Role" on the left, "when" pushed to the right margin. */
const titleRow = (left, right) =>
  new Paragraph({
    spacing: { before: 140, after: 20 },
    tabStops: [{ type: 'right', position: 9350 }],
    children: [text(left, { bold: true }), text('\t'), text(right, { color: MUTE, size: 17 })],
  })

const where = (children) => new Paragraph({ spacing: { after: 40 }, children })

const bullets = (items) =>
  items.map((item) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 20 }, children: [text(item)] }))

const pairs = (rows) =>
  rows.map(([label, value]) => new Paragraph({ spacing: { after: 40 }, children: [text(`${label}: `, { bold: true }), text(value)] }))

function header(d) {
  const contact = [
    ...(PHONE ? [text(PHONE), text('  ·  ', { color: ACCENT })] : []),
    link(d.email, `mailto:${d.email}`),
    text('  ·  ', { color: ACCENT }),
    text(d.city),
    text('  ·  ', { color: ACCENT }),
    link(d.github, url(d.github)),
    text('  ·  ', { color: ACCENT }),
    link(d.web, url(d.web)),
  ]
  const photo = new Paragraph({
    children: [new ImageRun({ type: 'jpg', data: readFileSync(PHOTO || d.photo), transformation: { width: 96, height: 96 } })],
  })
  const about = [
    new Paragraph({ children: [text(d.name, { bold: true, size: 40 })] }),
    new Paragraph({ spacing: { after: 80 }, children: [text(d.title, { bold: true, size: 19, color: ACCENT })] }),
    new Paragraph({ children: contact }),
  ]
  const cell = (children, width) => new TableCell({ children, width: { size: width, type: WidthType.DXA }, margins: { right: 160 } })
  return new Table({
    columnWidths: [1500, 7850],
    borders: Object.fromEntries(['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical'].map((k) => [k, { style: BorderStyle.NONE }])),
    rows: [new TableRow({ children: [cell([photo], 1500), cell(about, 7850)] })],
  })
}

function sections(d) {
  const out = [header(d)]

  out.push(heading(d.labels.profile), new Paragraph({ children: [text(d.profile)] }))

  out.push(heading(d.labels.experience))
  for (const job of d.jobs) {
    out.push(titleRow(job.role, job.when), where([text(job.where, { color: MUTE, size: 17 })]), ...bullets(job.points))
  }

  out.push(heading(d.labels.projects))
  for (const p of d.projects) {
    out.push(titleRow(p.name, p.when))
    const line = [link(p.link, url(p.link))]
    if (p.study) line.push(text('  ·  ', { color: ACCENT }), text(`${d.studyLabel}: `, { size: 17, color: MUTE }), link(p.study, url(p.study)))
    out.push(where(line), ...bullets(p.points))
  }

  out.push(heading(d.labels.tech), new Paragraph({ children: [text(d.tech.join(' · '))] }))
  out.push(heading(d.labels.strengths), ...pairs(d.strengths))
  out.push(heading(d.labels.skills), ...pairs(d.skills))

  out.push(heading(d.labels.education))
  for (const e of d.education) {
    out.push(titleRow(e.what, e.when), where([text(e.where, { color: MUTE, size: 17 })]))
  }

  out.push(heading(d.labels.other), ...pairs(d.other))
  return out
}

mkdirSync('cv-docx', { recursive: true })
for (const d of Object.values(cv)) {
  const doc = new Document({
    creator: d.name,
    title: `${d.name} — ${d.title}`,
    styles: { default: { document: { run: { font: 'Aptos', size: 19, color: INK } } } },
    sections: [{ properties: { page: { margin: { top: 720, bottom: 620, left: 760, right: 760 } } }, children: sections(d) }],
  })
  const file = d.file.replace('.pdf', '.docx')
  writeFileSync(`cv-docx/${file}`, await Packer.toBuffer(doc))
  console.log(`cv-docx/${file}`)
}
