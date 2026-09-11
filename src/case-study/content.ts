// Text of the Nexus Grind case study page (/nexus-grind/), in both languages.
// Kept apart from src/content.ts so the front page's content stays readable.
import type { Lang } from '../content'

export type CaseStudyContent = {
  meta: { title: string; description: string }
  back: string
  label: string
  title: string
  lead: string
  stats: { value: string; label: string }[]
  problem: { heading: string; body: string[] }
  shotsHeading: string
  shots: { src: string; title: string; text: string }[]
  build: { heading: string; items: { title: string; text: string }[] }
  decisions: { heading: string; items: { title: string; text: string }[] }
  status: { heading: string; body: string[] }
  cta: { text: string; button: string }
}

const shot = (name: string) => `/img/nexus/${name}.webp`

export const caseStudy: Record<Lang, CaseStudyContent> = {
  cs: {
    meta: {
      title: 'Nexus Grind | případová studie | Erik Karásek',
      description: 'Jak vznikl Nexus Grind: tracker úkolů, návyků, spánku a ranked her pro Mac, Windows, iPhone i Android. Jedna sdílená logika, data u tebe v počítači.',
    },
    back: 'Zpět na portfolio',
    label: 'Případová studie',
    title: 'Nexus Grind.',
    lead: 'Tracker produktivity pro Mac, Windows, iPhone i Android. Úkoly, návyky, spánek a ranked hry na jednom místě, a za splněnou práci ti roste sakura. Dělám ho sám od logiky až po to, jak vypadá.',
    stats: [
      { value: 'v1.2.0', label: 'Aktuální verze' },
      { value: '4', label: 'Platformy' },
      { value: '2', label: 'Klienti, jedna logika' },
      { value: '9', label: 'Motivů vzhledu' },
    ],
    problem: {
      heading: 'Co to řeší',
      body: [
        'Úkoly jsem měl v jedné aplikaci, návyky ve druhé, spánek ve třetí a ranked hry v poznámkách. Každá appka viděla jen svůj kousek, takže mi nikdy nedošlo, co spolu souvisí.',
        'Nexus Grind to dá dohromady a hledá souvislosti v mých vlastních datech. Třeba to, že ve dnech, kdy jsem spal aspoň sedm hodin, jsem stihl víc úkolů. Když na takový závěr nemá dost dat, radši mlčí, než aby si vymýšlel.',
        'Druhá půlka je motivace. Za splněný úkol, odškrtnutý návyk nebo zapsaný zápas roste sakura. Když ti spadne streak, začne vadnout. Je to hloupě jednoduché a funguje to na mě líp než jakýkoli graf.',
      ],
    },
    shotsHeading: 'Jak to vypadá',
    shots: [
      {
        src: shot('today'),
        title: 'Dnes',
        text: 'Jedna obrazovka na ráno: prioritní fronta úkolů, návyky na dnešek, ranked přehled a radar termínů. Skóre dne se počítá z opravdu splněných věcí, ne z toho, kolik jsem si toho naplánoval.',
      },
      {
        src: shot('focus'),
        title: 'Soustředění',
        text: 'Blok práce na 30, 60 nebo 90 minut, nebo Pomodoro. Na Macu a iPhonu si umí zapnout Zkratku pro režim Nerušit, takže se ztiší i zbytek systému.',
      },
      {
        src: shot('habits'),
        title: 'Návyky',
        text: 'Streaky a úspěšnost, plus mřížka posledních čtrnácti dnů. Zapomenutý den jde doplnit zpětně: streak se vrátí, ale XP za něj nedostaneš a budoucí den appka nepustí.',
      },
      {
        src: shot('ranked'),
        title: 'Ranked',
        text: 'Log zápasů z League of Legends, dopočítávání LP, projekce dalšího ranku a hlídání tiltu. Po dvou prohrách v řadě appka doporučí stop, protože přesně tam mi to vždycky ujelo.',
      },
      {
        src: shot('insights'),
        title: 'Insighty',
        text: 'Týdenní trend proti minulému týdnu a odznaky za skutečné milníky. Průměry zůstanou prázdné, když není z čeho počítat, místo aby ukázaly nulu.',
      },
    ],
    build: {
      heading: 'Jak je to postavené',
      items: [
        {
          title: 'Jedna logika pro obě appky',
          text: 'Všechny výpočty (skóre dne, streaky, XP, projekce LP, odznaky, insighty) žijí v balíku packages/domain, který importuje desktop i mobil. Nemůže se tak stát, že by streak na telefonu vyšel jinak než na počítači. Ta část má vlastní unit testy.',
        },
        {
          title: 'Desktop v Tauri',
          text: 'React a Vite uvnitř Tauri, tedy nativní okno s Rustem místo celého prohlížeče jako u Electronu. Aplikace je díky tomu řádově menší a startuje hned. Build pro macOS i Windows dělá jedna GitHub Actions pipeline.',
        },
        {
          title: 'Mobil v React Native',
          text: 'Expo pro iOS a Android. Navíc umí to, co má smysl jen na telefonu: Apple Health a Health Connect, zápis úkolů a termínů do samostatného kalendáře a připomínky, které tě otevřou rovnou na správné obrazovce.',
        },
        {
          title: 'Data nejdřív u tebe',
          text: 'Appka funguje bez účtu a bez internetu, data jsou uložená v zařízení. Synchronizace přes Supabase je dobrovolná, zapíná se přihlášením a na serveru je každý uživatel oddělený přes RLS. Účet jde smazat přímo v appce.',
        },
        {
          title: 'CI, která hlídá zbytek',
          text: 'Každý push projde lintem, testy a typovou kontrolou a postaví instalačku pro Windows, appku pro macOS a APK pro Android. Vydání nové verze je pak jen tag.',
        },
      ],
    },
    decisions: {
      heading: 'Rozhodnutí, která stála nejvíc přemýšlení',
      items: [
        {
          title: 'Update nesmí sežrat data',
          text: 'Uložený stav se při načtení kontroluje a dorovnává. Když se v souboru objeví něco, čemu nová verze nerozumí, appka spadne zpátky na prázdný stav místo bílého okna. Seznam motivů je navíc napsaný tak, že přidání nového motivu bez aktualizace seznamu neprojde buildem.',
        },
        {
          title: 'Radši ticho než výmysl',
          text: 'Insighty i předpovědi se ukážou, až je z čeho počítat. Bez týdne historie, bez tempa nebo u příliš vzdáleného cíle appka neřekne nic. Falešná jistota by byla horší než prázdné místo.',
        },
        {
          title: 'Prázdná appka po instalaci',
          text: 'Čerstvá instalace nemá žádná ukázková data. Demo data existují, ale jen pro testy a screenshoty, třeba pro ty tady. Nikdo nechce mazat cizí úkoly, aby mohl začít.',
        },
        {
          title: 'Citlivé věci zůstávají v zařízení',
          text: 'Volitelné napojení na Trading 212 je jen pro čtení a API klíč se nikdy nesynchronizuje. Záložka Portfolio se objeví, až klíč zadáš.',
        },
      ],
    },
    status: {
      heading: 'Kde to je teď',
      body: [
        'Appka běží ve verzi 1.2.0 na Macu, Windows i telefonu a používám ji každý den. Cloudová synchronizace je hotová včetně databázových migrací.',
        'Teď řeším podpis aplikace, účty v obchodech a hostování aktualizací, aby šla instalace bez varování systému.',
      ],
    },
    cta: { text: 'Chceš si to zkusit?', button: 'Stáhnout Nexus Grind' },
  },
  en: {
    meta: {
      title: 'Nexus Grind | case study | Erik Karásek',
      description: 'How Nexus Grind was built: a tracker for tasks, habits, sleep and ranked games on Mac, Windows, iPhone and Android. One shared core, your data stays on your device.',
    },
    back: 'Back to portfolio',
    label: 'Case study',
    title: 'Nexus Grind.',
    lead: 'A productivity tracker for Mac, Windows, iPhone and Android. Tasks, habits, sleep and ranked games in one place, with a sakura tree that grows as you get things done. I build all of it, from the logic to the way it looks.',
    stats: [
      { value: 'v1.2.0', label: 'Current version' },
      { value: '4', label: 'Platforms' },
      { value: '2', label: 'Clients, one core' },
      { value: '9', label: 'Themes' },
    ],
    problem: {
      heading: 'What it solves',
      body: [
        'My tasks lived in one app, habits in another, sleep in a third and ranked games in my notes. Each app saw its own slice, so I never noticed what was connected to what.',
        'Nexus Grind puts it together and looks for patterns in my own data, like the fact that on days I slept seven hours or more I finished more tasks. When there is not enough data behind a claim, it stays quiet instead of making something up.',
        'The other half is motivation. Finishing a task, ticking a habit or logging a match grows a sakura tree, and a broken streak makes it wilt. It is almost stupidly simple, and it works on me better than any chart.',
      ],
    },
    shotsHeading: 'What it looks like',
    shots: [
      {
        src: shot('today'),
        title: 'Today',
        text: 'One screen for the morning: the priority queue, habits due today, a ranked pulse and a deadline radar. The daily score counts what actually got done, not what I planned.',
      },
      {
        src: shot('focus'),
        title: 'Focus',
        text: 'A 30, 60 or 90 minute block, or Pomodoro. On Mac and iPhone it can trigger your Do Not Disturb Shortcut, so the rest of the system goes quiet with it.',
      },
      {
        src: shot('habits'),
        title: 'Habits',
        text: 'Streaks and success rate, plus a grid of the last fourteen days. A forgotten day can be filled in later: the streak comes back, no XP is paid for it, and the app refuses future days.',
      },
      {
        src: shot('ranked'),
        title: 'Ranked',
        text: 'A League of Legends match log, LP reconciliation, a projection of the next rank and tilt warnings. After two losses in a row it suggests stopping, because that is exactly where it always got away from me.',
      },
      {
        src: shot('insights'),
        title: 'Insights',
        text: 'This week against the last one, and badges for real milestones. Averages stay empty when there is nothing to average, instead of showing a zero.',
      },
    ],
    build: {
      heading: 'How it is built',
      items: [
        {
          title: 'One core for both apps',
          text: 'Every calculation (daily score, streaks, XP, LP projection, badges, insights) lives in packages/domain, which both the desktop and the mobile client import. A streak can never come out different on the phone than on the computer. That part has its own unit tests.',
        },
        {
          title: 'Desktop on Tauri',
          text: 'React and Vite inside Tauri, a native window backed by Rust instead of shipping a whole browser the way Electron does. The app is far smaller and starts instantly. One GitHub Actions pipeline builds it for macOS and Windows.',
        },
        {
          title: 'Mobile in React Native',
          text: 'Expo for iOS and Android, plus the things that only make sense on a phone: Apple Health and Health Connect, dated tasks mirrored into their own calendar, and reminders that deep-link straight to the right screen.',
        },
        {
          title: 'Local first',
          text: 'The app works with no account and no internet, and the data sits on the device. Sync through Supabase is opt-in, starts when you sign in, and every user is separated on the server by row level security. The account can be deleted from inside the app.',
        },
        {
          title: 'CI that watches the rest',
          text: 'Every push runs lint, tests and typechecks, and builds the Windows installer, the macOS app and an Android APK. Shipping a version is then just a tag.',
        },
      ],
    },
    decisions: {
      heading: 'The decisions that took the most thinking',
      items: [
        {
          title: 'An update must not eat your data',
          text: 'The stored state is validated and normalised on load. If it holds something a new version does not understand, the app falls back to an empty state instead of a white window. The theme list is written so that adding a theme without updating it fails the build.',
        },
        {
          title: 'Silence beats a guess',
          text: 'Insights and forecasts only appear once there is something to base them on. Without a week of history, without a pace, or past a far-off horizon, the app says nothing. False confidence would be worse than an empty spot.',
        },
        {
          title: 'A fresh install is empty',
          text: "A new install carries no sample data. Demo data exists, but only for tests and screenshots, including the ones above. Nobody wants to delete someone else's tasks before they can start.",
        },
        {
          title: 'Sensitive things stay on the device',
          text: 'The optional Trading 212 connection is read-only and the API key is never synced. The Portfolio tab only shows up once you enter one.',
        },
      ],
    },
    status: {
      heading: 'Where it is now',
      body: [
        'The app runs at version 1.2.0 on Mac, Windows and phones, and I use it every day. Cloud sync is finished, database migrations included.',
        'Right now I am working on code signing, store accounts and update hosting, so installing it does not come with a system warning.',
      ],
    },
    cta: { text: 'Want to try it?', button: 'Download Nexus Grind' },
  },
}
