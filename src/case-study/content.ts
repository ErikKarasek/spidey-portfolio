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
  cta: { text: string; button: string; href?: string }  // no href = the Nexus Grind download buttons
}

const shot = (name: string) => `/img/case/nexus/${name}.webp`

const nexusGrind: Record<Lang, CaseStudyContent> = {
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

const lolStats: Record<Lang, CaseStudyContent> = {
  cs: {
    meta: {
      title: 'LoL Stats | případová studie | Erik Karásek',
      description: 'Vlastní statistiky z League of Legends přes Riot API. Tierlist šampionů podle mé winrate, rozbor podle lajny a detail zápasu. API klíč zůstává v prohlížeči.',
    },
    back: 'Zpět na portfolio',
    label: 'Případová studie',
    title: 'LoL Stats.',
    lead: 'Web, který si z Riot API stáhne moje ranked zápasy a spočítá z nich to, co mě zajímá: kterým šampionům se mnou opravdu daří, jak mi jde která lajna a co se dělo v konkrétní hře. API klíč přitom nikdy neopustí prohlížeč.',
    stats: [
      { value: '200', label: 'Her na jedno načtení' },
      { value: '5', label: 'Herních front' },
      { value: '0', label: 'Serverů, kde leží tvůj klíč' },
      { value: 'EUNE', label: 'Region' },
    ],
    problem: {
      heading: 'Co to řeší',
      body: [
        'Stránky jako op.gg ukazují průměry všech hráčů. Mě ale nezajímá, jak je šampion dobrý obecně, ale jak je dobrý se mnou. To je často úplně jiné číslo.',
        'Tak jsem si udělal vlastní tierlist: zápasy si stáhnu přes Riot API, spočítám z nich winrate a KDA na šampiona a seřadím je podle sebe. K tomu rozbor podle lajny, historie her a detail zápasu ve stylu op.gg.',
      ],
    },
    shotsHeading: 'Jak to vypadá',
    shots: [
      {
        src: '/img/case/lolstats-start.webp',
        title: 'Načtení dat',
        text: 'Zadáš Riot ID, vlastní API klíč, frontu a kolik her chceš. Web rovnou říká, kde klíč vzít, že platí 24 hodin a že se nikam neodesílá. Dvě stě her se stahuje minutu až dvě, protože Riot API má limity a nemá smysl je obcházet.',
      },
      {
        src: '/img/case/lolstats-overview.webp',
        title: 'Přehled a tierlist',
        text: 'Moje skutečná data: winrate, průměrné KDA, nejhranější šampion, rozdíl mezi modrou a červenou stranou. Pod tím tierlist seřazený podle toho, jak se šampionům daří se mnou, ne podle obecných průměrů.',
      },
      {
        src: '/img/case/lolstats-history.webp',
        title: 'Historie zápasů',
        text: 'Každý zápas s výsledkem, KDA, lajnou, buildem a poškozením. Filtry nahoře přepínají lajnu a řazení, takže jde rychle najít třeba jen jungle hry.',
      },
      {
        src: '/img/case/lolstats-detail.webp',
        title: 'Detail zápasu',
        text: 'Rozpad celé hry po obou týmech: KDA, poškození, CS, gold, wardy a itemy. Přezdívky ostatních hráčů jsem na obrázku rozmazal, v appce jsou samozřejmě vidět.',
      },
    ],
    build: {
      heading: 'Jak je to postavené',
      items: [
        {
          title: 'Běží na Cloudflare Workers',
          text: 'Celý web je statický a hostovaný na Cloudflare Workers, takže se nestará o server a je zdarma i při nule návštěv. Žádná databáze, žádné přihlašování.',
        },
        {
          title: 'Data tahá prohlížeč',
          text: 'Volání Riot API dělá přímo prohlížeč tvým klíčem. Výpočty (winrate, KDA, rozpad podle lajny) běží taky v prohlížeči, grafy kreslí Chart.js.',
        },
        {
          title: 'Klíč zůstává u tebe',
          text: 'Klíč se neukládá ani neposílá na žádný můj server. Riot dává vývojářský klíč s platností 24 hodin, takže se stejně každý den obnovuje. To je pro takovouhle hračku ta nejbezpečnější varianta.',
        },
      ],
    },
    decisions: {
      heading: 'Rozhodnutí, která stála nejvíc přemýšlení',
      items: [
        {
          title: 'Raději pomalu než zablokovaně',
          text: 'Riot API má přísné limity na počet dotazů. Načítání sta her proto trvá minutu až dvě a web to dopředu říká, místo aby to vypadalo, že zamrzl.',
        },
        {
          title: 'Vlastní čísla místo cizích průměrů',
          text: 'Tierlist se počítá jen z mých zápasů. Když jsem s někým hrál pětkrát, je to vidět, a číslo neberu jako hotovou pravdu.',
        },
      ],
    },
    status: {
      heading: 'Kde to je teď',
      body: ['Web běží a používám ho po ranked session. Dál by mi dávalo smysl ukládat si historii mezi načteními, aby šlo srovnávat sezony.'],
    },
    cta: { text: 'Chceš to zkusit?', button: 'Otevřít LoL Stats', href: 'https://lolstats.erikkarasek2005.workers.dev' },
  },
  en: {
    meta: {
      title: 'LoL Stats | case study | Erik Karásek',
      description: 'My own League of Legends stats through the Riot API. A champion tier list from my own win rate, a breakdown by lane and match detail. The API key stays in the browser.',
    },
    back: 'Back to portfolio',
    label: 'Case study',
    title: 'LoL Stats.',
    lead: 'A site that pulls my ranked matches from the Riot API and works out what I actually care about: which champions do well with me, how each lane is going and what happened in a given game. The API key never leaves the browser.',
    stats: [
      { value: '200', label: 'Matches per load' },
      { value: '5', label: 'Queue types' },
      { value: '0', label: 'Servers holding your key' },
      { value: 'EUNE', label: 'Region' },
    ],
    problem: {
      heading: 'What it solves',
      body: [
        'Sites like op.gg show averages across every player. I do not care how good a champion is in general, I care how good it is with me, and that is often a very different number.',
        'So I built my own tier list: matches come from the Riot API, win rate and KDA per champion are worked out from them, and the list is sorted by me. Plus a breakdown by lane, match history and an op.gg style match detail.',
      ],
    },
    shotsHeading: 'What it looks like',
    shots: [
      {
        src: '/img/case/lolstats-start.webp',
        title: 'Loading your data',
        text: 'You enter your Riot ID, your own API key, a queue and how many games to fetch. The page says up front where to get the key, that it lasts 24 hours and that it is never sent anywhere. Two hundred games take a minute or two, because the Riot API has rate limits and there is no point fighting them.',
      },
      {
        src: '/img/case/lolstats-overview.webp',
        title: 'Overview and tier list',
        text: 'My real data: win rate, average KDA, most played champion, the gap between blue and red side. Below it, a tier list sorted by how champions do with me rather than by everyone else\u2019s averages.',
      },
      {
        src: '/img/case/lolstats-history.webp',
        title: 'Match history',
        text: 'Every game with its result, KDA, lane, build and damage. The filters on top switch lane and ordering, so finding just the jungle games takes a second.',
      },
      {
        src: '/img/case/lolstats-detail.webp',
        title: 'Match detail',
        text: 'The whole game broken down across both teams: KDA, damage, CS, gold, wards and items. Other players\u2019 names are blurred in this screenshot; in the app they are of course visible.',
      },
    ],
    build: {
      heading: 'How it is built',
      items: [
        {
          title: 'Runs on Cloudflare Workers',
          text: 'The whole site is static and hosted on Cloudflare Workers, so there is no server to look after and it costs nothing at zero traffic. No database, no sign-in.',
        },
        {
          title: 'The browser fetches the data',
          text: 'The Riot API is called straight from the browser with your key. The maths (win rate, KDA, the per-lane breakdown) happens in the browser too, and Chart.js draws the charts.',
        },
        {
          title: 'The key stays with you',
          text: 'The key is never stored and never sent to a server of mine. Riot hands out a developer key that expires after 24 hours anyway, so for a toy like this that is the safest option there is.',
        },
      ],
    },
    decisions: {
      heading: 'The decisions that took the most thinking',
      items: [
        {
          title: 'Slow beats blocked',
          text: 'The Riot API limits how many requests you may make. Loading a hundred games therefore takes a minute or two, and the page says so in advance instead of looking frozen.',
        },
        {
          title: "My numbers, not someone else's averages",
          text: 'The tier list is built from my matches only. If I played a champion five times, that shows, and I do not treat the number as settled truth.',
        },
      ],
    },
    status: {
      heading: 'Where it is now',
      body: ['The site is up and I use it after a ranked session. The obvious next step is keeping history between loads, so seasons can be compared.'],
    },
    cta: { text: 'Want to try it?', button: 'Open LoL Stats', href: 'https://lolstats.erikkarasek2005.workers.dev' },
  },
}

const monsterWatch: Record<Lang, CaseStudyContent> = {
  cs: {
    meta: {
      title: 'Monster Watch | případová studie | Erik Karásek',
      description: 'Appka, která hlídá, kde je Monster ve slevě. Ceny z letáků stahuje backend v Pythonu, mobilní appka je ukazuje jako mřížku příchutí.',
    },
    back: 'Zpět na portfolio',
    label: 'Případová studie',
    title: 'Monster Watch.',
    lead: 'Appka, která na jedné obrazovce ukáže všechny příchutě Monsteru a cenu, za kterou je zrovna někde v akci. Data si tahá vlastní backend z letáků a appku otevírá 3D animace plechovky.',
    stats: [
      { value: '20', label: 'Příchutí' },
      { value: '2', label: 'Služby: appka a API' },
      { value: '3D', label: 'Úvodní animace' },
      { value: 'Kč', label: 'Ceny z letáků' },
    ],
    problem: {
      heading: 'Co to řeší',
      body: [
        'Monster je skoro pořád někde v akci, jenže v jiném obchodě a v jiný týden. Projít kvůli plechovce pět letáků je otrava.',
        'Monster Watch to udělá za tebe: sesbírá aktuální akce, přiřadí je k příchutím a ukáže je jako mřížku plechovek s cenou a obchodem. Když někde akce není, plechovka to přizná, místo aby ukazovala starou cenu.',
      ],
    },
    shotsHeading: 'Jak to vypadá',
    shots: [
      {
        src: '/img/case/monster-grid.webp',
        title: 'Přehled příchutí',
        text: 'Každá plechovka má cenu, štítek s obchodem a označení, že jde o akci z letáku. Vzhled je schválně jako herní HUD, protože tomu odpovídá i značka.',
      },
    ],
    build: {
      heading: 'Jak je to postavené',
      items: [
        {
          title: 'Appka v React Native',
          text: 'Mobilní appka přes Expo, takže jeden kód pro iOS i Android a web. Na úvod se přehraje 3D animace plechovky, pak už jde o mřížku příchutí s cenami.',
        },
        {
          title: 'Vlastní API v Pythonu',
          text: 'Backend ve Flasku běží zvlášť a jeho jediná práce je sbírat akce z letáků a vydat je jako jednoduché JSON API. Appka tak nikdy nesahá na cizí web přímo.',
        },
        {
          title: 'Dvě služby, dvě nasazení',
          text: 'Appka i API běží na Renderu. Oddělené jsou schválně: když se změní struktura letáků, opravuju jen backend a appka zůstává, jak je.',
        },
      ],
    },
    decisions: {
      heading: 'Rozhodnutí, která stála nejvíc přemýšlení',
      items: [
        {
          title: 'Scraping patří na server',
          text: 'Kdyby data tahala appka sama, rozbila by se každému uživateli ve chvíli, kdy zdroj změní stránku. Takhle stačí nasadit nový backend a všem to začne fungovat zpátky.',
        },
        {
          title: 'Žádná cena je lepší než stará cena',
          text: 'Když k příchuti není aktuální akce, appka to řekne. Zobrazit cenu z minulého týdne by znamenalo poslat člověka do obchodu zbytečně.',
        },
      ],
    },
    status: {
      heading: 'Kde to je teď',
      body: [
        'Appka i API běží na bezplatném tarifu Renderu, takže po delší nečinnosti chvíli trvá, než se backend probudí. První načtení proto může být pomalejší.',
      ],
    },
    cta: { text: 'Chceš to zkusit?', button: 'Otevřít Monster Watch', href: 'https://monster-watch.onrender.com' },
  },
  en: {
    meta: {
      title: 'Monster Watch | case study | Erik Karásek',
      description: 'An app that tracks where Monster is on sale. A Python backend collects prices from shop leaflets and the app shows them as a grid of flavours.',
    },
    back: 'Back to portfolio',
    label: 'Case study',
    title: 'Monster Watch.',
    lead: 'An app that shows every Monster flavour on one screen, along with the price it is currently discounted to. A backend of my own collects the deals from shop leaflets, and a 3D can animation opens the app.',
    stats: [
      { value: '20', label: 'Flavours' },
      { value: '2', label: 'Services: app and API' },
      { value: '3D', label: 'Intro animation' },
      { value: 'CZK', label: 'Prices from leaflets' },
    ],
    problem: {
      heading: 'What it solves',
      body: [
        'Monster is almost always on sale somewhere, just in a different shop and a different week. Going through five leaflets for a can of energy drink is a chore.',
        "Monster Watch does it for you: it collects the current deals, matches them to flavours and shows them as a grid of cans with a price and a shop. When there is no deal, the can says so instead of showing last week's price.",
      ],
    },
    shotsHeading: 'What it looks like',
    shots: [
      {
        src: '/img/case/monster-grid.webp',
        title: 'The flavour grid',
        text: 'Every can carries a price, a shop tag and a mark saying the deal comes from a leaflet. The look is deliberately a game HUD, which is about right for the brand.',
      },
    ],
    build: {
      heading: 'How it is built',
      items: [
        {
          title: 'React Native app',
          text: 'The mobile app runs on Expo, so one codebase covers iOS, Android and the web. A 3D can animation plays on open, then it is a grid of flavours with prices.',
        },
        {
          title: 'A Python API of my own',
          text: "A Flask backend runs separately, and its only job is to collect the leaflet deals and serve them as a simple JSON API. The app never touches someone else's site directly.",
        },
        {
          title: 'Two services, two deployments',
          text: 'The app and the API both run on Render, kept apart on purpose: when the leaflets change shape, I fix the backend and the app stays exactly as it is.',
        },
      ],
    },
    decisions: {
      heading: 'The decisions that took the most thinking',
      items: [
        {
          title: 'Scraping belongs on a server',
          text: 'If the app fetched the data itself, it would break for every user the moment the source changed its pages. This way I deploy a new backend and everyone is working again.',
        },
        {
          title: 'No price beats a stale price',
          text: "When a flavour has no current deal, the app says so. Showing last week's price would send someone to the shop for nothing.",
        },
      ],
    },
    status: {
      heading: 'Where it is now',
      body: ["Both the app and the API sit on Render's free tier, so after a quiet spell the backend needs a moment to wake up and the first load can be slow."],
    },
    cta: { text: 'Want to try it?', button: 'Open Monster Watch', href: 'https://monster-watch.onrender.com' },
  },
}

/** Every case study, keyed by the folder it is published under (/nexus-grind/, /lol-stats/, …). */
export const studies = {
  'nexus-grind': nexusGrind,
  'lol-stats': lolStats,
  'monster-watch': monsterWatch,
} satisfies Record<string, Record<Lang, CaseStudyContent>>

export type StudySlug = keyof typeof studies
