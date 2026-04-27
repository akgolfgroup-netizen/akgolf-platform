"use client";

import { ArrowUpRight, Check, Pencil, Settings } from "lucide-react";

interface BillRow {
  label: string;
  value: React.ReactNode;
  badge?: { tone: "success" | "warning" | "danger"; label: string };
  action?: { label: string; onClick?: () => void };
}

interface PlanHeroCardProps {
  tierName: string;
  tierEmphasis?: string;
  priceLabel: string;
  per: string;
  features: string[];
  billRows: BillRow[];
  onPrimary?: () => void;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  onSecondary?: () => void;
  secondaryLabel?: string;
}

const BADGE_STYLE: Record<
  NonNullable<BillRow["badge"]>["tone"],
  { bg: string; color: string }
> = {
  success: { bg: "rgba(42,125,90,0.25)", color: "#6FCBA1" },
  warning: { bg: "rgba(196,138,50,0.25)", color: "#E8B967" },
  danger: { bg: "rgba(184,66,51,0.20)", color: "#F49283" },
};

export function PlanHeroCard({
  tierName,
  tierEmphasis,
  priceLabel,
  per,
  features,
  billRows,
  onPrimary,
  primaryLabel = "Oppgrader",
  primaryDisabled,
  onSecondary,
  secondaryLabel = "Administrer",
}: PlanHeroCardProps) {
  return (
    <section
      className="grid gap-9 rounded-[22px] p-7 lg:grid-cols-[1fr_1px_1.1fr]"
      style={{
        background:
          "radial-gradient(circle at 90% 0%, rgba(209,248,67,0.16), transparent 55%), linear-gradient(160deg, rgba(209,248,67,0.04), rgba(13,46,35,0)), #0D2E23",
        border: "1.5px solid rgba(209,248,67,0.30)",
        boxShadow: "0 0 32px rgba(209,248,67,0.10)",
      }}
    >
      <div>
        <div
          className="mb-3.5 inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase"
          style={{ color: "#D1F843", letterSpacing: "0.16em" }}
        >
          <span
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
            style={{
              background: "#D1F843",
              boxShadow: "0 0 8px rgba(209,248,67,0.8)",
            }}
          />
          Aktiv plan
        </div>
        <h2
          className="m-0 text-[44px] font-bold leading-none tracking-[-0.035em] text-white"
          style={{ fontFamily: "var(--font-inter-tight, Inter)" }}
        >
          {tierName}
          {tierEmphasis ? (
            <>
              {" "}
              <span style={{ color: "#D1F843" }}>{tierEmphasis}</span>
            </>
          ) : null}
        </h2>
        <div className="mt-4 flex items-baseline gap-1.5 text-white">
          <span
            className="text-[38px] font-bold tabular-nums tracking-[-0.03em]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {priceLabel}
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            / {per}
          </span>
        </div>
        {features.length > 0 ? (
          <ul className="mt-5 grid list-none gap-2.5 p-0">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2.5 text-[13.5px]"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                <Check
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: "#D1F843" }}
                />
                {f}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div
        className="hidden lg:block"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />

      <div className="flex flex-col gap-4.5 pt-1">
        {billRows.map((row, idx) => (
          <BillRowItem key={idx} row={row} />
        ))}
        <div className="mt-1.5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onPrimary}
            disabled={primaryDisabled}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "#D1F843",
              color: "#0A1F18",
            }}
          >
            <ArrowUpRight className="h-4 w-4" />
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={onSecondary}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
            {secondaryLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

function BillRowItem({ row }: { row: BillRow }) {
  return (
    <div className="flex items-end justify-between border-b border-white/5 pb-3.5 last:border-b-0 last:pb-0">
      <div>
        <div
          className="mb-1.5 font-mono text-[9px] uppercase"
          style={{
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.14em",
          }}
        >
          {row.label}
        </div>
        <div className="text-[15px] font-semibold tracking-[-0.01em] text-white">
          {row.value}
        </div>
      </div>
      {row.badge ? (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{
            background: BADGE_STYLE[row.badge.tone].bg,
            color: BADGE_STYLE[row.badge.tone].color,
          }}
        >
          <Check className="h-3 w-3" />
          {row.badge.label}
        </span>
      ) : null}
      {row.action ? (
        <button
          type="button"
          onClick={row.action.onClick}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:bg-white/10"
        >
          <Pencil className="h-3 w-3" />
          {row.action.label}
        </button>
      ) : null}
    </div>
  );
}
