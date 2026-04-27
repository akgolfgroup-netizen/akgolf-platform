import {
  BellRing,
  History,
  Leaf,
  MessageCircle,
  Play,
  Receipt,
  Settings,
  TrendingUp,
  UserX,
  ZapOff,
  type LucideIcon,
} from "lucide-react";
import type { AgentCard as AgentCardData, AgentIcon } from "./mock-data";

const ICONS: Record<AgentIcon, LucideIcon> = {
  "bell-ring": BellRing,
  "user-x": UserX,
  receipt: Receipt,
  "trending-up": TrendingUp,
  leaf: Leaf,
  "message-circle": MessageCircle,
  "zap-off": ZapOff,
};

export function AgentCard({ agent }: { agent: AgentCardData }) {
  const Icon = ICONS[agent.icon];
  return (
    <article
      className={
        "relative rounded-2xl border bg-[#0D2E23] px-7 py-[22px] " +
        (agent.active
          ? "border-accent/30 bg-gradient-to-br from-accent/[0.05] to-transparent"
          : "border-[#1a4a3a]")
      }
    >
      <div className="absolute right-[22px] top-[18px]">
        <Toggle on={agent.active} />
      </div>

      <div className="mb-3.5 flex items-start gap-3.5">
        <div
          className={
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl " +
            (agent.paused
              ? "bg-white/5 text-white/55"
              : "bg-accent/15 text-accent")
          }
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div>
          <div
            className={
              "text-[16px] font-bold tracking-[-0.015em] " +
              (agent.paused ? "text-white/70" : "text-white")
            }
          >
            {agent.name}
          </div>
          <div className="mt-1 text-[12.5px] leading-[1.5] text-white/65">
            {agent.description}
          </div>
        </div>
      </div>

      <div className="mb-3 rounded-[10px] bg-black/20 px-3.5 py-3 text-[12.5px] leading-[1.6] text-white/85">
        <div className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-accent">
          {agent.trigger.lab}
        </div>
        <code className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[11.5px] text-accent">
          {agent.trigger.lhs}
        </code>
        {agent.trigger.sep && (
          <>
            {" "}
            <span className="font-mono text-[11px] text-white/65">
              {agent.trigger.sep}
            </span>{" "}
          </>
        )}
        {agent.trigger.rhs &&
          (agent.trigger.sep ? (
            <code className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[11.5px] text-accent">
              {agent.trigger.rhs}
            </code>
          ) : (
            <span> {agent.trigger.rhs}</span>
          ))}
      </div>

      {agent.stats && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {agent.stats.map((s) => (
            <div key={s.label} className="rounded-[7px] bg-black/20 px-2.5 py-2">
              <div className="font-mono text-[9px] font-bold uppercase tracking-[0.10em] text-white/50">
                {s.label}
              </div>
              <div
                className="mt-0.5 text-[13px] font-bold text-white"
                style={s.valueColor ? { color: s.valueColor } : undefined}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className={
          "text-[12px] " + (agent.paused ? "text-white/50" : "text-white/65")
        }
      >
        {agent.recentWhen ? (
          <>
            Sist kjørt:{" "}
            <span className="font-mono text-[9.5px] tracking-[0.06em] text-accent">
              {agent.recentWhen}
            </span>{" "}
            · {agent.recent}
          </>
        ) : (
          agent.recent
        )}
      </div>

      <div className="mt-3 flex gap-1.5 border-t border-white/[0.05] pt-3">
        <ActionBtn icon={<Settings className="h-3 w-3" strokeWidth={1.8} />}>Innstillinger</ActionBtn>
        {agent.paused ? (
          <ActionBtn
            primary
            icon={<Play className="h-3 w-3" strokeWidth={1.8} />}
          >
            Aktiver
          </ActionBtn>
        ) : (
          <>
            <ActionBtn icon={<Play className="h-3 w-3" strokeWidth={1.8} />}>
              Test-kjør
            </ActionBtn>
            <ActionBtn icon={<History className="h-3 w-3" strokeWidth={1.8} />}>
              Logg
            </ActionBtn>
          </>
        )}
      </div>
    </article>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      className={
        "relative h-[22px] w-[38px] cursor-pointer rounded-full " +
        (on ? "bg-accent" : "bg-white/10")
      }
    >
      <span
        className={
          "absolute top-[3px] h-4 w-4 rounded-full transition-all " +
          (on ? "left-[19px] bg-ink" : "left-[3px] bg-white")
        }
      />
    </div>
  );
}

function ActionBtn({
  icon,
  children,
  primary,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={
        "flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-[11.5px] " +
        (primary
          ? "border-accent/20 bg-accent/10 text-accent"
          : "border-white/[0.06] bg-white/[0.04] text-white/85 hover:bg-white/[0.08]")
      }
    >
      {icon}
      {children}
    </button>
  );
}
