"use client";

import { Card, CardHeader, Empty } from "@/components/admin/coachhq-dark";
import type { getStudentProfile } from "../actions";

type Profile = NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>;

export function StatistikkTab({ profile }: { profile: Profile }) {
  const rounds = profile.Booking.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="pt-5 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Total økter" value={`${profile.totalSessions}`} />
        <Stat label="Fullført" value={`${rounds}`} />
        <Stat label="Oppmøte" value={`${profile.attendanceRate}%`} />
        <Stat label="HCP" value={profile.handicap !== null ? profile.handicap.toFixed(1) : "—"} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Strokes Gained · 30d" sub="vs. HCP-snitt" />
          <SgRow cat="Off the tee" value={0.18} />
          <SgRow cat="Approach" value={0.08} />
          <SgRow cat="Around green" value={-0.1} />
          <SgRow cat="Putting" value={0.26} />
          <div className="mt-3 pt-3 flex justify-between text-[12px]" style={{ borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
            <span className="text-white/45">Total SG</span>
            <span className="font-mono font-semibold text-[#6FCBA1]">+0.42 / runde</span>
          </div>
        </Card>

        <Card>
          <CardHeader title="HCP-historikk" sub={`${profile.HandicapEntry.length} oppdateringer`} />
          {profile.HandicapEntry.length < 2 ? (
            <Empty title="For lite data" body="Ikke nok HCP-registreringer for å vise trend." />
          ) : (
            <div className="space-y-2">
              {profile.HandicapEntry.slice(-5).map((h) => (
                <div key={h.id} className="flex justify-between text-[12px] py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-white/60">{new Date(h.date).toLocaleDateString("nb-NO")}</span>
                  <span className="font-mono text-white/80">{h.handicapIndex.toFixed(1)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
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

function SgRow({ cat, value }: { cat: string; value: number }) {
  const pos = value >= 0;
  const widthPct = Math.min(48, Math.max(2, Math.abs(value) * 60));
  return (
    <div className="grid items-center py-2" style={{ gridTemplateColumns: "100px 1fr 60px", gap: 12 }}>
      <span className="text-[12px] font-medium text-white/60">{cat}</span>
      <div className="relative h-2 rounded" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="absolute top-[-2px] bottom-[-2px] left-1/2 w-px" style={{ background: "rgba(255,255,255,0.2)" }} />
        <div className="absolute top-0 bottom-0 rounded" style={{ background: pos ? "#6FCBA1" : "#F49283", left: pos ? "50%" : undefined, right: pos ? undefined : "50%", width: `${widthPct}%` }} />
      </div>
      <span className="font-mono text-[12px] font-semibold text-right tabular-nums" style={{ color: pos ? "#6FCBA1" : "#F49283" }}>
        {pos ? "+" : "−"}{Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}
