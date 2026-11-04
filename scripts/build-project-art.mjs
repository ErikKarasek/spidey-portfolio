// Renders the project-card thumbnails for the three projects that have no screens worth shooting:
// nerv (its HUD), sklep (a REPL session) and odnuly (a training run). 1000x620 WebP, the size every
// other card in public/img/projects uses.
// Usage: node scripts/build-project-art.mjs [nerv|sklep|odnuly]   (needs Google Chrome; set CHROME to override)
//
// The text in each picture is copied from the project's own README, so the numbers on the card are
// the numbers those projects actually printed. Nothing here is invented for the sake of a nicer shot.
import { readFileSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUTFIT = `data:font/woff2;base64,${readFileSync('public/fonts/outfit-latin-ext-wght-normal.woff2').toString('base64')}`

const W = 1000
// 16:9 exactly, which is the aspect the project card crops to, so nothing is cut off.
const H = 562

const base = `
  @font-face { font-family: Outfit; src: url(${OUTFIT}) format('woff2'); font-weight: 100 900 }
  * { box-sizing: border-box; margin: 0 }
  body { width: ${W}px; height: ${H}px; overflow: hidden; background: #0b0f14; color: #e8eef4;
         font: 400 15px/1.45 Outfit, system-ui, sans-serif }
  .mono { font-family: ui-monospace, 'SF Mono', Menlo, monospace }
  .win { border-radius: 14px; border: 1px solid #1d2733; background: #0e141b; overflow: hidden;
         box-shadow: 0 24px 60px rgb(0 0 0 / 0.55) }
  .bar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #141c25;
         border-bottom: 1px solid #1d2733 }
  .dot { width: 11px; height: 11px; border-radius: 50%; background: #2b3845 }
  .dot.r { background: #ef4444 }
  .bar b { margin-left: 8px; font-weight: 600; font-size: 13px; color: #8da2b8 }
  .body { padding: 16px 20px; font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          font-size: 13.5px; line-height: 1.62; color: #c7d4e2; white-space: pre }
  .p { color: #ef4444; font-weight: 700 }
  .d { color: #6b7f94 }
  .g { color: #7fd48a }
  .c { color: #58c6d6 }
  .y { color: #e3b341 }
`

// ---------------------------------------------------------------- sklep

// The session from sklep's README: a pager and a B-tree, a hundred thousand keys, three page reads.
// A card is read at 390 px wide first and opened second, so the number leads and the terminal backs it up.
const sklep = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
  body { background: radial-gradient(110% 80% at 12% 10%, #16222e 0%, #0b0f14 60%) }
  .wrap { padding: 28px 34px; height: ${H}px; display: flex; flex-direction: column; gap: 22px }
  h1 { font-size: 24px; font-weight: 800; letter-spacing: -.01em }
  h1 span { color: #6b7f94; font-weight: 500; font-size: 16px; margin-left: 12px }
  .row { display: flex; gap: 26px; align-items: center }
  .hero { width: 400px }
  .big { font-size: 190px; line-height: .82; font-weight: 900; letter-spacing: -.05em; color: #ef4444 }
  .cap { margin-top: 14px; font-size: 21px; font-weight: 600; line-height: 1.3; color: #e8eef4 }
  .sub { margin-top: 8px; font-size: 16px; color: #7f91a4; line-height: 1.4 }
  .win { flex: 1 }
  .body { font-size: 14px; line-height: 1.8 }
  .road { display: flex; gap: 8px; flex-wrap: wrap; font-family: ui-monospace, Menlo, monospace; font-size: 13px }
  .road span { border-radius: 6px; padding: 5px 10px; border: 1px solid #1d2733; color: #6b7f94 }
  .road span.on { border-color: rgb(127 212 138 / 0.45); color: #7fd48a }
</style></head><body><div class="wrap">
  <h1>sklep<span>databáze a SQL server od nuly v Rustu, bez závislostí</span></h1>
  <div class="row">
    <div class="hero">
      <div class="big">3</div>
      <div class="cap">čtení stránky na jeden klíč</div>
      <div class="sub">ať jich je ve stromu deset, nebo sto tisíc</div>
    </div>
    <div class="win">
      <div class="bar"><i class="dot r"></i><i class="dot"></i><i class="dot"></i><b>cargo run --release · sklep.sklep</b></div>
      <div class="body"><span class="p">&gt;</span> .bench 100000
<span class="d">100000 inserts in 4.65s (21489/s)</span>
<span class="p">&gt;</span> .stats
height          <span class="c">3</span>
entries         100003
pages per level [1, 4, 552]
leaf fill       53%
<span class="p">&gt;</span> .verify
<span class="g">the tree holds: sorted, in bounds,</span>
<span class="g">all leaves level</span></div>
    </div>
  </div>
  <div class="road">
    <span class="on">✓ stránkovaný soubor</span><span class="on">✓ B-strom</span><span>cache stránek</span><span>log a transakce</span><span>SQL</span><span>protokol Postgresu</span>
  </div>
</div></body></html>`

// ---------------------------------------------------------------- odnuly

// Bits per byte against the usual compressors, straight out of odnuly's README, plus the same
// sentence shredded by a real 200k tokenizer in both languages.
const BPB = [
  ['gzip -9', 2.398, '#3b4a5a'],
  ['bzip2 -9', 1.961, '#3b4a5a'],
  ['odnuly 11M', 1.947, '#ef4444'],
  ['xz -9', 1.792, '#3b4a5a'],
]
const bars = BPB.map(([name, v, c]) => `
  <div class="brow">
    <span class="bn">${name}</span>
    <span class="btrack"><span class="bfill" style="width: ${(v / 2.5) * 100}%; background: ${c}"></span></span>
    <span class="bv"${c === '#ef4444' ? ' style="color:#ef4444"' : ''}>${String(v).replace('.', ',')}</span>
  </div>`).join('')

const odnuly = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
  body { background: radial-gradient(110% 80% at 88% 10%, #1d1820 0%, #0b0f14 60%) }
  .wrap { padding: 28px 34px; height: ${H}px; display: flex; flex-direction: column; gap: 20px }
  h1 { font-size: 24px; font-weight: 800; letter-spacing: -.01em }
  h1 span { color: #6b7f94; font-weight: 500; font-size: 16px; margin-left: 12px }
  .row { display: flex; gap: 26px; align-items: stretch }
  .hero { width: 390px }
  .big { font-size: 112px; line-height: .86; font-weight: 900; letter-spacing: -.04em; color: #ef4444 }
  .cap { margin-top: 10px; font-size: 21px; font-weight: 600; line-height: 1.3 }
  .sub { margin-top: 6px; font-size: 16px; color: #7f91a4; line-height: 1.4 }
  .bars { margin-top: 20px }
  .brow { display: flex; align-items: center; gap: 10px; margin-bottom: 7px;
          font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: #8da2b8 }
  .bn { width: 96px }
  .btrack { flex: 1; height: 9px; border-radius: 5px; background: #141c25; overflow: hidden }
  .bfill { display: block; height: 100% }
  .bv { width: 44px; text-align: right; color: #c7d4e2 }
  .tok { flex: 1; border-radius: 14px; border: 1px solid #1d2733; background: #0e141b; padding: 18px 20px }
  .tok .h { font-size: 15px; color: #8da2b8; margin-bottom: 12px }
  .pill { display: inline-block; border-radius: 5px; padding: 3px 6px; margin: 0 4px 6px 0;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 13px }
  .en .pill { background: rgb(88 198 214 / 0.14); color: #8fdbe6 }
  .cs .pill { background: rgb(239 68 68 / 0.16); color: #f2908f }
  .lbl { font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: #6b7f94; margin: 12px 0 7px }
  .note { margin-top: 16px; font-size: 15px; line-height: 1.45; color: #c7d4e2 }
  .facts { display: flex; gap: 9px; font-family: ui-monospace, Menlo, monospace; font-size: 13px }
  .facts span { border-radius: 6px; padding: 5px 10px; border: 1px solid #1d2733; color: #6b7f94 }
</style></head><body><div class="wrap">
  <h1>odnuly<span>jazykový model od nuly, natrénovaný na mých vlastních repozitářích</span></h1>
  <div class="row">
    <div class="hero">
      <div class="big">1,947</div>
      <div class="cap">bitu na bajt</div>
      <div class="sub">11 milionů parametrů, 4,2 MB mého textu, a o fous míň než bzip2</div>
      <div class="bars">${bars}</div>
    </div>
    <div class="tok">
      <div class="h">Stejná věta, tokenizer o200k</div>
      <div class="lbl">en · 13 tokenů</div>
      <div class="en"><span class="pill">Write</span><span class="pill">&nbsp;a</span><span class="pill">&nbsp;short</span><span class="pill">&nbsp;summary</span><span class="pill">&nbsp;of</span><span class="pill">&nbsp;what</span><span class="pill">&nbsp;changed</span><span class="pill">&nbsp;in</span><span class="pill">&nbsp;the</span><span class="pill">&nbsp;project</span><span class="pill">&nbsp;this</span><span class="pill">&nbsp;week</span><span class="pill">.</span></div>
      <div class="lbl">cs · 21 tokenů</div>
      <div class="cs"><span class="pill">N</span><span class="pill">api</span><span class="pill">š</span><span class="pill">&nbsp;krát</span><span class="pill">ké</span><span class="pill">&nbsp;shr</span><span class="pill">nutí</span><span class="pill">&nbsp;toho</span><span class="pill">,</span><span class="pill">&nbsp;co</span><span class="pill">&nbsp;se</span><span class="pill">&nbsp;v</span><span class="pill">&nbsp;projektu</span><span class="pill">&nbsp;ten</span><span class="pill">hle</span><span class="pill">&nbsp;tý</span><span class="pill">den</span><span class="pill">&nbsp;změ</span><span class="pill">n</span><span class="pill">ilo</span><span class="pill">.</span></div>
      <div class="note">Čeština stojí 1,69x víc tokenů. Nemůže za to jazyk, ale rozpočet slovníku: „projekt“ je jeden token, „týden“ jsou čtyři.</div>
    </div>
  </div>
  <div class="facts">
    <span>0 stažených vah</span><span>vlastní BPE</span><span>12 000 kroků na M-čipu</span><span>trénink přes noc</span>
  </div>
</div></body></html>`

// ---------------------------------------------------------------- nerv

// The HUD as Sources/nerv/HUDWindow.swift draws it: grid, cyan skeleton, magenta index tip, the mode
// and the raw numbers it decided on. The hand below is the pointing pose the panel is reading.
const CYAN = '#00f2f2'
const MAGENTA = '#ff2e9e'

const SW = 600
const SH = 330

// A pointing hand, in the panel's own pixel space: wrist at the bottom, index straight up, the other
// three curled back into the palm, thumb laid across. The HUD draws one polyline per finger plus the
// knuckle row, and colours the index tip magenta.
const chains = [
  [[300, 300], [252, 272], [216, 243], [198, 215], [194, 188]],   // thumb
  [[300, 300], [256, 182], [250, 132], [247, 97], [245, 64]],     // index, out
  [[300, 300], [296, 173], [302, 131], [323, 149], [311, 174]],   // middle, curled
  [[300, 300], [336, 181], [347, 143], [364, 162], [350, 184]],   // ring, curled
  [[300, 300], [373, 197], [387, 166], [400, 185], [385, 202]],   // little, curled
  [[256, 182], [296, 173], [336, 181], [373, 197]],               // knuckle row
]
const TIPS = [
  [[194, 188], false],
  [[245, 64], true],
  [[311, 174], false],
  [[350, 184], false],
  [[385, 202], false],
]

const px = ([x, y]) => `${x},${y}`

const skeleton = `<svg width="${SW}" height="${SH}" viewBox="0 0 ${SW} ${SH}">
  <defs><filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter></defs>
  ${[1, 2, 3].flatMap((i) => [
    `<line x1="${(SW * i) / 4}" y1="0" x2="${(SW * i) / 4}" y2="${SH}" stroke="#fff" stroke-opacity="0.05"/>`,
    `<line x1="0" y1="${(SH * i) / 4}" x2="${SW}" y2="${(SH * i) / 4}" stroke="#fff" stroke-opacity="0.05"/>`,
  ]).join('')}
  <g filter="url(#glow)" fill="none" stroke="${CYAN}" stroke-opacity="0.9" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    ${chains.map((c) => `<polyline points="${c.map(px).join(' ')}"/>`).join('')}
  </g>
  ${TIPS.map(([[x, y], isIndex]) =>
    `<circle cx="${x}" cy="${y}" r="5" fill="${isIndex ? MAGENTA : CYAN}" filter="url(#glow)"/>`).join('')}
</svg>`

const nerv = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
  body { background: radial-gradient(120% 90% at 78% 12%, #16222e 0%, #0b0f14 62%) }
  .wrap { padding: 26px 30px 0; height: ${H}px; display: flex; flex-direction: column }
  h1 { font-size: 21px; font-weight: 800; letter-spacing: -.01em }
  h1 span { color: #6b7f94; font-weight: 500; font-size: 15px; margin-left: 10px }
  .stage { flex: 1; display: flex; align-items: center; justify-content: center; padding-bottom: 18px }
  .hud { width: 640px; border-radius: 20px; border: 1px solid rgb(0 242 242 / 0.55);
         background: rgb(8 8 8 / 0.82); padding: 14px 14px 12px }
  .read { display: flex; align-items: baseline; gap: 16px; padding: 10px 8px 2px;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace }
  .mode { font-size: 24px; font-weight: 700; color: ${CYAN}; letter-spacing: .02em }
  .badge { font-size: 14px; font-weight: 700; color: ${MAGENTA} }
  .nums { padding: 0 8px; font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          font-size: 14px; color: #9eadbc; display: flex; justify-content: space-between }
  .nums i { font-style: normal; color: #e3b341 }
</style></head><body><div class="wrap">
  <h1>nerv<span>ovládání Macu rukou před kamerou, nativně a bez připojení</span></h1>
  <div class="stage"><div class="hud">
    ${skeleton}
    <div class="read"><span class="mode">KURZOR</span></div>
    <div class="nums"><span>prsty 0.31 0.97 -0.42 -0.55 -0.61</span></div>
    <div class="nums" style="margin-top: 4px"><span>stip&nbsp; 0.62</span><i>FaceTime HD Camera · 30 fps</i></div>
  </div></div>
</div></body></html>`

// ----------------------------------------------------------------

const cards = { sklep, odnuly, nerv }
const only = process.argv[2]
const browser = await puppeteer.launch({ executablePath: CHROME, args: ['--force-device-scale-factor=1'] })

for (const [name, html] of Object.entries(cards)) {
  if (only && only !== name) continue
  const page = await browser.newPage()
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const buffer = await page.screenshot({ type: 'webp', quality: 92 })
  writeFileSync(`public/img/projects/${name}.webp`, buffer)
  console.log(`public/img/projects/${name}.webp  ${W}x${H}`)
  await page.close()
}

await browser.close()
