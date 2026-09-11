import { useEffect, useState } from 'react'
import { siApple } from 'simple-icons'
import { useLang } from '../i18n'

const REPO = 'ErikKarasek/nexus-grind-releases'
const ALL = `https://github.com/${REPO}/releases/latest`

type Links = { mac?: string; win?: string; version?: string }

/** Buttons for the newest Nexus Grind build; asset links come from the latest GitHub release, so a new release updates them. */
export function Downloads() {
  const { t } = useLang()
  const [links, setLinks] = useState<Links>({})

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
      .then((r) => (r.ok ? r.json() : null))
      .then((release: { tag_name: string; assets: { name: string; browser_download_url: string }[] } | null) => {
        if (!release) return
        const find = (re: RegExp) => release.assets.find((a) => re.test(a.name))?.browser_download_url
        setLinks({ mac: find(/macos\.zip$/i), win: find(/x64-setup\.exe$/i), version: release.tag_name })
      })
      .catch(() => {})
  }, [])

  const button =
    'flex flex-1 items-center justify-center gap-2 rounded-xl border border-accent bg-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_8px_20px_rgb(var(--glow)/0.3)]'

  return (
    <div className="mb-5">
      <div className="flex flex-wrap gap-2">
        <a href={links.mac ?? ALL} className={button}>
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
            <path d={siApple.path} />
          </svg>
          {t.downloads.mac}
        </a>
        <a href={links.win ?? ALL} className={button}>
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M3 3h8.5v8.5H3zM12.5 3H21v8.5h-8.5zM3 12.5h8.5V21H3zM12.5 12.5H21V21h-8.5z" />
          </svg>
          {t.downloads.win}
        </a>
      </div>
      <p className="mt-2 flex flex-wrap justify-between gap-x-3 text-[11px] font-medium text-mute">
        <span>{t.downloads.macHint}</span>
        <a href={ALL} target="_blank" rel="noreferrer" className="font-bold text-accent hover:underline">
          {links.version ? `${links.version} · ` : ''}
          {t.downloads.all} ↗
        </a>
      </p>
    </div>
  )
}
