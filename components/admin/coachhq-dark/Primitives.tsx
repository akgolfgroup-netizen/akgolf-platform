import type { ButtonHTMLAttributes, ReactNode } from "react";

/* ============================================================
 * Tokens
 * ========================================================== */

export const TOKENS = {
  bg: "#102B1E",
  card: "#0D2E23",
  line: "#1A4A3A",
  primary: "#005840",
  accent: "#D1F843",
  success: "#6FCBA1",
  warn: "#E8B967",
  danger: "#F49283",
  blue: "#6FB3FF",
  violet: "#C896E8",
  textMuted: "rgba(255,255,255,0.55)",
  textSubtle: "rgba(255,255,255,0.45)",
} as const;

/* ============================================================
 * Card
 * ========================================================== */

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  padding?: number | string;
}

export function Card({ children, className = "", glow, padding = 18 }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: "#0D2E23",
        border: glow
          ? "1.5px solid rgba(209,248,67,0.30)"
          : "1px solid #1a4a3a",
        borderRadius: 16,
        padding: typeof padding === "number" ? `${padding}px` : padding,
        boxShadow: glow ? "0 0 24px rgba(209,248,67,0.10)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, sub, action, className = "" }: CardHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between mb-3.5 ${className}`}
    >
      <h3
        className="m-0 text-[14px] font-semibold"
        style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}
      >
        {title}
      </h3>
      {(sub || action) && (
        <div className="flex items-center gap-2">
          {sub && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {sub}
            </span>
          )}
          {action}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Button
 * ========================================================== */

type ButtonVariant = "default" | "primary" | "accent" | "ghost";
type ButtonSize = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

export function Button({
  variant = "default",
  size = "md",
  icon,
  children,
  className = "",
  style,
  ...rest
}: ButtonProps) {
  const styles: Record<ButtonVariant, React.CSSProperties> = {
    default: {
      background: "rgba(255,255,255,0.05)",
      color: "#E6EAE8",
      border: "1px solid rgba(255,255,255,0.08)",
    },
    primary: {
      background: "#005840",
      color: "#FFFFFF",
      border: "1px solid #005840",
      fontWeight: 600,
    },
    accent: {
      background: "#D1F843",
      color: "#0A1F18",
      border: "1px solid #D1F843",
      fontWeight: 600,
    },
    ghost: {
      background: "transparent",
      color: "rgba(255,255,255,0.8)",
      border: "1px solid transparent",
    },
  };

  const sizing: Record<ButtonSize, React.CSSProperties> = {
    md: { padding: "8px 14px", fontSize: 13 },
    sm: { padding: "5px 10px", fontSize: 11 },
  };

  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors ${className}`}
      style={{ ...styles[variant], ...sizing[size], ...style }}
    >
      {icon}
      {children}
    </button>
  );
}

/* ============================================================
 * Pill
 * ========================================================== */

type PillTone =
  | "default"
  | "accent"
  | "success"
  | "warn"
  | "warning"
  | "danger"
  | "info"
  | "violet"
  | "lime"
  | "green"
  | "amber"
  | "coral"
  | "blue";

interface PillProps {
  tone?: PillTone;
  children: ReactNode;
  className?: string;
}

const PILL_STYLES: Record<PillTone, React.CSSProperties> = {
  default: {
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.85)",
  },
  accent: { background: "rgba(209,248,67,0.18)", color: "#D1F843" },
  lime: { background: "rgba(209,248,67,0.18)", color: "#D1F843" },
  success: { background: "rgba(42,125,90,0.25)", color: "#6FCBA1" },
  green: { background: "rgba(42,125,90,0.25)", color: "#6FCBA1" },
  warn: { background: "rgba(196,138,50,0.22)", color: "#E8B967" },
  warning: { background: "rgba(196,138,50,0.22)", color: "#E8B967" },
  amber: { background: "rgba(196,138,50,0.22)", color: "#E8B967" },
  danger: { background: "rgba(184,66,51,0.22)", color: "#F49283" },
  coral: { background: "rgba(184,66,51,0.22)", color: "#F49283" },
  info: { background: "rgba(0,122,255,0.18)", color: "#6FB3FF" },
  blue: { background: "rgba(0,122,255,0.18)", color: "#6FB3FF" },
  violet: { background: "rgba(175,82,222,0.18)", color: "#C896E8" },
};

export function Pill({ tone = "default", children, className = "" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${className}`}
      style={PILL_STYLES[tone]}
    >
      {children}
    </span>
  );
}

