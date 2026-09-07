'use client'

import { useState, useEffect } from 'react'
import ThemeToggle from '../components/ThemeToggle'
import NavMenu from '../components/NavMenu'
import StartProjectButton from '../components/StartProjectButton'
import StartProjectModal from '../components/StartProjectModal'
import Footer from '../components/Footer'
import SpotlightText from '../components/SpotlightText'

// ── PROCESS STEPS — edit these titles/descriptions as needed ─────────────────
const STEPS = [
  { num: '01', title: 'IDENTIFY YOUR UNIQUE NEEDS', description: 'FIRST STEP IS TO EMPATHIZE WITH YOU, YOUR BUSINESS AND ITS TARGET AUDIENCE. EVERY PROJECT IS APPROACHED WITH A FRESH PERSPECTIVE AND FROM THE SAME POINT ZERO START.' },
  { num: '02', title: 'RESEARCH',                    description: 'USING INDUSTRY BEST PRACTICES WE ALWAYS GO THROUGH A FULL FLEDGE UX RESEARCH PHASE. EVERYTHING FROM USER INTERVIEWS, USER PERSONAS, DIAGRAMMING FLOWS AND GETTING TO FIRST SKETCHES. WE DONT SKIP THIS CRUCICAL STEP WHEN MOST DO.' },
  { num: '03', title: 'WIREFRAMING',                 description: 'BEFORE WE WORRY ABOUT PIXELS, COLOR, RHYTHM AND SPACE; WE NEED TO MAKE SURE THAT WE START OFF ON THE RIGHT PATH. LOW FIDELITY WIREFRAMING GIVES US THE OPPORTUNITY TO LAY THE FOUNDATION AND ITERATE QUICKLY WHEN MISTAKES ARE LESS COSTLY.' },
  { num: '04', title: 'USABILITY TESTING',           description: 'THIS STEP ALLOWS US TO CATCH ISSUES EARLY AND OFTEN BEFORE THEY BECOME HEADACHES FOR YOUR AUDIENCE. THIS CAN BE APPLIED TO BOTH WEBSITES AND MORE SPECIFICALLY WEB AND MOBILE APPLICATIONS.' },
  { num: '05', title: 'HIGH FIDELITY DESIGN',        description: 'WHAT MOST CLIENTS ARE FAMILIAR WITH IS SEEING THE FINAL PIXELS IN THEIR FINISHED STATE. ALL THE FOUNDATIONAL WORK BEFORE THIS LEAD US TO BE ABLE TO USE OUR DESIGN LANGUAGE AND WHAT WE LEARNED IN RESEARCH TO DELIVER A POLISHED SITE OR UI.' },
  { num: '06', title: 'PROTOTYPING',                 description: 'WE DELIVER A WORKING PROTOTYPE TO GIVE YOU A FIRST LOOK AT WHAT THE FINISHED PRODUCT WILL LOOK AND FUNCTION RIGHT. THIS IS THE DEMO AND YOU CAN TAKE IT FOR A TESTDRIVE BEFORE YOU BUILD THE CAR.' },
  { num: '07', title: 'DEVELOPMENT',                 description: 'THE BREAD AND BUTTER, MAKING THE RIGHT DECISIONS HERE MEANS THAT YOUR WEBSITE LOADS QUICKLY IS ACCESSIBLE AND GRACEFULLY HANDLES UNFORSEEN CIRCUMSTANCES. WHAT MAKES US DIFFERENT IS THAT WE CAN CONSIDER ALL OF THIS WITH A VERY TIGHT FEEDBACK LOOP AND TURNAROUND TIME.' },
  { num: '08', title: 'QUALITY ASSURANCE',           description: 'RATHER THAN RELY ON YOUR USERS TO FIND AND EXPERIENCE ISSUES WITH YOUR WEBSITE OR WEB APP, WE WILL WORK TO ASSESS THE UTLITY AND POLISH OF EVERY PRODUCT WE BUILD. MISTAKES ARE MADE, WE ARE HUMAN BUT WE DO OUR BEST TO CATCH THEM BEFORE THEY GET TO YOUR PEOPLE.' },
  { num: '09', title: 'MEASURE',                     description: 'WETHER IT IS SETTING UP ANALYTICS, MONITORING SEO OR SIMPLY RUNNING AUDITS ON THE SITE NOT HAVING DOWNTIME, WE DO NOT STOP AT A LIVE WEBSITE OR APP. WHAT YOU NEED GOING FORWARD IS TO MEASURE TO DETERMINE SUCCESS BACKED BY DATA.' },
]

