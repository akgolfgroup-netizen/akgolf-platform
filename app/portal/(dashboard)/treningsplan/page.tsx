import { requirePortalUser } from "@/lib/portal/auth";
import { getActivePlan, getCurrentWeekSessions } from "./actions";
import { isStaff } from "@/lib/portal/rbac";
import { Calendar, CheckCircle2, Clock, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfISOWeek, addDays, addWeeks, isToday as isTodayFn } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import { GeneratePlanButton } from "@/components/portal/treningsplan/generate-plan-button";
import { ManualPlanButton } from "@/components/portal/treningsplan/manual-plan-button";
import { PortalHeader, PortalCard } from "@/components/portal/premium";

interface SessionExercise {
  name: string;
  details: string;
}

type PyramidLevel = "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";

function inferPyramidLevel(focusArea: string | null): PyramidLevel | null {
  if (!focusArea) return null;
  const lower = focusArea.toLowerCase();
  if (["styrke", "kondisjon", "mobilitet", "eksplosivitet", "gym"].some((k) => lower.includes(k))) return "FYS";
  if (["sving", "teknikk", "driver", "jern", "full swing"].some((k) => lower.includes(k))) return "TEK";
  if (["putting", "putt", "chip", "pitch", "bunker", "nærspill", "approach", "range"].some((k) => lower.includes(k))) return "SLAG";
  if (["bane", "strategi", "management", "9 hull", "18 hull", "spill"].some((k) => lower.includes(k))) return "SPILL";
  if (["turnering", "test", "konkurranse", "benchmark"].some((k) => lower.includes(k))) return "TURN";
  return null;
}

interface PyramidConfigEntry {
  token: string;
  label: string;
}

const pyramidConfig: Record<PyramidLevel, PyramidConfigEntry> = {
  FYS: { token: "var(--color-warning)", label: "Fysisk" },
  TEK: { token: "var(--color-primary)", label: "Teknikk" },
  SLAG: { token: "var(--color-primary-alt)", label: "Slag" },
  SPILL: { token: "var(--color-ai)", label: "Spill" },
  TURN: { token: "var(--color-grey-900)", label: "Turnering" },
};

interface TreningsplanPageProps {
  searchParams: Promise<{ week?: string }>;
}

