'use client'

import { useRef, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { coverForTransition } from './PageTransitionOverlay'

const LINK_IMAGES = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
].map(nums => nums.map(n => `/images/person${n}.png`))

// Base link definitions — href must match the page's pathname exactly
// so the active-page swap logic below can detect which one to hide.
const BASE_LINKS = [
  { num: '01', label: 'ABOUT',    href: '/about',    images: LINK_IMAGES[0] },
  { num: '02', label: 'WORK',     href: '/work',     images: LINK_IMAGES[1] },
  { num: '03', label: 'SERVICES', href: '/services', images: LINK_IMAGES[2] },
  { num: '04', label: 'CONTACT',  href: '/contact',  images: LINK_IMAGES[3] },
]

const IMG_W    = 140   // px
const IMG_H    = 182   // px
const LIFETIME = 700   // ms each image lives
const INTERVAL = 210   // ms between spawns

// ── Image cloud constrained to a single menu row ──────────────────────────────
function MenuImageCloud({ images, linkRect }) {
  const [items,    setItems]    = useState([])
  const mountedRef = useRef(true)
  const idxRef     = useRef(0)
  const uidRef     = useRef(0)

  useEffect(() => {
    mountedRef.current = true
    idxRef.current     = 0

    const vh = window.innerHeight
    // Vertical centre of the hovered row (in viewport px → convert to %)
    const rowCenterPx = linkRect.top + linkRect.height / 2

    function showNext() {
      if (!mountedRef.current) return

      const src = images[idxRef.current % images.length]
      idxRef.current++

      // Vertical: image centred on the row, ±22 px of drift
      const topPx      = rowCenterPx - IMG_H / 2 + (Math.random() * 44 - 22)
      const top        = (topPx / vh) * 100

      // Horizontal: spread freely across right 50 % of the screen
      const left       = 42 + Math.random() * 48

      const variant    = Math.ceil(Math.random() * 4)
      const rotation   = (Math.random() * 10 - 5).toFixed(1)
      const uid        = ++uidRef.current

      setItems(prev => [...prev, { src, top, left, variant, rotation, uid }])

      setTimeout(() => {
        if (!mountedRef.current) return
        setItems(prev => prev.filter(item => item.uid !== uid))
      }, LIFETIME)

      setTimeout(showNext, INTERVAL)
    }

    showNext()

    return () => {
      mountedRef.current = false
      setItems([])
    }
  }, [images, linkRect])

  return (
    <>
      {items.map(item => (
        <div
          key={item.uid}
          className="absolute pointer-events-none select-none overflow-hidden"
          style={{
            top:       `${item.top}%`,
            left:      `${item.left}%`,
            width:     `${IMG_W}px`,
            height:    `${IMG_H}px`,
            transform: `rotate(${item.rotation}deg)`,
            animation: `person-glitch-${item.variant} ${LIFETIME / 1000}s ease forwards`,
          }}
        >
          <img
            src={item.src}
            alt=""
            draggable={false}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}
    </>
  )
}

// ── Main menu ─────────────────────────────────────────────────────────────────
export default function NavMenu() {
  const btnRef     = useRef(null)
  const linkRefs   = useRef([])
  const pathname   = usePathname()
  const router     = useRouter()

  // On the root page, show the 4 links exactly as defined.
  // On any other page, hoist a HOME link to the top and drop the link that
  // matches the current page. Numbers and image sets are reassigned by slot
  // position so HOME always gets slot 01 with the first image set, and the
  // other links fill 02–04 in their original order.
  const links = pathname === '/'
    ? BASE_LINKS
    : [{ label: 'HOME', href: '/' }, ...BASE_LINKS.filter(l => l.href !== pathname)]
        .map((link, i) => ({
          ...link,
          num:    `0${i + 1}`,
          images: LINK_IMAGES[i],
        }))

  const [isOpen,       setIsOpen]       = useState(false)
  const [origin,       setOrigin]       = useState('top right')
  const [btnRect,      setBtnRect]      = useState(null)
  const [linksIn,      setLinksIn]      = useState(false)
  const [hoveredLink,  setHoveredLink]  = useState(null)
  const [hoveredRect,  setHoveredRect]  = useState(null)

  // Capture pixel origin on mount — prevents first-open from animating from CSS keyword
  useEffect(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setBtnRect(rect)
      setOrigin(`${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`)
    }
  }, [])

  function handleOpen() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setBtnRect(rect)
      setOrigin(`${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`)
    }
    setIsOpen(true)
    setTimeout(() => setLinksIn(true), 450)
  }

  function handleClose() {
    setLinksIn(false)
    setHoveredLink(null)
    setHoveredRect(null)
    setIsOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function handleLinkEnter(i) {
    setHoveredLink(i)
    const el = linkRefs.current[i]
    if (el) setHoveredRect(el.getBoundingClientRect())
  }

  function handleLinkLeave() {
    setHoveredLink(null)
    setHoveredRect(null)
  }

  function handleLinkClick(e, href) {
    e.preventDefault()
    // Cover the screen with the transition overlay (using the same origin the
    // menu opened from), close the menu underneath it, then navigate.
    coverForTransition(origin)
    handleClose()
    setTimeout(() => router.push(href), 50)
  }

  return (
    <>
      {/* Trigger */}
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="text-[16px] font-normal tracking-wide hover:opacity-60 transition-opacity"
        aria-label="Open menu"
      >
        [ MENU ]
      </button>

      {/* ── Full-screen overlay ── */}
      <div
        className="fixed inset-0 z-[998] bg-[#000] flex flex-col"
        style={{
          clipPath:      isOpen ? `circle(200vmax at ${origin})` : `circle(0px at ${origin})`,
          transition:    'clip-path 0.9s cubic-bezier(0.7, 0, 0.2, 1)',
          pointerEvents: isOpen ? 'all' : 'none',
        }}
      >
        {/* Top bar — logo only */}
        <div className="flex items-center px-[30px] pt-[30px] shrink-0">
          <img
            src="/images/logos/monomLogoWhite.svg"
            alt="Monom Studio"
            className="h-[42px] w-auto"
          />
        </div>

        {/* Close — positioned exactly over the MENU button */}
        {btnRect && (
          <button
            onClick={handleClose}
            className="absolute text-white text-[16px] font-normal tracking-wide hover:opacity-60 transition-opacity whitespace-nowrap flex items-center"
            style={{ top: btnRect.top, left: btnRect.left, height: btnRect.height }}
            aria-label="Close menu"
          >
            [ CLOSE ]
          </button>
        )}

        {/* Image cloud — full overlay, images positioned to the hovered row */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          {hoveredLink !== null && hoveredRect && (
            <MenuImageCloud
              key={hoveredLink}
              images={links[hoveredLink].images}
              linkRect={hoveredRect}
            />
          )}
        </div>

        {/* Nav links */}
        <nav className="relative z-10 flex flex-col justify-center flex-1 px-[30px] md:px-[45px]">
          {links.map((link, i) => (
            <a
              key={link.num}
              ref={el => { linkRefs.current[i] = el }}
              href={link.href}
              onClick={e => handleLinkClick(e, link.href)}
              onMouseEnter={() => handleLinkEnter(i)}
              onMouseLeave={handleLinkLeave}
              className="flex items-baseline gap-4 border-t border-white/10 py-5 md:py-7 last:border-b last:border-white/10 hover:opacity-40 transition-opacity duration-200"
              style={{
                opacity:         linksIn ? 1 : 0,
                transform:       linksIn ? 'translateY(0)' : 'translateY(20px)',
                transition:      'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: `${i * 70}ms`,
              }}
            >
              <span className="text-white/30 text-[13px] tracking-widest shrink-0 mb-1">
                [ {link.num} ]
              </span>
              <span
                className="text-white font-medium leading-none"
                style={{ fontSize: 'clamp(42px, 8.5vw, 128px)' }}
              >
                {link.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Footer — theme + CTA */}
        <div className="flex items-center justify-between px-[30px] pb-[30px] shrink-0 border-t border-white/10 pt-6">
          <span className="text-white [&_button]:text-white">
            <ThemeToggle />
          </span>
          <button
            onClick={() => {
              handleClose()
              window.dispatchEvent(new CustomEvent('open-project-modal'))
            }}
            className="flex items-center gap-2 border border-white rounded-[10px] py-[8px] px-4 text-white text-[14px] font-normal hover:bg-white hover:text-black transition-colors"
          >
            START A PROJECT
            <img src="/images/arrowUpRight.svg" alt="" className="w-[9px] h-[9px] brightness-0 invert" />
          </button>
        </div>
      </div>
    </>
  )
}
