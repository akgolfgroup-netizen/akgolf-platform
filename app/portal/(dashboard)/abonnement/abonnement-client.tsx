"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";
import Link from "next/link";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/portal/utils/cn";
import { UpgradeOptions } from "@/components/portal/subscription/upgrade-options";
import { getStripePortalUrl } from "./actions";
import type { SubscriptionData } from "./actions";
import { MonoLabel, NightSurface, BentoCard, BentoGrid } from "@/components/portal/patterns";

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
    <section className="space-y-6">
      {/* Header */}
      <header>
        <MonoLabel size="xs" uppercase className="text-on-surface-variant block mb-2">
          Ditt abonnement
        </MonoLabel>
        <h1 className="text-2xl font-bold text-on-surface">Abonnement</h1>
        <p className="text-on-surface-variant mt-1">
          Oversikt over din plan, kvoter og bookinger
        </p>
      </header>

      {hasActivePlan ? (
        <>
          {/* Hero — NightSurface med tier + pris */}
          <NightSurface variant="ambient" className="rounded-2xl p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-px w-6 bg-surface-container-lowest/40" />
              <MonoLabel size="xs" uppercase className="text-surface/60">
                Aktiv plan
              </MonoLabel>
            </div>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/10 px-3 py-1">
                  <Icon name="credit_card" className="h-3.5 w-3.5 text-surface/70" />
                  <MonoLabel size="xs" uppercase className="text-surface/70">
                    {user.tier}
                  </MonoLabel>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-surface">
                  {tierName}
                </h2>
                {tierPrice && (
                  <MonoLabel size="lg" className="mt-2 block text-secondary-fixed">
                    {tierPrice}
                  </MonoLabel>
                )}
              </div>
              {quota && quota.sessionsAllowed > 0 && (
                <div className="flex flex-col items-start gap-1 md:items-end">
                  <MonoLabel size="xs" uppercase className="text-surface/50">
                    Brukt denne perioden
                  </MonoLabel>
                  <MonoLabel size="lg" className="text-surface">
                    {quota.sessionsUsed} / {quota.sessionsAllowed}
                  </MonoLabel>
                  {periodEndFormatted && (
                    <MonoLabel size="xs" className="text-surface/50">
                      Perioden avsluttes {periodEndFormatted}
                    </MonoLabel>
                  )}
                </div>
              )}
            </div>
          </NightSurface>

          {/* Plan detalj-kort */}
          <BentoCard variant="light" padding="lg">
            <div className="space-y-6">
              {/* Session quota */}
              {quota ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="bolt" className="h-4 w-4 text-success" />
                      <span className="text-sm font-semibold text-on-surface">
                        Økter denne perioden
                      </span>
                    </div>
                    <MonoLabel size="md" className="font-bold text-on-surface">
                      {quota.sessionsUsed} / {quota.sessionsAllowed}
                    </MonoLabel>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2.5 w-full rounded-full bg-surface">
                    <div
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-500",
                        sessionPercent >= 90
                          ? "bg-error"
                          : sessionPercent >= 70
                            ? "bg-warning"
                            : "bg-success"
                      )}
                      style={{ width: `${sessionPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <MonoLabel size="xs" className="text-on-surface-variant/80">
                      {quota.sessionsRemaining} gjenværende
                    </MonoLabel>
                    {periodEndFormatted && (
                      <span>Perioden avsluttes {periodEndFormatted}</span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">
                  Kvoter er ikke satt opp for dette abonnementet ennå.
                </p>
              )}

              {/* Info grid */}
              <div className="grid grid-cols-1 gap-4 border-t border-outline-variant/30 pt-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Icon name="calendar_today" className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-variant" />
                  <div>
                    <MonoLabel size="xs" uppercase className="block text-on-surface-variant">
                      Kommende bookinger
                    </MonoLabel>
                    <MonoLabel size="md" className="mt-0.5 font-semibold text-on-surface">
                      {upcomingBookings}{" "}
                      {upcomingBookings === 1 ? "økt" : "økter"}
                    </MonoLabel>
                  </div>
                </div>

                {expiresAtFormatted && (
                  <div className="flex items-start gap-3">
                    <Icon name="calendar_today" className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-variant" />
                    <div>
                      <MonoLabel size="xs" uppercase className="block text-on-surface-variant">
                        Utløper
                      </MonoLabel>
                      <p className="mt-0.5 text-sm font-semibold text-on-surface">
                        {expiresAtFormatted}
                      </p>
                    </div>
                  </div>
                )}

                {quota?.bookingWindowDays ? (
                  <div className="flex items-start gap-3">
                    <Icon name="bolt" className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-variant" />
                    <div>
                      <MonoLabel size="xs" uppercase className="block text-on-surface-variant">
                        Bookingsvindu
                      </MonoLabel>
                      <MonoLabel size="md" className="mt-0.5 font-semibold text-on-surface">
                        {quota.bookingWindowDays} dager fremover
                      </MonoLabel>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Handlinger */}
              <div className="flex flex-wrap gap-3 pt-2">
                {user.tier !== "PRO" && user.tier !== "ELITE" && (
                  <button
                    onClick={handleStripePortal}
                    disabled={isPending}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
                      "bg-secondary-fixed text-secondary-fixed-text",
                      "hover:brightness-95 active:scale-[0.98]",
                      isPending && "cursor-not-allowed opacity-60"
                    )}
                  >
                    <Icon name="expand_less" className="h-4 w-4" />
                    {isPending ? "Åpner…" : "Oppgrader abonnement"}
                  </button>
                )}

                {user.hasStripeSubscription && (
                  <button
                    onClick={handleStripePortal}
                    disabled={isPending}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                      "border border-outline-variant/30 bg-surface-container-lowest text-on-surface",
                      "hover:border-outline-variant/50 active:scale-[0.98]",
                      isPending && "cursor-not-allowed opacity-60"
                    )}
                  >
                    <Icon name="open_in_new" className="h-4 w-4" />
                    Administrer i Stripe
                  </button>
                )}
              </div>

              {/* Kansellerings-seksjon */}
              {user.hasStripeSubscription && (
                <div className="mt-2 border-t border-outline-variant/30 pt-4">
                  {error && (
                    <p className="mb-3 text-sm text-error">{error}</p>
                  )}
                  <button
                    onClick={handleStripePortal}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    <Icon name="close" className="h-3.5 w-3.5" />
                    Avbryt abonnement
                  </button>
                  <p className="mt-1 text-[10px] text-on-surface-variant">
                    Du sendes til Stripe der du kan endre, pause eller avbryte.
                  </p>
                </div>
              )}
            </div>
          </BentoCard>

          {/* Tilgjengelige oppgraderinger */}
          <UpgradeOptions
            currentTier={user.tier}
            onUpgrade={handleStripePortal}
            isPending={isPending}
          />

          {/* Booking shortcut */}
          <BentoCard variant="light" padding="lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface">
                  <Icon name="calendar_today" className="h-5 w-5 text-on-surface" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Book en økt
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Planlegg din neste coaching-time
                  </p>
                </div>
              </div>
              <Link
                href="/portal/bookinger/ny"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-on-surface hover:underline"
              >
                Book nå
                <Icon name="arrow_forward" className="h-4 w-4" />
              </Link>
            </div>
          </BentoCard>
        </>
      ) : (
        /* No subscription — upsell card */
        <>
          <NightSurface variant="ambient" className="rounded-2xl p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-fixed/20">
              <Icon name="bolt" className="h-7 w-7 text-secondary-fixed" />
            </div>
            <MonoLabel size="xs" uppercase className="mb-2 block text-surface/50">
              Ingen aktiv plan
            </MonoLabel>
            <h2 className="mb-2 text-2xl font-bold text-surface">
              Du har ikke et aktivt abonnement
            </h2>
            <p className="mx-auto mb-6 max-w-sm text-sm text-surface/60">
              Med Performance-abonnementet får du regelmessig coaching, personlig
              treningsplan og tilgang til alle verktøy i portalen.
            </p>
            <Link
              href="/booking"
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all",
                "bg-secondary-fixed text-secondary-fixed-text",
                "hover:brightness-95 active:scale-[0.98]"
              )}
            >
              Oppgrader til Performance
              <Icon name="arrow_forward" className="h-4 w-4" />
            </Link>
          </NightSurface>

          <BentoGrid cols={3} gap="md">
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
              <BentoCard
                key={plan.label}
                variant="light"
                padding="md"
                className="text-center"
              >
                <MonoLabel size="xs" uppercase className="block text-on-surface-variant">
                  {plan.label}
                </MonoLabel>
                <MonoLabel size="lg" className="mt-2 block font-bold text-on-surface">
                  {plan.price}
                </MonoLabel>
                <p className="mt-1 text-xs text-on-surface-variant">{plan.desc}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </>
      )}
    </section>
  );
}
