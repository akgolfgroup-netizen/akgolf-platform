import { TrendingUp, AlertTriangle, Info } from "lucide-react";
import type { SignalsGroup } from "@/app/admin/(authed)/elever/[id]/v2/get-student-360";
import { CardShell } from "./shell";

interface SignalsCardProps {
  signals: SignalsGroup;
}

export function SignalsCard({ signals }: SignalsCardProps) {
  return (
    <CardShell
      label="Signaler"
      title="Dagens fokus — varsler"
      actionLabel={`${signals.signals.length} signaler`}
    >
      {signals.signals.length === 0 ? (
        <div
          className="text-[13px] py-3"
          style={{ color: "var(--color-ink-subtle)" }}
        >
          Ingen aktive signaler — alt går som normalt.
        </div>
      ) : (
        <ul className="space-y-3">
          {signals.signals.map((s) => {
            const config = getSignalConfig(s.type);
            return (
              <li
                key={s.id}
                className="p-3 rounded-xl flex items-start gap-3"
                style={{
                  border: `1px solid ${config.borderColor}`,
                  background: config.bgColor,
                }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: config.iconBg, color: "#FFFFFF" }}
                >
                  <config.Icon className="w-4 h-4" />
                </span>
                <div className="flex-1">
                  <div
                    className="text-[13px] font-semibold"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {s.title}
                  </div>
                  <div
                    className="text-[12px] mt-0.5"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    {s.description}
                  </div>
                  <div
                    className="text-[10px] font-mono uppercase mt-1.5"
                    style={{
                      letterSpacing: "0.12em",
                      color: config.metaColor,
                    }}
                  >
                    Oppdaget{" "}
                    {s.detectedAt.toLocaleDateString("nb-NO", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · {s.source}
                  </div>
                </div>
                <button
                  className="text-[11px] font-mono uppercase cursor-pointer"
                  style={{
                    color: "var(--color-primary)",
                    letterSpacing: "0.12em",
                  }}
                >
                  {s.type === "TILBAKEGANG" ? "Lag drill" : "Lukk"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </CardShell>
  );
}

function getSignalConfig(type: "FRAMGANG" | "TILBAKEGANG" | "INFO") {
  if (type === "FRAMGANG") {
    return {
      Icon: TrendingUp,
      borderColor: "color-mix(in srgb, var(--color-success) 30%, transparent)",
      bgColor: "color-mix(in srgb, var(--color-success-soft, #E0EFE7) 40%, transparent)",
      iconBg: "var(--color-success)",
      metaColor: "var(--color-success)",
    };
  }
  if (type === "TILBAKEGANG") {
    return {
      Icon: AlertTriangle,
      borderColor: "color-mix(in srgb, var(--color-warning) 30%, transparent)",
      bgColor: "color-mix(in srgb, var(--color-warning-soft, #F6ECD9) 40%, transparent)",
      iconBg: "var(--color-warning)",
      metaColor: "var(--color-warning)",
    };
  }
  return {
    Icon: Info,
    borderColor: "var(--color-line)",
    bgColor: "var(--color-surface)",
    iconBg: "var(--color-ink-muted)",
    metaColor: "var(--color-ink-muted)",
  };
}
