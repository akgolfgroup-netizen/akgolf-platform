import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { stripe } from "@/lib/portal/stripe";
import { sendBookingConfirmation } from "@/lib/portal/email/send-booking-email";
import { sendBookingConfirmationSms } from "@/lib/portal/sms/send-booking-sms";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  // Rate limiting to prevent abuse
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`confirm-payment:${clientIp}`, RATE_LIMITS.BOOKING_CREATE);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: { bookingId?: string; paymentIntentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { bookingId, paymentIntentId } = body;
  if (!bookingId || !paymentIntentId) {
    return NextResponse.json(
      { error: "Mangler bookingId eller paymentIntentId" },
      { status: 400 }
    );
  }

  try {
    // Verifiser betaling med Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Betalingen er ikke fullført", status: paymentIntent.status },
        { status: 400 }
      );
    }

    // Sjekk at bookingId matcher metadata
    if (paymentIntent.metadata.bookingId !== bookingId) {
      return NextResponse.json(
        { error: "Booking-ID stemmer ikke med betalingen" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();

    // Idempotens-guard: sjekk om allerede prosessert (av webhook eller tidligere kall)
    const { data: existingBooking, error: fetchError } = await supabase
      .from("Booking")
      .select(`
        id,
        amount,
        vatAmount,
        paymentMethod,
        startTime,
        ServiceType:serviceTypeId (name, duration, vatRate),
        Instructor:instructorId (User:userId (name, email, phone)),
        User:studentId (name, email)
      `)
      .eq("id", bookingId)
      .neq("paymentStatus", "PAID")
      .single();

    if (fetchError || !existingBooking) {
      // Allerede bekreftet av webhook — returner suksess uten å gjøre noe
      return NextResponse.json({ success: true, status: "CONFIRMED" });
    }

    // Beregn VAT rate
    const serviceTypeArray = existingBooking.ServiceType as unknown as Array<{ vatRate?: number; name: string; duration: number }>;
    const serviceType = serviceTypeArray?.[0] ?? null;
    const vatRate = serviceType?.vatRate ?? 25;
    const netAmount = existingBooking.amount - existingBooking.vatAmount;

    // Atomisk oppdatering: booking + PaymentTransaction via RPC eller to separate kall
    const { error: updateError } = await supabase
      .from("Booking")
      .update({
        status: "CONFIRMED",
        paymentStatus: "PAID",
        stripePaymentId: paymentIntentId,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (updateError) {
      throw updateError;
    }

    const { error: transactionError } = await supabase
      .from("PaymentTransaction")
      .insert({
        id: nanoid(),
        bookingId,
        paymentMethod: existingBooking.paymentMethod ?? "STRIPE",
        grossAmount: existingBooking.amount,
        vatAmount: existingBooking.vatAmount,
        vatRate,
        netAmount,
        providerRef: paymentIntentId,
        status: "PAID",
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    if (transactionError) {
      throw transactionError;
    }

    // Type assertions for nested data
    const instructorArray = existingBooking.Instructor as unknown as Array<{ 
      User?: Array<{ name?: string; email?: string; phone?: string }>
    }>;
    const instructor = instructorArray?.[0] ?? null;
    const instructorUser = instructor?.User?.[0] ?? null;
    const userArray = existingBooking.User as unknown as Array<{ name?: string; email?: string }>;
    const user = userArray?.[0] ?? null;
    const service = serviceType;

    // Send bekreftelses-e-post (non-blocking)
    if (user?.email && instructorUser?.email) {
      sendBookingConfirmation({
        bookingId,
        studentName: user.name ?? "Kunde",
        studentEmail: user.email,
        instructorName: instructorUser.name ?? "Instruktør",
        instructorEmail: instructorUser.email,
        serviceName: service?.name ?? "Coaching",
        startTime: existingBooking.startTime,
        duration: service?.duration ?? 60,
        amount: existingBooking.amount,
        vatAmount: existingBooking.vatAmount,
        location: "Gamle Fredrikstad Golfklubb",
      }).catch((err: unknown) =>
        logger.error("[confirm-payment] Email failed:", err)
      );
    }

    // Send SMS til instruktør (non-blocking)
    if (instructorUser?.phone) {
      sendBookingConfirmationSms({
        instructorPhone: instructorUser.phone,
        instructorName: instructorUser.name ?? "Instruktør",
        studentName: user?.name ?? "Kunde",
        serviceName: service?.name ?? "Coaching",
        startTime: existingBooking.startTime,
        duration: service?.duration ?? 60,
      }).catch((err: unknown) =>
        logger.error("[confirm-payment] SMS failed:", err)
      );
    }

    return NextResponse.json({ success: true, status: "CONFIRMED" });
  } catch (error) {
    logger.error("[confirm-payment] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
