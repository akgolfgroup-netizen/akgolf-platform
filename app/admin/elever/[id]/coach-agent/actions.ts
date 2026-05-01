"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createOrContinueSession, getActiveSessions } from "@/lib/portal/agents/coach-plan-agent";

export async function sendCoachAgentMessage(studentId: string, message: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  return createOrContinueSession(studentId, user.id, message);
}

export async function listCoachAgentSessions(studentId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  return getActiveSessions(studentId);
}
