import { TrendingUp } from "lucide-react";
import type { GolfGroup } from "@/app/admin/(authed)/elever/[id]/v2/get-student-360";
import { CardShell, MonoLabel } from "./shell";

interface GolfCardProps {
  golf: GolfGroup;
}

const FERDIGHETSNIVAA_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
const FERDIGHETSNIVAA_COLORS: Record<string, string> = {
  A: "#1A6B47",
  B: "#2A7D5A",
  C: "#4D9670",
  D: "#7AB088",
  E: "#C9D89D",
  F: "#ECFCC0",
  G: "#F6ECD9",
  H: "#E8C896",
  I: "#D89B5C",
  J: "#C77140",
  K: "#B84233",
};

export function GolfCard({ golf }: GolfCardProps) {
  const sgEntries = [
    { code: "DR", label: "Driver", value: golf.sgBreakdown.driver },
    { code: "APP", label: "Approach", value: golf.sgBreakdown.approach },
    { code: "ARG", label: "Around the green", value: golf.sgBreakdown.aroundGreen },
    { code: "PT", label: "Putting", value: golf.sgBreakdown.putting },
  ];
  const maxAbs = Math.max(...sgEntries.map((e) => Math.abs(e.value)), 1);

  return (
    <CardShell
      label="Golf-statistikk"
      title="Handicap, ferdighetsnivå og SG"
      actionLabel="Detaljer"
    >
      {/* Ferdighetsnivå A-K visualisering */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[11px] font-mono uppercase"
            style={{ letterSpacing: "0.12em", color: "var(--color-ink-muted)" }}
          >
            Nå:{" "}
            <span style={{ color: "var(--color-ink)", fontWeight: 700, fontSize: "14px" }}>
              {golf.ferdighetsnivaa ?? "—"}
            </span>
          </span>
        </div>
        <div className="flex gap-1 items-end">
          {FERDIGHETSNIVAA_LABELS.map((nivaa) => {
            const isActive = nivaa === golf.ferdighetsnivaa;
            const color = FERDIGHETSNIVAA_COLORS[nivaa];
            const textColor = ["A", "B", "C", "I", "J", "K"].includes(nivaa) ? "#fff" : "#0A1F18";
            return (
              <div
                key={nivaa}
                className={`flex-1 ${isActive ? "h-9 -mt-1 rounded ring-2" : "h-7 rounded"} flex items-center justify-center text-[10px] font-mono font-bold`}
                style={{
                  background: color,
                  color: textColor,
                  ...(isActive
                    ? { boxShadow: `0 0 0 2px var(--color-primary)`, fontSize: "12px" }
                    : {}),
                }}
              >
                {nivaa}
              </div>
            );
          })}
        </div>
      </div>

      {/* SG-fordeling */}
      <div
        className="border rounded-xl p-4"
        style={{ borderColor: "var(--color-line-soft)" }}
      >
        <MonoLabel>Slag spart per område</MonoLabel>
        <ul className="space-y-2 text-[12px] mt-2">
          {sgEntries.map((entry) => {
            const pct = (Math.abs(entry.value) / maxAbs) * 100;
            const isPositive = entry.value >= 0;
            return (
              <li key={entry.code} className="flex items-center gap-2">
                <span
                  className="w-12 font-mono uppercase text-[10px]"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  {entry.code}
                </span>
                <div
                  className="flex-1 h-2 rounded overflow-hidden"
                  style={{ background: "var(--color-line-soft)" }}
                >
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${pct}%`,
                      background: isPositive ? "var(--color-success)" : "var(--color-warning)",
                    }}
                  />
                </div>
                <span
                  className="w-10 text-right font-mono font-semibold"
                  style={{ color: isPositive ? "var(--color-success)" : "var(--color-warning)" }}
                >
                  {isPositive ? "+" : ""}
                  {entry.value.toFixed(1)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* DataGolf benchmark */}
      {golf.datagolfBenchmark && (
        <div
          className="mt-5 p-3 rounded-xl flex items-start gap-3"
          style={{
            background: "var(--color-primary-soft)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)",
          }}
        >
          <TrendingUp
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: "var(--color-primary)" }}
          />
          <div className="flex-1">
            <div
              className="text-[12px] font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Sammenligning med PGA-spillere
            </div>
            <div
              className="text-[11px] mt-0.5"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Ligner mest{" "}
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}>
                {golf.datagolfBenchmark.peerName}
              </span>{" "}
              — {golf.datagolfBenchmark.reason}.
            </div>
          </div>
        </div>
      )}
    </CardShell>
  );
}
