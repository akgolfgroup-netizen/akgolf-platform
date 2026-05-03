"use client";

import Image from "next/image";
import { ArrowRight, Mail, Phone, Quote, Star } from "lucide-react";
import { WebNav } from "./web-nav";
import { WebFooter } from "./web-footer";
import { WebButton } from "./web-button";
import { WebPhoto } from "./web-photo";
import { FOUNDER, TEAM, TESTIMONIALS } from "@/lib/website-constants";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function AboutPageClient() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--akgolf-surface, #ECF0EF)",
        color: "var(--akgolf-text, #324D45)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <WebNav />

      {/* HERO */}
      <section
        className="px-10 pb-16 pt-[140px] text-center"
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
            OM AK GOLF GROUP
          </div>
          <h1
            className="mx-auto mb-5 max-w-[18ch] text-[clamp(48px,6.5vw,84px)] font-extrabold leading-[0.98] tracking-[-0.038em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Coaching som{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              gir resultater.
            </em>
          </h1>
          <p className="mx-auto max-w-[56ch] text-[19px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
            Vi bygger en sammenhengende digital reise rundt hver spiller — fra
            første intro til fast handicap-utvikling. Vi måler at du faktisk blir
            bedre, og deler retningen mellom hver coaching-økt.
          </p>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="px-10 py-[100px]" style={{ background: "#fff" }}>
        <div className="mx-auto grid max-w-[1280px] items-center gap-15 md:grid-cols-[1fr_1.2fr]">
          <WebPhoto
            src="/images/team/anders-kristiansen.jpg"
            alt={FOUNDER.name}
            ratio="3-4"
            description={FOUNDER.name}
          />
          <div>
            <div
              className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              GRUNNLEGGER
            </div>
            <h2
              className="mb-5 text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
              style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              {FOUNDER.name}
            </h2>
            <div
              className="mb-6 text-[15px] font-semibold uppercase tracking-[0.10em]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--akgolf-muted, #A5B2AD)",
              }}
            >
              {FOUNDER.title}
            </div>
            <div className="space-y-4 text-[17px] leading-[1.6] text-[var(--akgolf-text,#324D45)]">
              {FOUNDER.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section
        className="px-10 py-[100px]"
        style={{ background: "var(--akgolf-surface, #ECF0EF)" }}
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-15 text-center">
            <div
              className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              VÅRE COACHER
            </div>
            <h2
              className="mx-auto max-w-[24ch] text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
              style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              Trenere som{" "}
              <em
                className="font-medium not-italic"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontStyle: "italic",
                  color: "var(--akgolf-primary, #005840)",
                }}
              >
                går veien
              </em>{" "}
              med deg.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {TEAM.map((coach) => (
              <article
                key={coach.name}
                className="grid grid-cols-[120px_1fr] gap-6 rounded-[24px] border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(10,31,24,0.10)]"
                style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
              >
                <div className="relative h-30 w-30 overflow-hidden rounded-2xl bg-[var(--akgolf-ink,#0A1F18)]">
                  {coach.image ? (
                    <Image
                      src={coach.image}
                      alt={coach.name}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-3xl font-extrabold text-[var(--akgolf-accent,#D1F843)]">
                      {initials(coach.name)}
                    </div>
                  )}
                </div>
                <div>
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--akgolf-primary,#005840)]"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                    }}
                  >
                    {coach.role} · {coach.division}
                  </div>
                  <h3
                    className="mt-1 text-[24px] font-extrabold tracking-[-0.02em] text-[var(--akgolf-ink,#0A1F18)]"
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {coach.name}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
                    {coach.bio}
                  </p>
                  <div className="mt-4 flex flex-col gap-1.5 text-[13px] text-[var(--akgolf-text,#324D45)]">
                    <a
                      href={`mailto:${coach.contact.email}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-[var(--akgolf-primary,#005840)]"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {coach.contact.email}
                    </a>
                    <a
                      href={`tel:${coach.contact.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-[var(--akgolf-primary,#005840)]"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {coach.contact.phone}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {TESTIMONIALS.length > 0 ? (
        <section className="px-10 py-[100px]" style={{ background: "#fff" }}>
          <div className="mx-auto max-w-[960px] text-center">
            <Quote
              className="mx-auto mb-6 h-10 w-10"
              style={{ color: "var(--akgolf-accent, #D1F843)" }}
            />
            <blockquote
              className="mx-auto mb-7 max-w-[40ch] text-[clamp(28px,3.5vw,42px)] font-medium leading-[1.3] tracking-[-0.02em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
              style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              {TESTIMONIALS[0]!.quote}
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center rounded-full text-base font-bold text-white"
                style={{ background: "var(--akgolf-primary, #005840)" }}
              >
                {initials(TESTIMONIALS[0]!.name)}
              </div>
              <div className="text-left">
                <div className="text-[15px] font-bold text-[var(--akgolf-ink,#0A1F18)]">
                  {TESTIMONIALS[0]!.name}
                </div>
                <div
                  className="text-[11px] uppercase tracking-[0.10em] text-[var(--akgolf-muted,#A5B2AD)]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                  }}
                >
                  {TESTIMONIALS[0]!.role} · {TESTIMONIALS[0]!.club}
                </div>
              </div>
              <div
                className="ml-4 flex gap-0.5"
                style={{ color: "var(--akgolf-accent, #D1F843)" }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section
        className="relative overflow-hidden px-10 py-[120px]"
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
            className="mx-auto mb-6 max-w-[18ch] text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            La oss snakke om{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-accent, #D1F843)",
              }}
            >
              dine mål
            </em>
            .
          </h2>
          <p className="mx-auto mb-9 max-w-[50ch] text-[17px] text-white/70">
            Send oss en melding eller ring — vi setter opp et uforpliktende
            møte og finner ut hvilken vei som passer deg.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <WebButton href="/kontakt?v=2" variant="primary" size="lg">
              Kontakt oss
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </WebButton>
            <WebButton href="/booking-v2" variant="ghost" size="lg">
              Book en time
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </WebButton>
          </div>
        </div>
      </section>

      <WebFooter />
    </div>
  );
}
