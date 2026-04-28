"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ArrowRight, Paperclip, User, Video, FileText, Sparkles } from "lucide-react";
import { accent, cardStyle, monoFont } from "./styles";
import type { TimelineSession } from "./timeline-types";

interface Props {
  session: TimelineSession;
}

function classifyType(s: TimelineSession): {
  type: "individual" | "video" | "test" | "tournament";
  label: string;
} {
  const tags = [
    ...(s.techniquesCovered ?? []),
    s.primaryFocus ?? "",
    s.secondaryFocus ?? "",
  ]
    .join(" ")
    .toLowerCase();
  if ((s.videoUrls ?? []).length > 0 || tags.includes("video")) {
    return { type: "video", label: "Video-analyse" };
  }
  if (tags.includes("trackman") || tags.includes("test") || tags.includes("tpi")) {
    return { type: "test", label: "Test" };
  }
  if (tags.includes("turnering") || tags.includes("tournament") || tags.includes("on-course")) {
    return { type: "tournament", label: "Turnering" };
  }
  return { type: "individual", label: "Individual" };
}

const TYPE_STYLE: Record<
  ReturnType<typeof classifyType>["type"],
  { bg: string; color: string }
> = {
  individual: { bg: "rgba(209,248,67,0.18)", color: accent },
  test: { bg: "rgba(107,177,255,0.18)", color: "#6BB1FF" },
  video: { bg: "rgba(175,82,222,0.18)", color: "#C99CF3" },
  tournament: { bg: "rgba(232,185,103,0.20)", color: "#E8B967" },
};

export function SessionRow({ session }: Props) {
  const date = new Date(session.sessionDate);
  const { type, label } = classifyType(session);
  const typeStyle = TYPE_STYLE[type];
  const hasAi = session.aiKeyPoints.length > 0;
  const attachmentCount =
    (session.videoUrls?.length ?? 0) + (hasAi ? 1 : 0);
  const summary =
    session.aiKeyPoints[0] ??
    session.studentNotes ??
    session.instructorNotes ??
    "Ingen notater enna.";

  return (
    <article
      className="relative grid items-center gap-[18px] p-5"
      style={{
        ...cardStyle,
        gridTemplateColumns: "90px 1fr auto",
        borderColor: hasAi ? "rgba(209,248,67,0.30)" : "#1a4a3a",
      }}
    >
      <span
        aria-hidden
        className="absolute h-2 w-2 rounded-full"
        style={{
          left: "-29px",
          top: 24,
          background: hasAi ? accent : "rgba(255,255,255,0.20)",
          border: "2px solid #0A1F18",
          boxShadow: hasAi
            ? "0 0 10px rgba(209,248,67,0.50)"
            : "0 0 0 1px rgba(255,255,255,0.10)",
        }}
      />

      <div
        className="border-r pr-4"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="text-[22px] font-bold leading-none tracking-[-0.03em] text-white">
          {format(date, "d")}
        </div>
        <div
          className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/50"
          style={{ fontFamily: monoFont }}
        >
          {format(date, "MMM", { locale: nb })}
        </div>
        <div
          className="mt-2 text-[11px] text-white/65"
          style={{ fontFamily: monoFont }}
        >
          {format(date, "HH:mm")}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
          <span
            className="rounded px-1.5 py-[3px] text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{
              background: typeStyle.bg,
              color: typeStyle.color,
              fontFamily: monoFont,
            }}
          >
            {label}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-white/50">
            <User className="h-3 w-3" />
            {session.instructorName ?? "Coach"}
            {session.durationMinutes ? ` · ${session.durationMinutes} min` : ""}
          </span>
          {hasAi ? (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.10em]"
              style={{
                background: "rgba(209,248,67,0.10)",
                color: accent,
                fontFamily: monoFont,
              }}
            >
              <Sparkles className="h-2.5 w-2.5" />
              AI-oppsummert
            </span>
          ) : null}
        </div>
        <div className="text-[15px] font-bold tracking-[-0.005em] text-white">
          {session.primaryFocus ?? "Coachingsesjon"}
        </div>
        <div className="mt-1 text-[12.5px] leading-[1.5] text-white/65">{summary}</div>

        {(session.aiFocusAreas.length > 0 || session.techniquesCovered.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(session.aiFocusAreas.length > 0
              ? session.aiFocusAreas
              : session.techniquesCovered
            )
              .slice(0, 4)
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.10em] text-white/65"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.06)",
                    fontFamily: monoFont,
                  }}
                >
                  {tag}
                </span>
              ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <button
          type="button"
          aria-label="Apne okt"
          className="grid h-8 w-8 place-items-center rounded-lg border text-white/85 transition-colors hover:bg-white/5"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        {attachmentCount > 0 ? (
          <span
            className="inline-flex items-center gap-1 text-[10px] text-white/50"
            style={{ fontFamily: monoFont }}
          >
            {type === "video" || (session.videoUrls?.length ?? 0) > 0 ? (
              <Video className="h-2.5 w-2.5" />
            ) : hasAi ? (
              <FileText className="h-2.5 w-2.5" />
            ) : (
              <Paperclip className="h-2.5 w-2.5" />
            )}
            {attachmentCount} vedlegg
          </span>
        ) : null}
      </div>
    </article>
  );
}
