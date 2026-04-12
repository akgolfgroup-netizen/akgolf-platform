"use client";

import { PremiumCard } from "./premium-card";

interface TrackmanMetric {
  label: string;
  value: string;
  unit: string;
}

interface TrackmanCardProps {
  clubSpeed?: number;
  carry?: number;
  smashFactor?: number;
  delay?: number;
}

export function TrackmanCard({
  clubSpeed = 152,
  carry = 245,
  smashFactor = 1.48,
  delay = 0,
}: TrackmanCardProps) {
  const metrics: TrackmanMetric[] = [
    { label: "Club Speed", value: String(clubSpeed), unit: "km/h" },
    { label: "Carry", value: String(carry), unit: "m" },
    { label: "Smash Factor", value: smashFactor.toFixed(2), unit: "" },
  ];

  return (
    <PremiumCard delay={delay} className="flex h-full flex-col" glow="green">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
          TrackMan Data
        </p>
        <div className="flex items-center gap-1 rounded-full border border-black/[0.06] bg-black/[0.02] px-2 py-0.5">
          <span className="text-[10px] font-medium text-[var(--color-portal-muted)]">Driver</span>
        </div>
      </div>

      {/* Waveform SVG */}
      <div className="mb-4 text-primary/30">
        <svg viewBox="0 0 200 40" className="h-10 w-full" preserveAspectRatio="none">
          <path
            d="M0 20 Q 12 8 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="M0 20 Q 12 8 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20;
                      M0 20 Q 12 32 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20;
                      M0 20 Q 12 8 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20"
            />
          </path>
        </svg>
      </div>

      {/* Metrics */}
      <div className="mt-auto space-y-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between rounded-[10px] border border-black/[0.06] bg-black/[0.02] px-3.5 py-2.5 transition-colors duration-200 hover:border-black/[0.08] hover:bg-black/[0.04]"
          >
            <span className="text-[11px] text-[var(--color-portal-muted)]">{m.label}</span>
            <span className="text-base font-bold tracking-tight text-[var(--color-portal-text)] tabular-nums">
              {m.value}
              {m.unit && (
                <span className="ml-0.5 text-[11px] font-medium text-[var(--color-portal-muted)]">
                  {m.unit}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
