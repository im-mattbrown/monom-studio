'use client'

import { useRef, useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'

const PROJECTS = [
  {
    num: '01',
    title: "THAT'S ON ME",
    subtitle: 'AI POWERED VIRTUAL TRY-ON APP',
    url: "https://www.thatson.me/",
    logo: '/images/logos/tom.png',
    problem:
      "Shopping for clothes online leaves out one of the main steps when shopping in person. A buyer has no idea how an item of clothing will look on themselves before they buy, leading to carts being left empty when a buyer can't see themselves in it.",
    solution:
      "A virtual try-on application that leverages the power of Google's latest image generation model Nano-Banana. Users of That's on Me can upload a photo of themselves and the clothing they want to buy to see a new image of them with the clothing on.",
  },
  {
    num: '02',
    title: 'SHRTCTS',
    subtitle: 'POWER TO THE USER',
    url: "https://www.shrtcts.io/",
    logo: '/images/logos/shrtctsLogoMs.svg',
    problem:
      "Many modern software applications have keybindings that allow a user to increase their productivity and output. The issue is that many of these app shortcuts are hard to learn or often too boring to even start to master.",
    solution:
      "With shrtcts.io, users of Figma, Miro and VSCode can learn keybinding shortcuts through fun games and spaced repition where they progress through levels to become power users and speed up their workflows.",
  },
  {
    num: '03',
    title: 'CURL',
    subtitle: 'SURF THE WEB AGAIN',
    url: "https://www.curl.fyi/",
    logo: '/images/logos/curlLogo.png',
    problem:
      "The web is a stale, boring shell of what it once was. Between scrolling social media and using AI tools, not much time is left for using the web as it was meant to be. We no longer discover new things, get inspired or have life changing experiences on the web unless its driven by social media.",
    solution:
      "Curl allows users to surf the web like we did in the early 2000s. Discovering new and interesting websites is one click of a button away on Curl where you can explore over 2000+ websites curated to your preferences across a wide range of topics and domains.",
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
      onWheel={e => e.stopPropagation()}
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

        {/* URL */}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-[#4A8FE8] text-[16px] hover:text-[#6AAAF5] transition-colors group"
            onClick={e => e.stopPropagation()}
          >
            {project.url.replace(/^https?:\/\//, '')}
            <span className="inline-flex items-center justify-center border border-[#4A8FE8] group-hover:border-[#6AAAF5] rounded-[6px] p-[4px] transition-colors">
              <img src="/images/arrowUpRight.svg" alt="" className="w-[9px] h-[9px]" style={{ filter: 'invert(51%) sepia(60%) saturate(500%) hue-rotate(190deg) brightness(100%)' }} />
            </span>
          </a>
        )}

        <div className="mt-8 border-t border-[var(--color-card-border)]" />

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

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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
    if (isMobile) return
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
      if (isMobile || !lockedRef.current) return

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

  // ── Mobile layout: vertical stack, cards scroll over sticky title ──────────
  if (isMobile) {
    return (
      <>
        <section ref={sectionRef} id="projects" className="relative mt-[100px]">

          {/* Title — sticky so cards scroll over it */}
          <div className="sticky top-0 z-0 h-[55vh] flex flex-col items-center justify-center pointer-events-none select-none">
            <p className="text-[var(--color-muted)] text-[18px]">[ SOME OF OUR WORK ]</p>
            <p
              className="font-medium text-[var(--color-fg)] leading-none mt-3 text-center"
              style={{ fontSize: 'clamp(52px, 15vw, 90px)' }}
            >
              PROJECTS
            </p>
          </div>

          {/* Cards — z-10 so they cover the sticky title as they scroll up */}
          <div className="relative z-10 flex flex-col gap-4 px-[20px] pb-[60px]">
            {PROJECTS.map((project) => (
              <button
                key={project.num}
                onClick={() => setActiveProject(project)}
                className="w-full flex flex-col justify-between bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-[10px] p-[24px] text-left"
                style={{ minHeight: '260px' }}
              >
                <span className="text-[var(--color-muted)] text-[14px]">[ {project.num} ]</span>

                {project.logo && (
                  <div className="flex items-center justify-center flex-1 py-4">
                    <img
                      src={project.logo}
                      alt={project.title}
                      className="max-h-[80px] w-auto object-contain"
                    />
                  </div>
                )}

                <p
                  className="text-[var(--color-fg)] font-medium leading-none"
                  style={{ fontSize: 'clamp(24px, 7vw, 40px)' }}
                >
                  {project.title}
                </p>
              </button>
            ))}
          </div>

        </section>

        {activeProject && (
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </>
    )
  }

  // ── Desktop layout ─────────────────────────────────────────────────────────
  return (
    <>
      <section
        ref={sectionRef}
        id="projects"
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

              {/* Logo — centre */}
              {project.logo && (
                <div className="flex items-center justify-center flex-1">
                  <img
                    src={project.logo}
                    alt={project.title}
                    className="max-w-[45%] max-h-[45%] w-auto h-auto object-contain"
                  />
                </div>
              )}

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
