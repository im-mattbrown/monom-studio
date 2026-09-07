'use client'

import { useState, useEffect } from 'react'
import ProjectForm from './ProjectForm'

export default function StartProjectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [key,    setKey]    = useState(0)

  // Any button on the page can trigger this via a CustomEvent
  useEffect(() => {
    const open = () => {
      setIsOpen(true)
      setKey(k => k + 1) // re-mount ProjectForm so it starts fresh each open
    }
    window.addEventListener('open-project-modal', open)
    return () => window.removeEventListener('open-project-modal', open)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  function close() { setIsOpen(false) }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 backdrop-blur-sm px-5"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="relative w-full max-w-[600px] bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-[20px] p-10 md:p-[52px] animate-modal-in">

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-5 right-5 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors text-[20px] leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        <ProjectForm key={key} onClose={close} />
      </div>
    </div>
  )
}
