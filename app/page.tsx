"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { BackToTop } from "@/components/website/BackToTop";
import { BentoFeatures } from "@/components/website/BentoFeatures";
import { ParallaxImage } from "@/components/website/ParallaxImage";
import { CoachingOfferGrid } from "@/components/website/CoachingOfferGrid";
import { TestimonialBlock } from "@/components/website/TestimonialBlock";
import { ApplicationForm } from "@/components/website/ApplicationForm";
import {
  HERO,
  COACHING_FAQ,
  BOOKING_URL,
  COACH_BIO,
} from "@/lib/website-constants";

export default function HomePage() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <WebsiteNav />

      <main id="main-content">

        {/* ================================================================= */}
        {/* 1. HERO — Dark cinematic with Ken Burns image                     */}
        {/* ================================================================= */}
        <section className="relative min-h-[100svh] flex items-end pb-20 md:pb-28 overflow-hidden grain-overlay">
          {/* Background with Ken Burns */}
          <motion.div
            className="absolute inset-0"
            animate={reducedMotion ? {} : { scale: [1, 1.05] }}
            transition={reducedMotion ? undefined : { duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          >
            <Image
              src="/images/branding/ak-golf-academy-18.jpg"
              alt="Golf coaching på fairway i kveldslys"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />

          <div className="w-container relative z-10 w-full">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-brand)]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                    {HERO.eyebrow}
                  </span>
                </div>
              </motion.div>

              <motion.h1
                className="font-display text-[48px] md:text-6xl lg:text-[80px] font-bold text-white tracking-[-0.035em] mb-6"
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                Presisjon i hvert slag.
              </motion.h1>

              <motion.p
                className="text-lg text-white/60 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {HERO.subheading}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <a
                  href="#packages"
                  className="px-8 py-4 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  {HERO.ctaPrimary}
                </a>
                <a
                  href={BOOKING_URL}
                  className="px-8 py-4 rounded-[980px] border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  {HERO.ctaSecondary}
                </a>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </section>

        {/* ================================================================= */}
        {/* 2. BENTO FEATURES — SG-radar + AI + TrackMan                      */}
        {/* ================================================================= */}
        <BentoFeatures />

        {/* ================================================================= */}
        {/* 3. PARALLAX IMAGE                                                  */}
        {/* ================================================================= */}
        <ParallaxImage
          src="/images/branding/ak-golf-academy-06.jpg"
          alt="Putting green sett ovenfra"
        />

        {/* ================================================================= */}
        {/* 4. SPILLERPORTAL — Split layout with iPhone mockup               */}
        {/* ================================================================= */}
        <section className="py-[120px] md:py-[160px] bg-white overflow-hidden">
          <div className="w-container">
            <RevealOnScroll>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
                {/* Text */}
                <div className="max-w-xl">
                  <SectionLabel>Spillerportalen</SectionLabel>
                  <h2 className="font-display text-3xl md:text-[48px] font-extrabold tracking-tight text-[#1D1D1F] mt-5 mb-4">
                    Din treningspartner — alltid tilgjengelig.
                  </h2>
                  <p className="text-[#48484A] text-lg leading-relaxed mb-4">
                    Spillerportalen gir deg full oversikt over spillet ditt.
                    Treningsplaner, Strokes Gained-analyse, coaching-notater
                    og AI-drevne anbefalinger — alt samlet pa ett sted.
                  </p>
                  <p className="text-[#6E6E73] text-sm mb-10">
                    Inkludert i alle coaching-abonnement. Fristaende tilgang: 299 kr/mnd.
                  </p>
                  <Link
                    href="/portal"
                    className="inline-flex px-8 py-4 rounded-[980px] bg-[#1D1D1F] text-white text-sm font-semibold hover:bg-[#2C2C2E] transition-colors"
                  >
                    Prov Spillerportalen
                  </Link>
                </div>

                {/* iPhone Mockup */}
                <div className="flex justify-center lg:justify-end">
                  <motion.div
                    className="relative"
                    style={{ perspective: "1200px" }}
                    animate={reducedMotion ? {} : { y: [0, -8, 0] }}
                    transition={reducedMotion ? undefined : { duration: 4, ease: "easeInOut", repeat: Infinity }}
                  >
                    <div className="relative w-[280px] h-[560px] rounded-[48px] border-[8px] border-[#1D1D1F] bg-[#F5F5F7] overflow-hidden shadow-2xl">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#1D1D1F] rounded-b-2xl z-10" />

                      {/* Screen content — mini dashboard */}
                      <div className="pt-10 px-5 space-y-4">
                        {/* Status bar */}
                        <div className="flex justify-between items-center text-[9px] text-[#6E6E73] font-medium px-1">
                          <span>09:41</span>
                          <div className="flex gap-1 items-center">
                            <div className="w-4 h-2 rounded-sm border border-[#6E6E73]">
                              <div className="w-2.5 h-full bg-[#2D6A4F] rounded-sm" />
                            </div>
                          </div>
                        </div>

                        {/* Handicap card */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <p className="text-[9px] font-medium text-[#6E6E73] uppercase tracking-wider">Handicap</p>
                          <p className="text-[28px] font-bold text-[#1D1D1F] leading-tight">12.4</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-[#2D6A4F]" />
                            <span className="text-[9px] font-medium text-[#2D6A4F]">-1.2 siste 3 mnd</span>
                          </div>
                        </div>

                        {/* Streak card */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <p className="text-[9px] font-medium text-[#6E6E73] uppercase tracking-wider">Treningsstreak</p>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-[22px] font-bold text-[#1D1D1F]">12</span>
                            <span className="text-[10px] text-[#6E6E73]">dager</span>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {[1, 1, 1, 1, 1, 0, 0].map((active, i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full ${active ? "bg-[#2D6A4F]" : "bg-[#E8E8ED]"}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Mini radar placeholder */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <p className="text-[9px] font-medium text-[#6E6E73] uppercase tracking-wider">Strokes Gained</p>
                          <div className="flex justify-center mt-2">
                            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" className="text-[#2D6A4F]">
                              <polygon points="50,15 85,35 75,80 25,80 15,35" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
                              <polygon points="50,25 72,38 65,70 35,70 28,38" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. COACHING OFFERS                                                 */}
        {/* ================================================================= */}
        <CoachingOfferGrid />

        {/* ================================================================= */}
        {/* 7. TESTIMONIAL                                                     */}
        {/* ================================================================= */}
        <TestimonialBlock />

        {/* ================================================================= */}
        {/* 8. COACH — Bio section                                             */}
        {/* ================================================================= */}
        <section className="py-[120px] md:py-[160px] bg-white">
          <div className="w-container">
            <RevealOnScroll>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-5xl mx-auto">
                <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden">
                  <Image
                    src={COACH_BIO.image}
                    alt={COACH_BIO.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div>
                  <SectionLabel>Din coach</SectionLabel>
                  <h2 className="font-display text-3xl md:text-[48px] font-extrabold tracking-tight text-[#1D1D1F] mt-5 mb-4">{COACH_BIO.name}</h2>
                  <p className="text-[#6E6E73] text-sm uppercase tracking-wider mb-6">{COACH_BIO.title}</p>
                  <p className="text-[#48484A] text-lg leading-relaxed">{COACH_BIO.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 9. FAQ                                                             */}
        {/* ================================================================= */}
        <section id="faq" className="py-[120px] md:py-[160px] bg-[#F5F5F7]">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <SectionLabel>Spørsmål og svar</SectionLabel>
                <h2 className="w-heading-lg mt-5">Ofte stilte spørsmål</h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="max-w-2xl mx-auto">
                <FAQAccordion items={COACHING_FAQ} />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 10. CTA — Dark with background image                               */}
        {/* ================================================================= */}
        <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center py-20 overflow-hidden grain-overlay">
          <div className="absolute inset-0">
            <Image
              src="/images/branding/ak-golf-academy-35.jpg"
              alt="Golfbane i kveldslys"
              fill
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/80" />
          </div>

          <div className="w-container relative z-10">
            <RevealOnScroll>
              <div className="text-center max-w-xl mx-auto">
                <h2 className="font-display text-3xl md:text-5xl lg:text-[56px] font-bold text-white tracking-tight mb-6">
                  Klar for å bli bedre?
                </h2>
                <p className="text-lg text-white/60 mb-10">
                  Start med en coaching-sesjon og få en tydelig plan for utviklingen din.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href={BOOKING_URL}
                    className="px-10 py-5 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    Book coaching
                  </a>
                  <Link
                    href="/#apply"
                    className="px-10 py-5 rounded-[980px] border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    Ta kontakt
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 11. KONTAKT / APPLY                                                */}
        {/* ================================================================= */}
        <section id="apply" className="py-[120px] md:py-[160px] bg-[#F5F5F7]">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <SectionLabel>Ta kontakt</SectionLabel>
                <h2 className="w-heading-lg mt-5 mb-4">Klar for å starte?</h2>
                <p className="text-[#6E6E73] max-w-md mx-auto text-lg">
                  Fortell oss om dine mål, så finner vi ut hvordan vi kan hjelpe deg videre.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <ApplicationForm />
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
