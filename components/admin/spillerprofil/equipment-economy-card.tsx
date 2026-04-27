import { COLORS, SubHeader } from "./primitives";
import type { EquipmentRow, KpiBlock, PaymentRow } from "./types";

/* ============================================================
 * Utstyr — bag-tabell
 * ============================================================ */
export function EquipmentCardLong({ rows }: { rows: EquipmentRow[] }) {
  return (
    <div>
      {rows.map((r, idx) => (
        <div
          key={r.category}
          className="grid items-center gap-[14px] py-[10px] text-[12px]"
          style={{
            gridTemplateColumns: "80px 1fr auto",
            borderBottom:
              idx === rows.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <span
            className="font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{ color: COLORS.textTertiary }}
          >
            {r.category}
          </span>
          <span className="font-medium" style={{ color: "#fff" }}>
            {r.item}
          </span>
          <span
            className="font-mono text-[10px]"
            style={{ color: COLORS.textSubtle }}
          >
            {r.spec}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * Økonomi — KPIer + faktura/betalinger
 * ============================================================ */
export function EconomyCardLong({
  kpis,
  payments,
}: {
  kpis: KpiBlock[];
  payments: PaymentRow[];
}) {
  return (
    <div>
      <div className="mb-[16px] grid grid-cols-3 gap-[12px]">
        {kpis.map((k) => (
          <EconKpi key={k.label} k={k} />
        ))}
      </div>
      <SubHeader first>Siste betalinger</SubHeader>
      {payments.map((p, idx) => (
        <div
          key={`${p.reference}-${idx}`}
          className="grid items-center gap-[14px] py-[10px]"
          style={{
            gridTemplateColumns: "1fr auto auto",
            borderBottom:
              idx === payments.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div>
            <div className="text-[13px]" style={{ color: "#fff" }}>
              {p.description}
            </div>
            <div
              className="mt-[2px] font-mono text-[11px]"
              style={{ color: COLORS.textSubtle }}
            >
              {p.reference}
            </div>
          </div>
          <div
            className="font-mono text-[11px]"
            style={{ color: COLORS.textSubtle }}
          >
            {p.date}
          </div>
          <div
            className="font-mono text-[13px] font-semibold tabular-nums"
            style={{ color: COLORS.success }}
          >
            +{p.amount.toLocaleString("nb-NO")} kr
          </div>
        </div>
      ))}
    </div>
  );
}

function EconKpi({ k }: { k: KpiBlock }) {
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
        {k.label}
      </div>
      <div
        className="mt-[4px] text-[20px] font-bold tabular-nums tracking-[-0.02em]"
        style={{ color: COLORS.textPrimary }}
      >
        {k.value}
        {k.subText ? (
          <small
            className="ml-[4px] text-[10px] font-medium"
            style={{ color: COLORS.textSubtle }}
          >
            {k.subText}
          </small>
        ) : null}
      </div>
    </div>
  );
}

export const ECONOMY_KPIS: KpiBlock[] = [
  { label: "YTD inntekt", value: "28.400", subText: "kr" },
  { label: "Plan-kost", value: "2.490", subText: "/ mnd" },
  { label: "Neste faktura", value: "01 mai · 2.490 kr" },
];
