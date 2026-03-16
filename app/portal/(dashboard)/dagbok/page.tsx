import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs } from "./actions";
import { Topbar } from "@/components/portal/layout/topbar";
import { TrainingLogCard } from "@/components/portal/dagbok/training-log-card";
import { DagbokActions } from "@/components/portal/dagbok/dagbok-actions";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { SubscriptionTier } from "@prisma/client";
import { NotebookPen, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

export default async function DagbokPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "FREE") as SubscriptionTier;

  const logs = await getTrainingLogs();

  // Group logs by date
  const grouped = new Map<string, typeof logs>();
  for (const log of logs) {
    const key = format(new Date(log.date), "yyyy-MM-dd");
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(log);
  }

  return (
    <div>
      <Topbar title="Treningsdagbok" />
      <div className="p-6 max-w-2xl">
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

            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <NotebookPen className="w-10 h-10 text-[var(--color-border)] mb-3" />
                <p className="text-sm text-[var(--color-gold-muted)]">
                  Ingen loggede økter denne måneden.
                </p>
                <p className="text-xs text-[var(--color-gold-dim)]/50 mt-1">
                  Bruk «Logg økt»-knappen eller marker en treningssesjon som fullført.
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
