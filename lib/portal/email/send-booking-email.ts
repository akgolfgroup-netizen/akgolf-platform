import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { logger } from "@/lib/logger";
import { getResend, FROM_EMAIL } from "./resend";
import { BookingConfirmedEmail } from "./templates/booking-confirmed";
import { InstructorNewBookingEmail } from "./templates/instructor-new-booking";
import { BookingCancelledEmail } from "./templates/booking-cancelled";
import { createServerSupabase } from "@/lib/supabase/server";

interface BookingEmailData {
  bookingId: string;
  studentName: string;
  studentEmail: string;
  instructorName: string;
  instructorEmail: string;
  serviceName: string;
  startTime: Date;
  duration: number;
  amount: number; // øre
  vatAmount: number; // øre
  location: string;
}

function formatNOK(amount: number): string {
  // Prisene er lagret i kroner
  return `kr ${amount.toLocaleString("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Hent en lagret e-postmal fra databasen.
 * Returnerer null hvis malen ikke finnes.
 */
async function getEmailTemplate(
  templateName: string
): Promise<{ subject: string; htmlContent: string } | null> {
  try {
    const supabase = await createServerSupabase();
    const { data: template } = await supabase
      .from("EmailTemplate")
      .select("subject, htmlContent")
      .eq("name", templateName)
      .single();

    return template ?? null;
  } catch {
    return null;
  }
}

/**
 * Erstatt variabler i en template-streng.
 * Variabler er på formen {{variabelnavn}}.
 */
function interpolateTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const resend = getResend();
  if (!resend) {
    logger.info(`[Email] Resend not configured — skipping confirmation for booking ${data.bookingId}`);
    return;
  }

  const dateStr = format(data.startTime, "EEEE d. MMMM yyyy", { locale: nb });
  const timeStr = format(data.startTime, "HH:mm");

  const templateVars: Record<string, string> = {
    studentName: data.studentName,
    serviceName: data.serviceName,
    instructorName: data.instructorName,
    date: dateStr,
    time: timeStr,
    duration: String(data.duration),
    price: formatNOK(data.amount),
    vatAmount: formatNOK(data.vatAmount),
    location: data.location,
    studentEmail: data.studentEmail,
  };

  // Send til student — prøv lagret mal, deretter fallback til React Email
  try {
    const savedTemplate = await getEmailTemplate("booking-bekreftet");

    if (savedTemplate) {
      const subject = interpolateTemplate(savedTemplate.subject, templateVars);
      const html = interpolateTemplate(savedTemplate.htmlContent, templateVars);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.studentEmail,
        subject,
        html,
      });
    } else {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.studentEmail,
        subject: `Bookingbekreftelse — ${data.serviceName}`,
        react: BookingConfirmedEmail({
          studentName: data.studentName,
          serviceName: data.serviceName,
          instructorName: data.instructorName,
          date: dateStr,
          time: timeStr,
          duration: data.duration,
          price: formatNOK(data.amount),
          vatAmount: formatNOK(data.vatAmount),
          location: data.location,
        }),
      });
    }
    logger.info(`[Email] Confirmation sent for booking ${data.bookingId}`);
  } catch (error) {
    logger.error(`[Email] Failed to send confirmation for booking ${data.bookingId}`, error);
  }

  // Send til instruktør — prøv lagret mal, deretter fallback til React Email
  try {
    const instructorTemplate = await getEmailTemplate("booking-instruktor");

    if (instructorTemplate) {
      const subject = interpolateTemplate(instructorTemplate.subject, templateVars);
      const html = interpolateTemplate(instructorTemplate.htmlContent, templateVars);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.instructorEmail,
        subject,
        html,
      });
    } else {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.instructorEmail,
        subject: `Ny booking: ${data.studentName} — ${data.serviceName}`,
        react: InstructorNewBookingEmail({
          instructorName: data.instructorName,
          studentName: data.studentName,
          studentEmail: data.studentEmail,
          serviceName: data.serviceName,
          date: dateStr,
          time: timeStr,
          duration: data.duration,
        }),
      });
    }
    logger.info(`[Email] Instructor notification sent for booking ${data.bookingId}`);
  } catch (error) {
    logger.error(`[Email] Failed to send instructor notification for booking ${data.bookingId}`, error);
  }
}

export async function sendBookingCancellation(
  studentEmail: string,
  studentName: string,
  serviceName: string,
  instructorName: string,
  startTime: Date,
  cancelReason: string,
  refundPercent: number,
) {
  const resend = getResend();
  if (!resend) {
    logger.info("[Email] Resend not configured — skipping cancellation email");
    return;
  }

  const dateStr = format(startTime, "EEEE d. MMMM yyyy", { locale: nb });
  const timeStr = format(startTime, "HH:mm");

  const refundInfo =
    refundPercent >= 100
      ? "Full refusjon"
      : refundPercent > 0
        ? `${refundPercent}% refusjon`
        : "Ingen refusjon";

  const templateVars: Record<string, string> = {
    studentName,
    serviceName,
    instructorName,
    date: dateStr,
    time: timeStr,
    refundInfo,
    cancelReason,
  };

  try {
    const savedTemplate = await getEmailTemplate("booking-avbestilt");

    if (savedTemplate) {
      const subject = interpolateTemplate(savedTemplate.subject, templateVars);
      const html = interpolateTemplate(savedTemplate.htmlContent, templateVars);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: studentEmail,
        subject,
        html,
      });
    } else {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: studentEmail,
        subject: `Avbestillingsbekreftelse — ${serviceName}`,
        react: BookingCancelledEmail({
          studentName,
          serviceName,
          instructorName,
          date: dateStr,
          time: timeStr,
          refundInfo,
          policyReason: cancelReason,
        }),
      });
    }
    logger.info(`[Email] Cancellation sent to ${studentEmail}`);
  } catch (error) {
    logger.error(`[Email] Failed to send cancellation to ${studentEmail}`, error);
  }
}

export async function sendRescheduleNotification(
  studentEmail: string,
  studentName: string,
  serviceName: string,
  oldTime: Date,
  newTime: Date,
) {
  const resend = getResend();
  if (!resend) {
    logger.info("[Email] Resend not configured — skipping reschedule email");
    return;
  }

  const oldDateStr = format(oldTime, "EEEE d. MMMM yyyy 'kl.' HH:mm", { locale: nb });
  const newDateStr = format(newTime, "EEEE d. MMMM yyyy 'kl.' HH:mm", { locale: nb });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: studentEmail,
      subject: `Booking endret — ${serviceName}`,
      html: `
        <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #0A1F18; font-size: 24px; font-weight: 700; margin: 0 0 24px;">Booking endret</h2>
          <p style="color: #333; font-size: 16px; margin: 0 0 8px;">Hei ${studentName},</p>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            Din booking for <strong>${serviceName}</strong> er endret:
          </p>
          <div style="background: #f9fafb; border-radius: 6px; padding: 16px; margin: 0 0 16px;">
            <p style="color: #333; font-size: 14px; margin: 0 0 6px;">
              <strong>Fra:</strong> ${oldDateStr}
            </p>
            <p style="color: #333; font-size: 14px; margin: 0 0 6px;">
              <strong>Til:</strong> ${newDateStr}
            </p>
          </div>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            Har du sporsmal? Kontakt oss pa <a href="mailto:post@akgolf.no" style="color: #0A1F18; text-decoration: underline;">post@akgolf.no</a>.
          </p>
          <p style="color: #999; font-size: 12px; margin: 24px 0 0;">AK Golf Academy — Gamle Fredrikstad Golfklubb</p>
        </div>
      `,
    });
    logger.info(`[Email] Reschedule notification sent to ${studentEmail}`);
  } catch (error) {
    logger.error(`[Email] Failed to send reschedule notification to ${studentEmail}`, error);
  }
}
