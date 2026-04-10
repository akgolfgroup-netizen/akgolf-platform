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
  ChevronDown,
} from "lucide-react";
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

export function TrainingDataTabs({ studentId, studentName }: Props) {
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
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-[var(--color-grey-900)] text-white"
                : "text-[var(--color-grey-500)] hover:bg-[var(--color-grey-100)]"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-[var(--color-grey-200)] p-4 min-h-[200px]">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 border-2 border-[var(--color-grey-300)] border-t-[var(--color-brand)] rounded-full animate-spin" />
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
      </div>
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
      <p className="text-[var(--color-grey-500)] text-sm py-8 text-center">
        Ingen aktiv treningsplan
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-[var(--color-grey-900)]">{plan.title}</h3>
        <p className="text-sm text-[var(--color-grey-500)]">
          {plan.periodType} — {plan.goals}
        </p>
      </div>
      {plan.TrainingPlanWeek.map((week) => (
        <div key={week.weekNumber} className="border border-[var(--color-grey-100)] rounded-lg p-3">
          <div className="text-sm font-medium text-[var(--color-grey-700)] mb-2">
            Uke {week.weekNumber} {week.focus && `— ${week.focus}`}
          </div>
          <div className="space-y-1">
            {week.TrainingPlanSession.map((session, i) => {
              const days = ["", "Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];
              return (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--color-grey-400)] w-8">{days[session.dayOfWeek]}</span>
                  <span className="text-[var(--color-grey-900)]">{session.title}</span>
                  {session.durationMinutes && (
                    <span className="text-[var(--color-grey-400)]">{session.durationMinutes}min</span>
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

function DagbokTab({ data, studentId }: { data: unknown; studentId: string }) {
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
    return <p className="text-[var(--color-grey-500)] text-sm py-8 text-center">Ingen treningslogger</p>;
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="border border-[var(--color-grey-100)] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-[var(--color-grey-900)]">
              {new Date(log.date).toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}
              {log.focusArea && ` — ${log.focusArea}`}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-grey-400)]">
              {log.durationMinutes && `${log.durationMinutes}min`}
              {log.rating && ` — ${log.rating}/5`}
            </div>
          </div>
          {(log.primaryLPhase || log.primaryEnvironment || log.primaryPressLevel) && (
            <div className="flex gap-1 mt-1">
              {log.primaryLPhase && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-grey-100)] text-[var(--color-grey-600)]">
                  L-{log.primaryLPhase}
                </span>
              )}
              {log.primaryEnvironment && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-grey-100)] text-[var(--color-grey-600)]">
                  M{log.primaryEnvironment}
                </span>
              )}
              {log.primaryPressLevel && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-grey-100)] text-[var(--color-grey-600)]">
                  PR{log.primaryPressLevel}
                </span>
              )}
            </div>
          )}
          {log.deviatedFromPlan && (
            <div className="text-xs text-[var(--color-warning)] mt-1">Avvik fra plan</div>
          )}
          {log.notes && <p className="text-sm text-[var(--color-grey-600)] mt-1">{log.notes}</p>}

          {/* Coach feedback */}
          {log.coachFeedback && (
            <div className="mt-2 p-2 rounded bg-[var(--color-brand)]/5 text-sm text-[var(--color-brand)]">
              <MessageCircle className="h-3 w-3 inline mr-1" />
              {log.coachFeedback}
            </div>
          )}

          {feedbackId === log.id ? (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Skriv tilbakemelding..."
                className="flex-1 text-sm px-2 py-1.5 rounded border border-[var(--color-grey-200)]"
              />
              <button
                onClick={() => handleSaveFeedback(log.id)}
                disabled={isPending || !feedbackText}
                className="text-xs px-3 py-1.5 rounded bg-[var(--color-brand)] text-white disabled:opacity-50"
              >
                Lagre
              </button>
            </div>
          ) : (
            <button
              onClick={() => setFeedbackId(log.id)}
              className="mt-2 text-xs text-[var(--color-brand)] hover:underline"
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
    return <p className="text-[var(--color-grey-500)] text-sm py-8 text-center">Ingen runder registrert</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[var(--color-grey-500)] border-b border-[var(--color-grey-100)]">
            <th className="text-left pb-2 font-medium">Dato</th>
            <th className="text-left pb-2 font-medium">Bane</th>
            <th className="text-right pb-2 font-medium">Score</th>
            <th className="text-right pb-2 font-medium">SG</th>
            <th className="text-right pb-2 font-medium">FW%</th>
            <th className="text-right pb-2 font-medium">GIR</th>
            <th className="text-right pb-2 font-medium">Putts</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((r) => (
            <tr key={r.id} className="border-b border-[var(--color-grey-50)]">
              <td className="py-2 text-[var(--color-grey-600)]">
                {new Date(r.date).toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}
              </td>
              <td className="py-2 text-[var(--color-grey-900)] font-medium">
                {r.courseName ?? "-"}
              </td>
              <td className="py-2 text-right font-semibold text-[var(--color-grey-900)]">
                {r.totalScore ?? "-"}
                {r.scoreToPar !== null && r.scoreToPar !== undefined && (
                  <span className={`ml-1 text-xs ${(r.scoreToPar ?? 0) > 0 ? "text-[var(--color-error)]" : "text-[var(--color-success-text)]"}`}>
                    {(r.scoreToPar ?? 0) > 0 ? "+" : ""}{r.scoreToPar}
                  </span>
                )}
              </td>
              <td className="py-2 text-right text-[var(--color-grey-600)]">
                {r.sgTotal !== null ? r.sgTotal.toFixed(1) : "-"}
              </td>
              <td className="py-2 text-right text-[var(--color-grey-600)]">
                {r.fairwaysHit !== null && r.fairwaysTotal
                  ? `${Math.round((r.fairwaysHit / r.fairwaysTotal) * 100)}%`
                  : "-"}
              </td>
              <td className="py-2 text-right text-[var(--color-grey-600)]">
                {r.gir ?? "-"}
              </td>
              <td className="py-2 text-right text-[var(--color-grey-600)]">
                {r.totalPutts ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB: Foundation Method
// ═══════════════════════════════════════════════════════════

function FoundationTab({ data, studentId }: { data: unknown; studentId: string }) {
  const [isPending, startTransition] = useTransition();
  const foundationData = data as {
    degradation: {
      curves: Array<{ shotType: string; trend: string; averageDegradationPerLevel: number; points: Array<{ level: string; avgScore: number | null; dataPoints: number }> }>;
      gaps: Array<{ shotType: string; totalDegradation: number | null; tekScore: number | null; slagScore: number | null; spillScore: number | null; turnScore: number | null }>;
      envDistribution: Array<{ environment: number; name: string; count: number; percentage: number; averageScore: number | null }>;
    };
    lPhases: Array<{ shotType: string; lPhase: string; setAt: string; setBy: string | null }>;
  } | null;

  if (!foundationData) {
    return <p className="text-[var(--color-grey-500)] text-sm py-8 text-center">Laster...</p>;
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
        <h3 className="text-sm font-semibold text-[var(--color-grey-700)] mb-3">L-faser per slagtype</h3>
        <div className="grid grid-cols-2 gap-2">
          {SHOT_TYPES.map((st) => {
            const phase = foundationData.lPhases.find((p) => p.shotType === st);
            return (
              <div key={st} className="border border-[var(--color-grey-100)] rounded-lg p-3">
                <div className="text-xs text-[var(--color-grey-500)]">{st}</div>
                <div className="flex items-center gap-2 mt-1">
                  <select
                    value={phase?.lPhase ?? ""}
                    onChange={(e) => handleSetPhase(st, e.target.value)}
                    disabled={isPending}
                    className="text-sm font-medium bg-transparent border-none p-0 text-[var(--color-grey-900)] cursor-pointer"
                  >
                    <option value="">Ikke satt</option>
                    {L_PHASES.map((lp) => (
                      <option key={lp} value={lp}>{lp}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Degraderingskurver */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-grey-700)] mb-3">Degraderingskurver</h3>
        <div className="space-y-3">
          {foundationData.degradation.curves.map((curve) => (
            <div key={curve.shotType} className="border border-[var(--color-grey-100)] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--color-grey-900)]">{curve.shotType}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  curve.trend === "improving" ? "bg-[var(--color-success)]/10 text-[var(--color-success-text)]" :
                  curve.trend === "degrading" ? "bg-[var(--color-error)]/10 text-[var(--color-error)]" :
                  "bg-[var(--color-grey-100)] text-[var(--color-grey-500)]"
                }`}>
                  {curve.trend === "improving" ? "Forbedring" : curve.trend === "degrading" ? "Degradering" : curve.trend === "stable" ? "Stabil" : "For lite data"}
                </span>
              </div>
              <div className="flex gap-2">
                {["TEK", "SLAG", "SPILL", "TURN"].map((level) => {
                  const point = curve.points.find((p) => p.level === level);
                  return (
                    <div key={level} className="flex-1 text-center">
                      <div className="text-lg font-bold text-[var(--color-grey-900)]">
                        {point?.avgScore !== null && point?.avgScore !== undefined ? point.avgScore.toFixed(1) : "-"}
                      </div>
                      <div className="text-xs text-[var(--color-grey-400)]">{level}</div>
                      <div className="text-xs text-[var(--color-grey-300)]">{point?.dataPoints ?? 0}p</div>
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
        <h3 className="text-sm font-semibold text-[var(--color-grey-700)] mb-3">Treningmiljo-fordeling</h3>
        <div className="space-y-1">
          {foundationData.degradation.envDistribution.map((env) => (
            <div key={env.environment} className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-grey-500)] w-24">M{env.environment}: {env.name}</span>
              <div className="flex-1 h-4 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-brand)] rounded-full"
                  style={{ width: `${env.percentage}%` }}
                />
              </div>
              <span className="text-xs text-[var(--color-grey-600)] w-12 text-right">
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
    return <p className="text-[var(--color-grey-500)] text-sm py-8 text-center">Ingen TrackMan-data</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[var(--color-grey-500)] border-b border-[var(--color-grey-100)]">
            <th className="text-left pb-2 font-medium">Dato</th>
            <th className="text-left pb-2 font-medium">Klubb</th>
            <th className="text-right pb-2 font-medium">Carry</th>
            <th className="text-right pb-2 font-medium">Total</th>
            <th className="text-right pb-2 font-medium">Offline</th>
            <th className="text-right pb-2 font-medium">Slag</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className="border-b border-[var(--color-grey-50)]">
              <td className="py-2 text-[var(--color-grey-600)]">
                {new Date(s.sessionDate).toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}
              </td>
              <td className="py-2 font-medium text-[var(--color-grey-900)]">{s.club}</td>
              <td className="py-2 text-right text-[var(--color-grey-600)]">
                {s.averages.avgCarry ? `${Math.round(s.averages.avgCarry)}m` : "-"}
              </td>
              <td className="py-2 text-right text-[var(--color-grey-600)]">
                {s.averages.avgTotal ? `${Math.round(s.averages.avgTotal)}m` : "-"}
              </td>
              <td className="py-2 text-right text-[var(--color-grey-600)]">
                {s.averages.avgOffline ? `${Math.round(s.averages.avgOffline)}m` : "-"}
              </td>
              <td className="py-2 text-right text-[var(--color-grey-400)]">
                {s.averages.count ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
