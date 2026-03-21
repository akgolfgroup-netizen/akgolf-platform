"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { ServiceCard } from "@/components/website/ServiceCard";
import { MethodRow } from "@/components/website/MethodRow";
import { TeamSection } from "@/components/website/TeamSection";
import { ApplicationForm } from "@/components/website/ApplicationForm";
import { BackToTop } from "@/components/website/BackToTop";
import {
  HERO,
  DIVISIONS,
  METHOD_PILLARS,
  BOOKING_URL,
} from "@/lib/website-constants";

export default function HomePage() {
  return (
    <>
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <SectionLabel>{HERO.eyebrow}</SectionLabel>
              </motion.div>

              <motion.h1
                className="w-heading-xl mt-6 mb-6 text-white"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {HERO.heading}
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-ink-20 max-w-xl leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {HERO.subheading}
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-btn w-btn-primary">{HERO.ctaPrimary}</a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── 2. Tjenester (lys) ─── */}
        <section className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Hva vi tilbyr</SectionLabel>
                <h2 className="w-heading-lg mt-4">Alt du trenger. Under ett tak.</h2>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  image={pillar.image}
                  reversed={i % 2 === 1}
                  dark
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─── 4. Team (lys) ─── */}
        <TeamSection />

        {/* ─── 5. Kontakt ─── */}
        <section id="apply" className="w-section-lg bg-surface-cream">
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

            <RevealOnScroll delay={0.2}>
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
