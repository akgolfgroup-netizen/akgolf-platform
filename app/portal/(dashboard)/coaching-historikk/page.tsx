import { getCoachingSessions } from "./actions";
import { SessionCard } from "@/components/portal/coaching-historikk/session-card";
import { Topbar } from "@/components/portal/layout/topbar";
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
    <div>
      <Topbar title="Coachinghistorikk" />
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <Link
            href="/bookinger/ny"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))",
              color: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(184,151,92,0.25)",
            }}
          >
            <Plus className="w-5 h-5" />
            Book coaching
          </Link>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--color-snow)]">
            Alle sesjoner
          </h2>
          <span className="text-xs text-[var(--color-gold-muted)]">
            {sessions.length} sesjoner
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-10 h-10 text-[var(--color-border)] mb-3" />
            <p className="text-sm text-[var(--color-gold-muted)]">
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
