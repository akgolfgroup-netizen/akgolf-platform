import { requirePortalUser } from "@/lib/portal/auth";
import { WeekCalendar } from "@/components/portal/heritage/week-calendar";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { getCalendarEvents } from "./actions";
import { HeroHeading } from "@/components/portal/premium";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
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
    <div className="space-y-10">
      <HeroHeading
        label={format(now, "EEEE d. MMMM yyyy", { locale: nb })}
        title={
          <>
            Din{" "}
            <span className="font-serif italic text-portal-text font-normal">
              kalender
            </span>
            <span className="text-portal-muted">.</span>
          </>
        }
        description="Oversikt over dine coaching-timer, treninger og turneringer — synkronisert med Google Calendar."
        actions={
          <a
            href="#calendar-sync"
            className="h-11 px-6 rounded-full bg-white border border-portal-border text-portal-text text-[12px] font-semibold hover:bg-portal-hover transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Sync-innstillinger
          </a>
        }
      />

      {/* Week Calendar */}
      <PremiumCard>
        <WeekCalendar events={formattedEvents} />
      </PremiumCard>

      {/* Google Calendar Sync */}
      <div id="calendar-sync">
        <PremiumCard>
          <CalendarSyncSettings />
        </PremiumCard>
      </div>
    </div>
  );
}
