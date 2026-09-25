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
    label: 'O projektu',
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
    label: 'About the project',
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
    label: 'O projektu',
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
    label: 'About the project',
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
    label: 'O projektu',
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
    label: 'About the project',
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

const jobTracker: Record<Lang, CaseStudyContent> = {
  cs: {
    meta: {
      title: 'Job Tracker | případová studie | Erik Karásek',
      description: 'Kanban na sledování přihlášek do práce, postavený na Cloudflare D1 a Hono. Scout každé ráno projde inzeráty na Jobs.cz a agent z nich udělá ohodnocené karty ke schválení.',
    },
    back: 'Zpět na portfolio',
    label: 'O projektu',
    title: 'Job Tracker.',
    lead: 'Kanban na hledání práce. Každá pozice je karta, kterou posouváš přes fáze od „zajímavé“ až po nabídku nebo zamítnutí. Nad tím jsou statistiky, které počítají z historie přechodů, ne z toho, kde karta leží dneska. A od září hledá inzeráty scout, který každé ráno projde Jobs.cz sám.',
    stats: [
      { value: '5', label: 'Fází náboru' },
      { value: '30', label: 'Ohodnocených inzerátů denně' },
      { value: '3', label: 'AI agenti v provozu' },
      { value: 'D1', label: 'SQLite na edge' },
    ],
    problem: {
      heading: 'Co to řeší',
      body: [
        'Hledání práce se obvykle odehrává v tabulce, která má sloupce „firma“, „kdy jsem psal“ a „odpověděli?“. Funguje to do chvíle, než je přihlášek dvacet. Pak přestaneš vědět, u kterých se dlouho nic nestalo, a hlavně ti nikdy neřekne, jestli je problém v tom, že se málo hlásíš, nebo v tom, že tě po pohovoru nikdo nechce.',
        'Job Tracker je na to postavený jako board: karta nese firmu, roli, odkaz na inzerát, lokaci, mzdové rozpětí, zdroj a poznámky, a posouvá se přes fáze wishlist → applied → interview → offer nebo rejected.',
        'Druhá polovina je statistika. Funnel ukazuje, kolik přihlášek se kterou fází vůbec prošlo, timeline kolik jich denně přibylo, a samostatný seznam hlídá ty, u kterých už dlouho nebyla žádná aktivita, aby nezapadly.',
        'Zůstávala poslední rutina: každý den ručně projít inzertní weby. Tu teď dělá scout: každé ráno sám prochází IT obory na Jobs.cz, nabídky přečte, ohodnotí a připraví jako karty do schránky. Já jen řeknu ano, nebo ne.',
      ],
    },
    shotsHeading: 'Jak to vypadá',
    shots: [
      {
        src: '/img/case/jobtracker-board.webp',
        title: 'Board',
        text: 'Pět sloupců podle fáze, karta se posouvá výběrem cílové fáze. Když se u přihlášky dlouho nic nestalo, dostane štítek s počtem dní ticha, a to přímo na kartě, ne schovaný ve statistikách. (Na snímku jsou ukázková data.)',
      },
      {
        src: '/img/case/jobtracker-editor.webp',
        title: 'Detail karty',
        text: 'Editace v panelu vedle boardu: odkaz na inzerát, lokalita, zdroj, mzdové rozpětí a poznámky. Mzda je uložená jako dvě čísla, ne jako text, aby se s ní dalo později počítat.',
      },
      {
        src: '/img/case/jobtracker-stats.webp',
        title: 'Statistiky',
        text: 'Nahoře poměry mezi fázemi, pod tím kolik přihlášek kterou fází prošlo, denní timeline a seznam těch, kde je potřeba se připomenout.',
      },
    ],
    build: {
      heading: 'Jak je to postavené',
      items: [
        {
          title: 'Jeden deploy pro frontend i API',
          text: 'React 19 s Vite se sestaví do statických souborů, API je Hono běžící jako Cloudflare Pages Function na catch-all routě /api/*. Obojí jde ven jedním nasazením, takže neexistuje stav, kdy je web novější než API.',
        },
        {
          title: 'Cloudflare D1 jako databáze',
          text: 'SQLite běžící na edge. Schéma má tabulku applications se samotnými přihláškami a status_events, kam se zapisuje každý přechod mezi fázemi. Vývoj běží přes wrangler pages dev, který nastartuje Pages Functions i D1 lokálně.',
        },
        {
          title: 'Žádná knihovna na state',
          text: 'Data drží vlastní hook useBoardData nad fetch API. Na aplikaci, která má jeden zdroj pravdy a pár akcí, je Redux nebo podobná knihovna víc kódu než užitku.',
        },
        {
          title: 'Agent, ne jedna otázka do modelu',
          text: 'Z inzerátu dělá kartu model s nástroji: umí si stáhnout stránku inzerátu, prohledat board na duplicitní přihlášku u stejné firmy a nakonec odevzdat hotový návrh karty. Běhá v cyklu, dokud návrh neodevzdá, nejvýš šest kol. Vedle údajů z inzerátu připíše i skóre, jak sedí na můj profil, a krátký průvodní dopis v jazyce inzerátu.',
        },
        {
          title: 'Scout jako plán práce na den',
          text: 'Cron budí worker každých pět minut přes ráno a každé probuzení udělá první věc, která ještě dneska chybí: další stránku výsledků, další ohodnocený inzerát, nebo shrnující e-mail. Co je hotové, si píše do tabulky v D1, takže se nic neudělá dvakrát.',
        },
        {
          title: 'Příprava na pohovor',
          text: 'Když karta dojde do fáze pohovoru, vyrazí druhý agent: začne u inzerátu, najde web firmy a projde pár jeho stránek, než napíše brief: co firma dělá, osm až deset pravděpodobných otázek i s odpovědí opřenou o moje skutečné zkušenosti, co si zopakovat a na co se jich zeptat. Ráno den před pohovorem mi ho scout pošle e-mailem.',
        },
        {
          title: 'Životopis na míru inzerátu',
          text: 'Tlačítko na kartě přečte inzerát a jedním voláním modelu přeskládá můj životopis: projekty, dovednosti a technologie v pořadí, které danou roli zajímá, plus přepsaný nadpis a profil. Vykreslí se ve stejném vzhledu jako PDF na webu a uloží se přes tisk do PDF.',
        },
        {
          title: 'TypeScript na obou stranách',
          text: 'Typy Application a Stage jsou sdílené mezi frontendem a API, takže přejmenování fáze neprojde buildem, dokud ho nedotáhnu do obou půlek.',
        },
      ],
    },
    decisions: {
      heading: 'Rozhodnutí, která stála nejvíc přemýšlení',
      items: [
        {
          title: 'Funnel se počítá z historie, ne ze současnosti',
          text: 'Kdyby se počítalo z aktuálního sloupce, přihláška zamítnutá po pohovoru by ve statistice vypadala, jako by k pohovoru nikdy nedošlo a úspěšnost pohovorů by vycházela směšně nízko. Proto se každý přechod loguje do status_events a funnel počítá, kolik přihlášek danou fází někdy prošlo.',
        },
        {
          title: 'Ticho je taky informace',
          text: 'Seznam „needs follow-up“ bere přihlášky, u kterých je poslední aktivita starší než zvolený počet dní, a schválně z nich vynechává nabídky a zamítnutí, tam už není co urgovat. Prahová hodnota je parametr dotazu, ne zadrátované číslo.',
        },
        {
          title: 'Čtení veřejné, zápis za klíčem, při pochybnosti zamčeno',
          text: 'Case study na tenhle board odkazuje, takže adresa není tajná a spoléhat na to, že ji nikdo nenajde, není ochrana. Prohlížení je proto otevřené a mění data jen ten, kdo má klíč. Zamyká se to navíc „do bezpečné strany“: instance, které nikdo klíč nenastavil, čtení obslouží a každý zápis odmítne. Dokud se na heslo nezapomene, je zavřeno, ne otevřeno.',
        },
        {
          title: 'Model až jako poslední krok',
          text: 'Levné filtry běží první: inzeráty se seniorem v názvu nebo mimo IT vypadnou dřív, než na ně padne jediné volání modelu, a stránka se přečte ještě předtím, než se model vůbec zavolá. A model se volí podle úkolu: skóre shody dává malý model (Llama 3.1 8B) za zhruba dvacetinu ceny a řadí nabídky stejně jako ten velký, jenže si u tří ze čtyř inzerátů bez mzdy mzdu vymyslel. Mzdu proto čte kód přímo z řádku „Plat“ na Jobs.cz. Průvodní dopis píše větší model, a jen když o něj u nabídky požádám. Každá AI funkce má navíc v D1 vlastní denní rozpočet, takže žádná nevyčerpá den za ostatní.',
        },
        {
          title: 'Nic se na board nedostane beze mě',
          text: 'Agent kartu jen navrhne. Přistane ve schránce, kde ji přijmu nebo zahodím, a teprve přijetí ji zapíše na board. Bál jsem se, že si automat nahází dvacet nabídek denně a board přestane být můj. Takhle zůstává rozhodnutí na člověku a robot dělá to otravné hledání.',
        },
        {
          title: 'Agentovi, který si vybírá, kam klikne, se musí ohradit prostor',
          text: 'Příprava na pohovor je jediný agent, který si sám volí cestu: dostane nástroj „přečti stránku“ a rozhoduje, kterým odkazem půjde dál. To se nedá ošetřit prosbou v promptu, takže hranice hlídá kód: smí otevřít jen inzerát, stránky, na které vedl odkaz z už přečtené stránky, a doménu, která nese jméno firmy, nejvýš čtyři stránky a sedm kol. Model rozhoduje, kód drží mantinely.',
        },
        {
          title: 'Model smí přeskládat, ne vymýšlet',
          text: 'U životopisu na míru je svoboda modelu schválně malá: může měnit pořadí a přepsat nadpis s profilem, ale každý název projektu, dovednosti a technologie, který vrátí, se porovná s mým skutečným životopisem a co chybí, se vrátí zpátky. Životopis, do kterého by model přidal zkušenost, kterou nemám, je horší než žádný.',
        },
        {
          title: 'Mzda jako rozpětí, ne jako text',
          text: 'salary_min a salary_max jsou čísla. Uložit „55–70k dle zkušeností“ jako řetězec je pohodlné při psaní a k ničemu při jakémkoli pozdějším třídění nebo porovnání.',
        },
      ],
    },
    status: {
      heading: 'Kde to je teď',
      body: [
        'Běží to na Cloudflare Pages a je to funkční od schématu databáze až po grafy. Snímky výše jsou z ukázkových dat, ne ze skutečných přihlášek.',
        'Board je schválně veřejně čitelný: když sem někdo přijde z portfolia, má si ho prohlédnout. Měnit data ale může jen ten, kdo zná klíč: zápisy chtějí sdílené heslo v hlavičce, prohlížeč si ho drží jen u sebe a v samotné appce není. Bez klíče se ovládací prvky vůbec neukážou.',
        'Tři modely dělají tři různé práce: agent z inzerátu (nástroje, pevná cesta), jedno volání na životopis na míru a navigující agent na přípravu k pohovoru. Všechny běží na Workers AI, takže se nikde neválí API klíč a všechny sdílejí jeden denní příděl.',
        'Scout jede od 24. září 2026: prochází tři IT obory na Jobs.cz pro Hradec Králové s okolím a pro práci z domova, kolem půl desáté ráno pošle e-mailem shrnutí. Z inzerátů, které projdou filtry, jich třicet denně dostane skóre.',
        'Když si ho otevřeš, najdeš prázdné sloupce. Není to chyba: svoje skutečné přihlášky si tam nechávám pro sebe a vymýšlet si data jen kvůli tomu, aby screenshot vypadal líp, se mi nechtělo. Jak to vypadá naplněné, ukazují snímky výše.',
      ],
    },
    cta: { text: 'Chceš se podívat?', button: 'Otevřít board', href: 'https://job-tracker-10s.pages.dev' },
  },
  en: {
    meta: {
      title: 'Job Tracker | case study | Erik Karásek',
      description: 'A kanban board for job applications, built on Cloudflare D1 and Hono. A scout reads the Jobs.cz listings every morning and an agent turns them into scored cards waiting for approval.',
    },
    back: 'Back to portfolio',
    label: 'About the project',
    title: 'Job Tracker.',
    lead: 'A kanban board for a job hunt. Every role is a card you move through the stages, from "worth a look" to an offer or a rejection. On top of it sit stats that count from the history of stage changes, not from where a card happens to sit today.',
    stats: [
      { value: '5', label: 'Hiring stages' },
      { value: '30', label: 'Postings scored a day' },
      { value: '3', label: 'AI agents running' },
      { value: 'D1', label: 'SQLite on the edge' },
    ],
    problem: {
      heading: 'What it solves',
      body: [
        'A job hunt usually lives in a spreadsheet with columns for company, date sent and "did they reply?". That works until you are twenty applications in. Then you stop knowing which ones have gone quiet, and it never tells you whether the problem is that you are not applying enough or that nobody wants you after the interview.',
        'Job Tracker is a board instead. A card carries the company, the role, a link to the posting, location, salary range, where you found it and your notes, and moves through wishlist → applied → interview → offer or rejected.',
        'The other half is the stats. A funnel shows how many applications ever got through each stage, a timeline shows how many you started per day, and a separate list watches the ones with no activity for a while so they do not quietly disappear.',
        'One piece of routine was left: going through the job sites by hand every day. A scout does that now: each morning it reads the IT fields on Jobs.cz on its own, scores what it finds and leaves the postings as cards in an inbox. All I do is say yes or no.',
      ],
    },
    shotsHeading: 'What it looks like',
    shots: [
      {
        src: '/img/case/jobtracker-board.webp',
        title: 'Board',
        text: 'Five columns, one per stage; a card moves by picking its new stage. When an application has been quiet for a while it gets a badge with the day count, on the card itself rather than buried in the stats. (The screenshot uses sample data.)',
      },
      {
        src: '/img/case/jobtracker-editor.webp',
        title: 'Card detail',
        text: 'Editing happens in a panel beside the board: link to the posting, location, source, salary range and notes. The salary is stored as two numbers rather than text, so it can be counted on later.',
      },
      {
        src: '/img/case/jobtracker-stats.webp',
        title: 'Stats',
        text: 'Stage-to-stage rates on top, then how many applications reached each stage, a per-day timeline, and the list of the ones that need chasing.',
      },
    ],
    build: {
      heading: 'How it is built',
      items: [
        {
          title: 'One deploy for the front end and the API',
          text: 'React 19 with Vite builds to static files; the API is Hono running as a Cloudflare Pages Function on a catch-all /api/* route. Both ship in a single deploy, so there is no window where the site is newer than the API.',
        },
        {
          title: 'Cloudflare D1 for storage',
          text: 'SQLite running at the edge. The schema is an applications table for the applications themselves and status_events for every move between stages. Development runs through wrangler pages dev, which starts Pages Functions and D1 locally.',
        },
        {
          title: 'No state library',
          text: 'A hook of its own, useBoardData, holds the data over the fetch API. For an app with one source of truth and a handful of actions, Redux or anything like it is more code than it is worth.',
        },
        {
          title: 'An agent, not a single prompt',
          text: 'A posting becomes a card through a model with tools: it can fetch the posting page, search the board for an existing application at the same company, and finally submit a finished draft card. It loops until it submits, six turns at most. Alongside the facts from the posting it adds a score for how well the role fits my profile and a short cover letter in the language of the ad.',
        },
        {
          title: 'The scout as a plan for the day',
          text: 'A cron wakes the worker every five minutes through the morning, and each wake-up does the first thing still missing today: the next page of results, the next posting to score, or the digest e-mail. What is done is written to a table in D1, so nothing happens twice.',
        },
        {
          title: 'Interview prep',
          text: 'When a card reaches the interview stage, a second agent sets off: it starts at the posting, finds the company\'s site and reads a few of its pages before writing a brief: what the company does, eight to ten likely questions with answers grounded in my real experience, what to revise, and what to ask them. The morning before the interview the scout mails it to me.',
        },
        {
          title: 'A résumé fitted to the posting',
          text: 'A button on the card reads the posting and, in a single model call, reorders my résumé: projects, skills and technologies in the order that role cares about, with a rewritten headline and profile. It renders in the same look as the PDFs on the site and saves through the browser\'s print dialog.',
        },
        {
          title: 'TypeScript on both sides',
          text: 'The Application and Stage types are shared between the front end and the API, so renaming a stage fails the build until it is carried through both halves.',
        },
      ],
    },
    decisions: {
      heading: 'The decisions that took the most thinking',
      items: [
        {
          title: 'The funnel counts history, not the present',
          text: 'Counting the current column would make an application rejected after an interview look as though the interview never happened, and the interview rate would come out absurdly low. So every move is logged to status_events, and the funnel counts how many applications ever passed through each stage.',
        },
        {
          title: 'Silence is information too',
          text: 'The "needs follow-up" list takes applications whose last activity is older than a chosen number of days, and deliberately leaves out offers and rejections, since there is nothing left to chase there. The threshold is a query parameter, not a hard-coded number.',
        },
        {
          title: 'Public to read, keyed to write, locked when in doubt',
          text: 'The case study links to this board, so the address is not a secret and hoping nobody finds it is not protection. Looking is therefore open and only a key changes anything. It also locks the safe way: an instance nobody has given a key serves reads and refuses every write, so forgetting the secret leaves it shut rather than open.',
        },
        {
          title: 'The model comes last',
          text: 'The cheap filters run first: a posting with "senior" in the title, or one outside IT, is dropped before a single model call lands on it, and the page is read before the model is called at all. And the model fits the task: a small model (Llama 3.1 8B) gives the fit score at about a twentieth of the cost and ranks postings the same way the big one does, but it invented a salary for three of four postings that state none, so the salary is read by code from Jobs.cz\'s own "Plat" line. The cover letter comes from the larger model, and only when I ask for it on a posting. Every AI feature also has its own daily budget in D1, so none can spend the day for the others.',
        },
        {
          title: 'Nothing reaches the board without me',
          text: 'The agent only proposes a card. It lands in an inbox where I accept or dismiss it, and only accepting writes it to the board. I was wary of a robot throwing twenty listings a day at me until the board stopped being mine. This way the judgement stays human and the machine does the tedious looking.',
        },
        {
          title: 'An agent that picks its own path needs fences',
          text: 'Interview prep is the one agent that navigates: it gets a "read this page" tool and decides which link to follow next. Asking nicely in the prompt does not bound that, so the code does: it may open only the posting, pages linked from a page it has already read, and a domain carrying the company\'s name, at most four pages and seven turns. The model decides; the code holds the edges.',
        },
        {
          title: 'The model may reorder, not invent',
          text: 'The fitted résumé gives the model deliberately little room: it can change the order and rewrite the headline and profile, but every project, skill and technology name it returns is checked against my real résumé and anything missing is put back. A résumé with an experience I do not have is worse than no résumé at all.',
        },
        {
          title: 'Salary as a range, not as text',
          text: 'salary_min and salary_max are numbers. Storing "55–70k depending on experience" as a string is convenient while typing and useless for any sorting or comparison afterwards.',
        },
      ],
    },
    status: {
      heading: 'Where it is now',
      body: [
        'It runs on Cloudflare Pages and works end to end, from the database schema to the charts. The screenshots above use sample data, not real applications.',
        'The board is deliberately public to read: someone arriving from the portfolio is meant to look at it. Changing it is another matter: writes want a shared secret in a header, the browser keeps it to itself, and it is never in the bundle. Without the key the editing controls do not appear at all.',
        'Three models do three different jobs: the posting agent (tools, a fixed path), a single call for the fitted résumé, and the navigating agent for interview prep. All of them run on Workers AI, so there is no API key lying around and they share one daily allowance.',
        'The scout has been running since 24 September 2026: three IT fields on Jobs.cz, for Hradec Králové and its surroundings and for work from home, with a digest e-mail at about half past nine in the morning. Of the postings that pass the filters, thirty a day are scored.',
        'Open it and you will find empty columns. That is not a fault: my real applications stay mine, and inventing data just to make the live version look busier was not worth doing. The screenshots above show it with something in it.',
      ],
    },
    cta: { text: 'Want a look?', button: 'Open the board', href: 'https://job-tracker-10s.pages.dev' },
  },
}