/* ============================================================
 * Eyebrow + MonoLabel
 * ========================================================== */

export function Eyebrow({
  children,
  accent,
  className = "",
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9px",
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: accent ? "#D1F843" : "rgba(255,255,255,0.45)",
      }}
    >
      {children}
    </span>
  );
}

export function MonoLabel({
  children,
  className = "",
  color,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: color ?? "rgba(255,255,255,0.45)",
      }}
    >
      {children}
    </span>
  );
}

/* ============================================================
 * KpiCard
 * ========================================================== */

type KpiTone =
  | "default"
  | "accent"
  | "success"
  | "warn"
  | "warning"
  | "danger";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  tone?: KpiTone;
  sub?: string;
}

const KPI_TONE: Record<KpiTone, { value: string; sub: string }> = {
  default: { value: "#FFFFFF", sub: "rgba(255,255,255,0.45)" },
  accent: { value: TOKENS.accent, sub: "rgba(209,248,67,0.65)" },
  success: { value: TOKENS.success, sub: "rgba(111,203,161,0.65)" },
  warn: { value: TOKENS.warn, sub: "rgba(232,185,103,0.65)" },
  warning: { value: TOKENS.warn, sub: "rgba(232,185,103,0.65)" },
  danger: { value: TOKENS.danger, sub: "rgba(244,146,131,0.65)" },
};

export function KpiCard({ label, value, unit, icon, tone = "default", sub }: KpiCardProps) {
  const t = KPI_TONE[tone];
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.line}`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: TOKENS.textSubtle }}
        >
          {label}
        </span>
        {icon && <span className="text-white/40">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="text-[26px] font-bold tracking-[-0.025em] tabular-nums"
          style={{ color: t.value, fontFamily: "var(--font-inter-tight)" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[13px] font-medium text-white/45">{unit}</span>
        )}
      </div>
      {sub && (
        <div className="mt-1 text-[11px] font-medium" style={{ color: t.sub }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * StatCard
 * ========================================================== */

interface StatCardProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

export function StatCard({ label, value, valueColor }: StatCardProps) {
  return (
    <div
      className="rounded-[10px] px-3.5 py-3"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.line}`,
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{ color: TOKENS.textSubtle }}
      >
        {label}
      </div>
      <div
        className="mt-1 text-[22px] font-bold tracking-[-0.02em] tabular-nums"
        style={{ color: valueColor ?? "#fff" }}
      >
        {value}
      </div>
    </div>
  );
}

/* ============================================================
 * Empty
 * ========================================================== */

interface EmptyProps {
  title?: string;
  body?: string;
  children?: ReactNode;
}

export function Empty({
  title = "Ingen data",
  body = "Det finnes ingen oppføringer å vise ennå.",
  children,
}: EmptyProps) {
  return (
    <div
      className="rounded-2xl p-10 text-center"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.line}`,
      }}
    >
      <div
        className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
        style={{ color: TOKENS.accent }}
      >
        / {title.toUpperCase()}
      </div>
      <p className="m-0 text-[14px] text-white/55 max-w-md mx-auto">{body}</p>
      {children}
    </div>
  );
}

/* ============================================================
 * Table
 * ========================================================== */

interface TableColumn<T> {
  key: string;
  label: string;
  width?: string;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyText?: string;
}

export function Table<T>({
  columns,
  rows,
  keyExtractor,
  onRowClick,
  emptyText = "Ingen data",
}: TableProps<T>) {
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{ border: `1px solid ${TOKENS.line}` }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-[13px] text-white/40"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={
                    onRowClick
                      ? "cursor-pointer hover:bg-white/[0.03] transition-colors"
                      : ""
                  }
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
