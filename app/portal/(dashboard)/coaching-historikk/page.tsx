import { getCoachingSessions } from "./actions";
import { SessionCard } from "@/components/portal/coaching-historikk/session-card";
import { isStaff } from "@/lib/portal/rbac";
import { requirePortalUser } from "@/lib/portal/auth";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

export default async function CoachingHistorikkPage() {
  const [user, rawSessions] = await Promise.all([
    requirePortalUser(),
    getCoachingSessions(),
  ]);

  const sessions = rawSessions.map((s) => ({
    ...s,
    student: { name: s.User?.name ?? null, image: s.User?.image ?? null },
    instructor: { user: { name: s.Instructor?.User?.name ?? null }, title: s.Instructor?.title ?? null },
  }));

  const canGenerateAI = isStaff(user?.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Coachinghistorikk</h1>
          <p className="text-sm text-[#6b7366] mt-1">Dine coachingsesjoner og oppfølging</p>
        </div>
        <Link
          href="/portal/bookinger/ny"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#154212] text-white hover:bg-[#0d2e0c] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Book coaching
        </Link>
      </div>

      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#1c1c16]">Alle sesjoner</h2>
          <span className="text-xs text-[#8a9385]">
            {sessions.length} sesjoner
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white border border-[#c2c9bb]/50">
            <BookOpen className="w-10 h-10 text-[#c2c9bb] mb-3" />
            <p className="text-sm text-[#6b7366]">Ingen coachingsesjoner ennå.</p>
            <Link
              href="/portal/bookinger/ny"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#154212] text-white text-sm font-medium hover:bg-[#0d2e0c] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Book din første sesjon
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                canGenerateAI={canGenerateAI}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
