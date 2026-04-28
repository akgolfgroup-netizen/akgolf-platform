"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { HistorikkHero } from "./historikk-hero";
import { FilterRow } from "./filter-row";
import { SessionRow } from "./session-row";
import type { TimelineSession, FilterType } from "./timeline-types";
import { accent, monoFont } from "./styles";

interface Props {
  sessions: TimelineSession[];
}

function classify(s: TimelineSession): FilterType {
  const tags = [
    ...(s.techniquesCovered ?? []),
    s.primaryFocus ?? "",
    s.secondaryFocus ?? "",
  ]
    .join(" ")
    .toLowerCase();
  if ((s.videoUrls?.length ?? 0) > 0 || tags.includes("video")) return "video";
  if (tags.includes("trackman") || tags.includes("test") || tags.includes("tpi")) return "test";
  if (tags.includes("turnering") || tags.includes("on-course")) return "tournament";
  return "individual";
}

export function HistorikkClientV2({ sessions }: Props) {
  const [filter, setFilter] = useState<FilterType>("alle");

  const counts = useMemo<Record<FilterType, number>>(() => {
    const c: Record<FilterType, number> = {
      alle: sessions.length,
      individual: 0,
      video: 0,
      test: 0,
      tournament: 0,
    };
    for (const s of sessions) {
      const k = classify(s);
      c[k] += 1;
    }
    return c;
  }, [sessions]);

  const filtered = useMemo(() => {
    if (filter === "alle") return sessions;
    return sessions.filter((s) => classify(s) === filter);
  }, [sessions, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, { label: string; sessions: TimelineSession[] }>();
    for (const s of filtered) {
      const d = new Date(s.sessionDate);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
      const label = format(d, "MMMM yyyy", { locale: nb });
      const g = map.get(key) ?? { label, sessions: [] };
      g.sessions.push(s);
      map.set(key, g);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] > b[0] ? -1 : 1));
  }, [filtered]);

  const last90 = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
    return sessions.filter((s) => new Date(s.sessionDate).getTime() >= cutoff).length;
  }, [sessions]);

  const totalMinutes = useMemo(
    () => sessions.reduce((acc, s) => acc + (s.durationMinutes ?? 60), 0),
    [sessions],
  );
  const notesCount = sessions.filter(
    (s) => (s.studentNotes && s.studentNotes.length > 0) || (s.instructorNotes && s.instructorNotes.length > 0),
  ).length;
  const primaryCoach = sessions[0]?.instructorName ?? null;

  return (
    <div
      className="rounded-[24px] p-7 lg:p-9"
      style={{ background: "#0A1F18", minHeight: "calc(100vh - 120px)" }}
    >
      <header className="mb-6">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: accent, fontFamily: monoFont }}
        >
          / Coaching · historikk
        </div>
        <h1 className="mt-2 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[48px]">
          {sessions.length === 0 ? "Klar for forste okt." : "Hele reisen din."}
        </h1>
        <p className="mt-3 max-w-[60ch] text-[14px] leading-[1.6] text-white/65">
          {sessions.length} okter logget. Filtrer pa type, klikk en okt for full notat, video og
          malinger.
        </p>
      </header>

      <HistorikkHero
        totalSessions={sessions.length}
        last90={last90}
        totalMinutes={totalMinutes}
        notesCount={notesCount}
        primaryCoach={primaryCoach}
      />

      {sessions.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <FilterRow active={filter} onChange={setFilter} counts={counts} />

          <div
            className="relative ml-8 border-l pl-6"
            style={{ borderColor: "rgba(255,255,255,0.10)" }}
          >
            {groups.map(([key, group]) => (
              <section key={key} className="space-y-3">
                <div
                  className="-ml-[56px] mt-6 mb-3.5 flex items-center gap-3 first:mt-0"
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: accent, boxShadow: "0 0 10px rgba(209,248,67,0.50)" }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: accent, fontFamily: monoFont }}
                  >
                    {group.label} · {group.sessions.length} {group.sessions.length === 1 ? "okt" : "okter"}
                  </span>
                </div>
                <div className="space-y-3">
                  {group.sessions.map((s) => (
                    <SessionRow key={s.id} session={s} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
      style={{
        background: "#0D2E23",
        border: "1px solid #1a4a3a",
        borderRadius: 16,
      }}
    >
      <div
        className="mb-4 grid h-12 w-12 place-items-center rounded-xl"
        style={{ background: "rgba(209,248,67,0.10)", color: "#D1F843" }}
      >
        <BookOpen className="h-6 w-6" />
      </div>
      <p className="max-w-md text-sm text-white/65">
        Ingen coaching-okter logget enna. Book din forste okt for a komme i gang.
      </p>
      <Link
        href="/portal/bookinger/ny"
        className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-opacity hover:opacity-90"
        style={{ background: "#D1F843", color: "#0A1F18" }}
      >
        <Plus className="h-3.5 w-3.5" />
        Book forste okt
      </Link>
    </div>
  );
}
