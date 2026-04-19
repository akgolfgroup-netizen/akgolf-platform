import { getCoachingSessions } from "./actions";
import { SessionCard } from "@/components/portal/coaching-historikk/session-card";
import { isStaff } from "@/lib/portal/rbac";
import { requirePortalUser } from "@/lib/portal/auth";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { MonoLabel } from "@/components/portal/patterns";

type RawSession = Awaited<ReturnType<typeof getCoachingSessions>>[number];

type MappedSession = RawSession & {
  student: { name: string | null; image: string | null };
  instructor: {
    user: { name: string | null };
    title: string | null;
  };
};

function groupByMonth(sessions: MappedSession[]) {
  const groups = new Map<string, { label: string; sessions: MappedSession[] }>();
  for (const s of sessions) {
    const d = new Date(s.sessionDate);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const label = format(d, "MMMM yyyy", { locale: nb });
    const g = groups.get(key) ?? { label, sessions: [] };
    g.sessions.push(s);
    groups.set(key, g);
  }
  return Array.from(groups.entries()).sort((a, b) => (a[0] > b[0] ? -1 : 1));
}

export default async function CoachingHistorikkPage() {
  const [user, rawSessions] = await Promise.all([
    requirePortalUser(),
    getCoachingSessions(),
  ]);

  const sessions: MappedSession[] = rawSessions.map((s) => ({
    ...s,
    student: { name: s.User?.name ?? null, image: s.User?.image ?? null },
    instructor: {
      user: { name: s.Instructor?.User?.name ?? null },
      title: s.Instructor?.title ?? null,
    },
  }));

  const canGenerateAI = isStaff(user?.role);
  const groups = groupByMonth(sessions);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <MonoLabel size="xs" uppercase className="mb-2 block text-outline">
          Coaching
        </MonoLabel>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          Coaching-historikk
        </h1>
        <p className="mt-1 text-on-surface-variant">
          Dine coachingsesjoner og oppfølging — komplett oversikt med AI-genererte oppsummeringer.
        </p>
        <div className="mt-4">
          <Link
            href="/portal/bookinger/ny"
            className="inline-flex h-11 items-center gap-2 rounded-[20px] bg-accent-cta px-6 text-[12px] font-bold text-accent-cta-text shadow-sm transition-opacity hover:opacity-90"
          >
            Book coaching
          </Link>
        </div>
      </div>

      <div className="max-w-3xl">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-px w-6 bg-surface-container-high" />
          <MonoLabel size="xs" uppercase className="text-outline">
            Alle sesjoner · {sessions.length}
          </MonoLabel>
        </div>

        {sessions.length === 0 ? (
          <div className="rounded-xl bg-white p-6 shadow-card">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <p className="text-sm text-outline">
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
          <div className="space-y-8">
            {groups.map(([key, group]) => (
              <section key={key} className="space-y-3">
                <div className="flex items-center gap-3">
                  <MonoLabel size="sm" uppercase className="text-grey-500">
                    {group.label}
                  </MonoLabel>
                  <span className="h-px flex-1 bg-grey-100" />
                  <MonoLabel size="xs" className="text-grey-400">
                    {group.sessions.length}
                  </MonoLabel>
                </div>
                <div className="space-y-3">
                  {group.sessions.map((s) => (
                    <SessionCard
                      key={s.id}
                      session={s}
                      canGenerateAI={canGenerateAI}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
