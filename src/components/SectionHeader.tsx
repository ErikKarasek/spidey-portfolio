import type { Ref } from 'react'
import { useSuit } from '../theme'

export function SectionHeader({ label, title, icon = false, ref }: { label: string; title: string; icon?: boolean; ref?: Ref<HTMLDivElement> }) {
  const suit = useSuit()
  return (
    <div ref={ref} className="z-10 mb-10 flex flex-col items-center text-center">
      <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent md:text-xs">
        {icon && <img src={suit('/img/spidey-band.webp')} alt="" className="suit-img h-4 w-4 object-contain" />}
        {label}
      </span>
      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-ink [text-shadow:2px_2px_0_var(--color-accent-soft)] md:text-5xl">{title}</h2>
      <div className="mt-2 h-1 w-12 rounded-full bg-accent" />
    </div>
  )
}
