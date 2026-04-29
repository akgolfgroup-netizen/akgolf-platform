"use client";

import type { LucideIcon } from "lucide-react";
import { Building2, User, Mail, ArrowRight } from "lucide-react";

export function ContactSidebar() {
  return (
    <aside className="flex flex-col gap-[18px]">
      <div
        className="relative overflow-hidden rounded-[28px] px-9 pb-8 pt-9 text-white"
        style={{ background: "var(--akgolf-ink, #0A1F18)" }}
      >
        <div
          className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: "var(--akgolf-accent, #D1F843)",
          }}
        >
          Klar for et intro-møte?
        </div>
        <h3
          className="mb-3 text-[24px] font-extrabold leading-[1.15] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          Book et 30-min{" "}
          <em
            className="font-medium not-italic"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontStyle: "italic",
              color: "var(--akgolf-accent, #D1F843)",
            }}
          >
            uforpliktende
          </em>{" "}
          møte direkte i kalenderen.
        </h3>
        <p
          className="mb-5 text-[14px] leading-[1.6]"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          Snakk med Anders eller Markus om mål, nivå og om Academy passer deg.
          Fysisk på Gamle Fredrikstad GK eller digitalt.
        </p>
        <a
          href="/booking-v2?v=2"
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-bold transition-all hover:-translate-y-px"
          style={{
            background: "var(--akgolf-accent, #D1F843)",
            color: "#0A1F18",
          }}
        >
          Book intro-møte
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </a>
        <div
          className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full"
          style={{ background: "rgba(123,255,107,0.08)" }}
        />
      </div>

      <div
        className="rounded-[22px] border-[1.5px] bg-white px-[30px] py-7"
        style={{ borderColor: "var(--akgolf-line-light, #E4EAE6)" }}
      >
        <InfoRow Icon={Building2} title="AK Golf Group AS">
          Org. nr. 925 884 102
          <br />
          Gamle Fredrikstad GK · Bossum
        </InfoRow>
        <InfoRow Icon={User} title="Hovedcoach">
          Anders Kristiansen
          <br />
          <a
            href="mailto:anders@akgolf.no"
            style={{ color: "var(--akgolf-primary, #005840)" }}
          >
            anders@akgolf.no
          </a>
        </InfoRow>
        <InfoRow Icon={User} title="Coach">
          Markus R. Pedersen
          <br />
          <a
            href="mailto:markus@akgolf.no"
            style={{ color: "var(--akgolf-primary, #005840)" }}
          >
            markus@akgolf.no
          </a>
        </InfoRow>
        <InfoRow Icon={Mail} title="Generelle henvendelser">
          <a
            href="mailto:post@akgolf.no"
            style={{ color: "var(--akgolf-primary, #005840)" }}
          >
            post@akgolf.no
          </a>
        </InfoRow>
      </div>
    </aside>
  );
}

function InfoRow({
  Icon,
  title,
  children,
}: {
  Icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-start gap-3.5 border-b py-3.5 first:pt-0 last:border-b-0 last:pb-0"
      style={{ borderColor: "var(--akgolf-line-light, #E4EAE6)" }}
    >
      <span
        className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
        style={{
          background: "rgba(0,88,64,0.08)",
          color: "var(--akgolf-primary, #005840)",
        }}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div>
        <h5
          className="m-0 mb-1 text-[13px] font-bold tracking-[-0.005em]"
          style={{ color: "var(--akgolf-ink, #0A1F18)" }}
        >
          {title}
        </h5>
        <p
          className="m-0 text-[13px] leading-[1.55]"
          style={{ color: "var(--akgolf-text, #324D45)" }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}
