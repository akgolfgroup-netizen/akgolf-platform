"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";

interface OnboardingBannerProps {
  /** Mangler HCP eller klubb */
  needsGolfId: boolean;
  /** Coach er ikke tildelt enda */
  needsCoach: boolean;
  /** Onboarding er ikke fullfort (onboardingCompletedAt er null) */
  needsOnboarding: boolean;
}

/**
 * Onboarding-banner — vises pa Hjem nar viktige profil-felter mangler.
 *
 * Auto-skjules hvis alt er pa plass. Bruker kan dismisse via X (lokal
 * state, vises igjen ved neste reload — bevisst valg slik at viktige
 * mangler ikke blir oversett).
 */
export function OnboardingBanner({
  needsGolfId,
  needsCoach,
  needsOnboarding,
}: OnboardingBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (!needsGolfId && !needsCoach && !needsOnboarding) return null;

  // Prioriter mest kritisk forst
  let title: string;
  let body: string;
  let cta: string;
  let href: string;

  if (needsOnboarding) {
    title = "Velkommen til AK Golf!";
    body =
      "Bruk 2 minutter på å fullføre profilen din slik at vi kan lage en personlig plan.";
    cta = "Fullfør onboarding";
    href = "/portal/onboarding";
  } else if (needsGolfId) {
    title = "Sett opp golf-profilen din";
    body =
      "Legg inn handicap og klubb slik at coachen din kan tilpasse treningen.";
    cta = "Legg til HCP og klubb";
    href = "/portal/profil/innstillinger";
  } else {
    title = "Du venter på coach-tildeling";
    body =
      "Anders kontakter deg innen 24 timer. I mellomtiden kan du utforske portalen.";
    cta = "Send melding";
    href = "/portal/meldinger";
  }

  return (
    <div
      className="col-span-12 relative overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary, #005840) 0%, var(--color-primary-deep, #003B2A) 100%)",
      }}
    >
      {/* Accent-glow */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent, #D1F843) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <div
          className="hidden sm:flex shrink-0 w-11 h-11 rounded-xl items-center justify-center"
          style={{ background: "rgba(209,248,67,0.16)" }}
        >
          <Sparkles
            className="w-5 h-5"
            style={{ color: "var(--color-accent, #D1F843)" }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] mb-1"
            style={{ color: "var(--color-accent, #D1F843)" }}
          >
            / Onboarding
          </div>
          <h3
            className="text-base sm:text-lg font-bold tracking-tight text-white mb-1"
            style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
          >
            {title}
          </h3>
          <p className="text-sm text-white/75 mb-3 sm:mb-4">{body}</p>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all hover:translate-x-0.5"
            style={{
              background: "var(--color-accent, #D1F843)",
              color: "var(--color-ink, #0A1F18)",
            }}
          >
            {cta}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Lukk banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
