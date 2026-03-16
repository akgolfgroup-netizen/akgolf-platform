import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { getTwilioClient } from "./twilio";

interface ReminderSmsData {
  phone: string;
  studentName: string;
  serviceName: string;
  startTime: Date;
  instructorName: string;
}

export async function sendReminderSms(data: ReminderSmsData): Promise<boolean> {
  const client = getTwilioClient();
  if (!client) {
    console.log("[SMS] Twilio not configured — skipping reminder");
    return false;
  }

  // Normalize Norwegian phone number
  let phone = data.phone.replace(/\s/g, "");
  if (phone.startsWith("4") && phone.length === 8) {
    phone = `+47${phone}`;
  } else if (!phone.startsWith("+")) {
    phone = `+47${phone}`;
  }

  const timeStr = format(data.startTime, "HH:mm");
  const dateStr = format(data.startTime, "d. MMM", { locale: nb });

  const message =
    `Hei ${data.studentName}! Påminnelse: ${data.serviceName} med ${data.instructorName} i dag kl. ${timeStr}. ` +
    `Velkommen til AK Golf!`;

  const result = await client.sendSms(phone, message);
  if (result.success) {
    console.log(`[SMS] Reminder sent to ${phone}`);
  }
  return result.success;
}
