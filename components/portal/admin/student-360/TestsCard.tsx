import type { TestsGroup } from "@/app/admin/(authed)/elever/[id]/v2/get-student-360";
import { CardShell } from "./shell";

interface TestsCardProps {
  tests: TestsGroup;
}

export function TestsCard({ tests }: TestsCardProps) {
  return (
    <CardShell label="Tester (DECADE-protokoll)" title="Resultater + retest" actionLabel="Alle">
      {tests.results.length === 0 ? (
        <div
          className="text-[13px] py-3"
          style={{ color: "var(--color-ink-subtle)" }}
        >
          Ingen tester loggført ennå.
        </div>
      ) : (
        <ul className="space-y-3 text-[13px]">
          {tests.results.map((t) => (
            <li
              key={t.id}
              className="p-3 rounded-lg cursor-pointer transition-colors"
              style={{ border: "1px solid var(--color-line-soft)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="font-semibold"
                  style={{ color: "var(--color-ink)" }}
                >
                  {t.testName}
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{ color: t.isPersonalBest ? "var(--color-success)" : "var(--color-ink)" }}
                >
                  {t.value}
                  {t.isPersonalBest && " ★"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span style={{ color: "var(--color-ink-muted)" }}>
                  Sist:{" "}
                  {t.completedAt.toLocaleDateString("nb-NO", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span
                  className="font-mono"
                  style={{
                    color: t.isOverdue
                      ? "var(--color-danger)"
                      : "var(--color-warning)",
                  }}
                >
                  {t.isOverdue
                    ? "Forsinket retest!"
                    : t.nextRetestAt
                    ? `Retest: ${t.nextRetestAt.toLocaleDateString("nb-NO", {
                        day: "numeric",
                        month: "short",
                      })}`
                    : "Ingen retest planlagt"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}
