'use client'

import { useRef, useEffect, useState } from 'react'

const TOTAL_SCREENS  = 12
const BASE_SPEED     = 0.4
const BOOST_SPEED    = BASE_SPEED * 2
const LERP_FACTOR    = 0.06
const SCROLL_TIMEOUT = 180

export default function DeviceScrollSection() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const sectionRef   = useRef(null)
  const trackRef     = useRef(null)
  const posRef       = useRef(0)
  const currentSpeed = useRef(BASE_SPEED)
  const targetSpeed  = useRef(BASE_SPEED)
  const rafRef       = useRef(null)
  const timerRef     = useRef(null)
  const loopWidth    = useRef(0) // width of one full set of 12 screens

  useEffect(() => {
    const track   = trackRef.current
    const section = sectionRef.current
    if (!track || !section) return

    // Measure after paint so CSS calc() values are resolved
    const measureLoop = () => {
      loopWidth.current = track.scrollWidth / 2
    }
    measureLoop()
    window.addEventListener('resize', measureLoop)

    const tick = () => {
      currentSpeed.current += (targetSpeed.current - currentSpeed.current) * LERP_FACTOR
      posRef.current += currentSpeed.current

      // Seamless loop: once we've scrolled one full set, snap back by exactly one set width
      if (loopWidth.current > 0 && posRef.current >= loopWidth.current) {
        posRef.current -= loopWidth.current
      }

      track.style.transform = `translateX(${-posRef.current}px)`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const handleWheel = (e) => {
      const rect = section.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      if (e.deltaY <= 0) return

      targetSpeed.current = BOOST_SPEED
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        targetSpeed.current = BASE_SPEED
      }, SCROLL_TIMEOUT)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timerRef.current)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', measureLoop)
    }
  }, [])

  // Mobile: 3 screens across — Desktop: 6 screens across
  const sw = isMobile ? 'calc((100vw - 40px) / 3)' : 'calc((100vw - 80px) / 6)'
  const sh = isMobile ? 'calc((100vw - 40px) / 3 * (19 / 9))' : 'calc((100vw - 80px) / 6 * (19 / 9))'

  // Render two identical copies — the loop reset makes it appear infinite
  const screens = Array.from({ length: TOTAL_SCREENS * 2 }).map((_, i) => {
    const num = (i % TOTAL_SCREENS) + 1
    return (
      <div
        key={i}
        className="relative flex-shrink-0 bg-[var(--color-card)] border border-[var(--color-card-border)] flex flex-col overflow-hidden"
        style={{ width: sw, height: sh, borderRadius: '22px' }}
      >
        {/* Status-bar notch */}
        <div className="flex items-center justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-[48px] h-[5px] rounded-full bg-[var(--color-card-border)]" />
        </div>

        {/* Screen body placeholder */}
        <div className="flex-1 mx-3 mb-3 rounded-[14px] bg-[var(--color-inset)] flex items-center justify-center">
          <span className="text-[var(--color-card-border)] text-[13px] select-none">
            [ {String(num).padStart(2, '0')} ]
          </span>
        </div>
      </div>
    )
  })

  return (
    <div ref={sectionRef} className="mt-16 overflow-hidden w-full">
      <div
        ref={trackRef}
        className="flex gap-4"
        style={{ width: 'max-content', willChange: 'transform' }}
      >
        {screens}
      </div>
    </div>
  )
}
