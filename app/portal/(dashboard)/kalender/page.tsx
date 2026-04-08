import { requirePortalUser } from "@/lib/portal/auth";
import { WeekCalendar } from "@/components/portal/heritage/week-calendar";
import { addWeeks, startOfWeek, endOfWeek } from "date-fns";
import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { getCalendarEvents } from "./actions";

export default async function KalenderPage() {
  const user = await requirePortalUser();

  // Get current week events
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const events = await getCalendarEvents(weekStart, weekEnd);

  const formattedEvents = events.map((event) => {
    // Calculate duration from start and end dates
    const duration = event.endDate
      ? Math.round((event.endDate.getTime() - event.startDate.getTime()) / 60000)
      : 60;
    return {
      id: event.id,
      title: event.title,
      startTime: event.startDate.toISOString(),
      duration,
      type: event.type as "coaching" | "training" | "tournament" | "booking",
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1c1c16]">Kalender</h1>
        <p className="text-[#6b7366] mt-1">
          Oversikt over dine coaching-timer, treninger og turneringer
        </p>
      </div>

      {/* Week Calendar */}
      <WeekCalendar events={formattedEvents} />

      {/* Google Calendar Sync */}
      <CalendarSyncSettings />
    </div>
  );
}
