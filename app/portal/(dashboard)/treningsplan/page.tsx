import { requirePortalUser } from "@/lib/portal/auth";
import { getActivePlan, getCurrentWeekSessions } from "./actions";
import { isStaff } from "@/lib/portal/rbac";
import { Calendar, CheckCircle2, Clock, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfISOWeek, addDays, addWeeks, isToday as isTodayFn } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import { GeneratePlanButton } from "@/components/portal/treningsplan/generate-plan-button";
import { ManualPlanButton } from "@/components/portal/treningsplan/manual-plan-button";
import { HeroHeading, GlassCard } from "@/components/portal/premium";

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

  const weekRange = `${format(weekStart, "d.", { locale: nb })} – ${format(
    addDays(weekStart, 6),
    "d. MMMM yyyy",
    { locale: nb }
  )}`;

  const heroTitle = (
    <>
      Din trenings
      <span className="font-serif italic text-[var(--color-primary)] font-normal">plan</span>
      <span className="text-[var(--color-accent-cta)]">.</span>
    </>
  );

  const heroDescription = (
    <>
      Uken din i fugleperspektiv.{" "}
      <span className="font-semibold text-[var(--color-grey-900)]">{weekRange}</span>
    </>
  );

  if (!plan) {
    return (
      <div className="space-y-10">
        <HeroHeading
          label={`Uke ${weekNumber}`}
          title={heroTitle}
          description="Ingen aktiv plan enda. La AI lage en personlig plan, eller kontakt coachen din."
        />

        <GlassCard variant="light" padding="lg" className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[var(--color-primary)]/10">
            <Calendar className="w-8 h-8 text-[var(--color-primary)]" strokeWidth={1.75} />
          </div>
          <h2 className="text-[20px] font-semibold mb-2 text-[var(--color-grey-900)]">
            Din treningsplan er tom
          </h2>
          <p className="text-[13px] max-w-md mx-auto mb-6 text-[var(--color-muted)] leading-relaxed">
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
        </GlassCard>
      </div>
    );
  }

  const headerActions = (
    <>
      <div className="flex items-center gap-1 p-1 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm">
        <Link
          href={`/portal/treningsplan?week=${weekOffset - 1}`}
          className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-muted)] hover:text-[var(--color-grey-900)] hover:bg-white transition-colors"
          aria-label="Forrige uke"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        {weekOffset !== 0 && (
          <Link
            href="/portal/treningsplan"
            className="h-9 px-3 rounded-full text-[12px] font-semibold text-[var(--color-text)] hover:bg-white transition-colors inline-flex items-center"
          >
            I dag
          </Link>
        )}
        <Link
          href={`/portal/treningsplan?week=${weekOffset + 1}`}
          className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-muted)] hover:text-[var(--color-grey-900)] hover:bg-white transition-colors"
          aria-label="Neste uke"
        >
          <ChevronRight className="w-4 h-4" />
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

  return (
    <div className="space-y-10">
      <HeroHeading
        label={`Uke ${weekNumber}`}
        title={heroTitle}
        description={heroDescription}
        actions={headerActions}
      />

      {/* Section-label */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase mb-4 flex items-center gap-2">
          <span className="w-6 h-px bg-[var(--color-muted)]" />
          Ukens plan
        </p>

        {/* Week Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const level: PyramidLevel = day.session?.pyramidLevel ?? "SLAG";
            const levelToken = pyramidConfig[level].token;
            const levelLabel = pyramidConfig[level].label;
            const isCompleted = day.session?.completed ?? false;
            const borderLeftColor = isCompleted ? "var(--color-success)" : levelToken;

            return (
              <div
                key={day.dayName}
                className="relative rounded-[24px] overflow-hidden bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_-12px_rgba(10,31,24,0.12)] transition-all duration-300"
                style={
                  day.isToday
                    ? {
                        borderColor: "var(--color-accent-cta)",
                        boxShadow:
                          "0 0 0 3px color-mix(in srgb, var(--color-accent-cta) 25%, transparent), 0 12px 40px -12px rgba(209,248,67,0.35)",
                      }
                    : undefined
                }
              >
                {/* Day Header */}
                <div
                  className="p-3 text-center border-b"
                  style={{
                    backgroundColor: day.isToday
                      ? "color-mix(in srgb, var(--color-accent-cta) 14%, white)"
                      : "color-mix(in srgb, var(--color-grey-100) 70%, white)",
                    borderColor: day.isToday
                      ? "color-mix(in srgb, var(--color-accent-cta) 30%, transparent)"
                      : "rgba(10,31,24,0.06)",
                  }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.15em]"
                    style={{
                      color: day.isToday
                        ? "var(--color-primary)"
                        : "var(--color-muted)",
                    }}
                  >
                    {day.dayName}
                  </p>
                  <p
                    className="text-[22px] font-[300] mt-0.5 tabular-nums tracking-[-0.03em]"
                    style={{
                      color: day.isToday
                        ? "var(--color-primary)"
                        : "var(--color-grey-900)",
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
                            className="text-[10px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded bg-white/70"
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
                          className="font-medium text-[13px] leading-tight"
                          style={{ color: "var(--color-grey-900)" }}
                        >
                          {day.session.title}
                        </h4>
                        <div
                          className="flex items-center gap-1 mt-2 text-[11px]"
                          style={{ color: "var(--color-muted)" }}
                        >
                          <Clock className="w-3 h-3" />
                          {day.session.duration} min
                        </div>
                        {day.session.exercises.length > 0 && (
                          <p
                            className="text-[11px] mt-2"
                            style={{ color: "var(--color-muted)" }}
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
                      <p
                        className="text-[11px]"
                        style={{ color: "var(--color-muted)" }}
                      >
                        Hviledag
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] pt-2">
        <span className="font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">
          Pyramidenivåer
        </span>
        {(Object.entries(pyramidConfig) as [PyramidLevel, PyramidConfigEntry][]).map(
          ([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: config.token }}
              />
              <span className="text-[var(--color-muted)]">
                {config.label} ({key})
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
