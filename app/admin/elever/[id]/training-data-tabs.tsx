"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Calendar,
  BookOpen,
  BarChart3,
  TrendingDown,
  Target,
  Zap,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminBadge,
  AdminSelect,
  AdminTable,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableHeaderCell,
  AdminTableCell,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import {
  getStudentTrainingPlan,
  getStudentTrainingLogs,
  getStudentRoundStats,
  getStudentDegradation,
  getStudentLPhases,
  getStudentTrackManSessions,
  addCoachNote,
  setStudentLPhase,
} from "./student-training-actions";

interface Props {
  studentId: string;
  studentName: string;
}

type TabId = "plan" | "dagbok" | "stats" | "foundation" | "runder" | "trackman";

const TABS: { id: TabId; label: string; icon: typeof Calendar }[] = [
  { id: "plan", label: "Treningsplan", icon: Calendar },
  { id: "dagbok", label: "Dagbok", icon: BookOpen },
  { id: "stats", label: "Statistikk", icon: BarChart3 },
  { id: "foundation", label: "Foundation", icon: TrendingDown },
  { id: "runder", label: "Runder", icon: Target },
  { id: "trackman", label: "TrackMan", icon: Zap },
];

const L_PHASES = ["KROPP", "ARM", "KOLLE", "BALL", "AUTO"] as const;
const SHOT_TYPES = ["DRIVER", "IRON", "WEDGE", "PUTT"] as const;

const FOCUS_BADGE_VARIANT: Record<string, "info" | "success" | "warning" | "error" | "muted"> = {
  FYS: "info",
  TEK: "success",
  SLAG: "warning",
  SPILL: "info",
  TURN: "error",
};

export function TrainingDataTabs({ studentId }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("plan");
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (data[activeTab]) return;

    startTransition(async () => {
      let result: unknown;
      switch (activeTab) {
        case "plan":
          result = await getStudentTrainingPlan(studentId);
          break;
        case "dagbok":
          result = await getStudentTrainingLogs(studentId, 20);
          break;
        case "stats":
          result = await getStudentRoundStats(studentId, 10);
          break;
        case "foundation":
          result = {
            degradation: await getStudentDegradation(studentId),
            lPhases: await getStudentLPhases(studentId),
          };
          break;
        case "runder":
          result = await getStudentRoundStats(studentId, 20);
          break;
        case "trackman":
          result = await getStudentTrackManSessions(studentId, 10);
          break;
      }
      setData((prev) => ({ ...prev, [activeTab]: result }));
    });
  }, [activeTab, studentId, data]);

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-[var(--color-grey-200)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px",
                activeTab === tab.id
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AdminCard className="min-h-[200px]">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 border-2 border-[var(--color-grey-200)] border-t-[var(--color-primary)] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "plan" && <PlanTab data={data.plan} />}
            {activeTab === "dagbok" && (
              <DagbokTab data={data.dagbok} studentId={studentId} />
            )}
            {activeTab === "stats" && <StatsTab data={data.stats} />}
            {activeTab === "foundation" && (
              <FoundationTab data={data.foundation} studentId={studentId} />
            )}
            {activeTab === "runder" && <RunderTab data={data.runder} />}
            {activeTab === "trackman" && <TrackManTab data={data.trackman} />}
          </>
        )}
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB: Treningsplan
// ═══════════════════════════════════════════════════════════