// ── Row — expands on hover, matches the /work page accordion behavior ────────
function StepRow({ step, isActive, isAnyActive, onEnter }) {
  return (
    <div
      onMouseEnter={onEnter}
      className="relative border-t border-[var(--color-fg)]/15 last:border-b last:border-[var(--color-fg)]/15 px-[30px] md:px-[45px] cursor-pointer"
      style={{
        opacity:    isAnyActive && !isActive ? 0.25 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Top row — number + title, matches the menu link layout */}
      <div className="flex items-baseline gap-4 py-7 md:py-9">
        <span className="text-[var(--color-muted)] text-[13px] tracking-widest shrink-0 mb-1">
          [ {step.num} ]
        </span>
        <span
          className="text-[var(--color-fg)] font-medium leading-none"
          style={{ fontSize: 'clamp(40px, 6.8vw, 108px)' }}
        >
          {step.title}
        </span>
      </div>

      {/* Description — reveals when active */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out"
        style={{
          maxHeight: isActive ? '240px' : '0px',
          opacity:   isActive ? 1 : 0,
        }}
      >
        <SpotlightText
          text={step.description}
          className="text-[var(--color-muted)] text-[16px] md:text-[18px] max-w-[640px] leading-[26px] md:leading-[30px] pb-10"
        />
      </div>
    </div>
  )
}

// ── Mobile row — all content expanded by default, no hover ───────────────────
function MobileStepRow({ step }) {
  return (
    <div className="border-t border-[var(--color-fg)]/15 last:border-b last:border-[var(--color-fg)]/15 px-[20px] py-8">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-[var(--color-muted)] text-[12px] tracking-widest shrink-0">
          [ {step.num} ]
        </span>
        <span
          className="text-[var(--color-fg)] font-medium leading-none"
          style={{ fontSize: 'clamp(28px, 7vw, 44px)' }}
        >
          {step.title}
        </span>
      </div>
      <p className="text-[var(--color-muted)] text-[15px] leading-[24px]">
        {step.description}
      </p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProcessPage() {
  const [activeIdx, setActiveIdx] = useState(null)
  const [isMobile,  setIsMobile]  = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

      {/* ── PROCESS title ── */}
      <section className="pt-[160px] pb-[60px] px-[30px] md:px-[45px]">
        <p
          className="text-[var(--color-fg)] font-medium leading-none"
          style={{ fontSize: 'clamp(80px, 14vw, 220px)' }}
        >
          PROCESS
        </p>
      </section>

      {/* ── Step list ── */}
      {isMobile ? (
        <section>
          {STEPS.map(step => (
            <MobileStepRow key={step.num} step={step} />
          ))}
        </section>
      ) : (
        // Desktop: hover-based rows. onMouseLeave on the wrapping section
        // clears active state so we never flicker between row swaps.
        <section onMouseLeave={() => setActiveIdx(null)}>
          {STEPS.map((step, i) => (
            <StepRow
              key={step.num}
              step={step}
              isActive={activeIdx === i}
              isAnyActive={activeIdx !== null}
              onEnter={() => setActiveIdx(i)}
            />
          ))}
        </section>
      )}

      <Footer />
      <StartProjectModal />
    </main>
  )
}
