# Spidey portfolio

My portfolio, Spider-Man themed, live at [erikkarasek.cz](https://erikkarasek.cz). React + Vite + GSAP, deployed on Cloudflare Pages. The site is bilingual (Czech and English), Czech first.

```bash
npm run dev        # Vite dev server
npm run build      # tsc --noEmit && vite build
npm run deploy     # build, then wrangler pages deploy
```

## What is in it

- The one-page site in `src/`: intro with the mask that the cursor pulls off, skills, projects, "Za maskou" (behind the mask) and contact. Language switch in `src/i18n.tsx`, copy in `src/content.ts`.
- Project pages in `src/case-study/`, one per project (Nexus Grind, Wisp Buddy, Job Tracker, LoL stats, Monster Watch, subscriptions, automation). Each gets its own route folder in the repo root so it can be linked on its own.
- A chat about me in `src/chat/`, answered by Cloudflare Workers AI (`@cf/mistralai/mistral-small-3.1-24b-instruct`) over a hand-written knowledge file. Its neuron budget is shared with the Job Tracker, so a quiet quota here is not a bug.
- Cloudflare Pages Functions in `functions/api/`: the chat, the contact form, what I am listening to and a YouTube feed.
- `npm run cv` and `npm run cv:docx` build the résumé from the same content the site uses; the result is in `cv-docx/`.
- `npm run banner` renders the GitHub profile banner.

## Images

`public/img/README.md` lists which image shows up where and which photos of mine the intro expects.
