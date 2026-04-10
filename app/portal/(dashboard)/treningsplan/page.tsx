import { requirePortalUser } from "@/lib/portal/auth";
import { getActivePlan, getCurrentWeekSessions } from "./actions";
import { isStaff } from "@/lib/portal/rbac";
import { Calendar, CheckCircle2, Clock, Target, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { format, startOfISOWeek, addDays, addWeeks, isToday as isTodayFn } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import { GeneratePlanButton } from "@/components/portal/treningsplan/generate-plan-button";
import { ManualPlanButton } from "@/components/portal/treningsplan/manual-plan-button";

interface SessionExercise {
  name: string;
  details: string;
}

function inferPyramidLevel(focusArea: string | null): "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN" | null {
  if (!focusArea) return null;
  const lower = focusArea.toLowerCase();
  if (["styrke", "kondisjon", "mobilitet", "eksplosivitet", "gym"].some((k) => lower.includes(k))) return "FYS";
  if (["sving", "teknikk", "driver", "jern", "full swing"].some((k) => lower.includes(k))) return "TEK";
  if (["putting", "putt", "chip", "pitch", "bunker", "nærspill", "approach", "range"].some((k) => lower.includes(k))) return "SLAG";
  if (["bane", "strategi", "management", "9 hull", "18 hull", "spill"].some((k) => lower.includes(k))) return "SPILL";
  if (["turnering", "test", "konkurranse", "benchmark"].some((k) => lower.includes(k))) return "TURN";
  return null;
}

const pyramidConfig = {
  FYS: { color: "#f59e0b", bg: "bg-[#f59e0b]/10", label: "Fysisk" },
  TEK: { color: "#3b82f6", bg: "bg-[#3b82f6]/10", label: "Teknikk" },
  SLAG: { color: "#154212", bg: "bg-[#154212]/10", label: "Slag" },
  SPILL: { color: "#8b5cf6", bg: "bg-[#8b5cf6]/10", label: "Spill" },
  TURN: { color: "#1c1c16", bg: "bg-[#1c1c16]/10", label: "Turnering" },
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
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Treningsplan</h1>
          <p className="text-[#6b7366] mt-1">Uke {weekNumber}</p>
        </div>

        <div className="bg-white rounded-3xl p-12 text-center border border-[#c2c9bb]/50">
          <div className="w-16 h-16 rounded-2xl bg-[#f7f3ea] flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-8 h-8 text-[#c2c9bb]" />
          </div>
          <h2 className="text-lg font-semibold text-[#1c1c16] mb-2">
            Din treningsplan er tom
          </h2>
          <p className="text-sm text-[#6b7366] max-w-md mx-auto mb-6">
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
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Treningsplan</h1>
          <p className="text-[#6b7366] mt-1">
            Uke {weekNumber} · {format(weekStart, "d.", { locale: nb })} -
            {format(addDays(weekStart, 6), "d. MMMM yyyy", { locale: nb })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Uke-navigasjon */}
          <div className="flex items-center gap-1">
            <Link
              href={`/portal/treningsplan?week=${weekOffset - 1}`}
              className="p-2 rounded-lg hover:bg-[#f7f3ea] transition-colors"
              aria-label="Forrige uke"
            >
              <ChevronLeft className="w-4 h-4 text-[#6b7366]" />
            </Link>
            {weekOffset !== 0 && (
              <Link
                href="/portal/treningsplan"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#6b7366] hover:bg-[#f7f3ea] transition-colors"
              >
                I dag
              </Link>
            )}
            <Link
              href={`/portal/treningsplan?week=${weekOffset + 1}`}
              className="p-2 rounded-lg hover:bg-[#f7f3ea] transition-colors"
              aria-label="Neste uke"
            >
              <ChevronRight className="w-4 h-4 text-[#6b7366]" />
            </Link>
          </div>
          {canGenerate && (
            <>
              <ManualPlanButton studentId={user.id} />
              <GeneratePlanButton studentId={user.id} />
            </>
          )}
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <div
            key={day.dayName}
            className={`bg-white rounded-2xl border ${
              day.isToday ? "border-[#d2f000] ring-1 ring-[#d2f000]/50" : "border-[#c2c9bb]/50"
            } overflow-hidden`}
          >
            {/* Day Header */}
            <div
              className={`p-3 text-center border-b ${
                day.isToday ? "bg-[#d2f000]/10 border-[#d2f000]/30" : "bg-[#f7f3ea] border-[#c2c9bb]/30"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  day.isToday ? "text-[#154212]" : "text-[#8a9385]"
                }`}
              >
                {day.dayName}
              </p>
              <p
                className={`text-lg font-bold mt-0.5 ${
                  day.isToday ? "text-[#154212]" : "text-[#1c1c16]"
                }`}
              >
                {format(day.date, "d")}
              </p>
            </div>

            {/* Day Content */}
            <div className="p-3 min-h-[180px]">
              {day.session ? (
                <Link href={`/portal/treningsplan/${day.session.id}`}>
                  <div
                    className={`p-3 rounded-xl border-l-4 transition-all hover:shadow-md ${
                      day.session.completed
                        ? "bg-[#22c55e]/10 border-[#22c55e]"
                        : `${pyramidConfig[day.session.pyramidLevel || "SLAG"].bg} border-${
                            pyramidConfig[day.session.pyramidLevel || "SLAG"].color
                          }`
                    }`}
                    style={{
                      borderLeftColor: day.session.completed
                        ? "#22c55e"
                        : pyramidConfig[day.session.pyramidLevel || "SLAG"].color,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/50">
                        {pyramidConfig[day.session.pyramidLevel || "SLAG"].label}
                      </span>
                      {day.session.completed && (
                        <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                      )}
                    </div>
                    <h4 className="font-medium text-sm text-[#1c1c16] leading-tight">
                      {day.session.title}
                    </h4>
                    <div className="flex items-center gap-1 mt-2 text-xs text-[#6b7366]">
                      <Clock className="w-3 h-3" />
                      {day.session.duration} min
                    </div>
                    {day.session.exercises.length > 0 && (
                      <p className="text-xs text-[#8a9385] mt-2">
                        {day.session.exercises.length} øvelser
                      </p>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <Target className="w-6 h-6 text-[#c2c9bb] mb-2" />
                  <p className="text-xs text-[#8a9385]">Hviledag</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="text-[#8a9385] font-medium">Pyramidenivåer:</span>
        {Object.entries(pyramidConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-[#6b7366]">
              {config.label} ({key})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
