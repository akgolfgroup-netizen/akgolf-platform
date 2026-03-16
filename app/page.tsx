"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { AKLogo } from "@/components/website/AKLogo";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { ServiceCard } from "@/components/website/ServiceCard";
import { MethodRow } from "@/components/website/MethodRow";
import { FeaturedTestimonial } from "@/components/website/FeaturedTestimonial";
import { TestimonialCard } from "@/components/website/TestimonialCard";
import { TeamSection } from "@/components/website/TeamSection";
import { ProcessSteps } from "@/components/website/ProcessSteps";
import { ApplicationForm } from "@/components/website/ApplicationForm";
import { BackToTop } from "@/components/website/BackToTop";
import {
  HERO,
  DIVISIONS,
  METHOD_PILLARS,
  TESTIMONIALS,
  BOOKING_URL,
} from "@/lib/website-constants";

// ─── Loader ───
function Loader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-ink-100 flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AKLogo variant="gold" size={48} />
      <div className="mt-8 w-48 h-[2px] bg-ink-80 rounded-full overflow-hidden">
        <div className="h-full bg-gold w-animate-loader rounded-full" />
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("akgolf_visited");
    }
    return true;
  });

  function handleLoaderComplete() {
    sessionStorage.setItem("akgolf_visited", "1");
    setLoading(false);
  }

  return (
    <>
      <AnimatePresence>{loading && <Loader onComplete={handleLoaderComplete} />}</AnimatePresence>

      <WebsiteNav />

      <main id="main-content">
        {/* ─── 1. Hero (mørk) ─── */}
        <section className="relative min-h-screen flex items-center pt-[52px]">
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/hero/hero-main.jpg"
              alt=""
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-100/85 via-ink-100/60 to-ink-100/30" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-warm to-transparent" />
          </div>

          <div className="w-container relative w-full">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <SectionLabel>{HERO.eyebrow}</SectionLabel>
              </motion.div>

              <motion.h1
                className="w-heading-xl mt-6 mb-6 text-white"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: loading ? 0 : 1, y: loading ? 40 : 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {HERO.heading}
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-ink-20 max-w-xl leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {HERO.subheading}
              </motion.p>

              {/* Urgency badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold w-animate-pulse-gold" />
                <span className="text-xs text-gold-text font-medium">{HERO.urgencyBadge}</span>
              </motion.div>

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <Link href="/booking" className="w-btn w-btn-primary">{HERO.ctaPrimary}</Link>
                <Link href="/#apply" className="w-btn w-btn-gold">{HERO.ctaBooking || "Kontakt oss"}</Link>
                <Link href="/#method" className="w-btn w-btn-secondary">{HERO.ctaSecondary} &rarr;</Link>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                className="flex flex-wrap gap-6 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                {HERO.trustItems.map((item) => (
                  <span key={item} className="flex items-center gap-2 text-xs text-ink-30">
                    <span className="w-1 h-1 rounded-full bg-gold" />
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── 2. Divisjoner (lys) ─── */}
        <section className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Våre divisjoner</SectionLabel>
                <h2 className="w-heading-lg mt-4">Alt du trenger. Under ett tak.</h2>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIVISIONS.map((div) => (
                <StaggerItem key={div.id}>
                  <ServiceCard
                    title={div.title}
                    description={div.description}
                    features={div.features}
                    href={div.href}
                    accent={div.accent}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── 3. Metode (mørk) ─── */}
        <section id="method" className="w-section-lg bg-ink-100 w-section-dark">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Vår metode</SectionLabel>
                <h2 className="w-heading-lg text-white mt-4">
                  Tre pilarer. Ett system.
                </h2>
              </div>
            </RevealOnScroll>

            <div className="space-y-16">
              {METHOD_PILLARS.map((pillar, i) => (
                <MethodRow
                  key={pillar.number}
                  number={pillar.number}
                  title={pillar.title}
                  subtitle={pillar.subtitle}
                  description={pillar.description}
                  reversed={i % 2 === 1}
                  dark
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─── 4. Team (lys) ─── */}
        <TeamSection />

        {/* ─── 5. Testimonials (mørk) ─── */}
        <section className="bg-ink-100 w-section-lg w-section-dark">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Hva elevene sier</SectionLabel>
                <h2 className="w-heading-lg text-white mt-4">Resultater du kan høre.</h2>
              </div>
            </RevealOnScroll>

            {TESTIMONIALS.filter(t => t.featured).map(t => (
              <FeaturedTestimonial key={t.name} quote={t.quote} name={t.name} role={t.role} />
            ))}

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.filter(t => !t.featured).map(t => (
                <StaggerItem key={t.name}>
                  <TestimonialCard quote={t.quote} name={t.name} role={t.role} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── 6. Kontakt & Skjema (lys) ─── */}
        <section id="apply" className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Ta kontakt</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Start med en uforpliktende samtale.</h2>
                <p className="text-ink-50 max-w-lg mx-auto">
                  Fortell oss om dine mål, så finner vi ut hvordan vi kan hjelpe deg videre.
                </p>
              </div>
            </RevealOnScroll>

            <ProcessSteps />

            <RevealOnScroll delay={0.4}>
              <div className="mt-12">
                <ApplicationForm />
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
