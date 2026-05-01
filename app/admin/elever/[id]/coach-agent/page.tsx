import { requirePortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { isStaff } from "@/lib/portal/rbac";
import { CoachAgentChat } from "@/components/admin/coach-agent/CoachAgentChat";
import { sendCoachAgentMessage, listCoachAgentSessions } from "./actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CoachAgentPage({ params }: PageProps) {
  const user = await requirePortalUser();
  const { id: studentId } = await params;

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const sessions = await listCoachAgentSessions(studentId);
  const initialMessages = sessions.map((s) => [
    { role: "user" as const, content: s.prompt },
    { role: "assistant" as const, content: s.response },
  ]).flat();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Coach Agent</h1>
      <p className="text-sm text-gray-500 mb-6">
        Spiller: {studentId.slice(0, 8)}… — Naturlig-språk plan-oppdatering
      </p>
      <CoachAgentChat
        studentId={studentId}
        initialMessages={initialMessages}
        onSend={async (msg) => sendCoachAgentMessage(studentId, msg)}
      />
    </div>
  );
}
