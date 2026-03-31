import { BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

interface CoachingSessionRow {
  id: string;
  sessionDate: Date;
  primaryFocus: string | null;
  progressRating: number | null;
  User: { name: string | null };
}

interface RecentSessionsProps {
  sessions: CoachingSessionRow[];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-[var(--color-grey-200)]">
        <div className="p-4 border-b border-[var(--color-grey-200)]">
          <h3 className="font-semibold text-[var(--color-grey-900)]">
            Siste coaching-økter
          </h3>
        </div>
        <div className="p-8 text-center">
          <p className="text-[var(--color-grey-400)]">
            Ingen coaching-økter registrert enda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-[var(--color-grey-200)]">
      <div className="p-4 border-b border-[var(--color-grey-200)]">
        <h3 className="font-semibold text-[var(--color-grey-900)]">
          Siste coaching-økter
        </h3>
      </div>
      <div className="divide-y divide-[var(--color-grey-200)]">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 hover:bg-[var(--color-grey-100)] transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg p-2 bg-[var(--color-grey-100)]">
                <BookOpen className="h-4 w-4 text-[var(--color-grey-600)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[var(--color-grey-900)] truncate">
                    {session.User.name || "Ukjent spiller"}
                  </p>
                  <span className="text-xs text-[var(--color-grey-500)]">
                    {formatDistanceToNow(session.sessionDate, {
                      addSuffix: true,
                      locale: nb,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {session.primaryFocus && (
                    <span className="text-sm text-[var(--color-grey-400)]">
                      {session.primaryFocus}
                    </span>
                  )}
                  {session.progressRating !== null && (
                    <span className="inline-flex items-center rounded-full bg-[var(--color-grey-100)] px-2 py-0.5 text-xs font-medium text-[var(--color-grey-600)]">
                      {session.progressRating}/10
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