export default async function TreningsplanPage({ searchParams }: TreningsplanPageProps) {
  const user = await requirePortalUser();
  const { week } = await searchParams;
  const weekOffset = parseInt(week ?? "0", 10) || 0;

  const plan = await getActivePlan();
  const sessions = await getCurrentWeekSessions();
  const canGenerate = isStaff(user?.role);

  const now = new Date();
  const targetDate = addWeeks(now, weekOffset);
  const weekStart = startOfISOWeek(targetDate);
  const weekNumber = format(targetDate, "w");

  const sessionsByDay = new Map(sessions.map((s) => [s.dayOfWeek, s]));

  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((day, idx) => {
    const dayOfWeek = idx + 1;
    const session = sessionsByDay.get(dayOfWeek);
    const date = addDays(weekStart, idx);

    return {
      dayName: day,
      date,
      isToday: isTodayFn(date),
      session: session
        ? {
            id: session.id,
            title: session.title,
            duration: session.durationMinutes,
            focusArea: session.focusArea,
            pyramidLevel: inferPyramidLevel(session.focusArea),
            completed: session.TrainingLog ? session.TrainingLog.length > 0 : false,
            exercises: (session.exercises as unknown as SessionExercise[]) || [],
          }
        : null,
    };
  });

  if (!plan) {
    return (
      <div className="space-y-8">
        <PortalHeader
          label={`Uke ${weekNumber}`}
          title="Treningsplan"
          description="Din ukeplan med ekter, fokusomrader og AI-anbefalinger."
        />

        <PortalCard padding="lg" className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "var(--color-grey-100)" }}
          >
            <Calendar
              className="w-8 h-8"
              style={{ color: "var(--color-grey-500)" }}
            />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text)" }}>
            Din treningsplan er tom
          </h2>
          <p
            className="text-sm max-w-md mx-auto mb-6"
            style={{ color: "var(--color-muted)" }}
          >
            {canGenerate
              ? "Dra øvelser fra banken, eller la AI lage en plan for deg."
              : "Kontakt din coach for å få en personlig treningsplan."}
          </p>
          {canGenerate && (
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <ManualPlanButton studentId={user.id} />
              <GeneratePlanButton studentId={user.id} />
            </div>
          )}
        </PortalCard>
      </div>
    );
  }

  const headerActions = (
    <>
      <div className="flex items-center gap-1">
        <Link
          href={`/portal/treningsplan?week=${weekOffset - 1}`}
          className="p-2 rounded-lg transition-colors hover:bg-[var(--color-grey-100)]"
          aria-label="Forrige uke"
        >
          <ChevronLeft className="w-4 h-4" style={{ color: "var(--color-muted)" }} />
        </Link>
        {weekOffset !== 0 && (
          <Link
            href="/portal/treningsplan"
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--color-grey-100)]"
            style={{ color: "var(--color-muted)" }}
          >
            I dag
          </Link>
        )}
        <Link
          href={`/portal/treningsplan?week=${weekOffset + 1}`}
          className="p-2 rounded-lg transition-colors hover:bg-[var(--color-grey-100)]"
          aria-label="Neste uke"
        >
          <ChevronRight className="w-4 h-4" style={{ color: "var(--color-muted)" }} />
        </Link>
      </div>
      {canGenerate && (
        <>
          <ManualPlanButton studentId={user.id} />
          <GeneratePlanButton studentId={user.id} />
        </>
      )}
    </>
  );

  const weekRange = `${format(weekStart, "d.", { locale: nb })} - ${format(
    addDays(weekStart, 6),
    "d. MMMM yyyy",
    { locale: nb }
  )}`;

  return (
    <div className="space-y-6">
      <PortalHeader
        label={`Uke ${weekNumber}`}
        title="Treningsplan"
        description={weekRange}
        actions={headerActions}
      />

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const level: PyramidLevel = day.session?.pyramidLevel ?? "SLAG";
          const levelToken = pyramidConfig[level].token;
          const levelLabel = pyramidConfig[level].label;
          const isCompleted = day.session?.completed ?? false;
          const borderLeftColor = isCompleted ? "var(--color-success)" : levelToken;

          return (
            <div
              key={day.dayName}
              className="bg-white rounded-[24px] overflow-hidden transition-all duration-300"
              style={{
                border: day.isToday
                  ? "1px solid var(--color-accent-cta)"
                  : "1px solid rgba(0, 0, 0, 0.05)",
                boxShadow: day.isToday
                  ? "0 0 0 3px color-mix(in srgb, var(--color-accent-cta) 25%, transparent)"
                  : undefined,
              }}
            >
              {/* Day Header */}
              <div
                className="p-3 text-center border-b"
                style={{
                  backgroundColor: day.isToday
                    ? "color-mix(in srgb, var(--color-accent-cta) 12%, white)"
                    : "var(--color-grey-100)",
                  borderColor: day.isToday
                    ? "color-mix(in srgb, var(--color-accent-cta) 30%, transparent)"
                    : "var(--color-grey-200)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: day.isToday
                      ? "var(--color-primary)"
                      : "var(--color-grey-500)",
                  }}
                >
                  {day.dayName}
                </p>
                <p
                  className="text-lg font-bold mt-0.5"
                  style={{
                    color: day.isToday
                      ? "var(--color-primary)"
                      : "var(--color-text)",
                  }}
                >
                  {format(day.date, "d")}
                </p>
              </div>

              {/* Day Content */}
              <div className="p-3 min-h-[180px]">
                {day.session ? (
                  <Link href={`/portal/treningsplan/${day.session.id}`}>
                    <div
                      className="p-3 rounded-xl border-l-4 transition-all hover:shadow-md"
                      style={{
                        borderLeftColor,
                        backgroundColor: isCompleted
                          ? "color-mix(in srgb, var(--color-success) 10%, white)"
                          : `color-mix(in srgb, ${levelToken} 10%, white)`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/60"
                          style={{ color: "var(--color-text)" }}
                        >
                          {levelLabel}
                        </span>
                        {isCompleted && (
                          <CheckCircle2
                            className="w-4 h-4"
                            style={{ color: "var(--color-success)" }}
                          />
                        )}
                      </div>
                      <h4
                        className="font-medium text-sm leading-tight"
                        style={{ color: "var(--color-text)" }}
                      >
                        {day.session.title}
                      </h4>
                      <div
                        className="flex items-center gap-1 mt-2 text-xs"
                        style={{ color: "var(--color-muted)" }}
                      >
                        <Clock className="w-3 h-3" />
                        {day.session.duration} min
                      </div>
                      {day.session.exercises.length > 0 && (
                        <p
                          className="text-xs mt-2"
                          style={{ color: "var(--color-grey-500)" }}
                        >
                          {day.session.exercises.length} øvelser
                        </p>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <Target
                      className="w-6 h-6 mb-2"
                      style={{ color: "var(--color-grey-300)" }}
                    />
                    <p className="text-xs" style={{ color: "var(--color-grey-500)" }}>
                      Hviledag
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span
          className="font-medium"
          style={{ color: "var(--color-grey-500)" }}
        >
          Pyramidenivåer:
        </span>
        {(Object.entries(pyramidConfig) as [PyramidLevel, PyramidConfigEntry][]).map(
          ([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: config.token }}
              />
              <span style={{ color: "var(--color-muted)" }}>
                {config.label} ({key})
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
