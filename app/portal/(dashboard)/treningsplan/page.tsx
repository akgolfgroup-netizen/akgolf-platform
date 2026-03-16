import { requirePortalUser } from "@/lib/portal/auth";
import { getActivePlan } from "./actions";
import { getLoggedSessionIds } from "@/app/portal/(dashboard)/dagbok/actions";
import { WeekView } from "@/components/portal/treningsplan/week-view";
import { AIGenerateButton } from "@/components/portal/treningsplan/ai-generate-button";
import { Topbar } from "@/components/portal/layout/topbar";
import { isStaff, hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";
import { Target, CalendarDays } from "lucide-react";

const THEME = {
  navy: "#0F2950",
  gold: "#B8975C",
  text: "#02060D",
  textSecondary: "#64748B",
  bg: "#FFFFFF",
  border: "#EBE5DA",
};

export default async function TreningsplanPage() {
  const user = await requirePortalUser();
  const plan = await getActivePlan();
  const canGenerate = isStaff(user?.role);
  const userTier = (user?.subscriptionTier ?? "FREE") as SubscriptionTier;
  const canLog = hasTierAccess(userTier, SubscriptionTier.PRO);
  const loggedSessionIds = canLog ? await getLoggedSessionIds() : [];

  return (
    <div>
      <Topbar title="Treningsplan" />
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-2xl font-semibold mb-1"
              style={{ color: THEME.navy }}
            >
              {plan ? plan.title : "Ingen aktiv treningsplan"}
            </h1>
            {plan && (
              <p 
                className="text-sm flex items-center gap-2"
                style={{ color: THEME.textSecondary }}
              >
                <CalendarDays className="w-4 h-4" style={{ color: THEME.gold }} />
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

        {!plan ? (
          <div 
            className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border"
            style={{ borderColor: THEME.border }}
          >
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: `${THEME.gold}15` }}
            >
              <Target className="w-10 h-10" style={{ color: THEME.gold }} />
            </div>
            <p style={{ color: THEME.textSecondary }}>
              {canGenerate
                ? "Klikk «Generer plan» for å lage en periodisert treningsplan."
                : "Ingen aktiv treningsplan. Kontakt din coach."}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {plan.weeks.map((week) => (
              <div
                key={week.id}
                className="rounded-3xl p-6 border"
                style={{ 
                  background: THEME.bg,
                  borderColor: THEME.border,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
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
