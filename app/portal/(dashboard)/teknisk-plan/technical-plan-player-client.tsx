"use client";

import { useState, useEffect, useTransition } from "react";
import { Target, ChevronRight, CheckCircle2, Circle, Clock, Trophy, Dumbbell, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogProgressModal } from "@/components/portal/technical-plan/log-progress-modal";
import { PlanHealthCard } from "@/components/portal/technical-plan";
import { ImportMatchModal } from "@/components/portal/trackman";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/portal/utils/cn";
import type { PhaseStatus, TechnicalPlanStatus, TrainingArea } from "@/lib/portal/technical-plan/types";

interface PlanSummary {
  id: string;
  title: string;
  status: TechnicalPlanStatus;
  startDate: string | null;
  endDate: string | null;
  coach: { name: string | null; image: string | null };
  phases: {
    id: string;
    phaseCode: string;
    title: string;
    status: PhaseStatus;
    area: TrainingArea;
    targetReps: number;
    targetHours: number | null;
    targetBalls: number | null;
    completedReps: number;
    completedHours: number;
    completedBalls: number;
    environment: string;
  }[];
}

const TRAINING_AREA_LABELS: Record<TrainingArea, string> = {
  TEE_OFF_THE_TEE: "Utslag",
  APPROACH_200_PLUS: "Approach 200+",
  APPROACH_150_200: "Approach 150–200",
  APPROACH_100_150: "Approach 100–150",
  APPROACH_50_100: "Approach 50–100",
  CHIP_PITCH_10_50: "Chip/Pitch 10–50",
  BUNKER: "Bunker",
  PUTTING: "Putting",
  COURSE_MANAGEMENT: "Bane-management",
  MENTAL_GAME: "Mentalt spill",
  PHYSICAL: "Fysisk",
};

const PHASE_STATUS_VARIANT: Record<PhaseStatus, string> = {
  NOT_STARTED: "bg-muted text-on-surface-variant",
  IN_PROGRESS: "bg-warning-light text-warning-text",
  COMPLETED: "bg-success-light text-success-text",
  SKIPPED: "bg-surface text-on-surface-variant line-through",
};

const PHASE_STATUS_LABELS: Record<PhaseStatus, string> = {
  NOT_STARTED: "Ikke startet",
  IN_PROGRESS: "Pågår",
  COMPLETED: "Fullført",
  SKIPPED: "Hoppet over",
};

interface TechnicalPlanPlayerClientProps {
  userId: string;
  userName: string | null;
}

export function TechnicalPlanPlayerClient({ userId }: TechnicalPlanPlayerClientProps) {
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [loggingPhase, setLoggingPhase] = useState<{
    planId: string;
    phaseId: string;
    title: string;
  } | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const fetchPlans = async () => {
    const res = await fetch("/api/portal/technical-plans");
    const data = await res.json();
    setPlans(data.plans ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-sm text-on-surface-variant">Laster tekniske planer...</div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-16">
          <Target className="w-12 h-12 text-on-surface-variant mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-on-surface mb-2">Ingen tekniske planer ennå</h2>
          <p className="text-sm text-on-surface-variant">
            Din trener vil opprette en individuell teknisk plan for deg.
          </p>
        </div>
      </div>
    );
  }

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-on-surface">Din tekniske plan</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Fase-basert utviklingsplan laget av din trener
        </p>
      </div>

      {selectedPlan ? (
        <PlanDetail
          plan={selectedPlan}
          onBack={() => setSelectedPlanId(null)}
          onLogPhase={(phaseId, title) =>
            setLoggingPhase({ planId: selectedPlan.id, phaseId, title })
          }
          onLogged={fetchPlans}
          onImportTrackMan={() => setShowImportModal(true)}
        />
      ) : (
        <div className="grid gap-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onClick={() => setSelectedPlanId(plan.id)} />
          ))}
        </div>
      )}

      {loggingPhase && (
        <LogProgressModal
          planId={loggingPhase.planId}
          phaseId={loggingPhase.phaseId}
          phaseTitle={loggingPhase.title}
          onClose={() => setLoggingPhase(null)}
          onLogged={() => {
            setLoggingPhase(null);
            fetchPlans();
          }}
        />
      )}

      {showImportModal && (
        <ImportMatchModal
          onClose={() => setShowImportModal(false)}
          onImported={() => {
            setShowImportModal(false);
            fetchPlans();
          }}
        />
      )}
    </div>
  );
}

