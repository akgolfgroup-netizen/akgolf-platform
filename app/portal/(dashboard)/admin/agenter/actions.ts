"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function toggleAgent(
  agentId: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    if (!isAdmin(user.role)) redirect("/");

    const supabase = await createServerSupabase();

    // Check if config exists
    const { data: existing } = await supabase
      .from("AgentConfig")
      .select("id")
      .eq("userId", user.id)
      .eq("agentId", agentId)
      .single();

    if (existing) {
      await supabase
        .from("AgentConfig")
        .update({ isActive: enabled })
        .eq("id", existing.id);
    } else {
      await supabase.from("AgentConfig").insert({
        userId: user.id,
        agentId,
        isActive: enabled,
      });
    }

    revalidatePath("/portal/admin/agenter");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}

export async function getAgentStates(): Promise<Record<string, boolean>> {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) redirect("/");

  const supabase = await createServerSupabase();

  const { data: configs } = await supabase
    .from("AgentConfig")
    .select("agentId, isActive")
    .eq("userId", user.id);

  return Object.fromEntries((configs || []).map((c) => [c.agentId, c.isActive]));
}
