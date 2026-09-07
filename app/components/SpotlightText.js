'use client'

import { useRef, useState } from 'react'

// Brightens to white in a flashlight radius around the cursor, using a
// background-clip:text radial gradient that tracks the mouse.
export default function SpotlightText({ text, className }) {
  const ref = useRef(null)
  const [hover, setHover] = useState(false)

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--sy', `${e.clientY - rect.top}px`)
  }

  return (
    <p
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundImage: hover
          ? 'radial-gradient(98px circle at var(--sx, 50%) var(--sy, 50%), #ffffff 0%, rgba(255,255,255,0.35) 30%, transparent 60%), linear-gradient(var(--color-muted), var(--color-muted))'
          : 'linear-gradient(var(--color-muted), var(--color-muted))',
        WebkitBackgroundClip: 'text',
        backgroundClip:       'text',
        color:                'transparent',
        WebkitTextFillColor:  'transparent',
      }}
    >
      {text}
    </p>
  )
}
