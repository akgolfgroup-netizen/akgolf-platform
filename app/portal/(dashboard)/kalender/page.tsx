import { Icon } from "@/components/ui/icon";
import { requirePortalUser } from "@/lib/portal/auth";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { CalendarWeekView } from "@/components/portal/kalender/calendar-week-view";
import { getCalendarEvents } from "./actions";
import {
  MonoLabel,
  BentoGrid,
  BentoCard,
  BentoEyebrow,
  NightSurface,
  GlassPanel,
} from "@/components/portal/patterns";

export default async function KalenderPage() {
  await requirePortalUser();

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const events = await getCalendarEvents(weekStart, weekEnd);

  const stats = {
    total: events.length,
    booking: events.filter((e) => e.type === "booking").length,
    coaching: events.filter((e) => e.type === "coaching").length,
    training: events.filter((e) => e.type === "training").length,
    tournament: events.filter((e) => e.type === "tournament").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
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
            className="inline-flex h-11 items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-6 text-[12px] font-semibold text-on-surface shadow-sm transition-colors hover:bg-surface-container"
          >
            <Icon name="settings" className="h-3.5 w-3.5" />
            Sync-innstillinger
          </a>
        </div>
      </div>

      {/* Ukevisning */}
      <BentoGrid cols={2} gap="md">
        <BentoCard variant="light" padding="lg" className="col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-px w-6 bg-surface-container-high" />
            <MonoLabel size="xs" uppercase className="text-outline">
              Denne uka · {format(weekStart, "d", { locale: nb })}–{format(weekEnd, "d. MMM", { locale: nb })}
            </MonoLabel>
          </div>
          <CalendarWeekView events={events} weekStart={weekStart} />
        </BentoCard>
      </BentoGrid>

      {/* Data-visualisering */}
      <NightSurface variant="ambient" className="rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <MonoLabel size="xs" uppercase>Ukesoversikt</MonoLabel>
          <Icon name="analytics" size={20} className="text-on-surface" />
        </div>
        <div className="grid grid-cols-5 gap-4">
          <StatItem label="Totalt" value={stats.total} />
          <StatItem label="Booking" value={stats.booking} />
          <StatItem label="Coaching" value={stats.coaching} />
          <StatItem label="Trening" value={stats.training} />
          <StatItem label="Turnering" value={stats.tournament} />
        </div>
      </NightSurface>

      {/* Handlinger */}
      <div id="calendar-sync">
        <GlassPanel variant="light" padding="md">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="calendar_today" size={20} className="text-primary" />
            <MonoLabel size="xs" uppercase>Google Calendar-synk</MonoLabel>
          </div>
          <CalendarSyncSettings />
        </GlassPanel>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <MonoLabel size="lg" className="text-primary font-bold">
        {value}
      </MonoLabel>
      <p className="text-xs text-surface/60 mt-1">{label}</p>
    </div>
  );
}
