'use client'

import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="text-[16px] font-normal tracking-wide"
        aria-label="Toggle menu"
      >
        [ {open ? 'CLOSE' : 'MENU'} ]
      </button>

      {/* Full-screen overlay */}
      {open && (
        <div className="fixed inset-0 z-[998] bg-[var(--color-bg)] flex flex-col px-[30px] pt-[30px] animate-menu-in">

          {/* Top row — logo + close */}
          <div className="flex items-center justify-between">
            <img
              src="/images/logos/monomLogoWhite.svg"
              alt="Monom Studio"
              className="h-[42px] w-auto theme-invert"
            />
            <button
              onClick={() => setOpen(false)}
              className="text-[16px] font-normal tracking-wide"
            >
              [ CLOSE ]
            </button>
          </div>

          {/* Menu items */}
          <div className="flex flex-col gap-10 mt-16">

            {/* Theme toggle row */}
            <div className="flex items-center justify-between border-b border-[var(--color-card-border)] pb-8">
              <span className="text-[var(--color-muted)] text-[16px] tracking-wide">THEME</span>
              <ThemeToggle />
            </div>

            {/* Start a project */}
            <div className="flex items-center justify-between border-b border-[var(--color-card-border)] pb-8">
              <span className="text-[var(--color-muted)] text-[16px] tracking-wide">READY TO BUILD?</span>
              <a
                href="mailto:m@monomstud.io"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 border border-[var(--color-fg)] rounded-[10px] py-[8px] px-4 text-[15px] font-normal hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors"
              >
                START A PROJECT
                <span className="inline-flex items-center justify-center p-[4px]">
                  <img
                    src="/images/arrowUpRight.svg"
                    alt=""
                    className="w-[9px] h-[9px] theme-invert"
                  />
                </span>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
