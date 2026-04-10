"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/website/RevealOnScroll";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { EASE_ENTRANCE } from "@/lib/design-tokens";
import { ArrowUpRight, ChevronDown } from "lucide-react";

// ─── Animated Counter ─────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [display, setDisplay] = useState(prefix + "0" + suffix);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const abs = Math.abs(target);
    const isNeg = target < 0;
    const duration = 1500;
    const start = performance.now();
    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * abs;
      const formatted = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("nb-NO");
      setDisplay(prefix + (isNeg ? "-" : "") + formatted + suffix);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [inView, target, suffix, prefix, decimals]);

  return <span ref={ref}>{display}</span>;
}

// ─── Bento Card with mouse-follow glow ────────────────────
function BentoCard({
  href,
  className,
  tag,
  title,
  description,
  imageSrc,
  children,
}: {
  href: string;
  className: string;
  tag: string;
  title: string;
  description?: string;
  imageSrc?: string;
  children?: React.ReactNode;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <motion.a
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-[20px] p-7 flex flex-col justify-end overflow-hidden transition-all duration-500 ${className}`}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02)",
      }}
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-700"
        />
      )}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mouseX.get() * 100}% ${mouseY.get() * 100}%, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110 transition-all duration-400">
        <ArrowUpRight className="w-4 h-4" />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-bold tracking-[0.08em] uppercase opacity-50 mb-2">{tag}</p>
        <h3 className="text-[22px] font-bold tracking-tight group-hover:translate-x-1 transition-transform duration-400">{title}</h3>
        {description && <p className="text-[13px] opacity-60 mt-1 leading-relaxed">{description}</p>}
      </div>
      {children}
    </motion.a>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 800], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  // springY brukes for fremtidig vertikal parallax pa hero
  useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 12);
    }
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <PageTransition>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-grey-900)] focus:text-white focus:rounded-lg"
      >
        Hopp til innhold
      </a>

      <WebsiteNav />

      <main id="main-content">
        {/* ═══════════════════════════════════════════════════ */}
        {/* HERO — Fullskjerm, levende bilde                   */}
        {/* ═══════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Levende bilde med parallax */}
          <motion.div
            className="absolute inset-[-40px]"
            style={{
              y: heroImageY,
              x: springX,
              scale: 1.05,
            }}
          >
            <Image
              src="/images/academy/AK-Golf-Academy-20.jpg"
              alt="Golf coaching pa Fredrikstad Golfklubb"
              fill
              priority
              className="object-cover object-center animate-[heroZoom_20s_ease-in-out_infinite_alternate]"
            />
          </motion.div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F18]/30 via-[#0A1F18]/15 via-[60%] to-[#0A1F18]/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,#0A1F18/40_100%)]" />

          {/* Content */}
          <motion.div
            className="relative z-10 text-center max-w-[720px] px-6"
            style={{ opacity: heroOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: EASE_ENTRANCE }}
              className="inline-flex items-center gap-2 px-5 py-1.5 bg-white/[0.08] border border-white/10 rounded-full backdrop-blur-sm mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D1F843] animate-pulse" />
              <span className="text-xs text-white/70">142 aktive spillere i Fredrikstad</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: EASE_ENTRANCE }}
              className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-[-0.04em] leading-[1.0] mb-5"
            >
              Bli en bedre golfer
              <br />
              <span className="text-[#D1F843]">— med system</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: EASE_ENTRANCE }}
              className="text-lg text-white/60 leading-relaxed mb-10 max-w-[520px] mx-auto"
            >
              Personlig coaching med TrackMan-analyse, strukturerte treningsplaner
              og AI-drevet innsikt. For alle nivaer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, ease: EASE_ENTRANCE }}
              className="flex gap-3 justify-center"
            >
              <Link
                href="/booking"
                className="px-8 py-4 bg-[#D1F843] text-[#0A1F18] rounded-full text-base font-bold hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(209,248,67,0.3)] transition-all duration-400"
              >
                Book din forste okt
              </Link>
              <Link
                href="#priser"
                className="px-8 py-4 bg-white/[0.06] border border-white/15 text-white rounded-full text-base font-medium backdrop-blur-sm hover:bg-white/[0.12] hover:-translate-y-0.5 transition-all duration-300"
              >
                Se priser
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          >
            <span className="text-[11px] tracking-[0.12em] uppercase text-white/30">Scroll</span>
            <ChevronDown className="w-4 h-4 text-white/30 animate-bounce" />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TRUST BAR — Animerte talltellere                   */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="flex items-center justify-center gap-16 md:gap-20 py-14 px-6 border-b border-[var(--color-grey-100)]">
          {[
            { target: 142, label: "Aktive spillere" },
            { target: 4.8, suffix: "★", decimals: 1, label: "Snitt vurdering" },
            { target: -3.2, decimals: 1, label: "Snitt HCP-forbedring" },
            { target: 2000, suffix: "+", label: "Coaching-okter" },
          ].map((stat) => (
            <RevealOnScroll key={stat.label}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-[var(--color-grey-900)] tracking-tight tabular-nums">
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-1">{stat.label}</p>
              </div>
            </RevealOnScroll>
          ))}
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* BENTO GRID — Tjenester med bilder                  */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="max-w-[1200px] mx-auto px-6 lg:px-12 py-24 md:py-32">
          <RevealOnScroll>
            <SectionLabel>Vare tjenester</SectionLabel>
          </RevealOnScroll>
          <RevealOnScroll>
            <h2 className="text-4xl font-bold tracking-tight text-[var(--color-grey-900)] mb-12">
              Alt du trenger for a utvikle spillet
            </h2>
          </RevealOnScroll>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 grid-rows-[260px_260px] gap-4">
            <StaggerItem className="md:row-span-2">
              <BentoCard
                href="/academy"
                className="h-full bg-[#0A1F18] text-white"
                tag="Coaching"
                title="Golf Academy"
                description="Personlig coaching med TrackMan for voksne pa alle nivaer"
                imageSrc="/images/academy/AK-Golf-Academy-30.jpg"
              />
            </StaggerItem>
            <StaggerItem>
              <BentoCard
                href="/junior-academy"
                className="h-full bg-[var(--color-surface)] text-[var(--color-text)]"
                tag="Ungdom 6-18"
                title="Junior Academy"
                description="Strukturert trening for barn og ungdom"
                imageSrc="/images/academy/AK-Golf-Academy-25.jpg"
              />
            </StaggerItem>
            <StaggerItem>
              <BentoCard
                href="/utvikling"
                className="h-full bg-[#005840] text-white"
                tag="For klubber"
                title="Utvikling"
                description="Sportsplaner og programvare"
              />
            </StaggerItem>
            <StaggerItem className="md:col-span-2">
              <BentoCard
                href="https://mulliganindoor.no"
                className="h-full bg-[#D1F843] text-[#0A1F18]"
                tag="Innendors"
                title="Mulligan Indoor Golf"
                description="TrackMan-simulatorer i Sarpsborg"
              />
            </StaggerItem>
          </StaggerContainer>
        </section>


        {/* ═══════════════════════════════════════════════════ */}
        {/* PRISER                                             */}
        {/* ═══════════════════════════════════════════════════ */}
        <section id="priser" className="max-w-[1200px] mx-auto px-6 lg:px-12 py-24 md:py-32">
          <RevealOnScroll>
            <SectionLabel>Priser</SectionLabel>
          </RevealOnScroll>
          <RevealOnScroll>
            <h2 className="text-4xl font-bold tracking-tight text-[var(--color-grey-900)] mb-12">
              Velg pakken som passer deg
            </h2>
          </RevealOnScroll>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Performance */}
            <StaggerItem>
              <div className="bg-white border border-[var(--border-color)] rounded-[20px] p-8 flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.07)] transition-all duration-400">
                <h3 className="text-xl font-bold text-[var(--color-grey-900)]">Performance</h3>
                <p className="text-sm text-[var(--color-muted)] mb-5">2 okter per maned</p>
                <p className="text-[40px] font-black text-[var(--color-grey-900)] tracking-tight leading-none">
                  1 600 <span className="text-sm font-normal text-[var(--color-muted)]">kr/mnd</span>
                </p>
                <div className="h-px bg-[var(--color-grey-100)] my-6" />
                <ul className="flex-1 space-y-1.5">
                  {["2 x 20 min coaching", "TrackMan-analyse", "Personlig treningsplan", "Spillerportalen", "7 dagers booking-vindu"].map((f) => (
                    <li key={f} className="text-sm text-[var(--color-text)] pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-[var(--color-success)] before:font-semibold">{f}</li>
                  ))}
                </ul>
                <Link href="/booking" className="block text-center mt-6 py-3.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text)] font-semibold text-sm hover:-translate-y-0.5 transition-all">
                  Velg Performance
                </Link>
              </div>
            </StaggerItem>

            {/* Performance Pro */}
            <StaggerItem>
              <div className="bg-white border-2 border-[#005840] rounded-[20px] p-8 flex flex-col h-full relative hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.07)] transition-all duration-400">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#005840] text-white text-[11px] font-semibold px-4 py-1 rounded-full">
                  Mest populaer
                </span>
                <h3 className="text-xl font-bold text-[var(--color-grey-900)]">Performance Pro</h3>
                <p className="text-sm text-[var(--color-muted)] mb-5">4 okter per maned</p>
                <p className="text-[40px] font-black text-[var(--color-grey-900)] tracking-tight leading-none">
                  2 000 <span className="text-sm font-normal text-[var(--color-muted)]">kr/mnd</span>
                </p>
                <div className="h-px bg-[var(--color-grey-100)] my-6" />
                <ul className="flex-1 space-y-1.5">
                  {["4 x 20 min coaching", "TrackMan-analyse", "Personlig treningsplan", "Spillerportalen", "14 dagers booking-vindu", "Prioritert booking"].map((f) => (
                    <li key={f} className="text-sm text-[var(--color-text)] pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-[var(--color-success)] before:font-semibold">{f}</li>
                  ))}
                </ul>
                <Link href="/booking" className="block text-center mt-6 py-3.5 rounded-full bg-[#D1F843] text-[#0A1F18] font-semibold text-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(209,248,67,0.3)] transition-all">
                  Velg Performance Pro
                </Link>
              </div>
            </StaggerItem>

            {/* Flex */}
            <StaggerItem>
              <div className="bg-white border border-[var(--border-color)] rounded-[20px] p-8 flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.07)] transition-all duration-400">
                <h3 className="text-xl font-bold text-[var(--color-grey-900)]">Flex</h3>
                <p className="text-sm text-[var(--color-muted)] mb-5">Enkeltokter uten binding</p>
                <p className="text-[40px] font-black text-[var(--color-grey-900)] tracking-tight leading-none">
                  1 500+ <span className="text-sm font-normal text-[var(--color-muted)]">kr</span>
                </p>
                <div className="h-px bg-[var(--color-grey-100)] my-6" />
                <ul className="flex-1 space-y-1.5">
                  {["50 eller 90 min okter", "TrackMan-analyse", "Ingen binding", "48 timers booking-vindu"].map((f) => (
                    <li key={f} className="text-sm text-[var(--color-text)] pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-[var(--color-success)] before:font-semibold">{f}</li>
                  ))}
                </ul>
                <Link href="/booking" className="block text-center mt-6 py-3.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text)] font-semibold text-sm hover:-translate-y-0.5 transition-all">
                  Se Flex-pakker
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PORTAL PREVIEW                                     */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-24 md:pb-32">
          <RevealOnScroll>
            <div className="bg-[var(--color-surface)] rounded-3xl p-10 md:p-16 grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-12 items-center">
              <div>
                <SectionLabel>Spillerportalen</SectionLabel>
                <h3 className="text-3xl font-bold text-[var(--color-grey-900)] tracking-tight mb-3">
                  Din treningspartner mellom oktene
                </h3>
                <p className="text-[15px] text-[var(--color-text)] leading-relaxed mb-6">
                  Treningsplaner, scoring, spredning, AI-coaching og mer — samlet pa ett sted.
                </p>
                <div className="flex flex-wrap gap-2 mb-7">
                  {["Treningsplaner", "Scoring & spredning", "AI-innsikt", "Booking", "TrackMan-data"].map((chip) => (
                    <span
                      key={chip}
                      className="px-3.5 py-1.5 bg-white border border-[var(--border-color)] rounded-full text-xs font-medium text-[var(--color-text)] hover:border-[#005840] hover:text-[#005840] hover:-translate-y-px transition-all cursor-default"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <Link
                  href="/portal"
                  className="inline-block px-7 py-3 bg-[var(--color-grey-900)] text-white rounded-full text-sm font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,31,24,0.2)] transition-all"
                >
                  Logg inn i portalen
                </Link>
              </div>
              <div className="bg-white rounded-2xl h-[380px] border border-[var(--border-color)] shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/portal-preview-page.png"
                  alt="Spillerportalen dashboard"
                  width={800}
                  height={500}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </RevealOnScroll>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* CTA                                                */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 pb-12">
          <RevealOnScroll>
            <div className="relative bg-[#0A1F18] rounded-3xl py-20 md:py-24 px-8 text-center overflow-hidden">
              {/* Glow orbs */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-[radial-gradient(circle,rgba(0,88,64,0.3),transparent_70%)] animate-pulse" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[radial-gradient(circle,rgba(209,248,67,0.08),transparent_70%)] animate-[pulse_4s_ease-in-out_2s_infinite]" />

              <h2 className="relative z-10 text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
                Klar for a ta spillet videre?
              </h2>
              <p className="relative z-10 text-base text-white/50 mb-8">
                Book din forste coaching-okt og fa en personlig treningsplan.
              </p>
              <Link
                href="/booking"
                className="relative z-10 inline-block px-8 py-4 bg-[#D1F843] text-[#0A1F18] rounded-full text-base font-bold hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(209,248,67,0.3)] transition-all duration-400"
              >
                Book din forste okt
              </Link>
            </div>
          </RevealOnScroll>
        </section>
      </main>

      <WebsiteFooter />
      <BackToTop />

      {/* Hero zoom animation */}
      <style jsx global>{`
        @keyframes heroZoom {
          0% { transform: scale(1.0) translate(0, 0); }
          25% { transform: scale(1.06) translate(-8px, -4px); }
          50% { transform: scale(1.03) translate(4px, -6px); }
          75% { transform: scale(1.07) translate(-4px, 2px); }
          100% { transform: scale(1.04) translate(6px, -2px); }
        }
      `}</style>
    </PageTransition>
  );
}
