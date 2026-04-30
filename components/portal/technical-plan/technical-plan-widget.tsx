"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Target, ChevronRight, CheckCircle2, Circle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/portal/utils/cn";

interface PhaseSummary {
  id: string;
  phaseCode: string;
  title: string;
  status: string;
  area: string;
  targetReps: number;
  completedReps: number;
}

interface PlanSummary {
  id: string;
  title: string;
  status: string;
  phases: PhaseSummary[];
}

export function TechnicalPlanWidget() {
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/technical-plans")
      .then((r) => r.json())
      .then((data) => {
        setPlans(data.plans ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="p-5 border border-line rounded-xl">
        <div className="h-4 bg-surface-soft animate-pulse rounded w-1/3 mb-3" />
        <div className="h-2 bg-surface-soft animate-pulse rounded-full w-full" />
      </Card>
    );
  }

  const activePlans = plans.filter((p) => p.status === "ACTIVE");

  if (activePlans.length === 0) {
    return (
      <Card className="p-5 border border-line rounded-xl">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-ink-muted" />
          <div>
            <h3 className="font-medium text-ink text-sm">Teknisk plan</h3>
            <p className="text-xs text-ink-muted mt-0.5">Ingen aktive planer</p>
          </div>
        </div>
      </Card>
    );
  }

  const plan = activePlans[0];
  const totalPhases = plan.phases.length;
  const completedPhases = plan.phases.filter((p) => p.status === "COMPLETED").length;
  const progressPct = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  return (
    <Card className="p-5 border border-line rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-ink text-sm">{plan.title}</h3>
        </div>
        <Link
          href="/portal/teknisk-plan"
          className="text-xs text-primary hover:underline flex items-center gap-0.5"
        >
          Se detaljer <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
        <span>Fremdrift</span>
        <span>
          {completedPhases} / {totalPhases} faser
        </span>
      </div>
      <div className="h-2 bg-surface-soft rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="space-y-2">
        {plan.phases.slice(0, 3).map((phase) => (
          <div key={phase.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              {phase.status === "COMPLETED" ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              ) : phase.status === "IN_PROGRESS" ? (
                <Clock className="w-4 h-4 text-warning shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-ink-subtle shrink-0" />
              )}
              <span className="text-ink truncate">{phase.title}</span>
            </div>
            <span className="text-xs text-ink-muted shrink-0">
              {phase.targetReps > 0 && `${phase.completedReps}/${phase.targetReps} reps`}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
