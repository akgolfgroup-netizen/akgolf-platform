import type { IdentityGroup } from "@/app/admin/(authed)/elever/[id]/v2/get-student-360";
import { CardShell } from "./shell";

interface KontaktinfoCardProps {
  identity: IdentityGroup;
}

export function KontaktinfoCard({ identity }: KontaktinfoCardProps) {
  return (
    <CardShell label="Kontaktinfo" title="Kontakt og abonnement" actionLabel="Rediger">
      <dl className="space-y-3 text-[13px]">
        <Row label="E-post" value={identity.email ?? "—"} mono />
        <Row label="Telefon" value={identity.phone ?? "—"} mono />
        <Row label="Klubb" value={identity.klubb ?? "—"} />
        <Row label="GolfBox-id" value={identity.golfboxId ?? "—"} mono />
        {identity.abonnement && (
          <Row
            label="Abonnement"
            valueRich={
              <div className="text-right">
                <div style={{ fontWeight: 600 }}>{identity.abonnement.name}</div>
                <div
                  className="text-[11px] font-mono"
                  style={{ color: "var(--color-ink-subtle)" }}
                >
                  {identity.abonnement.pricePerMonthKr} kr/mnd · neste{" "}
                  {identity.abonnement.nextChargeDate?.toLocaleDateString("nb-NO", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
            }
          />
        )}
        <Row
          label="Læringsstil"
          valueRich={
            identity.laeringsstil ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono uppercase"
                style={{
                  background: "var(--color-primary-soft)",
                  color: "var(--color-primary)",
                  letterSpacing: "0.12em",
                }}
              >
                {identity.laeringsstil}
              </span>
            ) : (
              <span style={{ color: "var(--color-ink-subtle)" }}>—</span>
            )
          }
        />
      </dl>
    </CardShell>
  );
}

function Row({
  label,
  value,
  valueRich,
  mono,
}: {
  label: string;
  value?: string;
  valueRich?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div
      className="flex items-start justify-between gap-3 pb-3"
      style={{ borderBottom: "1px solid var(--color-line-soft)" }}
    >
      <dt style={{ color: "var(--color-ink-muted)" }}>{label}</dt>
      <dd
        style={{
          color: "var(--color-ink)",
          fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
          fontWeight: 500,
        }}
      >
        {valueRich ?? value}
      </dd>
    </div>
  );
}
