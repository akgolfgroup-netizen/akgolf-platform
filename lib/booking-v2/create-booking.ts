/**
 * Booking V2 — kjernefunksjon som tar en BookingDraft + currentUser og oppretter
 * Booking-record i DB + Stripe Checkout (når trengs).
 *
 * Returnerer paymentUrl som klienten skal redirecte til:
 * - Abo-dekket økt: paymentUrl = /booking/{id}/confirmation (ingen Stripe)
 * - Engangs Stripe-checkout: paymentUrl = checkout.url
 *
 * NB: Subscription-mode for nytt Performance-abo via booking-flyten er ikke
 * implementert — brukere uten quota får { reason: "subscription-required" }.
 * Krever stripePriceId på ServiceType og er flagget i WORKLOG steg 5.
 */

import { randomUUID } from "node:crypto";
import { stripe } from "@/lib/portal/stripe";
import { prisma } from "@/lib/portal/prisma";
import { validateBooking } from "@/lib/portal/booking/validation";
import {
  checkUserQuota,
  consumeSession,
  checkWeeklyLimit,
} from "@/lib/portal/booking/subscription-quota";
import { createBookingWithConflictCheck } from "@/lib/portal/booking/conflict-check";
import {
  invalidateSlotsCache,
  invalidateBookingsCache,
} from "@/lib/portal/booking/cache";
import { sendBookingConfirmation } from "@/lib/portal/email/send-booking-email";
import { sendBookingConfirmationSms } from "@/lib/portal/sms/send-booking-sms";
import { syncBookingToCalendar } from "@/lib/portal/calendar/google-calendar";
import { logger } from "@/lib/logger";
import { createClient } from "@supabase/supabase-js";
import type { BookingDraft } from "./draft";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface CreateBookingV2Result {
  ok: true;
  bookingId: string;
  paymentUrl: string;
  flow: "subscription-covered" | "stripe-checkout";
}

export interface CreateBookingV2Error {
  ok: false;
  reason:
    | "service-not-found"
    | "validation-failed"
    | "conflict"
    | "quota-failed"
    | "subscription-required"
    | "user-create-failed"
    | "stripe-error"
    | "internal";
  message: string;
}

interface CurrentUserSnapshot {
  id: string;
  email: string;
  name: string | null;
  stripeCustomerId: string | null;
}

/**
 * Finn eller opprett bruker basert på e-post (gjeste-flyt).
 * Mønsteret er kopiert fra app/api/booking/create/route.ts.
 */
