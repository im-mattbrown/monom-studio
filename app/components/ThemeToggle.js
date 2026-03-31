'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'light'
    setIsLight(saved)
    applyTheme(saved)
  }, [])

  function applyTheme(light) {
    const root = document.documentElement
    // Class toggle (primary driver)
    root.classList.toggle('light-theme', light)
    // Direct body style (bulletproof fallback)
    document.body.style.backgroundColor = light ? '#d9d9d9' : '#0e0e0e'
    document.body.style.color = light ? '#0e0e0e' : '#d9d9d9'
  }

  const toggle = () => {
    const next = !isLight
    setIsLight(next)
    applyTheme(next)
    localStorage.setItem('theme', next ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggle}
      className="text-[16px] font-normal tracking-wide hover:opacity-60 transition-opacity"
    >
      [ {isLight ? 'LIGHT' : 'DARK'} ]
    </button>
  )
}
