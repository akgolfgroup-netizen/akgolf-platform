"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "../SectionLabel";
import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "../RevealOnScroll";
import { DIVISIONS } from "@/lib/website-constants";

const DIVISION_NUMBERS: Record<string, string> = {
  academy: "01",
  junior: "02",
  utvikling: "03",
};

export function DivisionsSection() {
  return (
    <section className="w-section bg-surface">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>Hva vi gjor</SectionLabel>
        </RevealOnScroll>
        <RevealOnScroll>
          <h2 className="w-heading-lg mt-4 mb-4">
            Tre divisjoner. Ett mal.
          </h2>
          <p className="text-grey-500 leading-relaxed max-w-2xl mb-12">
            AK Golf Group utvikler spillere, systemer og klubber
            — med struktur og dokumenterte metoder.
          </p>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DIVISIONS.map((div) => (
            <StaggerItem key={div.id}>
              <Link
                href={div.href}
                className="group relative block bg-white rounded-2xl p-8 md:p-10 shadow-card hover:shadow-card-hover hover:-translate-y-px transition-all duration-300 h-full"
              >
                <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted mb-4">
                  {DIVISION_NUMBERS[div.id] ?? "00"}
                </p>
                <h3 className="text-xl font-bold text-black tracking-tight mb-3">
                  {div.title}
                </h3>
                <p className="text-sm text-text leading-relaxed mb-6">
                  {div.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {div.features.map((f) => (
                    <li
                      key={f}
                      className="text-sm text-grey-500 pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-300">
                  Les mer
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
