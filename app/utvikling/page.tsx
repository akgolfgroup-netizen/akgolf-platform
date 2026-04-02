"use client";

import Link from "next/link";
import Image from "next/image";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { ApplicationForm } from "@/components/website/ApplicationForm";
import { ImagePlaceholder } from "@/components/website/ImagePlaceholder";
import { RelatedPages } from "@/components/website/RelatedPages";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { motion } from "framer-motion";
import { EASE_ENTRANCE } from "@/lib/design-tokens";
import {
  UTVIKLING_HERO,
  UTVIKLING_SERVICES,
  UTVIKLING_SOFTWARE,
  UTVIKLING_SOFTWARE_FEATURES,
  UTVIKLING_KLUBB,
  UTVIKLING_KLUBB_FEATURES,
  UTVIKLING_PRODUCTS,
  UTVIKLING_CASE_STUDIES,
  UTVIKLING_CTA,
} from "@/lib/website-constants";

export default function UtviklingPage() {
  return (
    <>
      <WebsiteNav />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Hjem", item: "https://akgolf.no" },
                { "@type": "ListItem", position: 2, name: "Utvikling", item: "https://akgolf.no/utvikling" },
              ],
            }),
          }}
        />
        <PageTransition>
          {/* ─── Hero with Image ─── */}
          <section className="relative min-h-[70svh] flex items-center pt-[48px] overflow-hidden">
            {/* Hero image background */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/academy/AK-Golf-Academy-42.jpg"
                alt="Coach og elev gjennomgår data på laptop"
                fill
                className="object-cover object-[center_40%]"
                priority
                sizes="100vw"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="w-container relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [...EASE_ENTRANCE] }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-black" />
                  <SectionLabel>Utvikling</SectionLabel>
                </div>
              </motion.div>

              <motion.h1
                className="w-heading-xl max-w-3xl mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [...EASE_ENTRANCE] }}
              >
                {UTVIKLING_HERO.heading}
              </motion.h1>

              <motion.p
                className="text-lg text-grey-500 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [...EASE_ENTRANCE] }}
              >
                {UTVIKLING_HERO.description}
              </motion.p>

              {/* Horizontal accent */}
              <motion.div
                className="mt-12 w-16 h-px bg-gradient-to-r from-grey-300 to-transparent"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [...EASE_ENTRANCE] }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </section>

          {/* ─── Two Main Services ─── */}
          <section className="w-section-lg bg-grey-100">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <SectionLabel>{UTVIKLING_SERVICES.eyebrow}</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-4">{UTVIKLING_SERVICES.heading}</h2>
                  <p className="text-grey-500 leading-relaxed">{UTVIKLING_SERVICES.description}</p>
                </div>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {UTVIKLING_SERVICES.services.map((service) => (
                  <StaggerItem key={service.id}>
                    <div className="w-card h-full flex flex-col p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-3 h-3 rounded-full bg-black" />
                        <span className="text-xs font-mono uppercase tracking-wider text-grey-500">
                          {service.subtitle}
                        </span>
                      </div>
                      <h3 className="w-heading-md mb-3">{service.title}</h3>
                      <p className="text-grey-500 leading-relaxed mb-6 flex-1">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-grey-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-grey-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 pt-6 border-t border-grey-200">
                        <Link
                          href={`#${service.id}`}
                          className="text-sm font-medium text-black hover:text-grey-600 transition-colors"
                        >
                          Les mer om {service.title.toLowerCase()} &rarr;
                        </Link>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── Software Section ─── */}
          <section id="software" className="w-section-lg bg-white">
            <div className="w-container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
                <RevealOnScroll>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-2 h-2 rounded-full bg-black" />
                      <SectionLabel>{UTVIKLING_SOFTWARE.label}</SectionLabel>
                    </div>
                    <h2 className="w-heading-lg mb-6">
                      {UTVIKLING_SOFTWARE.heading}<br />
                      <span className="text-grey-500">{UTVIKLING_SOFTWARE.subheading}</span>
                    </h2>
                    <p className="text-grey-500 leading-relaxed">
                      {UTVIKLING_SOFTWARE.description}
                    </p>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2}>
                  <ImagePlaceholder aspect="16/10" src="/images/academy/AK-Golf-Academy-3.jpg" label="Software dashboard" />
                </RevealOnScroll>
              </div>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {UTVIKLING_SOFTWARE_FEATURES.map((feature) => (
                  <StaggerItem key={feature.id}>
                    <div className="w-card h-full flex flex-col">
                      <div className="w-10 h-10 rounded-lg bg-grey-100 flex items-center justify-center mb-4">
                        <div className="w-3 h-3 rounded-full bg-black" />
                      </div>
                      <h4 className="font-display text-lg font-semibold text-black mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-grey-500 leading-relaxed mb-4 flex-1">
                        {feature.description}
                      </p>
                      <ul className="space-y-1.5">
                        {feature.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2 text-xs text-grey-600">
                            <span className="w-1 h-1 rounded-full bg-grey-400" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <RevealOnScroll>
                <div className="mt-12 text-center">
                  <Link href="#apply" className="w-btn w-btn-primary">
                    Bestill en demo
                  </Link>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── Klubbutvikling Section ─── */}
          <section id="klubbutvikling" className="w-section-lg bg-grey-100">
            <div className="w-container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
                <RevealOnScroll delay={0.2} className="order-2 lg:order-1">
                  <ImagePlaceholder aspect="16/10" src="/images/academy/AK-Golf-Academy-17.jpg" label="Klubbtrening" />
                </RevealOnScroll>

                <RevealOnScroll className="order-1 lg:order-2">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-2 h-2 rounded-full bg-black" />
                      <SectionLabel>{UTVIKLING_KLUBB.label}</SectionLabel>
                    </div>
                    <h2 className="w-heading-lg mb-6">
                      {UTVIKLING_KLUBB.heading}<br />
                      <span className="text-grey-500">{UTVIKLING_KLUBB.subheading}</span>
                    </h2>
                    <p className="text-grey-500 leading-relaxed">
                      {UTVIKLING_KLUBB.description}
                    </p>
                  </div>
                </RevealOnScroll>
              </div>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {UTVIKLING_KLUBB_FEATURES.map((feature) => (
                  <StaggerItem key={feature.id}>
                    <div className="w-card h-full flex flex-col">
                      <div className="w-10 h-10 rounded-lg bg-grey-200 flex items-center justify-center mb-4">
                        <div className="w-3 h-3 rounded-full bg-black" />
                      </div>
                      <h4 className="font-display text-lg font-semibold text-black mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-grey-500 leading-relaxed mb-4 flex-1">
                        {feature.description}
                      </p>
                      <ul className="space-y-1.5">
                        {feature.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2 text-xs text-grey-600">
                            <span className="w-1 h-1 rounded-full bg-grey-400" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <RevealOnScroll>
                <div className="mt-12 text-center">
                  <Link href="#apply" className="w-btn w-btn-primary">
                    {UTVIKLING_CTA.primaryCta}
                  </Link>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── Products ─── */}
          <section id="products" className="w-section-lg bg-white">
            <div className="w-container">
              <RevealOnScroll>
                <SectionLabel>Produkter</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Konkrete losninger.</h2>
                <p className="text-grey-500 max-w-2xl leading-relaxed mb-12">
                  Digitale verktoy og radgivingstjenester med fast pris. Alt skreddersys til klubbens behov.
                </p>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {UTVIKLING_PRODUCTS.map((product) => (
                  <StaggerItem key={product.id}>
                    <div className="w-card h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-black" />
                        <span className="text-xs font-mono text-grey-500 uppercase tracking-wider">{product.tagline}</span>
                      </div>
                      <h3 className="w-heading-sm mb-2">{product.title}</h3>
                      <p className="text-sm text-grey-500 leading-relaxed mb-4 flex-1">{product.description}</p>
                      <ul className="space-y-2 mb-6">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-xs text-grey-600">
                            <span className="w-1 h-1 rounded-full bg-grey-400 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 border-t border-grey-200">
                        <p className="font-mono text-lg font-bold text-black">{product.pricing}</p>
                        <p className="text-xs text-grey-500">{product.pricingNote}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── Case Studies / References ─── */}
          <section className="w-section-lg bg-grey-100">
            <div className="w-container">
              <RevealOnScroll>
                <SectionLabel>Referanser</SectionLabel>
                <h2 className="w-heading-lg mt-4 mb-4">Klubber vi har hjulpet.</h2>
                <p className="text-grey-500 max-w-2xl mb-12">
                  Fra sportsplaner til digitale verktoy. Her er noen av klubbene som bruker vare losninger.
                </p>
              </RevealOnScroll>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {UTVIKLING_CASE_STUDIES.map((study) => (
                  <StaggerItem key={study.club}>
                    <div className="w-card h-full bg-white">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-grey-100 flex items-center justify-center">
                          <span className="text-lg font-bold text-black">{study.club.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-black">{study.club}</h4>
                          <p className="text-xs text-grey-500">{study.year}</p>
                        </div>
                      </div>
                      <blockquote className="text-sm text-grey-500 leading-relaxed mb-4 italic">
                        &quot;{study.quote}&quot;
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {study.products.map((product) => (
                            <span key={product} className="px-2 py-1 rounded-full bg-grey-100 text-grey-600 text-xs">
                              {product}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-black">{study.result}</span>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ─── Contact CTA ─── */}
          <section className="w-section-lg bg-white">
            <div className="w-container">
              <RevealOnScroll>
                <div className="max-w-2xl mx-auto text-center">
                  <SectionLabel>{UTVIKLING_CTA.label}</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-4">{UTVIKLING_CTA.heading}</h2>
                  <p className="text-grey-500 leading-relaxed mb-8">
                    {UTVIKLING_CTA.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link href="#apply" className="w-btn w-btn-primary">
                      {UTVIKLING_CTA.primaryCta}
                    </Link>
                    <Link href="/" className="w-btn w-btn-secondary">
                      {UTVIKLING_CTA.secondaryCta} &rarr;
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── Application Form ─── */}
          <section id="apply" className="w-section-lg bg-grey-100">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>Ta kontakt</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-4">Fortell oss om deres behov.</h2>
                  <p className="text-grey-500 max-w-lg mx-auto">
                    Fyll ut skjemaet under, sa tar vi kontakt for en uforpliktende samtale om deres muligheter.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <ApplicationForm />
              </RevealOnScroll>
            </div>
          </section>

          {/* ─── Related Pages ─── */}
          <RelatedPages exclude="utvikling" />
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
