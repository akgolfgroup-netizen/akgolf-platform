import { getCoachingSessions } from "./actions";
import { SessionCard } from "@/components/portal/coaching-historikk/session-card";
import { isStaff } from "@/lib/portal/rbac";
import { requirePortalUser } from "@/lib/portal/auth";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { PortalHeader, PortalCard } from "@/components/portal/premium";

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
    <div className="space-y-6">
      <PortalHeader
        label="Portal"
        title="Coaching-historikk"
        description="Dine coachingsesjoner og oppfølging — komplett oversikt med AI-genererte oppsummeringer."
        actions={
          <Link
            href="/portal/bookinger/ny"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-alt)]"
          >
            <Plus className="h-4 w-4" />
            Book coaching
          </Link>
        }
      />

      <div className="max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Alle sesjoner
          </h2>
          <span className="text-xs text-[var(--color-muted)]">
            {sessions.length} sesjoner
          </span>
        </div>

        {sessions.length === 0 ? (
          <PortalCard
            padding="lg"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <BookOpen className="h-6 w-6" />
            </div>
            <p className="text-sm text-[var(--color-muted)]">
              Ingen coachingsesjoner ennå.
            </p>
            <Link
              href="/portal/bookinger/ny"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-alt)]"
            >
              <Plus className="h-4 w-4" />
              Book din første sesjon
            </Link>
          </PortalCard>
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
