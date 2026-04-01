'use client'

import { useState, useRef, useEffect } from 'react'

const STUDIO_LINKS = [
  'ABOUT',
  'WORK',
  'SERVICES',
  'CONTACT',
  'PROCESS',
]

const SERVICES = [
  {
    num:   '01',
    title: 'WEB DESIGN',
    desc:  'PIXEL-PERFECT INTERFACES BUILT AROUND YOUR USERS. WE DESIGN EXPERIENCES THAT FEEL INTUITIVE, LOOK CONSIDERED, AND LEAVE A LASTING IMPRESSION.',
  },
  {
    num:   '02',
    title: 'DEVELOPMENT',
    desc:  'FAST, ACCESSIBLE, AND BUILT TO SCALE. WE WRITE CLEAN CODE THAT PERFORMS IN THE REAL WORLD ON EVERY DEVICE, IN EVERY CONDITION.',
  },
  {
    num:   '03',
    title: 'BRANDING',
    desc:  'IDENTITY SYSTEMS THAT GIVE YOUR BUSINESS A VOICE. FROM LOGO TO LANGUAGE, WE BUILD BRANDS THAT MEAN SOMETHING TO THE PEOPLE WHO MATTER.',
  },
  {
    num:   '04',
    title: 'SEO & GROWTH',
    desc:  'VISIBILITY THAT COMPOUNDS OVER TIME. WE PAIR TECHNICAL SEO WITH CONTENT STRATEGY TO BRING THE RIGHT PEOPLE TO YOUR DOOR AND KEEP THEM THERE.',
  },
  {
    num:   '05',
    title: 'STRATEGY',
    desc:  'CLARITY BEFORE EXECUTION. WE WORK WITH YOU TO UNDERSTAND YOUR GOALS, YOUR MARKET, AND YOUR USERS SO THAT EVERY DECISION WE MAKE IS INTENTIONAL.',
  },
]

const SOCIALS = [
  { label: 'INSTAGRAM', icon: '/images/logos/instagram.svg', href: '#' },
  { label: 'BEHANCE',   icon: '/images/logos/behance.svg',   href: '#' },
  { label: 'X',         icon: '/images/logos/x.svg',         href: '#' },
]

const CARD_SIZE = 380

export default function Footer() {
  const [active, setActive] = useState(null)
  const mouseRef            = useRef({ x: 0, y: 0 })
  const cardRef             = useRef(null)
  const rafRef              = useRef(null)

  useEffect(() => {
    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    let cx = mouseRef.current.x
    let cy = mouseRef.current.y

    const tick = () => {
      const { x, y } = mouseRef.current
      cx += (x - cx) * 0.12
      cy += (y - cy) * 0.12

      const offset = 24
      // Position card to the LEFT of the cursor
      const left = Math.max(cx - CARD_SIZE - offset, offset)
      const top  = Math.max(Math.min(cy - CARD_SIZE / 2, window.innerHeight - CARD_SIZE - offset), offset)

      card.style.left = `${left}px`
      card.style.top  = `${top}px`
      rafRef.current  = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <>
      {/* ── Floating service card ─────────────────────────────────────── */}
      <div
        ref={cardRef}
        style={{
          position:      'fixed',
          width:         `${CARD_SIZE}px`,
          height:        `${CARD_SIZE}px`,
          zIndex:        1000,
          pointerEvents: 'none',
          transition:    'opacity 0.2s ease, transform 0.2s ease',
          opacity:       active ? 1 : 0,
          transform:     active ? 'scale(1)' : 'scale(0.92)',
        }}
      >
        {active && (
          <div className="w-full h-full flex flex-col justify-between border border-[var(--color-fg)]/20 rounded-[10px] p-[32px] bg-[var(--color-bg)]">
            <span className="text-[var(--color-muted)] text-[16px]">
              [ {active.num} ]
            </span>
            <div>
              <p
                className="text-[var(--color-fg)] font-medium leading-none"
                style={{ fontSize: 'clamp(18px, 2vw, 29px)' }}
              >
                {active.title}
              </p>
              <p className="text-[var(--color-muted)] text-[15px] leading-[24px] mt-5">
                {active.desc}
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-[120px] border-t border-[var(--color-card-border)]">

        {/* ── Main grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-y-10 md:gap-y-0 gap-x-8 px-[30px] md:px-[45px] pt-[60px] pb-[60px]">

          {/* Col 1 — Logo + socials */}
          <div className="flex flex-col justify-between">
            <img
              src="/images/logos/monomLogoWhite.svg"
              alt="Monom Studio"
              className="h-[38px] w-auto self-start theme-invert"
            />
            <div className="flex flex-col gap-5 mt-12">
              {SOCIALS.map(({ label, icon, href }) => (
                <a key={label} href={href} className="flex items-center gap-3 group">
                  <img
                    src={icon}
                    alt={label}
                    className="w-[18px] h-[18px] theme-icon opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="text-[var(--color-muted)] text-[16px] tracking-widest group-hover:text-[var(--color-fg)] transition-colors">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — tagline */}
          <div className="flex flex-col justify-end">
            <p className="text-[var(--color-muted)] text-[16px] leading-relaxed max-w-[200px]">
              A MODERN AGENCY BUILT FOR EMERGING COMPANIES.
            </p>
          </div>

          {/* Col 3 + 4 — Studio & Services: side by side on mobile, separate grid cols on desktop */}
          <div className="flex justify-between md:contents gap-8">

            {/* Col 3 — Studio links */}
            <div>
              <p className="text-[var(--color-muted)] text-[14px] mb-6 tracking-widest">
                [ STUDIO ]
              </p>
              <ul className="flex flex-col gap-3">
                {STUDIO_LINKS.map(l => (
                  <li key={l}>
                    <a href="#" className="text-[var(--color-fg)] text-[16px] hover:text-[var(--color-muted)] transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Services links */}
            <div>
              <p className="text-[var(--color-muted)] text-[14px] mb-6 tracking-widest">
                [ SERVICES ]
              </p>
              <ul className="flex flex-col gap-3">
                {SERVICES.map(service => (
                  <li key={service.num}>
                    <a
                      href="#"
                      className="text-[var(--color-fg)] text-[16px] transition-colors"
                      style={{ opacity: active && active.num !== service.num ? 0.35 : 1 }}
                      onMouseEnter={() => setActive(service)}
                      onMouseLeave={() => setActive(null)}
                    >
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <div className="border-t border-[var(--color-card-border)] px-[30px] md:px-[45px] py-[24px] flex items-center justify-between">
          <p className="text-[var(--color-muted)] text-[16px]">© 2026 MONOM STUDIO</p>
          <span className="text-[var(--color-muted)] text-[16px] md:hidden">||</span>
          <p className="text-[var(--color-muted)] text-[16px] pl-[30px] md:pl-0">THE HUMAN AGENCY</p>
        </div>

      </footer>
    </>
  )
}
