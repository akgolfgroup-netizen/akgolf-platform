import { getCalendarEvents, getPeriodizationBands } from "./actions";
import { PeriodizationBand } from "@/components/portal/kalender/periodization-band";
import { CalendarListView } from "@/components/portal/kalender/calendar-list-view";
import { CalendarWeekView } from "@/components/portal/kalender/calendar-week-view";
import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { Topbar } from "@/components/portal/layout/topbar";
import { startOfISOWeek, endOfMonth, startOfMonth, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const THEME = {
  navy: "#0F2950",
  gold: "#B8975C",
  goldLight: "#E8D4B0",
  text: "#02060D",
  textSecondary: "#64748B",
  bg: "#FFFFFF",
  border: "#EBE5DA",
};

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
    <div>
      <Topbar title="Kalender" />
      <div className="p-8 max-w-5xl">
        {/* Periodization band */}
        <PeriodizationBand bands={periodBands} year={year} />

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div 
            className="flex gap-1 p-1 rounded-xl border"
            style={{ 
              background: "#FAFBFC",
              borderColor: THEME.border,
            }}
          >
            {[
              { label: "Liste", val: "liste" },
              { label: "Uke", val: "uke" },
            ].map((v) => (
              <a
                key={v.val}
                href={`?view=${v.val}&offset=${monthOffset}`}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: view === v.val ? `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldLight})` : "transparent",
                  color: view === v.val ? "#FFFFFF" : THEME.textSecondary,
                  boxShadow: view === v.val ? "0 4px 12px rgba(184,151,92,0.25)" : "none",
                }}
              >
                {v.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`?view=${view}&offset=${monthOffset - 1}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:shadow-md border"
              style={{ 
                background: THEME.bg,
                borderColor: THEME.border,
                color: THEME.text,
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </a>
            <span 
              className="text-base font-semibold min-w-[140px] text-center capitalize"
              style={{ color: THEME.navy }}
            >
              {baseDate.toLocaleDateString("nb-NO", { month: "long", year: "numeric" })}
            </span>
            <a
              href={`?view=${view}&offset=${monthOffset + 1}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:shadow-md border"
              style={{ 
                background: THEME.bg,
                borderColor: THEME.border,
                color: THEME.text,
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Calendar content */}
        <div 
          className="rounded-3xl p-6 border"
          style={{ 
            background: THEME.bg,
            borderColor: THEME.border,
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          {view === "uke" ? (
            <CalendarWeekView events={events} weekStart={startOfISOWeek(baseDate)} />
          ) : (
            <CalendarListView events={events} />
          )}
        </div>

        {/* iCal sync */}
        <div className="mt-8">
          <CalendarSyncSettings />
        </div>
      </div>
    </div>
  );
}
