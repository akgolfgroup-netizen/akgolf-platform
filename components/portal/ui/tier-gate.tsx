"use client";

import { Lock, Zap } from "lucide-react";
import { SubscriptionTier } from "@prisma/client";
import { hasTierAccess } from "@/lib/portal/rbac";
import Link from "next/link";

const TIER_LABELS: Record<SubscriptionTier, string> = {
  VISITOR: "Gratis",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Pro",
  ELITE: "Pro+",
};

const TIER_PRICES: Record<SubscriptionTier, string> = {
  VISITOR: "0 kr",
  ACADEMY: "Inkludert",
  STARTER: "Inkludert",
  PRO: "199 kr/mnd",
  ELITE: "299 kr/mnd",
};

interface TierGateProps {
  userTier: SubscriptionTier;
  required: SubscriptionTier;
  children: React.ReactNode;
  featureName?: string;
}

export function TierGate({
  userTier,
  required,
  children,
  featureName,
}: TierGateProps) {
  if (hasTierAccess(userTier, required)) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none blur-sm opacity-30">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="rounded-2xl p-6 text-center max-w-xs mx-auto"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid var(--color-grey-200)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "var(--color-grey-100)" }}
          >
            <Lock className="w-5 h-5 text-[var(--color-grey-500)]" />
          </div>
          <p className="text-sm font-semibold text-[var(--color-grey-900)] mb-1">
            {featureName || "Denne funksjonen"} krever{" "}
            {TIER_LABELS[required]}
          </p>
          <p className="text-xs text-[var(--color-grey-500)] mb-4">
            Oppgrader for {TIER_PRICES[required]} for å få tilgang.
          </p>
          <Link
            href="/portal/oppgrader"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-transform hover:scale-105"
            style={{
              background: "var(--color-brand)",
              color: "white",
            }}
          >
            <Zap className="w-4 h-4" />
            Oppgrader til {TIER_LABELS[required]}
          </Link>
        </div>
      </div>
    </div>
  );
}
