import {
  Play,
  Sparkles,
  Check,
  AlertTriangle,
  MessageSquare,
  X,
} from "lucide-react";
import type { InfoCell, CheckRow } from "./mock-data";

interface Props {
  feedbackQuote: string;
  aiFlagText: string;
  infoCells: InfoCell[];
  checklist: CheckRow[];
}

export function ApprovalDetail({
  feedbackQuote,
  aiFlagText,
  infoCells,
  checklist,
}: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#1a4a3a] bg-[#0D2E23]">
      <div className="border-b border-[#1a4a3a] px-[22px] py-[18px]">
        <div className="mb-1.5 font-mono text-[10px] tracking-[0.06em] text-white/50">
          VENTER · 18 MIN
        </div>
        <h2 className="m-0 font-inter-tight text-[22px] font-bold leading-tight tracking-[-0.02em] text-white">
          Maria T. har laget video-feedback til Camilla Ruud
        </h2>
        <div className="mt-1 text-[13px] text-white/70">
          Sving-analyse fra økten 28. apr · publiseres til Camilla når du
          godkjenner
        </div>
      </div>

      <div className="flex-1 overflow-auto p-[22px]">
        {/* Video frame */}
        <div
          className="relative mb-[18px] overflow-hidden rounded-xl border border-[#1a4a3a]"
          style={{
            aspectRatio: "16 / 9",
            background: "linear-gradient(135deg, #1a1f1c, #2a3530)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 50%, rgba(209,248,67,0.10), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(0,122,255,0.10), transparent 60%)",
            }}
          />
          <div className="absolute left-[18px] top-[18px] rounded-full border border-accent/30 bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-accent">
            02:14 · 1080p · TRACKMAN
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div
              className="grid h-16 w-16 place-items-center rounded-full border-2 border-accent backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <Play className="h-6 w-6 text-accent" strokeWidth={1.8} />
            </div>
          </div>
          <div className="absolute bottom-[30px] left-[18px] font-mono text-[10px] tracking-[0.06em] text-white/70">
            00:48 / 02:14
          </div>
          <div
            className="absolute bottom-[18px] left-[18px] right-[18px] h-1 overflow-hidden rounded-sm"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <div className="h-full w-[34%] bg-accent" />
          </div>
        </div>

        {/* Feedback block */}
        <div
          className="mb-3.5 rounded-xl border border-l-[3px] border-accent/20 border-l-accent px-4 py-3.5"
          style={{ background: "rgba(209,248,67,0.05)" }}
        >
          <div className="mb-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
            Marias kommentar til Camilla
          </div>
          <p className="m-0 text-[14px] leading-[1.55] text-white">
            {feedbackQuote}
          </p>
        </div>

        {/* AI flag */}
        <div
          className="mb-3.5 flex items-start gap-2.5 rounded-xl border px-3.5 py-3"
          style={{
            background: "rgba(175,82,222,0.06)",
            borderColor: "rgba(175,82,222,0.20)",
          }}
        >
          <div
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md"
            style={{ background: "rgba(175,82,222,0.20)", color: "#C896E8" }}
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
          </div>
          <p className="m-0 text-[12px] leading-[1.5] text-white/85">
            <strong style={{ color: "#C896E8" }}>Coach AI har sjekket:</strong>{" "}
            {aiFlagText}
          </p>
        </div>

        {/* Info grid */}
        <div className="mb-[18px] grid grid-cols-3 gap-2.5">
          {infoCells.map((cell) => (
            <div
              key={cell.label}
              className="rounded-lg border border-[#1a4a3a] bg-white/[0.025] px-3.5 py-3"
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
                {cell.label}
              </div>
              <div className="mt-1 text-[14px] font-medium text-white">
                {cell.value}
              </div>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div className="rounded-xl border border-[#1a4a3a] bg-white/[0.025] px-4 py-3.5">
          <h4 className="m-0 mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
            Sjekkliste før godkjenning
          </h4>
          {checklist.map((row) => (
            <div
              key={row.text}
              className="flex items-center gap-2.5 py-1.5 text-[13px] text-white/85"
            >
              {row.state === "ok" ? (
                <div className="grid h-4 w-4 shrink-0 place-items-center rounded bg-[#6FCBA1]">
                  <Check className="h-2.5 w-2.5 text-ink" strokeWidth={3} />
                </div>
              ) : (
                <div
                  className="grid h-4 w-4 shrink-0 place-items-center rounded border"
                  style={{
                    background: "rgba(232,185,103,0.20)",
                    color: "#E8B967",
                    borderColor: "rgba(232,185,103,0.40)",
                  }}
                >
                  <AlertTriangle
                    className="h-2.5 w-2.5"
                    strokeWidth={2.5}
                  />
                </div>
              )}
              <span>{row.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action footer */}
      <div className="flex items-center gap-2.5 border-t border-[#1a4a3a] bg-white/[0.02] px-[22px] py-4">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-[13px] font-semibold text-ink transition hover:bg-accent/90"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2} /> Godkjenn og publiser
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-[13px] text-white/85 transition hover:bg-white/5"
        >
          <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.8} /> Be om endring
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-[13px] transition hover:bg-[rgba(184,66,51,0.10)]"
          style={{ color: "#F49283", borderColor: "rgba(184,66,51,0.40)" }}
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.8} /> Avslå
        </button>
        <div className="ml-auto font-mono text-[10px] tracking-[0.06em] text-white/50">
          SHIFT+↩ FOR HURTIG-GODKJENN
        </div>
      </div>
    </div>
  );
}
