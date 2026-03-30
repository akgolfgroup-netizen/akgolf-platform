import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { getCalendarEvents, getPeriodizationBands } from "./actions";
import type { CalendarEvent } from "./actions";

interface CalendarDay {
  date: Date;
  day: number;
  isOtherMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

function buildCalendarGrid(
  currentDate: Date,
  events: CalendarEvent[]
): CalendarDay[] {
  const today = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // ISO weeks start on Monday
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return days.map((date) => {
    const dayEvents = events.filter((e) => isSameDay(e.startDate, date));
    return {
      date,
      day: date.getDate(),
      isOtherMonth: !isSameMonth(date, currentDate),
      isToday: isSameDay(date, today),
      events: dayEvents,
    };
  });
}

function eventStyle(type: CalendarEvent["type"]): string {
  switch (type) {
    case "coaching":
      return "bg-[#E5E5E5] text-[#171717]";
    case "training":
      return "bg-[#D4D4D4] text-[#171717]";
    case "tournament":
      return "bg-[#171717] text-white";
    case "booking":
      return "bg-[#A3A3A3] text-white";
    default:
      return "bg-[#E5E5E5] text-[#171717]";
  }
}

export default async function KalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; offset?: string }>;
}) {
  const params = await searchParams;
  const view =
    params.view === "uke"
      ? "uke"
      : params.view === "dag"
        ? "dag"
        : "maned";
  const monthOffset = parseInt(params.offset ?? "0", 10);

  const baseDate = addMonths(new Date(), monthOffset);
  const monthStart = startOfMonth(baseDate);
  const monthEnd = endOfMonth(baseDate);

  const [events, _bands] = await Promise.all([
    getCalendarEvents(monthStart, monthEnd),
    getPeriodizationBands(baseDate.getFullYear()),
  ]);

  const calendarDays = buildCalendarGrid(baseDate, events);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white capitalize">
            {format(baseDate, "MMMM yyyy", { locale: nb })}
          </h1>
          <div className="flex gap-1">
            <a
              href={`?view=${view}&offset=${monthOffset - 1}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#333] bg-white text-[#171717] hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </a>
            <a
              href={`?view=${view}&offset=0`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#333] bg-white text-[#171717] hover:bg-gray-100 transition-colors"
            >
              I dag
            </a>
            <a
              href={`?view=${view}&offset=${monthOffset + 1}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#333] bg-white text-[#171717] hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 rounded-lg bg-[#F5F5F5]">
            {[
              { label: "Maned", val: "maned" },
              { label: "Uke", val: "uke" },
              { label: "Dag", val: "dag" },
            ].map((v) => (
              <a
                key={v.val}
                href={`?view=${v.val}&offset=${monthOffset}`}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  view === v.val
                    ? "bg-white shadow-sm text-[#171717]"
                    : "text-[#737373] hover:text-[#171717]"
                }`}
              >
                {v.label}
              </a>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#171717] text-white hover:bg-[#262626] transition-colors">
            <Plus className="w-4 h-4" />
            Legg til
          </button>
        </div>
      </div>

      <div className="max-w-5xl space-y-4">
        {/* Event Type Legend */}
        <div className="flex gap-4">
          {[
            { className: "bg-[#E5E5E5]", label: "Coaching" },
            { className: "bg-[#D4D4D4]", label: "Trening" },
            { className: "bg-[#171717]", label: "Turnering" },
            { className: "bg-[#A3A3A3]", label: "Booking" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-xs text-white"
            >
              <div className={`w-3 h-3 rounded-sm ${item.className}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="rounded-lg overflow-hidden bg-white border border-[#E5E5E5]">
          {/* Header */}
          <div className="grid grid-cols-7 bg-[#FAFAFA]">
            {["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-xs font-semibold text-[#737373]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-[1px] bg-[#E5E5E5]">
            {calendarDays.map((item) => (
              <div
                key={item.date.toISOString()}
                className={`min-h-[60px] p-2 bg-white ${
                  item.isToday ? "border-2 border-[#171717]" : ""
                }`}
              >
                <span
                  className={`text-sm ${
                    item.isOtherMonth ? "text-[#A3A3A3]" : "text-[#171717]"
                  } ${item.isToday ? "font-semibold" : ""}`}
                >
                  {item.day}
                </span>
                {item.events.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {item.events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`px-1 py-0.5 rounded text-[10px] truncate ${eventStyle(event.type)}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {item.events.length > 2 && (
                      <span className="text-[10px] text-[#737373]">
                        +{item.events.length - 2} til
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {events.length === 0 && (
          <div className="rounded-lg border border-[#E5E5E5] bg-white p-8 text-center">
            <p className="text-sm text-[#737373]">
              Ingen hendelser denne måneden.
            </p>
            <p className="mt-1 text-xs text-[#A3A3A3]">
              Book en time eller legg til en treningsplan for å se hendelser her.
            </p>
          </div>
        )}

        {/* iCal sync */}
        <CalendarSyncSettings />

        {/* Info section */}
        <details className="rounded-lg bg-white border border-[#E5E5E5] group">
          <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none hover:bg-[#F5F5F5]">
            <span className="text-sm font-medium text-[#171717]">
              Kalender-info
            </span>
            <span className="ml-auto text-xs text-[#737373] group-open:hidden">
              Vis mer
            </span>
            <span className="ml-auto text-xs text-[#737373] hidden group-open:inline">
              Skjul
            </span>
          </summary>
          <div className="px-4 pb-4 space-y-4 border-t border-[#E5E5E5]">
            {/* Color codes */}
            <div className="pt-4">
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-widest mb-2">
                Fargekoder
              </p>
              <div className="flex flex-wrap gap-3">
                {PORTAL_CONTENT.kalender.colorCodes.map((item) => (
                  <div key={item.color} className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        item.color === "gold"
                          ? "bg-[#B07D4F]"
                          : item.color === "blue"
                            ? "bg-blue-500"
                            : item.color === "green"
                              ? "bg-green-500"
                              : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm text-[#525252]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sync info */}
            <div>
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-widest mb-2">
                Synkronisering
              </p>
              <p className="text-sm text-[#525252]">
                {PORTAL_CONTENT.kalender.syncInfo}
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
