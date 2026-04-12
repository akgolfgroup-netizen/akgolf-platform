import { requirePortalUser } from "@/lib/portal/auth";
import { getActivePlan, getCurrentWeekSessions } from "./actions";
import { isStaff } from "@/lib/portal/rbac";
import { format, startOfISOWeek, addDays, addWeeks, isToday as isTodayFn } from "date-fns";
import { nb } from "date-fns/locale";
import { TreningsplanClient } from "./treningsplan-client";

// ---------------------------------------------------------------------
// Types & pyramid inference (server-only)
// ---------------------------------------------------------------------

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

// ---------------------------------------------------------------------
// Server component
// ---------------------------------------------------------------------

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

  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"].map((day, idx) => {
    const dayOfWeek = idx + 1;
    const session = sessionsByDay.get(dayOfWeek);
    const date = addDays(weekStart, idx);

    return {
      dayName: day,
      dateISO: date.toISOString(),
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

  return (
    <TreningsplanClient
      hasPlan={!!plan}
      weekNumber={weekNumber}
      weekRange={weekRange}
      weekOffset={weekOffset}
      weekDays={weekDays}
      canGenerate={canGenerate}
      userId={user.id}
    />
  );
}
