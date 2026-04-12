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
    instructor: {
      user: { name: s.Instructor?.User?.name ?? null },
      title: s.Instructor?.title ?? null,
    },
  }));

  const canGenerateAI = isStaff(user?.role);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-portal-muted mb-2">
          Coaching
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-portal-text">
          Coaching-historikk
        </h1>
        <p className="text-portal-secondary mt-1">
          Dine coachingsesjoner og oppfølging — komplett oversikt med AI-genererte oppsummeringer.
        </p>
        <div className="mt-4">
          <Link
            href="/portal/bookinger/ny"
            className="h-11 px-6 rounded-[20px] bg-accent-cta text-accent-cta-text text-[12px] font-bold inline-flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
          >
            Book coaching
          </Link>
        </div>
      </div>

      <div className="max-w-3xl">
        <p className="text-[10px] font-bold tracking-[0.22em] text-portal-muted uppercase mb-4 flex items-center gap-2">
          <span className="w-6 h-px bg-portal-muted" />
          Alle sesjoner · {sessions.length}
        </p>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <p className="text-sm text-portal-muted">
                Ingen coachingsesjoner ennå.
              </p>
              <Link
                href="/portal/bookinger/ny"
                className="mt-4 inline-flex items-center gap-2 rounded-[20px] bg-primary px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-primary-alt"
              >
                <Plus className="h-3.5 w-3.5" />
                Book din første sesjon
              </Link>
            </div>
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
