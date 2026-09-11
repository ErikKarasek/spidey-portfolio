import type { Ref } from 'react'
import { useSuit } from '../theme'

type Props = { className?: string; threadClass?: string; imgClass?: string; ref?: Ref<HTMLDivElement> }

/** Spider-Man dangling from the top of a section. The section decides how he swings. */
export function Hanging({ className = '', threadClass = 'h-16 md:h-24', imgClass = 'w-28 md:w-40', ref }: Props) {
  const suit = useSuit()
  return (
    <div ref={ref} className={`pointer-events-none absolute top-0 z-30 flex origin-top flex-col items-center ${className}`}>
      <div className={`w-[2px] bg-linear-to-b from-transparent to-mute-2 opacity-60 ${threadClass}`} />
      {/* data-spidey: clicking him sends him swinging (EasterEggs), without making him block the form below. */}
      <img src={suit('/img/spidey-hang.webp')} alt="" data-spidey className={`suit-img -mt-2 h-auto object-contain drop-shadow-lg ${imgClass}`} />
    </div>
  )
}
