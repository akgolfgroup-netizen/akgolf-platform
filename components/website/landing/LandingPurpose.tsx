"use client";

import Link from "next/link";
import { ArrowUpRight, Target, Users, Code } from "lucide-react";
import { SectionLabel } from "@/components/website/SectionLabel";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/website/RevealOnScroll";
import { DIVISIONS } from "@/lib/website-constants";

const ICONS: Record<string, typeof Target> = {
  academy: Target,
  junior: Users,
  utvikling: Code,
};

export function LandingPurpose() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-center mb-16">
          <SectionLabel>Hva vi gjor</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-grey-900)] mt-4">
            <span className="font-light text-[var(--color-muted)]">Tre satsinger.</span>{" "}
            Ett mal.
          </h2>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DIVISIONS.map((div) => {
            const Icon = ICONS[div.id] ?? Target;
            return (
              <StaggerItem key={div.id}>
                <Link
                  href={div.href}
                  className="group block h-full rounded-2xl border border-[var(--color-grey-200)] bg-white p-8 transition-all duration-300 hover:border-[var(--color-grey-300)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      background: "var(--color-primary)",
                      color: "white",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title + arrow */}
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-[var(--color-grey-900)]">
                      {div.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-[var(--color-text)] mb-5">
                    {div.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {div.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-xs text-[var(--color-muted)]"
                      >
                        <span
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ background: "var(--color-primary)" }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
