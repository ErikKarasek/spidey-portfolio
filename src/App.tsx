import { useEffect, useState } from 'react'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { LiveStream } from './components/LiveStream'
import { Clips } from './components/Clips'
import { Experience } from './components/Experience'
import { EasterEggs } from './components/EasterEggs'
import { WebShooter } from './components/WebShooter'
import { useLive } from './live'
import { preloadSuit, useIsSymbiote } from './theme'

export default function App() {
  const [ready, setReady] = useState(false)
  const live = useLive()
  const symbiote = useIsSymbiote()

  // Once the page is up, quietly fetch the other suit so the first switch is instant.
  useEffect(() => {
    if (!ready) return
    const id = setTimeout(() => void preloadSuit(!symbiote), 1500)
    return () => clearTimeout(id)
  }, [ready, symbiote])

  return (
    <>
      {!ready && <Loader onDone={() => setReady(true)} />}
      <Nav live={live} />
      <main id="top" className="flex w-full flex-col overflow-hidden bg-surface">
        <Hero ready={ready} />
        <Marquee />
      </main>
      <LiveStream live={live} />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Clips />
      <Contact live={live} />
      <WebShooter />
      <EasterEggs />
    </>
  )
}
