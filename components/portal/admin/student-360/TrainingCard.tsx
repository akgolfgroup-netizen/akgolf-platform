import { Bookmark } from "lucide-react";
import type { TrainingGroup } from "@/app/admin/(authed)/elever/[id]/v2/get-student-360";
import { CardShell, MonoLabel } from "./shell";

interface TrainingCardProps {
  training: TrainingGroup;
}

export function TrainingCard({ training }: TrainingCardProps) {
  return (
    <CardShell label="Trening" title="Aktiv plan">
      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <Stat value={training.hoursPerWeek.toFixed(1)} label="t / uke" />
        <Stat value={String(training.drillsActive)} label="drills" />
        <Stat
          value={`${training.completionPct}%`}
          label="fullført"
          color="success"
        />
      </div>

      <MonoLabel>Aktive øvelser ({training.drills.length})</MonoLabel>
      <ul className="space-y-2 text-[12px] mt-2">
        {training.drills.length === 0 && (
          <li
            className="py-2"
            style={{ color: "var(--color-ink-subtle)" }}
          >
            Ingen øvelser planlagt — lag fra mal eller bygg fra bunnen.
          </li>
        )}
        {training.drills.map((d) => (
          <li
            key={d.id}
            className="flex items-center gap-2 p-2 -mx-1 rounded cursor-pointer transition-colors"
          >
            <Bookmark
              className="w-3.5 h-3.5"
              style={{ color: "var(--color-primary)" }}
            />
            <span className="flex-1" style={{ color: "var(--color-ink)" }}>
              {d.name}
            </span>
            <span
              className="font-mono text-[10px]"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {d.phase}
            </span>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

function Stat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color?: "success";
}) {
  const valueColor = color === "success" ? "var(--color-success)" : "var(--color-ink)";
  return (
    <div
      className="p-3 rounded-lg text-center"
      style={{ background: "var(--color-surface)" }}
    >
      <div
        className="font-semibold text-[20px]"
        style={{ fontFamily: "var(--font-mono)", color: valueColor }}
      >
        {value}
      </div>
      <div
        className="text-[10px] font-mono uppercase"
        style={{ letterSpacing: "0.12em", color: "var(--color-ink-subtle)" }}
      >
        {label}
      </div>
    </div>
  );
}
