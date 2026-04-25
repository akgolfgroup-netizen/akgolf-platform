const SLOT_INTERVAL_MINUTES = 30;

export interface AvailabilityWindow {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface BookingWindow {
  startTime: Date;
  endTime: Date;
}

export interface ComputeRemainingSlotsInput {
  now: Date;
  weekEnd: Date;
  windows: AvailabilityWindow[];
  bookings: BookingWindow[];
  blocked: BookingWindow[];
  durationMinutes: number;
}

/**
 * Ren beregningsfunksjon — testbar uten Prisma. Iterer gjennom hver dag
 * fra now til weekEnd, finn tilgjengelighetsvinduene for ukedagen, og
 * tell slots som ikke overlapper med booking eller blokkert tid.
 */
export function computeRemainingSlots({
  now,
  weekEnd,
  windows,
  bookings,
  blocked,
  durationMinutes,
}: ComputeRemainingSlotsInput): number {
  if (durationMinutes <= 0 || now >= weekEnd) return 0;

  let total = 0;
  const cursorDay = new Date(now);
  cursorDay.setHours(0, 0, 0, 0);

  while (cursorDay < weekEnd) {
    const dayOfWeek = cursorDay.getDay();
    const todaysWindows = windows.filter((w) => w.dayOfWeek === dayOfWeek);

    for (const w of todaysWindows) {
      const [sh, sm] = w.startTime.split(":").map(Number);
      const [eh, em] = w.endTime.split(":").map(Number);
      const winStart = new Date(cursorDay);
      winStart.setHours(sh, sm, 0, 0);
      const winEnd = new Date(cursorDay);
      winEnd.setHours(eh, em, 0, 0);

      const start = winStart < now ? new Date(now) : winStart;
      const end = winEnd > weekEnd ? new Date(weekEnd) : winEnd;
      if (start >= end) continue;

      const slot = new Date(start);
      while (true) {
        const slotEnd = new Date(slot.getTime() + durationMinutes * 60_000);
        if (slotEnd > end) break;

        const overlapsBooking = bookings.some(
          (b) => slot < b.endTime && slotEnd > b.startTime,
        );
        const overlapsBlocked = blocked.some(
          (b) => slot < b.endTime && slotEnd > b.startTime,
        );

        if (!overlapsBooking && !overlapsBlocked) {
          total += 1;
        }

        slot.setMinutes(slot.getMinutes() + SLOT_INTERVAL_MINUTES);
      }
    }

    cursorDay.setDate(cursorDay.getDate() + 1);
    cursorDay.setHours(0, 0, 0, 0);
  }

  return total;
}

export function endOfWeek(now: Date): Date {
  const d = new Date(now);
  const day = d.getDay();
  const daysToSunday = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + daysToSunday);
  d.setHours(23, 59, 59, 999);
  return d;
}
