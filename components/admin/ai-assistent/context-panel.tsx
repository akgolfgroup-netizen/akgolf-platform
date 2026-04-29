import {
  Calendar,
  FileText,
  MessageCircle,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { CONTEXT_SOURCES } from "./mock-data";

const ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  calendar: Calendar,
  "trending-up": TrendingUp,
  "message-circle": MessageCircle,
  "file-text": FileText,
};

export function ContextPanel() {
  return (
    <aside className="rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] px-5 py-[18px]">
      <h4 className="mb-3 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/55">
        Aktiv kontekst
      </h4>
      <CtxRow label="Spillere i scope" value="42" first />
      <CtxRow label="Periode" value="SISTE 30D" />
      <CtxRow label="Datakilder" value="5" />

      <h4 className="mb-3 mt-[18px] border-t border-white/[0.06] pt-3.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/55">
        Kilder · siste svar
      </h4>
      {CONTEXT_SOURCES.map((s, i) => {
        const Icon = ICON_MAP[s.icon];
        return (
          <CtxRow
            key={s.label}
            first={i === 0}
            label={
              <span className="inline-flex items-center gap-1.5">
                {Icon && (
                  <Icon className="h-[13px] w-[13px]" strokeWidth={1.8} />
                )}
                {s.label}
              </span>
            }
            value={<span className="text-[#6FCBA1]">●</span>}
          />
        );
      })}

      <h4 className="mb-3 mt-[18px] border-t border-white/[0.06] pt-3.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/55">
        Tilgang &amp; sikkerhet
      </h4>
      <p className="text-[12px] leading-[1.55] text-white/65">
        Bare DU ser denne samtalen. Foreldre og spillere har ikke tilgang.
        Akademi-data forlater aldri akademiet — kjøres lokalt mot din database.
      </p>
      <div className="mt-2.5 flex gap-1.5">
        <span className="rounded-[4px] bg-[#2A7D5A]/25 px-1.5 py-[3px] font-mono text-[9px] font-bold tracking-[0.10em] text-[#6FCBA1]">
          PRIVAT
        </span>
        <span className="rounded-[4px] bg-white/[0.04] px-1.5 py-[3px] font-mono text-[9px] font-bold tracking-[0.10em] text-white/70">
          GDPR-OK
        </span>
      </div>
    </aside>
  );
}

function CtxRow({
  label,
  value,
  first,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center justify-between py-1.5 text-[12px] " +
        (first ? "" : "border-t border-white/[0.04]")
      }
    >
      <span className="text-white/70">{label}</span>
      <span className="font-mono text-[10.5px] font-bold text-white">{value}</span>
    </div>
  );
}
