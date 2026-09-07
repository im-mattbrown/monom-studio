'use client'

import ThemeToggle from '../components/ThemeToggle'
import NavMenu from '../components/NavMenu'
import StartProjectButton from '../components/StartProjectButton'
import StartProjectModal from '../components/StartProjectModal'
import Footer from '../components/Footer'
import ProjectForm from '../components/ProjectForm'

export default function ContactPage() {
  return (
    <main className="bg-[var(--color-bg)] min-h-screen text-[var(--color-fg)] font-medium overflow-x-hidden">

      {/* ── NAV (same fixed pattern as the other pages) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-[30px] pt-[30px]">
        <a href="/">
          <img src="/images/logos/monomLogoWhite.svg" alt="Monom Studio" className="h-[42px] w-auto theme-invert" />
        </a>
        <span className="hidden md:block"><ThemeToggle /></span>
        <NavMenu />
        <StartProjectButton className="hidden md:flex items-center gap-1 border border-[var(--color-fg)] rounded-[10px] py-[7.5px] px-3 text-[16px] font-normal hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors">
          START A PROJECT
          <span className="inline-flex items-center justify-center p-[5px]">
            <img src="/images/arrowUpRight.svg" alt="" className="w-[9.5px] h-[9.5px] theme-invert" />
          </span>
        </StartProjectButton>
      </nav>

      {/* ── CONTACT title — placeholder page, content coming later ── */}
      <section className="pt-[160px] pb-[60px] px-[30px] md:px-[45px]">
        <p
          className="text-[var(--color-fg)] font-medium leading-none"
          style={{ fontSize: 'clamp(80px, 14vw, 220px)' }}
        >
          CONTACT
        </p>
        <p className="text-[var(--color-muted)] text-[18px] mt-8 max-w-[480px]">
          REACH OUT TO OUR TEAM AND WE WILL FOLLOW UP WITHIN 24HRS OFTEN FASTER. KNOW THAT YOU'LL TALK TO A HUMAN.
        </p>
      </section>

      {/* ── Start a project form — same wizard as the modal, embedded inline ── */}
      <section className="flex justify-center px-[20px] pb-[100px]">
        <div className="w-full max-w-[600px] bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-[20px] p-10 md:p-[52px]">
          <ProjectForm />
        </div>
      </section>

      <Footer />
      <StartProjectModal />
    </main>
  )
}
