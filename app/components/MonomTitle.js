'use client'

import { useRef } from 'react'
import { useLenis } from 'lenis/react'

export default function MonomTitle() {
  const ref = useRef(null)

  useLenis(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    // progress: 0 = element below viewport, 1 = element top at viewport top
    const progress = Math.max(0, Math.min(1, 1 - rect.top / windowHeight))
    ref.current.style.transform = `scale(${1.5 - 0.3 * progress})`
  })

  return (
    <p
      ref={ref}
      className="text-[var(--color-fg)] font-medium whitespace-nowrap text-center leading-none"
      style={{
        fontSize: 'clamp(80px, 23.6vw, 340px)',
        lineHeight: '1',
        transform: 'scale(1.5)',
        transformOrigin: 'center',
        willChange: 'transform',
      }}
    >
      MONOM
    </p>
  )
}
