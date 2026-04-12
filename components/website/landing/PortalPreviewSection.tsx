"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { SectionLabel } from "../SectionLabel";
import { RevealOnScroll } from "../RevealOnScroll";
import { IPhoneMockup } from "@/components/ui/iphone-mockup";
import { PORTAL_PREVIEW_SCREENS, PORTAL_URL } from "@/lib/website-constants";
import Link from "next/link";

export function PortalPreviewSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = PORTAL_PREVIEW_SCREENS[activeIndex];

  return (
    <section className="w-section">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>Spillerportalen</SectionLabel>
        </RevealOnScroll>
        <RevealOnScroll>
          <h2 className="w-heading-lg mt-4 mb-4">
            Din treningspartner mellom oktene
          </h2>
          <p className="text-grey-500 leading-relaxed max-w-2xl mb-12">
            Treningsplaner, statistikk, AI-coaching og TrackMan-data — samlet
            pa ett sted. Inkludert i alle abonnement.
          </p>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Tab navigation + features */}
            <div className="space-y-2">
              {PORTAL_PREVIEW_SCREENS.map((screen, i) => (
                <button
                  key={screen.id}
                  onClick={() => setActiveIndex(i)}
                  className={`w-full text-left rounded-xl p-5 transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-white shadow-card border border-black/6"
                      : "bg-transparent hover:bg-white/60"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold tracking-tight mb-2 transition-colors duration-300 ${
                      i === activeIndex ? "text-black" : "text-grey-400"
                    }`}
                  >
                    {screen.title}
                  </p>
                  {i === activeIndex && (
                    <ul className="space-y-1.5">
                      {screen.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-xs text-text leading-relaxed"
                        >
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              ))}

              <Link
                href={PORTAL_URL}
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary text-white rounded-[20px] text-sm font-semibold hover:bg-primary-alt transition-colors duration-300"
              >
                Oppdag portalen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* iPhone Mockup */}
            <div className="flex justify-center">
              <IPhoneMockup
                width={320}
                imageSrc={active.image}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
