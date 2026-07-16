'use client'

import { useRef, useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'

const CARDS = [
  {
    num: '01',
    title: 'NO SHORTCUTS',
    desc: 'WE DO NOT CUT CORNERS. EACH SITE AND APP WE BUILD HAS YOU AND YOUR PEOPLE AT THE CORE OF ALL WE DO. OUR PROJECTS ARE TAILORED TO YOUR UNIQUE BUSINESS. DESIGN IS AN INNATELY HUMAN PROCESS AND WE WANT TO KEEP IT THAT WAY.',
  },
  {
    num: '02',
    title: 'ONLY SUPERPOWERS',
    desc: 'WE DESIGN EVERY SITE FROM THE GROUND UP STARTING WITH WIREFRAMES INCREMENTALLY IMPROVING TOWARDS THE FINAL PRODUCT. WE DO USE AI FOR DEVELOPMENT BUT ONLY TO ENHANCE OUR ABILITIES.',
  },
  {
    num: '03',
    title: 'F  CK TEMPLATES',
    titleNode: (
      <>
        FU
        <img
          src="/images/shape1.svg"
          alt=""
          className="inline-block theme-invert"
          style={{ width: '0.75em', height: '0.75em', verticalAlign: 'middle', margin: '0 0.04em 0.1em' }}
        />
        K TEMPLATES
      </>
    ),
    desc: 'WE ARE PASSIONATE ABOUT CRAFT. YOU WILL NOT GET A TEMPLATE SITE OR SOME AI SLOP. WE BUILD SITES WITH CODE FROM ZERO, NO SQUARESPACE OR WEBFLOW TEMPLATES. YOU AND YOUR PEOPLE DESERVE BETTER.',
  },
]

export default function EthosSection() {
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
    ) { lockForward(); return }

    if (
      !cooldownBck.current &&
      lenis.direction === -1 &&
      lenis.scroll >= sectionTop &&
      lenis.scroll <= sectionTop + 60
    ) { lockBackward(); return }
  })

  useEffect(() => {
    if (isMobile) return
    const track = trackRef.current
    if (!track) return

    const handleWheel = (e) => {
      if (!lockedRef.current) return
      const maxX = track.scrollWidth - window.innerWidth
      if (targetX.current <= 0 && e.deltaY < 0)     { unlockBack();    return }
      if (targetX.current >= maxX && e.deltaY > 0)  { unlockForward(); return }
      e.preventDefault()
      targetX.current = Math.max(0, Math.min(maxX, targetX.current + e.deltaY * 1.5))
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

  // ── Mobile ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section ref={sectionRef} className="px-[20px] pt-[60px] pb-[40px]">
        <div className="flex justify-between mb-8">
          <p className="text-[var(--color-fg)] text-[20px]">ABOUT US</p>
          <p className="text-[var(--color-muted)] text-[20px]">OUR ETHOS</p>
        </div>
        <div className="flex flex-col gap-4">
          {CARDS.map((c) => (
            <div
              key={c.num}
              className="flex flex-col justify-between border border-[var(--color-fg)]/20 rounded-[10px] p-[24px] gap-8"
            >
              <span className="text-[var(--color-muted)] text-[14px]">[ {c.num} ]</span>
              <div>
                <p
                  className="text-[var(--color-fg)] font-medium leading-none"
                  style={{ fontSize: 'clamp(36px, 9vw, 56px)' }}
                >
                  {c.titleNode ?? c.title}
                </p>
                <p className="text-[var(--color-muted)] text-[16px] leading-[26px] mt-4">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div className="flex w-full justify-between">
        <p className="absolute top-[40px] left-[45px] text-[var(--color-fg)] text-[23px] z-10 pointer-events-none">
          ABOUT US
        </p>
        <p className="absolute top-[40px] right-[45px] text-[var(--color-muted)] text-[23px] z-10 pointer-events-none">
          OUR ETHOS
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex h-full items-stretch gap-5 pt-[100px] pb-[40px] pl-[45px] pr-[45px]"
        style={{ width: 'max-content', willChange: 'transform' }}
      >
        {CARDS.map((c) => (
          <div
            key={c.num}
            className="w-[65vw] flex flex-col justify-between border border-[var(--color-fg)]/20 rounded-[10px] p-[40px]"
          >
            <span className="text-[var(--color-muted)] text-[16px]">[ {c.num} ]</span>
            <div>
              <p
                className="text-[var(--color-fg)] font-medium leading-none"
                style={{ fontSize: 'clamp(48px, 6vw, 90px)' }}
              >
                {c.titleNode ?? c.title}
              </p>
              <p className="text-[var(--color-muted)] text-[18px] leading-[28px] mt-6 max-w-[480px]">
                {c.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
