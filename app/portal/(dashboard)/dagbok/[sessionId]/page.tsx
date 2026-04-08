import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
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

  // Fetch training log with exercises
  const log = await prisma.trainingLog.findUnique({
    where: { id: sessionId },
    include: {
      TrainingLogExercises: {
        orderBy: { sortOrder: "asc" },
      },
      User: {
        select: { id: true, name: true },
      },
      TrainingPlanSession: {
        select: { id: true, title: true, focusArea: true },
      },
    },
  });

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
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[#c2c9bb]/50 text-[#6b7366] hover:bg-[#f7f3ea] hover:text-[#1c1c16] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">{sessionTitle}</h1>
          <p className="text-sm text-[#6b7366] capitalize">{sessionDate}</p>
        </div>
      </div>

      {/* Session Overview Card */}
      <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-[#1c1c16]">Øktoversikt</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {log.durationMinutes && (
            <div className="flex items-center gap-3 p-4 bg-[#f7f3ea] rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#154212]" />
              </div>
              <div>
                <p className="text-xs text-[#6b7366]">Varighet</p>
                <p className="text-base font-semibold text-[#1c1c16]">{log.durationMinutes} min</p>
              </div>
            </div>
          )}

          {log.focusArea && (
            <div className="flex items-center gap-3 p-4 bg-[#f7f3ea] rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Target className="w-5 h-5 text-[#154212]" />
              </div>
              <div>
                <p className="text-xs text-[#6b7366]">Fokusområde</p>
                <p className="text-base font-semibold text-[#1c1c16]">{log.focusArea}</p>
              </div>
            </div>
          )}

          {log.rating !== null && (
            <div className="flex items-center gap-3 p-4 bg-[#f7f3ea] rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#154212]" />
              </div>
              <div>
                <p className="text-xs text-[#6b7366]">Vurdering</p>
                <p className="text-base font-semibold text-[#1c1c16]">{log.rating}/10</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-[#f7f3ea] rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#154212]" />
            </div>
            <div>
              <p className="text-xs text-[#6b7366]">Øvelser</p>
              <p className="text-base font-semibold text-[#1c1c16]">{log.TrainingLogExercises.length}</p>
            </div>
          </div>
        </div>

        {/* L-M-PR Summary */}
        {(log.primaryLPhase || log.primaryEnvironment !== null || log.primaryPressLevel !== null) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {log.primaryLPhase && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-sm font-medium">
                <Gauge className="w-3.5 h-3.5" />
                L: {getLPhaseLabel(log.primaryLPhase)}
              </span>
            )}
            {log.primaryEnvironment !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#154212]/10 text-[#154212] text-sm font-medium">
                <Target className="w-3.5 h-3.5" />
                M: {getMEnvironmentLabel(log.primaryEnvironment)}
              </span>
            )}
            {log.primaryPressLevel !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-sm font-medium">
                <Zap className="w-3.5 h-3.5" />
                PR: {getPRLevelLabel(log.primaryPressLevel)}
              </span>
            )}
          </div>
        )}

        {/* Notes */}
        {log.notes && (
          <div className="pt-2">
            <p className="text-xs text-[#6b7366] mb-1">Notater</p>
            <p className="text-sm text-[#42493e] leading-relaxed">{log.notes}</p>
          </div>
        )}

        {/* Plan deviation */}
        {log.deviatedFromPlan && (
          <div className="pt-2 border-t border-[#f7f3ea]">
            <div className="flex items-center gap-2 text-[#f59e0b] mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Avvik fra plan</span>
            </div>
            {log.deviationReason && (
              <p className="text-sm text-[#6b7366]">{log.deviationReason}</p>
            )}
          </div>
        )}
      </div>

      {/* Exercises Card */}
      {log.TrainingLogExercises.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#1c1c16]">Øvelser</h2>

          <div className="space-y-3">
            {log.TrainingLogExercises.map((exercise, idx) => (
              <div key={exercise.id} className="p-4 bg-[#f7f3ea] rounded-xl space-y-3">
                {/* Exercise header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-sm font-semibold text-[#154212]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-base font-medium text-[#1c1c16]">{exercise.name}</p>
                    </div>
                  </div>
                  {exercise.score !== null && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#c2c9bb]/50 text-sm font-medium text-[#1c1c16]">
                      <Star className="w-3.5 h-3.5 text-[#f59e0b]" />
                      {exercise.score}/10
                    </span>
                  )}
                </div>

                {/* Sets/Reps comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6b7366] mb-1">Planlagt</p>
                    <p className="text-sm font-medium text-[#6b7366]">
                      {exercise.plannedSets ?? "-"} sett x{" "}
                      {exercise.plannedReps ?? "-"} reps
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6b7366] mb-1">Faktisk</p>
                    <p className="text-sm font-medium text-[#1c1c16]">
                      {exercise.actualSets ?? "-"} sett x{" "}
                      {exercise.actualReps ?? "-"} reps
                    </p>
                  </div>
                </div>

                {/* L-M-PR for exercise */}
                <div className="flex flex-wrap gap-2">
                  {exercise.lPhase && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-medium">
                      L: {getLPhaseLabel(exercise.lPhase)}
                    </span>
                  )}
                  {exercise.environment !== null && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#154212]/10 text-[#154212] text-xs font-medium">
                      M: {getMEnvironmentLabel(exercise.environment)}
                    </span>
                  )}
                  {exercise.pressLevel !== null && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-medium">
                      PR: {getPRLevelLabel(exercise.pressLevel)}
                    </span>
                  )}
                  {exercise.clubSpeed !== null && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#f7f3ea] text-[#6b7366] text-xs font-medium">
                      CS: {exercise.clubSpeed}%
                    </span>
                  )}
                  {exercise.successRate !== null && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#f7f3ea] text-[#6b7366] text-xs font-medium">
                      Treffprosent: {Math.round(exercise.successRate * 100)}%
                    </span>
                  )}
                </div>

                {/* Exercise notes */}
                {exercise.notes && (
                  <p className="text-sm text-[#6b7366] pt-1">{exercise.notes}</p>
                )}

                {/* Coach feedback for this exercise */}
                {exercise.coachFeedback && (
                  <div className="pt-2 border-t border-[#c2c9bb]/50">
                    <div className="flex items-center gap-2 text-[#154212] mb-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Coach-feedback</span>
                    </div>
                    <p className="text-sm text-[#42493e]">{exercise.coachFeedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coach Feedback Card */}
      {log.coachFeedback && (
        <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#154212]" />
            <h2 className="text-lg font-semibold text-[#1c1c16]">Coach-feedback</h2>
          </div>
          <p className="text-sm text-[#42493e] leading-relaxed">{log.coachFeedback}</p>
        </div>
      )}

      {/* Linked plan session */}
      {log.TrainingPlanSession && (
        <div className="bg-[#f7f3ea] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
            <div>
              <p className="text-xs text-[#6b7366]">Koblet til treningsplan</p>
              <p className="text-sm font-medium text-[#1c1c16]">{log.TrainingPlanSession.title}</p>
            </div>
          </div>
          <Link
            href={`/portal/treningsplan/${log.TrainingPlanSession.id}`}
            className="text-sm font-medium text-[#154212] hover:underline"
          >
            Se økt
          </Link>
        </div>
      )}
    </div>
  );
}
