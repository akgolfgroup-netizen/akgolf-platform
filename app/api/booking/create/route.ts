import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { addMinutes } from "date-fns";
import { BookingStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { autoCreateUser } from "@/lib/portal/booking/auto-create-user";
import { sendWelcomeEmail } from "@/lib/portal/email/send-welcome-email";

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export async function POST(req: NextRequest) {
  // Support both authenticated and unauthenticated booking
  const user = await getPortalUser();

  let body: {
    serviceTypeId?: string;
    instructorId?: string;
    startTime?: string;
    paymentMethod?: string;
    // For unauthenticated booking (new customers)
    email?: string;
    name?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { serviceTypeId, instructorId, startTime, paymentMethod, email, name } =
    body;

  if (!serviceTypeId || !instructorId || !startTime || !paymentMethod) {
    return NextResponse.json(
      {
        error:
          "Mangler felt: serviceTypeId, instructorId, startTime, paymentMethod",
      },
      { status: 400 }
    );
  }

  // Determine user: authenticated session OR auto-create from email+name
  let studentId: string;
  let isNewUser = false;
  let tempPassword: string | undefined;

  if (user?.id) {
    studentId = user.id;
  } else if (email && name) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ugyldig e-postadresse" },
        { status: 400 }
      );
    }

    try {
      const result = await autoCreateUser(email.toLowerCase().trim(), name.trim());
      studentId = result.userId;
      isNewUser = result.isNewUser;
      tempPassword = result.tempPassword;
    } catch (error) {
      console.error("[booking/create] Auto-create user failed:", error);
      return NextResponse.json(
        { error: "Kunne ikke opprette brukerkonto" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Ikke innlogget. Oppgi e-post og navn for å booke." },
      { status: 401 }
    );
  }

  if (!["STRIPE", "VIPPS"].includes(paymentMethod)) {
    return NextResponse.json(
      { error: "Ugyldig betalingsmetode" },
      { status: 400 }
    );
  }

  const start = new Date(startTime);
  if (isNaN(start.getTime())) {
    return NextResponse.json({ error: "Ugyldig startTime" }, { status: 400 });
  }
  if (start <= new Date()) {
    return NextResponse.json(
      { error: "Starttidspunkt må være i fremtiden" },
      { status: 400 }
    );
  }

  try {
    // Hent serviceType og sjekk at instructor tilbyr den (én spørring)
    const [serviceType, instructorWithService] = await Promise.all([
      prisma.serviceType.findUnique({
        where: { id: serviceTypeId },
        select: {
          duration: true,
          price: true,
          name: true,
          vatRate: true,
          isActive: true,
          allowStripe: true,
          allowVipps: true,
          minNoticeHours: true,
          maxAdvanceDays: true,
          bufferBefore: true,
          bufferAfter: true,
        },
      }),
      prisma.instructor.findFirst({
        where: {
          id: instructorId,
          serviceTypes: { some: { id: serviceTypeId } },
        },
        select: {
          id: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    if (!serviceType) {
      return NextResponse.json(
        { error: "Tjeneste ikke funnet" },
        { status: 400 }
      );
    }
    if (!serviceType.isActive) {
      return NextResponse.json(
        { error: "Tjenesten er ikke aktiv" },
        { status: 400 }
      );
    }
    if (!instructorWithService) {
      return NextResponse.json(
        { error: "Instruktør ikke funnet eller tilbyr ikke denne tjenesten" },
        { status: 404 }
      );
    }

    // Valider varslingstid og bestillingshorisont
    const minNoticeMs = serviceType.minNoticeHours * 60 * 60 * 1000;
    if (start.getTime() - Date.now() < minNoticeMs) {
      return NextResponse.json(
        {
          error: `Bestilling krever minst ${serviceType.minNoticeHours} timers varsel`,
        },
        { status: 400 }
      );
    }
    const maxAdvanceMs = serviceType.maxAdvanceDays * 24 * 60 * 60 * 1000;
    if (start.getTime() - Date.now() > maxAdvanceMs) {
      return NextResponse.json(
        {
          error: `Kan ikke bestille mer enn ${serviceType.maxAdvanceDays} dager frem i tid`,
        },
        { status: 400 }
      );
    }

    // Valider at tjenesten støtter valgt betalingsmetode
    if (paymentMethod === "STRIPE" && !serviceType.allowStripe) {
      return NextResponse.json(
        { error: "Stripe-betaling er ikke tilgjengelig for denne tjenesten" },
        { status: 400 }
      );
    }
    if (paymentMethod === "VIPPS" && !serviceType.allowVipps) {
      return NextResponse.json(
        { error: "Vipps-betaling er ikke tilgjengelig for denne tjenesten" },
        { status: 400 }
      );
    }

    const end = addMinutes(start, serviceType.duration);
    // Buffer-vinduer for konfliktsjekk (lagret endTime inkluderer IKKE buffer)
    const conflictStart = addMinutes(start, -serviceType.bufferBefore);
    const conflictEnd = addMinutes(end, serviceType.bufferAfter);
    // price er lagret i øre (1 kr = 100 øre)
    const vatAmount = Math.round(
      (serviceType.price * serviceType.vatRate) / 100
    );

    // Atomisk konfliktsjekk + opprettelse via serializable transaksjon
    // Sjekker både eksisterende bookinger og blokerte tider (inkl. buffertid)
    const booking = await prisma.$transaction(
      async (tx) => {
        const [bookingConflict, blockedConflict] = await Promise.all([
          tx.booking.findFirst({
            where: {
              instructorId,
              status: {
                in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
              },
              AND: [
                { startTime: { lt: conflictEnd } },
                { endTime: { gt: conflictStart } },
              ],
            },
          }),
          tx.blockedTime.findFirst({
            where: {
              OR: [{ instructorId }, { instructorId: null }],
              AND: [
                { startTime: { lt: conflictEnd } },
                { endTime: { gt: conflictStart } },
              ],
            },
          }),
        ]);

        if (bookingConflict || blockedConflict) {
          throw new ConflictError("Tidspunktet er ikke lenger ledig");
        }

        return tx.booking.create({
          data: {
            studentId,
            instructorId,
            serviceTypeId,
            startTime: start,
            endTime: end,
            status: BookingStatus.PENDING,
            paymentMethod:
              paymentMethod === "STRIPE"
                ? PaymentMethod.STRIPE
                : PaymentMethod.VIPPS,
            paymentStatus: PaymentStatus.PENDING,
            amount: serviceType.price,
            vatAmount,
          },
        });
      },
      { isolationLevel: "Serializable" }
    );

    // Send welcome email for new users (non-blocking)
    if (isNewUser && tempPassword) {
      sendWelcomeEmail({
        name: name!,
        email: email!,
        tempPassword,
        serviceName: serviceType.name,
        instructorName: instructorWithService.user.name ?? "Instruktør",
        startTime: start,
        duration: serviceType.duration,
        amount: serviceType.price,
        location: "Gamle Fredrikstad Golfklubb",
      }).catch((err) =>
        console.error("[booking/create] Welcome email failed:", err)
      );
    }

    if (paymentMethod === "STRIPE") {
      let paymentIntent: Awaited<
        ReturnType<typeof stripe.paymentIntents.create>
      >;
      try {
        // price er lagret i øre — sendes direkte til Stripe (krever øre/cents)
        paymentIntent = await stripe.paymentIntents.create({
          amount: serviceType.price,
          currency: "nok",
          metadata: { bookingId: booking.id },
          automatic_payment_methods: { enabled: true },
        });
      } catch (stripeError) {
        // Rydd opp booking ved Stripe-feil
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: BookingStatus.CANCELLED },
        });
        console.error("[booking/create] Stripe error:", stripeError);
        return NextResponse.json(
          { error: "Kunne ikke opprette betaling" },
          { status: 500 }
        );
      }

      if (!paymentIntent.client_secret) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: BookingStatus.CANCELLED },
        });
        return NextResponse.json(
          { error: "Kunne ikke opprette betaling" },
          { status: 500 }
        );
      }

      await prisma.booking.update({
        where: { id: booking.id },
        data: { stripePaymentId: paymentIntent.id },
      });

      return NextResponse.json({
        bookingId: booking.id,
        clientSecret: paymentIntent.client_secret,
        isNewUser,
      });
    }

    // Vipps: returnerer bare bookingId, Vipps-initiering skjer separat
    return NextResponse.json({ bookingId: booking.id, isNewUser });
  } catch (error) {
    if (error instanceof ConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("[booking/create] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
