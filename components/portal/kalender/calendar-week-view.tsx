"use client";


import { Icon } from "@/components/ui/icon";
import { format, isSameDay, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import {
  MonoLabel,
  VerticalTimeline,
  type TimelineItem,
  type TimelineDotColor,
} from "@/components/portal/patterns";
import type { CalendarEvent, CalendarEventType } from "@/app/portal/(dashboard)/kalender/actions";


interface CalendarWeekViewProps {
  events: CalendarEvent[];
  weekStart: Date;
}

const TYPE_DOT: Record<CalendarEventType, TimelineDotColor> = {
  booking: "blue",
  coaching: "sage",
  training: "lime",
  tournament: "coral",
};

const TYPE_LABEL: Record<CalendarEventType, string> = {
  booking: "BOOKING",
  coaching: "COACHING",
  training: "TRENING",
  tournament: "TURNERING",
};

export function CalendarWeekView({ events, weekStart }: CalendarWeekViewProps) {
  const base = startOfDay(weekStart);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d;
  });

  const now = new Date();

  const eventsByDay = days.map((day) => ({
    day,
    items: events.filter((e) => isSameDay(e.startDate, day)),
  }));

  const hasAny = eventsByDay.some((g) => g.items.length > 0);

  if (!hasAny) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon name="calendar_today"Days className="h-6 w-6" />
        </div>
        <p className="text-sm text-outline">Ingen hendelser denne uka.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {eventsByDay.map(({ day, items }) => {
        const isToday = isSameDay(day, now);
        return (
          <section key={day.toISOString()} className="space-y-2">
            <div className="flex items-center gap-3">
              <MonoLabel
                size="sm"
                uppercase
                className={isToday ? "text-primary" : "text-grey-500"}
              >
                {format(day, "EEEE d. MMM", { locale: nb })}
              </MonoLabel>
              <span className="h-px flex-1 bg-grey-100" />
              <MonoLabel size="xs" className="text-grey-400">
                {items.length}
              </MonoLabel>
            </div>
            {items.length === 0 ? (
              <p className="pl-[34px] text-[12px] text-grey-400">Ingen hendelser</p>
            ) : (
              <VerticalTimeline
                items={items.map<TimelineItem>((e) => ({
                  id: e.id,
                  time: format(e.startDate, "HH:mm"),
                  title: e.title,
                  meta: TYPE_LABEL[e.type],
                  dotColor: TYPE_DOT[e.type],
                  active: isToday && e.startDate >= now,
                }))}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}
