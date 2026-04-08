"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";

export async function getRevenueAnalytics(period: "week" | "month" | "year") {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ikke autorisert");

  const supabase = await createServerSupabase();

  // TODO: Implementer inntektsanalyse med Supabase
  return {
    revenue: [],
    labels: [],
  };
}

export async function getStudentMetrics() {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ikke autorisert");

  const supabase = await createServerSupabase();

  // TODO: Implementer elevmetrikker med Supabase
  return {
    activeStudents: 0,
    newStudents: 0,
    churnRate: 0,
  };
}
