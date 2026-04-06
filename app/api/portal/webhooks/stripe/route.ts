import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/portal/stripe";
import { prisma } from "@/lib/portal/prisma";
import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";
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

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const paymentIntentId = paymentIntent.id;

    // Atomic idempotency guard: only update bookings still in PENDING state
    const booking = await prisma.booking.findFirst({
      where: {
        stripePaymentId: paymentIntentId,
        paymentStatus: { not: PaymentStatus.PAID },
      },
      select: {
        id: true,
        amount: true,
        vatAmount: true,
        startTime: true,
        ServiceType: { select: { name: true, duration: true, vatRate: true } },
        User: { select: { name: true, email: true } },
        Instructor: {
          select: {
            User: { select: { name: true, email: true } },
          },
        },
        Location: { select: { name: true } },
      },
    });

    if (!booking) {
      logger.info(`[Stripe Webhook] Already processed or not found: ${paymentIntentId}`);
    } else {
      const vatRate = booking.ServiceType?.vatRate ?? 25;
      const netAmount = booking.amount - booking.vatAmount;

      await prisma.$transaction([
        prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: BookingStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PAID,
          },
        }),
        prisma.paymentTransaction.create({
          data: {
            id: nanoid(),
            bookingId: booking.id,
            paymentMethod: PaymentMethod.STRIPE,
            grossAmount: booking.amount,
            vatAmount: booking.vatAmount,
            vatRate,
            feeAmount: 0,
            netAmount,
            providerRef: paymentIntentId,
            status: PaymentStatus.PAID,
            paidAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      ]);
      logger.info(`[Stripe Webhook] Booking ${booking.id} confirmed`);

      // Send confirmation emails (non-blocking — don't fail the webhook)
      sendBookingConfirmation({
        bookingId: booking.id,
        studentName: booking.User?.name ?? "Golfer",
        studentEmail: booking.User?.email ?? "",
        instructorName: booking.Instructor?.User?.name ?? "Trener",
        instructorEmail: booking.Instructor?.User?.email ?? "",
        serviceName: booking.ServiceType?.name ?? "Coaching",
        startTime: booking.startTime,
        duration: booking.ServiceType?.duration ?? 60,
        amount: booking.amount,
        vatAmount: booking.vatAmount,
        location: booking.Location?.name ?? "Gamle Fredrikstad Golfklubb",
      }).catch((err) => logger.error("[Stripe Webhook] Email send failed", err));
    }
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    await prisma.booking.updateMany({
      where: {
        stripePaymentId: paymentIntent.id,
        paymentStatus: PaymentStatus.PENDING,
      },
      data: { paymentStatus: PaymentStatus.FAILED },
    });
    logger.info(`[Stripe Webhook] Payment failed for PaymentIntent: ${paymentIntent.id}`);
  }

  // ─── Refund Events ───
  else if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = charge.payment_intent as string;

    if (paymentIntentId) {
      const booking = await prisma.booking.findFirst({
        where: { stripePaymentId: paymentIntentId },
        select: { id: true, amount: true },
      });

      if (booking) {
        // Bestem om full eller delvis refund basert på beløp
        const refundedTotal = charge.amount_refunded; // i øre
        const fullAmount = booking.amount * 100; // konverter kroner til øre
        const isFullRefund = refundedTotal >= fullAmount;

        await prisma.$transaction([
          prisma.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: isFullRefund
                ? PaymentStatus.REFUNDED
                : PaymentStatus.PARTIALLY_REFUNDED,
            },
          }),
          prisma.paymentTransaction.updateMany({
            where: { bookingId: booking.id },
            data: { refundedAt: new Date() },
          }),
        ]);
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
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      });

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

  // ─── Subscription Events ───
  else if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    await handleSubscriptionCreated(subscription);
  } else if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    await handleSubscriptionUpdated(subscription);
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await handleSubscriptionCanceled(subscription);
  } else if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    await handleInvoicePaid(invoice);
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
  if (priceId === process.env.STRIPE_PRICE_START) {
    return "START";
  }
  return null;
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
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
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

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
  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeSubscriptionId: subscription.id,
      subscriptionTier: tier === "PERFORMANCE_PRO" ? "PRO"
                      : tier === "PERFORMANCE" ? "STARTER"
                      : "ACADEMY",
      subscriptionSource: "STRIPE",
      subscriptionExpiresAt: periodEnd,
      activeCoachingCustomer: true,
      // Clear abandoned checkout tracking
      checkoutAbandonedAt: null,
      lastCheckoutSessionId: null,
    },
  });

  logger.info(`[Stripe Webhook] Subscription created for user ${user.id}, tier: ${tier}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;

  if (!priceId) return;

  const tier = mapPriceToTier(priceId);
  if (!tier) return;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subAny = subscription as any;
  const periodEndTimestamp = subAny.current_period_end ?? subAny.currentPeriodEnd;
  const periodEnd = new Date(periodEndTimestamp * 1000);

  // Update user and quota
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: tier === "PERFORMANCE_PRO" ? "PRO"
                      : tier === "PERFORMANCE" ? "STARTER"
                      : "ACADEMY",
      subscriptionExpiresAt: periodEnd,
    },
  });

  logger.info(`[Stripe Webhook] Subscription updated for user ${user.id}, tier: ${tier}`);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) return;

  // Remove quota and downgrade user
  await cancelSubscriptionQuota(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeSubscriptionId: null,
      subscriptionTier: "VISITOR",
      subscriptionSource: null,
      subscriptionExpiresAt: null,
      activeCoachingCustomer: false,
    },
  });

  logger.info(`[Stripe Webhook] Subscription canceled for user ${user.id}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
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

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) return;

  // Reset quota for new billing period
  await resetQuotaForNewPeriod(user.id, subscriptionId, tier);

  logger.info(`[Stripe Webhook] Quota reset for user ${user.id} (invoice paid)`);
}
