import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/portal/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { sendBookingConfirmation } from "@/lib/portal/email/send-booking-email";
import { nanoid } from "nanoid";
import {
  createQuotaForNewSubscription,
  resetQuotaForNewPeriod,
  cancelSubscriptionQuota,
} from "@/lib/portal/booking/subscription-quota";
import { createNotification } from "@/lib/portal/notifications";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error(`[Stripe Webhook] Signature verification failed: ${message}`);
    // Return generic message — never expose SDK internals to the response
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Use service role client for webhooks (no auth context)
  const supabase = createServiceClient();

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const paymentIntentId = paymentIntent.id;

    const bookingSelect = `
        id,
        amount,
        vatAmount,
        startTime,
        ServiceType:serviceTypeId (name, duration, vatRate),
        User:studentId (name, email),
        Instructor:instructorId (User:userId (name, email)),
        Location:locationId (name)
      `;

    // Primary lookup: booking must already have stripePaymentId set
    let { data: booking } = await supabase
      .from("Booking")
      .select(bookingSelect)
      .eq("stripePaymentId", paymentIntentId)
      .neq("paymentStatus", "PAID")
      .single();

    // Fallback: look up by bookingId in payment intent metadata (checkout session flow)
    if (!booking) {
      const metadataBookingId = paymentIntent.metadata?.bookingId;
      if (metadataBookingId) {
        const { data: metaBooking } = await supabase
          .from("Booking")
          .select(bookingSelect)
          .eq("id", metadataBookingId)
          .neq("paymentStatus", "PAID")
          .single();

        if (metaBooking) {
          // Save stripePaymentId so future lookups (e.g. refunds) work
          await supabase
            .from("Booking")
            .update({ stripePaymentId: paymentIntentId, updatedAt: new Date().toISOString() })
            .eq("id", metaBooking.id);

          booking = metaBooking;
          logger.info(`[Stripe Webhook] Resolved booking ${metaBooking.id} via PI metadata fallback`);
        }
      }
    }

    if (!booking) {
      logger.info(`[Stripe Webhook] Already processed or not found: ${paymentIntentId}`);
    } else {
      const serviceTypeArray = booking.ServiceType as unknown as Array<{ vatRate?: number; name?: string; duration?: number }>;
      const serviceType = serviceTypeArray?.[0] ?? null;
      const vatRate = serviceType?.vatRate ?? 25;
      const netAmount = booking.amount - booking.vatAmount;

      // Update booking status
      const { error: updateError } = await supabase
        .from("Booking")
        .update({
          status: "CONFIRMED",
          paymentStatus: "PAID",
          updatedAt: new Date().toISOString(),
        })
        .eq("id", booking.id);

      if (updateError) {
        logger.error("[Stripe Webhook] Failed to update booking:", updateError);
      } else {
        // Create payment transaction
        await supabase
          .from("PaymentTransaction")
          .insert({
            id: nanoid(),
            bookingId: booking.id,
            paymentMethod: "STRIPE",
            grossAmount: booking.amount,
            vatAmount: booking.vatAmount,
            vatRate,
            feeAmount: 0,
            netAmount,
            providerRef: paymentIntentId,
            status: "PAID",
            paidAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        
        logger.info(`[Stripe Webhook] Booking ${booking.id} confirmed`);
      }

      // Type assertions for nested data
      const userArray = booking.User as unknown as Array<{ name?: string; email?: string }>;
      const user = userArray?.[0] ?? null;
      const instructorArray = booking.Instructor as unknown as Array<{ 
        User?: Array<{ name?: string; email?: string }> 
      }>;
      const instructor = instructorArray?.[0] ?? null;
      const locationArray = booking.Location as unknown as Array<{ name?: string }>;
      const location = locationArray?.[0] ?? null;

      // Send confirmation emails (non-blocking — don't fail the webhook)
      sendBookingConfirmation({
        bookingId: booking.id,
        studentName: user?.name ?? "Golfer",
        studentEmail: user?.email ?? "",
        instructorName: instructor?.User?.[0]?.name ?? "Trener",
        instructorEmail: instructor?.User?.[0]?.email ?? "",
        serviceName: serviceType?.name ?? "Coaching",
        startTime: booking.startTime,
        duration: serviceType?.duration ?? 60,
        amount: booking.amount,
        vatAmount: booking.vatAmount,
        location: location?.name ?? "Gamle Fredrikstad Golfklubb",
      }).catch((err) => logger.error("[Stripe Webhook] Email send failed", err));
    }
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    await supabase
      .from("Booking")
      .update({
        paymentStatus: "FAILED",
        updatedAt: new Date().toISOString(),
      })
      .eq("stripePaymentId", paymentIntent.id)
      .eq("paymentStatus", "PENDING");
    
    logger.info(`[Stripe Webhook] Payment failed for PaymentIntent: ${paymentIntent.id}`);
  }

  // ─── Refund Events ───
  else if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = charge.payment_intent as string;

    if (paymentIntentId) {
      const { data: booking } = await supabase
        .from("Booking")
        .select("id, amount")
        .eq("stripePaymentId", paymentIntentId)
        .single();

      if (booking) {
        // Bestem om full eller delvis refund basert på beløp
        const refundedTotal = charge.amount_refunded; // i øre
        const fullAmount = booking.amount * 100; // konverter kroner til øre
        const isFullRefund = refundedTotal >= fullAmount;

        // Update booking payment status
        await supabase
          .from("Booking")
          .update({
            paymentStatus: isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED",
            updatedAt: new Date().toISOString(),
          })
          .eq("id", booking.id);

        // Update payment transaction
        await supabase
          .from("PaymentTransaction")
          .update({
            refundedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .eq("bookingId", booking.id);

        logger.info(
          `[Stripe Webhook] Refund processed for booking ${booking.id} (${isFullRefund ? "full" : "partial"})`
        );
      } else {
        logger.info(`[Stripe Webhook] No booking found for refunded PaymentIntent: ${paymentIntentId}`);
      }
    }
  }

  // ─── Invoice Events ───
  else if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    if (customerId && "subscription" in invoice && invoice.subscription) {
      const { data: user } = await supabase
        .from("User")
        .select("id")
        .eq("stripeCustomerId", customerId)
        .single();

      if (user) {
        await createNotification({
          userId: user.id,
          type: "GENERAL",
          title: "Betalingen feilet",
          message:
            "Vi klarte ikke å belaste betalingsmetoden din. Oppdater betalingsinformasjonen for å beholde tilgangen.",
          linkUrl: "/portal/apper",
        });
        logger.info(
          `[Stripe Webhook] Invoice payment failed for customer ${customerId}, notified user ${user.id}`
        );
      }
    }
  }

  // ─── Checkout Session Events ───
  else if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId && session.mode === "payment") {
      // Guest payment completed — save payment intent ID on booking so future
      // webhook lookups (e.g. payment_intent.succeeded, charge.refunded) can find it
      const paymentIntentId = session.payment_intent as string;
      if (paymentIntentId) {
        await supabase
          .from("Booking")
          .update({
            stripePaymentId: paymentIntentId,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", bookingId);

        logger.info(
          `[Stripe Webhook] Checkout completed: saved pi ${paymentIntentId} on booking ${bookingId}`
        );
      }
    } else if (bookingId && session.mode === "setup") {
      // Card setup completed for deferred payment — booking already CONFIRMED
      logger.info(`[Stripe Webhook] Card setup completed for booking ${bookingId}`);
    }
  }

  // ─── Subscription Events ───
  else if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    await handleSubscriptionCreated(subscription, supabase);
  } else if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    await handleSubscriptionUpdated(subscription, supabase);
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await handleSubscriptionCanceled(subscription, supabase);
  } else if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    await handleInvoicePaid(invoice, supabase);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// ─── Subscription Handlers ───

