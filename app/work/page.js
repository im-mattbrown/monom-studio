'use client'

import { useRef, useState, useEffect } from 'react'
import ThemeToggle from '../components/ThemeToggle'
import NavMenu from '../components/NavMenu'
import StartProjectButton from '../components/StartProjectButton'
import StartProjectModal from '../components/StartProjectModal'
import Footer from '../components/Footer'

// ── PROJECTS — edit these to change titles, videos, and copy ─────────────────
// Each entry: { num, title, videoSrc, description }
// videoSrc can be left as '' if a project doesn't have a video yet.
const PROJECTS = [
  {
    num: '01',
    title: 'DEVIL BOYS BARBERSHOP',
    videoSrc: 'https://matte-cdn.b-cdn.net/DBScreenLow.mp4',
    description:
      'PLACEHOLDER COPY FOR DEVIL BOYS BARBERSHOP. REPLACE THIS WITH THE REAL DESCRIPTION OF THE PROJECT.',
  },
  {
    num: '02',
    title: 'RB BOARDS',
    videoSrc: '',
    description:
      'PLACEHOLDER COPY FOR RB BOARDS. REPLACE THIS WITH THE REAL DESCRIPTION OF THE PROJECT.',
  },
  {
    num: '03',
    title: "THAT'S ON ME",
    videoSrc: '',
    description:
      "PLACEHOLDER COPY FOR THAT'S ON ME. REPLACE THIS WITH THE REAL DESCRIPTION OF THE PROJECT.",
  },
  {
    num: '04',
    title: 'SHRTCTS.IO',
    videoSrc: '',
    description:
      'PLACEHOLDER COPY FOR SHRTCTS.IO. REPLACE THIS WITH THE REAL DESCRIPTION OF THE PROJECT.',
  },
]

const VIDEO_W = 380
const VIDEO_H = 214   // 16:9

// ── Row ─────────────────────────────────────────────────────────────────────
function ProjectRow({ project, isActive, isAnyActive, onEnter }) {
  const rowRef     = useRef(null)
  const videoRef   = useRef(null)
  const targetRef  = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef     = useRef(null)

  function setMousePos(e) {
    if (!rowRef.current) return
    const rect = rowRef.current.getBoundingClientRect()
    targetRef.current.x = e.clientX - rect.left - VIDEO_W / 2
    targetRef.current.y = e.clientY - rect.top  - VIDEO_H / 2
  }

  function handleMouseEnter(e) {
    setMousePos(e)
    // Snap so the video appears under the cursor with no glide-in from origin
    currentRef.current.x = targetRef.current.x
    currentRef.current.y = targetRef.current.y
    if (videoRef.current) {
      videoRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`
    }
    onEnter()
  }

  // Drive the cursor-follow lerp while active
  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(rafRef.current)
      if (videoRef.current) videoRef.current.pause()
      return
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.18
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.18
      if (videoRef.current) {
        videoRef.current.style.transform =
          `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive])

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={setMousePos}
      className="relative border-t border-[var(--color-fg)]/15 last:border-b last:border-[var(--color-fg)]/15 px-[30px] md:px-[45px] cursor-pointer overflow-hidden"
      style={{
        opacity:    isAnyActive && !isActive ? 0.25 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Top row — number + title, matches the menu link layout */}
      <div className="flex items-baseline gap-4 py-7 md:py-9">
        <span className="text-[var(--color-muted)] text-[13px] tracking-widest shrink-0 mb-1">
          [ {project.num} ]
        </span>
        <span
          className="text-[var(--color-fg)] font-medium leading-none"
          style={{ fontSize: 'clamp(49px, 8.65vw, 136px)' }}
        >
          {project.title}
        </span>
      </div>

      {/* Description — reveals when active */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out"
        style={{
          maxHeight: isActive ? '240px' : '0px',
          opacity:   isActive ? 1 : 0,
        }}
      >
        <p className="text-[var(--color-muted)] text-[16px] md:text-[18px] max-w-[640px] leading-[26px] md:leading-[30px] pb-10">
          {project.description}
        </p>
      </div>

      {/* Cursor-follow video — absolute, transforms updated each frame */}
      {project.videoSrc && (
        <video
          ref={videoRef}
          src={project.videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute top-0 left-0 pointer-events-none rounded-[10px] shadow-2xl"
          style={{
            width:      `${VIDEO_W}px`,
            height:     `${VIDEO_H}px`,
            objectFit:  'cover',
            opacity:    isActive ? 1 : 0,
            transition: 'opacity 0.25s ease',
            willChange: 'transform',
            zIndex:     2,
          }}
        />
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function WorkPage() {
  const [activeIdx, setActiveIdx] = useState(null)

  return (
    <main className="bg-[var(--color-bg)] min-h-screen text-[var(--color-fg)] font-medium overflow-x-hidden">

      {/* ── NAV (same fixed pattern as the other pages) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-[30px] pt-[30px]">
        <a href="/">
          <img src="/images/logos/monomLogoWhite.svg" alt="Monom Studio" className="h-[42px] w-auto theme-invert" />
        </a>
        <span className="hidden md:block"><ThemeToggle /></span>
        <NavMenu />
        <StartProjectButton className="hidden md:flex items-center gap-1 border border-[var(--color-fg)] rounded-[10px] py-[7.5px] px-3 text-[16px] font-normal hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors">
          START A PROJECT
          <span className="inline-flex items-center justify-center p-[5px]">
            <img src="/images/arrowUpRight.svg" alt="" className="w-[9.5px] h-[9.5px] theme-invert" />
          </span>
        </StartProjectButton>
      </nav>

      {/* ── WORK title ── */}
      <section className="pt-[160px] pb-[60px] px-[30px] md:px-[45px]">
        <p
          className="text-[var(--color-fg)] font-medium leading-none"
          style={{ fontSize: 'clamp(80px, 14vw, 220px)' }}
        >
          WORK
        </p>
      </section>

      {/* ── Project list ──
          onMouseLeave on the wrapping section clears active state so we never
          flicker between row swaps (avoids the brief null state that would
          happen if rows handled their own onLeave). */}
      <section onMouseLeave={() => setActiveIdx(null)}>
        {PROJECTS.map((project, i) => (
          <ProjectRow
            key={project.num}
            project={project}
            isActive={activeIdx === i}
            isAnyActive={activeIdx !== null}
            onEnter={() => setActiveIdx(i)}
          />
        ))}
      </section>

      <Footer />
      <StartProjectModal />
    </main>
  )
}
