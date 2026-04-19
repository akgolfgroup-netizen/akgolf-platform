import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  ArrowLeft,
  Clock,
  Target,
  Activity,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Star,
  Layers,
  Gauge,
  Zap,
} from "lucide-react";
import {
  L_PHASES,
  M_ENVIRONMENTS,
  PR_LEVELS,
  type LPhase,
  type MEnvironment,
  type PRLevel,
} from "@/lib/portal/golf/ak-formula";

interface Props {
  params: Promise<{ sessionId: string }>;
}

// Helper to safely get L-phase label
function getLPhaseLabel(lPhase: string | null): string {
  if (!lPhase) return "-";
  const phase = L_PHASES[lPhase as LPhase];
  return phase?.name ?? lPhase;
}

// Helper to safely get M-environment label
function getMEnvironmentLabel(environment: number | null): string {
  if (environment === null || environment === undefined) return "-";
  const env = M_ENVIRONMENTS[environment as MEnvironment];
  return env?.name ?? `M${environment}`;
}

// Helper to safely get PR-level label
function getPRLevelLabel(pressLevel: number | null): string {
  if (pressLevel === null || pressLevel === undefined) return "-";
  const pr = PR_LEVELS[pressLevel as PRLevel];
  return pr?.name ?? `PR${pressLevel}`;
}

