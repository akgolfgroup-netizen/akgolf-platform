import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { logger } from "@/lib/logger";
import { getResend, FROM_EMAIL } from "./resend";
import { MonthlyResetNotificationEmail } from "./templates/monthly-reset-notification";

interface MonthlyResetEmailData {
  studentName: string;
  studentEmail: string;
  packageName: string;
  sessionsUsed: number;
  sessionsTotal: number;
  unusedSessions: number;
  newPeriodStart: Date;
  newPeriodEnd: Date;
}

export async function sendMonthlyResetEmail(data: MonthlyResetEmailData) {
  const resend = getResend();
  if (!resend) {
    logger.info(`[Email] Resend ikke konfigurert — hopper over månedlig reset-varsel for ${data.studentEmail}`);
    return;
  }

  if (!data.studentEmail) {
    logger.warn(`[Email] Mangler e-post for elev "${data.studentName}" — hopper over reset-varsel`);
    return;
  }

  const periodStart = format(data.newPeriodStart, "d. MMMM", { locale: nb });
  const periodEnd = format(data.newPeriodEnd, "d. MMMM yyyy", { locale: nb });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.studentEmail,
      subject: `Ny treningsperiode — ${data.packageName}`,
      react: MonthlyResetNotificationEmail({
        studentName: data.studentName,
        packageName: data.packageName,
        sessionsUsed: data.sessionsUsed,
        sessionsTotal: data.sessionsTotal,
        unusedSessions: data.unusedSessions,
        newPeriodStart: periodStart,
        newPeriodEnd: periodEnd,
      }),
    });
    logger.info(`[Email] Månedlig reset-varsel sendt til ${data.studentEmail}`);
  } catch (error) {
    logger.error(`[Email] Feil ved sending av reset-varsel til ${data.studentEmail}`, error);
    throw error;
  }
}
