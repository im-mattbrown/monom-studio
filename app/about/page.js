'use client'

import { useRef, useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import ThemeToggle from '../components/ThemeToggle'
import NavMenu from '../components/NavMenu'
import StartProjectButton from '../components/StartProjectButton'
import StartProjectModal from '../components/StartProjectModal'
import Footer from '../components/Footer'
import EthosSection from '../components/EthosSection'
import WallRevealImage from '../components/WallRevealImage'
import AboutText from '../components/AboutText'

// ── Char splitter (same as index page) ───────────────────────────────────────
function Chars({ text, className }) {
  return text.split('').map((char, i) => (
    <span key={i} className={className}>{char}</span>
  ))
}

// ── All 16 person images ──────────────────────────────────────────────────────
const ALL_PEOPLE = Array.from({ length: 16 }, (_, i) => `/images/person${i + 1}.png`)

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const LIFETIME = 850
const INTERVAL = 145

// ── People cloud — all 16 images, same glitch style ──────────────────────────
function HeroCloud() {
  const [items,    setItems]    = useState([])
  const mountedRef = useRef(true)
  const queueRef   = useRef([])
  const uidRef     = useRef(0)

  useEffect(() => {
    mountedRef.current = true
    queueRef.current   = shuffle(ALL_PEOPLE)

    function showNext() {
      if (!mountedRef.current) return
      if (queueRef.current.length === 0) queueRef.current = shuffle(ALL_PEOPLE)

      const src      = queueRef.current.shift()
      const top      = 2  + Math.random() * 60
      const left     = 2  + Math.random() * 82
      const variant  = Math.ceil(Math.random() * 4)
      const rotation = (Math.random() * 14 - 7).toFixed(1)
      const uid      = ++uidRef.current

      setItems(prev => [...prev, { src, top, left, variant, rotation, uid }])

      setTimeout(() => {
        if (!mountedRef.current) return
        setItems(prev => prev.filter(i => i.uid !== uid))
      }, LIFETIME)

      setTimeout(showNext, INTERVAL)
    }

    showNext()
    return () => { mountedRef.current = false }
  }, [])

  return (
    <>
      {items.map(item => (
        <div
          key={item.uid}
          className="absolute pointer-events-none select-none overflow-hidden"
          style={{
            top:       `${item.top}%`,
            left:      `${item.left}%`,
            width:     '190px',
            height:    '248px',
            transform: `rotate(${item.rotation}deg)`,
            animation: `person-glitch-${item.variant} ${LIFETIME / 1000}s ease forwards`,
          }}
        >
          <img src={item.src} alt="" draggable={false} className="w-full h-full object-cover object-top" />
        </div>
      ))}
    </>
  )
}

// ── ABOUT title — starts large/overflowing, shrinks as you scroll ─────────────
// bottom: calc(font-size * -0.5) puts the transform-centre exactly at the
// hero's bottom edge, so only the top half of the scaled title is visible.
function AboutTitle() {
  const ref = useRef(null)

  useLenis((lenis) => {
    if (!ref.current) return
    const heroH    = window.innerHeight
    const progress = Math.min(1, Math.max(0, lenis.scroll / heroH))
    ref.current.style.transform = `scale(${1.5 - 0.5 * progress})`
  })

  return (
    <p
      ref={ref}
      className="text-[var(--color-fg)] font-medium whitespace-nowrap text-center leading-none select-none"
      style={{
        fontSize:        'clamp(80px, 23.6vw, 340px)',
        transform:       'scale(1.5)',
        transformOrigin: 'center',
        willChange:      'transform',
      }}
    >
      ABOUT
    </p>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main className="bg-[var(--color-bg)] min-h-screen text-[var(--color-fg)] font-medium overflow-x-hidden">

      {/* ── NAV (fixed) ── */}
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

      {/* ── HERO ── */}
      <section className="relative h-screen">

        {/* People cloud — fills the hero behind everything */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <HeroCloud />
        </div>

        {/* Hero text — same position / text as index page */}
        <div className="absolute z-10 px-[30px] mt-[70px]" style={{ top: '72px' }}>
          <p className="text-[23px] w-[355px] leading-normal whitespace-pre-wrap">
            <Chars text={"                AT MONOM STUDIO WE "} />
            <Chars text="ARE ABOUT" className="underline" />
            <Chars text={" ONE THING.     BUILDING FOR PEOPLE ||               YOUR PEOPLE || "} />
            <Chars text="BUILT BY HUMANS." className="underline" />
            <Chars text={" OUR MOTTO AND CREED IS SIMPLE. "} />
            <Chars text="WE ARE:" className="underline" />
          </p>
          <img
            src="/images/shape1.svg"
            alt=""
            className="absolute theme-invert"
            style={{ bottom: '235px', left: '85px' }}
          />
          <p className="text-[var(--color-muted)] text-[17px] mt-8">THE HUMAN AGENCY</p>
        </div>

        {/* Soft gradient so people fade into the title area */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height:     '40%',
            background: 'linear-gradient(to bottom, transparent, var(--color-bg))',
          }}
        />

        {/* ABOUT title
            bottom = -(font-size / 2) positions the element so its vertical
            centre sits exactly at the hero's bottom edge.
            overflow:hidden on the section clips the lower half,
            revealing only the top half at scale(1.5). */}
        <div
          className="absolute left-0 right-0 z-20"
          style={{ bottom: 'calc(clamp(80px, 23.6vw, 340px) * -0.5)' }}
        >
          <AboutTitle />
        </div>

      </section>

      {/* ── ETHOS SECTION ── */}
      <div className="mt-[200px]">
        <EthosSection />
      </div>

      {/* ── WALL IMAGE — square crop that reveals to full on scroll ── */}
      <WallRevealImage />

      {/* ── ABOUT TEXT — words reveal to white on scroll ── */}
      <AboutText />

      <Footer />
      <StartProjectModal />
    </main>
  )
}
