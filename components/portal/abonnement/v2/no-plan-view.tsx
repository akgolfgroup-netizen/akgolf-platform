"use client";

import Link from "next/link";
import { Bolt } from "lucide-react";
import { TierSwitch } from "./tier-switch";
import { ALL_TIERS } from "./tier-data";

interface NoPlanViewProps {
  currentTier: string;
  onUpgrade?: () => void;
}

export function NoPlanView({ currentTier, onUpgrade }: NoPlanViewProps) {
  const tierOptions = ALL_TIERS.map((t) => ({
    ...t,
    current: t.key === currentTier,
  }));

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6 pb-12">
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
          Du har ikke en aktiv plan. Velg en plan for å få tilgang til
          coaching-økter, AI Coach og full statistikk.
        </p>
      </header>

      <section
        className="rounded-2xl p-10 text-center"
        style={{
          background:
            "radial-gradient(circle at 90% 0%, rgba(209,248,67,0.16), transparent 55%), #0D2E23",
          border: "1.5px solid rgba(209,248,67,0.30)",
        }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "rgba(209,248,67,0.18)" }}
        >
          <Bolt className="h-7 w-7" style={{ color: "#D1F843" }} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">
          Bli en bedre spiller — fast.
        </h2>
        <p
          className="mx-auto mb-6 max-w-sm text-sm"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          Performance-abonnement gir deg jevnlig coaching, personlig
          treningsplan og full tilgang til portalen.
        </p>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition active:scale-[0.98]"
          style={{ background: "#D1F843", color: "#0A1F18" }}
        >
          Velg en plan
        </Link>
      </section>

      <TierSwitch
        tiers={tierOptions}
        lede="Bytter du plan, sender vi deg til Stripe der du kan fullføre."
        onSelect={() => onUpgrade?.()}
      />
    </div>
  );
}
