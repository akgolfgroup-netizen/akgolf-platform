"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Dumbbell, Clock, TrendingUp } from "lucide-react";
import { Card, CardHeader, Empty } from "@/components/admin/coachhq-dark";
import type { getStudentProfile } from "../actions";

type Profile = NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>;

export function TreningTab({ profile }: { profile: Profile }) {
  const sessions = profile.CoachingSession.slice(0, 10);

  return (
    <div className="pt-5 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Økter totalt" value={`${profile.totalSessions}`} />
        <Stat label="Denne måned" value={`${profile.sessionsThisMonth}`} />
        <Stat label="Oppmøte" value={`${profile.attendanceRate}%`} />
        <Stat label="HCP-trend" value={profile.handicap !== null ? profile.handicap.toFixed(1) : "—"} />
      </div>

      <Card>
        <CardHeader title="Coaching-økter" sub="siste 20" />
        {sessions.length === 0 ? (
          <Empty title="Ingen økter" body="Ingen coaching-økter registrert ennå." />
        ) : (
          <div className="flex flex-col">
            {sessions.map((s, i) => (
              <div
                key={s.id}
                className="grid items-center gap-3 py-3"
                style={{
                  gridTemplateColumns: "32px 1fr auto",
                  borderBottom: i === sessions.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span className="w-8 h-8 rounded-md grid place-items-center" style={{ background: "rgba(209,248,67,0.10)", color: "#D1F843" }}>
                  <Dumbbell className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="text-[13px] font-medium text-white">{s.primaryFocus ?? "Coaching-økt"}</div>
                  <div className="font-mono text-[11px] text-white/45 mt-0.5">
                    {format(new Date(s.sessionDate), "EEEE d. MMM · HH:mm", { locale: nb })}
                  </div>
                </div>
                {s.progressRating && (
                  <span className="font-mono text-[11px] text-white/50">{s.progressRating}/10</span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl px-3.5 py-3" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">{label}</div>
      <div className="text-[22px] font-bold mt-1 text-white tabular-nums">{value}</div>
    </div>
  );
}
