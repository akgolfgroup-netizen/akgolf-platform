import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { CalendarWeekView } from "@/components/portal/kalender/calendar-week-view";
import { CalendarDayView } from "@/components/portal/kalender/calendar-day-view";
import {
  addMonths,
  addWeeks,
  addDays,
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
import { getCalendarEvents } from "./actions";
import type { CalendarEvent } from "./actions";

interface CalendarDay {
  date: Date;
  day: number;
  isOtherMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

type ViewType = "maned" | "uke" | "dag";

function buildCalendarGrid(
  currentDate: Date,
  events: CalendarEvent[]
): CalendarDay[] {
  const today = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

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
      return "bg-blue-100 text-blue-800 border-l-2 border-blue-500";
    case "training":
      return "bg-green-100 text-green-800 border-l-2 border-green-500";
    case "tournament":
      return "bg-purple-100 text-purple-800 border-l-2 border-purple-500";
    case "booking":
      return "bg-amber-100 text-amber-800 border-l-2 border-amber-500";
    default:
      return "bg-[var(--color-grey-100)] text-[var(--color-grey-700)]";
  }
}

export default async function KalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; offset?: string }>;
}) {
  const params = await searchParams;
  const view: ViewType =
    params.view === "uke"
      ? "uke"
      : params.view === "dag"
        ? "dag"
        : "maned";
  const offset = parseInt(params.offset ?? "0", 10);

  // Calculate base date and date range based on view
  const today = new Date();
  let baseDate: Date;
  let rangeStart: Date;
  let rangeEnd: Date;
  let headerText: string;

  if (view === "dag") {
    baseDate = addDays(today, offset);
    rangeStart = baseDate;
    rangeEnd = baseDate;
    headerText = format(baseDate, "EEEE d. MMMM yyyy", { locale: nb });
  } else if (view === "uke") {
    baseDate = addWeeks(today, offset);
    rangeStart = startOfWeek(baseDate, { weekStartsOn: 1 });
    rangeEnd = endOfWeek(baseDate, { weekStartsOn: 1 });
    headerText = `Uke ${format(rangeStart, "I", { locale: nb })} - ${format(rangeStart, "MMMM yyyy", { locale: nb })}`;
  } else {
    baseDate = addMonths(today, offset);
    rangeStart = startOfMonth(baseDate);
    rangeEnd = endOfMonth(baseDate);
    headerText = format(baseDate, "MMMM yyyy", { locale: nb });
  }

  const events = await getCalendarEvents(rangeStart, rangeEnd);
  const calendarDays = view === "maned" ? buildCalendarGrid(baseDate, events) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[var(--color-grey-900)] capitalize">
            {headerText}
          </h1>
          <div className="flex gap-1">
            <a
              href={`?view=${view}&offset=${offset - 1}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-600)] hover:bg-[var(--color-grey-50)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </a>
            <a
              href={`?view=${view}&offset=0`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-600)] hover:bg-[var(--color-grey-50)] transition-colors"
            >
              I dag
            </a>
            <a
              href={`?view=${view}&offset=${offset + 1}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-600)] hover:bg-[var(--color-grey-50)] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-grey-100)]">
            {[
              { label: "Maned", val: "maned" as ViewType },
              { label: "Uke", val: "uke" as ViewType },
              { label: "Dag", val: "dag" as ViewType },
            ].map((v) => (
              <a
                key={v.val}
                href={`?view=${v.val}&offset=${offset}`}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  view === v.val
                    ? "bg-white shadow-sm text-[var(--color-grey-900)]"
                    : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)]"
                }`}
              >
                {v.label}
              </a>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-grey-900)] text-white hover:bg-[var(--color-grey-800)] transition-colors">
            <Plus className="w-4 h-4" />
            Legg til
          </button>
        </div>
      </div>

      <div className="max-w-5xl space-y-4">
        {/* Event Type Legend */}
        <div className="flex flex-wrap gap-4">
          {[
            { className: "bg-blue-500", label: "Coaching" },
            { className: "bg-green-500", label: "Trening" },
            { className: "bg-purple-500", label: "Turnering" },
            { className: "bg-amber-500", label: "Booking" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-xs text-[var(--color-grey-600)]"
            >
              <div className={`w-3 h-3 rounded-sm ${item.className}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar View */}
        {view === "dag" && (
          <CalendarDayView events={events} date={baseDate} />
        )}

        {view === "uke" && (
          <CalendarWeekView
            events={events}
            weekStart={startOfWeek(baseDate, { weekStartsOn: 1 })}
          />
        )}

        {view === "maned" && (
          <div className="rounded-2xl overflow-hidden bg-white border border-[var(--color-grey-200)]">
            {/* Header */}
            <div className="grid grid-cols-7 bg-[var(--color-grey-50)]">
              {["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-xs font-semibold text-[var(--color-grey-500)]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-[1px] bg-[var(--color-grey-200)]">
              {calendarDays.map((item) => (
                <div
                  key={item.date.toISOString()}
                  className={`min-h-[80px] p-2 bg-white ${
                    item.isToday
                      ? "ring-2 ring-inset ring-[var(--color-grey-900)]"
                      : ""
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      item.isOtherMonth
                        ? "text-[var(--color-grey-300)]"
                        : item.isToday
                          ? "text-[var(--color-grey-900)] font-bold"
                          : "text-[var(--color-grey-700)]"
                    }`}
                  >
                    {item.day}
                  </span>
                  {item.events.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {item.events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`px-1.5 py-0.5 rounded text-[10px] truncate ${eventStyle(event.type)}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {item.events.length > 2 && (
                        <span className="text-[10px] text-[var(--color-grey-500)] pl-1">
                          +{item.events.length - 2} til
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {events.length === 0 && view === "maned" && (
          <div className="rounded-2xl border border-[var(--color-grey-200)] bg-white p-8 text-center">
            <p className="text-sm text-[var(--color-grey-500)]">
              Ingen hendelser denne maneden.
            </p>
            <p className="mt-1 text-xs text-[var(--color-grey-400)]">
              Book en time eller legg til en treningsplan for a se hendelser her.
            </p>
          </div>
        )}

        {/* iCal sync */}
        <CalendarSyncSettings />
      </div>
    </div>
  );
}
