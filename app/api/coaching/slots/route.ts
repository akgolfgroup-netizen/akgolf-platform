import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { BookingStatus } from "@prisma/client";
import { addHours, addDays, isBefore, isAfter } from "date-fns";

interface AvailabilitySlot {
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  reservedFor: string | null;
}

interface TimeSlot {
  time: string; // ISO string
  startTime: string; // "HH:MM" display
  available: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date"); // YYYY-MM-DD
  const packageSlug = searchParams.get("packageSlug");

  if (!dateStr || !packageSlug) {
    return NextResponse.json(
      { error: "Mangler parametere: date, packageSlug" },
      { status: 400 }
    );
  }

  // Parse date in Europe/Oslo context
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) {
    return NextResponse.json({ error: "Ugyldig dato" }, { status: 400 });
  }

  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const dayOfWeek = date.getUTCDay(); // 0=Sunday
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0));

  try {
    // Fetch package and availability in parallel
    const [coachingPackage, availabilitySlots, existingBookings] =
      await Promise.all([
        prisma.coachingPackage.findUnique({
          where: { slug: packageSlug },
          select: {
            id: true,
            bookingType: true,
            bookingWindowDays: true,
            bookingWindowHours: true,
            slotsRequired: true,
            sessionDurationMin: true,
          },
        }),
        prisma.coachingAvailability.findMany({
          where: {
            dayOfWeek,
            isActive: true,
          },
          orderBy: { startTime: "asc" },
          select: {
            startTime: true,
            endTime: true,
            reservedFor: true,
          },
        }),
        prisma.booking.findMany({
          where: {
            startTime: { gte: date, lt: nextDay },
            status: {
              in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
            },
          },
          select: { startTime: true, endTime: true },
        }),
      ]);

    if (!coachingPackage) {
      return NextResponse.json(
        { error: "Pakke ikke funnet" },
        { status: 404 }
      );
    }

    const now = new Date();

    // Validate booking window
    if (coachingPackage.bookingType === "DROP_IN") {
      // DROP_IN: only slots within 48 hours
      const maxTime = addHours(now, 48);
      if (isAfter(date, maxTime)) {
        return NextResponse.json([], {
          headers: {
            "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          },
        });
      }
    } else if (coachingPackage.bookingType === "SELF_BOOK") {
      // SELF_BOOK: within booking_window_days
      const windowDays = coachingPackage.bookingWindowDays ?? 14;
      const maxDate = addDays(now, windowDays);
      if (isAfter(date, maxDate)) {
        return NextResponse.json([], {
          headers: {
            "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          },
        });
      }
    }

    // Filter slots based on reservation rules
    const isJuniorElite = packageSlug.includes("junior");
    const filteredSlots = availabilitySlots.filter(
      (slot: AvailabilitySlot) => {
        // Exclude junior_elite reserved slots unless user has junior package
        if (slot.reservedFor === "junior_elite" && !isJuniorElite) {
          return false;
        }
        return true;
      }
    );

    // Build available time slots
    const slotsRequired = coachingPackage.slotsRequired;
    const availableSlots: TimeSlot[] = [];

    // Minimum notice: 2 hours for coaching
    const minNoticeTime = addHours(now, 2);

    for (let i = 0; i <= filteredSlots.length - slotsRequired; i++) {
      const slot = filteredSlots[i];
      const [startH, startM] = slot.startTime.split(":").map(Number);

      // For multi-slot packages, check consecutive slots
      if (slotsRequired > 1) {
        let consecutiveAvailable = true;
        for (let j = 0; j < slotsRequired; j++) {
          if (i + j >= filteredSlots.length) {
            consecutiveAvailable = false;
            break;
          }
          const checkSlot = filteredSlots[i + j];

          // Verify slots are consecutive (each 25 min apart: 20 min + 5 min gap)
          if (j > 0) {
            const prevSlot = filteredSlots[i + j - 1];
            const [prevH, prevM] = prevSlot.startTime.split(":").map(Number);
            const [curH, curM] = checkSlot.startTime.split(":").map(Number);
            const prevMinutes = prevH * 60 + prevM;
            const curMinutes = curH * 60 + curM;
            // Slots should be 25 minutes apart (20 min session + 5 min buffer)
            if (curMinutes - prevMinutes > 30) {
              consecutiveAvailable = false;
              break;
            }
          }

          // Check if this sub-slot is booked
          const [checkH, checkM] = checkSlot.startTime.split(":").map(Number);
          const checkStart = new Date(date);
          checkStart.setUTCHours(checkH, checkM, 0, 0);
          const [checkEndH, checkEndM] = checkSlot.endTime
            .split(":")
            .map(Number);
          const checkEnd = new Date(date);
          checkEnd.setUTCHours(checkEndH, checkEndM, 0, 0);

          const isBooked = existingBookings.some(
            (b) =>
              isBefore(checkStart, b.endTime) && isAfter(checkEnd, b.startTime)
          );
          if (isBooked) {
            consecutiveAvailable = false;
            break;
          }
        }

        if (!consecutiveAvailable) continue;
      } else {
        // Single slot: check if booked
        const slotStart = new Date(date);
        slotStart.setUTCHours(startH, startM, 0, 0);
        const [endH, endM] = slot.endTime.split(":").map(Number);
        const slotEnd = new Date(date);
        slotEnd.setUTCHours(endH, endM, 0, 0);

        const isBooked = existingBookings.some(
          (b) =>
            isBefore(slotStart, b.endTime) && isAfter(slotEnd, b.startTime)
        );
        if (isBooked) continue;
      }

      // Build the slot time
      const slotTime = new Date(date);
      slotTime.setUTCHours(startH, startM, 0, 0);

      // Skip slots in the past or within minimum notice
      if (isBefore(slotTime, minNoticeTime)) continue;

      availableSlots.push({
        time: slotTime.toISOString(),
        startTime: slot.startTime,
        available: true,
      });
    }

    return NextResponse.json(availableSlots, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[coaching/slots] DB error:", error);
    return NextResponse.json(
      { error: "Tjeneste utilgjengelig" },
      { status: 503 }
    );
  }
}
