"use client";

import { BellOff, CalendarPlus, Info, Video, Zap } from "lucide-react";

interface ContextPanelProps {
  participantName: string;
  initials: string;
  role?: string;
  meta?: Array<{ label: string; value: string }>;
}

export function ContextPanel({
  participantName,
  initials,
  role = "Coach",
  meta = [],
}: ContextPanelProps) {
  return (
    <aside
      className="flex flex-col gap-4.5 overflow-y-auto px-5.5 py-5.5"
      style={{
        background: "#0A1F18",
        borderLeft: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Coach card */}
      <div
        className="flex items-center gap-3 rounded-[12px] border border-white/5 bg-white/[0.03] px-4 py-4"
      >
        <div
          className="grid h-12 w-12 place-items-center rounded-full text-base font-bold tracking-[-0.02em]"
          style={{ background: "#D1F843", color: "#0A1F18" }}
        >
          {initials}
        </div>
        <div>
          <div className="text-sm font-bold tracking-[-0.01em] text-white">
            {participantName}
          </div>
          <div
            className="mt-0.5 text-[11.5px]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {role}
          </div>
        </div>
      </div>

      {/* Meta */}
      {meta.length > 0 ? (
        <div className="rounded-[12px] border border-white/5 bg-white/[0.03] p-4">
          <SectionLabel Icon={Info} label="Coaching-detaljer" />
          <div
            className="text-xs leading-[1.7]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {meta.map((row, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b border-white/5 py-1 last:border-b-0"
              >
                <span>{row.label}</span>
                <span
                  className="font-mono text-[11.5px] text-white"
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Quick actions */}
      <div className="rounded-[12px] border border-white/5 bg-white/[0.03] p-4">
        <SectionLabel Icon={Zap} label="Hurtighandlinger" />
        <div className="flex flex-col gap-1.5">
          <ActionRow Icon={CalendarPlus} label="Book ny økt" />
          <ActionRow Icon={Video} label="Be om video-feedback" />
          <ActionRow Icon={BellOff} label="Slå av varsler" />
        </div>
      </div>
    </aside>
  );
}

function SectionLabel({
  Icon,
  label,
}: {
  Icon: typeof Info;
  label: string;
}) {
  return (
    <h4
      className="m-0 mb-2.5 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase"
      style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em" }}
    >
      <Icon className="h-2.5 w-2.5" />
      {label}
    </h4>
  );
}

function ActionRow({
  Icon,
  label,
}: {
  Icon: typeof Zap;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2.5 text-left text-[12.5px] font-medium text-white/85 transition hover:bg-white/10"
    >
      <Icon className="h-3 w-3" style={{ color: "#D1F843" }} />
      {label}
    </button>
  );
}
