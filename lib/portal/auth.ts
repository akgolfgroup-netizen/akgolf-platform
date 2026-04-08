import { createServerSupabase } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

  // Bruk service role client for database queries
  const serviceSupabase = createClient(supabaseUrl, supabaseKey);

  // Try to find user by id
  const { data: user, error } = await serviceSupabase
    .from("User")
    .select("*")
    .eq("id", supabaseUser.id)
    .single();

  if (error || !user) {
    // User not found in database, but exists in Auth
    // Create user record
    const { data: newUser, error: insertError } = await serviceSupabase
      .from("User")
      .insert({
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || supabaseUser.email.split("@")[0],
        role: supabaseUser.user_metadata?.role || "USER",
        isActive: true,
        subscriptionTier: "FREE",
      })
      .select()
      .single();

    if (insertError || !newUser) {
      console.error("[getPortalUser] Failed to create user:", insertError);
      return null;
    }

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
      role: newUser.role,
      subscriptionTier: newUser.subscriptionTier || "FREE",
      stripeCustomerId: newUser.stripeCustomerId,
      subscriptionStatus: null,
      subscriptionExpiresAt: null,
      portalMonthlyLogCount: newUser.portalMonthlyLogCount || 0,
    };
  }

  // Get subscription info
  const { data: subscriptions } = await serviceSupabase
    .from("UserSubscription")
    .select("status, billingPeriodEnd")
    .eq("userId", user.id)
    .in("status", ["TRIALING", "ACTIVE"])
    .order("createdAt", { ascending: false })
    .limit(1);

  const subscription = subscriptions?.[0];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    subscriptionTier: user.subscriptionTier || "FREE",
    stripeCustomerId: user.stripeCustomerId,
    subscriptionStatus: subscription?.status || null,
    subscriptionExpiresAt: subscription?.billingPeriodEnd ? new Date(subscription.billingPeriodEnd) : null,
    portalMonthlyLogCount: user.portalMonthlyLogCount || 0,
  };
}

export async function requirePortalUser(): Promise<PortalUser> {
  const user = await getPortalUser();
  if (!user) {
    redirect("/portal/login");
  }
  return user;
}

export async function requireAuth(): Promise<string> {
  const user = await requirePortalUser();
  return user.id;
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getPortalUser();
  return user?.id || null;
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getPortalUser();
  return !!user;
}

export async function logout() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/portal/login");
}

export async function getUserSubscriptionTier(): Promise<string> {
  const user = await getPortalUser();
  return user?.subscriptionTier || "FREE";
}

export async function hasActiveSubscription(): Promise<boolean> {
  const user = await getPortalUser();
  if (!user) return false;
  return ["PRO", "BUSINESS", "TRIALING"].includes(user.subscriptionTier);
}

export async function canAccessFeature(feature: string): Promise<boolean> {
  const user = await getPortalUser();
  if (!user) return false;
  
  const tier = user.subscriptionTier;
  
  switch (feature) {
    case "basic":
      return true;
    case "advanced_analytics":
      return ["PRO", "BUSINESS"].includes(tier);
    case "team_management":
      return tier === "BUSINESS";
    default:
      return false;
  }
}
