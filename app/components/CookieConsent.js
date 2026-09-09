'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

const STORAGE_KEY = 'monom-cookie-consent' // 'accepted' | 'declined'

export default function CookieConsent() {
  // null while we haven't checked localStorage yet — avoids flashing the
  // banner for returning visitors who already decided.
  const [consent, setConsent] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'accepted' || saved === 'declined') setConsent(saved)
    else setConsent('unset')
  }, [])

  function choose(value) {
    localStorage.setItem(STORAGE_KEY, value)
    setConsent(value)
  }

  return (
    <>
      {consent === 'accepted' && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "yfbtizrexb");`}
        </Script>
      )}

      {consent === 'unset' && (
        <div className="fixed bottom-0 left-0 right-0 z-[2000] px-[20px] pb-[20px] flex justify-center">
          <div className="w-full max-w-[720px] bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-[14px] p-5 md:p-6 flex items-center gap-5 shadow-2xl">
            <video
              src="https://matte-cdn.b-cdn.net/cookieMonstr.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="hidden md:block w-[128px] h-[128px] object-contain shrink-0"
            />

            <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 min-w-0">
              <p className="text-[var(--color-muted)] text-[14px] leading-[22px] flex-1">
                WE USE COOKIES TO UNDERSTAND HOW VISITORS USE OUR SITE (VIA MICROSOFT CLARITY) SO WE CAN IMPROVE IT. YOU CAN ACCEPT OR DENY THESE COOKIES.{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-fg)] transition-colors">
                  LEARN MORE
                </a>
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => choose('declined')}
                  className="text-[var(--color-muted)] text-[14px] hover:text-[var(--color-fg)] transition-colors px-2 whitespace-nowrap"
                >
                  DENY
                </button>
                <button
                  onClick={() => choose('accepted')}
                  className="border border-[var(--color-fg)] rounded-[10px] py-[9px] px-5 text-[var(--color-fg)] text-[14px] font-normal hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors whitespace-nowrap"
                >
                  ACCEPT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
