function Chars({ text, className }) {
  return text.split("").map((char, i) => (
    <span key={i} className={className}>{char}</span>
  ));
}
function CharsTwo({ text, className }) {
  return text.split("").map((char, i) => (
    <span key={i} className={className}>{char}</span>
  ));
}
function CharsThree({ text, className }) {
  return text.split("").map((char, i) => (
    <span key={i} className={className}>{char}</span>
  ));
}

import MonomTitle from './components/MonomTitle';
import ServicesSection from './components/ServicesSection';
import HumansSection from './components/HumansSection';
import ProjectsSection from './components/ProjectsSection';
import DeviceScrollSection from './components/DeviceScrollSection';
import ThemeToggle from './components/ThemeToggle';
import MobileMenu from './components/MobileMenu';
import Footer from './components/Footer';

const imgLogo        = "/images/logos/monomLogoWhite.svg";
const imgArrowUpRight = "/images/arrowUpRight.svg";
const imgArrowDown   = "/images/arrowDown.svg";
const imgHero        = "/images/video_Section.jpg";

export default function Home() {
  return (
    <main className="bg-[var(--color-bg)] min-h-screen text-[var(--color-fg)] font-medium overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-[30px] pt-[30px]">
        <img src={imgLogo} alt="Monom Studio" className="h-[42px] w-auto theme-invert" />

        {/* Desktop items — hidden on mobile */}
        <span className="hidden md:block"><ThemeToggle /></span>
        <span className="hidden md:block text-[16px] font-normal tracking-wide">[ MENU ]</span>
        <button className="hidden md:flex items-center gap-1 border border-[var(--color-fg)] rounded-[10px] py-[7.5px] px-3 text-[16px] font-normal hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors">
          START A PROJECT
          <span className="inline-flex items-center justify-center p-[5px]">
            <img src={imgArrowUpRight} alt="" className="w-[9.5px] h-[9.5px] theme-invert" />
          </span>
        </button>

        {/* Mobile menu — hidden on desktop */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </nav>

      {/* ── HERO TEXT ── */}
      <section className="relative px-[30px] mt-[70px]">
        <p className="text-[23px] w-[355px] leading-normal whitespace-pre-wrap">
          <Chars text={"                MONOM STUDIO: A "} />
          <Chars text="MODERN" className="underline" />
          <Chars text={" AGENCY     BUILT FOR EMERGING               COMPANIES DESIGNEDTO  HELP "} />
          <Chars text="FOUNDERS" className="underline" />
          <Chars text={" AND  SMALL "} />
          <Chars text="BUSINESSES" className="underline" />
        </p>
        <img src="/images/shape1.svg" alt="" className="absolute bottom-[75px] left-[185px] theme-invert" />
      </section>

      <div className="flex items-center justify-between px-[30px] mt-8 mb-[300px]">
        <p className="text-[var(--color-muted)] text-[17px]">BUILT WITH VIBES</p>
      </div>

      {/* ── LARGE MONOM TEXT ── */}
      <div className="relative mt-8">
        <div className="flex items-center justify-between px-[45px] mt-[60px] mb-[50px] relative z-10">
          <p className="text-[var(--color-muted)] text-[23px]">[ SCROLL TO DISCOVER ]</p>
          <div className="hidden md:flex items-center gap-2 border-b border-[var(--color-fg)] pb-0.5">
            <p className="text-[var(--color-fg)] text-[23px]">JUMP TO PROJECTS</p>
            <img src={imgArrowDown} alt="" className="w-5 h-5 theme-invert" />
          </div>
        </div>
        <MonomTitle />
      </div>

      {/* ── SELECTED WORKS HEADER ── */}
      <div className="flex items-center justify-between px-[45px] mt-8">
        <p className="text-[var(--color-muted)] text-[23px]">SELECTED WORKS</p>
        <p className="text-[var(--color-muted)] text-[23px]">OUR MOST LOVED PROJECTS</p>
      </div>

      {/* ── VIDEO / IMAGE SECTION ── */}
      <section className="mx-[30px] mt-4 h-auto overflow-hidden relative">
        <video
          src="https://res.cloudinary.com/dzghwkkzb/video/upload/v1774986218/monomVideoSection_1_nmb89n.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="relative inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(14,14,14,0.7) 0px, rgba(14,14,14,0) 0px, rgba(14,14,14,0) calc(100% - 80px), rgba(14,14,14,0.1) 100%)',
          }}
        />
      </section>

      {/* ── SERVICES SECTION ── */}
      <ServicesSection />

      {/* ── BUILT BY HUMANS SECTION ── */}
      <HumansSection />

      {/* ── PROJECTS SECTION ── */}
      <ProjectsSection />

      {/* ── RESPONSIVE BY DEFAULT ── */}
      <section className="relative mt-[100px] px-[30px] md:px-[160px] pb-[100px]">
        <p className="text-[var(--color-muted)] text-[23px]">[ RESPONSIVE BY DEFAULT ]</p>

        {/* shape2 — absolutely positioned, adjust top/left/right/bottom to taste */}
        <img
          src="/images/shape2.svg"
          alt=""
          className="absolute theme-invert md:hidden"
          style={{ top: '70px', left: '140px', width: '30px', height: 'auto' }}
        />
        <img
          src="/images/shape2.svg"
          alt=""
          className="absolute theme-invert hidden md:block"
          style={{ top: '78px', left: '386px', width: '60px', height: 'auto' }}
        />

        <h2
          className="font-medium text-[var(--color-fg)] leading-tight whitespace-pre mt-8"
          style={{ fontSize: 'clamp(32px, 4.5vw, 65px)' }}
        >
          {`EVERY      DEVICE`}
          <br />
          CONSIDERED WITH CARE
        </h2>
      </section>

      <DeviceScrollSection />

      {/* ── CONTACT SECTION ── */}
      <section className="mt-[140px] px-[45px]">
        <p className="text-[var(--color-muted)] text-[23px]">[ GET IN TOUCH ]</p>

        <h2
          className="font-medium text-[var(--color-fg)] leading-none mt-6"
          style={{ fontSize: 'clamp(56px, 9.5vw, 136px)' }}
        >
          LET'S BUILD
          <br />
          SOMETHING
          <br />
          GREAT
        </h2>

        <div className="mt-14 flex flex-col md:flex-row md:items-center justify-between border-t border-[var(--color-card-border)] pt-8 gap-6 md:gap-0">
          <p className="text-[var(--color-muted)] text-[23px] tracking-wide">
            m@monomstud.io
          </p>
          <a
            href="mailto:m@monomstud.io"
            className="self-start flex items-center gap-2 border border-[var(--color-fg)] rounded-[10px] py-[10px] px-5 text-[16px] font-normal hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors"
          >
            START A PROJECT
            <img src="/images/arrowUpRight.svg" alt="" className="w-[10px] h-[10px] theme-invert" />
          </a>
        </div>
      </section>

      <Footer />

    </main>
  );
}
