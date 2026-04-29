"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Dumbbell, MessageSquare, Trophy, AlertTriangle, Calendar } from "lucide-react";
import { McCard, McCardHeader, McPill } from "@/components/admin/mc-v2";
import type { getStudentProfile } from "../actions";

type Profile = NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>;

export function ProfilTab({ profile }: { profile: Profile }) {
  const sgPerRound = 0.42; // mock
  const streak = 14; // mock

  const activities = [
    ...profile.Booking.slice(0, 4).map((b) => ({
      id: `b-${b.id}`,
      date: format(new Date(b.startTime), "d MMM · HH:mm", { locale: nb }),
      icon: <Dumbbell className="w-3.5 h-3.5" />,
      iconBg: "rgba(209,248,67,0.12)",
      iconColor: "#D1F843",
      title: (b.ServiceType as { name?: string })?.name ?? "Coaching-økt",
      meta: extractInstructorName(b.Instructor) ?? "—",
      tag: "Fullført",
      tagTone: "success" as const,
    })),
    ...profile.CoachingSession.slice(0, 2).map((cs) => ({
      id: `cs-${cs.id}`,
      date: format(new Date(cs.sessionDate), "d MMM · HH:mm", { locale: nb }),
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      iconBg: "rgba(175,82,222,0.14)",
      iconColor: "#C896E8",
      title: cs.primaryFocus ? `Notat: ${cs.primaryFocus}` : "Coach-notat",
      meta: cs.instructorNotes?.slice(0, 80) ?? "—",
      tag: "Anders K.",
      tagTone: undefined,
    })),
  ].slice(0, 6);

  const activeGoals = profile.Goal.filter((g) => g.status === "ACTIVE").slice(0, 3);

  return (
    <div className="pt-5 space-y-5">
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBlock label="HCP" value={profile.handicap !== null ? profile.handicap.toFixed(1) : "—"} sub="↘ −0.6" subTone="up" />
        <StatBlock label="SG / runde" value={`+${sgPerRound.toFixed(2)}`} valueColor="#6FCBA1" />
        <StatBlock label="Aktivitet 30d" value={`${profile.sessionsThisMonth}`} sub="økter" />
        <StatBlock label="Streak" value={`${streak}d`} valueColor="#D1F843" />
      </div>

      {/* HCP + Mål */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <McCard>
          <McCardHeader title="HCP-utvikling · 12 måneder" sub={`${profile.HandicapEntry.length} oppdateringer`} />
          <HcpChart entries={profile.HandicapEntry} />
        </McCard>
        <McCard>
          <McCardHeader title="Aktive mål" sub={`${activeGoals.length} av ${profile.Goal.length}`} />
          {activeGoals.length === 0 ? (
            <p className="text-[12px] text-white/45 py-2">Ingen aktive mål.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {activeGoals.map((g) => {
                const progress = g.targetValue && g.targetValue > 0 ? Math.min(100, Math.round(((g.currentValue ?? 0) / g.targetValue) * 100)) : 0;
                return (
                  <div key={g.id} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="font-medium text-white">{g.title}</span>
                      <span className="font-mono font-semibold" style={{ color: "#D1F843" }}>{progress}%</span>
                    </div>
                    <div className="h-1.5 rounded overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded" style={{ width: `${progress}%`, background: "#D1F843" }} />
                    </div>
                    {g.targetDate && <div className="font-mono text-[10px] tracking-[0.06em] mt-1.5 text-white/40">Deadline {format(new Date(g.targetDate), "d. MMM", { locale: nb })}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </McCard>
      </div>

      {/* Aktivitet + Sidepanel */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <McCard>
          <McCardHeader title="Siste aktivitet" sub="14 dager" />
          {activities.length === 0 ? (
            <p className="text-[12px] text-white/45 py-2">Ingen aktivitet enda.</p>
          ) : (
            <div className="flex flex-col">
              {activities.map((a, i) => (
                <div key={a.id} className="grid items-center gap-3 py-3" style={{ gridTemplateColumns: "90px 32px 1fr auto", borderBottom: i === activities.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="font-mono text-[11px] tracking-[0.06em] text-white/45">{a.date}</span>
                  <span className="w-7 h-7 rounded-md grid place-items-center" style={{ background: a.iconBg, color: a.iconColor }}>{a.icon}</span>
                  <div>
                    <div className="text-[13px] font-medium text-white">{a.title}</div>
                    <div className="font-mono text-[11px] mt-0.5 tracking-[0.04em] truncate text-white/45">{a.meta}</div>
                  </div>
                  {a.tagTone ? <McPill tone={a.tagTone}>{a.tag}</McPill> : <span className="text-[11px] text-white/45">{a.tag}</span>}
                </div>
              ))}
            </div>
          )}
        </McCard>

        <div className="flex flex-col gap-4">
          <SignalCard variant="up" icon={<Trophy className="w-3.5 h-3.5" />} title="3 PR siste 30d" body="Foreslå turneringsmål — spilleren er klar for å konkurrere." />
          <SignalCard variant="warn" icon={<AlertTriangle className="w-3.5 h-3.5" />} title="Around-green svakest" body="Chip- og pitch-volum kan økes. Anbefal short-game-blokk neste 2 uker." />
          {profile.UpcomingBooking.length > 0 && (
            <McCard>
              <McCardHeader title="Neste opp" sub="planlagt" />
              <div className="flex flex-col gap-2">
                {profile.UpcomingBooking.slice(0, 3).map((b) => (
                  <div key={b.id} className="flex gap-2.5 items-center py-2 px-3 rounded-md" style={{ background: "rgba(209,248,67,0.08)", borderLeft: "3px solid #D1F843" }}>
                    <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#D1F843" }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-white">{format(new Date(b.startTime), "EEEE d. MMM · HH:mm", { locale: nb })}</div>
                      <div className="font-mono text-[11px] truncate text-white/45">{(b.ServiceType as { name?: string })?.name ?? "Økt"} · {extractInstructorName(b.Instructor) ?? "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </McCard>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatBlock({ label, value, sub, subTone, valueColor }: { label: string; value: string; sub?: string; subTone?: "up" | "down" | "muted"; valueColor?: string }) {
  return (
    <div className="rounded-xl px-3.5 py-3" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">{label}</div>
      <div className="text-[22px] font-bold mt-1 tracking-[-0.02em] tabular-nums" style={{ color: valueColor ?? "#fff" }}>
        {value}
        {sub && <span className="text-[11px] font-medium ml-1" style={{ color: subTone === "up" ? "#6FCBA1" : subTone === "down" ? "#F49283" : "rgba(255,255,255,0.5)" }}>{sub}</span>}
      </div>
    </div>
  );
}

function SignalCard({ variant, icon, title, body }: { variant: "up" | "warn" | "danger"; icon: React.ReactNode; title: string; body: string }) {
  const styleMap = {
    up: { bg: "rgba(209,248,67,0.08)", border: "rgba(209,248,67,0.20)", left: "#D1F843", iconColor: "#D1F843" },
    warn: { bg: "rgba(196,138,50,0.08)", border: "rgba(196,138,50,0.20)", left: "#E8B967", iconColor: "#E8B967" },
    danger: { bg: "rgba(184,66,51,0.08)", border: "rgba(184,66,51,0.20)", left: "#F49283", iconColor: "#F49283" },
  };
  const s = styleMap[variant];
  return (
    <div className="rounded-xl p-3.5" style={{ background: s.bg, border: `1px solid ${s.border}`, borderLeft: `3px solid ${s.left}` }}>
      <div className="flex items-center gap-2 mb-1.5">
        <span style={{ color: s.iconColor }}>{icon}</span>
        <h4 className="m-0 text-[13px] font-semibold text-white">{title}</h4>
      </div>
      <p className="m-0 text-[12px] leading-relaxed text-white/60">{body}</p>
    </div>
  );
}

function HcpChart({ entries }: { entries: { date: Date | string; handicapIndex: number }[] }) {
  if (entries.length < 2) return <div className="text-[12px] py-8 text-center text-white/40">Ikke nok HCP-historikk enda.</div>;
  const W = 720, H = 160;
  const values = entries.map((e) => e.handicapIndex);
  const min = Math.min(...values) - 0.5;
  const max = Math.max(...values) + 0.5;
  const range = Math.max(0.1, max - min);
  const points = entries.map((e, i) => {
    const x = (i / Math.max(1, entries.length - 1)) * W;
    const y = ((max - e.handicapIndex) / range) * (H - 40) + 10;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const area = `${points} ${W},${H} 0,${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 160 }}>
      <line x1="0" y1="40" x2={W} y2="40" stroke="rgba(255,255,255,0.05)" />
      <line x1="0" y1="80" x2={W} y2="80" stroke="rgba(255,255,255,0.05)" />
      <line x1="0" y1="120" x2={W} y2="120" stroke="rgba(255,255,255,0.05)" />
      <polygon points={area} fill="rgba(209,248,67,0.08)" />
      <polyline points={points} fill="none" stroke="#D1F843" strokeWidth="2" />
      <text x="4" y="44" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="JetBrains Mono">{max.toFixed(1)}</text>
      <text x="4" y="124" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="JetBrains Mono">{min.toFixed(1)}</text>
      <text x="0" y="155" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="JetBrains Mono">{format(new Date(entries[0].date), "MMM yy", { locale: nb }).toUpperCase()}</text>
      <text x={W} y="155" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{format(new Date(entries[entries.length - 1].date), "MMM yy", { locale: nb }).toUpperCase()}</text>
    </svg>
  );
}

function extractInstructorName(instructor: unknown): string | null {
  if (!instructor || typeof instructor !== "object") return null;
  const inst = instructor as { User?: { name?: string | null } | null };
  return inst.User?.name ?? null;
}
