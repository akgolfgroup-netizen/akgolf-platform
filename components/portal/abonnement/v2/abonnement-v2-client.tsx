"use client";

import { useState, useTransition } from "react";
import { Check, LifeBuoy, Mail, Pause, XCircle } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import type { SubscriptionData } from "@/app/portal/(dashboard)/abonnement/actions";
import { getStripePortalUrl } from "@/app/portal/(dashboard)/abonnement/actions";
import { PlanHeroCard } from "./plan-hero-card";
import { QuotaCard } from "./quota-card";
import { TierSwitch } from "./tier-switch";
import { InfoCard } from "./info-card";
import { NoPlanView } from "./no-plan-view";
import {
  ALL_TIERS,
  TIER_DISPLAY,
  TIER_FEATURES,
  TIER_PRICE_NUM,
  formatKr,
} from "./tier-data";

interface AbonnementV2ClientProps {
  data: SubscriptionData;
}

export function AbonnementV2Client({ data }: AbonnementV2ClientProps) {
  const { user, quota, upcomingBookings } = data;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const tier = TIER_DISPLAY[user.tier] ?? { name: user.tier };
  const hasActivePlan = user.tier !== "VISITOR";
  const priceNum = TIER_PRICE_NUM[user.tier] ?? 0;

  function handleStripePortal() {
    setError(null);
    startTransition(async () => {
      const url = await getStripePortalUrl();
      if (url) {
        window.location.href = url;
      } else {
        setError(
          "Kunne ikke åpne abonnementsportalen. Kontakt oss for hjelp.",
        );
      }
    });
  }

  if (!hasActivePlan) {
    return <NoPlanView currentTier={user.tier} onUpgrade={handleStripePortal} />;
  }

  const periodEndFormatted = quota?.periodEnd
    ? format(new Date(quota.periodEnd), "d. MMMM yyyy", { locale: nb })
    : null;

  const expiresAtFormatted = user.expiresAt
    ? format(new Date(user.expiresAt), "d. MMMM yyyy", { locale: nb })
    : null;

  const sessionsRemaining = quota?.sessionsRemaining ?? 0;
  const periodLabel = periodEndFormatted
    ? `Periode til ${periodEndFormatted}`
    : "Inneværende periode";

  const tierOptions = ALL_TIERS.map((t) => ({
    ...t,
    current: t.key === user.tier,
  }));

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5 pb-12">
      <header className="space-y-2">
        <div
          className="font-mono text-[11px] font-semibold uppercase"
          style={{ color: "#D1F843", letterSpacing: "0.16em" }}
        >
          / Konto · Fakturering
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Mitt abonnement
        </h1>
        <p className="max-w-2xl text-sm text-on-surface-variant">
          Aktiv plan, neste betaling, sesjons-kvota og oversikt. Bytt eller
          kanseller når som helst — endringer trer i kraft fra neste
          fakturaperiode.
        </p>
      </header>

      <div className="grid gap-4.5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4.5 lg:col-span-1">
          <PlanHeroCard
            tierName={tier.name}
            tierEmphasis={tier.em}
            priceLabel={formatKr(priceNum)}
            per="måned"
            features={TIER_FEATURES[user.tier] ?? []}
            billRows={[
              {
                label: "Neste betaling",
                value: (
                  <>
                    {formatKr(priceNum)}
                    {periodEndFormatted ? (
                      <small
                        className="ml-1 text-xs font-medium"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        · {periodEndFormatted}
                      </small>
                    ) : null}
                  </>
                ),
                badge: { tone: "success", label: "Aktiv" },
              },
              {
                label: "Status",
                value: user.hasStripeSubscription
                  ? "Aktivt Stripe-abonnement"
                  : "Ingen aktiv betaling",
              },
              {
                label: "Bookingvindu",
                value:
                  quota?.bookingWindowDays != null
                    ? `${quota.bookingWindowDays} dager fram`
                    : "Standard",
              },
              {
                label: "Bindingstid",
                value: (
                  <>
                    Ingen{" "}
                    <small
                      className="ml-1 text-xs font-medium"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      · kanseller når som helst
                    </small>
                  </>
                ),
              },
            ]}
            primaryLabel={user.tier === "PRO" ? "Administrer" : "Oppgrader"}
            onPrimary={handleStripePortal}
            primaryDisabled={isPending}
            secondaryLabel="Stripe-portal"
            onSecondary={handleStripePortal}
          />

          <QuotaCard
            title="Forbruk denne perioden"
            period={periodLabel.toUpperCase()}
            items={[
              {
                label: "Coaching-økter",
                used: quota?.sessionsUsed ?? 0,
                total: quota?.sessionsAllowed ?? null,
                meta:
                  sessionsRemaining > 0
                    ? `${sessionsRemaining} ØKTER IGJEN`
                    : "BRUKT OPP — KONTAKT COACH",
              },
              {
                label: "Kommende bookinger",
                used: upcomingBookings,
                total: null,
                meta: "PLANLAGTE ØKTER FRAM I TID",
              },
              {
                label: "Bookingvindu",
                used: quota?.bookingWindowDays ?? 0,
                total: null,
                meta: "DAGER DU KAN BOOKE FRAMOVER",
              },
            ]}
          />

          <Link
            href="/portal/bookinger/ny"
            className="flex items-center justify-between gap-4 rounded-[16px] px-6 py-5 transition hover:bg-white/[0.04]"
            style={{
              background: "#0D2E23",
              border: "1px solid #1A4A3A",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(209,248,67,0.18)" }}
              >
                <Check className="h-5 w-5" style={{ color: "#D1F843" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Book en økt</p>
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  Planlegg neste coaching-time
                </p>
              </div>
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: "#D1F843" }}
            >
              Book nå →
            </span>
          </Link>
        </div>

        <aside className="flex flex-col gap-3.5">
          <TierSwitch
            tiers={tierOptions}
            lede={
              periodEndFormatted
                ? `Endring trer i kraft fra ${periodEndFormatted}. Du beholder nåværende fordeler ut perioden.`
                : "Du beholder nåværende fordeler ut perioden."
            }
            onSelect={() => handleStripePortal()}
          />
          <InfoCard
            Icon={Pause}
            title="Sett på pause"
            description="Reise eller skade? Du kan pause planen i opptil 3 måneder uten å miste medlems-rabatten. Snakk med oss for å sette det opp."
            links={[
              {
                label: "Pause i 30 dager",
                Icon: Pause,
                onClick: handleStripePortal,
              },
            ]}
          />
          <InfoCard
            Icon={LifeBuoy}
            title="Trenger du hjelp?"
            description="Faktureringsspørsmål, refusjoner eller bytte. Vi svarer innen 24 timer på hverdager."
            links={[
              {
                label: "Kontakt support",
                Icon: Mail,
                onClick: () => (window.location.href = "mailto:hei@akgolf.no"),
              },
              {
                label: "Kanseller",
                Icon: XCircle,
                onClick: handleStripePortal,
                danger: true,
              },
            ]}
          />
          {error ? (
            <p className="text-xs" style={{ color: "#F49283" }}>
              {error}
            </p>
          ) : null}
          {expiresAtFormatted ? (
            <p
              className="font-mono text-[10px] uppercase"
              style={{
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.14em",
              }}
            >
              Utløper {expiresAtFormatted}
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
