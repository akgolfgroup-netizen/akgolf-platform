import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { getResend, FROM_EMAIL } from "./resend";
import { BookingConfirmedEmail } from "./templates/booking-confirmed";
import { InstructorNewBookingEmail } from "./templates/instructor-new-booking";

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

function formatNOK(amountOre: number): string {
  return `kr ${(amountOre / 100).toLocaleString("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const resend = getResend();
  if (!resend) {
    console.log(
      `[Email] Resend not configured — skipping confirmation for booking ${data.bookingId}`
    );
    return;
  }

  const dateStr = format(data.startTime, "EEEE d. MMMM yyyy", { locale: nb });
  const timeStr = format(data.startTime, "HH:mm");

  // Send to student
  try {
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
    console.log(
      `[Email] Confirmation sent to ${data.studentEmail} for booking ${data.bookingId}`
    );
  } catch (error) {
    console.error(
      `[Email] Failed to send confirmation to ${data.studentEmail}:`,
      error
    );
  }

  // Send to instructor
  try {
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
    console.log(
      `[Email] Instructor notification sent to ${data.instructorEmail} for booking ${data.bookingId}`
    );
  } catch (error) {
    console.error(
      `[Email] Failed to send instructor notification to ${data.instructorEmail}:`,
      error
    );
  }
}
