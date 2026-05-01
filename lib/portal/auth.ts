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
  playerhqAccessUntil: Date | null;
  playerhqStripeSubscriptionId: string | null;
};

const DEMO_USER: PortalUser = {
  id: "demo-user-001",
  name: "Demo Bruker",
  email: "demo@akgolf.no",
  image: null,
  role: "ADMIN",
  subscriptionTier: "PRO",
  stripeCustomerId: null,
  subscriptionStatus: "ACTIVE",
  subscriptionExpiresAt: new Date("2030-01-01"),
  portalMonthlyLogCount: 0,
  playerhqAccessUntil: new Date("2030-01-01"),
  playerhqStripeSubscriptionId: null,
};

export async function getPortalUser(): Promise<PortalUser | null> {
  if (process.env.DEMO_BYPASS === "true") return DEMO_USER;

  const supabase = await createServerSupabase();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser?.email) return null;

  // Bruk service role client for database queries
  const serviceSupabase = createClient(supabaseUrl, supabaseKey);

  // Søk bruker: først på supabaseId, deretter id, deretter email
  let user = null;

  const { data: bySupabaseId } = await serviceSupabase
    .from("User")
    .select("*")
    .eq("supabaseId", supabaseUser.id)
    .single();

  if (bySupabaseId) {
    user = bySupabaseId;
  } else {
    const { data: byId } = await serviceSupabase
      .from("User")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();

    if (byId) {
      user = byId;
    } else {
      const { data: byEmail } = await serviceSupabase
        .from("User")
        .select("*")
        .eq("email", supabaseUser.email)
        .single();

      if (byEmail) {
        // Koble supabaseId til eksisterende bruker
        await serviceSupabase
          .from("User")
          .update({ supabaseId: supabaseUser.id })
          .eq("id", byEmail.id);
        user = { ...byEmail, supabaseId: supabaseUser.id };
      }
    }
  }

  if (!user) {
    // Bruker finnes ikke — opprett ny
    const { data: newUser, error: insertError } = await serviceSupabase
      .from("User")
      .insert({
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || supabaseUser.email.split("@")[0],
        role: "STUDENT",
        isActive: true,
        subscriptionTier: "VISITOR",
        // PlayerHQ: gratis trial frem til 1. juni 2026 for alle som registrerer seg i mai
        playerhqAccessUntil: "2026-06-01T00:00:00.000Z",
      })
      .select()
      .single();

    if (insertError || !newUser) {
      console.error("[getPortalUser] Failed to create user:", insertError);
      return null;
    }

    // Fire-and-forget: trigger onboarding-agent for ny bruker.
    // Sender velkomst-notifikasjon + mental-baseline-link.
    void import("@/lib/portal/agents/onboarding")
      .then(({ runOnboarding }) => runOnboarding(newUser.id))
      .catch((err) => console.error("[getPortalUser] onboarding agent failed", err));

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
      role: newUser.role,
      subscriptionTier: newUser.subscriptionTier || "VISITOR",
      stripeCustomerId: newUser.stripeCustomerId,
      subscriptionStatus: null,
      subscriptionExpiresAt: null,
      portalMonthlyLogCount: newUser.portalMonthlyLogCount || 0,
      playerhqAccessUntil: newUser.playerhqAccessUntil ? new Date(newUser.playerhqAccessUntil) : null,
      playerhqStripeSubscriptionId: newUser.playerhqStripeSubscriptionId ?? null,
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
    subscriptionTier: user.subscriptionTier || "VISITOR",
    stripeCustomerId: user.stripeCustomerId,
    subscriptionStatus: subscription?.status || null,
    subscriptionExpiresAt: subscription?.billingPeriodEnd ? new Date(subscription.billingPeriodEnd) : null,
    portalMonthlyLogCount: user.portalMonthlyLogCount || 0,
    playerhqAccessUntil: user.playerhqAccessUntil ? new Date(user.playerhqAccessUntil) : null,
    playerhqStripeSubscriptionId: user.playerhqStripeSubscriptionId ?? null,
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
  return user?.subscriptionTier || "VISITOR";
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
