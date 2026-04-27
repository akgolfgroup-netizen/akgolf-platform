import { cn } from "@/lib/portal/utils/cn";

export function WeekNote({
  coachInitials,
  coachName,
  weekLabel,
  body,
  timeAgo,
}: {
  coachInitials: string;
  coachName: string;
  weekLabel: string;
  body: string;
  timeAgo?: string;
}) {
  return (
    <div
      className={cn(
        "mt-5 grid grid-cols-[40px_1fr_auto] items-start gap-3.5 rounded-[14px] border p-5",
        "border-[rgba(209,248,67,0.20)]",
      )}
      style={{
        background:
          "linear-gradient(180deg, rgba(209,248,67,0.05), transparent), var(--akgolf-card-dark, #0D2E23)",
      }}
    >
      <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--akgolf-accent,#D1F843)] text-[13px] font-extrabold text-[#0A1F18]">
        {coachInitials}
      </div>
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--akgolf-accent,#D1F843)]">
          Coach-notat · {weekLabel}
        </div>
        <div className="mb-2 mt-0.5 text-[14px] font-bold text-white">
          {coachName}
        </div>
        <p className="m-0 text-[13px] leading-[1.55] text-white/[0.78]">{body}</p>
      </div>
      {timeAgo && (
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-white/50">
          {timeAgo}
        </span>
      )}
    </div>
  );
}
