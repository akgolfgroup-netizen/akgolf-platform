import { getCoachingSessions } from "./actions";
import { SessionCard } from "@/components/portal/coaching-historikk/session-card";
import { isStaff } from "@/lib/portal/rbac";
import { requirePortalUser } from "@/lib/portal/auth";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { HeroHeading, GlassCard, Shimmer } from "@/components/portal/premium";

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
      <HeroHeading
        label="Coaching"
        title={
          <>
            Coaching-
            <span className="font-serif italic text-[var(--color-primary)] font-normal">
              historikk
            </span>
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description="Dine coachingsesjoner og oppfølging — komplett oversikt med AI-genererte oppsummeringer."
        actions={
          <Link
            href="/portal/bookinger/ny"
            className="relative h-11 px-6 rounded-full bg-[var(--color-accent-cta)] text-[var(--color-grey-900)] text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(209,248,67,0.4)] hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] transition-shadow overflow-hidden group"
          >
            <Shimmer />
            <span className="relative z-10">Book coaching</span>
          </Link>
        }
      />

      <div className="max-w-3xl">
        <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase mb-4 flex items-center gap-2">
          <span className="w-6 h-px bg-[var(--color-muted)]" />
          Alle sesjoner · {sessions.length}
        </p>

        {sessions.length === 0 ? (
          <GlassCard variant="light" padding="lg">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <BookOpen className="h-6 w-6" />
              </div>
              <p className="text-sm text-[var(--color-muted)]">
                Ingen coachingsesjoner ennå.
              </p>
              <Link
                href="/portal/bookinger/ny"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[var(--color-primary)]/90"
              >
                <Plus className="h-3.5 w-3.5" />
                Book din første sesjon
              </Link>
            </div>
          </GlassCard>
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
