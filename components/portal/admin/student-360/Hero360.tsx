import { TrendingDown, Flame, MessageSquare, Plus } from "lucide-react";
import type {
  IdentityGroup,
  GolfGroup,
  CoachingGroup,
} from "@/app/admin/(authed)/elever/[id]/v2/get-student-360";

interface Hero360Props {
  identity: IdentityGroup;
  golf: GolfGroup;
  coaching: CoachingGroup;
}

/**
 * Hero-seksjon for Spillerprofil 360°.
 * Designfasit: public/design-reference/student-360-reference.html (linje ~250-310)
 */
export function Hero360({ identity, golf }: Hero360Props) {
  const initials = (identity.name ?? "??")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const firstName = identity.name?.split(" ")[0] ?? "Elev";
  const lastName = identity.name?.split(" ").slice(1).join(" ") ?? "";

  return (
    <section>
      <div
        className="text-[11px] font-mono uppercase mb-4"
        style={{ letterSpacing: "0.22em", color: "var(--color-ink-subtle)" }}
      >
        SPILLERPROFIL · 360° · OPPDATERT {new Date().toLocaleDateString("nb-NO")}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Avatar + identity */}
        <div className="col-span-7">
          <div className="flex items-end gap-6">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center font-bold text-[36px] shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-deep))",
                color: "var(--color-sidebar)",
                fontFamily: "var(--font-display)",
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1
                className="font-semibold text-[52px] leading-[0.95] tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                {firstName}{" "}
                <span className="italic" style={{ color: "var(--color-primary)" }}>
                  {lastName}.
                </span>
              </h1>
              <div
                className="mt-3 flex items-center gap-3 text-[13px]"
                style={{ color: "var(--color-ink-muted)" }}
              >
                <span>{identity.klubb ?? "—"}</span>
                <span>·</span>
                <span>{identity.abonnement?.name ?? "Ingen abonnement"}</span>
                <span>·</span>
                <span>
                  Medlem siden{" "}
                  {identity.memberSince?.toLocaleDateString("nb-NO", {
                    month: "short",
                    year: "numeric",
                  }) ?? "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium cursor-pointer transition-colors"
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-line)",
                color: "var(--color-ink)",
              }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Send melding
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors"
              style={{
                background: "var(--color-primary)",
                color: "#FFFFFF",
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Ny økt
            </button>
          </div>
        </div>

        {/* Quick KPI strip — 4 kort */}
        <div className="col-span-5 grid grid-cols-2 gap-3">
          <KpiCard
            label="HCP nå"
            value={golf.hcpNow !== null ? golf.hcpNow.toFixed(1) : "—"}
            sub={
              golf.hcpDelta30d !== null
                ? `${golf.hcpDelta30d < 0 ? "↓" : "↑"} ${Math.abs(golf.hcpDelta30d).toFixed(1)} siste 30d`
                : null
            }
            subColor={golf.hcpDelta30d !== null && golf.hcpDelta30d < 0 ? "success" : "muted"}
          />
          <KpiCard
            label="Ferdighetsnivå"
            value={golf.ferdighetsnivaa ?? "—"}
            sub="A=topp, K=nybegynner"
            subColor="muted"
          />
          <KpiCard
            label="SG totalt"
            value={golf.sgTotal !== null ? `+${golf.sgTotal.toFixed(1)}` : "—"}
            sub="vs HCP-snitt"
            subColor="success"
          />
          <KpiCardDark
            label="Streak"
            value="12"
            unit="dager"
            sub="Personlig rekord: 21"
          />
        </div>
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  sub: string | null;
  subColor: "success" | "warning" | "muted";
}) {
  const subColorVar =
    subColor === "success"
      ? "var(--color-success)"
      : subColor === "warning"
      ? "var(--color-warning)"
      : "var(--color-ink-subtle)";

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--color-card)",
        boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <div
        className="text-[10px] font-mono uppercase"
        style={{ letterSpacing: "0.12em", color: "var(--color-ink-subtle)" }}
      >
        {label}
      </div>
      <div
        className="font-semibold text-[24px] leading-none mt-1"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[10px] mt-1 flex items-center gap-1" style={{ color: subColorVar }}>
          {subColor === "success" && <TrendingDown className="w-3 h-3" />}
          {sub}
        </div>
      )}
    </div>
  );
}

function KpiCardDark({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit: string;
  sub: string;
}) {
  return (
    <div
      className="rounded-xl p-4 relative overflow-hidden"
      style={{
        background: "var(--color-sidebar)",
        color: "#FFFFFF",
      }}
    >
      <div
        className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl"
        style={{ background: "rgba(209, 248, 67, 0.15)" }}
      />
      <div
        className="text-[10px] font-mono uppercase relative"
        style={{ letterSpacing: "0.12em", color: "var(--color-sidebar-muted)" }}
      >
        {label}
      </div>
      <div className="font-semibold text-[24px] leading-none mt-1 relative" style={{ fontFamily: "var(--font-mono)" }}>
        <span style={{ color: "var(--color-accent)" }}>{value}</span>{" "}
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{unit}</span>
      </div>
      <div
        className="text-[10px] mt-1 relative inline-flex items-center gap-1"
        style={{ color: "var(--color-sidebar-muted)" }}
      >
        <Flame className="w-3 h-3" /> {sub}
      </div>
    </div>
  );
}
