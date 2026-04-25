import { describe, it, expect } from "vitest";
import {
  computeRemainingSlots,
  type AvailabilityWindow,
  type BookingWindow,
} from "@/lib/portal/booking/available-slots-compute";

const monday = (hours: number, minutes = 0) => {
  const d = new Date(2026, 3, 27, hours, minutes, 0, 0);
  return d;
};

const sundayEnd = () => {
  const d = new Date(2026, 4, 3, 23, 59, 59, 999);
  return d;
};

const fullWeekWindows: AvailabilityWindow[] = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
  dayOfWeek,
  startTime: "10:00",
  endTime: "12:00",
}));

describe("computeRemainingSlots", () => {
  it("returnerer 0 når durationMinutes er 0", () => {
    const result = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings: [],
      blocked: [],
      durationMinutes: 0,
    });
    expect(result).toBe(0);
  });

  it("returnerer 0 når now er etter weekEnd", () => {
    const result = computeRemainingSlots({
      now: new Date(2026, 4, 4, 0, 0, 0, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings: [],
      blocked: [],
      durationMinutes: 60,
    });
    expect(result).toBe(0);
  });

  it("returnerer 0 når instruktøren ikke har noen vinduer", () => {
    const result = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: [],
      bookings: [],
      blocked: [],
      durationMinutes: 60,
    });
    expect(result).toBe(0);
  });

  it("teller 60-minutters slots fra ledig ukeplan uten bookinger", () => {
    const result = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings: [],
      blocked: [],
      durationMinutes: 60,
    });
    expect(result).toBe(15);
  });

  it("trekker fra slots som overlapper med eksisterende booking", () => {
    const bookings: BookingWindow[] = [
      { startTime: monday(10, 0), endTime: monday(11, 0) },
    ];

    const baseline = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings: [],
      blocked: [],
      durationMinutes: 60,
    });

    const withBooking = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings,
      blocked: [],
      durationMinutes: 60,
    });

    expect(withBooking).toBeLessThan(baseline);
    expect(baseline - withBooking).toBeGreaterThanOrEqual(1);
  });

  it("gir høyere antall for kortere økter (20 min) enn lengre (60 min)", () => {
    const short = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings: [],
      blocked: [],
      durationMinutes: 20,
    });
    const long = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings: [],
      blocked: [],
      durationMinutes: 60,
    });
    expect(short).toBeGreaterThan(long);
  });

  it("verdien er dynamisk og varierer med antall bookinger", () => {
    const noBookings = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings: [],
      blocked: [],
      durationMinutes: 60,
    });

    const someBookings: BookingWindow[] = [
      { startTime: monday(10, 0), endTime: monday(11, 0) },
      { startTime: new Date(2026, 3, 28, 10, 0, 0, 0), endTime: new Date(2026, 3, 28, 11, 0, 0, 0) },
    ];
    const withBookings = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings: someBookings,
      blocked: [],
      durationMinutes: 60,
    });

    expect(noBookings).not.toBe(8);
    expect(withBookings).not.toBe(8);
    expect(noBookings).not.toBe(withBookings);
  });

  it("respekterer blokkerte tider", () => {
    const blocked: BookingWindow[] = [
      { startTime: monday(10, 0), endTime: monday(12, 0) },
    ];

    const baseline = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings: [],
      blocked: [],
      durationMinutes: 60,
    });

    const withBlocked = computeRemainingSlots({
      now: monday(9, 0),
      weekEnd: sundayEnd(),
      windows: fullWeekWindows,
      bookings: [],
      blocked,
      durationMinutes: 60,
    });

    expect(baseline - withBlocked).toBeGreaterThanOrEqual(2);
  });
});
