"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  CreditCard,
  Calendar,
  Zap,
  ArrowRight,
  ExternalLink,
  XCircle,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/portal/utils/cn";
import { UpgradeOptions } from "@/components/portal/subscription/upgrade-options";
import { getStripePortalUrl } from "./actions";
import type { SubscriptionData } from "./actions";

const TIER_DISPLAY: Record<string, string> = {
  PRO: "Performance Pro",
  STARTER: "Performance",
  ACADEMY: "Academy",
  ELITE: "Elite",
  VISITOR: "Ingen abonnement",
};

const TIER_PRICE: Record<string, string> = {
  PRO: "2 000 kr/mnd",
  STARTER: "1 600 kr/mnd",
  ACADEMY: "900 kr/mnd",
  ELITE: "",
  VISITOR: "",
};

interface AbonnementClientProps {
  data: SubscriptionData;
}

export default function AbonnementClient({ data }: AbonnementClientProps) {
  const { user, quota, upcomingBookings } = data;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const tierName = TIER_DISPLAY[user.tier] ?? user.tier;
  const tierPrice = TIER_PRICE[user.tier] ?? "";
  const hasActivePlan = user.tier !== "VISITOR";

  function handleStripePortal() {
    setError(null);
    startTransition(async () => {
      const url = await getStripePortalUrl();
      if (url) {
        window.location.href = url;
      } else {
        setError(
          "Kunne ikke åpne abonnementsportalen. Kontakt oss for hjelp."
        );
      }
    });
  }

  const periodEndFormatted =
    quota?.periodEnd
      ? format(new Date(quota.periodEnd), "d. MMMM yyyy", { locale: nb })
      : null;

  const expiresAtFormatted =
    user.expiresAt
      ? format(new Date(user.expiresAt), "d. MMMM yyyy", { locale: nb })
      : null;

  const sessionPercent =
    quota && quota.sessionsAllowed > 0
      ? Math.min(
          Math.round((quota.sessionsUsed / quota.sessionsAllowed) * 100),
          100
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Abonnement
        </h1>
        <p className="text-[var(--color-muted)] mt-1">
          Oversikt over ditt abonnement og kvoter
        </p>
      </div>

      {hasActivePlan ? (
        <>
          {/* Plan card */}
          <div className="bg-white rounded-2xl border border-[var(--color-primary)]/10 overflow-hidden">
            {/* Top bar */}
            <div className="bg-[var(--color-primary)] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-white/80" />
                <span className="text-white font-semibold">{tierName}</span>
              </div>
              <span className="text-white/70 text-sm font-medium">
                {tierPrice}
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Session quota */}
              {quota ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[var(--color-primary)]" />
                      <span className="text-sm font-semibold text-[var(--color-text)]">
                        Økter denne perioden
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-text)]">
                      {quota.sessionsUsed} / {quota.sessionsAllowed}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[var(--color-surface)] rounded-full h-2.5">
                    <div
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-500",
                        sessionPercent >= 90
                          ? "bg-[var(--color-error)]"
                          : sessionPercent >= 70
                          ? "bg-[var(--color-warning,#C48A32)]"
                          : "bg-[var(--color-success)]"
                      )}
                      style={{ width: `${sessionPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                    <span>{quota.sessionsRemaining} gjenværende</span>
                    {periodEndFormatted && (
                      <span>Perioden avsluttes {periodEndFormatted}</span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--color-muted)]">
                  Kvoter er ikke satt opp for dette abonnementet ennå.
                </p>
              )}

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-surface)]">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[var(--color-muted)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--color-muted)] font-medium uppercase tracking-wide">
                      Kommende bookinger
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text)] mt-0.5">
                      {upcomingBookings}{" "}
                      {upcomingBookings === 1 ? "økt" : "økter"}
                    </p>
                  </div>
                </div>

                {expiresAtFormatted && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-[var(--color-muted)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--color-muted)] font-medium uppercase tracking-wide">
                        Utløper
                      </p>
                      <p className="text-sm font-semibold text-[var(--color-text)] mt-0.5">
                        {expiresAtFormatted}
                      </p>
                    </div>
                  </div>
                )}

                {quota?.bookingWindowDays ? (
                  <div className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-[var(--color-muted)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--color-muted)] font-medium uppercase tracking-wide">
                        Bookingsvindu
                      </p>
                      <p className="text-sm font-semibold text-[var(--color-text)] mt-0.5">
                        {quota.bookingWindowDays} dager fremover
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Handlinger */}
              <div className="pt-2 flex flex-wrap gap-3">
                {/* Oppgrader-knapp (vis kun hvis ikke allerede på PRO/ELITE) */}
                {user.tier !== "PRO" && user.tier !== "ELITE" && (
                  <button
                    onClick={handleStripePortal}
                    disabled={isPending}
                    className={cn(
                      "inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] text-sm font-semibold transition-all",
                      "bg-accent-cta text-accent-cta-text",
                      "hover:brightness-95 active:scale-[0.98]",
                      isPending && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <ChevronUp className="w-4 h-4" />
                    {isPending ? "Åpner…" : "Oppgrader abonnement"}
                  </button>
                )}

                {/* Administrer i Stripe */}
                {user.hasStripeSubscription && (
                  <button
                    onClick={handleStripePortal}
                    disabled={isPending}
                    className={cn(
                      "inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] text-sm font-medium transition-all",
                      "border border-grey-200 text-text",
                      "hover:bg-grey-50 active:scale-[0.98]",
                      isPending && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Administrer i Stripe
                  </button>
                )}
              </div>

              {/* Kansellerings-seksjon */}
              {user.hasStripeSubscription && (
                <div className="pt-4 mt-2 border-t border-grey-200">
                  {error && (
                    <p className="text-sm text-error mb-3">{error}</p>
                  )}
                  <button
                    onClick={handleStripePortal}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-error transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Avbryt abonnement
                  </button>
                  <p className="text-[10px] text-muted mt-1">
                    Du sendes til Stripe der du kan endre, pause eller avbryte.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tilgjengelige oppgraderinger */}
          <UpgradeOptions
            currentTier={user.tier}
            onUpgrade={handleStripePortal}
            isPending={isPending}
          />

          {/* Booking shortcut */}
          <div className="bg-white rounded-2xl border border-primary/10 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  Book en økt
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  Planlegg din neste coaching-time
                </p>
              </div>
            </div>
            <Link
              href="/portal/bookinger/ny"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline shrink-0"
            >
              Book nå
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      ) : (
        /* No subscription — upsell card */
        <div className="bg-white rounded-2xl border border-[var(--color-primary)]/10 overflow-hidden">
          <div className="bg-[var(--color-surface)] px-6 py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">
              Du har ikke et aktivt abonnement
            </h2>
            <p className="text-sm text-[var(--color-muted)] max-w-sm mx-auto mb-6">
              Med Performance-abonnementet får du regelmessig coaching, personlig
              treningsplan og tilgang til alle verktøy i portalen.
            </p>
            <Link
              href="/booking"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all",
                "bg-[var(--color-accent-cta)] text-[var(--color-accent-cta-text)]",
                "hover:brightness-95 active:scale-[0.98]"
              )}
            >
              Oppgrader til Performance
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[var(--color-surface)]">
            {[
              {
                label: "Performance",
                price: "1 600 kr/mnd",
                desc: "2 x 20 min per uke",
              },
              {
                label: "Performance Pro",
                price: "2 000 kr/mnd",
                desc: "4 x 20 min per uke",
              },
              {
                label: "Gruppe",
                price: "900 kr/mnd",
                desc: "2 x 60 min gruppeøkt",
              },
            ].map((plan) => (
              <div
                key={plan.label}
                className="text-center p-4 rounded-xl bg-[var(--color-surface)]"
              >
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {plan.label}
                </p>
                <p className="text-base font-bold text-[var(--color-primary)] mt-1">
                  {plan.price}
                </p>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">
                  {plan.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
