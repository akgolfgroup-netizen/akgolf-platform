"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath } from "next/cache";
import {
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  startOfDay,
} from "date-fns";
import { nb } from "date-fns/locale";
import { nanoid } from "nanoid";

/** Supabase returnerer relasjoner som arrays. Hent første element safe. */
function rel<T>(value: unknown): T | null {
  if (Array.isArray(value)) return (value[0] as T) ?? null;
  return (value as T) ?? null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface DayCapacity {
  date: Date;
  dayOfWeek: number;
  dayName: string;
  regularHours: number;
  overrideHours: number | null;
  effectiveHours: number;
  bookedHours: number;
  hasOverride: boolean;
  override: {
    id: string;
    startTime: string;
    endTime: string;
  } | null;
  regularSlots: {
    startTime: string;
    endTime: string;
  }[];
}

export interface WeekCapacityData {
  weekStart: Date;
  weekEnd: Date;
  weekLabel: string;
  instructor: {
    id: string;
    name: string;
  };
  days: DayCapacity[];
  totalRegularHours: number;
  totalEffectiveHours: number;
  totalBookedHours: number;
  occupancyPercent: number;
}

export interface PackageDemand {
  totalExpectedSessions: number;
  instructorDemand: {
    instructorId: string;
    instructorName: string;
    sessions: number;
  }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function calculateHoursFromSlots(
  slots: { startTime: string; endTime: string }[]
): number {
  return slots.reduce((total, slot) => {
    const [startH, startM] = slot.startTime.split(":").map(Number);
    const [endH, endM] = slot.endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return total + (endMinutes - startMinutes) / 60;
  }, 0);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Henter uke-kapasitet med overrides for en instruktor
 */
export async function getWeekCapacityWithOverrides(
  weekStartDate: Date,
  instructorId: string
): Promise<WeekCapacityData | null> {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) return null;

  const supabase = await createServerSupabase();
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 });

  // Hent instruktor
  const { data: instructor } = await supabase
    .from("Instructor")
    .select(`
      id,
      User (name),
      InstructorAvailability (dayOfWeek, startTime, endTime)
    `)
    .eq("id", instructorId)
    .single();

  if (!instructor) return null;

  // Hent alle date-overrides for uken
  const { data: overrides } = await supabase
    .from("InstructorDateAvailability")
    .select("*")
    .eq("instructorId", instructorId)
    .gte("date", weekStart.toISOString())
    .lte("date", weekEnd.toISOString());

  // Hent bookinger for uken
  const { data: bookings } = await supabase
    .from("Booking")
    .select(`
      startTime,
      endTime,
      ServiceType (duration)
    `)
    .eq("instructorId", instructorId)
    .gte("startTime", weekStart.toISOString())
    .lte("startTime", weekEnd.toISOString())
    .in("status", ["PENDING", "CONFIRMED", "COMPLETED"]);

  // Bygg dag-data
  const days: DayCapacity[] = [];
  let totalRegularHours = 0;
  let totalEffectiveHours = 0;
  let totalBookedHours = 0;

  const availabilities = (instructor.InstructorAvailability as { dayOfWeek: number; startTime: string; endTime: string }[]) || [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const dayOfWeek = date.getDay();
    const dayStart = startOfDay(date);

    // Finn regular availability for denne dagen
    const regularSlots = availabilities
      .filter((a) => a.dayOfWeek === dayOfWeek)
      .map((a) => ({
        startTime: a.startTime,
        endTime: a.endTime,
      }));

    const regularHours = calculateHoursFromSlots(regularSlots);

    // Finn override for denne datoen
    const override = (overrides || []).find(
      (o) => startOfDay(new Date(o.date)).getTime() === dayStart.getTime()
    );

    let overrideHours: number | null = null;
    if (override) {
      overrideHours = calculateHoursFromSlots([
        { startTime: override.startTime, endTime: override.endTime },
      ]);
    }

    const effectiveHours = overrideHours ?? regularHours;

    // Tell bookede timer for denne dagen
    const dayBookings = (bookings || []).filter((b) => {
      const bookingDay = startOfDay(new Date(b.startTime));
      return bookingDay.getTime() === dayStart.getTime();
    });
    const bookedHours = dayBookings.reduce(
      (sum, b) => sum + (rel<{ duration: number }>(b.ServiceType)?.duration ?? 50) / 60,
      0
    );

    days.push({
      date,
      dayOfWeek,
      dayName: format(date, "EEEE", { locale: nb }),
      regularHours,
      overrideHours,
      effectiveHours,
      bookedHours,
      hasOverride: !!override,
      override: override
        ? {
            id: override.id,
            startTime: override.startTime,
            endTime: override.endTime,
          }
        : null,
      regularSlots,
    });

    totalRegularHours += regularHours;
    totalEffectiveHours += effectiveHours;
    totalBookedHours += bookedHours;
  }

  return {
    weekStart,
    weekEnd,
    weekLabel: `Uke ${format(weekStart, "w")} - ${format(weekStart, "d. MMM", { locale: nb })} - ${format(weekEnd, "d. MMM", { locale: nb })}`,
    instructor: {
      id: instructor.id,
      name: rel<{ name: string | null }>(instructor.User)?.name ?? "Ukjent",
    },
    days,
    totalRegularHours,
    totalEffectiveHours,
    totalBookedHours,
    occupancyPercent:
      totalEffectiveHours > 0
        ? Math.round((totalBookedHours / totalEffectiveHours) * 100)
        : 0,
  };
}

