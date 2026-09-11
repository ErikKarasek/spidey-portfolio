// Všechen text webu v obou jazycích — uprav cokoli tady, komponenty se nemusí měnit.

export type Lang = 'cs' | 'en'
export type SocialId = 'twitch' | 'kick' | 'youtube' | 'tiktok' | 'instagram' | 'donate'

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
  about: { label: string; paragraphs: string[]; stack: string; certs: { heading: string; items: { title: string; subtitle: string }[] } }
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
    activate: string
    failed: string
    offline: string
    subject: (name: string) => string
    socials: string
    liveNow: string
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
  { name: 'Supabase & PostgreSQL', category: 'Backend', level: PRO[l] },
  { name: 'Python & Flask', category: 'Backend', level: PRO[l] },
  { name: 'Web scraping', category: 'Data', level: PRO[l] },
  { name: 'Node.js & pnpm', category: l === 'cs' ? 'Nástroje' : 'Tooling', level: ADV[l] },
  { name: l === 'cs' ? 'Unit testy' : 'Unit testing', category: l === 'cs' ? 'Kvalita' : 'Quality', level: PRO[l] },
  { name: l === 'cs' ? 'GSAP animace' : 'GSAP animations', category: 'Frontend', level: PRO[l] },
  { name: 'Git & GitHub', category: l === 'cs' ? 'Nástroje' : 'Tooling', level: ADV[l] },
  { name: 'UI/UX design', category: 'Design', level: PRO[l] },
]

