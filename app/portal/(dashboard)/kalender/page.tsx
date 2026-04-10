import { requirePortalUser } from "@/lib/portal/auth";
import { WeekCalendar } from "@/components/portal/heritage/week-calendar";
import { startOfWeek, endOfWeek } from "date-fns";
import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { getCalendarEvents } from "./actions";
import { PortalHeader, PortalCard } from "@/components/portal/premium";
import { Settings2 } from "lucide-react";

export default async function KalenderPage() {
  await requirePortalUser();

  // Get current week events
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const events = await getCalendarEvents(weekStart, weekEnd);

  const formattedEvents = events.map((event) => {
    const duration = event.endDate
      ? Math.round(
          (event.endDate.getTime() - event.startDate.getTime()) / 60000,
        )
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
      <PortalHeader
        label="Portal"
        title="Kalender"
        description="Oversikt over dine coaching-timer, treninger og turneringer — synkronisert med Google Calendar."
        actions={
          <a
            href="#calendar-sync"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5"
          >
            <Settings2 className="h-4 w-4" />
            Sync-innstillinger
          </a>
        }
      />

      {/* Week Calendar */}
      <PortalCard padding="sm" as="section">
        <WeekCalendar events={formattedEvents} />
      </PortalCard>

      {/* Google Calendar Sync */}
      <PortalCard padding="lg" as="section" id="calendar-sync">
        <CalendarSyncSettings />
      </PortalCard>
    </div>
  );
}