type CoachingTier = "PERFORMANCE_PRO" | "PERFORMANCE" | "START";

function mapPriceToTier(priceId: string): CoachingTier | null {
  if (priceId === process.env.STRIPE_PRICE_PERFORMANCE_PRO) {
    return "PERFORMANCE_PRO";
  }
  if (priceId === process.env.STRIPE_PRICE_PERFORMANCE) {
    return "PERFORMANCE";
  }
  if (priceId === process.env.STRIPE_PRICE_STARTER) {
    return "START";
  }

  // Log warning for unmapped price IDs to catch missing env vars
  logger.warn(
    `[Stripe Webhook] Unmapped price ID: ${priceId}. ` +
    `Configured: STRIPE_PRICE_PERFORMANCE_PRO=${process.env.STRIPE_PRICE_PERFORMANCE_PRO ? "set" : "MISSING"}, ` +
    `STRIPE_PRICE_PERFORMANCE=${process.env.STRIPE_PRICE_PERFORMANCE ? "set" : "MISSING"}, ` +
    `STRIPE_PRICE_STARTER=${process.env.STRIPE_PRICE_STARTER ? "set" : "MISSING"}`
  );
  return null;
}

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServiceClient>
) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;

  if (!priceId) {
    logger.info("[Stripe Webhook] No price ID found in subscription");
    return;
  }

  const tier = mapPriceToTier(priceId);
  if (!tier) {
    logger.info(`[Stripe Webhook] Unknown price ID: ${priceId}`);
    return;
  }

  // Find user by Stripe customer ID
  const { data: user } = await supabase
    .from("User")
    .select("id")
    .eq("stripeCustomerId", customerId)
    .single();

  if (!user) {
    logger.info(`[Stripe Webhook] No user found for customer: ${customerId}`);
    return;
  }

  // Create subscription quota
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subAny = subscription as any;
  const periodEndTimestamp = subAny.current_period_end ?? subAny.currentPeriodEnd;
  const periodEnd = new Date(periodEndTimestamp * 1000);
  await createQuotaForNewSubscription(user.id, subscription.id, tier, periodEnd);

  // Update user subscription info and clear abandoned checkout flag
  const subscriptionTier = tier === "PERFORMANCE_PRO" ? "PRO"
    : tier === "PERFORMANCE" ? "STARTER"
    : "ACADEMY";

  await supabase
    .from("User")
    .update({
      stripeSubscriptionId: subscription.id,
      subscriptionTier,
      subscriptionSource: "STRIPE",
      subscriptionExpiresAt: periodEnd.toISOString(),
      activeCoachingCustomer: true,
      // Clear abandoned checkout tracking
      checkoutAbandonedAt: null,
      lastCheckoutSessionId: null,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", user.id);

  logger.info(`[Stripe Webhook] Subscription created for user ${user.id}, tier: ${tier}`);
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServiceClient>
) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;

  if (!priceId) return;

  const tier = mapPriceToTier(priceId);
  if (!tier) return;

  const { data: user } = await supabase
    .from("User")
    .select("id")
    .eq("stripeCustomerId", customerId)
    .single();

  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subAny = subscription as any;
  const periodEndTimestamp = subAny.current_period_end ?? subAny.currentPeriodEnd;
  const periodEnd = new Date(periodEndTimestamp * 1000);

  const subscriptionTier = tier === "PERFORMANCE_PRO" ? "PRO"
    : tier === "PERFORMANCE" ? "STARTER"
    : "ACADEMY";

  // Update user and quota
  await supabase
    .from("User")
    .update({
      subscriptionTier,
      subscriptionExpiresAt: periodEnd.toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .eq("id", user.id);

  logger.info(`[Stripe Webhook] Subscription updated for user ${user.id}, tier: ${tier}`);
}

async function handleSubscriptionCanceled(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServiceClient>
) {
  const customerId = subscription.customer as string;

  const { data: user } = await supabase
    .from("User")
    .select("id")
    .eq("stripeCustomerId", customerId)
    .single();

  if (!user) return;

  // Remove quota and downgrade user
  await cancelSubscriptionQuota(user.id);

  await supabase
    .from("User")
    .update({
      stripeSubscriptionId: null,
      subscriptionTier: "VISITOR",
      subscriptionSource: null,
      subscriptionExpiresAt: null,
      activeCoachingCustomer: false,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", user.id);

  logger.info(`[Stripe Webhook] Subscription canceled for user ${user.id}`);
}

async function handleInvoicePaid(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof createServiceClient>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoiceAny = invoice as any;
  const subscriptionId = (invoiceAny.subscription ?? invoiceAny.subscriptionId) as string | null;
  if (!subscriptionId) return;

  // Fetch the subscription to get the customer and price
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;

  if (!priceId) return;

  const tier = mapPriceToTier(priceId);
  if (!tier) return;

  const { data: user } = await supabase
    .from("User")
    .select("id")
    .eq("stripeCustomerId", customerId)
    .single();

  if (!user) return;

  // Reset quota for new billing period
  await resetQuotaForNewPeriod(user.id, subscriptionId, tier);

  logger.info(`[Stripe Webhook] Quota reset for user ${user.id} (invoice paid)`);
}