/**
 * Lagrer en uke-override for en dato
 */
export async function saveWeekOverride(data: {
  instructorId: string;
  date: Date;
  startTime: string;
  endTime: string;
}): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) {
    return { success: false, error: "Ingen tilgang" };
  }

  const supabase = await createServerSupabase();

  try {
    const dayStart = startOfDay(data.date);

    // Sjekk om override allerede eksisterer
    const { data: existing } = await supabase
      .from("InstructorDateAvailability")
      .select("id")
      .eq("instructorId", data.instructorId)
      .eq("date", dayStart.toISOString())
      .single();

    if (existing) {
      // Oppdater eksisterende
      await supabase
        .from("InstructorDateAvailability")
        .update({
          startTime: data.startTime,
          endTime: data.endTime,
        })
        .eq("id", existing.id);
    } else {
      // Opprett ny
      await supabase.from("InstructorDateAvailability").insert({
        id: nanoid(),
        instructorId: data.instructorId,
        date: dayStart.toISOString(),
        startTime: data.startTime,
        endTime: data.endTime,
      });
    }

    revalidatePath("/booking");
    revalidatePath("/admin/kapasitet");

    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke lagre override" };
  }
}

/**
 * Sletter en override (tilbake til fast)
 */
export async function deleteWeekOverride(
  instructorId: string,
  date: Date
): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) {
    return { success: false, error: "Ingen tilgang" };
  }

  const supabase = await createServerSupabase();

  try {
    const dayStart = startOfDay(date);

    await supabase
      .from("InstructorDateAvailability")
      .delete()
      .eq("instructorId", instructorId)
      .eq("date", dayStart.toISOString());

    revalidatePath("/booking");
    revalidatePath("/admin/kapasitet");

    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke slette override" };
  }
}

/**
 * Beregner pakke-etterspørsel basert på aktive abonnementer
 */
export async function getPackageDemand(): Promise<PackageDemand> {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) {
    return { totalExpectedSessions: 0, instructorDemand: [] };
  }

  const supabase = await createServerSupabase();

  // Hent aktive abonnementer
  const { data: subscriptions } = await supabase
    .from("UserSubscription")
    .select(`
      sessionsUsedThisMonth,
      CoachingPackage (sessionsPerMonth)
    `)
    .eq("status", "ACTIVE");

  // Beregn totalt antall gjenværende økter
  // sessionsRemaining = sessionsPerMonth - sessionsUsedThisMonth
  let totalSessions = 0;
  for (const sub of subscriptions || []) {
    const sessionsPerMonth = rel<{ sessionsPerMonth: number }>(sub.CoachingPackage)?.sessionsPerMonth ?? 0;
    const sessionsRemaining = Math.max(0, sessionsPerMonth - sub.sessionsUsedThisMonth);
    totalSessions += sessionsRemaining;
  }

  // Siden CoachingPackage ikke har instructorId, fordeler vi jevnt på instruktører
  const { data: instructors } = await supabase
    .from("Instructor")
    .select(`
      id,
      User (name)
    `);

  const sessionsPerInstructor = Math.ceil(totalSessions / Math.max((instructors || []).length, 1));

  const instructorDemand = (instructors || []).map((i) => ({
    instructorId: i.id,
    instructorName: rel<{ name: string | null }>(i.User)?.name ?? "Ukjent",
    sessions: sessionsPerInstructor,
  }));

  return { totalExpectedSessions: totalSessions, instructorDemand };
}

/**
 * Henter alle instruktører for dropdown
 */
export async function getInstructors(): Promise<
  { id: string; name: string }[]
> {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) return [];

  const supabase = await createServerSupabase();

  const { data: instructors } = await supabase
    .from("Instructor")
    .select(`
      id,
      User (name)
    `)
    .order("createdAt", { ascending: true });

  return (instructors || []).map((i) => ({
    id: i.id,
    name: rel<{ name: string | null }>(i.User)?.name ?? "Ukjent",
  }));
}
