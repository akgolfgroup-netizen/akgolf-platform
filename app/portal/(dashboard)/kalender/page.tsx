import { getCalendarEvents, getPeriodizationBands } from "./actions";
import { PeriodizationBand } from "@/components/portal/kalender/periodization-band";
import { CalendarListView } from "@/components/portal/kalender/calendar-list-view";
import { CalendarWeekView } from "@/components/portal/kalender/calendar-week-view";
import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { startOfISOWeek, endOfMonth, startOfMonth, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";

export default async function KalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; offset?: string }>;
}) {
  const params = await searchParams;
  const view = params.view === "uke" ? "uke" : "liste";
  const monthOffset = parseInt(params.offset ?? "0", 10);

  const now = new Date();
  const baseDate = addMonths(now, monthOffset);
  const from = view === "liste" ? startOfMonth(baseDate) : startOfISOWeek(baseDate);
  const to = view === "liste" ? endOfMonth(baseDate) : new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000);
  const year = baseDate.getFullYear();

  const [events, periodBands] = await Promise.all([
    getCalendarEvents(from, to),
    getPeriodizationBands(year),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-snow)]">Kalender</h1>

      <div className="max-w-5xl space-y-6">
        {/* Periodization band */}
        <PeriodizationBand bands={periodBands} year={year} />

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 rounded-xl bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)]">
            {[
              { label: "Liste", val: "liste" },
              { label: "Uke", val: "uke" },
            ].map((v) => (
              <a
                key={v.val}
                href={`?view=${v.val}&offset=${monthOffset}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  view === v.val
                    ? "bg-[var(--color-gold)] text-white shadow-lg"
                    : "text-[var(--color-ink-40)] hover:text-[var(--color-snow)] hover:bg-white/5"
                }`}
              >
                {v.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`?view=${view}&offset=${monthOffset - 1}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)] text-[var(--color-snow)] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </a>
            <span className="text-base font-semibold min-w-[140px] text-center capitalize text-[var(--color-snow)]">
              {baseDate.toLocaleDateString("nb-NO", { month: "long", year: "numeric" })}
            </span>
            <a
              href={`?view=${view}&offset=${monthOffset + 1}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)] text-[var(--color-snow)] cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Calendar content */}
        <div className="rounded-2xl p-6 bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)]">
          {view === "uke" ? (
            <CalendarWeekView events={events} weekStart={startOfISOWeek(baseDate)} />
          ) : (
            <CalendarListView events={events} />
          )}
        </div>

        {/* iCal sync */}
        <CalendarSyncSettings />

        {/* Info-seksjon */}
        <details className="rounded-2xl bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)] group">
          <summary className="flex items-center gap-2 px-5 py-4 cursor-pointer list-none">
            <Info className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-sm font-medium text-[var(--color-snow)]">Kalender-info</span>
            <span className="ml-auto text-xs text-[var(--color-ink-40)] group-open:hidden">Vis mer</span>
            <span className="ml-auto text-xs text-[var(--color-ink-40)] hidden group-open:inline">Skjul</span>
          </summary>
          <div className="px-5 pb-5 space-y-4">
            {/* Fargekoder */}
            <div>
              <p className="text-xs font-semibold text-[var(--color-ink-40)] uppercase tracking-widest mb-2">
                Fargekoder
              </p>
              <div className="flex flex-wrap gap-3">
                {PORTAL_CONTENT.kalender.colorCodes.map((item) => (
                  <div key={item.color} className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        item.color === "gold"
                          ? "bg-[var(--color-gold)]"
                          : item.color === "blue"
                          ? "bg-blue-500"
                          : item.color === "green"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm text-[var(--color-ink-40)]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Synkronisering */}
            <div>
              <p className="text-xs font-semibold text-[var(--color-ink-40)] uppercase tracking-widest mb-2">
                Synkronisering
              </p>
              <p className="text-sm text-[var(--color-ink-40)]">
                {PORTAL_CONTENT.kalender.syncInfo}
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
