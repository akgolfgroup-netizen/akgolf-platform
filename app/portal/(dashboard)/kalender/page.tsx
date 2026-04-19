import { requirePortalUser } from "@/lib/portal/auth";

import { startOfWeek, endOfWeek, format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { CalendarWeekView } from "@/components/portal/kalender/calendar-week-view";
import { getCalendarEvents } from "./actions";

import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Settings2 } from "lucide-react";
import { MonoLabel } from "@/components/portal/patterns";

export default async function KalenderPage() {
  await requirePortalUser();

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const events = await getCalendarEvents(weekStart, weekEnd);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <MonoLabel size="xs" uppercase className="block text-portal-muted">
          {format(now, "EEEE d. MMMM yyyy", { locale: nb })}
        </MonoLabel>
        <h1 className="text-2xl font-bold tracking-tight text-portal-text">
          Din{" "}
          <span className="font-serif italic font-normal text-portal-text">
            kalender
          </span>
          <span className="text-portal-muted">.</span>
        </h1>
        <p className="text-portal-secondary">
          Oversikt over dine coaching-timer, treninger og turneringer — synkronisert med Google Calendar.
        </p>
        <div className="pt-2">
          <a
            href="#calendar-sync"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-portal-border bg-white px-6 text-[12px] font-semibold text-portal-text shadow-sm transition-colors hover:bg-portal-hover"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Sync-innstillinger
          </a>
        </div>
      </div>

      {/* Week view */}
      <PremiumCard>
        <div className="p-6">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-px w-6 bg-portal-muted" />
            <MonoLabel size="xs" uppercase className="text-portal-muted">
              Denne uka · {format(weekStart, "d", { locale: nb })}–{format(weekEnd, "d. MMM", { locale: nb })}
            </MonoLabel>
          </div>
          <CalendarWeekView events={events} weekStart={weekStart} />
        </div>
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
