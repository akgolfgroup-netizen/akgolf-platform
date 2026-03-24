import { getCoachingSessions } from "./actions";
import { SessionCard } from "@/components/portal/coaching-historikk/session-card";
import { isStaff } from "@/lib/portal/rbac";
import { requirePortalUser } from "@/lib/portal/auth";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

export default async function CoachingHistorikkPage() {
  const [user, sessions] = await Promise.all([
    requirePortalUser(),
    getCoachingSessions(),
  ]);

  const canGenerateAI = isStaff(user?.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-snow)]">Coachinghistorikk</h1>
        <Link
          href="/portal/bookinger/ny"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-gold)] text-white hover:brightness-110 transition-all cursor-pointer"
          style={{ boxShadow: "0 4px 12px rgba(184,151,92,0.25)" }}
        >
          <Plus className="w-4 h-4" />
          Book coaching
        </Link>
      </div>

      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-snow)]">
            Alle sesjoner
          </h2>
          <span className="text-xs text-[var(--color-ink-40)]">
            {sessions.length} sesjoner
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)]">
            <BookOpen className="w-10 h-10 text-[var(--color-ink-40)] mb-3" />
            <p className="text-sm text-[var(--color-ink-40)]">
              Ingen coachingsesjoner ennå.
            </p>
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
