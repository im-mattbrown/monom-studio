'use client'

import { useRef, useEffect } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    let raf = null
    let mouseX = -200
    let mouseY = -200
    let curX   = -200
    let curY   = -200

    // Lerp cursor toward mouse for a subtle lag feel
    const tick = () => {
      curX += (mouseX - curX) * 0.18
      curY += (mouseY - curY) * 0.18
      el.style.transform = `translate(${curX}px, ${curY}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="theme-invert"
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        // Centre the 36px icon on the hotspot
        width:         '36px',
        height:        '36px',
        marginTop:     '-18px',
        marginLeft:    '-18px',
        pointerEvents: 'none',
        zIndex:        99999,
        willChange:    'transform',
      }}
    >
      <img
        src="/images/shape2.svg"
        alt=""
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
