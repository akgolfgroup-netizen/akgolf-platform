import { CheckCircle2, AlertCircle } from "lucide-react";
import type { EconomyGroup } from "@/app/admin/(authed)/elever/[id]/v2/get-student-360";
import { CardShell } from "./shell";

interface EconomyCardProps {
  economy: EconomyGroup;
}

export function EconomyCard({ economy }: EconomyCardProps) {
  return (
    <CardShell label="Økonomi" title="Forventet verdi og fortjeneste">
      <div className="grid grid-cols-2 gap-3 mb-5">
        <PrimaryStat label="Forventet verdi" value={fmtKr(economy.ltv)} sub="prognose neste 12 mnd" />
        <SecondaryStat
          label="Fast inntekt fra eleven"
          value={fmtKr(economy.mrrContribution)}
          sub="per måned"
        />
        <SecondaryStat
          label="Fortjeneste / økt"
          value={fmtKr(economy.marginPerSession)}
          sub={`${economy.marginPct}% etter kost`}
          color="success"
        />
        <SecondaryStat
          label="Risiko for å slutte"
          value={churnLabel(economy.churnRiskLevel)}
          sub={`${economy.churnRiskScore}% modell-score`}
          color={economy.churnRiskLevel === "LAV" ? "success" : economy.churnRiskLevel === "MEDIUM" ? "warning" : "danger"}
        />
      </div>

      <div
        className="p-3 rounded-lg flex items-start gap-2"
        style={{
          background: economy.stripeOk ? "var(--color-success-soft, #E0EFE7)" : "var(--color-warning-soft, #F6ECD9)",
          border: `1px solid color-mix(in srgb, var(--color-${economy.stripeOk ? "success" : "warning"}) 20%, transparent)`,
        }}
      >
        {economy.stripeOk ? (
          <CheckCircle2
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: "var(--color-success)" }}
          />
        ) : (
          <AlertCircle
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: "var(--color-warning)" }}
          />
        )}
        <div>
          <div
            className="text-[12px] font-semibold"
            style={{ color: economy.stripeOk ? "var(--color-success)" : "var(--color-warning)" }}
          >
            {economy.stripeOk ? "Stripe — alle betalinger OK" : "Påminnelse om betaling sendt"}
          </div>
          <div
            className="text-[11px] mt-0.5"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Neste trekk:{" "}
            {economy.nextChargeAt?.toLocaleDateString("nb-NO", {
              day: "numeric",
              month: "short",
            })}{" "}
            · {fmtKr(economy.mrrContribution)} · auto
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function PrimaryStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      className="p-3 rounded-lg"
      style={{ background: "var(--color-primary-soft)" }}
    >
      <div
        className="text-[10px] font-mono uppercase"
        style={{ letterSpacing: "0.12em", color: "var(--color-primary)" }}
      >
        {label}
      </div>
      <div
        className="font-semibold text-[22px] mt-1"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-primary)" }}
      >
        {value}
      </div>
      <div
        className="text-[10px] mt-0.5"
        style={{ color: "var(--color-primary-deep, var(--color-primary))" }}
      >
        {sub}
      </div>
    </div>
  );
}

function SecondaryStat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color?: "success" | "warning" | "danger";
}) {
  const valueColor =
    color === "success"
      ? "var(--color-success)"
      : color === "warning"
      ? "var(--color-warning)"
      : color === "danger"
      ? "var(--color-danger)"
      : "var(--color-ink)";
  return (
    <div className="p-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
      <div
        className="text-[10px] font-mono uppercase"
        style={{ letterSpacing: "0.12em", color: "var(--color-ink-subtle)" }}
      >
        {label}
      </div>
      <div
        className="font-semibold text-[22px] mt-1"
        style={{ fontFamily: "var(--font-mono)", color: valueColor }}
      >
        {value}
      </div>
      <div className="text-[10px] mt-0.5" style={{ color: "var(--color-ink-muted)" }}>
        {sub}
      </div>
    </div>
  );
}

function fmtKr(n: number): string {
  return new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 }).format(n);
}

function churnLabel(level: "LAV" | "MEDIUM" | "HOY"): string {
  return level === "LAV" ? "Lav" : level === "MEDIUM" ? "Middels" : "Høy";
}
