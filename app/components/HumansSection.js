'use client'

import { useState, useEffect, useRef } from 'react'

const PERSON_IMAGES = Array.from({ length: 16 }, (_, i) => `/images/person${i + 1}.png`)

/** Fisher-Yates shuffle — returns a new shuffled array */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function CharsTwo({ text, className }) {
  return text.split('').map((char, i) => (
    <span key={i} className={className}>{char}</span>
  ))
}

// Each image lives for LIFETIME ms. Next spawns every INTERVAL ms.
// Overlap = LIFETIME - INTERVAL = 100 ms of two images coexisting.
const LIFETIME = 720
const INTERVAL = 220

function PeopleCloud() {
  const [items, setItems] = useState([])
  const mountedRef = useRef(true)
  const queueRef   = useRef([])
  const uidRef     = useRef(0)

  useEffect(() => {
    mountedRef.current = true
    queueRef.current   = shuffle(PERSON_IMAGES)

    function showNext() {
      if (!mountedRef.current) return

      if (queueRef.current.length === 0) {
        queueRef.current = shuffle(PERSON_IMAGES)
      }

      const src     = queueRef.current.shift()
      const top     = 5  + Math.random() * 62
      const left    = 5  + Math.random() * 68
      const variant = Math.ceil(Math.random() * 4)                    // 1–4
      const rotation = (Math.random() * 12 - 6).toFixed(1)           // –6° to +6°
      const uid     = ++uidRef.current

      setItems(prev => [...prev, { src, top, left, variant, rotation, uid }])

      setTimeout(() => {
        if (!mountedRef.current) return
        setItems(prev => prev.filter(item => item.uid !== uid))
      }, LIFETIME)

      setTimeout(showNext, INTERVAL)
    }

    showNext()

    return () => { mountedRef.current = false }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {items.map(item => (
        // Outer div: position + base rotation (independent of animation transform)
        <div
          key={item.uid}
          className="absolute pointer-events-none select-none"
          style={{
            top:      `${item.top}%`,
            left:     `${item.left}%`,
            transform: `rotate(${item.rotation}deg)`,
          }}
        >
          <img
            src={item.src}
            alt=""
            draggable={false}
            className="w-[200px] h-auto object-contain"
            style={{ animation: `person-glitch-${item.variant} ${LIFETIME / 1000}s ease forwards` }}
          />
        </div>
      ))}
    </div>
  )
}

export default function HumansSection() {
  return (
    <section className="mt-[100px] px-[30px] flex gap-8">

      {/* ── LEFT: text ── */}
      <div className="shrink-0">
        <h2
          className="text-[var(--color-fg)] font-medium leading-tight"
          style={{ fontSize: 'clamp(40px, 5.9vw, 85px)' }}
        >
          BUILT BY HUMANS
          <br />
          FOR HUMANS
        </h2>

        <p className="text-[var(--color-muted)] text-[23px] mt-8">[ AUTHENTIC INTELLIGENCE ]</p>

        <div className="mt-8">
          <p className="text-[23px] w-[404px] leading-normal whitespace-pre-wrap">
            <CharsTwo text="OUR ETHOS ARE SIMPLE: WE BUILD " />
            <CharsTwo text="WEB   EXPERIENCES  WITH  PEOPLE" />
            <CharsTwo text=" AT  THE CORE OF EVERYTHING  WE " />
            <CharsTwo text="DESIGN                AND                BUILD " />
            <CharsTwo text="YOUR END  USER IS WHO  WE HAVE " />
            <CharsTwo text="IN      MIND      AT      EVERY      TURN" />
          </p>
        </div>

        <p className="text-[23px] mt-12 w-[404px] text-[var(--color-muted)] leading-normal whitespace-pre-wrap">
          <CharsTwo text="OUR     DESIGN     DECISIONS      ARE " />
          <CharsTwo text="INFORMED  BY DATA   AND BACKED " />
          <CharsTwo text="BY   USER RESEARCH,   FOLLOWING " />
          <CharsTwo text="INDUSTRY   BEST PRACTICES   AND " />
          <CharsTwo text="NEVER CUTTING CORNERS.  WE DO " />
          <CharsTwo text="USE   AI TOOLS  WHEN NECESSARY " />
          <CharsTwo text="TO    ENHANCE   OUR    WORKFLOW " />
          <CharsTwo text="NOT TO REPLACE    HUMAN TOUCH" />
        </p>
      </div>

      {/* ── RIGHT: random person spawn cloud ── */}
      <div className="flex-1 relative overflow-hidden">
        <PeopleCloud />
      </div>

    </section>
  )
}
