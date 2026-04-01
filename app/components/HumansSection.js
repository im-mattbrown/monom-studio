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

// imgW / imgH define a fixed box — object-cover crops consistently across all photos.
// maxTop / maxLeft are percentages that keep the fixed-size box inside the container.
function PeopleCloud({
  imgW   = 200,
  imgH   = 260,
  maxTop = 60,
  maxLeft = 65,
  minH   = '500px',
}) {
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

      const src      = queueRef.current.shift()
      const top      = 2  + Math.random() * maxTop
      const left     = 2  + Math.random() * maxLeft
      const variant  = Math.ceil(Math.random() * 4)
      const rotation = (Math.random() * 12 - 6).toFixed(1)
      const uid      = ++uidRef.current

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
    <div className="relative w-full h-full" style={{ minHeight: minH }}>
      {items.map(item => (
        <div
          key={item.uid}
          className="absolute pointer-events-none select-none overflow-hidden"
          style={{
            top:       `${item.top}%`,
            left:      `${item.left}%`,
            width:     `${imgW}px`,
            height:    `${imgH}px`,
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
    </div>
  )
}

export default function HumansSection() {
  return (
    <>
    <section className="mt-[100px] px-[30px] flex flex-col md:flex-row gap-8">

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

        <p className="text-[var(--color-muted)] text-[18px] md:text-[23px] mt-8">[ AUTHENTIC INTELLIGENCE ]</p>

        <div className="mt-8">
          <p className="text-[15px] md:text-[23px] w-full md:w-[404px] leading-normal whitespace-pre-wrap">
            <CharsTwo text="OUR ETHOS ARE SIMPLE: WE BUILD " />
            <CharsTwo text="WEB   EXPERIENCES  WITH  PEOPLE" />
            <CharsTwo text=" AT  THE CORE OF EVERYTHING  WE " />
            <CharsTwo text="DESIGN                AND                BUILD " />
            <CharsTwo text="YOUR END  USER IS WHO  WE HAVE " />
            <CharsTwo text="IN      MIND      AT      EVERY      TURN" />
          </p>
        </div>

        <p className="text-[15px] md:text-[23px] mt-8 md:mt-12 w-full md:w-[404px] text-[var(--color-muted)] leading-normal whitespace-pre-wrap">
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

      {/* ── RIGHT: random person spawn cloud — desktop only ── */}
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <PeopleCloud imgW={200} imgH={260} maxTop={55} maxLeft={62} minH="500px" />
      </div>

    </section>

    {/* ── Mobile people cloud — shown between Humans and Projects ── */}
    <div className="md:hidden relative h-[280px] overflow-hidden mt-8">
      <PeopleCloud imgW={80} imgH={110} maxTop={50} maxLeft={72} minH="280px" />
    </div>
    </>
  )
}
