'use client'

import { useRef, useState, useEffect } from 'react'

// Like SpotlightText, but the glow is a rainbow gradient that lags behind
// the cursor (RAF lerp) instead of snapping instantly, giving it a trailing,
// glowing feel as it moves across the text.
export default function RainbowSpotlightText({ text, className }) {
  const ref        = useRef(null)
  const targetRef  = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef     = useRef(null)
  const [hover, setHover] = useState(false)

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    targetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function handleEnter(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pos  = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    // Snap so the glow starts under the cursor with no glide-in from origin
    targetRef.current  = pos
    currentRef.current = pos
    el.style.setProperty('--sx', `${pos.x}px`)
    el.style.setProperty('--sy', `${pos.y}px`)
    setHover(true)
  }

  // Trailing lerp while hovering — same easing pattern used for the
  // cursor-follow video on /work
  useEffect(() => {
    if (!hover) {
      cancelAnimationFrame(rafRef.current)
      return
    }
    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.15
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.15
      const el = ref.current
      if (el) {
        el.style.setProperty('--sx', `${currentRef.current.x}px`)
        el.style.setProperty('--sy', `${currentRef.current.y}px`)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [hover])

  return (
    <p
      ref={ref}
      className={className}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundImage: hover
          ? 'radial-gradient(90px circle at var(--sx, 50%) var(--sy, 50%), #ff3b5c 0%, #ff9d3b 16%, #ffe93b 32%, #3bff6e 48%, #3bd4ff 64%, #b23bff 80%, transparent 100%), linear-gradient(var(--color-muted), var(--color-muted))'
          : 'linear-gradient(var(--color-muted), var(--color-muted))',
        WebkitBackgroundClip: 'text',
        backgroundClip:       'text',
        color:                'transparent',
        WebkitTextFillColor:  'transparent',
        filter:               hover ? 'drop-shadow(0 0 10px rgba(255,255,255,0.35))' : 'none',
        transition:           'filter 0.2s ease',
      }}
    >
      {text}
    </p>
  )
}
