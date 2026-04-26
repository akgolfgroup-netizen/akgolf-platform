import { ChevronRight } from "lucide-react";
import type { CoachingGroup } from "@/app/admin/(authed)/elever/[id]/v2/get-student-360";
import { CardShell } from "./shell";

interface CoachingCardProps {
  coaching: CoachingGroup;
}

export function CoachingCard({ coaching }: CoachingCardProps) {
  return (
    <CardShell
      label="Coaching"
      title="Siste økter + AI-innsikt"
      actionLabel={`Alle ${coaching.lastFiveSessions.length}+ økter`}
    >
      <ul className="space-y-2.5">
        {coaching.lastFiveSessions.length === 0 && (
          <li className="text-[13px] py-3" style={{ color: "var(--color-ink-subtle)" }}>
            Ingen økter ennå.
          </li>
        )}
        {coaching.lastFiveSessions.map((s) => {
          const day = s.date.toLocaleDateString("nb-NO", { day: "numeric" });
          const month = s.date.toLocaleDateString("nb-NO", { month: "short" });
          return (
            <li
              key={s.id}
              className="flex items-center gap-3 p-3 -mx-2 rounded-lg cursor-pointer transition-colors"
              style={{ borderRadius: "8px" }}
            >
              <div className="w-12 text-center shrink-0">
                <div
                  className="text-[10px] font-mono uppercase"
                  style={{ letterSpacing: "0.12em", color: "var(--color-ink-subtle)" }}
                >
                  {month}
                </div>
                <div
                  className="font-semibold text-lg"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {day}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[14px] font-semibold truncate"
                  style={{ color: "var(--color-ink)" }}
                >
                  {s.title}
                </div>
                <div
                  className="text-[12px] mt-0.5"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  {s.instructorName} · {s.durationMinutes} min
                  {s.location && ` · ${s.location}`}
                </div>
              </div>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono"
                style={{
                  background: s.publishedToStudent
                    ? "var(--color-success-soft, #E0EFE7)"
                    : "var(--color-warning-soft, #F6ECD9)",
                  color: s.publishedToStudent
                    ? "var(--color-success)"
                    : "var(--color-warning)",
                }}
              >
                {s.publishedToStudent ? "Publisert" : "Utkast"}
              </span>
              <ChevronRight
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--color-ink-subtle)" }}
              />
            </li>
          );
        })}
      </ul>

      {/* Neste økt */}
      {coaching.nextSession && (
        <div
          className="mt-5 p-4 rounded-xl"
          style={{
            background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)",
          }}
        >
          <div
            className="text-[10px] font-mono uppercase mb-1"
            style={{
              letterSpacing: "0.12em",
              color: "var(--color-primary)",
              fontWeight: 600,
            }}
          >
            Neste · {coaching.nextSession.startTime.toLocaleString("nb-NO", { weekday: "short", hour: "2-digit", minute: "2-digit" })}
          </div>
          <div
            className="text-[16px] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {coaching.nextSession.title}
          </div>
          <div
            className="text-[12px] mt-0.5"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {coaching.nextSession.location ?? "Lokasjon ikke satt"} ·{" "}
            {coaching.nextSession.durationMinutes} min
          </div>
        </div>
      )}

      {/* Fokusområder */}
      {coaching.focusAreas.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {coaching.focusAreas.map((area) => (
            <span
              key={area}
              className="inline-flex items-center px-2 py-0.5 rounded text-[11px]"
              style={{
                background: "var(--color-surface-soft, #EDF1EE)",
                color: "var(--color-ink-muted)",
              }}
            >
              {area}
            </span>
          ))}
        </div>
      )}
    </CardShell>
  );
}
