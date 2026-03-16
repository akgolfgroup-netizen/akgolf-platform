import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { getResend, FROM_EMAIL } from "./resend";
import { WelcomeNewUserEmail } from "./templates/welcome-new-user";

interface WelcomeEmailData {
  name: string;
  email: string;
  tempPassword: string;
  serviceName: string;
  instructorName: string;
  startTime: Date;
  duration: number;
  amount: number; // øre
  location: string;
}

function formatNOK(amountOre: number): string {
  return `kr ${(amountOre / 100).toLocaleString("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const resend = getResend();
  if (!resend) {
    console.log(
      `[Email] Resend not configured — skipping welcome email for ${data.email}`
    );
    return;
  }

  const dateStr = format(data.startTime, "EEEE d. MMMM yyyy", { locale: nb });
  const timeStr = format(data.startTime, "HH:mm");

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: "Velkommen til AK Golf — din konto er opprettet",
      react: WelcomeNewUserEmail({
        name: data.name,
        email: data.email,
        tempPassword: data.tempPassword,
        serviceName: data.serviceName,
        instructorName: data.instructorName,
        date: dateStr,
        time: timeStr,
        duration: data.duration,
        price: formatNOK(data.amount),
        location: data.location,
      }),
    });
    console.log(`[Email] Welcome email sent to ${data.email}`);
  } catch (error) {
    console.error(
      `[Email] Failed to send welcome email to ${data.email}:`,
      error
    );
  }
}
