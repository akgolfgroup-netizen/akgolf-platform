"use server";

import { createClient } from "@supabase/supabase-js";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath, revalidateTag } from "next/cache";
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface Instructor {
  id: string;
  name: string;
  email: string;
}

export async function getInstructors(): Promise<Instructor[]> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: instructors, error } = await supabase
    .from("Instructor")
    .select(`
      id,
      User(name, email)
    `)
    .order("name", { foreignTable: "User", ascending: true });

  if (error) {
    logger.error("[getInstructors] Error:", error);
    return [];
  }

  return instructors?.map((i) => ({
    id: i.id,
    name: i.User?.[0]?.name || "Ukjent",
    email: i.User?.[0]?.email || "",
  })) || [];
}

export async function getAvailability(instructorId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from("AvailabilityWindow")
    .select("*")
    .eq("instructorId", instructorId)
    .eq("isActive", true)
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

  // Slett eksisterende tilgjengelighet
  const { error: deleteError } = await supabase
    .from("AvailabilityWindow")
    .delete()
    .eq("instructorId", instructorId);

  if (deleteError) {
    logger.error("[upsertAvailability] Delete error:", deleteError);
    throw new Error("Kunne ikke slette eksisterende tilgjengelighet");
  }

  // Sett inn nye slots
  if (slots.length > 0) {
    const { error: insertError } = await supabase
      .from("AvailabilityWindow")
      .insert(
        slots.map((slot) => ({
          id: nanoid(),
          instructorId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: true,
        }))
      );

    if (insertError) {
      logger.error("[upsertAvailability] Insert error:", insertError);
      throw new Error("Kunne ikke lagre tilgjengelighet");
    }
  }

  // Revalidate cache
  revalidatePath("/portal/admin/tilgjengelighet");
  revalidateTag("slots", {});
  revalidateTag(`availability:${instructorId}`, {});
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
    .limit(50);

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

  revalidatePath("/portal/admin/tilgjengelighet");
  revalidateTag("slots", {});
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

  revalidatePath("/portal/admin/tilgjengelighet");
  revalidateTag("slots", {});
}

export async function syncGoogleCalendar(instructorId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  // TODO: Implementer Google Calendar sync med Supabase
  logger.info("[syncGoogleCalendar] Not implemented yet");
  return { success: false, message: "Google Calendar sync ikke implementert ennå", count: 0, error: "Ikke implementert ennå" };
}
