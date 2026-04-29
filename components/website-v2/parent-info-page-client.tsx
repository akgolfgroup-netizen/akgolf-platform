"use client";

import { ArrowRight, Check, MessageSquare, TrendingUp, Users } from "lucide-react";
import { WebNav } from "./web-nav";
import { WebFooter } from "./web-footer";
import { WebButton } from "./web-button";
import { JUNIOR_PARENT_INFO } from "@/lib/website-constants";

const SECTION_ICONS = [Users, TrendingUp, MessageSquare] as const;

export function ParentInfoPageClient() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--akgolf-surface, #ECF0EF)",
        color: "var(--akgolf-text, #324D45)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <WebNav active="junior" />

      {/* HERO */}
      <section
        className="px-10 pb-12 pt-[140px] text-center"
        style={{ background: "var(--akgolf-surface, #ECF0EF)" }}
      >
        <div className="mx-auto max-w-[960px]">
          <div
            className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--akgolf-primary, #005840)",
            }}
          >
            JUNIOR ACADEMY
          </div>
          <h1
            className="mx-auto mb-5 max-w-[20ch] text-[clamp(48px,6.5vw,84px)] font-extrabold leading-[0.98] tracking-[-0.038em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {JUNIOR_PARENT_INFO.heading.replace(" til foreldre", "")}{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              foreldre
            </em>
            .
          </h1>
          <p className="mx-auto max-w-[56ch] text-[19px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
            {JUNIOR_PARENT_INFO.description}
          </p>
        </div>
      </section>

      {/* EXPECTATIONS GRID */}
      <section className="px-10 py-[80px]">
        <div className="mx-auto grid max-w-[1280px] gap-6 md:grid-cols-3">
          {JUNIOR_PARENT_INFO.expectations.map((section, i) => {
            const Icon = SECTION_ICONS[i] ?? Users;
            return (
              <article
                key={section.title}
                className="rounded-[24px] border bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(10,31,24,0.08)]"
                style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
              >
                <div
                  className="mb-5 grid h-12 w-12 place-items-center rounded-xl"
                  style={{
                    background: "rgba(0,88,64,0.10)",
                    color: "var(--akgolf-primary, #005840)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className="mb-4 text-[20px] font-bold tracking-[-0.02em] text-[var(--akgolf-ink,#0A1F18)]"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-[var(--akgolf-text,#324D45)]"
                    >
                      <Check
                        className="mt-1 h-3.5 w-3.5 flex-shrink-0"
                        style={{ color: "var(--akgolf-primary, #005840)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden px-10 py-[100px]"
        style={{ background: "var(--akgolf-ink, #0A1F18)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 30%, rgba(209,248,67,0.12), transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,88,64,0.30), transparent 50%)",
          }}
        />
        <div className="relative z-[2] mx-auto max-w-[1280px] text-center">
          <h2
            className="mx-auto mb-6 max-w-[20ch] text-[clamp(36px,5vw,60px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Spørsmål om{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-accent, #D1F843)",
              }}
            >
              juniortilbudet
            </em>
            ?
          </h2>
          <p className="mx-auto mb-9 max-w-[50ch] text-[17px] text-white/70">
            Send oss en melding eller les mer om Junior Academy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <WebButton href="/junior-academy?v=2" variant="primary" size="lg">
              Se Junior Academy
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </WebButton>
            <WebButton href="/kontakt?v=2" variant="ghost" size="lg">
              Kontakt oss
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </WebButton>
          </div>
        </div>
      </section>

      <WebFooter />
    </div>
  );
}
