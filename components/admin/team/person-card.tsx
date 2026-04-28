import { Calendar, Plus, Settings, User } from "lucide-react";
import type { TeamMember } from "./mock-data";

export function PersonCard({ member }: { member: TeamMember }) {
  return (
    <article
      className={
        "flex flex-col gap-3.5 rounded-2xl border bg-[#0D2E23] p-[22px] " +
        (member.lead
          ? "border-accent/30 bg-gradient-to-br from-accent/[0.06] to-transparent"
          : "border-[#1a4a3a]")
      }
    >
      <div className="flex items-center gap-3.5">
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[18px] font-bold text-ink"
          style={{ background: member.avatarColor }}
        >
          {member.initials}
        </div>
        <div>
          <div className="text-[16px] font-bold tracking-[-0.015em] text-white">
            {member.name}
          </div>
          <div
            className={
              "mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] " +
              (member.lead ? "text-accent" : "text-white/50")
            }
          >
            {member.role}
          </div>
        </div>
      </div>

      <p className="text-[12.5px] leading-[1.55] text-white/70">{member.bio}</p>

      <div className="flex flex-wrap gap-1.5">
        {member.credentials.map((c) => (
          <span
            key={c}
            className="rounded-md border border-white/[0.06] bg-white/[0.04] px-[7px] py-[3px] font-mono text-[9.5px] font-semibold tracking-[0.10em] text-white/70"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3">
        {member.stats.map((s) => (
          <div key={s.label} className="font-mono">
            <div className="text-[9px] uppercase tracking-[0.10em] text-white/50">
              {s.label}
            </div>
            <div className="mt-0.5 text-[13px] font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex gap-1.5">
        <ActionPill icon={<User className="h-3.5 w-3.5" strokeWidth={1.8} />}>Profil</ActionPill>
        <ActionPill icon={<Calendar className="h-3.5 w-3.5" strokeWidth={1.8} />}>Kalender</ActionPill>
        <ActionPill icon={<Settings className="h-3.5 w-3.5" strokeWidth={1.8} />}>Tilgang</ActionPill>
      </div>
    </article>
  );
}

export function InvitePlaceholder() {
  return (
    <article className="flex flex-col gap-3.5 rounded-2xl border border-dashed border-[#1a4a3a] bg-[#0D2E23] p-[22px] opacity-60">
      <div className="flex items-center gap-3.5">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-[18px] font-bold text-white/60">
          +
        </div>
        <div>
          <div className="text-[16px] font-bold text-white/70">Inviter ny</div>
          <div className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
            VELG ROLLE
          </div>
        </div>
      </div>
      <p className="text-[12.5px] leading-[1.55] text-white/60">
        Trenger du flere coacher, en kasse-ansvarlig, eller en partner? Send invite med rolle og lokasjons-tilgang.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {["COACH", "FYSIO", "ADMIN", "PARTNER"].map((c) => (
          <span
            key={c}
            className="rounded-md border border-dashed border-white/15 px-[7px] py-[3px] font-mono text-[9.5px] font-semibold tracking-[0.10em] text-white/70"
          >
            {c}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-md border border-accent/20 bg-accent/10 px-2 py-2 text-[11.5px] text-accent"
      >
        <Plus className="h-3 w-3" strokeWidth={1.8} /> Send invite
      </button>
    </article>
  );
}

function ActionPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-2 text-[11px] text-white/85 hover:bg-white/[0.08]"
    >
      {icon}
      {children}
    </button>
  );
}
