// Renders the LinkedIn cover photo (1584x396) into the git-ignored banner/ in the site's colours.
// Usage: node scripts/build-banner.mjs   (needs Google Chrome; set CHROME to override its path)
//
// LinkedIn crops the banner differently everywhere: the profile picture sits over the lower left
// on desktop, and phones shave the sides off. Everything that has to stay readable therefore lives
// in the middle band, away from the bottom-left corner.
import { readFileSync, mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const W = 1584
const H = 396
const OUT = 'banner'

const font = (file) => `data:font/woff2;base64,${readFileSync(`public/fonts/${file}`).toString('base64')}`
const img = (file, type = 'webp') => `data:image/${type};base64,${readFileSync(`public/img/${file}`).toString('base64')}`

const OUTFIT = font('outfit-latin-ext-wght-normal.woff2')
const WEB = img('web.webp')

// Dark = the site's symbiote palette, light = its default one. Same layout, so the choice is taste.
const THEMES = {
  dark: { bg: '#0a0a0b', bg2: '#17171a', ink: '#fafafa', mute: '#a1a1aa', accent: '#ef4444', web: 0.16, line: 'rgb(255 255 255 / 0.14)' },
  light: { bg: '#fdfdfd', bg2: '#f1f2f4', ink: '#111113', mute: '#52525b', accent: '#a31515', web: 0.06, line: 'rgb(0 0 0 / 0.1)' },
}

const TAGS = ['React', 'TypeScript', 'React Native', 'Cloudflare', 'Tauri']

const html = (t) => `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Outfit; src: url(${OUTFIT}) format('woff2'); font-weight: 100 900; font-display: block }
  * { margin: 0; padding: 0; box-sizing: border-box }
  body { width: ${W}px; height: ${H}px; overflow: hidden; font-family: Outfit, system-ui, sans-serif;
         color: ${t.ink}; background: ${t.bg}; position: relative }

  /* A wide wash towards the right so the text never sits on flat colour. */
  .glow { position: absolute; inset: -40% -10% -40% 30%;
          background: radial-gradient(60% 60% at 60% 50%, ${t.bg2} 0%, transparent 70%) }
  .web  { position: absolute; top: 50%; left: 168px; width: 620px; height: 620px;
          transform: translateY(-50%); object-fit: contain; opacity: ${t.web} }
  /* The web again, small and cropped, in the corner phones keep. */
  .web-2 { position: absolute; right: -140px; bottom: -220px; width: 520px; height: 520px;
           object-fit: contain; opacity: ${t.web * 0.8} }

  .wrap { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center;
          gap: 18px; padding-left: 430px; padding-right: 90px }
  h1 { font-size: 74px; font-weight: 700; letter-spacing: -0.03em; line-height: 1 }
  .role { display: flex; align-items: center; gap: 14px; font-size: 30px; font-weight: 500; color: ${t.mute} }
  .role b { color: ${t.accent}; font-weight: 700 }
  .dot { width: 7px; height: 7px; border-radius: 99px; background: ${t.accent};
         box-shadow: 0 0 14px ${t.accent} }

  .tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px }
  .tags span { border: 1px solid ${t.line}; border-radius: 99px; padding: 7px 16px;
               font-size: 17px; font-weight: 600; color: ${t.mute} }

  .site { position: absolute; right: 60px; bottom: 44px; display: flex; align-items: center; gap: 10px;
          font-size: 21px; font-weight: 700; letter-spacing: 0.02em; color: ${t.accent} }
  .site i { display: block; width: 26px; height: 2px; background: ${t.accent}; opacity: 0.6 }
</style></head><body>
  <div class="glow"></div>
  <img class="web" src="${WEB}" alt="">
  <img class="web-2" src="${WEB}" alt="">
  <div class="wrap">
    <h1>Erik Kar&aacute;sek</h1>
    <div class="role"><span class="dot"></span><b>Full-stack v&yacute;voj&aacute;&#345;</b></div>
    <div class="tags">${TAGS.map((x) => `<span>${x}</span>`).join('')}</div>
  </div>
  <div class="site"><i></i>erikkarasek.cz</div>
</body></html>`

mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
for (const [name, theme] of Object.entries(THEMES)) {
  const page = await browser.newPage()
  // Rendered at 2x: LinkedIn scales the cover up on wide screens and a 1584px-wide file looks soft.
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 })
  await page.setContent(html(theme), { waitUntil: 'load' })
  await page.evaluateHandle('document.fonts.ready')
  await page.screenshot({ path: `${OUT}/banner-${name}.png`, type: 'png' })
  await page.close()
  console.log(`${OUT}/banner-${name}.png`)
}
await browser.close()
