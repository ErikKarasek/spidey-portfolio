// Všechen text webu v obou jazycích — uprav cokoli tady, komponenty se nemusí měnit.

export type Lang = 'cs' | 'en'
export type SocialId = 'twitch' | 'kick' | 'youtube' | 'tiktok' | 'instagram' | 'donate'

// Cloudflare Turnstile (spam protection for the contact form): the *site* key. The matching secret
// belongs in the Pages project (`npx wrangler pages secret put TURNSTILE_SECRET --project-name
// erik-karasek`), next to RESEND_API_KEY, which functions/api/contact.ts sends the mail with.
export const TURNSTILE_SITE_KEY = '0x4AAAAAAEww7ttbS74hu2_T'

export const REPO = 'https://github.com/ErikKarasek/spidey-portfolio'

export const profile = {
  first: 'Erik',
  last: 'Karásek',
  email: 'erikkarasek@centrum.cz',
  github: 'https://github.com/ErikKarasek',
  stack: ['React', 'TypeScript', 'Tauri', 'React Native', 'Supabase', 'Node.js'],
}

// Z linktr.ee/erickos007. `live` = u které platformy se ukáže LIVE, když zrovna streamuješ.
export const socials: { id: SocialId; label: string; href: string; live?: 'twitch' | 'kick' }[] = [
  { id: 'kick', label: 'Kick', href: 'https://kick.com/erickos007', live: 'kick' },
  { id: 'twitch', label: 'Twitch', href: 'https://www.twitch.tv/erickos007', live: 'twitch' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCLxpYwapavqjQy9vtq5KM3g' },
  { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@erickos007' },
  { id: 'tiktok', label: 'Fashion TikTok', href: 'https://www.tiktok.com/@erikkarasek' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/erikkarasek/' },
  { id: 'donate', label: 'Donate', href: 'https://streamelements.com/erickos007/tip' },
]

export type Skill = { name: string; category: string; level: string }
export type Job = { role: string; company: string; when: string; points: string[]; current?: boolean }
// `downloads`: the card shows Mac/Windows buttons for the latest nexus-grind-releases build instead of being one big link.
// `study`: link to a case study page for the project.
export type Project = { title: string; description: string; tags: string[]; image: string; link?: string; downloads?: boolean; study?: string }

export const CHANNELS = { twitch: 'erickos007', kick: 'erickos007', youtube: 'https://www.youtube.com/channel/UCLxpYwapavqjQy9vtq5KM3g' }

export type Content = {
  meta: { title: string; description: string }
  nav: { about: string; experience: string; skills: string; projects: string; contact: string; symbiote: string; menu: string; soundOn: string; soundOff: string }
  loader: string
  hero: { tagline: string; cta: string; cv: string; cvHref: string }
  marquee: string[]
  about: { label: string; paragraphs: string[]; stack: string; source: string; certs: { heading: string; items: { title: string; subtitle: string }[] } }
  experience: { label: string; title: string; now: string; items: Job[] }
  eggs: { venomOn: string; venomOff: string }
  skills: { label: string; title: string; items: Skill[] }
  projects: { label: string; title: string; study: string; items: Project[] }
  downloads: { mac: string; win: string; macHint: string; all: string }
  live: { label: string; title: string; openOn: string }
  clips: { label: string; title: string; channel: string; fallback: string }
  contact: {
    label: string
    title: string
    name: string
    email: string
    message: string
    namePh: string
    emailPh: string
    messagePh: string
    send: string
    sending: string
    sent: string
    sentNote: string
    failed: string
    offline: string
    subject: (name: string) => string
    socials: string
    liveNow: string
  }
  chat: {
    open: string
    close: string
    title: string
    intro: string
    suggestions: string[]
    placeholder: string
    send: string
    thinking: string
    failed: string
    /** Shown instead of an error when the model is unavailable and the widget answers by itself. */
    offline: string
    offlineNone: string
    linkProjects: string
    linkCv: string
    linkContact: string
    note: string
  }
}

const IMG = '/img/projects'
const ADV = { cs: 'Pokročilý', en: 'Advanced' }
const PRO = { cs: 'Zkušený', en: 'Proficient' }

const skills = (l: Lang): Skill[] => [
  { name: 'React / Vite', category: 'Frontend', level: ADV[l] },
  { name: 'TypeScript', category: l === 'cs' ? 'Jazyky' : 'Languages', level: ADV[l] },
  { name: 'Tauri & Rust', category: 'Desktop', level: PRO[l] },
  { name: 'React Native & Expo', category: l === 'cs' ? 'Mobil' : 'Mobile', level: ADV[l] },
  { name: 'Swift & SwiftUI', category: l === 'cs' ? 'Mobil' : 'Mobile', level: PRO[l] },
  { name: 'Supabase & PostgreSQL', category: 'Backend', level: PRO[l] },
  { name: 'Python & Flask', category: 'Backend', level: PRO[l] },
  { name: l === 'cs' ? 'AI agenti (volání nástrojů)' : 'AI agents (tool calling)', category: 'AI', level: PRO[l] },
  { name: l === 'cs' ? 'Workers AI & LLM API' : 'Workers AI & LLM APIs', category: 'AI', level: PRO[l] },
  { name: 'Web scraping', category: 'Data', level: PRO[l] },
  { name: 'Node.js & pnpm', category: l === 'cs' ? 'Nástroje' : 'Tooling', level: ADV[l] },
  { name: l === 'cs' ? 'Unit testy' : 'Unit testing', category: l === 'cs' ? 'Kvalita' : 'Quality', level: PRO[l] },
  { name: l === 'cs' ? 'GSAP animace' : 'GSAP animations', category: 'Frontend', level: PRO[l] },
  { name: 'Git & GitHub', category: l === 'cs' ? 'Nástroje' : 'Tooling', level: ADV[l] },
  { name: l === 'cs' ? 'Automatické testy (Playwright, Newman)' : 'Automated tests (Playwright, Newman)', category: l === 'cs' ? 'Kvalita' : 'Quality', level: PRO[l] },
  { name: 'UI/UX design', category: 'Design', level: PRO[l] },
]

export const content: Record<Lang, Content> = {
  cs: {
    meta: {
      title: 'Erik Karásek | full-stack vývojář',
      description: 'Portfolio Erika Karáska. Appky pro počítač, mobil i web. Devět vlastních projektů v Reactu, TypeScriptu a na Cloudflare, u každého i popis, jak vznikl.',
    },
    nav: { about: 'O mně', experience: 'Zkušenosti', skills: 'Dovednosti', projects: 'Projekty', contact: 'Kontakt', symbiote: 'Symbiote mode', menu: 'Menu', soundOn: 'Vypnout zvuk', soundOff: 'Zapnout zvuk' },
    loader: 'Nasazuju masku',
    hero: { tagline: 'Tvůj přátelský sousedský vývojář', cta: 'Prozkoumat projekty', cv: 'Životopis.pdf', cvHref: '/cv/erik-karasek-zivotopis.pdf' },
    marquee: ['Frontend vývoj', 'UI/UX design', 'GSAP animace', 'React Native', 'Desktop appky', 'AI agenti', 'Full stack'],
    about: {
      label: 'Za maskou',
      paragraphs: [
        'Ahoj, jsem Erik. Dělám appky pro počítač, mobil i web a nejvíc mě baví, když si můžu udělat všechno sám, od logiky až po to, jak to vypadá. Můj největší projekt je Nexus Grind, tracker produktivity, ve kterém ti za splněné úkoly roste sakura.',
        'Pro sebe jsem si udělal taky LoL Stats, kde si procházím svoje ranked hry, a Monster Watch, který hlídá, kde je zrovna Monster ve slevě. Poslední dobou mě nejvíc baví dávat do svých appek AI tam, kde ušetří rutinu. Na tomhle webu ti vpravo dole odpoví asistent, který zná moje projekty. Večer občas streamuju League of Legends a Overwatch, hlavně na Kicku.',
      ],
      stack: 'Co používám nejvíc',
      source: 'Kód tohoto webu na GitHubu',
      certs: {
        heading: 'Certifikáty',
        items: [{ title: 'Cambridge English First', subtitle: 'FCE, úroveň B2' }],
      },
    },
    experience: {
      label: 'Kariéra',
      title: 'Zkušenosti.',
      now: 'Teď',
      items: [
        {
          role: 'Analytik / Tester',
          company: 'Unicorn · ENTSO-E Transparency Platform · Hradec Králové',
          when: 'červenec 2026 – současnost',
          current: true,
          points: ['Píšu testovací scénáře pro datová rozšíření platformy a testuju je na DEV prostředí.', 'Tickety a postupy vedu v Jira, scénáře revidujeme se seniorními testery.'],
        },
        {
          role: 'ICT Technik L1',
          company: 'BEDNAR FMT s.r.o. · Rychnov nad Kněžnou',
          when: 'duben – červen 2026',
          points: ['Bral jsem helpdesk první úrovně v JIRA a diagnostikoval i měnil hardware.', 'Připravoval jsem stanice s Windows, přidával je do Active Directory a pomáhal lidem na dálku přes RDP a TeamViewer.'],
        },
        {
          role: 'Specialista zákaznického centra',
          company: 'T-Mobile Czech Republic a.s. · Hradec Králové',
          when: 'prosinec 2025 – únor 2026',
          points: ['Po telefonu jsem řešil zákazníkům technické i smluvní věci.', 'Pracoval jsem v CRM systémech a nabízel produkty a služby.'],
        },
        {
          role: 'Odborná stáž, 3D grafika',
          company: 'Erasmus+ · Německo',
          when: '2024',
          points: ['Dělal jsem 3D modely, textury a jednoduché animace v Blenderu.'],
        },
        {
          role: 'Brigádník',
          company: "McDonald's · Hradec Králové",
          when: 'červen 2020 – leden 2024',
          points: ['Zvládal jsem rychlý provoz a práci v týmu, směny jsem skládal kolem školy.'],
        },
      ],
    },
    eggs: { venomOn: 'Symbiote se probudil 🕷️', venomOff: 'Symbiote usnul' },
    skills: { label: 'Arzenál', title: 'Technické dovednosti.', items: skills('cs') },
    projects: {
      label: 'Na čem pracuju',
      title: 'Projekty.',
      study: 'Víc o projektu',
      items: [
        {
          title: 'Wisp',
          description:
            'Řídicí panel nad mými AI agenty. Každý agent je postavička a její obličej ukazuje, jestli pracuje, spí, spadla, nebo na mě čeká. Na Macu žije v notchi a vidíš jeho kroky živě, včetně dotazu, jestli smí spustit příkaz. To samé mám v iPhonu ve widgetech a v Dynamic Islandu, mezi oběma je Cloudflare relay. Claude, ChatGPT i Gemini vedle sebe, i se zbývajícími limity. A drží Mac vzhůru, dokud agenti pracují, i se zavřeným víkem. Postavičky si upravuju na Macu i v telefonu a žijí: točí se, cukají ušima a když agent dodělá úkol, udělají kotrmelec. Úkol, který mu večer napíšu do Telegramu, udělá Claude přes noc a ráno čeká jako draft PR.',
          tags: ['Tauri', 'Rust', 'SwiftUI', 'TypeScript', 'Cloudflare Workers', 'D1'],
          image: `${IMG}/wisp.webp`,
          link: 'https://github.com/ErikKarasek/wisp',
          study: '/wisp/',
        },
        {
          title: 'Wisp Buddy',
          description:
            'Postavička z rodiny Wispu, která mi žije na ploše Macu. Chodí po spodku obrazovky, vyskakuje na okna a veze se s nimi, dá se chytit a hodit. Povídá si se mnou přes Gemini, pamatuje si připomínky, které mi přijdou i na telefon, a když mi běží Wisp, hlásí, co dělají agenti.',
          tags: ['Tauri', 'Rust', 'TypeScript', 'Gemini API', 'CoreGraphics'],
          image: `${IMG}/wispbuddy.webp`,
          link: 'https://github.com/ErikKarasek/wisp-buddy',
          study: '/wisp-buddy/',
        },
        {
          title: 'Nexus Grind',
          description:
            'Aplikace pro Mac a Windows, která hlídá úkoly, návyky, spánek i ranked hry v LoLku. Za každou splněnou věc ti roste sakura. Data se synchronizují přes cloud.',
          tags: ['React', 'Tauri', 'Rust', 'Supabase'],
          image: `${IMG}/nexusgrind.webp`,
          downloads: true,
          study: '/nexus-grind/',
        },
        {
          title: 'LoL Stats',
          description:
            'Moje statistiky z ranked her přes Riot API. Tierlist šampionů podle winrate a KDA, statistiky podle pozice, historie her a detail zápasu jako na op.gg. Klíč k API zůstává jen v prohlížeči.',
          tags: ['JavaScript', 'Riot API', 'Chart.js', 'Cloudflare Workers'],
          image: `${IMG}/lolstats.webp`,
          link: 'https://lolstats.erikkarasek2005.workers.dev',
          study: '/lol-stats/',
        },
        {
          title: 'Monster Watch',
          description:
            'Hlídá, kde je Monster zrovna v akci. Ukazuje všech 20 příchutí s cenami z aktuálních letáků. Slevy z kupi.cz stahuje backend v Pythonu a appka je ukazuje jako mřížku příchutí.',
          tags: ['React Native', 'Expo', 'Python', 'Flask'],
          image: `${IMG}/monsterwatch.webp`,
          link: 'https://monster-watch.onrender.com',
          study: '/monster-watch/',
        },
        {
          title: 'Job Tracker',
          description:
            'Nástěnka na hledání práce, která si nabídky hledá sama. Každé ráno projde inzeráty na Jobs.cz i otevřená data Úřadu práce, levnější AI model je předtřídí a přísnější přeměří ty nadějné podle toho, co mi v požadavcích chybí. Ke každé nabídce umí složit životopis na míru a před pohovorem projde web firmy a napíše přípravu. Běží to celé na Cloudflare a po každé změně kódu se samo otestuje.',
          tags: ['React', 'TypeScript', 'Hono', 'Cloudflare D1', 'Workers AI'],
          image: `${IMG}/jobtracker.webp`,
          link: 'https://job-tracker-10s.pages.dev',
          study: '/job-tracker/',
        },
        {
          title: 'Automatizace',
          description:
            'Pár AI agentů, kteří za mě dělají rutinu kolem hledání práce a mých projektů. V noci sepíšou, co jsem udělal, a zkontrolují nový kód, přes den hlídají poštu od firem a ráno pošlou přehled nových nabídek. Všechno chodí do Telegramu s tlačítky a nic se nezmění, dokud to neschválím. Když spadne web nebo se některá úloha neozve, dá mi vědět.',
          tags: ['Node.js', 'Claude', 'Telegram Bot API', 'Cloudflare Workers', 'IMAP'],
          image: `${IMG}/automation.webp`,
          link: 'https://github.com/ErikKarasek/devlog',
          study: '/automation/',
        },
        {
          title: 'GitHub Reels',
          description:
            'Každé ráno projde GitHub Trending a AI novinky, seřadí je podle toho, co má šanci zaujmout, a nechá model napsat scénáře na krátká videa v češtině. Hotové scénáře i zdroje si otevřu v mobilu na webu, který se nasadí spolu s nimi.',
          tags: ['Node.js', 'Claude', 'Web scraping', 'Cloudflare Workers', 'PWA'],
          image: `${IMG}/reels.webp`,
          link: 'https://github.com/ErikKarasek/github-reels',
        },
        {
          title: 'Subscription Tracker',
          description:
            'Přehled všeho, co ti měsíčně odchází z účtu. Jednou denně se program sám probudí, posune datum další platby a pošle e-mail na to, co se blíží nebo co dlouho nepoužíváš. Screenshot platby za tebe přečte AI model na Cloudflare.',
          tags: ['React', 'Hono', 'Cloudflare Workers', 'D1', 'Workers AI'],
          image: `${IMG}/subscriptions.webp`,
          link: 'https://github.com/ErikKarasek/subscription-tracker',
          study: '/subscriptions/',
        },
        {
          title: 'Nexus Grind Mobile',
          description:
            'Nexus Grind pro iPhone a Android. Propojí se s Apple Health a Health Connect, úkoly propíše do kalendáře a připomínky tě hodí rovnou na správnou obrazovku.',
          tags: ['React Native', 'Expo', 'iOS', 'Android'],
          image: `${IMG}/nexusgrind-mobile.webp`,
        },
      ],
    },
    downloads: {
      mac: 'macOS',
      win: 'Windows',
      macHint: 'Verze pro Mac je pro čipy M1 a novější. Při prvním spuštění klikni pravým tlačítkem a zvol Otevřít.',
      all: 'Všechny verze',
    },
    live: { label: 'Právě živě', title: 'Stream.', openOn: 'Otevřít na' },
    clips: { label: 'Ze streamů', title: 'Klipy.', channel: 'Celý kanál', fallback: 'Klip ze streamu' },
    contact: {
      label: 'Ozvi se',
      title: 'Kontakt.',
      name: 'Tvoje jméno',
      email: 'Tvůj e-mail',
      message: 'Zpráva',
      namePh: 'Peter Parker',
      emailPh: 'peter@stark.com',
      messagePh: 'Napiš, co potřebuješ…',
      send: 'Odeslat zprávu',
      sending: 'Střílím pavučinu…',
      sent: 'Thwip! Odesláno ✓',
      sentNote: 'Díky! Zpráva dorazila, ozvu se co nejdřív.',
      failed: 'Zprávu se nepodařilo odeslat. Zkus to prosím znovu.',
      offline: 'Nepodařilo se spojit se serverem. Jsi online?',
      subject: (name) => `Zpráva z portfolia${name ? ` od ${name}` : ''}`,
      socials: 'Najdeš mě i tady',
      liveNow: 'Právě streamuju',
    },
    chat: {
      open: 'Zeptej se na Erika',
      close: 'Zavřít chat',
      title: 'Zeptej se na Erika',
      intro: 'Ahoj! Jsem AI asistent. Zeptej se mě na Erikovy projekty, zkušenosti nebo dovednosti.',
      suggestions: ['Na čem teď pracuje?', 'Jaký je jeho největší projekt?', 'Jaké technologie používá?'],
      placeholder: 'Napiš otázku…',
      send: 'Odeslat',
      thinking: 'Přemýšlím…',
      failed: 'Teď neodpovím. Zkus to později, nebo Erikovi napiš přes kontaktní formulář.',
      offline: 'AI teď mlčí (nejspíš došel denní limit), tak ti odpovím rovnou z webu:',
      offlineNone: 'AI teď mlčí, nejspíš došel denní limit, zkus to zítra. Mezitím tě nasměruju:',
      linkProjects: 'Projekty',
      linkCv: 'Životopis (PDF)',
      linkContact: 'Napsat Erikovi',
      note: 'Odpovídá AI podle obsahu webu, může se splést.',
    },
  },
  en: {
    meta: {
      title: 'Erik Karásek | full-stack developer',
      description: "Erik Karásek's portfolio. Desktop, mobile and web apps. Nine projects of my own in React, TypeScript and on Cloudflare, each with a write-up of how it was built.",
    },
    nav: { about: 'About', experience: 'Experience', skills: 'Skills', projects: 'Projects', contact: 'Contact', symbiote: 'Symbiote mode', menu: 'Menu', soundOn: 'Mute sound', soundOff: 'Turn sound on' },
    loader: 'Suiting up',
    hero: { tagline: 'Your friendly neighborhood developer', cta: 'Explore projects', cv: 'Resume.pdf', cvHref: '/cv/erik-karasek-resume.pdf' },
    marquee: ['Frontend development', 'UI/UX design', 'GSAP animations', 'React Native', 'Desktop apps', 'AI agents', 'Full stack'],
    about: {
      label: 'Behind the mask',
      paragraphs: [
        "Hey, I'm Erik. I build apps for desktop, mobile and the web, and I like doing the whole thing myself, from the logic to how it looks. My biggest project is Nexus Grind, a productivity tracker where a sakura tree grows as you finish your tasks.",
        'I also made LoL Stats to go through my ranked games, and Monster Watch, which tells me where Monster is on sale. Lately what I enjoy most is putting AI into my apps where it takes routine work off my hands. The assistant in the bottom right of this site knows my projects and will answer your questions. In the evenings I sometimes stream League of Legends and Overwatch, mostly on Kick.',
      ],
      stack: 'What I use most',
      source: "This site's code on GitHub",
      certs: {
        heading: 'Certificates',
        items: [{ title: 'Cambridge English First', subtitle: 'FCE, level B2' }],
      },
    },
    experience: {
      label: 'Career',
      title: 'Experience.',
      now: 'Now',
      items: [
        {
          role: 'Analyst / Tester',
          company: 'Unicorn · ENTSO-E Transparency Platform · Hradec Králové',
          when: 'July 2026 – present',
          current: true,
          points: ['I write test cases for data extensions of the platform and run them on the DEV environment.', 'Tickets and processes live in Jira; we review scenarios with senior testers.'],
        },
        {
          role: 'ICT Technician L1',
          company: 'BEDNAR FMT s.r.o. · Rychnov nad Kněžnou',
          when: 'April – June 2026',
          points: ['I ran first-level helpdesk in JIRA, and diagnosed and replaced hardware.', 'I set up Windows workstations, added them to Active Directory and helped people remotely over RDP and TeamViewer.'],
        },
        {
          role: 'Customer Care Specialist',
          company: 'T-Mobile Czech Republic a.s. · Hradec Králové',
          when: 'December 2025 – February 2026',
          points: ['I handled technical and contract questions over the phone.', 'I worked in CRM systems and offered products and services.'],
        },
        {
          role: 'Internship, 3D graphics',
          company: 'Erasmus+ · Germany',
          when: '2024',
          points: ['I made 3D models, textures and simple animations in Blender.'],
        },
        {
          role: 'Part-time crew member',
          company: "McDonald's · Hradec Králové",
          when: 'June 2020 – January 2024',
          points: ['I worked fast-paced shifts in a team and fitted them around school.'],
        },
      ],
    },
    eggs: { venomOn: 'The symbiote woke up 🕷️', venomOff: 'The symbiote fell asleep' },
    skills: { label: 'Arsenal', title: 'Technical skills.', items: skills('en') },
    projects: {
      label: 'What I work on',
      title: 'Projects.',
      study: 'More about it',
      items: [
        {
          title: 'Wisp',
          description:
            'A dashboard for my AI agents. Each agent is a character whose face shows whether it is working, asleep, failed or waiting for me. On the Mac it lives in the notch, where its steps arrive live and it asks before running a command. The same state is on my iPhone, in widgets and the Dynamic Island, with a Cloudflare relay in between. Claude, ChatGPT and Gemini side by side, with what is left of each. And it keeps the Mac awake while they work, lid closed or not. I edit the characters on the Mac or the phone, and they are alive: they spin, twitch their ears and do a somersault when an agent finishes a task. A task I send it on Telegram in the evening, Claude does overnight, and it waits as a draft PR in the morning.',
          tags: ['Tauri', 'Rust', 'SwiftUI', 'TypeScript', 'Cloudflare Workers', 'D1'],
          image: `${IMG}/wisp.webp`,
          link: 'https://github.com/ErikKarasek/wisp',
          study: '/wisp/',
        },
        {
          title: 'Wisp Buddy',
          description:
            'A character from Wisp\'s family that lives on my Mac\'s desktop. It walks along the bottom of the screen, jumps onto windows and rides along with them, and can be picked up and thrown. It chats through Gemini, keeps reminders that reach my phone too, and when Wisp runs it tells me what the agents are doing.',
          tags: ['Tauri', 'Rust', 'TypeScript', 'Gemini API', 'CoreGraphics'],
          image: `${IMG}/wispbuddy.webp`,
          link: 'https://github.com/ErikKarasek/wisp-buddy',
          study: '/wisp-buddy/',
        },
        {
          title: 'Nexus Grind',
          description:
            'A productivity tracker for Mac and Windows. It keeps track of tasks, habits, sleep and even your LoL ranked games, and a sakura tree grows with everything you get done. Your data syncs through the cloud.',
          tags: ['React', 'Tauri', 'Rust', 'Supabase'],
          image: `${IMG}/nexusgrind.webp`,
          downloads: true,
          study: '/nexus-grind/',
        },
        {
          title: 'LoL Stats',
          description:
            'My ranked stats from the Riot API. A champion tier list by win rate and KDA, stats per lane, match history and a match view like on op.gg. The API key stays in your browser.',
          tags: ['JavaScript', 'Riot API', 'Chart.js', 'Cloudflare Workers'],
          image: `${IMG}/lolstats.webp`,
          link: 'https://lolstats.erikkarasek2005.workers.dev',
          study: '/lol-stats/',
        },
        {
          title: 'Monster Watch',
          description:
            'Shows where Monster Energy is on sale. All 20 flavours with prices from the current store flyers. A Python backend pulls the deals from kupi.cz and the app shows them as a grid of flavours.',
          tags: ['React Native', 'Expo', 'Python', 'Flask'],
          image: `${IMG}/monsterwatch.webp`,
          link: 'https://monster-watch.onrender.com',
          study: '/monster-watch/',
        },
        {
          title: 'Job Tracker',
          description:
            'A board for a job hunt that finds the postings itself. Every morning it reads Jobs.cz and the Labour Office\'s open data, a cheaper AI model sorts what it finds and a stricter one re-measures the promising ones against the requirements I do not meet. It can fit the résumé to any posting, and before an interview it reads the company\'s site and writes a prep brief. All of it runs on Cloudflare and tests itself after every change to the code.',
          tags: ['React', 'TypeScript', 'Hono', 'Cloudflare D1', 'Workers AI'],
          image: `${IMG}/jobtracker.webp`,
          link: 'https://job-tracker-10s.pages.dev',
          study: '/job-tracker/',
        },
        {
          title: 'Automation',
          description:
            'A few AI agents that handle the routine around my job hunt and projects. At night they write up what I did and check the new code, during the day they watch for replies from companies, and in the morning they send a digest of new postings. Everything arrives in Telegram with buttons, and nothing changes until I approve it. If a site goes down or a job does not run, I get told.',
          tags: ['Node.js', 'Claude', 'Telegram Bot API', 'Cloudflare Workers', 'IMAP'],
          image: `${IMG}/automation.webp`,
          link: 'https://github.com/ErikKarasek/devlog',
          study: '/automation/',
        },
        {
          title: 'GitHub Reels',
          description:
            'Every morning it goes through GitHub Trending and the AI news, ranks them by what stands a chance of landing, and has a model write short-video scripts in Czech. The scripts and their sources open on my phone, on a site deployed alongside them.',
          tags: ['Node.js', 'Claude', 'Web scraping', 'Cloudflare Workers', 'PWA'],
          image: `${IMG}/reels.webp`,
          link: 'https://github.com/ErikKarasek/github-reels',
        },
        {
          title: 'Subscription Tracker',
          description:
            'An overview of everything leaving your account each month. Once a day the program wakes up on its own, moves the next payment date forward and emails what is due or what you never use. An AI model on Cloudflare reads a payment screenshot for you.',
          tags: ['React', 'Hono', 'Cloudflare Workers', 'D1', 'Workers AI'],
          image: `${IMG}/subscriptions.webp`,
          link: 'https://github.com/ErikKarasek/subscription-tracker',
          study: '/subscriptions/',
        },
        {
          title: 'Nexus Grind Mobile',
          description:
            'Nexus Grind for iPhone and Android. It connects to Apple Health and Health Connect, puts your tasks in the calendar and sends reminders that open the right screen.',
          tags: ['React Native', 'Expo', 'iOS', 'Android'],
          image: `${IMG}/nexusgrind-mobile.webp`,
        },
      ],
    },
    downloads: {
      mac: 'macOS',
      win: 'Windows',
      macHint: 'The Mac build is for M1 chips and newer. The first time, right-click the app and choose Open.',
      all: 'All versions',
    },
    live: { label: 'Live right now', title: 'Stream.', openOn: 'Open on' },
    clips: { label: 'From the streams', title: 'Clips.', channel: 'The whole channel', fallback: 'Stream clip' },
    contact: {
      label: 'Get in touch',
      title: 'Contact.',
      name: 'Your name',
      email: 'Your email',
      message: 'Message',
      namePh: 'Peter Parker',
      emailPh: 'peter@stark.com',
      messagePh: 'Tell me what you need…',
      send: 'Send message',
      sending: 'Shooting a web…',
      sent: 'Thwip! Sent ✓',
      sentNote: "Thanks! Got your message, I'll get back to you soon.",
      failed: "The message couldn't be sent. Please try again.",
      offline: "Couldn't reach the server. Are you online?",
      subject: (name) => `Portfolio message${name ? ` from ${name}` : ''}`,
      socials: 'Find me here too',
      liveNow: 'Live now',
    },
    chat: {
      open: 'Ask about Erik',
      close: 'Close chat',
      title: 'Ask about Erik',
      intro: "Hi! I'm an AI assistant. Ask me about Erik's projects, experience or skills.",
      suggestions: ['What is he working on?', "What's his biggest project?", 'Which technologies does he use?'],
      placeholder: 'Type a question…',
      send: 'Send',
      thinking: 'Thinking…',
      failed: "I can't answer right now. Try again later, or message Erik through the contact form.",
      offline: 'The AI is quiet right now (most likely the daily limit), so here it is straight from the site:',
      offlineNone: 'The AI is quiet right now, most likely the daily limit, try tomorrow. In the meantime:',
      linkProjects: 'Projects',
      linkCv: 'Resume (PDF)',
      linkContact: 'Message Erik',
      note: 'Answers come from AI, based on this site. It can be wrong.',
    },
  },
}
