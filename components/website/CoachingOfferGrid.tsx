"use client";

import Image from "next/image";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "./RevealOnScroll";
import { SectionLabel } from "./SectionLabel";
import { COACHING_OFFERS } from "@/lib/website-constants";

export function CoachingOfferGrid() {
  return (
    <section id="packages" className="py-28 md:py-40 bg-white">
      <div className="w-container">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <SectionLabel>Coaching-pakker</SectionLabel>
            <h2 className="w-heading-lg mt-5">Velg ditt nivå</h2>
            <p className="text-[#6E6E73] max-w-xl mx-auto mt-5 text-lg leading-relaxed">
              Alle pakker inkluderer TrackMan-analyse, treningsplan og full portaltilgang. Ingen binding.
            </p>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {COACHING_OFFERS.map((offer) => (
            <StaggerItem key={offer.title}>
              <a
                href={offer.href}
                className="group block bg-white rounded-[20px] border border-[#E8E8ED] overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {"highlighted" in offer && offer.highlighted && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#2D6A4F] text-white text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                        Mest populær
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-[#1D1D1F] mb-2">{offer.title}</h3>
                  <p className="text-sm text-[#6E6E73] leading-relaxed mb-4">{offer.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold text-[#1D1D1F]">{offer.price}</span>
                    <span className="text-sm text-[#86868B]">{offer.period}</span>
                  </div>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
