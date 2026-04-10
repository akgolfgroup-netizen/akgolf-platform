import { NextRequest, NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/portal/stripe";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface BookingRow {
  id: string;
  amount: number;
  vatAmount: number | null;
  serviceTypeId: string;
  User: { id: string; stripeCustomerId: string | null; email: string; name: string | null }[];
  ServiceType: { name: string; duration: number; vatRate: number }[];
}

/**
 * Cron: Trekker lagret kort for gjennomførte coaching-timer.
 * Kjøres hver time. Finner CONFIRMED bookinger der:
 * - endTime har passert (timen er over)
 * - paymentStatus er PENDING
 * - paymentMethod er STRIPE
 * - Bruker har et lagret Stripe-betalingskort
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: bookings, error } = await supabase
    .from("Booking")
    .select(
      `
      id, amount, vatAmount, serviceTypeId,
      User:studentId (id, stripeCustomerId, email, name),
      ServiceType:serviceTypeId (name, duration, vatRate)
    `
    )
    .eq("status", "CONFIRMED")
    .eq("paymentStatus", "PENDING")
    .eq("paymentMethod", "STRIPE")
    .lt("endTime", now)
    .limit(50);

  if (error) {
    logger.error("[charge-completed] Feil ved henting av bookinger:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!bookings?.length) {
    logger.info("[charge-completed] Ingen bookinger å behandle");
    return NextResponse.json({ charged: 0, errors: 0, total: 0 });
  }

  let charged = 0;
  let errors = 0;

  for (const raw of bookings) {
    const booking = raw as unknown as BookingRow;

    try {
      const user = booking.User?.[0];
      if (!user?.stripeCustomerId) {
        logger.warn(
          `[charge-completed] Ingen Stripe-kunde for booking ${booking.id}`
        );
        errors++;
        continue;
      }

      // Hent lagret betalingskort
      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: "card",
        limit: 1,
      });

      if (!paymentMethods.data.length) {
        logger.warn(
          `[charge-completed] Ingen lagret kort for bruker ${user.id}, booking ${booking.id}`
        );
        errors++;
        continue;
      }

      const service = booking.ServiceType?.[0];
      const amountInOere = booking.amount * 100; // kroner til øre

      // Opprett PaymentIntent og trekk off-session
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInOere,
        currency: "nok",
        customer: user.stripeCustomerId,
        payment_method: paymentMethods.data[0].id,
        off_session: true,
        confirm: true,
        description: `Coaching: ${service?.name ?? "Session"} — ${user.name ?? user.email}`,
        metadata: {
          bookingId: booking.id,
          userId: user.id,
        },
      });

      if (paymentIntent.status === "succeeded") {
        // Oppdater booking
        const { error: updateError } = await supabase
          .from("Booking")
          .update({
            paymentStatus: "PAID",
            stripePaymentId: paymentIntent.id,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", booking.id);

        if (updateError) {
          logger.error(
            `[charge-completed] Feil ved oppdatering av booking ${booking.id}:`,
            updateError
          );
          errors++;
          continue;
        }

        // Opprett betalingstransaksjon
        const vatRate = service?.vatRate ?? 25;
        const vatAmount = booking.vatAmount ?? 0;

        const { error: txError } = await supabase
          .from("PaymentTransaction")
          .insert({
            id: nanoid(),
            bookingId: booking.id,
            paymentMethod: "STRIPE",
            grossAmount: booking.amount,
            vatAmount,
            vatRate,
            netAmount: booking.amount - vatAmount,
            providerRef: paymentIntent.id,
            status: "PAID",
            paidAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

        if (txError) {
          logger.error(
            `[charge-completed] Feil ved opprettelse av transaksjon for booking ${booking.id}:`,
            txError
          );
          // Booking er allerede markert PAID — logg men ikke trekk fra charged
        }

        charged++;
        logger.info(
          `[charge-completed] Trukket ${booking.amount} kr for booking ${booking.id}`
        );
      } else {
        logger.warn(
          `[charge-completed] Betaling ikke gjennomført for booking ${booking.id}: ${paymentIntent.status}`
        );
        errors++;
      }
    } catch (err) {
      logger.error(
        `[charge-completed] Feil ved trekk for booking ${booking.id}:`,
        err
      );

      // Marker som FAILED slik at vi ikke prøver på nytt i det uendelige
      await supabase
        .from("Booking")
        .update({
          paymentStatus: "FAILED",
          updatedAt: new Date().toISOString(),
        })
        .eq("id", booking.id);

      errors++;
    }
  }

  logger.info(
    `[charge-completed] Ferdig: ${charged} trukket, ${errors} feil av ${bookings.length} totalt`
  );

  return NextResponse.json({
    charged,
    errors,
    total: bookings.length,
  });
}
