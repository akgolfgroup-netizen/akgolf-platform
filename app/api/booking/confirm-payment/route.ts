import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { stripe } from "@/lib/portal/stripe";
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
        ServiceType:serviceTypeId (vatRate)
      `)
      .eq("id", bookingId)
      .neq("paymentStatus", "PAID")
      .single();

    if (fetchError || !existingBooking) {
      // Allerede bekreftet av webhook — returner suksess uten å gjøre noe
      return NextResponse.json({ success: true, status: "CONFIRMED" });
    }

    // Beregn VAT rate
    const serviceTypeArray = existingBooking.ServiceType as unknown as Array<{ vatRate?: number }>;
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

    // E-post og SMS sendes av Stripe webhook (payment_intent.succeeded)
    // for å unngå duplikater. Denne ruten oppdaterer kun status.

    return NextResponse.json({ success: true, status: "CONFIRMED" });
  } catch (error) {
    logger.error("[confirm-payment] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
