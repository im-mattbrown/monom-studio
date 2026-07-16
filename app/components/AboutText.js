'use client'

import { useRef, useEffect } from 'react'
import { useLenis } from 'lenis/react'

// Edit this placeholder copy directly
const PARAGRAPH =
  `MATT IS THE FOUNDER OF MONOM STUDIO. A DESIGNER AND DEVELOPER WHO BELIEVES THE WEB IS A MORE INTERESTING PLACE WHEN IT IS BUILT BY HUMANS FOR HUMANS. HE STARTED MONOM TO HELP FOUNDERS AND SMALL BUSINESSES GET THE DIGITAL PRESENCE THEY DESERVE WITHOUT CUTTING CORNERS OR REACHING FOR TEMPLATES. `

const WORDS = PARAGRAPH.split(' ')

export default function AboutText() {
  const sectionRef  = useRef(null)
  const lenisRef    = useRef(null)
  const lockedRef   = useRef(false)
  const cooldownFwd = useRef(false)
  const cooldownBck = useRef(false)
  const currentProg = useRef(0)
  const targetProg  = useRef(0)
  const rafRef      = useRef(null)
  const wordRefs    = useRef([])

  // ── Colour each word based on progress 0→1 ───────────────────────────────
  function updateWords(progress) {
    const total = wordRefs.current.length
    wordRefs.current.forEach((el, i) => {
      if (!el) return
      el.style.color = progress >= i / total ? 'var(--color-fg)' : 'var(--color-muted)'
    })
  }

  // ── RAF lerp: smoothly chase targetProg ──────────────────────────────────
  function startRAF() {
    cancelAnimationFrame(rafRef.current)
    const tick = () => {
      if (!lockedRef.current) return
      const diff = targetProg.current - currentProg.current
      currentProg.current += Math.abs(diff) > 0.001 ? diff * 0.08 : diff
      updateWords(currentProg.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function lock(initialProg) {
    lockedRef.current  = true
    currentProg.current = initialProg
    targetProg.current  = initialProg
    updateWords(initialProg)
    lenisRef.current?.stop()
    lenisRef.current?.scrollTo(sectionRef.current.offsetTop, { immediate: true })
    startRAF()
  }

  function unlockForward() {
    lockedRef.current   = false
    cooldownFwd.current = true
    currentProg.current = 1
    targetProg.current  = 1
    updateWords(1)
    cancelAnimationFrame(rafRef.current)
    lenisRef.current?.start()
  }

  function unlockBack() {
    lockedRef.current   = false
    cooldownBck.current = true
    currentProg.current = 0
    targetProg.current  = 0
    updateWords(0)
    cancelAnimationFrame(rafRef.current)
    lenisRef.current?.start()
  }

  // ── Lenis: detect entry and lock ─────────────────────────────────────────
  useLenis((lenis) => {
    lenisRef.current = lenis
    const section = sectionRef.current
    if (!section || lockedRef.current) return

    const sectionTop    = section.offsetTop
    const sectionBottom = sectionTop + section.offsetHeight

    if (cooldownFwd.current && (lenis.scroll >= sectionBottom || lenis.scroll < sectionTop)) {
      cooldownFwd.current = false
    }
    if (cooldownBck.current && (lenis.scroll <= sectionTop || lenis.scroll > sectionBottom)) {
      cooldownBck.current = false
    }

    if (!cooldownFwd.current && lenis.direction === 1 && lenis.scroll >= sectionTop && lenis.scroll < sectionBottom) {
      lock(0); return
    }
    if (!cooldownBck.current && lenis.direction === -1 && lenis.scroll >= sectionTop && lenis.scroll <= sectionTop + 60) {
      lock(1); return
    }
  })

  // ── Wheel: drive progress while locked ───────────────────────────────────
  useEffect(() => {
    const handleWheel = (e) => {
      if (!lockedRef.current) return
      if (targetProg.current <= 0 && e.deltaY < 0) { unlockBack();    return }
      if (targetProg.current >= 1 && e.deltaY > 0) { unlockForward(); return }
      e.preventDefault()
      targetProg.current = Math.max(0, Math.min(1, targetProg.current + e.deltaY * 0.001))
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center px-[30px] md:px-[45px]"
    >
      <p
        className="font-medium max-w-[820px]"
        style={{ fontSize: 'clamp(22px, 2.8vw, 44px)', lineHeight: '1.35' }}
      >
        {WORDS.map((word, i) => (
          <span
            key={i}
            ref={el => { wordRefs.current[i] = el }}
            style={{ color: 'var(--color-muted)' }}
          >
            {word}{i < WORDS.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    </section>
  )
}
