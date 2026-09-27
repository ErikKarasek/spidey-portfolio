// Renders the pictures for the Automation page: a Telegram chat with sample messages, the way the
// bots actually write them, in three sizes (page screenshot, project card, link preview).
// Usage: node scripts/build-automation-art.mjs   (needs Google Chrome; set CHROME to override)
//
// The companies are made up (the same Microsoft sample names the Job Tracker shots use); the real
// chat holds real applications, which stay private.
import { readFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUTFIT = `data:font/woff2;base64,${readFileSync('public/fonts/outfit-latin-ext-wght-normal.woff2').toString('base64')}`

const msg = (time, body, buttons = []) => `
  <div class="msg">
    ${body}
    <div class="time">${time}</div>
  </div>
  ${buttons.length ? `<div class="btns">${buttons.map((row) => `<div class="row">${row.map((b) => `<span class="${b.startsWith('✔') ? 'done' : ''}">${b}</span>`).join('')}</div>`).join('')}</div>` : ''}`

const html = ({ w, h, scale }) => `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Outfit; src: url(${OUTFIT}) format('woff2'); font-weight: 100 900 }
  * { box-sizing: border-box; margin: 0 }
  body { width: ${w}px; height: ${h}px; overflow: hidden; background: #0e1621; font: 400 15px/1.45 Outfit, system-ui, sans-serif; color: #f5f5f5 }
  .wrap { transform: scale(${scale}); transform-origin: top left; width: ${w / scale}px; height: ${h / scale}px; display: flex; flex-direction: column }
  header { display: flex; align-items: center; gap: 12px; padding: 12px 20px; background: #17212b; border-bottom: 1px solid #0b121a }
  .avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #a31515); display: grid; place-items: center; font-size: 18px }
  header b { font-weight: 700; font-size: 16px } header small { display: block; color: #7f91a4; font-size: 13px }
  .chat { flex: 1; padding: 18px 24px; display: flex; gap: 22px; align-items: flex-start }
  .col { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0 }
  .msg { background: #182533; border-radius: 12px 12px 12px 4px; padding: 10px 14px 6px; position: relative }
  .msg b { font-weight: 700 } .msg i { color: #9fb3c8; font-style: normal; font-size: 13px }
  .msg p { margin: 0 0 6px } .msg .h { font-weight: 700; margin-bottom: 6px }
  .msg a { color: #6ab3f3; text-decoration: none }
  .quote { border-left: 3px solid #6ab3f3; padding: 2px 8px; margin: 4px 0 8px; color: #c9d6e3; font-size: 14px }
  .time { text-align: right; color: #6d7f8f; font-size: 12px; margin-top: -2px }
  .btns { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px }
  .row { display: flex; gap: 4px }
  .row span { flex: 1; text-align: center; background: rgb(24 37 51 / 0.85); border-radius: 8px; padding: 8px 6px; font-weight: 600; font-size: 14px; color: #e8eef4 }
  .row span.done { color: #7fd48a }
  .day { align-self: center; background: rgb(0 0 0 / 0.35); color: #cfd8e1; font-size: 13px; padding: 3px 10px; border-radius: 12px; margin-bottom: 4px }
</style></head><body><div class="wrap">
  <header><div class="avatar">🕷️</div><div><b>Job bot</b><small>bot</small></div></header>
  <div class="chat">
    <div class="col">
      <div class="day">Dnes</div>
      ${msg('10:00', `
        <p class="h">☀️ Ranní přehled – úterý 6. 10.</p>
        <p><b>🎤 Pohovory</b><br>• zítra: Northwind Software – Junior Frontend Developer</p>
        <p><b>🔎 Scout</b>: dnes 24 nových · v inboxu 61</p>
        <p>1. <b>84</b> · <a>Junior vývojář automatizací</a> · Contoso Cloud · 45–60 tis.<br>
           2. <b>77</b> · <a>IT Support L2</a> · Fabrikam · remote<br>
           3. <b>71</b> · <a>Správce Microsoft 365</a> · Litware</p>
        <p><b>⏰ Urgovat</b>: Adventure Works – IT Specialist</p>
        <p><b>📋 Board</b>: 6 wishlist · 5 applied · 1 interview · 0 offer · 3 rejected</p>`,
        [['✔ Na boardu: Contoso Cloud (wishlist)', 'Otevřít board'], ['➕ 2. na board', '✖ 2. zahodit'], ['➕ 3. na board', '✖ 3. zahodit']])}
    </div>
    <div class="col">
      ${msg('13:42', `
        <p class="h">🎉 Pozvánka / další kolo</p>
        <p><b>Northwind Software</b> — Junior Frontend Developer</p>
        <p>HR zve na online pohovor ve středu 7. 10. v 10:00 a prosí o potvrzení termínu.</p>
        <p>👉 Potvrdit termín, nebo navrhnout jiný.<br>📋 Návrh: posunout kartu <b>applied → interview</b></p>
        <i>jana.novakova@northwind.example · Re: Junior Frontend Developer</i>`,
        [['✔ Posunuto: Northwind Software → interview', 'Otevřít board']])}
      ${msg('3:07', `
        <p class="h">🔍 Code review 5. 10.</p>
        <p>✅ <b>portfolio</b>: v pořádku<br>
           <b>job-tracker</b><br>&nbsp;&nbsp;🟠 medium — retry loop never gives up on a 4xx<br>
           ✅ <b>devlog</b>: v pořádku</p>`)}
    </div>
  </div>
</div></body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
const shots = [
  { file: 'public/img/case/automation-telegram.webp', w: 1600, h: 1029, scale: 1.72, type: 'webp' },
  { file: 'public/img/projects/automation.webp', w: 1000, h: 620, scale: 1.08, type: 'webp' },
  { file: 'public/img/og/automation.jpg', w: 1200, h: 630, scale: 1.08, type: 'jpeg' },
]
for (const s of shots) {
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 })
  await page.setContent(html(s), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: s.file, type: s.type, quality: 88 })
  console.log(`wrote ${s.file}`)
}
await browser.close()
