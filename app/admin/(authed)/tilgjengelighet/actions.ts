"use server";

import { createClient } from "@supabase/supabase-js";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath, updateTag } from "next/cache";
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { syncGoogleCalendar as syncGoogleCalendarEngine } from "@/lib/portal/google-calendar/sync";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface Instructor {
  id: string;
  name: string;
  email: string;
}

/**
 * Henter instruktør-listen for tilgjengelighet-siden.
 *
 * RBAC: ADMIN ser alle. INSTRUCTOR ser kun seg selv.
 */
export async function getInstructors(): Promise<Instructor[]> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: instructors, error } = await supabase
    .from("Instructor")
    .select(`
      id,
      userId,
      User(name, email)
    `)
    .order("name", { foreignTable: "User", ascending: true });

  if (error) {
    logger.error("[getInstructors] Error:", error);
    return [];
  }

  type InstructorRow = {
    id: string;
    userId: string;
    User: Array<{ name?: string; email?: string }> | { name?: string; email?: string } | null;
  };

  const all = (instructors || []).map((i) => {
    const row = i as InstructorRow;
    const userObj = Array.isArray(row.User) ? row.User[0] : row.User;
    return {
      id: row.id,
      userId: row.userId,
      name: userObj?.name || "Ukjent",
      email: userObj?.email || "",
    };
  });

  // INSTRUCTOR-rolle ser kun seg selv — filtrer på Instructor.userId === currentUser.id
  if (user.role === "INSTRUCTOR") {
    return all
      .filter((i) => i.userId === user.id)
      .map(({ userId: _userId, ...rest }) => {
        void _userId;
        return rest;
      });
  }

  return all.map(({ userId: _userId, ...rest }) => {
    void _userId;
    return rest;
  });
}

export async function getAvailability(instructorId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("InstructorAvailability")
    .select("*")
    .eq("instructorId", instructorId)
    .order("dayOfWeek", { ascending: true });

  if (error) {
    logger.error("[getAvailability] Error:", error);
    return [];
  }

  return data || [];
}

export async function upsertAvailability(
  instructorId: string,
  slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error: deleteError } = await supabase
    .from("InstructorAvailability")
    .delete()
    .eq("instructorId", instructorId);

  if (deleteError) {
    logger.error("[upsertAvailability] Delete error:", deleteError);
    throw new Error("Kunne ikke slette eksisterende tilgjengelighet");
  }

  if (slots.length > 0) {
    const { error: insertError } = await supabase
      .from("InstructorAvailability")
      .insert(
        slots.map((slot) => ({
          id: nanoid(),
          instructorId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }))
      );

    if (insertError) {
      logger.error("[upsertAvailability] Insert error:", insertError);
      throw new Error("Kunne ikke lagre tilgjengelighet");
    }
  }

  revalidatePath("/admin/tilgjengelighet");
  updateTag("slots");
  updateTag(`availability:${instructorId}`);
}

export async function getBlockedTimes(instructorId?: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);

  let query = supabase
    .from("BlockedTime")
    .select("*")
    .gte("endTime", new Date().toISOString())
    .order("startTime", { ascending: true })
    .limit(100);

  if (instructorId) {
    query = query.eq("instructorId", instructorId);
  }

  const { data, error } = await query;

  if (error) {
    logger.error("[getBlockedTimes] Error:", error);
    return [];
  }

  return data || [];
}

export async function createBlockedTime(params: {
  instructorId: string | null;
  startTime: string;
  endTime: string;
  reason?: string;
}) {
  const { instructorId, startTime, endTime, reason } = params;
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from("BlockedTime")
    .insert({
      id: nanoid(),
      instructorId,
      startTime,
      endTime,
      reason: reason || null,
      source: "MANUAL",
    });

  if (error) {
    logger.error("[createBlockedTime] Error:", error);
    throw new Error("Kunne ikke blokkere tid");
  }

  revalidatePath("/admin/tilgjengelighet");
  updateTag("slots");
}

/**
 * Stenger en sammenhengende periode (ferier, kurs, lengre fravær).
 * Lager én BlockedTime-record per dag i intervallet — gjør at vanlig avbestilling
 * og slot-generering fungerer per-dag uten ekstra logikk.
 *
 * `startDate` og `endDate` er YYYY-MM-DD i Europe/Oslo. Begge inklusive.
 */
export async function createClosedPeriod(params: {
  instructorId: string;
  startDate: string;
  endDate: string;
  reason: string;
}): Promise<{ daysCreated: number }> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(params.startDate)) {
    throw new Error("Ugyldig startdato");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(params.endDate)) {
    throw new Error("Ugyldig sluttdato");
  }

  const start = new Date(`${params.startDate}T00:00:00`);
  const end = new Date(`${params.endDate}T23:59:59`);
  if (end < start) {
    throw new Error("Sluttdato må være etter startdato");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Lag én record per dag (00:00–23:59 lokal tid → ISO UTC)
  const records: Array<{
    id: string;
    instructorId: string;
    startTime: string;
    endTime: string;
    reason: string;
    source: string;
  }> = [];

  const cursor = new Date(start);
  while (cursor <= end) {
    const dayStart = new Date(cursor);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(cursor);
    dayEnd.setHours(23, 59, 59, 999);

    records.push({
      id: nanoid(),
      instructorId: params.instructorId,
      startTime: dayStart.toISOString(),
      endTime: dayEnd.toISOString(),
      reason: params.reason,
      source: "MANUAL",
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  const { error } = await supabase.from("BlockedTime").insert(records);
  if (error) {
    logger.error("[createClosedPeriod] Insert error:", error);
    throw new Error("Kunne ikke opprette stengt periode");
  }

  revalidatePath("/admin/tilgjengelighet");
  updateTag("slots");
  return { daysCreated: records.length };
}

export async function deleteBlockedTime(id: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from("BlockedTime")
    .delete()
    .eq("id", id);

  if (error) {
    logger.error("[deleteBlockedTime] Error:", error);
    throw new Error("Kunne ikke slette blokkert tid");
  }

  revalidatePath("/admin/tilgjengelighet");
  updateTag("slots");
}

export async function syncGoogleCalendar(instructorId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  try {
    const result = await syncGoogleCalendarEngine(instructorId);
    return {
      success: result.errors === 0,
      count: result.synced,
      error: result.errors > 0 ? result.message : undefined,
    };
  } catch (error) {
    logger.error("[syncGoogleCalendar] Error:", error);
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
