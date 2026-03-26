import { NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { stripe } from "@/lib/portal/stripe";

export async function POST() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  if (!user.stripeCustomerId) {
    return NextResponse.json({ error: "Ingen Stripe-konto funnet" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${baseUrl}/portal/apper`,
  });

  return NextResponse.json({ url: session.url });
}
