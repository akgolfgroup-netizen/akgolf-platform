import { Calendar, Mail, MessageCircle, Phone, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  MOCK_BOOKINGS,
  MOCK_PARENT_CONTACT,
  MOCK_PLAYER_CONTEXT,
  type InfoRowEntry,
} from "./mock-data";

const ICONS: Record<InfoRowEntry["icon"], LucideIcon> = {
  calendar: Calendar,
  user: User,
  phone: Phone,
  mail: Mail,
  "message-circle": MessageCircle,
};

export function ContextPanel() {
  return (
    <aside className="flex flex-col gap-3.5">
      <InfoCard title="Spiller-kontekst">
        <div className="text-[18px] font-bold tracking-[-0.015em] text-white">
          {MOCK_PLAYER_CONTEXT.name}
        </div>
        <div className="mt-1 font-mono text-[10.5px] tracking-[0.06em] text-white/55">
          {MOCK_PLAYER_CONTEXT.meta}
        </div>
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          {MOCK_PLAYER_CONTEXT.stats.map((cell) => (
            <div key={cell.label} className="rounded-lg bg-black/20 px-3 py-2.5">
              <div className="font-mono text-[9px] uppercase tracking-[0.10em] text-white/50">
                {cell.label}
              </div>
              <div
                className="mt-0.5 text-[14px] font-bold text-white"
                style={cell.valueColor ? { color: cell.valueColor } : undefined}
              >
                {cell.value}
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard title="Bookinger neste 14 dager">
        {MOCK_BOOKINGS.map((row, i) => (
          <InfoRow key={`b-${i}`} entry={row} first={i === 0} />
        ))}
      </InfoCard>

      <InfoCard title="Foreldre-kontakt">
        {MOCK_PARENT_CONTACT.map((row, i) => (
          <InfoRow key={`p-${i}`} entry={row} first={i === 0} />
        ))}
      </InfoCard>
    </aside>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] px-5 py-[18px]">
      <h4 className="mb-3 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/55">
        {title}
      </h4>
      {children}
    </section>
  );
}

function InfoRow({ entry, first }: { entry: InfoRowEntry; first: boolean }) {
  const Icon = ICONS[entry.icon];
  return (
    <div
      className={
        "flex items-center gap-2.5 py-2.5 text-[12.5px] " +
        (first ? "" : "border-t border-white/[0.04]")
      }
    >
      <Icon className="h-[14px] w-[14px] shrink-0 text-white/55" strokeWidth={1.8} />
      <span className="flex-1 text-white/70">{entry.label}</span>
      <span className="font-mono text-[11px] font-bold text-white">{entry.value}</span>
    </div>
  );
}