export const content: Record<Lang, Content> = {
  cs: {
    meta: {
      title: 'Erik Karásek | tvůj přátelský sousedský vývojář',
      description: 'Portfolio Erika Karáska. Dělám appky pro počítač, mobil i web: Nexus Grind, LoL Stats a Monster Watch.',
    },
    nav: { about: 'O mně', experience: 'Zkušenosti', skills: 'Dovednosti', projects: 'Projekty', contact: 'Kontakt', symbiote: 'Symbiote mode', menu: 'Menu', soundOn: 'Vypnout zvuk', soundOff: 'Zapnout zvuk' },
    loader: 'Nasazuju masku',
    hero: { tagline: 'Tvůj přátelský sousedský vývojář', cta: 'Prozkoumat projekty', cv: 'Životopis.pdf', cvHref: '/cv/erik-karasek-zivotopis.pdf' },
    marquee: ['Frontend vývoj', 'UI/UX design', 'GSAP animace', 'React Native', 'Desktop appky', 'Riot API', 'Full stack'],
    about: {
      label: 'Za maskou',
      paragraphs: [
        'Ahoj, jsem Erik. Dělám appky pro počítač, mobil i web a nejvíc mě baví, když si můžu udělat všechno sám, od logiky až po to, jak to vypadá. Můj největší projekt je Nexus Grind, tracker produktivity, ve kterém ti za splněné úkoly roste sakura.',
        'Pro sebe jsem si udělal taky LoL Stats, kde si procházím svoje ranked hry, a Monster Watch, který hlídá, kde je zrovna Monster ve slevě. Večer občas streamuju League of Legends a Overwatch, hlavně na Kicku.',
      ],
      stack: 'Co používám nejvíc',
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
          points: ['Helpdesk první úrovně v JIRA, diagnostika a výměna hardwaru.', 'Příprava stanic s Windows, Active Directory, vzdálená správa přes RDP a TeamViewer.'],
        },
        {
          role: 'Specialista zákaznického centra',
          company: 'T-Mobile Czech Republic a.s. · Hradec Králové',
          when: 'prosinec 2025 – únor 2026',
          points: ['Telefonická podpora zákazníků s technickými a smluvními požadavky.', 'Práce s CRM systémy a nabídka produktů a služeb.'],
        },
        {
          role: 'Odborná stáž, 3D grafika',
          company: 'Erasmus+ · Německo',
          when: '2024',
          points: ['3D modely, textury a jednoduché animace v Blenderu.'],
        },
        {
          role: 'Brigádník',
          company: "McDonald's · Hradec Králové",
          when: 'červen 2020 – leden 2024',
          points: ['Rychlý provoz, práce v týmu a směny souběžně se studiem.'],
        },
      ],
    },
    eggs: { venomOn: 'Symbiote se probudil 🕷️', venomOff: 'Symbiote usnul' },
    skills: { label: 'Arzenál', title: 'Technické dovednosti.', items: skills('cs') },
    projects: {
      label: 'Na čem pracuju',
      title: 'Projekty.',
      study: 'Případová studie',
      items: [
        {
          title: 'Nexus Grind',
          description:
            'Tracker produktivity pro Mac a Windows. Hlídá úkoly, návyky, spánek i ranked hry v LoLku a za každou splněnou věc ti roste sakura. Data se synchronizují přes cloud.',
          tags: ['React', 'Tauri', 'Rust', 'Supabase'],
          image: `${IMG}/nexusgrind.webp`,
          downloads: true,
          study: '/nexus-grind/',
        },
        {
          title: 'LoL Stats',
          description:
            'Moje statistiky z ranked her přes Riot API. Tierlist šampionů podle winrate a KDA, statistiky podle lajny, historie her a detail zápasu jako na op.gg. Klíč k API zůstává jen v prohlížeči.',
          tags: ['JavaScript', 'Riot API', 'Chart.js', 'Cloudflare Workers'],
          image: `${IMG}/lolstats.webp`,
          link: 'https://lolstats.erikkarasek2005.workers.dev',
        },
        {
          title: 'Monster Watch',
          description:
            'Hlídá, kde je Monster zrovna v akci. Ukazuje všech 20 příchutí s cenami z aktuálních letáků. Slevy stahuje z kupi.cz backend v Pythonu a appka je zobrazuje ve 3D.',
          tags: ['React Native', 'Expo', 'Python', 'Flask'],
          image: `${IMG}/monsterwatch.webp`,
          link: 'https://monster-watch.onrender.com',
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
      activate: 'Formulář je potřeba jednou aktivovat. Potvrzovací odkaz právě přišel do schránky.',
      failed: 'Zprávu se nepodařilo odeslat. Zkus to prosím znovu.',
      offline: 'Nepodařilo se spojit se serverem. Jsi online?',
      subject: (name) => `Zpráva z portfolia${name ? ` od ${name}` : ''}`,
      socials: 'Najdeš mě i tady',
      liveNow: 'Právě streamuju',
    },
  },
  en: {
    meta: {
      title: 'Erik Karásek | your friendly neighborhood developer',
      description: "Erik Karásek's portfolio. I build desktop, mobile and web apps: Nexus Grind, LoL Stats and Monster Watch.",
    },
    nav: { about: 'About', experience: 'Experience', skills: 'Skills', projects: 'Projects', contact: 'Contact', symbiote: 'Symbiote mode', menu: 'Menu', soundOn: 'Mute sound', soundOff: 'Turn sound on' },
    loader: 'Suiting up',
    hero: { tagline: 'Your friendly neighborhood developer', cta: 'Explore projects', cv: 'Resume.pdf', cvHref: '/cv/erik-karasek-resume.pdf' },
    marquee: ['Frontend development', 'UI/UX design', 'GSAP animations', 'React Native', 'Desktop apps', 'Riot API', 'Full stack'],
    about: {
      label: 'Behind the mask',
      paragraphs: [
        "Hey, I'm Erik. I build apps for desktop, mobile and the web, and I like doing the whole thing myself, from the logic to how it looks. My biggest project is Nexus Grind, a productivity tracker where a sakura tree grows as you finish your tasks.",
        'I also made LoL Stats to go through my ranked games, and Monster Watch, which tells me where Monster is on sale. In the evenings I sometimes stream League of Legends and Overwatch, mostly on Kick.',
      ],
      stack: 'What I use most',
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
          points: ['First-level helpdesk in JIRA, hardware diagnosis and replacement.', 'Windows workstation setup, Active Directory, remote support over RDP and TeamViewer.'],
        },
        {
          role: 'Customer Care Specialist',
          company: 'T-Mobile Czech Republic a.s. · Hradec Králové',
          when: 'December 2025 – February 2026',
          points: ['Phone support for technical and contract requests.', 'Working with CRM systems and offering products and services.'],
        },
        {
          role: 'Internship, 3D graphics',
          company: 'Erasmus+ · Germany',
          when: '2024',
          points: ['3D models, textures and simple animations in Blender.'],
        },
        {
          role: 'Part-time crew member',
          company: "McDonald's · Hradec Králové",
          when: 'June 2020 – January 2024',
          points: ['Fast-paced service, teamwork and shifts alongside my studies.'],
        },
      ],
    },
    eggs: { venomOn: 'The symbiote woke up 🕷️', venomOff: 'The symbiote fell asleep' },
    skills: { label: 'Arsenal', title: 'Technical skills.', items: skills('en') },
    projects: {
      label: 'What I work on',
      title: 'Projects.',
      study: 'Case study',
      items: [
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
        },
        {
          title: 'Monster Watch',
          description:
            'Shows where Monster Energy is on sale. All 20 flavours with prices from the current store flyers. A Python backend pulls the deals from kupi.cz and the app shows them in 3D.',
          tags: ['React Native', 'Expo', 'Python', 'Flask'],
          image: `${IMG}/monsterwatch.webp`,
          link: 'https://monster-watch.onrender.com',
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
    clips: { label: 'From the streams', title: 'Clips.', channel: 'Whole channel', fallback: 'Stream clip' },
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
      activate: 'The form needs a one-time activation. The confirmation link just landed in the inbox.',
      failed: "The message couldn't be sent. Please try again.",
      offline: "Couldn't reach the server. Are you online?",
      subject: (name) => `Portfolio message${name ? ` from ${name}` : ''}`,
      socials: 'Find me here too',
      liveNow: 'Live now',
    },
  },
}
