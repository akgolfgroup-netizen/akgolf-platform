"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, ChevronRight, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MyelinItem {
  phaseId: string;
  phaseTitle: string;
  daysSinceLastSession: number;
  daysSinceFormatted: string;
  status: "warning" | "critical" | "decayed";
}

interface PlanMyelin {
  planId: string;
  planTitle: string;
  playerName: string;
  playerId: string;
  items: MyelinItem[];
  summary: {
    healthy: number;
    warning: number;
    critical: number;
    decayed: number;
  };
}

interface CoachMyelinOverviewProps {
  maxPlayers?: number;
}

/**
 * Coach-oversikt over spillere med myelin-problemer.
 *
 * Henter alle planer for innlogget coach, deretter myelin-status
 * per plan. Viser prioritert liste over spillere som trenger
 * oppfølging (decayed → critical → warning).
 */
export function CoachMyelinOverview({ maxPlayers = 5 }: CoachMyelinOverviewProps) {
  const [plans, setPlans] = useState<PlanMyelin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Hent alle planer for coach
        const plansRes = await fetch("/api/portal/admin/technical-plans");
        const plansData = await plansRes.json();
        const coachPlans = (plansData.plans ?? []).filter(
          (p: { status: string }) => p.status === "ACTIVE"
        );

        // 2. Hent myelin-status per plan
        const results: PlanMyelin[] = [];
        for (const plan of coachPlans) {
          const myelinRes = await fetch(
            `/api/portal/technical-plans/${plan.id}/myelin`
          );
          if (!myelinRes.ok) continue;
          const myelin = await myelinRes.json();
          if (myelin.items && myelin.items.length > 0) {
            results.push({
              planId: plan.id,
              planTitle: plan.title,
              playerName: plan.player?.name ?? "Ukjent spiller",
              playerId: plan.player_id,
              items: myelin.items,
              summary: myelin.summary,
            });
          }
        }

        // 3. Sorter etter alvorlighetsgrad
        const severity = { decayed: 3, critical: 2, warning: 1 };
        results.sort((a, b) => {
          const aMax = Math.max(...a.items.map((i) => severity[i.status]));
          const bMax = Math.max(...b.items.map((i) => severity[i.status]));
          return bMax - aMax;
        });

        setPlans(results.slice(0, maxPlayers));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maxPlayers]);

  if (loading) {
    return (
      <Card className="p-5 border border-line rounded-xl bg-sidebar/50">
        <div className="h-4 bg-white/5 animate-pulse rounded w-1/3 mb-3" />
        <div className="h-2 bg-white/5 animate-pulse rounded-full w-full" />
      </Card>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="p-5 border border-line rounded-xl bg-sidebar/50">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-success" />
          <div>
            <h3 className="font-medium text-white text-sm">Myelin-status</h3>
            <p className="text-xs text-white/50 mt-0.5">
              Alle spillere er innenfor optimal treningsfrekvens
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 border border-line rounded-xl bg-sidebar/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-medium text-white text-sm">
            {plans.length} spiller{plans.length > 1 ? "e" : ""} trenger oppfølging
          </h3>
        </div>
        <Link
          href="/admin/teknisk-plan"
          className="text-xs text-white/60 hover:text-white flex items-center gap-0.5"
        >
          Se alle <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {plans.map((plan) => {
          const worst = plan.items[0];
          const color =
            worst.status === "decayed"
              ? "text-danger"
              : worst.status === "critical"
                ? "text-warning"
                : "text-white/60";

          return (
            <Link
              key={plan.planId}
              href={`/admin/teknisk-plan?plan=${plan.planId}`}
              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors no-underline"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {plan.playerName}
                </p>
                <p className="text-xs text-white/50">
                  {worst.phaseTitle} · {worst.daysSinceFormatted}
                </p>
              </div>
              <span className={`text-xs font-mono shrink-0 ${color}`}>
                {plan.items.length} fase{plan.items.length > 1 ? "r" : ""}
              </span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
