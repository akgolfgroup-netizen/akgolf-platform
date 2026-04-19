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
        <MonoLabel size="xs" uppercase className="block text-outline">
          {format(now, "EEEE d. MMMM yyyy", { locale: nb })}
        </MonoLabel>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          Din{" "}
          <span className="font-serif italic font-normal text-on-surface">
            kalender
          </span>
          <span className="text-outline">.</span>
        </h1>
        <p className="text-on-surface-variant">
          Oversikt over dine coaching-timer, treninger og turneringer — synkronisert med Google Calendar.
        </p>
        <div className="pt-2">
          <a
            href="#calendar-sync"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-outline-variant bg-white px-6 text-[12px] font-semibold text-on-surface shadow-sm transition-colors hover:bg-surface-container"
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
            <span className="h-px w-6 bg-surface-container-high" />
            <MonoLabel size="xs" uppercase className="text-outline">
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
