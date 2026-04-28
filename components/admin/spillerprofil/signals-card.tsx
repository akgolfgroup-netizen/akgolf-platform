import { AlertTriangle, Trophy, Zap } from "lucide-react";
import type { ReactElement } from "react";
import { COLORS, Panel, PanelHead } from "./primitives";
import type { SignalCard } from "./types";

const TONE_STYLES: Record<
  SignalCard["tone"],
  { bg: string; border: string; leftBorder: string; iconColor: string; icon: ReactElement }
> = {
  up: {
    bg: "rgba(209,248,67,0.10)",
    border: "rgba(209,248,67,0.25)",
    leftBorder: "#D1F843",
    iconColor: COLORS.accent,
    icon: <Trophy className="h-3.5 w-3.5" />,
  },
  warn: {
    bg: "rgba(196,138,50,0.10)",
    border: "rgba(196,138,50,0.30)",
    leftBorder: "#E8B967",
    iconColor: COLORS.warn,
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  danger: {
    bg: "rgba(184,66,51,0.10)",
    border: "rgba(184,66,51,0.30)",
    leftBorder: "#F49283",
    iconColor: COLORS.danger,
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
};

export function SignalCardItem({
  signal,
  showActions = false,
}: {
  signal: SignalCard;
  showActions?: boolean;
}) {
  const t = TONE_STYLES[signal.tone];
  return (
    <div
      className="rounded-[10px] px-[14px] py-[12px]"
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderLeft: `3px solid ${t.leftBorder}`,
      }}
    >
      <div className="mb-[6px] flex items-center gap-2">
        <span style={{ color: t.iconColor }}>{t.icon}</span>
        <h4
          className="m-0 text-[13px] font-semibold"
          style={{ color: "#fff" }}
        >
          {signal.title}
        </h4>
        {showActions ? (
          <span
            className="ml-auto font-mono text-[10px]"
            style={{ color: COLORS.textSubtle }}
          >
            {signal.when}
          </span>
        ) : null}
      </div>
      <p
        className="m-0 mb-[8px] text-[12px] leading-[1.5]"
        style={{ color: COLORS.textMuted }}
      >
        {signal.body}
      </p>
      {showActions && signal.primaryAction ? (
        <div className="flex gap-[8px]">
          <button
            className="inline-flex items-center gap-[6px] rounded-[6px] px-[10px] py-[5px] text-[11px] font-medium"
            style={{ background: COLORS.accent, color: "#0A1F18" }}
          >
            {signal.tone === "warn" ? (
              <Zap className="h-3 w-3" />
            ) : (
              <Trophy className="h-3 w-3" />
            )}
            {signal.primaryAction}
          </button>
          {signal.secondaryAction ? (
            <button
              className="rounded-[6px] px-[10px] py-[5px] text-[11px] font-medium"
              style={{
                background: "transparent",
                color: COLORS.textMuted,
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              {signal.secondaryAction}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Brukes i d7 sidebar: kompakte signaler uten action-knapper. */
export function SignalsPanel({ signals }: { signals: SignalCard[] }) {
  return (
    <Panel>
      <PanelHead title="Signaler" sub={`${signals.length} åpne`} />
      <div className="flex flex-col gap-[10px]">
        {signals.map((s) => (
          <SignalCardItem key={s.title} signal={s} />
        ))}
      </div>
    </Panel>
  );
}

/** Brukes i d8 long page: signaler med actions. */
export function SignalsCardLong({ signals }: { signals: SignalCard[] }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {signals.map((s) => (
        <SignalCardItem key={s.title} signal={s} showActions />
      ))}
    </div>
  );
}