const subscriptions: Record<Lang, CaseStudyContent> = {
  cs: {
    meta: {
      title: 'Subscription Tracker | případová studie | Erik Karásek',
      description: 'Přehled předplatných na Cloudflare Workers: denní cron posouvá obnovení a posílá e-maily, Workers AI vytáhne údaje ze screenshotu platby.',
    },
    back: 'Zpět na portfolio',
    label: 'O projektu',
    title: 'Subscription Tracker.',
    lead: 'Přehled všeho, co ti měsíčně odchází z účtu. Kolik utrácíš a za co, co se brzy strhne a co dlouho nepoužíváš. Jednou denně se to samo probudí, posune data dalšího stržení a pošle e-mail. Appku přitom nemusíš vůbec otevřít.',
    stats: [
      { value: '07:00', label: 'Denní cron (UTC)' },
      { value: '5', label: 'Kategorií útraty' },
      { value: '2', label: 'Tabulky v databázi' },
      { value: '1', label: 'Worker na web, API i cron' },
    ],
    problem: {
      heading: 'Co to řeší',
      body: [
        'Předplatné je zákeřné tím, že si o sebe nikdy neřekne. Strhne se samo, je to pár stovek a po roce si člověk ani nevzpomene, že za Disney+ pořád platí. Součet už ale pár stovek není.',
        'Každé předplatné je tady karta s částkou, cyklem a datem dalšího stržení. Nad tím se počítají tři věci: kolik měsíčně a ročně doopravdy odchází a za co, co se strhne v nejbližších dnech, a co jsi dlouho neoznačil jako použité, tedy to, co asi nepotřebuješ.',
        'Když si něco jen na čas zmrazíš, třeba posilovnu přes léto, nemusíš to mazat, jde to pozastavit. Ze součtů to zmizí, historie plateb zůstane a jedním kliknutím se to vrátí zpátky.',
      ],
    },
    shotsHeading: 'Jak to vypadá',
    shots: [
      {
        src: '/img/case/subscriptions-subs.webp',
        title: 'Předplatná',
        text: 'Karty s filtrem podle kategorie. Co se strhne do tří dnů, svítí oranžově. Pozastavené předplatné zešedne a rovnou o sobě řekne, že se do součtů nepočítá. (Na snímku jsou ukázková data.)',
      },
      {
        src: '/img/case/subscriptions-overview.webp',
        title: 'Přehled',
        text: 'Nahoře měsíční a roční součet, pod tím útrata po kategoriích a skutečně zaplacené částky po měsících. Ty se nepočítají z dnešního nastavení, ale ze záznamů o stržených platbách. Dole to, co se blíží, a to, co leží ladem.',
      },
      {
        src: '/img/case/subscriptions-editor.webp',
        title: 'Detail a import ze screenshotu',
        text: 'Při ručním zadávání máš všechna pole pohromadě. Druhá možnost je nahrát screenshot platby a nechat model předvyplnit název, částku, měnu i cyklus. Než se to uloží, projdeš si to po něm.',
      },
    ],
    build: {
      heading: 'Jak je to postavené',
      items: [
        {
          title: 'Jeden Worker na všechno',
          text: 'React 19 s Vite se sestaví do statických souborů a vydává je ten samý Cloudflare Worker, ve kterém běží Hono API. Tenhle typ workeru navíc umí spouštět úlohy podle času, což Pages Functions neumí, a plánovaná úloha je tady půlka nápadu.',
        },
        {
          title: 'Denní cron v 7:00 UTC',
          text: 'Jednou za den worker projde, čemu mezitím vypršelo období, posune datum na další a zapíše platbu do historie. Pak se podívá tři dny dopředu a na předplatná, která jsi přes měsíc nepoužil, a jestli je co hlásit, pošle jeden e-mail přes Resend.',
        },
        {
          title: 'Cloudflare D1 a dvě tabulky',
          text: 'V tabulce subscriptions jsou samotná předplatná včetně příznaku pro pauzu, v renewal_events záznam o každé stržené platbě. Graf skutečné útraty se kreslí z něj, takže když dneska změníš cenu, minulé měsíce zůstanou takové, jaké opravdu byly.',
        },
        {
          title: 'Import obrázku přes Workers AI',
          text: 'Nahraný screenshot platby projde obrazovým modelem LLaVA 1.5 na Cloudflare Workers AI. Vejde se to do denního limitu zdarma, takže na tuhle funkci není potřeba žádný placený klíč.',
        },
      ],
    },
    decisions: {
      heading: 'Rozhodnutí, která stála nejvíc přemýšlení',
      items: [
        {
          title: 'Model formulář vyplní, ale neodešle',
          text: 'Malý model zdarma čte částky a termíny znatelně hůř než ten placený. Místo abych dělal, že je přesnější, než je, jeho výstup jen předvyplní formulář a odeslat ho musí člověk. Když se model splete, stojí to jednu opravu, ne špatné číslo v ročním součtu.',
        },
        {
          title: 'Pauza místo mazání',
          text: 'Zamrazená posilovna není zrušená posilovna. Smazání by vzalo i historii plateb, takže existuje pauza: ze součtů to zmizí, z databáze ne, a jde to jedním tlačítkem vrátit.',
        },
        {
          title: 'Barvy kategorií nejsou jediné vodítko',
          text: 'Barvy jsou vybrané tak, aby se odstíny nepletly ani lidem, kteří je rozeznávají jinak. A hlavně: u každé kategorie je vždycky i její název. Kdo barvy rozliší, zorientuje se rychleji, a kdo ne, nepřijde o nic.',
        },
        {
          title: 'Sečíst dvě měny dohromady nejde',
          text: 'Dvacet dolarů a dvě stě korun není dvě stě dvacet čehokoli. Součty proto před sečtením převádějí všechno na koruny přes Frankfurter, což je veřejné API nad kurzy ECB a nechce účet ani klíč. Když je nedostupné, spadne to zpět na původní částku, radši číslo o kousek vedle než rozbitá stránka s přehledem.',
        },
        {
          title: 'Zámek místo vlastního přihlašování',
          text: 'Je tam napsané, kolik za co utrácím, takže to nemůže být veřejné. Místo psaní vlastního přihlašování stojí před celou appkou Cloudflare Access: bez přihlášení se dovnitř nedostane nikdo, ani na API.',
        },
      ],
    },
    status: {
      heading: 'Kde to je teď',
      body: [
        'Běží to jako Worker na Cloudflare a je hotové od databáze přes cron a e-maily až po grafy. Snímky výše jsou z ukázkových dat.',
        'Živá appka je schválně za Cloudflare Access, takže si ji nemůžeš otevřít, jsou v ní údaje o mých vlastních platbách o mých vlastních platbách. Kód je ale celý veřejný na GitHubu.',
      ],
    },
    cta: { text: 'Chceš se podívat na kód?', button: 'Otevřít na GitHubu', href: 'https://github.com/ErikKarasek/subscription-tracker' },
  },
  en: {
    meta: {
      title: 'Subscription Tracker | case study | Erik Karásek',
      description: 'A subscription overview on Cloudflare Workers: a daily cron rolls renewals forward and sends email, Workers AI reads a payment screenshot.',
    },
    back: 'Back to portfolio',
    label: 'About the project',
    title: 'Subscription Tracker.',
    lead: 'An overview of everything leaving your account each month. What you spend and on what, what renews soon, and what you have not touched in a while. Once a day it wakes up on its own, rolls the renewals forward and sends an email, and you never have to open it.',
    stats: [
      { value: '07:00', label: 'Daily cron (UTC)' },
      { value: '5', label: 'Spending categories' },
      { value: '2', label: 'Database tables' },
      { value: '1', label: 'Worker for site, API and cron' },
    ],
    problem: {
      heading: 'What it solves',
      body: [
        'Subscriptions are sneaky because they never ask. The money goes on its own, each one is small, and a year later you cannot remember you are still paying for Disney+. The total is not small, though.',
        'This keeps every subscription as a card with its amount, cycle and next renewal date, and works out three things on top: how much really leaves each month and year and in which categories, what renews in the next few days, and what you have not marked as used in a long time, the candidates for cancelling.',
        'When something is only frozen, a gym over the summer say, it can be paused instead of deleted. It drops out of the totals but keeps its history, and comes back with one click.',
      ],
    },
    shotsHeading: 'What it looks like',
    shots: [
      {
        src: '/img/case/subscriptions-subs.webp',
        title: 'Subscriptions',
        text: 'Cards with a filter per category. Anything renewing within three days is picked out in orange. A paused subscription greys out and says plainly that it is not being counted. (The screenshot uses sample data.)',
      },
      {
        src: '/img/case/subscriptions-overview.webp',
        title: 'Overview',
        text: 'Monthly and yearly totals on top, then spend by category and what was actually paid per month, drawn from the renewal log rather than from today\'s settings, so changing a price does not rewrite the past. Below that, what is coming and what is lying idle.',
      },
      {
        src: '/img/case/subscriptions-editor.webp',
        title: 'Detail and screenshot import',
        text: 'Entering by hand keeps every field in one place. Next to it, a payment screenshot can be uploaded and a model asked to pre-fill the name, amount, currency and cycle, on the understanding that a human then checks it.',
      },
    ],
    build: {
      heading: 'How it is built',
      items: [
        {
          title: 'One Worker for everything',
          text: 'React 19 with Vite builds to static files, served by the same Cloudflare Worker that runs the Hono API. A Worker with static assets can also carry cron triggers, which plain Pages Functions cannot, and the cron is half the idea here.',
        },
        {
          title: 'A daily cron at 07:00 UTC',
          text: 'Once a day the worker walks everything that has expired, moves the date to the next period and writes the renewal into the history. Then it looks three days ahead, and at anything unused for over a month, and if there is something to say it sends one email through Resend.',
        },
        {
          title: 'Cloudflare D1 and two tables',
          text: 'subscriptions holds the subscriptions themselves, including the paused flag; renewal_events is a log of every renewal. The actual-spend chart is drawn from that log, so changing a price today leaves past months as they were.',
        },
        {
          title: 'Image import through Workers AI',
          text: 'An uploaded payment screenshot goes through the LLaVA 1.5 vision model on Cloudflare Workers AI. It fits inside the free daily allowance, so the feature costs no API key.',
        },
      ],
    },
    decisions: {
      heading: 'The decisions that took the most thinking',
      items: [
        {
          title: 'The model fills the form in, it does not submit it',
          text: 'A small free vision model reads amounts and dates noticeably worse than a paid frontier one. Rather than pretend to an accuracy it does not have, its output only pre-fills the form and saving stays with the person. A misread then costs one correction, not a wrong number in the yearly total.',
        },
        {
          title: 'Pause rather than delete',
          text: 'A frozen gym membership is not a cancelled one. Deleting would take the payment history with it, so there is a pause: it leaves the totals, not the database, and one button brings it back.',
        },
        {
          title: 'Category colour is never the only clue',
          text: 'The palette is picked so the hues stay apart for colour vision deficiencies, and more importantly every category always carries a text label as well. If you can tell the colours apart it is quicker; if you cannot, you lose nothing.',
        },
        {
          title: 'Two currencies do not add up',
          text: 'Twenty dollars and two hundred crowns is not two hundred and twenty of anything. The totals convert everything to crowns before summing, through Frankfurter, a public API over ECB rates that wants neither an account nor a key. When it is unreachable the amount falls back to its raw value: a number slightly off beats an overview page that will not load.',
        },
        {
          title: 'A lock instead of my own login',
          text: 'This is data about what I spend, so it cannot be public. Instead of writing authentication, Cloudflare Access sits in front of the whole app: nobody gets in without signing in, the API included.',
        },
      ],
    },
    status: {
      heading: 'Where it is now',
      body: [
        'It runs as a Worker on Cloudflare and is finished from the database through the cron and the emails to the charts. The screenshots above use sample data.',
        'The live app is deliberately behind Cloudflare Access, so you cannot open it: it holds my own payment details. The code, though, is entirely public on GitHub.',
      ],
    },
    cta: { text: 'Want to look at the code?', button: 'Open on GitHub', href: 'https://github.com/ErikKarasek/subscription-tracker' },
  },
}

/** Every case study, keyed by the folder it is published under (/nexus-grind/, /lol-stats/, …). */
export const studies = {
  'nexus-grind': nexusGrind,
  'lol-stats': lolStats,
  'monster-watch': monsterWatch,
  'job-tracker': jobTracker,
  'subscriptions': subscriptions,
} satisfies Record<string, Record<Lang, CaseStudyContent>>

export type StudySlug = keyof typeof studies