export default async function SessionDetailPage({ params }: Props) {
  const { sessionId } = await params;
  const user = await requirePortalUser();

  const supabase = await createServerSupabase();

  // Fetch training log with exercises
  const { data: log } = await supabase
    .from("TrainingLog")
    .select(`
      *,
      TrainingLogExercises(*),
      User:userId(id, name),
      TrainingPlanSession:planSessionId(id, title, focusArea)
    `)
    .eq("id", sessionId)
    .single();

  if (!log) {
    notFound();
  }

  // Verify user owns this log or is admin/instructor
  const isOwner = log.userId === user.id;
  const isAdmin = user.role === "ADMIN" || user.role === "INSTRUCTOR";
  if (!isOwner && !isAdmin) {
    notFound();
  }

  const sessionTitle =
    log.TrainingPlanSession?.title || log.focusArea || "Treningsøkt";
  const sessionDate = format(new Date(log.date), "EEEE d. MMMM yyyy", {
    locale: nb,
  });

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link
          href="/portal/dagbok"
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[var(--color-outline-variant)]/70 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">{sessionTitle}</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] capitalize">{sessionDate}</p>
        </div>
      </div>

      {/* Session Overview Card */}
      <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)]/70 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">Øktoversikt</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {log.durationMinutes && (
            <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-container)] rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Clock className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">Varighet</p>
                <p className="text-base font-semibold text-[var(--color-on-surface)] tabular-nums tracking-tight">{log.durationMinutes} min</p>
              </div>
            </div>
          )}

          {log.focusArea && (
            <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-container)] rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Target className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">Fokusområde</p>
                <p className="text-base font-semibold text-[var(--color-on-surface)]">{log.focusArea}</p>
              </div>
            </div>
          )}

          {log.rating !== null && (
            <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-container)] rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Activity className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">Vurdering</p>
                <p className="text-base font-semibold text-[var(--color-on-surface)] tabular-nums tracking-tight">{log.rating}/10</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-container)] rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <Layers className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-on-surface-variant)]">Øvelser</p>
              <p className="text-base font-semibold text-[var(--color-on-surface)] tabular-nums tracking-tight">{log.TrainingLogExercises?.length ?? 0}</p>
            </div>
          </div>
        </div>

        {/* L-M-PR Summary */}
        {(log.primaryLPhase || log.primaryEnvironment !== null || log.primaryPressLevel !== null) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {log.primaryLPhase && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium">
                <Gauge className="w-3.5 h-3.5" />
                L: {getLPhaseLabel(log.primaryLPhase)}
              </span>
            )}
            {log.primaryEnvironment !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium">
                <Target className="w-3.5 h-3.5" />
                M: {getMEnvironmentLabel(log.primaryEnvironment)}
              </span>
            )}
            {log.primaryPressLevel !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)] text-sm font-medium">
                <Zap className="w-3.5 h-3.5" />
                PR: {getPRLevelLabel(log.primaryPressLevel)}
              </span>
            )}
          </div>
        )}

        {/* Notes */}
        {log.notes && (
          <div className="pt-2">
            <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">Notater</p>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{log.notes}</p>
          </div>
        )}

        {/* Plan deviation */}
        {log.deviatedFromPlan && (
          <div className="pt-2 border-t border-[var(--color-outline-variant)]/50">
            <div className="flex items-center gap-2 text-[var(--color-warning)] mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Avvik fra plan</span>
            </div>
            {log.deviationReason && (
              <p className="text-sm text-[var(--color-on-surface-variant)]">{log.deviationReason}</p>
            )}
          </div>
        )}
      </div>

      {/* Exercises Card */}
      {log.TrainingLogExercises && log.TrainingLogExercises.length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)]/70 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">Øvelser</h2>

          <div className="space-y-3">
            {log.TrainingLogExercises.sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder).map((exercise: { id: string; name: string; score: number | null; plannedSets: number | null; plannedReps: number | null; actualSets: number | null; actualReps: number | null; lPhase: string | null; environment: number | null; pressLevel: number | null; clubSpeed: number | null; successRate: number | null; notes: string | null; coachFeedback: string | null }, idx: number) => (
              <div key={exercise.id} className="p-4 bg-[var(--color-surface-container)] rounded-xl space-y-3">
                {/* Exercise header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-primary)]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-base font-medium text-[var(--color-on-surface)]">{exercise.name}</p>
                    </div>
                  </div>
                  {exercise.score !== null && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[var(--color-outline-variant)]/70 text-sm font-medium text-[var(--color-on-surface)]">
                      <Star className="w-3.5 h-3.5 text-[var(--color-warning)]" />
                      <span className="tabular-nums tracking-tight">{exercise.score}/10</span>
                    </span>
                  )}
                </div>

                {/* Sets/Reps comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">Planlagt</p>
                    <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                      {exercise.plannedSets ?? "-"} sett x{" "}
                      {exercise.plannedReps ?? "-"} reps
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">Faktisk</p>
                    <p className="text-sm font-medium text-[var(--color-on-surface)]">
                      {exercise.actualSets ?? "-"} sett x{" "}
                      {exercise.actualReps ?? "-"} reps
                    </p>
                  </div>
                </div>

                {/* L-M-PR for exercise */}
                <div className="flex flex-wrap gap-2">
                  {exercise.lPhase && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-medium">
                      L: {getLPhaseLabel(exercise.lPhase)}
                    </span>
                  )}
                  {exercise.environment !== null && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-medium">
                      M: {getMEnvironmentLabel(exercise.environment)}
                    </span>
                  )}
                  {exercise.pressLevel !== null && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-warning)]/10 text-[var(--color-warning)] text-xs font-medium">
                      PR: {getPRLevelLabel(exercise.pressLevel)}
                    </span>
                  )}
                  {exercise.clubSpeed !== null && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] text-xs font-medium">
                      CS: {exercise.clubSpeed}%
                    </span>
                  )}
                  {exercise.successRate !== null && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] text-xs font-medium">
                      Treffprosent: {Math.round(exercise.successRate * 100)}%
                    </span>
                  )}
                </div>

                {/* Exercise notes */}
                {exercise.notes && (
                  <p className="text-sm text-[var(--color-on-surface-variant)] pt-1">{exercise.notes}</p>
                )}

                {/* Coach feedback for this exercise */}
                {exercise.coachFeedback && (
                  <div className="pt-2 border-t border-[var(--color-outline-variant)]/70">
                    <div className="flex items-center gap-2 text-[var(--color-primary)] mb-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Coach-feedback</span>
                    </div>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">{exercise.coachFeedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coach Feedback Card */}
      {log.coachFeedback && (
        <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)]/70 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">Coach-feedback</h2>
          </div>
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{log.coachFeedback}</p>
        </div>
      )}

      {/* Linked plan session */}
      {log.TrainingPlanSession && (
        <div className="bg-[var(--color-surface-container)] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
            <div>
              <p className="text-xs text-[var(--color-on-surface-variant)]">Koblet til treningsplan</p>
              <p className="text-sm font-medium text-[var(--color-on-surface)]">{log.TrainingPlanSession.title}</p>
            </div>
          </div>
          <Link
            href={`/portal/treningsplan/${log.TrainingPlanSession.id}`}
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            Se økt
          </Link>
        </div>
      )}
    </div>
  );
}
