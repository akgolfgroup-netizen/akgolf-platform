import { requirePortalUser } from "@/lib/portal/auth";
import { getActivePlan } from "./actions";
import { getLoggedSessionIds } from "@/app/portal/(dashboard)/dagbok/actions";
import { WeekView } from "@/components/portal/treningsplan/week-view";
import { AIGenerateButton } from "@/components/portal/treningsplan/ai-generate-button";
import { isStaff, hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";
import { Target, CalendarDays } from "lucide-react";
import { PORTAL_EMPTY_STATES } from "@/lib/website-constants";

export default async function TreningsplanPage() {
  const user = await requirePortalUser();
  const plan = await getActivePlan();
  const canGenerate = isStaff(user?.role);
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;
  const canLog = hasTierAccess(userTier, SubscriptionTier.PRO);
  const loggedSessionIds = canLog ? await getLoggedSessionIds() : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-snow)]">
            {plan ? plan.title : "Ingen aktiv treningsplan"}
          </h1>
          {plan && (
            <p className="text-sm flex items-center gap-2 mt-1 text-[var(--color-ink-40)]">
              <CalendarDays className="w-4 h-4 text-[var(--color-gold)]" />
              <span className="capitalize">{plan.periodType}</span>
              <span>·</span>
              <span>{plan.weeks.length} uker</span>
            </p>
          )}
        </div>
        {canGenerate && (
          <AIGenerateButton studentId={user.id} />
        )}
      </div>

      {/* Content */}
      <div className="max-w-5xl">
        {!plan ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)]">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 bg-[var(--color-gold)]/15">
              <Target className="w-10 h-10 text-[var(--color-gold)]" />
            </div>
            <p className="text-[var(--color-ink-40)]">
              {canGenerate
                ? PORTAL_EMPTY_STATES.treningsplan.description
                : "Ingen aktiv treningsplan. Kontakt din coach."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {plan.weeks.map((week) => (
              <div
                key={week.id}
                className="rounded-2xl p-6 bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)]"
              >
                <WeekView
                  week={week}
                  loggedSessionIds={loggedSessionIds}
                  showCompleteButton={canLog}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
