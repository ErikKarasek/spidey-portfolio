import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { getLiveStatus } from './server/live'
import { getClips } from './server/youtube'
import { content, profile, REPO } from './src/content'
import { knowledge } from './src/chat/knowledge'

// Serves the /api/* endpoints locally; in production the same logic runs as functions/api/*.ts.
const json =
  (load: () => Promise<unknown>): Connect.NextHandleFunction =>
  async (_req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(await load()))
  }

const api: Plugin = {
  name: 'local-api',
  configureServer: (server) => {
    server.middlewares.use('/api/live', json(getLiveStatus))
    server.middlewares.use('/api/youtube', json(getClips))
  },
  configurePreviewServer: (server) => {
    server.middlewares.use('/api/live', json(getLiveStatus))
    server.middlewares.use('/api/youtube', json(getClips))
  },
}

// One built page per case study, on top of the portfolio itself.
const STUDIES = ['nexus-grind', 'lol-stats', 'monster-watch', 'job-tracker', 'subscriptions', 'automation', 'wisp']

// Everything the page is allowed to talk to. Adding a new outside service (an embed, an API, a CDN)
// means adding its origin here, or the browser will quietly block it.
const CSP = {
  'default-src': ["'self'"],
  // challenges.cloudflare.com = Turnstile, the contact form's spam check (only loaded with a site key).
  'script-src': ["'self'", 'https://static.cloudflareinsights.com', 'https://challenges.cloudflare.com'], // + hashes of the inline scripts, filled in below
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https://i.ytimg.com'],
  'font-src': ["'self'"],
  'connect-src': ["'self'", 'https://api.github.com', 'https://cloudflareinsights.com', 'https://challenges.cloudflare.com'],
  // Turnstile's challenge runs in an iframe on a per-region subdomain (hagen.challenges…), not just the apex.
  'frame-src': ['https://player.twitch.tv', 'https://player.kick.com', 'https://challenges.cloudflare.com', 'https://*.challenges.cloudflare.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
}

/**
 * Writes Cloudflare Pages' dist/_headers after each build: security headers for every page, with the
 * CSP's script hashes computed from the built HTML so editing an inline script can't silently break it.
 */
const securityHeaders: Plugin = {
  name: 'security-headers',
  apply: 'build',
  closeBundle() {
    const hashes = new Set<string>()
    for (const page of ['dist/index.html', 'dist/404.html', ...STUDIES.map((slug) => `dist/${slug}/index.html`)]) {
      const html = readFileSync(page, 'utf8')
      for (const [, body] of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g)) {
        hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`)
      }
    }
    const policy = Object.entries({ ...CSP, 'script-src': [...CSP['script-src'], ...hashes] })
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ')
    writeFileSync(
      'dist/_headers',
      [
        '/*',
        `  Content-Security-Policy: ${policy}; upgrade-insecure-requests`,
        '  X-Frame-Options: DENY',
        '  X-Content-Type-Options: nosniff',
        '  Referrer-Policy: strict-origin-when-cross-origin',
        '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()',
        '  Cross-Origin-Opener-Policy: same-origin',
        '',
        '# Vite fingerprints these files, so they can be cached forever.',
        '/assets/*',
        '  Cache-Control: public, max-age=31536000, immutable',
        '',
      ].join('\n'),
    )
  },
}


/**
 * Writes dist/llms.txt and dist/llms-full.txt after each build.
 *
 * An assistant asked about Erik lands on a React page it has to execute to read anything. These two
 * files hand it the same facts as plain Markdown: llms.txt is the short index (who, what, links),
 * llms-full.txt is everything, and it is the very text the site's own assistant answers from
 * (src/chat/knowledge.ts), so neither file can drift from the site.
 *
 * llms.txt is a convention (llmstxt.org), not a standard anyone is obliged to read. It costs two
 * generated files, which is why it is here; do not expect traffic from it.
 */
const llmsTxt: Plugin = {
  name: 'llms-txt',
  apply: 'build',
  closeBundle() {
    const cs = content.cs
    const link = (href: string) => `https://erikkarasek.cz${href}`
    const index = [
      `# ${profile.first} ${profile.last}`,
      '',
      `> ${cs.meta.description}`,
      `> ${content.en.meta.description}`,
      '',
      'Web je česky i anglicky, tenhle soubor je česky. Kontakt: ' +
        `${profile.email}, ${profile.github}, formulář na ${link('/#contact')}.`,
      '',
      '## Projekty',
      ...cs.projects.items.map((p) => {
        const href = p.study ? link(p.study) : (p.link ?? link('/#projects'))
        return `- [${p.title}](${href}): ${p.description}`
      }),
      '',
      '## Dokumenty',
      `- [Životopis (PDF, česky)](${link(cs.hero.cvHref)})`,
      `- [Resume (PDF, English)](${link(content.en.hero.cvHref)})`,
      `- [Zdrojový kód webu](${REPO})`,
      '',
      '## Optional',
      `- [llms-full.txt](${link('/llms-full.txt')}): všechno v jednom souboru, včetně stránek o jednotlivých projektech`,
      '',
    ].join('\n')
    writeFileSync('dist/llms.txt', index)
    writeFileSync('dist/llms-full.txt', `${knowledge}\n`)
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss(), api, securityHeaders, llmsTxt],
  server: { port: 5190 },
  // The portfolio plus one page per case study (/nexus-grind/, /lol-stats/, /monster-watch/).
  build: { rollupOptions: { input: { main: 'index.html', ...Object.fromEntries(STUDIES.map((slug) => [slug, `${slug}/index.html`])) } } },
})
