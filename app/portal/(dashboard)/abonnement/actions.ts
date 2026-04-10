"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/portal/stripe";

export interface SubscriptionData {
  user: {
    name: string | null;
    email: string | null;
    tier: string;
    expiresAt: string | null;
    hasStripeSubscription: boolean;
  };
  quota: {
    sessionsUsed: number;
    sessionsAllowed: number;
    sessionsRemaining: number;
    periodEnd: string | null;
    bookingWindowDays: number;
  } | null;
  upcomingBookings: number;
}

export async function getSubscriptionData(): Promise<SubscriptionData> {
  const user = await requirePortalUser();
  const supabase = createServiceClient();

  const [quotaResult, userDataResult, bookingCountResult] = await Promise.all([
    supabase
      .from("SubscriptionQuota")
      .select("*")
      .eq("userId", user.id)
      .single(),
    supabase
      .from("User")
      .select(
        "stripeCustomerId, stripeSubscriptionId, subscriptionTier, subscriptionExpiresAt"
      )
      .eq("id", user.id)
      .single(),
    supabase
      .from("Booking")
      .select("id", { count: "exact", head: true })
      .eq("studentId", user.id)
      .in("status", ["PENDING", "CONFIRMED"])
      .gte("startTime", new Date().toISOString()),
  ]);

  const { data: quota } = quotaResult;
  const { data: userData } = userDataResult;
  const { count: upcomingBookings } = bookingCountResult;

  return {
    user: {
      name: user.name,
      email: user.email,
      tier: (userData?.subscriptionTier as string | null) ?? "VISITOR",
      expiresAt: (userData?.subscriptionExpiresAt as string | null) ?? null,
      hasStripeSubscription: !!(userData?.stripeSubscriptionId),
    },
    quota: quota
      ? {
          sessionsUsed: quota.sessionsUsed as number,
          sessionsAllowed: quota.sessionsAllowed as number,
          sessionsRemaining:
            (quota.sessionsAllowed as number) - (quota.sessionsUsed as number),
          periodEnd: (quota.periodEnd as string | null) ?? null,
          bookingWindowDays: quota.bookingWindowDays as number,
        }
      : null,
    upcomingBookings: upcomingBookings ?? 0,
  };
}

export async function getStripePortalUrl(): Promise<string | null> {
  const user = await requirePortalUser();
  const supabase = createServiceClient();

  const { data: userData } = await supabase
    .from("User")
    .select("stripeCustomerId")
    .eq("id", user.id)
    .single();

  if (!userData?.stripeCustomerId) return null;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://akgolf.no";

  const session = await stripe.billingPortal.sessions.create({
    customer: userData.stripeCustomerId as string,
    return_url: `${baseUrl}/portal/abonnement`,
  });

  return session.url;
}
