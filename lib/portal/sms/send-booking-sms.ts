import { getTwilioClient } from "./twilio";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { logger } from "@/lib/logger";

interface BookingSmsParams {
  instructorPhone: string;
  instructorName: string;
  studentName: string;
  serviceName: string;
  startTime: Date;
  duration: number;
}

/**
 * Send SMS to instructor when a booking is confirmed.
 * Fails silently if Twilio is not configured or phone is missing.
 */
export async function sendBookingConfirmationSms(
  params: BookingSmsParams
): Promise<{ sent: boolean; error?: string }> {
  const { instructorPhone, instructorName, studentName, serviceName, startTime, duration } = params;

  if (!instructorPhone) {
    return { sent: false, error: "Instruktør mangler telefonnummer" };
  }

  const client = getTwilioClient();
  if (!client) {
    logger.warn("[SMS] Twilio not configured, skipping SMS");
    return { sent: false, error: "Twilio ikke konfigurert" };
  }

  // Format Norwegian phone number
  const formattedPhone = instructorPhone.startsWith("+")
    ? instructorPhone
    : `+47${instructorPhone.replace(/\s/g, "")}`;

  const dateStr = format(startTime, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb });

  const message = `Ny booking! ${studentName} har booket ${serviceName} (${duration} min) ${dateStr}. Hilsen AK Golf`;

  try {
    const result = await client.sendSms(formattedPhone, message);
    if (result.success) {
      logger.info(`[SMS] Sent to ${instructorName}: ${result.sid}`);
      return { sent: true };
    } else {
      return { sent: false, error: "SMS sending failed" };
    }
  } catch (error) {
    logger.error("[SMS] Error:", error);
    return { sent: false, error: String(error) };
  }
}

/**
 * Send SMS til kunde med Stripe Payment Link for manuell booking (Fase E).
 * Brukes når en coach lager booking på en ny kunde uten lagret kort.
 */
export async function sendPaymentLinkSms(params: {
  customerPhone: string;
  customerName: string;
  serviceName: string;
  startTime: Date;
  paymentUrl: string;
}): Promise<{ sent: boolean }> {
  const { customerPhone, customerName, serviceName, startTime, paymentUrl } = params;
  if (!customerPhone) return { sent: false };

  const client = getTwilioClient();
  if (!client) {
    logger.warn("[SMS] Twilio not configured, skipping payment-link SMS");
    return { sent: false };
  }

  const formattedPhone = customerPhone.startsWith("+")
    ? customerPhone
    : `+47${customerPhone.replace(/\s/g, "")}`;

  const dateStr = format(startTime, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb });
  const message = `Hei ${customerName}! Vi har reservert ${serviceName} ${dateStr}. Bekreft betaling her: ${paymentUrl} — Hilsen AK Golf`;

  try {
    const result = await client.sendSms(formattedPhone, message);
    return { sent: result.success };
  } catch (error) {
    logger.error("[SMS] Payment-link SMS error:", error);
    return { sent: false };
  }
}

/**
 * Send SMS to instructor when a booking is cancelled.
 */
export async function sendBookingCancellationSms(params: {
  instructorPhone: string;
  studentName: string;
  startTime: Date;
}): Promise<{ sent: boolean }> {
  const { instructorPhone, studentName, startTime } = params;

  if (!instructorPhone) return { sent: false };

  const client = getTwilioClient();
  if (!client) return { sent: false };

  const formattedPhone = instructorPhone.startsWith("+")
    ? instructorPhone
    : `+47${instructorPhone.replace(/\s/g, "")}`;

  const dateStr = format(startTime, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb });
  const message = `Avbestilling: ${studentName} har avbestilt timen ${dateStr}. Hilsen AK Golf`;

  try {
    const result = await client.sendSms(formattedPhone, message);
    return { sent: result.success };
  } catch {
    return { sent: false };
  }
}
