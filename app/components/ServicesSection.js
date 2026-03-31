'use client'

import { useRef, useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'

const SERVICES = [
  {
    num: '01',
    title: 'WEB DESIGN',
    desc: 'PIXEL-PERFECT INTERFACES BUILT AROUND YOUR USERS. WE DESIGN EXPERIENCES THAT FEEL INTUITIVE, LOOK CONSIDERED, AND LEAVE A LASTING IMPRESSION.',
  },
  {
    num: '02',
    title: 'DEVELOPMENT',
    desc: 'FAST, ACCESSIBLE, AND BUILT TO SCALE. WE WRITE CLEAN CODE THAT PERFORMS IN THE REAL WORLD ON EVERY DEVICE, IN EVERY CONDITION.',
  },
  {
    num: '03',
    title: 'BRANDING',
    desc: 'IDENTITY SYSTEMS THAT GIVE YOUR BUSINESS A VOICE. FROM LOGO TO LANGUAGE, WE BUILD BRANDS THAT MEAN SOMETHING TO THE PEOPLE WHO MATTER.',
  },
  {
    num: '04',
    title: 'SEO & GROWTH',
    desc: 'VISIBILITY THAT COMPOUNDS OVER TIME. WE PAIR TECHNICAL SEO WITH CONTENT STRATEGY TO BRING THE RIGHT PEOPLE TO YOUR DOOR AND KEEP THEM THERE.',
  },
  {
    num: '05',
    title: 'STRATEGY',
    desc: 'CLARITY BEFORE EXECUTION. WE WORK WITH YOU TO UNDERSTAND YOUR GOALS, YOUR MARKET, AND YOUR USERS SO THAT EVERY DECISION WE MAKE IS INTENTIONAL.',
  },
]

export default function ServicesSection() {
  const sectionRef  = useRef(null)
  const trackRef    = useRef(null)
  const lenisRef    = useRef(null)
  const lockedRef   = useRef(false)
  const cooldownFwd = useRef(false)
  const cooldownBck = useRef(false)
  const currentX    = useRef(0)
  const targetX     = useRef(0)
  const rafRef      = useRef(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── RAF lerp ──────────────────────────────────────────────────────────────
  function startHorizontalRAF() {
    const track = trackRef.current
    if (!track) return
    cancelAnimationFrame(rafRef.current)
    const tick = () => {
      if (!lockedRef.current) return
      const diff = targetX.current - currentX.current
      currentX.current += Math.abs(diff) > 0.1 ? diff * 0.1 : diff
      track.style.transform = `translateX(${-currentX.current}px)`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function lockForward() {
    const section = sectionRef.current
    if (!section) return
    currentX.current = 0
    targetX.current  = 0
    if (trackRef.current) trackRef.current.style.transform = 'translateX(0px)'
    lockedRef.current = true
    lenisRef.current?.stop()
    lenisRef.current?.scrollTo(section.offsetTop, { immediate: true })
    startHorizontalRAF()
  }

  function lockBackward() {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return
    const maxX = track.scrollWidth - window.innerWidth
    currentX.current = maxX
    targetX.current  = maxX
    track.style.transform = `translateX(${-maxX}px)`
    lockedRef.current = true
    lenisRef.current?.stop()
    lenisRef.current?.scrollTo(section.offsetTop, { immediate: true })
    startHorizontalRAF()
  }

  function unlockForward() {
    const track = trackRef.current
    if (!track) return
    const maxX = track.scrollWidth - window.innerWidth
    currentX.current = maxX
    targetX.current  = maxX
    track.style.transform = `translateX(${-maxX}px)`
    lockedRef.current   = false
    cooldownFwd.current = true
    cancelAnimationFrame(rafRef.current)
    lenisRef.current?.start()
  }

  function unlockBack() {
    const track = trackRef.current
    if (!track) return
    currentX.current = 0
    targetX.current  = 0
    track.style.transform = 'translateX(0px)'
    lockedRef.current   = false
    cooldownBck.current = true
    cancelAnimationFrame(rafRef.current)
    lenisRef.current?.start()
  }

  // ── Lenis scroll detection (desktop only) ─────────────────────────────────
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
    ) {
      lockForward()
      return
    }

    if (
      !cooldownBck.current &&
      lenis.direction === -1 &&
      lenis.scroll >= sectionTop &&
      lenis.scroll <= sectionTop + 60
    ) {
      lockBackward()
      return
    }
  })

  // ── Wheel handler (desktop only) ───────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return

    const track = trackRef.current
    if (!track) return

    const handleWheel = (e) => {
      if (!lockedRef.current) return
      const maxX = track.scrollWidth - window.innerWidth

      if (targetX.current <= 0 && e.deltaY < 0) { unlockBack();    return }
      if (targetX.current >= maxX && e.deltaY > 0) { unlockForward(); return }

      e.preventDefault()
      targetX.current = Math.max(0, Math.min(maxX, targetX.current + e.deltaY * 1.5))
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

  // ── Mobile layout: vertical stack ─────────────────────────────────────────
  if (isMobile) {
    return (
      <section ref={sectionRef} className="px-[20px] pt-[60px] pb-[40px]">
        <div className="flex justify-between mb-8">
          <p className="text-[var(--color-fg)] text-[20px]">OUR SERVICES</p>
          <p className="text-[var(--color-muted)] text-[20px]">WHAT WE OFFER</p>
        </div>
        <div className="flex flex-col gap-4">
          {SERVICES.map((s) => (
            <div
              key={s.num}
              className="flex flex-col justify-between border border-[var(--color-fg)]/20 rounded-[10px] p-[24px] gap-8"
            >
              <span className="text-[var(--color-muted)] text-[14px]">[ {s.num} ]</span>
              <div>
                <p
                  className="text-[var(--color-fg)] font-medium leading-none"
                  style={{ fontSize: 'clamp(36px, 9vw, 56px)' }}
                >
                  {s.title}
                </p>
                <p className="text-[var(--color-muted)] text-[16px] leading-[26px] mt-4">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── Desktop layout: horizontal scroll ─────────────────────────────────────
  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div className='flex w-full justify-between'>
        <p className="absolute top-[40px] left-[45px] text-[var(--color-fg)] text-[23px] z-10 pointer-events-none">
          OUR SERVICES
        </p>
        <p className="absolute top-[40px] right-[45px] text-[var(--color-muted)] text-[23px] z-10 pointer-events-none">
          WHAT WE OFFER
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex h-full items-stretch gap-5 pt-[100px] pb-[40px] pl-[45px] pr-[45px]"
        style={{ width: 'max-content', willChange: 'transform' }}
      >
        {SERVICES.map((s) => (
          <div
            key={s.num}
            className="w-[65vw] flex flex-col justify-between border border-[var(--color-fg)]/20 rounded-[10px] p-[40px]"
          >
            <span className="text-[var(--color-muted)] text-[16px]">[ {s.num} ]</span>
            <div>
              <p
                className="text-[var(--color-fg)] font-medium leading-none"
                style={{ fontSize: 'clamp(48px, 6vw, 90px)' }}
              >
                {s.title}
              </p>
              <p className="text-[var(--color-muted)] text-[18px] leading-[28px] mt-6 max-w-[480px]">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
