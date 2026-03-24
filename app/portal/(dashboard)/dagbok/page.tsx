import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs } from "./actions";
import { TrainingLogCard } from "@/components/portal/dagbok/training-log-card";
import { DagbokActions } from "@/components/portal/dagbok/dagbok-actions";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { SubscriptionTier } from "@prisma/client";
import { NotebookPen, CalendarDays, Info } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { PORTAL_EMPTY_STATES, PORTAL_CONTENT } from "@/lib/website-constants";

export default async function DagbokPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;

  const logs = await getTrainingLogs();

  // Group logs by date
  const grouped = new Map<string, typeof logs>();
  for (const log of logs) {
    const key = format(new Date(log.date), "yyyy-MM-dd");
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(log);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-snow)]">Treningsdagbok</h1>
      <div className="max-w-2xl">
        <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-snow)]">
                  Denne måneden
                </h2>
                <p className="text-xs text-[var(--color-gold-muted)] mt-0.5">
                  {logs.length} {logs.length === 1 ? "økt" : "økter"} logget
                </p>
              </div>
              <DagbokActions />
            </div>

            {/* SLAG Info */}
            <details className="rounded-2xl border overflow-hidden mb-6" style={{ background: "rgba(10,25,41,0.5)", borderColor: "rgba(15,41,80,0.6)" }}>
              <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors">
                <Info className="w-4 h-4 text-[var(--color-gold)]" />
                <span className="text-sm font-medium text-[var(--color-snow)]">Om treningskategorier (SLAG)</span>
              </summary>
              <div className="px-4 pb-4 pt-2 border-t border-[rgba(15,41,80,0.6)]">
                <p className="text-xs text-[var(--color-gold-muted)] mb-3">
                  {PORTAL_CONTENT.dagbok.whyLog}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PORTAL_CONTENT.dagbok.slagCategories.map((cat) => (
                    <div key={cat.key} className="rounded-lg p-2.5 bg-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 rounded-md bg-[var(--color-gold)]/20 flex items-center justify-center text-xs font-bold text-[var(--color-gold)]">
                          {cat.key}
                        </span>
                        <span className="text-xs font-medium text-[var(--color-snow)]">{cat.name}</span>
                      </div>
                      <p className="text-[10px] text-[var(--color-gold-muted)] leading-relaxed">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <NotebookPen className="w-10 h-10 text-[var(--color-border)] mb-3" />
                <p className="text-sm font-medium text-[var(--color-snow)] mb-1">
                  {PORTAL_EMPTY_STATES.dagbok.title}
                </p>
                <p className="text-sm text-[var(--color-gold-muted)]">
                  {PORTAL_EMPTY_STATES.dagbok.description}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Array.from(grouped.entries()).map(([dateKey, dayLogs]) => (
                  <div key={dateKey}>
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays className="w-3.5 h-3.5 text-[var(--color-gold-dim)]" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-gold-dim)]">
                        {format(new Date(dateKey), "EEEE d. MMMM", { locale: nb })}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {dayLogs.map((log) => (
                        <TrainingLogCard key={log.id} log={log} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        </TierGate>
      </div>
    </div>
  );
}

