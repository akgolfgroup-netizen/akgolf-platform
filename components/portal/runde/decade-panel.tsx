"use client";

import { useState } from "react";
import { Brain, ChevronDown, Target, AlertTriangle, Shield } from "lucide-react";
import type { DecadeHoleStrategy } from "@/lib/portal/golf/decade-caddy";

interface DecadePanelProps {
  strategy: DecadeHoleStrategy | null;
}

const RISK_CONFIG = {
  low: {
    label: "Lav risiko",
    color: "var(--color-success)",
    bgColor: "var(--color-success-light)",
    textColor: "var(--color-success-text)",
    Icon: Shield,
  },
  medium: {
    label: "Moderat risiko",
    color: "var(--color-warning)",
    bgColor: "#FFF8F0",
    textColor: "#9A3412",
    Icon: Target,
  },
  high: {
    label: "Hoy risiko",
    color: "var(--color-error)",
    bgColor: "#FEF2F2",
    textColor: "#991B1B",
    Icon: AlertTriangle,
  },
} as const;

export function DecadePanel({ strategy }: DecadePanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!strategy) return null;

  const risk = RISK_CONFIG[strategy.riskLevel];
  const RiskIcon = risk.Icon;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] overflow-hidden mb-4">
      {/* Header — alltid synlig */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-[var(--color-grey-100)]"
      >
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-ai-light)" }}
          >
            <Brain className="h-5 w-5" style={{ color: "var(--color-ai)" }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--color-grey-900)]">
              DECADE Strategi
            </div>
            <div className="text-xs text-[var(--color-grey-500)]">
              {strategy.teeClub} — {strategy.teeAimpoint}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              backgroundColor: risk.bgColor,
              color: risk.textColor,
            }}
          >
            <RiskIcon className="h-3 w-3 inline mr-1" style={{ color: risk.color }} />
            {risk.label}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--color-grey-400)] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Utvidet innhold */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-[var(--color-grey-100)]">
          {/* Nøkkel-beslutning */}
          <div className="mt-3 p-3 rounded-xl bg-[var(--color-grey-100)]">
            <div className="text-xs font-medium text-[var(--color-grey-500)] mb-1">
              Nøkkelbeslutning
            </div>
            <div className="text-sm font-semibold text-[var(--color-grey-900)]">
              {strategy.keyDecision}
            </div>
          </div>

          {/* Strategi-detaljer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-[var(--color-grey-500)]">Tee-slag</div>
              <div className="text-sm font-medium text-[var(--color-grey-900)]">
                {strategy.teeClub}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--color-grey-500)]">Siktepunkt</div>
              <div className="text-sm font-medium text-[var(--color-grey-900)]">
                {strategy.teeAimpoint}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--color-grey-500)]">Innspill-mal</div>
              <div className="text-sm font-medium text-[var(--color-grey-900)]">
                {strategy.approachTarget}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--color-grey-500)]">Forventet score</div>
              <div className="text-sm font-medium text-[var(--color-grey-900)]">
                {strategy.expectedScore.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Begrunnelse */}
          <div className="text-xs text-[var(--color-grey-600)] leading-relaxed">
            {strategy.reasoning}
          </div>
        </div>
      )}
    </div>
  );
}
