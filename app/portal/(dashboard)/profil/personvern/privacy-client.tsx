"use client";

import { useState } from "react";
import { Shield, Brain, BarChart3, Megaphone } from "lucide-react";
import { toggleConsent } from "@/lib/portal/consent/service";
import type { ConsentTier } from "@prisma/client";

interface ConsentState {
  granted: boolean;
  grantedAt: Date | null;
  source: string | null;
}

interface PrivacyClientProps {
  userId: string;
  initialConsents: Record<string, ConsentState>;
}

const TIERS: Array<{
  key: ConsentTier;
  label: string;
  description: string;
  icon: React.ReactNode;
  required?: boolean;
}> = [
  {
    key: "TIER_1_SERVICE",
    label: "Tjeneste (nødvendig)",
    description: "Basisdata for å kunne logge inn, booke og bruke PlayersHQ. Kan ikke trekkes.",
    icon: <Shield className="w-5 h-5" />,
    required: true,
  },
  {
    key: "TIER_2_IMPROVEMENT",
    label: "Forbedring",
    description: "Anonymiserte bruksdata for å forbedre treningsplaner og app-funksjoner.",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    key: "TIER_3_AI_RESEARCH",
    label: "AI-forskning",
    description: "Din data kan brukes til å trene og forbedre AK Golfs AI-modeller.",
    icon: <Brain className="w-5 h-5" />,
  },
  {
    key: "TIER_4_COMMERCIAL",
    label: "Kommersiell",
    description: "Motta tilbud og nyheter fra AK Golf og samarbeidspartnere.",
    icon: <Megaphone className="w-5 h-5" />,
  },
];

export function PrivacyClient({ userId, initialConsents }: PrivacyClientProps) {
  const [consents, setConsents] = useState(initialConsents);
  const [saving, setSaving] = useState<string | null>(null);

  async function handleToggle(tier: ConsentTier) {
    if (tier === "TIER_1_SERVICE") return;

    const current = consents[tier]?.granted ?? false;
    setSaving(tier);

    try {
      await toggleConsent(userId, tier, !current, "PROFILE_PAGE");
      setConsents((prev) => ({
        ...prev,
        [tier]: {
          ...prev[tier],
          granted: !current,
          grantedAt: new Date(),
        },
      }));
    } catch (err) {
      console.error("Consent toggle failed:", err);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-4">
      {TIERS.map((tier) => {
        const state = consents[tier.key];
        const isOn = state?.granted ?? false;

        return (
          <div
            key={tier.key}
            className="flex items-start gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5"
          >
            <div
              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isOn ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {tier.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-primary">{tier.label}</h3>
                <button
                  onClick={() => handleToggle(tier.key)}
                  disabled={tier.required || saving === tier.key}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    isOn ? "bg-primary" : "bg-surface-container"
                  } ${tier.required || saving === tier.key ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  aria-pressed={isOn}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow-sm transition-transform ${
                      isOn ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="mt-1 text-sm text-on-surface-variant">{tier.description}</p>
              {isOn && state?.grantedAt && (
                <p className="mt-1.5 text-[11px] text-on-surface-variant/60">
                  Sist oppdatert: {new Date(state.grantedAt).toLocaleDateString("nb-NO")}
                </p>
              )}
            </div>
          </div>
        );
      })}

      <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5">
        <h3 className="font-semibold text-primary">Dine data</h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          Du kan når som helst be om å få utlevert eller slettet alle dataene dine.
          Send en e-post til post@akgolf.no med emnet «Personvernforespørsel».
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="mailto:post@akgolf.no?subject=Personvernforespørsel"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-surface hover:opacity-90 transition-opacity"
          >
            <Shield className="w-4 h-4" />
            Be om innsyn
          </a>
          <a
            href="/personvern"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/30 px-4 py-2.5 text-sm font-medium text-primary hover:bg-surface-container transition-colors"
          >
            Les full personvernerklæring
          </a>
        </div>
      </div>
    </div>
  );
}
