"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Target,
  Plus,
  ChevronLeft,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Clock,
  Trophy,
  Trash2,
  Save,
  X,
  User,
  Brain,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { AdminPageHeader, AdminEmptyState } from "@/components/portal/mission-control/ui";
import { cn } from "@/lib/portal/utils/cn";
import type { TrainingArea, PhaseStatus, TechnicalPlanStatus } from "@/lib/portal/technical-plan/types";
import { PlanHealthCard } from "@/components/portal/technical-plan";
import type { TechnicalPlanSummary, DrillOption } from "./actions";
import {
  createTechnicalPlanAction,
  createPhaseAction,
  updatePhaseAction,
  deletePhaseAction,
  deleteTechnicalPlanAction,
  updateTechnicalPlanAction,
} from "./actions";

// ─── Constants ───────────────────────────────────────────────────────

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
  NOT_STARTED: "bg-ink-subtle/10 text-ink-muted",
  IN_PROGRESS: "bg-warning/10 text-warning",
  COMPLETED: "bg-success/10 text-success",
  SKIPPED: "bg-line/20 text-ink-muted line-through",
};

const PHASE_STATUS_LABELS: Record<PhaseStatus, string> = {
  NOT_STARTED: "Ikke startet",
  IN_PROGRESS: "Pågår",
  COMPLETED: "Fullført",
  SKIPPED: "Hoppet over",
};

const ENVIRONMENT_LABELS: Record<string, string> = {
  M1: "M1 — Range/øvingsfelt",
  M2: "M2 — Simulator",
  M3: "M3 — Bane (trening)",
  M4: "M4 — Bane (konkurranse)",
};

// ─── Props ───────────────────────────────────────────────────────────

interface TekniskPlanClientProps {
  plans: TechnicalPlanSummary[];
  players: { id: string; name: string | null; email: string | null }[];
  drills: DrillOption[];
  initialPlanId?: string;
  initialPlayerId?: string;
}

// ─── Main Component ──────────────────────────────────────────────────

