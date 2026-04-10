import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { stripe } from "@/lib/portal/stripe";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";

/**
 * POST /api/booking/confirm-payment
 *
 * Read-only status check called by the confirmation page after Stripe Checkout.
 * The actual booking confirmation + PaymentTransaction creation is handled by
 * the Stripe webhook (payment_intent.succeeded + checkout.session.completed).
 *
 * This endpoint:
 * 1. Verifies the PaymentIntent status with Stripe
 * 2. Returns the current booking status
 * 3. Does NOT write to the database (webhook handles that)
 */
export async function POST(req: NextRequest) {
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
  if (!bookingId) {
    return NextResponse.json(
      { error: "Mangler bookingId" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createServerSupabase();

    // Hent booking-status fra database
    const { data: booking, error: fetchError } = await supabase
      .from("Booking")
      .select("id, status, paymentStatus, stripePaymentId")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking ikke funnet" }, { status: 404 });
    }

    // Allerede bekreftet av webhook
    if (booking.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, status: "CONFIRMED" });
    }

    // Hvis paymentIntentId er gitt, verifiser med Stripe
    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        // Betaling vellykket i Stripe — webhook vil snart bekrefte i DB.
        // Returner "processing" slik at klienten kan polle.
        return NextResponse.json({
          success: true,
          status: "PROCESSING",
          message: "Betalingen er mottatt. Bookingen bekreftes snart.",
        });
      }

      if (paymentIntent.status === "requires_payment_method" || paymentIntent.status === "canceled") {
        return NextResponse.json({
          success: false,
          status: "FAILED",
          message: "Betalingen feilet. Prøv igjen.",
        });
      }

      return NextResponse.json({
        success: false,
        status: paymentIntent.status.toUpperCase(),
        message: "Betalingen behandles. Vent litt.",
      });
    }

    // Ingen paymentIntentId — returner nåværende status
    return NextResponse.json({
      success: booking.paymentStatus === "PAID",
      status: booking.status,
    });
  } catch (error) {
    logger.error("[confirm-payment] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
