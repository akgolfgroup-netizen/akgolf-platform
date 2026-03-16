import { format } from "date-fns";
import type { CalendarEvent } from "@/app/portal/(dashboard)/kalender/actions";

const THEME = {
  text: "#02060D",
  textSecondary: "#64748B",
};

interface EventChipProps {
  event: CalendarEvent;
}

export function EventChip({ event }: EventChipProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm truncate transition-all hover:shadow-sm"
      style={{
        backgroundColor: `${event.color}15`,
        border: `1px solid ${event.color}30`,
        borderLeftWidth: "3px",
        borderLeftColor: event.color,
      }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: event.color }}
      />
      <span className="truncate font-medium" style={{ color: THEME.text }}>
        {event.title}
      </span>
      {!event.allDay && (
        <span 
          className="flex-shrink-0 text-xs"
          style={{ color: THEME.textSecondary }}
        >
          {format(new Date(event.startDate), "HH:mm")}
        </span>
      )}
    </div>
  );
}
