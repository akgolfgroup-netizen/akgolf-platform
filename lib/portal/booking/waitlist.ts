import { randomUUID } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { WaitlistStatus } from "@prisma/client";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { WaitlistAvailableEmail } from "@/lib/portal/email/templates/waitlist-available";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { logger } from "@/lib/logger";

/**
 * Check waitlist entries when a booking is cancelled.
 * Notifies the next person on the waitlist that a slot is available.
 */
export async function notifyNextOnWaitlist(
  bookingId: string,
  serviceName: string,
  instructorName: string,
  startTime: Date
) {
  const supabase = createServiceClient();
  
  // Find the next WAITING entry for this booking
  const { data: nextEntry, error } = await supabase
    .from("WaitlistEntry")
    .select(`
      id,
      position,
      User:userId (name, email)
    `)
    .eq("bookingId", bookingId)
    .eq("status", WaitlistStatus.WAITING)
    .order("position", { ascending: true })
    .limit(1)
    .single();

  if (error || !nextEntry) return;
  
  // Type assertion for joined data
  const userArr = nextEntry.User as unknown as Array<{ name: string | null; email: string | null }>;
  const userData = userArr?.[0] ?? null;
  if (!userData?.email) return;

  // Mark as notified with 24h expiry
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const { error: updateError } = await supabase
    .from("WaitlistEntry")
    .update({
      status: WaitlistStatus.NOTIFIED,
      notifiedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    })
    .eq("id", nextEntry.id);

  if (updateError) {
    logger.error(`[Waitlist] Failed to update waitlist entry:`, updateError);
    return;
  }

  // Send notification email
  const resend = getResend();
  if (!resend) return;

  const dateStr = format(startTime, "EEEE d. MMMM yyyy", { locale: nb });
  const timeStr = format(startTime, "HH:mm");

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userData.email,
      subject: `Plass ledig! ${serviceName} — ${dateStr}`,
      react: WaitlistAvailableEmail({
        studentName: userData.name ?? "Hei",
        serviceName,
        instructorName,
        date: dateStr,
        time: timeStr,
        expiresAt: format(expiresAt, "EEEE d. MMMM HH:mm", { locale: nb }),
      }),
    });
    logger.info(`[Waitlist] Notified ${userData.email} for booking ${bookingId}`);
  } catch (error) {
    logger.error("[Waitlist] Failed to send notification:", error);
  }
}

/**
 * Add a student to the waitlist for a specific booking slot.
 */
export async function addToWaitlist(
  bookingId: string,
  studentId: string
): Promise<{ success: boolean; position: number }> {
  const supabase = createServiceClient();
  
  // Check for existing entry
  const { data: existing, error: existingError } = await supabase
    .from("WaitlistEntry")
    .select("position")
    .eq("bookingId", bookingId)
    .eq("studentId", studentId)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    logger.error(`[Waitlist] Error checking existing entry:`, existingError);
  }

  if (existing) {
    return { success: false, position: existing.position };
  }

  // Get current max position
  const { data: maxEntry, error: maxError } = await supabase
    .from("WaitlistEntry")
    .select("position")
    .eq("bookingId", bookingId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  if (maxError && maxError.code !== "PGRST116") {
    logger.error(`[Waitlist] Error fetching max position:`, maxError);
  }

  const position = (maxEntry?.position ?? 0) + 1;

  const { error: insertError } = await supabase
    .from("WaitlistEntry")
    .insert({
      id: randomUUID(),
      bookingId,
      studentId,
      position,
      status: WaitlistStatus.WAITING,
      updatedAt: new Date().toISOString(),
    });

  if (insertError) {
    logger.error(`[Waitlist] Failed to add to waitlist:`, insertError);
    return { success: false, position };
  }

  return { success: true, position };
}
