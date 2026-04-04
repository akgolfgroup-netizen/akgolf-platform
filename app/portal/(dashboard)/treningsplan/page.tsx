import { requirePortalUser } from "@/lib/portal/auth";
import { getActivePlan, getCurrentWeekSessions } from "./actions";
import { isStaff } from "@/lib/portal/rbac";
import { Calendar, Sparkles } from "lucide-react";
import { format, startOfISOWeek, addDays, isToday } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import { TrainingCalendar } from "@/components/portal/treningsplan/training-calendar";

interface SessionExercise {
  name: string;
  details: string;
}

function inferPyramidLevel(focusArea: string | null): "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN" | null {
  if (!focusArea) return null;
  const lower = focusArea.toLowerCase();
  if (["styrke", "kondisjon", "mobilitet", "eksplosivitet", "gym"].some((k) => lower.includes(k))) return "FYS";
  if (["sving", "teknikk", "driver", "jern", "full swing"].some((k) => lower.includes(k))) return "TEK";
  if (["putting", "putt", "chip", "pitch", "bunker", "naerspill", "approach", "range"].some((k) => lower.includes(k))) return "SLAG";
  if (["bane", "strategi", "management", "9 hull", "18 hull", "spill"].some((k) => lower.includes(k))) return "SPILL";
  if (["turnering", "test", "konkurranse", "benchmark"].some((k) => lower.includes(k))) return "TURN";
  return null;
}

export default async function TreningsplanPage() {
  const user = await requirePortalUser();
  const plan = await getActivePlan();
  const sessions = await getCurrentWeekSessions();
  const canGenerate = isStaff(user?.role);

  const now = new Date();
  const weekStart = startOfISOWeek(now);
  const weekNumber = format(now, "w");
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const sessionsByDay = new Map(
    sessions.map((s) => [s.dayOfWeek, s])
  );

  const calendarDays = weekDates.map((date, idx) => {
    const dayOfWeek = idx + 1;
    const session = sessionsByDay.get(dayOfWeek);
    const exercises = session?.exercises
      ? (session.exercises as unknown as SessionExercise[])
      : [];
    const completed = session?.TrainingLog
      ? session.TrainingLog.length > 0
      : false;

    const calendarSessions = session
      ? [
          {
            id: session.id,
            title: session.title,
            durationMinutes: session.durationMinutes,
            focusArea: session.focusArea,
            pyramidLevel: inferPyramidLevel(session.focusArea),
            completed,
            exerciseCount: exercises.length,
          },
        ]
      : [];

    return {
      id: session?.id ?? `rest-${dayOfWeek}`,
      dayName: format(date, "EEE", { locale: nb }).slice(0, 3),
      dateNum: format(date, "d"),
      date: format(date, "yyyy-MM-dd"),
      isToday: isToday(date),
      isRest: !session,
      sessions: calendarSessions,
    };
  });

  const weekLabel = `Uke ${weekNumber} \u00B7 ${format(weekStart, "d. MMM", { locale: nb })}\u2013${format(addDays(weekStart, 6), "d. MMM yyyy", { locale: nb })}`;

  if (!plan) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[28px] font-medium tracking-[-0.02em] text-[#1D1D1F]">
            Treningsplan
          </h1>
          <p className="text-sm text-[#86868B] mt-1">{weekLabel}</p>
        </div>

        <div className="portal-card text-center py-16">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mb-5">
              <Calendar className="w-8 h-8 text-[#D2D2D7]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1D1D1F] mb-2">
              Din treningsplan er tom
            </h2>
            <p className="text-sm text-[#86868B] max-w-md mb-6">
              {canGenerate
                ? "Dra ovelser fra banken til hoyre, eller la AI lage en plan for deg."
                : "Kontakt din coach for a fa en personlig treningsplan."}
            </p>
            {canGenerate && (
              <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#AF52DE] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                <Sparkles className="w-4 h-4" />
                Generer plan med AI
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Find period info from current week
  const currentWeek = plan.TrainingPlanWeek.find((w) => {
    const ws = new Date(w.weekStart);
    return ws <= now && addDays(ws, 7) > now;
  });
  const periodLabel = currentWeek?.focus || plan.periodType || undefined;

  return (
    <TrainingCalendar
      weekNumber={weekNumber}
      weekLabel={weekLabel}
      periodLabel={periodLabel}
      days={calendarDays}
      canGenerate={canGenerate}
    />
  );
}
