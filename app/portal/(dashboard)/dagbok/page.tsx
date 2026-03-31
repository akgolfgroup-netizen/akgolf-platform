import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs } from "./actions";
import { DagbokClient } from "./dagbok-client";
import { format, isToday, isYesterday, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays } from "date-fns";
import { nb } from "date-fns/locale";

function formatLogDate(date: Date): string {
  if (isToday(date)) {
    return `I dag, ${format(date, "HH:mm")}`;
  }
  if (isYesterday(date)) {
    return `I går, ${format(date, "HH:mm")}`;
  }
  return format(date, "d. MMMM, HH:mm", { locale: nb });
}

function getIntensityLabel(rating: number | null): string {
  if (!rating) return "Middels";
  if (rating >= 4) return "Høy";
  if (rating >= 2) return "Middels";
  return "Lav";
}

export default async function DagbokPage() {
  await requirePortalUser();
  const logs = await getTrainingLogs();

  // Transform logs to display format
  const displayLogs = logs.map((log) => ({
    id: log.id,
    day: format(log.date, "d"),
    month: format(log.date, "MMM", { locale: nb }),
    date: formatLogDate(log.date),
    title: log.TrainingPlanSession?.title ?? log.focusArea ?? "Treningsøkt",
    type: log.focusArea?.toUpperCase().replace(" ", "_") ?? "GENERAL",
    status: log.TrainingPlanSession ? "Coaching" : "Fullført",
    statusVariant: (log.TrainingPlanSession ? "info" : "success") as "info" | "success",
    duration: log.durationMinutes ? `${log.durationMinutes} min` : "-",
    intensity: getIntensityLabel(log.rating),
    focus: log.focusArea ?? "Generell",
    mood: (log.rating ?? 3) >= 3 ? "good" : "challenging" as "good" | "challenging",
    notes: log.notes ?? "",
  }));

  // Calculate stats from real data
  const now = new Date();
  const weekStart = addDays(now, -now.getDay() + 1); // Monday
  const logsThisWeek = logs.filter(l => l.date >= weekStart);
  const totalMinutesThisWeek = logsThisWeek.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0);

  // Calculate streak (consecutive days with logs)
  const sortedDates = [...new Set(logs.map(l => format(l.date, "yyyy-MM-dd")))].sort().reverse();
  let streak = 0;
  const today = format(now, "yyyy-MM-dd");
  const yesterday = format(addDays(now, -1), "yyyy-MM-dd");

  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    let checkDate = sortedDates[0] === today ? now : addDays(now, -1);
    for (const dateStr of sortedDates) {
      if (format(checkDate, "yyyy-MM-dd") === dateStr) {
        streak++;
        checkDate = addDays(checkDate, -1);
      } else {
        break;
      }
    }
  }

  // Calculate average intensity
  const logsWithRating = logs.filter(l => l.rating !== null);
  const avgIntensity = logsWithRating.length > 0
    ? (logsWithRating.reduce((sum, l) => sum + (l.rating ?? 0), 0) / logsWithRating.length * 2).toFixed(1)
    : "0";

  // Training categories from real data
  const categoryMap = new Map<string, { count: number; minutes: number }>();
  for (const log of logs) {
    const area = log.focusArea ?? "Generell";
    const existing = categoryMap.get(area) || { count: 0, minutes: 0 };
    categoryMap.set(area, {
      count: existing.count + 1,
      minutes: existing.minutes + (log.durationMinutes ?? 0),
    });
  }

  const totalSessions = logs.length;
  const categories = Array.from(categoryMap.entries())
    .map(([name, data]) => ({
      name,
      count: `${data.count} økter`,
      color: name === "Putting" ? "#2563EB"
           : name === "Driver" ? "#DC2626"
           : name === "Approach" ? "#059669"
           : "#D97706",
      bgColor: name === "Putting" ? "#DBEAFE"
             : name === "Driver" ? "#FEE2E2"
             : name === "Approach" ? "#D1FAE5"
             : "#FEF3C7",
      progress: totalSessions > 0 ? Math.round((data.count / totalSessions) * 100) : 0,
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  // Calendar data
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Days from previous month to fill first week
  const firstDayOfWeek = getDay(monthStart); // 0 = Sunday
  const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Adjust for Monday start
  const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) =>
    addDays(monthStart, -(daysFromPrevMonth - i))
  );

  // Days from next month to fill last week
  const lastDayOfWeek = getDay(monthEnd);
  const daysToNextMonth = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  const nextMonthDays = Array.from({ length: daysToNextMonth }, (_, i) =>
    addDays(monthEnd, i + 1)
  );

  const logDates = new Set(logs.map(l => format(l.date, "yyyy-MM-dd")));

  const calendarDays = [
    ...prevMonthDays.map(d => ({ day: parseInt(format(d, "d")), otherMonth: true, hasLog: false, today: false })),
    ...daysInMonth.map(d => ({
      day: parseInt(format(d, "d")),
      otherMonth: false,
      hasLog: logDates.has(format(d, "yyyy-MM-dd")),
      today: isToday(d),
    })),
    ...nextMonthDays.map(d => ({ day: parseInt(format(d, "d")), otherMonth: true, hasLog: false, today: false })),
  ];

  // Streak days for the week
  const weekDays = ["M", "T", "O", "T", "F", "L", "S"];
  const streakDays = weekDays.map((day, idx) => {
    const date = addDays(weekStart, idx);
    return {
      day,
      active: logDates.has(format(date, "yyyy-MM-dd")),
      today: isToday(date),
    };
  });

  const stats = {
    sessionsThisWeek: logsThisWeek.length,
    hoursTotal: (totalMinutesThisWeek / 60).toFixed(1),
    streak,
    avgIntensity,
  };

  return (
    <DagbokClient
      displayLogs={displayLogs}
      stats={stats}
      categories={categories}
      calendarDays={calendarDays}
      streakDays={streakDays}
      monthName={format(now, "MMMM yyyy", { locale: nb })}
    />
  );
}
