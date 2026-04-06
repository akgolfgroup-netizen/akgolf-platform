import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { stripe } from "@/lib/portal/stripe";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(`subscription:${getClientIp(request)}`, RATE_LIMITS.SUBSCRIPTIONS);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  if (!user.stripeCustomerId) {
    return NextResponse.json({ error: "Ingen Stripe-konto funnet" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no";

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${baseUrl}/portal/apper`,
  });

  return NextResponse.json({ url: session.url });
}
