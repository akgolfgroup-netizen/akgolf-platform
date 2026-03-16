import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { BookingCard } from "./booking-card";
import { Calendar } from "lucide-react";

interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  serviceType: { name: string; color?: string | null; duration: number };
  instructor: { user: { name?: string | null }; title?: string | null };
  location?: { name: string } | null;
}

const THEME = {
  gold: "#B8975C",
  textSecondary: "#64748B",
  textTertiary: "#9CA3AF",
  border: "#EBE5DA",
};

function groupByDate(bookings: Booking[]): [string, Booking[]][] {
  const groups = new Map<string, Booking[]>();
  for (const b of bookings) {
    const key = format(new Date(b.startTime), "yyyy-MM-dd");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(b);
  }
  return Array.from(groups.entries());
}

function dateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "I dag";
  if (isTomorrow(date)) return "I morgen";
  if (isThisWeek(date)) return format(date, "EEEE", { locale: nb });
  return format(date, "d. MMMM yyyy", { locale: nb });
}

interface BookingListProps {
  bookings: Booking[];
  emptyMessage?: string;
}

export function BookingList({ bookings, emptyMessage = "Ingen bookinger" }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border"
        style={{ borderColor: THEME.border }}
      >
        <Calendar className="w-12 h-12 mb-4" style={{ color: THEME.textTertiary }} />
        <p style={{ color: THEME.textSecondary }}>{emptyMessage}</p>
      </div>
    );
  }

  const groups = groupByDate(bookings);

  return (
    <div className="space-y-6">
      {groups.map(([dateStr, items]) => (
        <div key={dateStr}>
          <p 
            className="text-xs font-semibold uppercase tracking-wider mb-3 capitalize"
            style={{ color: THEME.gold }}
          >
            {dateLabel(dateStr)}
          </p>
          <div className="space-y-3">
            {items.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
