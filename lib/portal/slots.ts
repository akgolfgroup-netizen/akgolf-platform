import { addMinutes, addHours, isBefore, isAfter } from "date-fns";

export function generateSlots({
  availStart,
  availEnd,
  duration,
  bufferAfter,
  date,
  existingBookings,
  blockedTimes,
  minNoticeHours,
}: {
  availStart: string; // "HH:MM"
  availEnd: string; // "HH:MM"
  duration: number; // minutter
  bufferAfter: number; // minutter
  date: Date; // midnatt UTC for valgt dato
  existingBookings: { startTime: Date; endTime: Date }[];
  blockedTimes: { startTime: Date; endTime: Date }[];
  minNoticeHours: number;
}): string[] {
  const slots: string[] = [];
  const step = duration + bufferAfter;
  const earliest = addHours(new Date(), minNoticeHours);

  const [startH, startM] = availStart.split(":").map(Number);
  const [endH, endM] = availEnd.split(":").map(Number);

  const current = new Date(date);
  current.setUTCHours(startH, startM, 0, 0);
  const windowEnd = new Date(date);
  windowEnd.setUTCHours(endH, endM, 0, 0);

  while (isBefore(current, windowEnd)) {
    const slotEnd = addMinutes(current, duration);

    if (isAfter(slotEnd, windowEnd)) break;

    if (!isBefore(current, earliest)) {
      const hasBookingConflict = existingBookings.some(
        (b) => isBefore(current, b.endTime) && isAfter(slotEnd, b.startTime)
      );
      const hasBlockedConflict = blockedTimes.some(
        (b) => isBefore(current, b.endTime) && isAfter(slotEnd, b.startTime)
      );
      if (!hasBookingConflict && !hasBlockedConflict) {
        slots.push(new Date(current).toISOString());
      }
    }

    current.setMinutes(current.getMinutes() + step);
  }

  return slots;
}
