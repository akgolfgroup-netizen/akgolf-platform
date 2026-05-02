"use client";

import Link from "next/link";
import { Sparkles, MessageCircle, Calendar, Target } from "lucide-react";

interface EmptyStateProps {
  userName: string | null;
}

export function MinPlanEmptyState({ userName }: EmptyStateProps) {
  const firstName = userName?.split(" ")[0] ?? null;

  return (
    <div className="-m-4 lg:-m-8 -mt-18 lg:-mt-8 min-h-[calc(100vh-1rem)] bg-[#0A1F18] text-white">
      <div className="mx-auto w-full max-w-[1200px] space-y-6 px-5 py-8 pb-12 pt-22 lg:px-10 lg:py-10 lg:pt-10">
        {/* Header */}
        <div>
          <div
            className="font-mono text-[10px] font-semibold uppercase"
            style={{ color: "#D1F843", letterSpacing: "0.18em" }}
          >
            / Spill · Min plan
          </div>
          <h1
            className="mt-2 text-3xl lg:text-4xl font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
          >
            Min plan
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Hei{firstName ? `, ${firstName}` : ""} — vi setter opp planen din.
          </p>
        </div>

        {/* Hovedkort: hva som skjer */}
        <div
          className="rounded-2xl p-8 lg:p-10"
          style={{
            background: "#0D2E23",
            border: "1px solid #1A4A3A",
          }}
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            <div
              className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(209,248,67,0.12)" }}
            >
              <Sparkles className="w-6 h-6" style={{ color: "#D1F843" }} />
            </div>
            <div className="flex-1">
              <h2
                className="text-xl lg:text-2xl font-bold tracking-tight text-white mb-2"
                style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
              >
                Coachen din lager prognosen din nå
              </h2>
              <p className="text-sm leading-relaxed text-white/70 max-w-xl mb-6">
                Når coachen din har gjennomgått dataene dine, ser du målet ditt,
                anslått tidsbruk og sannsynligheten for å nå det her. Det tar
                vanligvis 1–3 dager etter første økt.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/portal/meldinger"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all"
                  style={{
                    background: "#D1F843",
                    color: "#0A1F18",
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Send melding til coach
                </Link>
                <Link
                  href="/portal/bookinger/ny"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  Book oppstartsøkt
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hva du kan gjøre i mellomtiden */}
        <div>
          <p
            className="font-mono text-[10px] font-semibold uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.18em" }}
          >
            / Mens du venter
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                icon: Target,
                title: "Sett dine mål",
                text: "Fortell oss hva du jobber mot i sesongen.",
                href: "/portal/profil/innstillinger",
              },
              {
                icon: Calendar,
                title: "Logg første runde",
                text: "Få Strokes Gained-statistikk fra start.",
                href: "/portal/runde",
              },
              {
                icon: Sparkles,
                title: "Utforsk treningsbank",
                text: "Se hvilke øvelser coachen velger fra.",
                href: "/portal/treningsplan",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl p-5 transition-all hover:translate-y-[-2px]"
                style={{
                  background: "#0D2E23",
                  border: "1px solid #1A4A3A",
                }}
              >
                <item.icon
                  className="w-5 h-5 mb-3"
                  style={{ color: "#D1F843" }}
                />
                <div
                  className="font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
                >
                  {item.title}
                </div>
                <div className="text-xs text-white/60 leading-relaxed">
                  {item.text}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
