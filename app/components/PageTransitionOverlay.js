'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Module-level so NavMenu can call it without prop drilling or context
let _cover = null

export function coverForTransition(origin) {
  if (_cover) _cover(origin)
}

export default function PageTransitionOverlay() {
  const [phase,  setPhase]  = useState('idle')   // 'idle' | 'cover' | 'reveal'
  const [origin, setOrigin] = useState('50% 50%')
  const phaseRef  = useRef('idle')
  const pathname  = usePathname()
  const prevPath  = useRef(pathname)

  // Register the cover trigger on mount
  useEffect(() => {
    _cover = (orig) => {
      setOrigin(orig)
      phaseRef.current = 'cover'
      setPhase('cover')
    }
    return () => { _cover = null }
  }, [])

  // When pathname changes while covering → start reveal animation
  useEffect(() => {
    if (pathname === prevPath.current) return
    prevPath.current = pathname

    if (phaseRef.current === 'cover') {
      phaseRef.current = 'reveal'
      setPhase('reveal')
      const t = setTimeout(() => {
        phaseRef.current = 'idle'
        setPhase('idle')
      }, 1000)
      return () => clearTimeout(t)
    }
  }, [pathname])

  // Safety valve — if navigation never fires, clear the overlay after 3 s
  useEffect(() => {
    if (phase !== 'cover') return
    const t = setTimeout(() => {
      phaseRef.current = 'idle'
      setPhase('idle')
    }, 3000)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'idle') return null

  return (
    <div
      className="fixed inset-0 z-[999] bg-black"
      style={{
        clipPath:      phase === 'reveal'
          ? `circle(0px at ${origin})`
          : `circle(200vmax at ${origin})`,
        transition:    phase === 'reveal'
          ? 'clip-path 0.9s cubic-bezier(0.7, 0, 0.2, 1)'
          : 'none',
        pointerEvents: phase === 'cover' ? 'all' : 'none',
      }}
    />
  )
}
