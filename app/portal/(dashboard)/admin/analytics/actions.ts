"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";

export async function getAnalyticsOverview() {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ikke autorisert");

  const supabase = await createServerSupabase();

  // Get booking counts
  const { count: totalBookings } = await supabase
    .from("Booking")
    .select("*", { count: "exact" });

  const { count: pendingBookings } = await supabase
    .from("Booking")
    .select("*", { count: "exact" })
    .eq("status", "PENDING");

  const { count: confirmedBookings } = await supabase
    .from("Booking")
    .select("*", { count: "exact" })
    .eq("status", "CONFIRMED");

  // Get user counts
  const { count: totalUsers } = await supabase
    .from("User")
    .select("*", { count: "exact" });

  return {
    totalBookings: totalBookings ?? 0,
    pendingBookings: pendingBookings ?? 0,
    confirmedBookings: confirmedBookings ?? 0,
    totalUsers: totalUsers ?? 0,
  };
}
