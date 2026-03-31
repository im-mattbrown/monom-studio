'use client'

import { useRef, useEffect } from 'react'
import { useLenis } from 'lenis/react'

const CARD_COUNT    = 5
const SCROLL_PER_CARD = 10
const TOTAL_SCROLL  = CARD_COUNT * SCROLL_PER_CARD

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

export default function ProjectsSection() {
  const sectionRef    = useRef(null)
  const lenisRef      = useRef(null)
  const lockedRef     = useRef(false)
  const cooldownFwd   = useRef(false)
  const cooldownBck   = useRef(false)
  const currentScroll = useRef(0)
  const targetScroll  = useRef(0)
  const rafRef        = useRef(null)
  const cardRefs      = useRef([])

  // ── Card animation ──────────────────────────────────────────────────────
  function updateCards(progress) {
    for (let i = 0; i < CARD_COUNT; i++) {
      const card = cardRefs.current[i]
      if (!card) continue
      const cardStart = i * SCROLL_PER_CARD
      const p = clamp((progress - cardStart) / SCROLL_PER_CARD, 0, 1)
      const eased = easeInOut(p)
      card.style.transform = `translateY(${110 - 220 * eased}vh)`
    }
  }

  // ── Lock ─────────────────────────────────────────────────────────────────
  function lock(initialProgress) {
    lockedRef.current       = true
    currentScroll.current   = initialProgress
    targetScroll.current    = initialProgress
    updateCards(initialProgress)
    lenisRef.current?.stop()
    lenisRef.current?.scrollTo(sectionRef.current.offsetTop, { immediate: true })
    startRAF()
  }

  // ── RAF lerp ─────────────────────────────────────────────────────────────
  function startRAF() {
    cancelAnimationFrame(rafRef.current)
    const tick = () => {
      if (!lockedRef.current) return
      const diff = targetScroll.current - currentScroll.current
      currentScroll.current += Math.abs(diff) > 0.1 ? diff * 0.1 : diff
      updateCards(currentScroll.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  // ── Unlock forward ──────────────────────────────────────────────────────
  function unlockForward() {
    currentScroll.current = TOTAL_SCROLL
    targetScroll.current  = TOTAL_SCROLL
    updateCards(TOTAL_SCROLL)
    lockedRef.current = false
    cooldownFwd.current   = true
    cancelAnimationFrame(rafRef.current)
    lenisRef.current?.start()
  }

  // ── Unlock backward ─────────────────────────────────────────────────────
  function unlockBack() {
    currentScroll.current = 0
    targetScroll.current  = 0
    updateCards(0)
    lockedRef.current = false
    cooldownBck.current   = true
    cancelAnimationFrame(rafRef.current)
    lenisRef.current?.start()
  }

  // ── Lenis scroll detection ────────────────────────────────────────────────
  useLenis((lenis) => {
    lenisRef.current = lenis
    const section = sectionRef.current
    if (!section || lockedRef.current) return

    const sectionTop    = section.offsetTop
    const sectionBottom = sectionTop + section.offsetHeight

    // Clear each cooldown when scroll exits the section zone
    if (cooldownFwd.current && (lenis.scroll >= sectionBottom || lenis.scroll < sectionTop)) {
      cooldownFwd.current = false
    }
    if (cooldownBck.current && (lenis.scroll <= sectionTop || lenis.scroll > sectionBottom)) {
      cooldownBck.current = false
    }

    // Scrolling DOWN: lock when section fills the screen
    if (
      !cooldownFwd.current &&
      lenis.direction === 1 &&
      lenis.scroll >= sectionTop &&
      lenis.scroll < sectionBottom
    ) {
      lock(0)
      return
    }

    // Scrolling UP: lock when section fills the screen (lenis.scroll ≈ sectionTop)
    if (
      !cooldownBck.current &&
      lenis.direction === -1 &&
      lenis.scroll >= sectionTop &&
      lenis.scroll <= sectionTop + 60
    ) {
      lock(TOTAL_SCROLL)
      return
    }
  })

  // ── Wheel handler ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleWheel = (e) => {
      if (!lockedRef.current) return

      if (targetScroll.current <= 0 && e.deltaY < 0) {
        unlockBack()
        return
      }

      if (targetScroll.current >= TOTAL_SCROLL && e.deltaY > 0) {
        unlockForward()
        return
      }

      e.preventDefault()
      targetScroll.current = clamp(targetScroll.current + e.deltaY * 0.005, 0, TOTAL_SCROLL)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden mt-[100px]"
    >
      {/* PROJECTS title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
        <p className="text-[var(--color-muted)] text-[23px]">[ SOME OF OUR WORK ]</p>
        <p
          className="font-medium text-[var(--color-fg)] leading-none mt-4"
          style={{ fontSize: 'clamp(60px, 11.6vw, 167px)' }}
        >
          PROJECTS
        </p>
      </div>

      {/* Cards */}
      {Array.from({ length: CARD_COUNT }).map((_, i) => {
        const isRight = i % 2 === 0
        return (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el }}
            className="absolute flex items-center justify-center bg-[var(--color-card)] border border-[var(--color-card-border)]"
            style={{
              width:     'min(60vw, 85vh)',
              height:    'min(60vw, 85vh)',
              top:       'calc(50% - min(30vw, 42.5vh))',
              ...(isRight ? { right: '5vw' } : { left: '5vw' }),
              zIndex:    10,
              transform: 'translateY(110vh)',
              willChange: 'transform',
            }}
          >
            <span className="text-[var(--color-muted)] text-[16px] select-none">[ 0{i + 1} ]</span>
          </div>
        )
      })}
    </section>
  )
}
