"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { FAQAccordion } from "@/components/website/FAQAccordion";
import { BackToTop } from "@/components/website/BackToTop";
import {
  HERO,
  COACHING_PACKAGES,
  SERVICE_TYPES,
  TEAM,
  TESTIMONIALS,
  COACHING_FAQ,
  FINAL_CTA,
} from "@/lib/website-constants";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      className="text-ink-70"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ServiceIcon({ icon }: { icon: string }) {
  const iconPaths: Record<string, React.ReactNode> = {
    user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></>,
    "circle-dot": <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="1" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15" /><path d="M15 6v15" /></>,
  };

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[icon] || iconPaths.user}
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <WebsiteNav />

      <main id="main-content">
        {/* ─── 1. Hero (centered, light gradient) ─── */}
        <section className="w-section-lg bg-gradient-to-b from-ink-05 to-surface-warm pt-28">
          <div className="w-container">
            <div className="max-w-2xl mx-auto text-center">
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-ink-10 rounded-full text-xs font-medium text-ink-70 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                {HERO.statusBadge}
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="w-heading-xl mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {HERO.heading}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg md:text-xl text-ink-50 max-w-xl mx-auto leading-relaxed mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {HERO.subheading}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-4 justify-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Link href="/academy/booking" className="w-btn w-btn-primary w-btn-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  {HERO.ctaPrimary}
                </Link>
                <Link href="/academy" className="w-btn w-btn-secondary w-btn-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  {HERO.ctaSecondary}
                </Link>
              </motion.div>

              {/* Trust Bar */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-8 p-6 bg-white rounded-xl border border-ink-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {HERO.trustItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm text-ink-60">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-40">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="font-medium text-ink-80">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── 2. Services / Packages ─── */}
        <section id="packages" className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Coaching-pakker</SectionLabel>
                <h2 className="w-heading-lg mt-4">Velg pakken som passer deg</h2>
                <p className="text-ink-50 max-w-xl mx-auto mt-4">
                  Alle pakker inkluderer tilgang til vår treningsplattform og mulighet for oppgradering underveis.
                </p>
              </div>
            </RevealOnScroll>

            {/* Package Cards */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {COACHING_PACKAGES.map((pkg) => (
                <StaggerItem key={pkg.name}>
                  <div
                    className={`rounded-2xl p-8 flex flex-col h-full transition-all duration-300 ${
                      pkg.highlighted
                        ? "bg-white border-2 border-ink-30 shadow-xl relative"
                        : "bg-white border border-ink-10 hover:border-ink-20 hover:shadow-lg"
                    }`}
                  >
                    {pkg.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ink-90 text-white text-[10px] font-mono uppercase tracking-[0.12em] px-3 py-1 rounded-full">
                        Mest populær
                      </span>
                    )}

                    <h3 className="font-display text-xl font-semibold text-ink-90 mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-ink-50 mb-4">{pkg.tagline}</p>

                    <div className="mb-6">
                      <span className="font-mono text-4xl font-bold text-ink-90 tracking-tight">
                        {pkg.price} kr
                      </span>
                      <span className="text-sm text-ink-50 ml-1">/mnd</span>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <CheckIcon className="shrink-0 mt-0.5 text-ink-40" />
                          <span className="text-ink-60">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/academy/booking?package=${pkg.name.toLowerCase()}`}
                      className={`w-btn text-center w-full ${
                        pkg.highlighted ? "w-btn-primary" : "w-btn-secondary"
                      }`}
                    >
                      Velg {pkg.name}
                    </Link>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Service Types */}
            <RevealOnScroll>
              <div className="text-center mb-8">
                <h3 className="w-heading-md">Eller book enkelttimer</h3>
                <p className="text-ink-50 text-sm mt-2">Velg den tjenesten som passer ditt behov</p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {SERVICE_TYPES.map((service) => (
                <StaggerItem key={service.id}>
                  <Link
                    href={`/academy/booking?service=${service.id}`}
                    className="group bg-white rounded-xl border border-ink-10 p-6 text-center transition-all hover:border-ink-30 hover:-translate-y-0.5"
                  >
                    <div className="w-12 h-12 rounded-lg bg-ink-05 flex items-center justify-center mx-auto mb-4 text-ink-50 group-hover:bg-ink-10 transition-colors">
                      <ServiceIcon icon={service.icon} />
                    </div>
                    <h4 className="font-semibold text-sm text-ink-80 mb-1">{service.name}</h4>
                    <p className="text-xs text-ink-50">{service.description}</p>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── 3. Instructors ─── */}
        <section id="team" className="w-section-lg bg-ink-05">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Dine trenere</SectionLabel>
                <h2 className="w-heading-lg mt-4">Coaching på GFGK</h2>
                <p className="text-ink-50 max-w-lg mx-auto mt-4">
                  Erfarne trenere med dokumenterte resultater og lidenskap for spillerutvikling.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {TEAM.map((member, i) => (
                <StaggerItem key={member.name}>
                  <div className="bg-white rounded-2xl border border-ink-10 p-8 text-center">
                    {/* Avatar placeholder */}
                    <div className="w-24 h-24 rounded-full bg-ink-10 flex items-center justify-center mx-auto mb-6">
                      <span className="font-display text-2xl font-semibold text-ink-40">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-semibold text-ink-90 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-ink-50 mb-4">{member.role}</p>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {member.certifications.slice(0, 4).map((cert) => (
                        <span
                          key={cert}
                          className="px-2.5 py-1 bg-ink-05 rounded-full text-[11px] text-ink-60"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon key={star} filled />
                        ))}
                      </div>
                      <span className="font-semibold text-sm text-ink-80">{i === 0 ? "5.0" : "4.9"}</span>
                      <span className="text-xs text-ink-50">({i === 0 ? "47" : "32"} vurderinger)</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── 4. Testimonials ─── */}
        <section className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Testimonials</SectionLabel>
                <h2 className="w-heading-lg mt-4">Resultater du kan høre</h2>
                <p className="text-ink-50 max-w-lg mx-auto mt-4">
                  Ekte historier fra spillere som har opplevd transformasjonen.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.slice(0, 3).map((testimonial) => (
                <StaggerItem key={testimonial.name}>
                  <div className="bg-white rounded-2xl border border-ink-10 p-6 h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} filled />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-ink-70 leading-relaxed mb-6 flex-1">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-ink-10 flex items-center justify-center shrink-0">
                        <span className="font-mono text-xs text-ink-50">
                          {testimonial.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-ink-80">{testimonial.name}</p>
                        <p className="text-xs text-ink-50">{testimonial.role}, {testimonial.club}</p>
                      </div>
                      {testimonial.featured && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-ink-05 rounded text-[11px] font-medium text-ink-60">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                            <polyline points="16 7 22 7 22 13" />
                          </svg>
                          -7 hcp
                        </div>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── 5. FAQ ─── */}
        <section id="faq" className="w-section-lg bg-ink-05">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Vanlige spørsmål</SectionLabel>
                <h2 className="w-heading-lg mt-4">Ofte stilte spørsmål</h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <div className="max-w-2xl mx-auto">
                <FAQAccordion items={COACHING_FAQ} />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── 6. Final CTA ─── */}
        <section className="w-section-lg bg-ink-90">
          <div className="w-container">
            <RevealOnScroll>
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-xs font-mono uppercase tracking-[0.15em] text-ink-40 mb-4">
                  {FINAL_CTA.eyebrow}
                </p>
                <h2 className="w-heading-lg text-white mb-4">{FINAL_CTA.heading}</h2>
                <p className="text-ink-40 text-lg mb-8">{FINAL_CTA.description}</p>

                <div className="flex flex-wrap gap-4 justify-center mb-8">
                  <Link href="/academy/booking" className="w-btn w-btn-light w-btn-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    {FINAL_CTA.ctaPrimary}
                  </Link>
                  <Link href="/#apply" className="w-btn w-btn-outline-light w-btn-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {FINAL_CTA.ctaSecondary}
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-ink-50">
                  {FINAL_CTA.trustItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      {item.icon === "shield-check" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <polyline points="9 12 12 15 17 10" />
                        </svg>
                      )}
                      {item.icon === "clock" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      )}
                      {item.icon === "credit-card" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="22" height="16" x="1" y="4" rx="2" ry="2" />
                          <line x1="1" x2="23" y1="10" y2="10" />
                        </svg>
                      )}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
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
