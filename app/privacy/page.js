'use client'

import ThemeToggle from '../components/ThemeToggle'
import NavMenu from '../components/NavMenu'
import StartProjectButton from '../components/StartProjectButton'
import StartProjectModal from '../components/StartProjectModal'
import Footer from '../components/Footer'

export default function PrivacyPage() {
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

      <section className="pt-[160px] pb-[100px] px-[30px] md:px-[45px]">
        <h1>Privacy Notice</h1>
        <p>
          This Privacy Notice describes how Monom Studio ("we", "us", or "our") collects, uses, and
          discloses information when you visit our website. We use Microsoft Clarity, a website
          analytics tool, to help us understand how visitors interact with our site, including page
          views, clicks, scrolling behavior, and session recordings. Microsoft Clarity may set cookies
          and collect data such as your IP address, device and browser information, and interactions
          with the site. This information is used solely to improve the functionality, usability, and
          content of our website. We do not sell your personal information to third parties. You may
          choose to accept or deny non-essential analytics cookies through the cookie consent banner
          presented when you first visit our site. Declining these cookies will prevent Microsoft
          Clarity from collecting data about your visit, though some essential cookies required for
          basic site functionality may still be used. For more information about how Microsoft
          Clarity processes data, please refer to Microsoft's own privacy documentation. If you have
          any questions about this Privacy Notice or how your information is handled, please contact
          us at m@monomstud.io. This is placeholder language and should be reviewed and finalized
          before relying on it as a legally binding privacy policy.
        </p>
      </section>

      <Footer />
      <StartProjectModal />
    </main>
  )
}
