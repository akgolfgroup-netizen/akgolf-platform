import type { ReactNode } from "react";
import type { GoalRow, KpiBlock, SgRow } from "./types";

/* ============================================================
 * Shared primitives — dark theme, gjenbrukes mellom tabs og long page.
 * Farger speiler mockup d7/d8 (akgolf-card-dark, akgolf-line-dark).
 * ============================================================ */

export const COLORS = {
  // Bakgrunn
  bg: "#0A1F18", // akgolf-dark-bg
  card: "rgba(15, 31, 24, 1)", // akgolf-card-dark
  line: "rgba(255,255,255,0.08)", // akgolf-line-dark
  // Tekst
  textPrimary: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.7)",
  textSubtle: "rgba(255,255,255,0.55)",
  textTertiary: "rgba(255,255,255,0.45)",
  // Brand
  accent: "#D1F843",
  // Status
  success: "#6FCBA1",
  warn: "#E8B967",
  danger: "#F49283",
  info: "#6FB3FF",
  violet: "#C896E8",
} as const;

export function Panel({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl p-[18px] ${className}`}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PanelHead({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-[14px] flex items-center justify-between">
      <div>
        <h3
          className="m-0 text-[14px] font-semibold tracking-[-0.01em]"
          style={{ color: COLORS.textPrimary }}
        >
          {title}
        </h3>
        {sub ? (
          <div
            className="mt-[2px] font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{ color: COLORS.textTertiary }}
          >
            {sub}
          </div>
        ) : null}
      </div>
      {right ? <div className="flex items-center gap-[6px]">{right}</div> : null}
    </div>
  );
}

export function StatBlock({ block }: { block: KpiBlock }) {
  const trendColor =
    block.trend === "up"
      ? COLORS.success
      : block.trend === "down"
        ? COLORS.danger
        : COLORS.textSubtle;

  return (
    <div
      className="rounded-[10px] px-[14px] py-[12px]"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${COLORS.line}`,
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{ color: COLORS.textTertiary }}
      >
        {block.label}
      </div>
      <div
        className="mt-[4px] text-[20px] font-bold tabular-nums tracking-[-0.02em]"
        style={{ color: COLORS.textPrimary }}
      >
        {block.value}
        {block.subText ? (
          <small
            className="ml-[4px] text-[10px] font-medium"
            style={{ color: COLORS.textSubtle }}
          >
            {block.subText}
          </small>
        ) : null}
        {block.trendLabel ? (
          <small
            className="ml-[4px] text-[10px] font-medium"
            style={{ color: trendColor }}
          >
            {block.trendLabel}
          </small>
        ) : null}
      </div>
    </div>
  );
}

export function SubHeader({ children, first = false }: { children: ReactNode; first?: boolean }) {
  return (
    <div
      className={`font-mono text-[9px] uppercase tracking-[0.14em] ${first ? "mt-0" : "mt-[14px]"} mb-[8px]`}
      style={{ color: COLORS.textTertiary }}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warn" | "danger" | "info";
}) {
  const palette: Record<string, { bg: string; color: string }> = {
    neutral: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)" },
    accent: { bg: "rgba(209,248,67,0.20)", color: COLORS.accent },
    success: { bg: "rgba(42,125,90,0.22)", color: COLORS.success },
    warn: { bg: "rgba(196,138,50,0.22)", color: COLORS.warn },
    danger: { bg: "rgba(184,66,51,0.30)", color: COLORS.danger },
    info: { bg: "rgba(0,122,255,0.18)", color: COLORS.info },
  };
  const c = palette[tone];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-[10px] py-[3px] font-mono text-[10px] font-medium uppercase tracking-[0.08em]"
      style={{ background: c.bg, color: c.color }}
    >
      {children}
    </span>
  );
}

/** Strokes Gained-rad: kategori, balansert bar over 0-aksen, tall til høyre. */
export function SgBar({ row, labelWidth = 110 }: { row: SgRow; labelWidth?: number }) {
  const max = 0.4; // skalerer slik at +0.40 = 100% av halv-baren
  const width = Math.min(100, (Math.abs(row.value) / max) * 50); // 50 = halv bar
  const isPos = row.value >= 0;

  return (
    <div
      className="grid items-center gap-[12px] py-[6px]"
      style={{ gridTemplateColumns: `${labelWidth}px 1fr 50px` }}
    >
      <span className="text-[12px] font-medium" style={{ color: COLORS.textMuted }}>
        {row.label}
      </span>
      <div
        className="relative h-[8px] rounded-[4px]"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="absolute -top-[2px] -bottom-[2px] left-1/2 w-px"
          style={{ background: "rgba(255,255,255,0.25)" }}
        />
        <div
          className="absolute top-0 bottom-0 rounded-[3px]"
          style={{
            width: `${width}%`,
            ...(isPos
              ? { left: "50%", background: COLORS.success }
              : { right: "50%", background: COLORS.danger }),
          }}
        />
      </div>
      <span
        className="text-right font-mono text-[12px] font-semibold"
        style={{ color: isPos ? COLORS.success : COLORS.danger }}
      >
        {isPos ? "+" : "−"}
        {Math.abs(row.value).toFixed(2)}
      </span>
    </div>
  );
}

/** Goal-card med navn, prosent, bar og meta. */
export function GoalCard({ goal }: { goal: GoalRow }) {
  const barColor =
    goal.color === "success"
      ? COLORS.success
      : goal.color === "info"
        ? COLORS.info
        : COLORS.accent;

  return (
    <div
      className="rounded-[10px] p-[14px]"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${COLORS.line}`,
      }}
    >
      <div className="mb-[8px] flex justify-between text-[12px]">
        <span className="font-medium" style={{ color: COLORS.textPrimary }}>
          {goal.name}
        </span>
        <span
          className="font-mono font-semibold"
          style={{ color: COLORS.accent }}
        >
          {goal.percent}%
        </span>
      </div>
      <div
        className="h-[6px] overflow-hidden rounded-[3px]"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-[3px]"
          style={{ width: `${goal.percent}%`, background: barColor }}
        />
      </div>
      <div
        className="mt-[8px] font-mono text-[10px] tracking-[0.06em]"
        style={{ color: COLORS.textSubtle }}
      >
        {goal.meta}
      </div>
    </div>
  );
}
