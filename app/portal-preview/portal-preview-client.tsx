"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DeviceMockup } from "@/components/website/DeviceMockup";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { SectionLabel } from "@/components/website/SectionLabel";
import { PORTAL_PREVIEW_SCREENS, BOOKING_URL } from "@/lib/website-constants";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

type ScreenId = typeof PORTAL_PREVIEW_SCREENS[number]["id"];

export function PortalPreviewClient() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(PORTAL_PREVIEW_SCREENS[0].id);
  const currentScreen = PORTAL_PREVIEW_SCREENS.find((s) => s.id === activeScreen) || PORTAL_PREVIEW_SCREENS[0];

  return (
    <div className="bg-grey-100">
      {/* Breadcrumb */}
      <div className="w-container pt-32 pb-4">
        <nav className="text-sm text-grey-500">
          <Link href="/" className="hover:text-black transition-colors">
            Hjem
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black">Spillerportalen</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="w-container">
          <RevealOnScroll>
            <div className="text-center max-w-2xl mx-auto">
              <SectionLabel>Spillerportalen</SectionLabel>
              <h1 className="w-heading-lg mt-5">
                Alt du trenger for strukturert trening
              </h1>
              <p className="text-grey-500 mt-4 text-lg">
                Spillerportalen gir deg treningsplan, statistikk og AI-innsikt — alt samlet ett sted.
                Inkludert i alle coaching-abonnement.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="w-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Device Mockup */}
            <RevealOnScroll direction="left">
              <div className="lg:sticky lg:top-32">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScreen}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DeviceMockup
                      imageSrc={currentScreen.image}
                      alt={`${currentScreen.title} - AK Golf spillerportal`}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </RevealOnScroll>

            {/* Tabs and Features */}
            <RevealOnScroll direction="right" delay={0.1}>
              <div>
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-10">
                  {PORTAL_PREVIEW_SCREENS.map((screen) => (
                    <button
                      key={screen.id}
                      onClick={() => setActiveScreen(screen.id)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                        activeScreen === screen.id
                          ? "bg-black text-white"
                          : "bg-grey-100 text-grey-600 hover:bg-grey-200"
                      }`}
                    >
                      {screen.title}
                    </button>
                  ))}
                </div>

                {/* Feature List */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScreen}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold text-black mb-6">
                      {currentScreen.title}
                    </h2>
                    <ul className="space-y-4 mb-10">
                      {currentScreen.features.map((feature, index) => (
                        <li key={index} className="flex gap-3">
                          <CheckIcon className="text-black mt-0.5 shrink-0" />
                          <span className="text-grey-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>

                {/* All Features Grid */}
                <div className="border-t border-grey-200 pt-10">
                  <h3 className="text-sm font-semibold text-grey-500 uppercase tracking-wide mb-6">
                    Alle funksjoner
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Personlig treningsplan",
                      "Handicap-tracking",
                      "Strokes Gained-analyse",
                      "Coaching-notater",
                      "AI-anbefalinger",
                      "TrackMan-data",
                      "Treningsdagbok",
                      "Booking-oversikt",
                    ].map((feature) => (
                      <div key={feature} className="flex gap-2 items-center">
                        <CheckIcon className="text-grey-400 shrink-0" />
                        <span className="text-sm text-grey-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-grey-100">
        <div className="w-container">
          <RevealOnScroll>
            <div className="text-center max-w-xl mx-auto">
              <h2 className="w-heading-md mb-4">
                Klar for strukturert trening?
              </h2>
              <p className="text-grey-500 mb-8">
                Spillerportalen er inkludert i alle coaching-abonnement. Book din første time i dag.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={BOOKING_URL} className="w-btn w-btn-primary">
                  Book coaching
                </Link>
                <Link href="/#priser" className="w-btn w-btn-secondary">
                  Se priser
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
