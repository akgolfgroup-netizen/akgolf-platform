import { requirePortalUser } from "@/lib/portal/auth";
import { WeekCalendar } from "@/components/portal/heritage/week-calendar";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { getCalendarEvents } from "./actions";
import { HeroHeading, GlassCard } from "@/components/portal/premium";
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
            <span className="font-serif italic text-[var(--color-primary)] font-normal">
              kalender
            </span>
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description="Oversikt over dine coaching-timer, treninger og turneringer — synkronisert med Google Calendar."
        actions={
          <a
            href="#calendar-sync"
            className="h-11 px-6 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 text-[var(--color-text)] text-[12px] font-semibold hover:bg-white transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Sync-innstillinger
          </a>
        }
      />

      {/* Week Calendar */}
      <GlassCard variant="light" padding="lg">
        <WeekCalendar events={formattedEvents} />
      </GlassCard>

      {/* Google Calendar Sync */}
      <div id="calendar-sync">
        <GlassCard variant="light" padding="lg" delay={0.08}>
          <CalendarSyncSettings />
        </GlassCard>
      </div>
    </div>
  );
}
