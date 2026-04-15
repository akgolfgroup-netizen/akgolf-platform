import { requirePortalUser } from "@/lib/portal/auth";

import { startOfWeek, endOfWeek, format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { getCalendarEvents } from "./actions";

import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Settings2 } from "lucide-react";

export default async function KalenderPage() {
  await requirePortalUser();

  // Get current week events
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  void getCalendarEvents(weekStart, weekEnd);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-portal-muted">
          {format(now, "EEEE d. MMMM yyyy", { locale: nb })}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-portal-text">
          Din{" "}
          <span className="font-serif italic text-portal-text font-normal">
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
            className="h-11 px-6 rounded-full bg-white border border-portal-border text-portal-text text-[12px] font-semibold hover:bg-portal-hover transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Sync-innstillinger
          </a>
        </div>
      </div>

      {/* Week Calendar */}
      <PremiumCard>
        <div className="p-6 text-center">
          <p className="text-[13px] text-portal-muted">Ukekalender kommer snart.</p>
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