async function findOrCreateUserByEmail(
  email: string,
  name: string,
  phone: string,
): Promise<CurrentUserSnapshot | null> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const lower = email.toLowerCase().trim();

  const { data: existing } = await supabase
    .from("User")
    .select("id, email, name, stripeCustomerId, phone")
    .eq("email", lower)
    .maybeSingle();

  if (existing) {
    if (existing.name !== name || existing.phone !== phone) {
      await supabase
        .from("User")
        .update({
          ...(name && { name }),
          ...(phone && { phone }),
          updatedAt: new Date().toISOString(),
        })
        .eq("id", existing.id);
    }
    return {
      id: existing.id,
      email: existing.email,
      name: existing.name,
      stripeCustomerId: existing.stripeCustomerId ?? null,
    };
  }

  const newId = randomUUID();
  const { data: created, error } = await supabase
    .from("User")
    .insert({
      id: newId,
      email: lower,
      name: name || lower.split("@")[0],
      phone: phone || null,
      role: "STUDENT",
      isActive: true,
      subscriptionTier: "VISITOR",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select("id, email, name, stripeCustomerId")
    .single();

  if (error || !created) {
    logger.error("[booking-v2/create] user-create failed", error);
    return null;
  }

  return {
    id: created.id,
    email: created.email,
    name: created.name,
    stripeCustomerId: created.stripeCustomerId ?? null,
  };
}

/**
 * Bygg startTime/endTime fra draft.date+time tolket som Europe/Oslo.
 * Vi setter timene i lokal-tid på en Date som bruker UTC-felt for å unngå at
 * server-tidssone (UTC på Vercel) skifter time-tellingen — slot-generatoren
 * bruker samme konvensjon.
 */
function buildStartEnd(draft: BookingDraft, durationMin: number): {
  startTime: Date;
  endTime: Date;
} {
  const [y, m, d] = draft.date.split("-").map(Number);
  const [hh, mm] = draft.time.split(":").map(Number);
  const startTime = new Date(Date.UTC(y, m - 1, d, hh, mm, 0, 0));
  const endTime = new Date(startTime.getTime() + durationMin * 60_000);
  return { startTime, endTime };
}

export async function createBookingV2(input: {
  draft: BookingDraft;
  /** Innlogget bruker hvis det finnes — ellers bygges ny bruker fra draft.customer */
  loggedInUser: { id: string; email: string; name: string | null; stripeCustomerId: string | null } | null;
  /** Origin for Stripe success/cancel-URL */
  origin: string;
}): Promise<CreateBookingV2Result | CreateBookingV2Error> {
  const { draft, loggedInUser, origin } = input;

  const service = await prisma.serviceType.findUnique({
    where: { id: draft.serviceTypeId },
    select: {
      id: true,
      name: true,
      description: true,
      duration: true,
      price: true,
      bufferAfter: true,
      bufferBefore: true,
      category: true,
      isActive: true,
      isPublic: true,
      Instructor: { select: { id: true, userId: true, User: { select: { name: true, email: true, phone: true } } } },
    },
  });

  if (!service || !service.isActive || !service.isPublic) {
    return { ok: false, reason: "service-not-found", message: "Tjenesten finnes ikke." };
  }

  // Resolve instruktør — bruk valgt instructorId hvis satt, ellers første tilknyttet
  const instructorId =
    draft.instructorId ?? service.Instructor[0]?.id ?? null;
  if (!instructorId) {
    return {
      ok: false,
      reason: "validation-failed",
      message: "Tjenesten har ingen tilgjengelig trener.",
    };
  }
  const instructor = service.Instructor.find((i) => i.id === instructorId);
  if (!instructor) {
    return {
      ok: false,
      reason: "validation-failed",
      message: "Treneren tilbyr ikke denne tjenesten.",
    };
  }

  // Bygg eller hent kunde
  const user =
    loggedInUser ??
    (await findOrCreateUserByEmail(
      draft.customer.email,
      `${draft.customer.firstName} ${draft.customer.lastName}`.trim(),
      draft.customer.phone,
    ));
  if (!user) {
    return {
      ok: false,
      reason: "user-create-failed",
      message: "Kunne ikke opprette eller finne bruker.",
    };
  }

  const { startTime, endTime } = buildStartEnd(draft, service.duration);

  // Validering (tidsregler, tilgjengelighet, ingen overlapp)
  const validation = await validateBooking({
    serviceTypeId: service.id,
    instructorId,
    startTime,
    studentId: user.id,
    isAdmin: false,
  });
  if (!validation.valid) {
    const message =
      validation.errors?.map((e) => e.message).join(", ") ||
      "Ugyldig booking.";
    return { ok: false, reason: "validation-failed", message };
  }

  // Klassifiser flyt
  const isSubscriptionService = service.name.toLowerCase().startsWith("performance");
  const quotaCheck = await checkUserQuota(user.id);
  const subscriptionCovered = isSubscriptionService && quotaCheck.hasQuota && service.price === 0;

  // Performance uten aktiv quota: krev abo først.
  if (isSubscriptionService && !subscriptionCovered) {
    return {
      ok: false,
      reason: "subscription-required",
      message:
        "Performance krever et aktivt abonnement. Start abo via Min side først, eller velg en Flex-time.",
    };
  }

  if (subscriptionCovered) {
    const weeklyError = await checkWeeklyLimit(user.id, quotaCheck.tier);
    if (weeklyError) {
      return { ok: false, reason: "quota-failed", message: weeklyError };
    }
  }

  // Conflict-check + opprett booking atomisk
  const bookingId = randomUUID();
  const supabase = createClient(supabaseUrl, supabaseKey);

  const conflictResult = await createBookingWithConflictCheck({
    instructorId,
    startTime,
    endTime,
    bufferBefore: service.bufferBefore,
    bufferAfter: service.bufferAfter,
    createFn: async () => {
      if (subscriptionCovered) {
        const consumed = await consumeSession(user.id);
        if (!consumed) {
          throw new Error("Kunne ikke trekke fra kvoten din. Prøv igjen.");
        }
      }

      const isGuest = !loggedInUser;
      const status = subscriptionCovered ? "CONFIRMED" : "PENDING";
      const paymentMethod = subscriptionCovered ? "NONE" : "STRIPE";
      const paymentStatus = subscriptionCovered ? "PAID" : "PENDING";
      const amount = subscriptionCovered ? 0 : service.price;

      const { data: booking, error } = await supabase
        .from("Booking")
        .insert({
          id: bookingId,
          studentId: user.id,
          instructorId,
          serviceTypeId: service.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status,
          paymentMethod,
          paymentStatus,
          amount,
          vatAmount: 0,
          playerNotes: draft.customer.note?.slice(0, 500) || null,
          guestEmail: isGuest ? draft.customer.email : null,
          guestName: isGuest
            ? `${draft.customer.firstName} ${draft.customer.lastName}`.trim()
            : null,
          guestPhone: isGuest ? draft.customer.phone : null,
          updatedAt: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (error || !booking) {
        throw new Error(error?.message || "Kunne ikke opprette booking i DB.");
      }
      return booking.id;
    },
  });

  if (!conflictResult.success) {
    return {
      ok: false,
      reason: "conflict",
      message: conflictResult.error,
    };
  }

  // Cache invalidation (best effort)
  const dateStr = startTime.toISOString().split("T")[0];
  await Promise.all([
    invalidateSlotsCache(instructorId, dateStr).catch(() => null),
    invalidateBookingsCache(instructorId).catch(() => null),
  ]);

  // Subscription-covered: send confirmation-mail + SMS til trener + redirect til bekreftelse
  if (subscriptionCovered) {
    const studentName = `${draft.customer.firstName} ${draft.customer.lastName}`.trim() || user.name || "Kunde";
    sendBookingConfirmation({
      bookingId,
      studentName,
      studentEmail: user.email,
      instructorName: instructor.User?.name ?? "Instruktør",
      instructorEmail: instructor.User?.email ?? "",
      serviceName: service.name,
      startTime,
      duration: service.duration,
      amount: 0,
      vatAmount: 0,
      location: "AK Golf studio",
    }).catch((err: unknown) =>
      logger.error("[booking-v2/create] confirmation email failed", err),
    );

    // SMS til instruktør (best effort — feiler stille hvis Twilio ikke er konfigurert
    // eller treneren mangler telefonnummer).
    if (instructor.User?.phone) {
      sendBookingConfirmationSms({
        instructorPhone: instructor.User.phone,
        instructorName: instructor.User.name ?? "Instruktør",
        studentName,
        serviceName: service.name,
        startTime,
        duration: service.duration,
      }).catch((err: unknown) =>
        logger.error("[booking-v2/create] confirmation SMS failed", err),
      );
    }

    // Google Calendar-sync (non-blocking — feiler stille hvis trener
    // ikke har koblet Google, tokens er utløpt, eller API er nede).
    if (instructor.userId) {
      syncBookingToCalendar(instructor.userId, {
        id: bookingId,
        serviceName: service.name,
        startTime,
        endTime,
        instructorName: instructor.User?.name ?? undefined,
        location: "AK Golf studio",
      })
        .then(async (eventId) => {
          if (eventId) {
            await supabase
              .from("Booking")
              .update({ googleCalendarEventId: eventId })
              .eq("id", bookingId);
          }
        })
        .catch((err: unknown) =>
          logger.error("[booking-v2/create] Calendar sync failed", err),
        );
    }

    return {
      ok: true,
      bookingId,
      paymentUrl: `/booking-v2/bekreftelse?bookingId=${bookingId}`,
      flow: "subscription-covered",
    };
  }

  // Engangs Stripe Checkout
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? `${draft.customer.firstName} ${draft.customer.lastName}`.trim(),
        phone: draft.customer.phone || undefined,
      });
      stripeCustomerId = customer.id;
      await supabase
        .from("User")
        .update({ stripeCustomerId })
        .eq("id", user.id);
    } catch (err) {
      logger.error("[booking-v2/create] stripe customer create failed", err);
      return {
        ok: false,
        reason: "stripe-error",
        message: "Kunne ikke opprette betalingskunde i Stripe.",
      };
    }
  }

  let checkoutUrl: string;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "nok",
            product_data: {
              name: service.name,
              description: `${service.duration} min coaching`,
            },
            unit_amount: service.price * 100,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        setup_future_usage: "off_session",
        metadata: { bookingId, userId: user.id },
      },
      success_url: `${origin}/booking-v2/bekreftelse?bookingId=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/${bookingId}/cancel`,
      metadata: { bookingId, userId: user.id, source: "booking-v2" },
    });

    if (!session.url) {
      throw new Error("Stripe Checkout-session manglet URL");
    }
    checkoutUrl = session.url;
  } catch (err) {
    logger.error("[booking-v2/create] stripe checkout failed", err);
    return {
      ok: false,
      reason: "stripe-error",
      message: "Kunne ikke starte betalingsflyten.",
    };
  }

  return {
    ok: true,
    bookingId,
    paymentUrl: checkoutUrl,
    flow: "stripe-checkout",
  };
}
