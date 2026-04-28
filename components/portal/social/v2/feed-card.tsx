"use client";

import { Heart, MessageCircle, Bookmark, Sparkles } from "lucide-react";
import { cardStyle, monoFont, accent } from "./styles";
import type { SosialtFriend } from "@/app/portal/(dashboard)/sosialt/sosialt-client";

interface Props {
  friends: SosialtFriend[];
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function ActivityFeedPlaceholder({ friends }: Props) {
  // Real feed kommer i Sprint 2. Vis a) en coach-pin-info b) liste over venner som "har vært aktive nylig".
  return (
    <div className="flex flex-col gap-3">
      <article style={cardStyle} className="px-5 py-[18px] text-white">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-full text-[12px] font-bold"
            style={{
              background: "rgba(175,82,222,0.20)",
              color: "#C99CF3",
              border: "1px solid rgba(175,82,222,0.30)",
            }}
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <div className="text-[13px] font-bold tracking-[-0.005em] text-white">
              AI-Coach · automatisk innsikt
            </div>
            <div
              className="mt-0.5 text-[10px] uppercase tracking-[0.06em] text-white/50"
              style={{ fontFamily: monoFont }}
            >
              Privat melding · oppdateres ukentlig
            </div>
          </div>
          <span
            className="rounded px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{
              fontFamily: monoFont,
              background: "rgba(175,82,222,0.20)",
              color: "#C99CF3",
            }}
          >
            COACH PIN
          </span>
        </div>
        <p className="text-[13px] leading-[1.6] text-white/85">
          Felles aktivitetsfeed kommer i Sprint 2. Du vil snart kunne dele runder, video og PR-er
          med venner og grupper du velger. Inntil videre — bygg vennelisten og se hvem som er aktive
          rett ved siden av.
        </p>
        <div
          className="mt-3 flex gap-4 border-t pt-2.5"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
        >
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/55 transition-colors hover:text-white"
          >
            <Heart className="h-3.5 w-3.5" />
            Takk
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/55 transition-colors hover:text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Svar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/55 transition-colors hover:text-white"
          >
            <Bookmark className="h-3.5 w-3.5" />
            Lagre
          </button>
        </div>
      </article>

      {friends.slice(0, 3).map((f) => (
        <article key={f.id} style={cardStyle} className="px-5 py-[18px] text-white">
          <div className="mb-2.5 flex items-center gap-2.5">
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-[12px] font-bold"
              style={{
                background: "rgba(107,177,255,0.18)",
                color: "#6BB1FF",
              }}
            >
              {getInitials(f.name)}
            </span>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-white">{f.name}</div>
              <div
                className="mt-0.5 text-[10px] uppercase tracking-[0.06em] text-white/50"
                style={{ fontFamily: monoFont }}
              >
                Venn ·{" "}
                {f.latestHandicap != null ? `HCP ${f.latestHandicap.toFixed(1)}` : "ingen HCP"}
              </div>
            </div>
            {f.latestHandicap != null ? (
              <span
                className="rounded px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em]"
                style={{
                  fontFamily: monoFont,
                  background: "rgba(42,125,90,0.25)",
                  color: "#6FCBA1",
                }}
              >
                HCP {f.latestHandicap.toFixed(1)}
              </span>
            ) : null}
          </div>
          <p className="text-[13px] leading-[1.6] text-white/70">
            {f.lastActiveAt
              ? "Var aktiv i portalen nylig. Send melding eller utfordre til en match."
              : "Ikke aktiv enna. Send en henting via meldinger."}
          </p>
        </article>
      ))}

      {friends.length === 0 ? (
        <div
          className="rounded-xl border-2 border-dashed px-5 py-8 text-center"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <p className="text-[13px] text-white/65">
            Bygg vennelisten din for a se aktivitet her. Klikk{" "}
            <span style={{ color: accent }}>Legg til venn</span> oppe for a søke.
          </p>
        </div>
      ) : null}
    </div>
  );
}
