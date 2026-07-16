'use client'

import { useState, useEffect } from 'react'

const BUDGET_OPTIONS = [
  'UNDER $5K',
  '$5K – $10K',
  '$10K – $25K',
  '$25K – $50K',
  '$50K+',
  'NOT SURE YET',
]

export default function StartProjectModal() {
  const [isOpen,     setIsOpen]     = useState(false)
  const [step,       setStep]       = useState(1)
  const [submitted,  setSubmitted]  = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form,       setForm]       = useState({ name: '', project: '', budget: '', email: '' })

  // Any button on the page can trigger this via a CustomEvent
  useEffect(() => {
    const open = () => {
      setIsOpen(true)
      setStep(1)
      setSubmitted(false)
      setForm({ name: '', project: '', budget: '', email: '' })
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

  function canProceed() {
    if (step === 1) return form.name.trim().length > 0
    if (step === 2) return form.project.trim().length > 0
    if (step === 3) return form.budget.length > 0
    if (step === 4) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    return false
  }

  async function handleSubmit() {
    if (!canProceed() || submitting) return
    setSubmitting(true)
    try {
      await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'd43315d9-2496-40cd-92f8-a52c82eb47f2',
          name:    form.name,
          email:   form.email,
          message: [
            `Name: ${form.name}`,
            `Project / Company: ${form.project}`,
            `Budget: ${form.budget}`,
            `Email: ${form.email}`,
          ].join('\n\n'),
        }),
      })
    } catch (_) {}
    setSubmitting(false)
    setSubmitted(true)
  }

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

        {/* ── Thank you screen ── */}
        {submitted ? (
          <div>
            <p className="text-[var(--color-muted)] text-[13px] tracking-widest mb-8">[ SUBMITTED ]</p>
            <p
              className="text-[var(--color-fg)] font-medium leading-tight"
              style={{ fontSize: 'clamp(26px, 3.8vw, 46px)' }}
            >
              THANK YOU FOR<br />
              SHARING THAT<br />
              INFORMATION,<br />
              A MEMBER OF OUR<br />
              TEAM WILL REPLY<br />
              TO YOU AS SOON<br />
              AS THEY ARE ABLE
            </p>
            <button
              onClick={close}
              className="mt-10 border border-[var(--color-fg)] rounded-[10px] py-[10px] px-6 text-[var(--color-fg)] text-[15px] font-normal hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors"
            >
              CLOSE
            </button>
          </div>
        ) : (

          /* ── Wizard ── */
          <>
            {/* Progress */}
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[var(--color-muted)] text-[13px] tracking-widest shrink-0">
                [ 0{step} / 04 ]
              </span>
              <div className="flex-1 h-px bg-[var(--color-card-border)] relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--color-fg)] transition-all duration-500"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Step — keyed so it re-mounts and triggers the slide-in animation */}
            <div key={step} className="animate-step-in">

              {step === 1 && (
                <>
                  <h2
                    className="text-[var(--color-fg)] font-medium leading-tight mb-8"
                    style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
                  >
                    WHAT IS YOUR<br />NAME?
                  </h2>
                  <input
                    autoFocus
                    type="text"
                    placeholder="YOUR NAME"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter' && canProceed()) setStep(2) }}
                    className="w-full bg-transparent border-b border-[var(--color-card-border)] focus:border-[var(--color-fg)] outline-none text-[var(--color-fg)] text-[20px] pb-3 placeholder:text-[var(--color-muted)] transition-colors"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <h2
                    className="text-[var(--color-fg)] font-medium leading-tight mb-8"
                    style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
                  >
                    DESCRIBE YOUR<br />PROJECT OR<br />COMPANY
                  </h2>
                  <textarea
                    autoFocus
                    placeholder="TELL US ABOUT IT"
                    value={form.project}
                    onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
                    rows={4}
                    className="w-full bg-transparent border-b border-[var(--color-card-border)] focus:border-[var(--color-fg)] outline-none text-[var(--color-fg)] text-[18px] pb-3 placeholder:text-[var(--color-muted)] resize-none transition-colors"
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <h2
                    className="text-[var(--color-fg)] font-medium leading-tight mb-8"
                    style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
                  >
                    DO YOU HAVE A<br />BUDGET IN MIND?
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {BUDGET_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setForm(f => ({ ...f, budget: opt }))}
                        className={`border rounded-[8px] px-4 py-[9px] text-[13px] tracking-wide transition-colors ${
                          form.budget === opt
                            ? 'bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)]'
                            : 'border-[var(--color-card-border)] text-[var(--color-muted)] hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2
                    className="text-[var(--color-fg)] font-medium leading-tight mb-8"
                    style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
                  >
                    SHARE YOUR<br />EMAIL AND THIS<br />WILL BE SENT<br />TO OUR TEAM
                  </h2>
                  <input
                    autoFocus
                    type="email"
                    placeholder="YOUR EMAIL"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter' && canProceed()) handleSubmit() }}
                    className="w-full bg-transparent border-b border-[var(--color-card-border)] focus:border-[var(--color-fg)] outline-none text-[var(--color-fg)] text-[20px] pb-3 placeholder:text-[var(--color-muted)] transition-colors"
                  />
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12">
              {step > 1 ? (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="text-[var(--color-muted)] text-[15px] hover:text-[var(--color-fg)] transition-colors"
                >
                  ← BACK
                </button>
              ) : <span />}

              {step < 4 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="border border-[var(--color-fg)] rounded-[10px] py-[10px] px-6 text-[var(--color-fg)] text-[15px] font-normal hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  NEXT →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || submitting}
                  className="border border-[var(--color-fg)] rounded-[10px] py-[10px] px-6 text-[var(--color-fg)] text-[15px] font-normal hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {submitting ? 'SENDING...' : 'SUBMIT →'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