export function TekniskPlanClient({
  plans,
  players,
  drills,
  initialPlanId,
  initialPlayerId,
}: TekniskPlanClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    initialPlanId ?? null
  );
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  if (selectedPlan) {
    return (
      <PlanDetailView
        plan={selectedPlan}
        players={players}
        drills={drills}
        onBack={() => {
          setSelectedPlanId(null);
          router.push("/admin/teknisk-plan");
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Individuell Teknisk Plan"
        subtitle="Fase-baserte utviklingsplaner for spillere"
        actions={
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-primary text-white hover:bg-primary-hover"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ny plan
          </Button>
        }
      />

      {showCreate && (
        <CreatePlanForm
          players={players}
          onCancel={() => setShowCreate(false)}
          onCreated={(planId) => {
            setShowCreate(false);
            setSelectedPlanId(planId);
            router.push(`/admin/teknisk-plan?planId=${planId}`);
          }}
        />
      )}

      {plans.length === 0 ? (
        <AdminEmptyState
          icon={<Target className="w-8 h-8 text-ink-muted" />}
          title="Ingen tekniske planer"
          description="Opprett din første individuelle tekniske plan for en spiller."
        />
      ) : (
        <div className="grid gap-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onClick={() => {
                setSelectedPlanId(plan.id);
                router.push(`/admin/teknisk-plan?planId=${plan.id}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Plan Card ───────────────────────────────────────────────────────

function PlanCard({
  plan,
  onClick,
}: {
  plan: TechnicalPlanSummary;
  onClick: () => void;
}) {
  const progress =
    plan.phaseCount > 0
      ? Math.round((plan.completedPhases / plan.phaseCount) * 100)
      : 0;

  return (
    <Card
      onClick={onClick}
      className="p-5 cursor-pointer hover:shadow-card-hover transition-shadow border border-line rounded-xl"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-ink text-base">{plan.title}</h3>
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <User className="w-3.5 h-3.5" />
            <span>{plan.player.name ?? "Ukjent spiller"}</span>
          </div>
        </div>
        <Badge
          variant={plan.status === "ACTIVE" ? "default" : "secondary"}
          className={cn(
            plan.status === "ACTIVE" && "bg-primary-soft text-primary-deep"
          )}
        >
          {plan.status === "ACTIVE" ? "Aktiv" : plan.status === "COMPLETED" ? "Fullført" : "Arkivert"}
        </Badge>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-ink-muted mb-1.5">
          <span>Fremdrift</span>
          <span>
            {plan.completedPhases} / {plan.phaseCount} faser
          </span>
        </div>
        <div className="h-2 bg-surface-soft rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-ink-subtle">
        {plan.startDate && (
          <span>{format(new Date(plan.startDate), "d. MMM yyyy", { locale: nb })}</span>
        )}
        {plan.endDate && (
          <span>→ {format(new Date(plan.endDate), "d. MMM yyyy", { locale: nb })}</span>
        )}
      </div>
    </Card>
  );
}

// ─── Create Plan Form ────────────────────────────────────────────────

function CreatePlanForm({
  players,
  onCancel,
  onCreated,
}: {
  players: { id: string; name: string | null; email: string | null }[];
  onCancel: () => void;
  onCreated: (planId: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [playerId, setPlayerId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!playerId || !title) return;
    startTransition(async () => {
      const plan = await createTechnicalPlanAction({
        playerId,
        title,
        description,
      });
      onCreated(plan.id);
    });
  };

  return (
    <Card className="p-6 border border-line rounded-xl">
      <h3 className="font-semibold text-ink mb-4">Ny teknisk plan</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-muted mb-1.5">
            Spiller
          </label>
          <select
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Velg spiller...</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name ?? p.email ?? "Ukjent"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-muted mb-1.5">
            Tittel
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="f.eks. Vinterprogram 2026 — Teknisk"
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-muted mb-1.5">
            Beskrivelse
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Avbryt
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!playerId || !title || isPending}
            className="bg-primary text-white hover:bg-primary-hover"
          >
            {isPending ? "Oppretter..." : "Opprett plan"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ─── Plan Detail View ────────────────────────────────────────────────

function PlanDetailView({
  plan,
  players,
  drills,
  onBack,
}: {
  plan: TechnicalPlanSummary;
  players: { id: string; name: string | null; email: string | null }[];
  drills: DrillOption[];
  onBack: () => void;
}) {
  const [phases, setPhases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPhase, setShowAddPhase] = useState(false);

  const fetchPlan = async () => {
    const res = await fetch(`/api/portal/admin/technical-plans/${plan.id}`);
    const data = await res.json();
    if (data.plan) {
      setPhases(data.plan.phases);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlan();
  }, [plan.id]);

  const progress =
    phases.length > 0
      ? Math.round(
          (phases.filter((p) => p.status === "COMPLETED").length /
            phases.length) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-ink">{plan.title}</h2>
          <p className="text-sm text-ink-muted">
            {plan.player.name ?? "Ukjent spiller"}
          </p>
        </div>
      </div>

      {/* Progress overview */}
      <Card className="p-5 border border-line rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-ink-muted">Total fremdrift</span>
          <span className="text-sm font-semibold text-ink">{progress}%</span>
        </div>
        <div className="h-2.5 bg-surface-soft rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex gap-4 text-xs text-ink-subtle">
          <span className="flex items-center gap-1">
            <Circle className="w-3 h-3" />
            {phases.filter((p) => p.status === "NOT_STARTED").length} ikke startet
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {phases.filter((p) => p.status === "IN_PROGRESS").length} pågår
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {phases.filter((p) => p.status === "COMPLETED").length} fullført
          </span>
        </div>
      </Card>

      {/* Health overview */}
      <PlanHealthCard planId={plan.id} />

      {/* Phases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink">Faser</h3>
          <Button
            size="sm"
            onClick={() => setShowAddPhase(true)}
            className="bg-primary text-white hover:bg-primary-hover"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Legg til fase
          </Button>
        </div>

        {showAddPhase && (
          <AddPhaseForm
            planId={plan.id}
            nextOrder={phases.length}
            drills={drills}
            onCancel={() => setShowAddPhase(false)}
            onAdded={() => {
              setShowAddPhase(false);
              fetchPlan();
            }}
          />
        )}

        {loading ? (
          <div className="text-sm text-ink-muted py-8 text-center">Laster faser...</div>
        ) : phases.length === 0 ? (
          <AdminEmptyState
            icon={<Target className="w-8 h-8 text-ink-muted" />}
            title="Ingen faser ennå"
            description="Legg til den første fasen for denne planen."
          />
        ) : (
          <div className="space-y-3">
            {phases.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                drills={drills}
                onUpdated={fetchPlan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Phase Card ──────────────────────────────────────────────────────

interface PhaseWithDrill {
  id: string;
  phaseCode: string;
  title: string;
  description: string | null;
  status: PhaseStatus;
  area: TrainingArea;
  environment: string;
  targetReps: number;
  targetHours: number | null;
  targetBalls: number | null;
  completedReps: number;
  completedHours: number;
  completedBalls: number;
  drill: { name: string } | null;
  sessions: { id: string; createdAt: string; repsDone: number; qualityScore: number | null }[];
}

function PhaseCard({
  phase,
  drills,
  onUpdated,
}: {
  phase: PhaseWithDrill;
  drills: DrillOption[];
  onUpdated: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const progressPct =
    phase.targetReps > 0
      ? Math.min(100, Math.round((phase.completedReps / phase.targetReps) * 100))
      : 0;

  if (isEditing) {
    return (
      <PhaseEditForm
        phase={phase}
        drills={drills}
        onCancel={() => setIsEditing(false)}
        onSaved={() => {
          setIsEditing(false);
          onUpdated();
        }}
      />
    );
  }

  return (
    <Card className="p-4 border border-line rounded-xl">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink-subtle bg-surface-soft px-1.5 py-0.5 rounded">
              {phase.phaseCode}
            </span>
            <h4 className="font-medium text-ink text-sm">{phase.title}</h4>
          </div>
          {phase.description && (
            <p className="text-xs text-ink-muted line-clamp-2">{phase.description}</p>
          )}
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
            {phase.environment && (
              <Badge variant="muted" className="text-xs">
                {ENVIRONMENT_LABELS[phase.environment] ?? phase.environment}
              </Badge>
            )}
            {phase.drill?.name && (
              <Badge variant="info" className="text-xs">
                {phase.drill.name}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsEditing(true)}
          >
            <MoreHorizontal className="w-4 h-4 text-ink-muted" />
          </Button>
        </div>
      </div>

      {/* Targets */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {phase.targetReps > 0 && (
          <div>
            <div className="text-xs text-ink-subtle mb-1">Reps</div>
            <div className="text-sm font-medium text-ink">
              {phase.completedReps} / {phase.targetReps}
            </div>
            <div className="h-1.5 bg-surface-soft rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
        {phase.targetHours && phase.targetHours > 0 && (
          <div>
            <div className="text-xs text-ink-subtle mb-1">Timer</div>
            <div className="text-sm font-medium text-ink">
              {phase.completedHours.toFixed(1)} / {phase.targetHours}h
            </div>
          </div>
        )}
        {phase.targetBalls && phase.targetBalls > 0 && (
          <div>
            <div className="text-xs text-ink-subtle mb-1">Baller</div>
            <div className="text-sm font-medium text-ink">
              {phase.completedBalls} / {phase.targetBalls}
            </div>
          </div>
        )}
      </div>

      {/* Recent sessions */}
      {phase.sessions && phase.sessions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-line-soft">
          <div className="text-xs text-ink-subtle mb-2">Siste økter</div>
          <div className="space-y-1.5">
            {phase.sessions.slice(0, 3).map((s: any) => (
              <div
                key={s.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-ink-muted">
                  {format(new Date(s.createdAt), "d. MMM", { locale: nb })}
                </span>
                <span className="text-ink">
                  {s.repsDone} reps
                  {s.qualityScore ? ` · Kvalitet ${s.qualityScore}/10` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Add Phase Form ──────────────────────────────────────────────────

function AddPhaseForm({
  planId,
  nextOrder,
  drills,
  onCancel,
  onAdded,
}: {
  planId: string;
  nextOrder: number;
  drills: DrillOption[];
  onCancel: () => void;
  onAdded: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [phaseCode, setPhaseCode] = useState(`P${nextOrder + 1}.0`);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState<TrainingArea>("PUTTING");
  const [environment, setEnvironment] = useState("M1");
  const [targetReps, setTargetReps] = useState(100);
  const [targetHours, setTargetHours] = useState<number | "">("");
  const [targetBalls, setTargetBalls] = useState<number | "">("");
  const [drillId, setDrillId] = useState("");

  const handleSubmit = () => {
    startTransition(async () => {
      await createPhaseAction({
        planId,
        phaseCode,
        title,
        description,
        order: nextOrder,
        drillId: drillId || undefined,
        area,
        environment,
        targetReps,
        targetHours: typeof targetHours === "number" ? targetHours : undefined,
        targetBalls: typeof targetBalls === "number" ? targetBalls : undefined,
      });
      onAdded();
    });
  };

  return (
    <Card className="p-5 border border-primary/20 rounded-xl bg-primary-soft/30">
      <h4 className="font-medium text-ink mb-4">Ny fase</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Fasekode</label>
          <input
            value={phaseCode}
            onChange={(e) => setPhaseCode(e.target.value)}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Tittel</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="f.eks. Putting-rutine"
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-ink-muted mb-1">Beskrivelse</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Område</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value as TrainingArea)}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Object.entries(TRAINING_AREA_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Miljø</label>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Object.entries(ENVIRONMENT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Drill (valgfri)</label>
          <select
            value={drillId}
            onChange={(e) => setDrillId(e.target.value)}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Ingen drill / Custom</option>
            {drills
              .filter((d) => d.category === area)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3 col-span-2">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Mål-reps</label>
            <input
              type="number"
              value={targetReps}
              onChange={(e) => setTargetReps(Number(e.target.value))}
              className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Mål-timer</label>
            <input
              type="number"
              step="0.5"
              value={targetHours}
              onChange={(e) =>
                setTargetHours(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Mål-baller</label>
            <input
              type="number"
              value={targetBalls}
              onChange={(e) =>
                setTargetBalls(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Avbryt
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!title || !phaseCode || isPending}
          className="bg-primary text-white hover:bg-primary-hover"
        >
          {isPending ? "Lagrer..." : "Lagre fase"}
        </Button>
      </div>
    </Card>
  );
}

// ─── Phase Edit Form ─────────────────────────────────────────────────

function PhaseEditForm({
  phase,
  drills,
  onCancel,
  onSaved,
}: {
  phase: any;
  drills: DrillOption[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(phase.title);
  const [description, setDescription] = useState(phase.description ?? "");
  const [area, setArea] = useState<TrainingArea>(phase.area);
  const [environment, setEnvironment] = useState(phase.environment);
  const [targetReps, setTargetReps] = useState(phase.targetReps);
  const [targetHours, setTargetHours] = useState<number | "">(phase.targetHours ?? "");
  const [targetBalls, setTargetBalls] = useState<number | "">(phase.targetBalls ?? "");
  const [drillId, setDrillId] = useState(phase.drillId ?? "");
  const [status, setStatus] = useState<PhaseStatus>(phase.status);

  const handleSubmit = () => {
    startTransition(async () => {
      await updatePhaseAction(phase.id, {
        title,
        description,
        area,
        environment,
        targetReps,
        targetHours: typeof targetHours === "number" ? targetHours : undefined,
        targetBalls: typeof targetBalls === "number" ? targetBalls : undefined,
        drillId: drillId || undefined,
        status,
      });
      onSaved();
    });
  };

  const handleDelete = () => {
    if (!confirm("Slette denne fasen?")) return;
    startTransition(async () => {
      await deletePhaseAction(phase.id);
      onSaved();
    });
  };

  return (
    <Card className="p-5 border border-primary/20 rounded-xl bg-primary-soft/30">
      <h4 className="font-medium text-ink mb-4">Rediger fase</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Tittel</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PhaseStatus)}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Object.entries(PHASE_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-ink-muted mb-1">Beskrivelse</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Område</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value as TrainingArea)}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Object.entries(TRAINING_AREA_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Miljø</label>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Object.entries(ENVIRONMENT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Drill</label>
          <select
            value={drillId}
            onChange={(e) => setDrillId(e.target.value)}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Ingen drill / Custom</option>
            {drills
              .filter((d) => d.category === area)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3 col-span-2">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Mål-reps</label>
            <input
              type="number"
              value={targetReps}
              onChange={(e) => setTargetReps(Number(e.target.value))}
              className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Mål-timer</label>
            <input
              type="number"
              step="0.5"
              value={targetHours}
              onChange={(e) =>
                setTargetHours(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Mål-baller</label>
            <input
              type="number"
              value={targetBalls}
              onChange={(e) =>
                setTargetBalls(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-danger">
          <Trash2 className="w-4 h-4 mr-1.5" />
          Slett
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Avbryt
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-primary text-white hover:bg-primary-hover"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {isPending ? "Lagrer..." : "Lagre"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
