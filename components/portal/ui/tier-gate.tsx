"use client";

import { Lock, Sparkles } from "lucide-react";
import { SubscriptionTier } from "@prisma/client";
import { hasTierAccess } from "@/lib/portal/rbac";

const TIER_LABELS: Record<SubscriptionTier, string> = {
  FREE: "Gratis",
  PRO: "Pro",
  ELITE: "Elite",
};

interface TierGateProps {
  userTier: SubscriptionTier;
  required: SubscriptionTier;
  children: React.ReactNode;
}

export function TierGate({ userTier, required, children }: TierGateProps) {
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
            background: "linear-gradient(135deg, rgba(13,34,68,0.95) 0%, rgba(10,25,41,0.98) 100%)",
            border: "1px solid rgba(184,151,92,0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "rgba(184,151,92,0.15)" }}
          >
            <Lock className="w-5 h-5 text-[var(--color-gold)]" />
          </div>
          <p className="text-sm font-semibold text-[var(--color-snow)] mb-1">
            Krever {TIER_LABELS[required]}-abonnement
          </p>
          <p className="text-xs text-[var(--color-gold-muted)] mb-4">
            Denne funksjonen er tilgjengelig for {TIER_LABELS[required]}- og{" "}
            {required === SubscriptionTier.PRO ? "Elite" : ""}-abonnenter.
          </p>
          <div
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
            style={{
              background: "linear-gradient(135deg, #c9a96e 0%, #B8975C 100%)",
              color: "#0a1929",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Kontakt oss for å oppgradere
          </div>
        </div>
      </div>
    </div>
  );
}
