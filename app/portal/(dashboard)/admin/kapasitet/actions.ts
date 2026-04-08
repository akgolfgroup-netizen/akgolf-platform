"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, format } from "date-fns";
import { nb } from "date-fns/locale";

export interface CoachCapacity {
  id: string;
  name: string;
  weeklySlots: number;
  bookedSlots: number;
  occupancy: number;
  weeklyRevenue: number;
  maxWeeklyRevenue: number;
}

export interface DailyBreakdown {
  day: string;
  dayOfWeek: number;
  coaches: Record<string, { booked: number; total: number }>;
}

export interface CapacityData {
  generatedAt: string;
  weekRange: { from: string; to: string };
  monthRange: { from: string; to: string };
  coaches: CoachCapacity[];
  dailyBreakdown: DailyBreakdown[];
  weeklyTotal: {
    slots: number;
    booked: number;
    occupancy: number;
    revenue: number;
    maxRevenue: number;
  };
  monthlyTotal: {
    revenue: number;
    maxRevenue: number;
    bookedCount: number;
  };
}

export async function getCapacityData(): Promise<CapacityData> {
  const supabase = await createServerSupabase();
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Hent alle instruktorer
  const { data: instructors } = await supabase
    .from("Instructor")
    .select(`
      id,
      User (name),
      InstructorAvailability (dayOfWeek, startTime, endTime)
    `);

  // Hent bookinger denne uken
  const { data: weeklyBookings } = await supabase
    .from("Booking")
    .select(`
      startTime,
      ServiceType (price, duration),
      Instructor (id)
    `)
    .gte("startTime", weekStart.toISOString())
    .lte("startTime", weekEnd.toISOString())
    .in("status", ["CONFIRMED", "COMPLETED"]);

  // Hent bookinger denne måneden
  const { data: monthlyBookings } = await supabase
    .from("Booking")
    .select(`
      ServiceType (price)
    `)
    .gte("startTime", monthStart.toISOString())
    .lte("startTime", monthEnd.toISOString())
    .in("status", ["CONFIRMED", "COMPLETED"]);

  // Beregn kapasitet per instruktor
  const coaches: CoachCapacity[] = (instructors || []).map((instructor) => {
    const availabilities = (instructor.InstructorAvailability as { dayOfWeek: number; startTime: string; endTime: string }[]) || [];
    
    // Beregn totale slots per uke basert på tilgjengelighet
    let weeklySlots = 0;
    let maxWeeklyRevenue = 0;
    const avgPricePerHour = 1500; // Gjennomsnittlig pris per time

    for (const avail of availabilities) {
      const startMinutes = parseInt(avail.startTime.split(":")[0]) * 60 + parseInt(avail.startTime.split(":")[1]);
      const endMinutes = parseInt(avail.endTime.split(":")[0]) * 60 + parseInt(avail.endTime.split(":")[1]);
      const slotsInWindow = Math.floor((endMinutes - startMinutes) / 50); // 50 min per slot
      weeklySlots += slotsInWindow;
      maxWeeklyRevenue += slotsInWindow * avgPricePerHour;
    }

    // Tell bookede slots denne uken
    const bookedSlots = (weeklyBookings || []).filter(
      (b) => (b.Instructor as { id: string } | null)?.id === instructor.id
    ).length;

    // Beregn faktisk inntekt
    const weeklyRevenue = (weeklyBookings || [])
      .filter((b) => (b.Instructor as { id: string } | null)?.id === instructor.id)
      .reduce((sum, b) => sum + ((b.ServiceType as { price: number } | null)?.price ?? 0), 0);

    return {
      id: instructor.id,
      name: (instructor.User as { name: string | null }).name ?? "Ukjent",
      weeklySlots,
      bookedSlots,
      occupancy: weeklySlots > 0 ? bookedSlots / weeklySlots : 0,
      weeklyRevenue,
      maxWeeklyRevenue,
    };
  });

  // Daglig nedbrytning (man-fre)
  const dailyBreakdown: DailyBreakdown[] = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    const dayOfWeek = day.getDay();

    const coachesData: Record<string, { booked: number; total: number }> = {};

    for (const instructor of instructors || []) {
      const availabilities = (instructor.InstructorAvailability as { dayOfWeek: number; startTime: string; endTime: string }[]) || [];
      
      const totalSlots = availabilities
        .filter((a: { dayOfWeek: number }) => a.dayOfWeek === dayOfWeek)
        .reduce((sum: number, a: { startTime: string; endTime: string }) => {
          const startMinutes = parseInt(a.startTime.split(":")[0]) * 60 + parseInt(a.startTime.split(":")[1]);
          const endMinutes = parseInt(a.endTime.split(":")[0]) * 60 + parseInt(a.endTime.split(":")[1]);
          return sum + Math.floor((endMinutes - startMinutes) / 50);
        }, 0);

      const bookedSlots = (weeklyBookings || []).filter(
        (b) =>
          (b.Instructor as { id: string } | null)?.id === instructor.id &&
          new Date(b.startTime).toDateString() === day.toDateString()
      ).length;

      coachesData[(instructor.User as { name: string | null }).name ?? "Ukjent"] = {
        booked: bookedSlots,
        total: totalSlots,
      };
    }

    dailyBreakdown.push({
      day: format(day, "EEEE", { locale: nb }),
      dayOfWeek,
      coaches: coachesData,
    });
  }

  // Totaler
  const weeklyTotal = {
    slots: coaches.reduce((sum, c) => sum + c.weeklySlots, 0),
    booked: coaches.reduce((sum, c) => sum + c.bookedSlots, 0),
    occupancy: 0,
    revenue: coaches.reduce((sum, c) => sum + c.weeklyRevenue, 0),
    maxRevenue: coaches.reduce((sum, c) => sum + c.maxWeeklyRevenue, 0),
  };
  weeklyTotal.occupancy = weeklyTotal.slots > 0 ? weeklyTotal.booked / weeklyTotal.slots : 0;

  const monthlyTotal = {
    revenue: (monthlyBookings || []).reduce((sum, b) => sum + ((b.ServiceType as { price: number } | null)?.price ?? 0), 0),
    maxRevenue: weeklyTotal.maxRevenue * 4, // Estimat
    bookedCount: (monthlyBookings || []).length,
  };

  return {
    generatedAt: new Date().toISOString(),
    weekRange: {
      from: format(weekStart, "d. MMM", { locale: nb }),
      to: format(weekEnd, "d. MMM", { locale: nb }),
    },
    monthRange: {
      from: format(monthStart, "d. MMM", { locale: nb }),
      to: format(monthEnd, "d. MMM", { locale: nb }),
    },
    coaches,
    dailyBreakdown,
    weeklyTotal,
    monthlyTotal,
  };
}