function PlanCard({ plan, onClick }: { plan: PlanSummary; onClick: () => void }) {
  const progress =
    plan.phases.length > 0
      ? Math.round(
          (plan.phases.filter((p) => p.status === "COMPLETED").length / plan.phases.length) * 100
        )
      : 0;

  return (
    <Card
      onClick={onClick}
      className="p-5 cursor-pointer hover:shadow-md transition-shadow border border-outline-variant/30 rounded-2xl bg-surface"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-on-surface text-base">{plan.title}</h3>
          <p className="text-sm text-on-surface-variant">
            Trener: {plan.coach.name ?? "Ukjent"}
          </p>
        </div>
        <Badge
          variant={plan.status === "ACTIVE" ? "success" : "muted"}
          className="text-xs"
        >
          {plan.status === "ACTIVE" ? "Aktiv" : plan.status === "COMPLETED" ? "Fullført" : "Arkivert"}
        </Badge>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1.5">
          <span>Fremdrift</span>
          <span>
            {plan.phases.filter((p) => p.status === "COMPLETED").length} / {plan.phases.length} faser
          </span>
        </div>
        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary-fixed rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-3 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Circle className="w-3 h-3" />
            {plan.phases.filter((p) => p.status === "NOT_STARTED").length} ikke startet
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {plan.phases.filter((p) => p.status === "IN_PROGRESS").length} pågår
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-on-surface-variant" />
      </div>
    </Card>
  );
}

function PlanDetail({
  plan,
  onBack,
  onLogPhase,
  onLogged,
  onImportTrackMan,
}: {
  plan: PlanSummary;
  onBack: () => void;
  onLogPhase: (phaseId: string, title: string) => void;
  onLogged: () => void;
  onImportTrackMan: () => void;
}) {
  const progress =
    plan.phases.length > 0
      ? Math.round(
          (plan.phases.filter((p) => p.status === "COMPLETED").length / plan.phases.length) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-on-surface">{plan.title}</h2>
          <p className="text-sm text-on-surface-variant">
            {plan.coach.name ?? "Ukjent trener"}
          </p>
        </div>
      </div>

      <Card className="p-5 border border-outline-variant/30 rounded-2xl bg-surface">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-on-surface-variant">Total fremdrift</span>
          <span className="text-sm font-semibold text-on-surface">{progress}%</span>
        </div>
        <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary-fixed rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex gap-4 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Circle className="w-3 h-3" />
            {plan.phases.filter((p) => p.status === "NOT_STARTED").length} ikke startet
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {plan.phases.filter((p) => p.status === "IN_PROGRESS").length} pågår
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {plan.phases.filter((p) => p.status === "COMPLETED").length} fullført
          </span>
        </div>
      </Card>

      <div className="space-y-4">
        <PlanHealthCard planId={plan.id} />

        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-on-surface">Faser</h3>
          <Button size="sm" variant="ghost" onClick={onImportTrackMan}>
            <Brain className="w-3.5 h-3.5 mr-1.5" />
            Importer TrackMan
          </Button>
        </div>
        {plan.phases.length === 0 ? (
          <div className="text-center py-8 text-sm text-on-surface-variant">
            Ingen faser ennå
          </div>
        ) : (
          <div className="space-y-3">
            {plan.phases.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                onLog={() => onLogPhase(phase.id, phase.title)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PhaseCard({
  phase,
  onLog,
}: {
  phase: PlanSummary["phases"][number];
  onLog: () => void;
}) {
  const progressPct =
    phase.targetReps > 0
      ? Math.min(100, Math.round((phase.completedReps / phase.targetReps) * 100))
      : 0;

  return (
    <Card className="p-4 border border-outline-variant/30 rounded-2xl bg-surface">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
              {phase.phaseCode}
            </span>
            <h4 className="font-medium text-on-surface text-sm">{phase.title}</h4>
          </div>
          <div className="flex flex-wrap gap-2 mt-1.5">
            <Badge
              variant="secondary"
              className={cn("text-xs", PHASE_STATUS_VARIANT[phase.status])}
            >
              {PHASE_STATUS_LABELS[phase.status]}
            </Badge>
            <Badge variant="muted" className="text-xs">
              {TRAINING_AREA_LABELS[phase.area]}
            </Badge>
          </div>
        </div>
        {phase.status !== "COMPLETED" && (
          <Button size="sm" onClick={onLog} className="shrink-0">
            <Dumbbell className="w-3.5 h-3.5 mr-1.5" />
            Logg
          </Button>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {phase.targetReps > 0 && (
          <div>
            <div className="text-xs text-on-surface-variant mb-1">Reps</div>
            <div className="text-sm font-medium text-on-surface">
              {phase.completedReps} / {phase.targetReps}
            </div>
            <div className="h-1.5 bg-surface-container rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-secondary-fixed rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
        {phase.targetHours && phase.targetHours > 0 && (
          <div>
            <div className="text-xs text-on-surface-variant mb-1">Timer</div>
            <div className="text-sm font-medium text-on-surface">
              {phase.completedHours.toFixed(1)} / {phase.targetHours}h
            </div>
          </div>
        )}
        {phase.targetBalls && phase.targetBalls > 0 && (
          <div>
            <div className="text-xs text-on-surface-variant mb-1">Baller</div>
            <div className="text-sm font-medium text-on-surface">
              {phase.completedBalls} / {phase.targetBalls}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
