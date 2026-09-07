'use client'

import { useRef, useEffect } from 'react'
import { useLenis } from 'lenis/react'

export default function WallRevealImage({
  videoSrc,
  imageSrc = '/images/mattWall.jpg',
  caption = (
    <>
      <p
        className="text-white font-medium leading-none"
        style={{ fontSize: 'clamp(52px, 8vw, 120px)' }}
      >
        Matt
      </p>
      <p
        className="text-white font-medium leading-none mt-2"
        style={{ fontSize: 'clamp(32px, 4.94vw, 74px)' }}
      >
        -Founder
      </p>
    </>
  ),
}) {
  const isVideo     = !!videoSrc
  const sectionRef  = useRef(null)
  const wrapperRef  = useRef(null)   // scale transform
  const imgRef      = useRef(null)   // clip-path
  const clipRef     = useRef(null)   // { axis: 'y' | 'x', pct: number }
  const readyRef    = useRef(false)

  function applyClip(pct) {
    const img = imgRef.current
    const c   = clipRef.current
    if (!img || !c) return
    const v = Math.max(0, pct).toFixed(3)
    img.style.clipPath = c.axis === 'y'
      ? `inset(${v}% 0 ${v}% 0)`   // crop top + bottom for portrait media
      : `inset(0 ${v}% 0 ${v}%)`   // crop left + right for landscape media
  }

  // Compute the % to clip on each side so the visible crop is a square.
  function applyRatio(w, h) {
    if (!w) return
    if (h >= w) {
      // portrait or square — clip top + bottom
      clipRef.current = { axis: 'y', pct: ((h - w) / (2 * h)) * 100 }
    } else {
      // landscape — clip left + right
      clipRef.current = { axis: 'x', pct: ((w - h) / (2 * w)) * 100 }
    }
    readyRef.current = true
    applyClip(clipRef.current.pct)  // set the initial square crop immediately
  }

  // Cached images don't fire onLoad — handle that here
  useEffect(() => {
    const el = imgRef.current
    if (!el) return
    if (isVideo) {
      if (el.readyState >= 1) applyRatio(el.videoWidth, el.videoHeight)
    } else if (el.complete && el.naturalWidth > 0) {
      applyRatio(el.naturalWidth, el.naturalHeight)
    }
  }, [isVideo])

  useLenis(() => {
    const section = sectionRef.current
    const wrapper = wrapperRef.current
    if (!section || !wrapper || !readyRef.current) return

    const rect = section.getBoundingClientRect()
    const vh   = window.innerHeight

    // 0 when section bottom touches viewport bottom; 1 when section top reaches top
    const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.85)))

    // Clip eases from square crop → no crop
    applyClip(clipRef.current.pct * (1 - progress))

    // Scale eases from 1.15 → 1.0 (more dramatic)
    const scale = 1.15 - 0.15 * progress
    wrapper.style.transform = `scale(${scale.toFixed(4)})`
  })

  return (
    <section ref={sectionRef} className="w-full overflow-hidden">
      <div
        ref={wrapperRef}
        className="relative w-full"
        style={{ transformOrigin: 'center top', willChange: 'transform', transform: 'scale(1.15)' }}
      >
        {isVideo ? (
          <video
            ref={imgRef}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => applyRatio(e.target.videoWidth, e.target.videoHeight)}
            className="w-full block"
            style={{ willChange: 'clip-path' }}
          />
        ) : (
          <img
            ref={imgRef}
            src={imageSrc}
            alt=""
            onLoad={(e) => applyRatio(e.target.naturalWidth, e.target.naturalHeight)}
            className="w-full block"
            style={{ willChange: 'clip-path' }}
          />
        )}

        {caption && (
          <div className="absolute bottom-[40px] left-[45px] z-10">
            {caption}
          </div>
        )}
      </div>
    </section>
  )
}
