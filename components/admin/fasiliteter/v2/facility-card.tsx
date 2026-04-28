import {
  Bluetooth,
  Calendar,
  Camera,
  CircleDot,
  Monitor,
  Plus,
  Radar,
  Square,
  Wifi,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type {
  EquipIcon,
  Equipment,
  EquipmentStatus,
  FacilityCardData,
} from "./mock-data";

const EQUIP_ICON_MAP: Record<EquipIcon, LucideIcon> = {
  radar: Radar,
  camera: Camera,
  monitor: Monitor,
  wifi: Wifi,
  "circle-dot": CircleDot,
  square: Square,
  bluetooth: Bluetooth,
};

const STATUS_PILL: Record<EquipmentStatus, string> = {
  ok: "bg-[rgba(42,125,90,0.25)] text-[#6FCBA1]",
  due: "bg-[rgba(232,185,103,0.20)] text-[#E8B967]",
  warn: "bg-[rgba(184,66,51,0.20)] text-[#F49283]",
};

export function FacilityCard({ facility }: { facility: FacilityCardData }) {
  const isLive = facility.state === "live-i-bruk";

  return (
    <article className="overflow-hidden rounded-2xl border border-[#1a4a3a] bg-[#0D2E23]">
      {/* Photo placeholder */}
      <div
        className="relative flex aspect-[16/8] items-end px-5 pb-5"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(13,46,35,0.40), rgba(0,0,0,0.20)), repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 14px, rgba(255,255,255,0.05) 14px 28px)",
        }}
      >
        <span
          className={
            "absolute left-3.5 top-3.5 rounded-[5px] px-1.5 py-[3px] font-mono text-[9px] font-bold uppercase tracking-[0.14em] " +
            (isLive
              ? "bg-[rgba(42,125,90,0.50)] text-[#9DE5BC]"
              : "bg-black/50 text-white/85")
          }
        >
          {facility.badgeText}
        </span>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
            {facility.location}
          </div>
          <div className="mt-1 text-[24px] font-extrabold leading-tight tracking-tight text-white">
            {facility.title}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        <div className="mb-4 grid grid-cols-3 gap-2.5">
          <MetricCell
            label="Belegg · uke"
            value={`${facility.utilization}`}
            unit="%"
            barWidth={facility.utilization}
            barColor={facility.utilColor}
          />
          <MetricCell label="Bookinger · mnd" value={facility.bookingsMonth} />
          <MetricCell label={facility.nextSlotLabel} value={facility.nextSlot} />
        </div>

        <div className="text-[13px]">
          {facility.equipment.map((eq, idx) => (
            <EquipmentRow key={eq.name} equipment={eq} isFirst={idx === 0} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-[#1a4a3a] bg-black/10 px-5 py-3">
        <ActionPill icon={Calendar} label="Belegg" />
        <ActionPill icon={Wrench} label="Vedlikehold" />
        <ActionPill icon={Plus} label={isLive ? "Book bay" : "Book studio"} primary />
      </div>
    </article>
  );
}

function MetricCell({
  label,
  value,
  unit,
  barWidth,
  barColor,
}: {
  label: string;
  value: string;
  unit?: string;
  barWidth?: number;
  barColor?: string;
}) {
  return (
    <div className="rounded-lg bg-black/20 px-3 py-2.5">
      <div className="font-mono text-[9px] font-bold uppercase tracking-[0.10em] text-white/50">
        {label}
      </div>
      <div className="mt-0.5 text-[14px] font-bold tabular-nums text-white">
        {value}
        {unit && <span className="ml-1 text-[11px] font-medium text-white/50">{unit}</span>}
      </div>
      {typeof barWidth === "number" && (
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-[3px] bg-white/[0.06]">
          <div
            className="h-full"
            style={{
              width: `${barWidth}%`,
              background: barColor ?? "var(--color-accent)",
            }}
          />
        </div>
      )}
    </div>
  );
}

function EquipmentRow({
  equipment,
  isFirst,
}: {
  equipment: Equipment;
  isFirst: boolean;
}) {
  const Icon = EQUIP_ICON_MAP[equipment.icon];
  return (
    <div
      className={
        "grid grid-cols-[22px_1fr_auto] items-center gap-2.5 py-2 " +
        (isFirst ? "" : "border-t border-white/[0.04]")
      }
    >
      <Icon className="h-3.5 w-3.5 text-white/55" strokeWidth={1.8} />
      <div className="min-w-0">
        <div className="truncate font-semibold text-white">{equipment.name}</div>
        {equipment.meta && (
          <div className="mt-0.5 truncate font-mono text-[9.5px] tracking-[0.05em] text-white/50">
            {equipment.meta}
          </div>
        )}
      </div>
      <span
        className={
          "rounded-[5px] px-1.5 py-[3px] font-mono text-[9px] font-bold uppercase tracking-[0.14em] " +
          STATUS_PILL[equipment.status]
        }
      >
        {equipment.statusLabel}
      </span>
    </div>
  );
}

function ActionPill({
  icon: Icon,
  label,
  primary,
}: {
  icon: LucideIcon;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={
        "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-[12px] transition " +
        (primary
          ? "border border-accent bg-accent font-bold text-ink hover:bg-[#bfe535]"
          : "border border-white/[0.06] bg-white/[0.04] text-white/85 hover:bg-white/[0.08]")
      }
    >
      <Icon className="h-[13px] w-[13px]" strokeWidth={1.8} />
      {label}
    </button>
  );
}
