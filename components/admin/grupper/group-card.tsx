import Link from "next/link";
import { AlertTriangle, Calendar } from "lucide-react";
import type { GroupCard as GroupCardType, GroupLevel } from "./mock-data";

const LEVEL_STYLES: Record<GroupLevel, string> = {
  ELITE: "bg-[rgba(209,248,67,0.18)] text-accent",
  JUNIOR: "bg-[rgba(107,177,255,0.18)] text-[#6BB1FF]",
  DAME: "bg-[rgba(175,82,222,0.20)] text-[#C99CF3]",
  KIDS: "bg-[rgba(232,185,103,0.20)] text-[#E8B967]",
  SENIOR: "bg-white/[0.06] text-white/75",
  CAMP: "bg-[rgba(209,248,67,0.18)] text-accent",
  UNDER: "bg-[rgba(184,66,51,0.20)] text-[#F49283]",
};

function statTone(tone?: "danger" | "success") {
  if (tone === "danger") return "text-[#F49283]";
  if (tone === "success") return "text-[#6FCBA1]";
  return "text-white";
}

export function GroupCard({ group }: { group: GroupCardType }) {
  const Icon = group.next.icon === "alert-triangle" ? AlertTriangle : Calendar;

  return (
    <Link
      href={`/portal/admin/grupper/${group.id}`}
      className={
        "flex flex-col gap-3 rounded-[14px] border border-white/[0.06] bg-[#0D2E23] p-[18px] transition hover:border-white/[0.12] " +
        (group.dimmed ? "opacity-70" : "")
      }
    >
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-bold tracking-tight text-white">
          {group.name}
        </div>
        <span
          className={
            "rounded-[5px] px-[7px] py-[3px] font-mono text-[9px] font-bold uppercase tracking-[0.14em] " +
            LEVEL_STYLES[group.level]
          }
        >
          {group.level}
        </span>
      </div>

      <div className="text-[12px] leading-[1.55] text-white/65">
        {group.description}
      </div>

      <div className="flex">
        {group.avatars.map((av, i) => (
          <div
            key={`${group.id}-${av.initials}-${i}`}
            className="grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-[#0D2E23] text-[9px] font-bold text-[#0A1F18]"
            style={{
              background: av.color,
              marginLeft: i === 0 ? 0 : -6,
            }}
          >
            {av.initials}
          </div>
        ))}
        {group.moreCount > 0 ? (
          <div
            className="grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-[#0D2E23] bg-white/[0.08] text-[9px] font-bold text-white/70"
            style={{ marginLeft: -6 }}
          >
            +{group.moreCount}
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2.5 text-[12px] text-white/85">
        <Icon
          className={
            group.next.icon === "alert-triangle"
              ? "h-3.5 w-3.5 text-[#E8B967]"
              : "h-3.5 w-3.5 text-accent"
          }
          strokeWidth={1.8}
        />
        <span className="truncate">{group.next.label}</span>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3">
        {group.stats.map((s) => (
          <div key={s.label} className="font-mono">
            <div className="text-[9px] uppercase tracking-[0.10em] text-white/50">
              {s.label}
            </div>
            <div className={"mt-0.5 text-[16px] font-bold " + statTone(s.tone)}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </Link>
  );
}
