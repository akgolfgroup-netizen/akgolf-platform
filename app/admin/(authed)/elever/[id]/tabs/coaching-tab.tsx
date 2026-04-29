"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { MessageSquare, Star, FileText } from "lucide-react";
import { McCard, McCardHeader, McEmpty, McPill } from "@/components/admin/mc-v2";
import type { getStudentProfile } from "../actions";

type Profile = NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>;

export function CoachingTab({ profile }: { profile: Profile }) {
  const sessions = profile.CoachingSession;

  return (
    <div className="pt-5 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Coaching-økter" value={`${sessions.length}`} />
        <Stat label="Snitt vurdering" value="7.2" />
        <Stat label="Aktive mål" value={`${profile.Goal.filter((g) => g.status === "ACTIVE").length}`} />
        <Stat label="Plan" value={profile.ActivePlan ? "Aktiv" : "Ingen"} />
      </div>

      <McCard>
        <McCardHeader title="Coaching-notater" sub="siste 20 økter" />
        {sessions.length === 0 ? (
          <McEmpty title="Ingen notater" body="Ingen coaching-økter registrert ennå." />
        ) : (
          <div className="flex flex-col">
            {sessions.map((s, i) => (
              <div
                key={s.id}
                className="grid items-start gap-3 py-3"
                style={{
                  gridTemplateColumns: "32px 1fr auto",
                  borderBottom: i === sessions.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span
                  className="w-8 h-8 rounded-md grid place-items-center shrink-0 mt-0.5"
                  style={{ background: "rgba(175,82,222,0.12)", color: "#C896E8" }}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="text-[13px] font-medium text-white">{s.primaryFocus ?? "Coaching-økt"}</div>
                  <div className="font-mono text-[11px] text-white/45 mt-0.5">
                    {format(new Date(s.sessionDate), "EEEE d. MMM · HH:mm", { locale: nb })}
                  </div>
                  {s.instructorNotes && (
                    <p className="m-0 mt-1.5 text-[12px] text-white/50 leading-relaxed line-clamp-2">{s.instructorNotes}</p>
                  )}
                  {s.aiSummary && (
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#C896E8]">
                      <FileText className="w-3 h-3" /> AI-oppsummering
                    </div>
                  )}
                </div>
                {s.progressRating && (
                  <div className="flex items-center gap-1 text-[12px] text-white/50">
                    <Star className="w-3 h-3 text-[#E8B967]" />
                    {s.progressRating}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </McCard>
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
