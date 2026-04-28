"use client";

import Link from "next/link";
import {
  Target,
  CheckSquare,
  Users,
  MessageCircle,
  Calendar,
  Package,
  CreditCard,
  BarChart3,
  Plus,
  UserPlus,
  Layers,
  FileDown,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface Module {
  href: string;
  icon: LucideIcon;
  title: string;
  sub: string;
  badge?: { label: string; tone?: "accent" | "warn" };
}

const MODULES: Module[] = [
  {
    href: "/admin",
    icon: Target,
    title: "Dagens fokus",
    sub: "Prioriterte oppgaver + dagsplan",
  },
  {
    href: "/admin/godkjenninger",
    icon: CheckSquare,
    title: "Godkjenninger",
    sub: "Bookinger og refusjoner som krever deg",
    badge: { label: "Venter", tone: "warn" },
  },
  {
    href: "/admin/elever",
    icon: Users,
    title: "Spillere",
    sub: "Aktive spillere · medlemskap · coaching-historikk",
  },
  {
    href: "/admin/meldinger",
    icon: MessageCircle,
    title: "Meldinger",
    sub: "Samtaler med spillere og foreldre",
  },
  {
    href: "/admin/kalender",
    icon: Calendar,
    title: "Kalender",
    sub: "Ukens økter og belegg",
  },
  {
    href: "/admin/tjenester",
    icon: Package,
    title: "Tjenester",
    sub: "Pakker, abo, drop-in og camp",
  },
  {
    href: "/admin/okonomi",
    icon: CreditCard,
    title: "Økonomi",
    sub: "Måneds-omsetning og fakturaer",
  },
  {
    href: "/admin/analytics",
    icon: BarChart3,
    title: "Rapporter",
    sub: "Coach-effekt og 12-mnd snitt-HCP",
  },
];

const QUICK_ACTIONS: Array<{
  href: string;
  icon: LucideIcon;
  label: string;
  meta: string;
}> = [
  { href: "/admin/bookinger/ny", icon: Plus, label: "Ny booking", meta: "CMD + B" },
  { href: "/admin/elever", icon: UserPlus, label: "Ny spiller", meta: "+ INVITE" },
  {
    href: "/admin/treningsplan",
    icon: Layers,
    label: "Bygg treningsplan",
    meta: "FOR EN SPILLER",
  },
  {
    href: "/admin/meldinger",
    icon: MessageCircle,
    label: "Send melding",
    meta: "TIL KOHORT",
  },
  {
    href: "/admin/rapporter",
    icon: FileDown,
    label: "Eksport · måneds-PDF",
    meta: "TIL STYRET",
  },
  {
    href: "/admin/ai-assistent",
    icon: Sparkles,
    label: "Spør AI Coach",
    meta: "«HVEM TRENGER OPPFØLG?»",
  },
];

export function HubClient({ userName }: { userName: string }) {
  return (
    <div className="space-y-6">
      <section
        className="rounded-2xl p-7 grid items-center gap-7 md:grid-cols-[1.4fr_1fr]"
        style={{
          background:
            "linear-gradient(160deg, rgba(209,248,67,0.08), rgba(13,46,35,0)), #0D2E23",
          border: "1.5px solid rgba(209,248,67,0.25)",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#D1F843",
              fontWeight: 700,
            }}
          >
            / HUB · ALL DRIFT EN PLASS
          </div>
          <h2
            className="mt-1.5 text-[28px] font-extrabold tracking-[-0.025em]"
            style={{ color: "#FFFFFF" }}
          >
            God morgen, {userName}.{" "}
            <em className="not-italic" style={{ color: "#D1F843" }}>
              Tett dag foran deg.
            </em>
          </h2>
          <p
            className="mt-3.5 text-[14px] leading-[1.6] max-w-[55ch]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Her er kontrollen din. Klikk en modul nedenfor for å gå rett dit du
            trenger — eller bruk hurtighandlinger til høyre.
          </p>
        </div>
      </section>

      <section className="grid gap-3.5 md:grid-cols-4">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="relative rounded-xl p-5 transition hover:-translate-y-0.5"
              style={{
                background: "#0D2E23",
                border: "1px solid #1a4a3a",
              }}
            >
              {m.badge && (
                <span
                  className="absolute top-3.5 right-3.5 rounded text-[9.5px] font-bold tracking-[0.06em] uppercase px-1.5 py-0.5"
                  style={{
                    background:
                      m.badge.tone === "warn"
                        ? "rgba(232,185,103,0.18)"
                        : "rgba(209,248,67,0.15)",
                    color: m.badge.tone === "warn" ? "#E8B967" : "#D1F843",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {m.badge.label}
                </span>
              )}
              <div
                className="w-10 h-10 rounded-[10px] grid place-items-center mb-3.5"
                style={{
                  background: "rgba(209,248,67,0.15)",
                  color: "#D1F843",
                }}
              >
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div className="text-[14px] font-bold" style={{ color: "#FFFFFF" }}>
                {m.title}
              </div>
              <div
                className="text-[12px] mt-1 leading-[1.5]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {m.sub}
              </div>
            </Link>
          );
        })}
      </section>

      <section
        className="rounded-xl p-5"
        style={{
          background: "#0D2E23",
          border: "1px solid #1a4a3a",
        }}
      >
        <h3
          className="text-[15px] font-bold mb-3.5 flex items-center justify-between"
          style={{ color: "#FFFFFF" }}
        >
          <span>Hurtighandlinger</span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            SHORTCUTS
          </span>
        </h3>
        <div className="grid gap-2.5 md:grid-cols-2">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 rounded-[10px] px-4 py-3.5 transition"
                style={{ background: "rgba(0,0,0,0.20)" }}
              >
                <span
                  className="w-8 h-8 rounded-[7px] grid place-items-center"
                  style={{ background: "rgba(209,248,67,0.15)", color: "#D1F843" }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1">
                  <span
                    className="block text-[13px] font-semibold"
                    style={{ color: "#FFFFFF" }}
                  >
                    {a.label}
                  </span>
                  <span
                    className="block mt-0.5"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {a.meta}
                  </span>
                </span>
                <ArrowRight
                  className="w-3.5 h-3.5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
