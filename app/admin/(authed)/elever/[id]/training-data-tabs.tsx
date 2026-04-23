"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useEffect, useTransition } from "react";
import { Calendar, BookOpen, BarChart3, TrendingDown, Target, Zap } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import {
  AdminInput,
  AdminSelect,
  AdminTable,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableHeaderCell,
  AdminTableCell,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import { Card, Button, Badge, Tabs, type TabItem } from "@/components/ui";
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
  { id: "dagbok", label: "Min Trening", icon: BookOpen },
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

  const tabItems: TabItem[] = TABS.map((t) => {
    const Icon = t.icon;
    return {
      id: t.id,
      label: t.label,
      icon: <Icon className="h-3.5 w-3.5" />,
    };
  });

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <Tabs
        items={tabItems}
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabId)}
        size="sm"
      />


      {/* Content */}
      <Card className="min-h-[200px]">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 border-2 border-outline-variant/30 border-t-black rounded-full animate-spin" />
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
      </Card>
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
      <p className="text-on-surface-variant text-sm py-8 text-center">
        Ingen aktiv treningsplan
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-on-surface">{plan.title}</h3>
        <p className="text-sm text-on-surface-variant">
          {plan.periodType} {plan.goals ? `— ${plan.goals}` : ""}
        </p>
      </div>
      {plan.TrainingPlanWeek.map((week) => (
        <div
          key={week.weekNumber}
          className="border border-outline-variant/30 rounded-lg p-3 bg-surface-container-lowest"
        >
          <div className="text-sm font-medium text-on-surface mb-2 flex items-center gap-2">
            Uke {week.weekNumber}
            {week.focus && (
              <Badge variant="info">{week.focus}</Badge>
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
                  <span className="text-on-surface-variant w-8">
                    {days[session.dayOfWeek]}
                  </span>
                  <span className="text-on-surface flex-1">
                    {session.title}
                  </span>
                  {session.focusArea && (
                    <Badge
                      variant={FOCUS_BADGE_VARIANT[session.focusArea] ?? "muted"}
                    >
                      {session.focusArea}
                    </Badge>
                  )}
                  {session.durationMinutes && (
                    <span className="text-on-surface-variant text-xs tabular-nums">
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
      <p className="text-on-surface-variant text-sm py-8 text-center">
        Ingen treningslogger
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div
          key={log.id}
          className="border border-outline-variant/30 rounded-lg p-3 bg-surface-container-lowest"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-on-surface">
              {new Date(log.date).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "short",
              })}
              {log.focusArea && ` — ${log.focusArea}`}
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              {log.durationMinutes && `${log.durationMinutes} min`}
              {log.rating && ` — ${log.rating}/5`}
            </div>
          </div>
          {(log.primaryLPhase ||
            log.primaryEnvironment ||
            log.primaryPressLevel) && (
            <div className="flex gap-1.5 mt-2">
              {log.primaryLPhase && (
                <Badge variant="muted">L-{log.primaryLPhase}</Badge>
              )}
              {log.primaryEnvironment && (
                <Badge variant="muted">M{log.primaryEnvironment}</Badge>
              )}
              {log.primaryPressLevel && (
                <Badge variant="muted">PR{log.primaryPressLevel}</Badge>
              )}
            </div>
          )}
          {log.deviatedFromPlan && (
            <div className="text-xs text-warning mt-2">
              Avvik fra plan
            </div>
          )}
          {log.notes && (
            <p className="text-sm text-on-surface mt-2">{log.notes}</p>
          )}

          {log.coachFeedback && (
            <div className="mt-2 p-2 rounded bg-on-surface/5 text-sm text-on-surface flex items-start gap-1.5">
              <Icon name="chat_bubble" className="h-3.5 w-3.5 mt-0.5 shrink-0" />
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
              <Button
                onClick={() => handleSaveFeedback(log.id)}
                disabled={isPending || !feedbackText}
                isLoading={isPending}
              >
                Lagre
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setFeedbackId(log.id)}
              className="mt-2 text-xs text-on-surface hover:underline"
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
      <p className="text-on-surface-variant text-sm py-8 text-center">
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
            <AdminTableCell className="text-on-surface-variant">
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
            <AdminTableCell className="text-right text-on-surface-variant">
              {r.sgTotal !== null ? r.sgTotal.toFixed(1) : "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-on-surface-variant">
              {r.fairwaysHit !== null && r.fairwaysTotal
                ? `${Math.round((r.fairwaysHit / r.fairwaysTotal) * 100)}%`
                : "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-on-surface-variant">
              {r.gir ?? "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-on-surface-variant">
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
      <p className="text-on-surface-variant text-sm py-8 text-center">
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
                className="border border-outline-variant/30 rounded-lg p-3 bg-surface-container-lowest"
              >
                <div className="text-xs text-on-surface-variant mb-1.5">
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
              className="border border-outline-variant/30 rounded-lg p-3 bg-surface-container-lowest"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-on-surface">
                  {curve.shotType}
                </span>
                <Badge
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
                </Badge>
              </div>
              <div className="flex gap-2">
                {["TEK", "SLAG", "SPILL", "TURN"].map((level) => {
                  const point = curve.points.find((p) => p.level === level);
                  return (
                    <div key={level} className="flex-1 text-center">
                      <div className="text-lg font-bold text-on-surface tabular-nums">
                        {point?.avgScore !== null &&
                        point?.avgScore !== undefined
                          ? point.avgScore.toFixed(1)
                          : "—"}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {level}
                      </div>
                      <div className="text-[10px] text-on-surface-variant opacity-60">
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
              <span className="text-xs text-on-surface-variant w-24">
                M{env.environment}: {env.name}
              </span>
              <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full"
                  style={{ width: `${env.percentage}%` }}
                />
              </div>
              <span className="text-xs text-on-surface w-12 text-right tabular-nums">
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
        icon={<Icon name="bolt" className="w-6 h-6" />}
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
            <AdminTableCell className="text-on-surface-variant">
              {new Date(s.sessionDate).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "short",
              })}
            </AdminTableCell>
            <AdminTableCell className="font-medium">{s.club}</AdminTableCell>
            <AdminTableCell className="text-right text-on-surface-variant">
              {s.averages.avgCarry ? `${Math.round(s.averages.avgCarry)}m` : "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-on-surface-variant">
              {s.averages.avgTotal ? `${Math.round(s.averages.avgTotal)}m` : "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-on-surface-variant">
              {s.averages.avgOffline
                ? `${Math.round(s.averages.avgOffline)}m`
                : "—"}
            </AdminTableCell>
            <AdminTableCell className="text-right text-on-surface-variant">
              {s.averages.count ?? "—"}
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  );
}
