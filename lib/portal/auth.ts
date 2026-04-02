import { createServerSupabase } from "@/lib/supabase/server";
import { prisma } from "@/lib/portal/prisma";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

export type PortalUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  subscriptionTier: string;
  stripeCustomerId: string | null;
  subscriptionStatus: string | null;
  subscriptionExpiresAt: Date | null;
  portalMonthlyLogCount: number;
};

export async function getPortalUser(): Promise<PortalUser | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser?.email) return null;

  // Try to find by supabaseId first, then by email
  let user = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      subscriptionTier: true,
      stripeCustomerId: true,
      subscriptionExpiresAt: true,
      portalMonthlyLogCount: true,
      UserSubscription: {
        where: { status: "TRIALING" },
        select: { status: true, billingPeriodEnd: true },
        take: 1,
      },
    },
  });

  if (!user) {
    // First login — upsert to handle both existing users and completely new users
    user = await prisma.user.upsert({
      where: { email: supabaseUser.email },
      update: { supabaseId: supabaseUser.id },
      create: {
        id: nanoid(),
        email: supabaseUser.email!,
        supabaseId: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || null,
        role: "STUDENT",
        subscriptionTier: "VISITOR",
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        subscriptionTier: true,
        stripeCustomerId: true,
        subscriptionExpiresAt: true,
        portalMonthlyLogCount: true,
        UserSubscription: {
          where: { status: "TRIALING" },
          select: { status: true, billingPeriodEnd: true },
          take: 1,
        },
      },
    });
  }

  if (!user || !user.email) return null;

  // Get trial subscription info
  const trialSub = user.UserSubscription?.[0];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    subscriptionTier: user.subscriptionTier,
    stripeCustomerId: user.stripeCustomerId,
    subscriptionStatus: trialSub?.status ?? null,
    subscriptionExpiresAt: trialSub?.billingPeriodEnd ?? user.subscriptionExpiresAt,
    portalMonthlyLogCount: user.portalMonthlyLogCount,
  };
}

export async function requirePortalUser(): Promise<PortalUser> {
  const user = await getPortalUser();
  if (!user) {
    redirect("/portal/login");
  }
  return user;
}
