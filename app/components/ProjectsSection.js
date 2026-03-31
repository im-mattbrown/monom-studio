'use client'

import { useRef, useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'

const PROJECTS = [
  {
    num: '01',
    title: "THAT'S ON ME",
    subtitle: 'PERSONAL ACCOUNTABILITY, REDESIGNED',
    problem:
      'MOST PEOPLE KNOW WHAT THEY WANT TO CHANGE — THEY JUST HAVE NO SYSTEM TO HOLD THEMSELVES TO IT. GENERIC HABIT TRACKERS FEEL LIKE CHORES, AND THE SHAME SPIRAL OF MISSING A STREAK KILLS MOTIVATION BEFORE IT STARTS.',
    solution:
      'A LIGHTWEIGHT ACCOUNTABILITY APP BUILT AROUND HONESTY, NOT STREAKS. USERS SET THEIR OWN STANDARDS, CHECK IN DAILY, AND OWN THEIR OUTCOMES — NO GAMIFICATION, NO GUILT. JUST CLARITY ON WHERE YOU ACTUALLY STAND.',
  },
  {
    num: '02',
    title: 'SHRTCTS',
    subtitle: 'YOUR KEYBOARD, FINALLY MASTERED',
    problem:
      'POWER USERS LOSE HOURS EVERY WEEK SWITCHING BETWEEN MOUSE AND KEYBOARD. SHORTCUT REFERENCES ARE SCATTERED ACROSS DOCUMENTATION, BURIED IN MENUS, AND IMPOSSIBLE TO MEMORISE WITHOUT CONSTANT REPETITION.',
    solution:
      'A COMPANION APP THAT SURFACES THE RIGHT SHORTCUTS FOR THE RIGHT APP AT THE RIGHT TIME. SHRTCTS LEARNS YOUR WORKFLOW AND NUDGES YOU TOWARD FASTER PATHS — TURNING MUSCLE MEMORY INTO A FEATURE, NOT AN AFTERTHOUGHT.',
  },
  {
    num: '03',
    title: 'CURL',
    subtitle: 'HAIR CARE THAT ACTUALLY GETS IT',
    problem:
      'THE CURLY HAIR COMMUNITY IS UNDERSERVED BY MAINSTREAM BEAUTY APPS. PRODUCT RECOMMENDATIONS ARE GENERIC, ROUTINES ARE COPIED FROM STRAIGHT-HAIR ADVICE, AND THERE IS NO SINGLE PLACE TO TRACK WHAT ACTUALLY WORKS FOR YOUR SPECIFIC CURL PATTERN.',
    solution:
      'A PERSONALISED HAIR CARE PLATFORM BUILT EXCLUSIVELY FOR CURLS, COILS, AND WAVES. CURL MAPS YOUR HAIR PROFILE, TRACKS PRODUCTS AND ROUTINES, AND SURFACES COMMUNITY-BACKED ADVICE FILTERED TO YOUR EXACT PATTERN — SO EVERY WASH DAY IS INFORMED, NOT GUESSWORK.',
  },
]

const CARD_COUNT      = PROJECTS.length
const SCROLL_PER_CARD = 10
const TOTAL_SCROLL    = CARD_COUNT * SCROLL_PER_CARD

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-[20px]"
      onClick={handleBackdrop}
    >
      <div className="relative w-full max-w-[760px] max-h-[90vh] overflow-y-auto bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-[16px] p-[48px]">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-[24px] right-[24px] text-[var(--color-muted)] text-[20px] hover:text-[var(--color-fg)] transition-colors leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Number */}
        <span className="text-[var(--color-muted)] text-[16px]">[ {project.num} ]</span>

        {/* Title */}
        <h2
          className="text-[var(--color-fg)] font-medium leading-none mt-4"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
        >
          {project.title}
        </h2>

        {/* Subtitle */}
        <p className="text-[var(--color-muted)] text-[18px] mt-4 tracking-wide">
          {project.subtitle}
        </p>

        <div className="mt-10 border-t border-[var(--color-card-border)]" />

        {/* Problem */}
        <div className="mt-8">
          <p className="text-[var(--color-muted)] text-[14px] tracking-widest mb-4">
            [ THE PROBLEM ]
          </p>
          <p className="text-[var(--color-fg)] text-[17px] leading-[28px]">
            {project.problem}
          </p>
        </div>

        {/* Solution */}
        <div className="mt-8">
          <p className="text-[var(--color-muted)] text-[14px] tracking-widest mb-4">
            [ THE SOLUTION ]
          </p>
          <p className="text-[var(--color-fg)] text-[17px] leading-[28px]">
            {project.solution}
          </p>
        </div>

        {/* Screenshot placeholder — images added later */}
        <div className="mt-10 border border-dashed border-[var(--color-card-border)] rounded-[10px] h-[200px] flex items-center justify-center">
          <p className="text-[var(--color-muted)] text-[14px] tracking-widest">
            [ SCREENSHOTS COMING SOON ]
          </p>
        </div>

      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
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

  const [activeProject, setActiveProject] = useState(null)
  // Mirror into a ref so the wheel handler can read it without being a dep
  const activeProjectRef = useRef(null)
  useEffect(() => { activeProjectRef.current = activeProject }, [activeProject])

  // Stop/start Lenis with the modal
  useEffect(() => {
    if (activeProject) {
      lenisRef.current?.stop()
    } else {
      if (lockedRef.current) {
        // Section was locked when modal opened — keep Lenis stopped,
        // re-pin scroll position, and restart the card RAF
        const section = sectionRef.current
        lenisRef.current?.stop()
        if (section) lenisRef.current?.scrollTo(section.offsetTop, { immediate: true })
        startRAF()
      } else {
        lenisRef.current?.start()
      }
    }
  }, [activeProject])

  // ── Card animation ──────────────────────────────────────────────────────
  function updateCards(progress) {
    for (let i = 0; i < CARD_COUNT; i++) {
      const card = cardRefs.current[i]
      if (!card) continue
      const cardStart = i * SCROLL_PER_CARD
      const p         = clamp((progress - cardStart) / SCROLL_PER_CARD, 0, 1)
      const eased     = easeInOut(p)
      card.style.transform = `translateY(${110 - 220 * eased}vh)`
    }
  }

  function lock(initialProgress) {
    lockedRef.current     = true
    currentScroll.current = initialProgress
    targetScroll.current  = initialProgress
    updateCards(initialProgress)
    lenisRef.current?.stop()
    lenisRef.current?.scrollTo(sectionRef.current.offsetTop, { immediate: true })
    startRAF()
  }

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

  function unlockForward() {
    currentScroll.current = TOTAL_SCROLL
    targetScroll.current  = TOTAL_SCROLL
    updateCards(TOTAL_SCROLL)
    lockedRef.current   = false
    cooldownFwd.current = true
    cancelAnimationFrame(rafRef.current)
    lenisRef.current?.start()
  }

  function unlockBack() {
    currentScroll.current = 0
    targetScroll.current  = 0
    updateCards(0)
    lockedRef.current   = false
    cooldownBck.current = true
    cancelAnimationFrame(rafRef.current)
    lenisRef.current?.start()
  }

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

    if (
      !cooldownFwd.current &&
      lenis.direction === 1 &&
      lenis.scroll >= sectionTop &&
      lenis.scroll < sectionBottom
    ) { lock(0); return }

    if (
      !cooldownBck.current &&
      lenis.direction === -1 &&
      lenis.scroll >= sectionTop &&
      lenis.scroll <= sectionTop + 60
    ) { lock(TOTAL_SCROLL); return }
  })

  useEffect(() => {
    const handleWheel = (e) => {
      if (activeProjectRef.current) return   // modal open — don't intercept
      if (!lockedRef.current) return

      if (targetScroll.current <= 0 && e.deltaY < 0)             { unlockBack();    return }
      if (targetScroll.current >= TOTAL_SCROLL && e.deltaY > 0)  { unlockForward(); return }

      e.preventDefault()
      targetScroll.current = clamp(targetScroll.current + e.deltaY * 0.005, 0, TOTAL_SCROLL)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])   // runs once — no deps, so cleanup never cancels the RAF mid-session

  // Cancel RAF only on unmount
  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-screen overflow-hidden mt-[100px]"
      >
        {/* Section header */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
          <p className="text-[var(--color-muted)] text-[23px]">[ SOME OF OUR WORK ]</p>
          <p
            className="font-medium text-[var(--color-fg)] leading-none mt-4"
            style={{ fontSize: 'clamp(60px, 11.6vw, 167px)' }}
          >
            PROJECTS
          </p>
        </div>

        {/* Project cards */}
        {PROJECTS.map((project, i) => {
          const isRight = i % 2 === 0
          return (
            <button
              key={project.num}
              ref={el => { cardRefs.current[i] = el }}
              onClick={() => setActiveProject(project)}
              className="absolute flex flex-col justify-between bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-[10px] p-[32px] cursor-pointer hover:border-[var(--color-fg)]/40 transition-colors group"
              style={{
                width:      'min(52vw, 78vh)',
                height:     'min(52vw, 78vh)',
                top:        'calc(50% - min(26vw, 39vh))',
                ...(isRight ? { right: '5vw' } : { left: '5vw' }),
                zIndex:     10,
                transform:  'translateY(110vh)',
                willChange: 'transform',
              }}
            >
              {/* Number — top left */}
              <span className="text-[var(--color-muted)] text-[16px] text-left">[ {project.num} ]</span>

              {/* Title — bottom left */}
              <p
                className="text-[var(--color-fg)] font-medium leading-none text-left group-hover:opacity-80 transition-opacity"
                style={{ fontSize: 'clamp(28px, 3.5vw, 52px)' }}
              >
                {project.title}
              </p>
            </button>
          )
        })}
      </section>

      {/* Modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </>
  )
}
