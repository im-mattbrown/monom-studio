'use client'

export default function StartProjectButton({ className, children }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-project-modal'))}
      className={className}
    >
      {children}
    </button>
  )
}
