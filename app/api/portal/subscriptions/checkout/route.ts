import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

const CheckoutSchema = z
  .object({
    moduleSlug: z.string().optional(),
    bundleSlug: z.string().optional(),
    interval: z.enum(["month", "year"]).default("month"),
  })
  .refine((data) => data.moduleSlug || data.bundleSlug, {
    message: "Må ha enten moduleSlug eller bundleSlug",
  });

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`subscription:${getClientIp(req)}`, RATE_LIMITS.SUBSCRIPTIONS);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ugyldig input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { moduleSlug, bundleSlug, interval } = parsed.data;

  // Look up the price ID
  let stripePriceId: string | null = null;

  if (moduleSlug) {
    const mod = await prisma.appModule.findUnique({ where: { slug: moduleSlug } });
    if (!mod || !mod.isActive) {
      return NextResponse.json({ error: "Modul ikke funnet" }, { status: 404 });
    }
    stripePriceId = interval === "year" ? mod.stripeYearlyPriceId : mod.stripePriceId;
  } else if (bundleSlug) {
    const bundle = await prisma.appBundle.findUnique({ where: { slug: bundleSlug } });
    if (!bundle || !bundle.isActive) {
      return NextResponse.json({ error: "Bundle ikke funnet" }, { status: 404 });
    }
    stripePriceId = interval === "year" ? bundle.stripeYearlyPriceId : bundle.stripePriceId;
  }

  if (!stripePriceId) {
    return NextResponse.json({ error: "Stripe-pris ikke konfigurert for dette produktet" }, { status: 400 });
  }

  // Find or create Stripe customer
  let stripeCustomerId = user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    });
  }

  // Check if user is eligible for trial (no previous subscriptions)
  const previousSub = await prisma.appSubscription.findFirst({
    where: { userId: user.id },
  });
  const isEligibleForTrial = !previousSub;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [{ price: stripePriceId, quantity: 1 }],
    ...(isEligibleForTrial && {
      subscription_data: {
        trial_period_days: 14,
      },
    }),
    payment_method_collection: "always",
    success_url: `${baseUrl}/portal/apper?success=true`,
    cancel_url: `${baseUrl}/portal/apper`,
    metadata: {
      userId: user.id,
      moduleSlug: moduleSlug ?? "",
      bundleSlug: bundleSlug ?? "",
    },
  });

  // Track checkout start for abandoned cart recovery
  await prisma.user.update({
    where: { id: user.id },
    data: {
      checkoutAbandonedAt: new Date(),
      lastCheckoutSessionId: session.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
