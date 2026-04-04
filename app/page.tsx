"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { BackToTop } from "@/components/website/BackToTop";
import { SocialProofBar } from "@/components/website/SocialProofBar";
import { BentoFeatures } from "@/components/website/BentoFeatures";
import { ParallaxImage } from "@/components/website/ParallaxImage";
import { DarkStats } from "@/components/website/DarkStats";
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
  return (
    <>
      <WebsiteNav />

      <main id="main-content">

        {/* ================================================================= */}
        {/* 1. HERO — Dark cinematic with Ken Burns image                     */}
        {/* ================================================================= */}
        <section className="relative min-h-[100svh] flex items-end pb-20 md:pb-28 overflow-hidden">
          {/* Background with Ken Burns */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.05] }}
            transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />

          <div className="w-container relative z-10 w-full">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#2D6A4F]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#40916C]">
                    {HERO.eyebrow}
                  </span>
                </div>
              </motion.div>

              <motion.h1
                className="font-display text-4xl md:text-6xl lg:text-[72px] font-bold text-white tracking-[-0.035em] mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4 }}
              >
                Presisjon i hvert{" "}
                <span className="text-[#40916C]">slag.</span>
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
                  className="px-7 py-3.5 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  {HERO.ctaPrimary}
                </a>
                <a
                  href={BOOKING_URL}
                  className="px-7 py-3.5 rounded-[980px] border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
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
        {/* 2. SOCIAL PROOF BAR                                                */}
        {/* ================================================================= */}
        <SocialProofBar />

        {/* ================================================================= */}
        {/* 3. BENTO FEATURES — SG-radar + AI + TrackMan                      */}
        {/* ================================================================= */}
        <BentoFeatures />

        {/* ================================================================= */}
        {/* 4. PARALLAX IMAGE                                                  */}
        {/* ================================================================= */}
        <ParallaxImage
          src="/images/branding/ak-golf-academy-06.jpg"
          alt="Putting green sett ovenfra"
        />

        {/* ================================================================= */}
        {/* 5. DARK STATS                                                      */}
        {/* ================================================================= */}
        <DarkStats />

        {/* ================================================================= */}
        {/* 6. COACHING OFFERS                                                 */}
        {/* ================================================================= */}
        <CoachingOfferGrid />

        {/* ================================================================= */}
        {/* 7. TESTIMONIAL                                                     */}
        {/* ================================================================= */}
        <TestimonialBlock />

        {/* ================================================================= */}
        {/* 8. COACH — Bio section                                             */}
        {/* ================================================================= */}
        <section className="py-28 md:py-40 bg-white">
          <div className="w-container">
            <RevealOnScroll>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-5xl mx-auto">
                <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden">
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
                  <h2 className="w-heading-lg mt-5 mb-4">{COACH_BIO.name}</h2>
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
        <section id="faq" className="py-28 md:py-40 bg-[#F5F5F7]">
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
        <section className="relative py-28 md:py-40 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/branding/ak-golf-academy-31.jpg"
              alt="To figurer på fairway"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="w-container relative z-10">
            <RevealOnScroll>
              <div className="text-center max-w-xl mx-auto">
                <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                  Klar for å bli bedre?
                </h2>
                <p className="text-lg text-white/60 mb-10">
                  Start med en coaching-sesjon og få en tydelig plan for utviklingen din.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href={BOOKING_URL}
                    className="px-8 py-4 rounded-[980px] bg-white text-[#1D1D1F] text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    Book coaching
                  </a>
                  <Link
                    href="/#apply"
                    className="px-8 py-4 rounded-[980px] border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
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
        <section id="apply" className="py-28 md:py-40 bg-[#F5F5F7]">
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