function PlanTab({ data }: { data: unknown }) {
  const plan = data as {
    title: string;
    periodType: string;
    startDate: string;
    endDate: string;
    goals: string | null;
    TrainingPlanWeek: Array<{
      weekNumber: number;
      focus: string | null;
      TrainingPlanSession: Array<{
        dayOfWeek: number;
        title: string;
        durationMinutes: number | null;
        focusArea: string | null;
      }>;
    }>;
  } | null;

  if (!plan) {
    return (
      <p className="text-[var(--color-muted)] text-sm py-8 text-center">
        Ingen aktiv treningsplan
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-[var(--color-text)]">{plan.title}</h3>
        <p className="text-sm text-[var(--color-muted)]">
          {plan.periodType} {plan.goals ? `— ${plan.goals}` : ""}
        </p>
      </div>
      {plan.TrainingPlanWeek.map((week) => (
        <div
          key={week.weekNumber}
          className="border border-[var(--color-grey-200)] rounded-lg p-3 bg-white"
        >
          <div className="text-sm font-medium text-[var(--color-text)] mb-2 flex items-center gap-2">
            Uke {week.weekNumber}
            {week.focus && (
              <AdminBadge variant="info">{week.focus}</AdminBadge>
            )}
          </div>
          <div className="space-y-1">
            {week.TrainingPlanSession.map((session, i) => {
              const days = [
                "",
                "Man",
                "Tir",
                "Ons",
                "Tor",
                "Fre",
                "Lør",
                "Søn",
              ];
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="text-[var(--color-muted)] w-8">
                    {days[session.dayOfWeek]}
                  </span>
                  <span className="text-[var(--color-text)] flex-1">
                    {session.title}
                  </span>
                  {session.focusArea && (
                    <AdminBadge
                      variant={FOCUS_BADGE_VARIANT[session.focusArea] ?? "muted"}
                    >
                      {session.focusArea}
                    </AdminBadge>
                  )}
                  {session.durationMinutes && (
                    <span className="text-[var(--color-muted)] text-xs tabular-nums">
                      {session.durationMinutes} min
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB: Dagbok
// ═══════════════════════════════════════════════════════════

function DagbokTab({
  data,
  studentId,
}: {
  data: unknown;
  studentId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const logs = (data ?? []) as Array<{
    id: string;
    date: string;
    durationMinutes: number | null;
    focusArea: string | null;
    notes: string | null;
    rating: number | null;
    deviatedFromPlan: boolean;
    primaryLPhase: string | null;
    primaryEnvironment: string | null;
    primaryPressLevel: string | null;
    coachFeedback: string | null;
  }>;

  function handleSaveFeedback(logId: string) {
    startTransition(async () => {
      await addCoachNote(studentId, logId, feedbackText);
      setFeedbackId(null);
      setFeedbackText("");
    });
  }

  if (logs.length === 0) {
    return (
      <p className="text-[var(--color-muted)] text-sm py-8 text-center">
        Ingen treningslogger
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div
          key={log.id}
          className="border border-[var(--color-grey-200)] rounded-lg p-3 bg-white"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-[var(--color-text)]">
              {new Date(log.date).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "short",
              })}
              {log.focusArea && ` — ${log.focusArea}`}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              {log.durationMinutes && `${log.durationMinutes} min`}
              {log.rating && ` — ${log.rating}/5`}
            </div>
          </div>
          {(log.primaryLPhase ||
            log.primaryEnvironment ||
            log.primaryPressLevel) && (
            <div className="flex gap-1.5 mt-2">
              {log.primaryLPhase && (
                <AdminBadge variant="muted">L-{log.primaryLPhase}</AdminBadge>
              )}
              {log.primaryEnvironment && (
                <AdminBadge variant="muted">M{log.primaryEnvironment}</AdminBadge>
              )}
              {log.primaryPressLevel && (
                <AdminBadge variant="muted">PR{log.primaryPressLevel}</AdminBadge>
              )}
            </div>
          )}
          {log.deviatedFromPlan && (
            <div className="text-xs text-[var(--color-warning)] mt-2">
              Avvik fra plan
            </div>
          )}
          {log.notes && (
            <p className="text-sm text-[var(--color-text)] mt-2">{log.notes}</p>
          )}

          {log.coachFeedback && (
            <div className="mt-2 p-2 rounded bg-[var(--color-primary)]/5 text-sm text-[var(--color-primary)] flex items-start gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{log.coachFeedback}</span>
            </div>
          )}

          {feedbackId === log.id ? (
            <div className="mt-3 flex gap-2">
              <AdminInput
                type="text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Skriv tilbakemelding..."
                containerClassName="flex-1"
              />
              <AdminButton
                onClick={() => handleSaveFeedback(log.id)}
                disabled={isPending || !feedbackText}
                loading={isPending}
              >
                Lagre
              </AdminButton>
            </div>
          ) : (
            <button
              onClick={() => setFeedbackId(log.id)}
              className="mt-2 text-xs text-[var(--color-primary)] hover:underline"
            >
              Legg til tilbakemelding
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB: Statistikk / Runder
// ═══════════════════════════════════════════════════════════

function StatsTab({ data }: { data: unknown }) {
  return <RunderTab data={data} />;
}

function RunderTab({ data }: { data: unknown }) {
  const rounds = (data ?? []) as Array<{
    id: string;
    date: string;
    courseName?: string;
    totalScore: number | null;
    scoreToPar: number | null;
    sgTotal: number | null;
    sgOffTheTee: number | null;
    sgApproach: number | null;
    sgAroundTheGreen?: number | null;
    sgPutting: number | null;
    fairwaysHit: number | null;
    fairwaysTotal: number | null;
    gir: number | null;
    girTotal?: number | null;
    totalPutts: number | null;
  }>;

  if (rounds.length === 0) {
    return (
      <p className="text-[var(--color-muted)] text-sm py-8 text-center">
        Ingen runder registrert
      </p>
    );
  }

  return (
    <AdminTable>
      <AdminTableHead>
        <AdminTableRow>
          <AdminTableHeaderCell>Dato</AdminTableHeaderCell>
          <AdminTableHeaderCell>Bane</AdminTableHeaderCell>
          <AdminTableHeaderCell className="text-right">
            Score
          </AdminTableHeaderCell>
          <AdminTableHeaderCell className="text-right">SG</AdminTableHeaderCell>
          <AdminTableHeaderCell className="text-right">FW%</AdminTableHeaderCell>
          <AdminTableHeaderCell className="text-right">GIR</AdminTableHeaderCell>
          <AdminTableHeaderCell className="text-right">
            Putts
          </AdminTableHeaderCell>
        </AdminTableRow>
      </AdminTableHead>
      <AdminTableBody>
        {rounds.map((r) => (
          <AdminTableRow key={r.id}>
            <AdminTableCell className="text-[var(--color-muted)]">
              {new Date(r.date).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "short",
              })}
            </AdminTableCell>
            <AdminTableCell className="font-medium">
              {r.courseName ?? "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right font-semibold">
              {r.totalScore ?? "—"}
              {r.scoreToPar !== null && r.scoreToPar !== undefined && (
                <span
                  className={cn(
                    "ml-1 text-xs",
                    (r.scoreToPar ?? 0) > 0
                      ? "text-[var(--color-error)]"
                      : "text-[var(--color-success)]",
                  )}
                >
                  {(r.scoreToPar ?? 0) > 0 ? "+" : ""}
                  {r.scoreToPar}
                </span>
              )}
            </AdminTableCell>
            <AdminTableCell className="text-right text-[var(--color-muted)]">
              {r.sgTotal !== null ? r.sgTotal.toFixed(1) : "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-[var(--color-muted)]">
              {r.fairwaysHit !== null && r.fairwaysTotal
                ? `${Math.round((r.fairwaysHit / r.fairwaysTotal) * 100)}%`
                : "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-[var(--color-muted)]">
              {r.gir ?? "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-[var(--color-muted)]">
              {r.totalPutts ?? "—"}
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB: Foundation Method
// ═══════════════════════════════════════════════════════════

function FoundationTab({
  data,
  studentId,
}: {
  data: unknown;
  studentId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const foundationData = data as {
    degradation: {
      curves: Array<{
        shotType: string;
        trend: string;
        averageDegradationPerLevel: number;
        points: Array<{
          level: string;
          avgScore: number | null;
          dataPoints: number;
        }>;
      }>;
      gaps: Array<{
        shotType: string;
        totalDegradation: number | null;
        tekScore: number | null;
        slagScore: number | null;
        spillScore: number | null;
        turnScore: number | null;
      }>;
      envDistribution: Array<{
        environment: number;
        name: string;
        count: number;
        percentage: number;
        averageScore: number | null;
      }>;
    };
    lPhases: Array<{
      shotType: string;
      lPhase: string;
      setAt: string;
      setBy: string | null;
    }>;
  } | null;

  if (!foundationData) {
    return (
      <p className="text-[var(--color-muted)] text-sm py-8 text-center">
        Laster...
      </p>
    );
  }

  function handleSetPhase(shotType: string, lPhase: string) {
    startTransition(async () => {
      await setStudentLPhase(studentId, shotType, lPhase);
    });
  }

  return (
    <div className="space-y-6">
      {/* L-faser */}
      <div>
        <h3 className="admin-section-title mb-3">L-faser per slagtype</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SHOT_TYPES.map((st) => {
            const phase = foundationData.lPhases.find(
              (p) => p.shotType === st,
            );
            return (
              <div
                key={st}
                className="border border-[var(--color-grey-200)] rounded-lg p-3 bg-white"
              >
                <div className="text-xs text-[var(--color-muted)] mb-1.5">
                  {st}
                </div>
                <AdminSelect
                  value={phase?.lPhase ?? ""}
                  onChange={(e) => handleSetPhase(st, e.target.value)}
                  disabled={isPending}
                >
                  <option value="">Ikke satt</option>
                  {L_PHASES.map((lp) => (
                    <option key={lp} value={lp}>
                      {lp}
                    </option>
                  ))}
                </AdminSelect>
              </div>
            );
          })}
        </div>
      </div>

      {/* Degraderingskurver */}
      <div>
        <h3 className="admin-section-title mb-3">Degraderingskurver</h3>
        <div className="space-y-3">
          {foundationData.degradation.curves.map((curve) => (
            <div
              key={curve.shotType}
              className="border border-[var(--color-grey-200)] rounded-lg p-3 bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {curve.shotType}
                </span>
                <AdminBadge
                  variant={
                    curve.trend === "improving"
                      ? "success"
                      : curve.trend === "degrading"
                        ? "error"
                        : "muted"
                  }
                >
                  {curve.trend === "improving"
                    ? "Forbedring"
                    : curve.trend === "degrading"
                      ? "Degradering"
                      : curve.trend === "stable"
                        ? "Stabil"
                        : "For lite data"}
                </AdminBadge>
              </div>
              <div className="flex gap-2">
                {["TEK", "SLAG", "SPILL", "TURN"].map((level) => {
                  const point = curve.points.find((p) => p.level === level);
                  return (
                    <div key={level} className="flex-1 text-center">
                      <div className="text-lg font-bold text-[var(--color-text)] tabular-nums">
                        {point?.avgScore !== null &&
                        point?.avgScore !== undefined
                          ? point.avgScore.toFixed(1)
                          : "—"}
                      </div>
                      <div className="text-xs text-[var(--color-muted)]">
                        {level}
                      </div>
                      <div className="text-[10px] text-[var(--color-muted)] opacity-60">
                        {point?.dataPoints ?? 0}p
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* M-fordeling */}
      <div>
        <h3 className="admin-section-title mb-3">Treningsmiljø-fordeling</h3>
        <div className="space-y-2">
          {foundationData.degradation.envDistribution.map((env) => (
            <div
              key={env.environment}
              className="flex items-center gap-2"
            >
              <span className="text-xs text-[var(--color-muted)] w-24">
                M{env.environment}: {env.name}
              </span>
              <div className="flex-1 h-2 bg-[var(--color-grey-200)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full"
                  style={{ width: `${env.percentage}%` }}
                />
              </div>
              <span className="text-xs text-[var(--color-text)] w-12 text-right tabular-nums">
                {env.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB: TrackMan
// ═══════════════════════════════════════════════════════════

function TrackManTab({ data }: { data: unknown }) {
  const sessions = (data ?? []) as Array<{
    id: string;
    sessionDate: string;
    club: string;
    averages: Record<string, number | null>;
  }>;

  if (sessions.length === 0) {
    return (
      <AdminEmptyState
        icon={<Zap className="w-6 h-6" />}
        title="Ingen TrackMan-data"
        description="Ingen TrackMan-økter registrert for denne eleven."
      />
    );
  }

  return (
    <AdminTable>
      <AdminTableHead>
        <AdminTableRow>
          <AdminTableHeaderCell>Dato</AdminTableHeaderCell>
          <AdminTableHeaderCell>Klubb</AdminTableHeaderCell>
          <AdminTableHeaderCell className="text-right">
            Carry
          </AdminTableHeaderCell>
          <AdminTableHeaderCell className="text-right">
            Total
          </AdminTableHeaderCell>
          <AdminTableHeaderCell className="text-right">
            Offline
          </AdminTableHeaderCell>
          <AdminTableHeaderCell className="text-right">Slag</AdminTableHeaderCell>
        </AdminTableRow>
      </AdminTableHead>
      <AdminTableBody>
        {sessions.map((s) => (
          <AdminTableRow key={s.id}>
            <AdminTableCell className="text-[var(--color-muted)]">
              {new Date(s.sessionDate).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "short",
              })}
            </AdminTableCell>
            <AdminTableCell className="font-medium">{s.club}</AdminTableCell>
            <AdminTableCell className="text-right text-[var(--color-muted)]">
              {s.averages.avgCarry ? `${Math.round(s.averages.avgCarry)}m` : "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-[var(--color-muted)]">
              {s.averages.avgTotal ? `${Math.round(s.averages.avgTotal)}m` : "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-[var(--color-muted)]">
              {s.averages.avgOffline
                ? `${Math.round(s.averages.avgOffline)}m`
                : "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-[var(--color-muted)]">
              {s.averages.count ?? "—"}
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  );
}
