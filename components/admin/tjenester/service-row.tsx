import {
  Activity,
  Archive,
  Brain,
  CircleDot,
  FileText,
  Flag,
  LineChart,
  MoreHorizontal,
  Package,
  PackageCheck,
  Package2,
  Pencil,
  Ruler,
  RotateCcw,
  Target,
  Tent,
  Trash2,
  Users,
  UsersRound,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { IconName, ServiceRow as ServiceRowData } from "./mock-data";

const ICON_MAP: Record<IconName, LucideIcon> = {
  target: Target,
  "circle-dot": CircleDot,
  flag: Flag,
  video: Video,
  brain: Brain,
  activity: Activity,
  ruler: Ruler,
  "line-chart": LineChart,
  "package-2": Package2,
  package: Package,
  "package-check": PackageCheck,
  tent: Tent,
  users: Users,
  "users-round": UsersRound,
  "file-text": FileText,
  archive: Archive,
};

const CATEGORY_ICON_BG: Record<string, string> = {
  coach: "bg-[rgba(209,248,67,0.10)] text-accent",
  test: "bg-[rgba(107,177,255,0.18)] text-[#6BB1FF]",
  package: "bg-[rgba(175,82,222,0.18)] text-[#C99CF3]",
  camp: "bg-[rgba(232,185,103,0.20)] text-[#E8B967]",
  draft: "bg-white/[0.05] text-white/55",
  archived: "bg-[rgba(184,66,51,0.10)] text-[#F49283]",
};

const STATUS_PILL: Record<string, string> = {
  live: "bg-[rgba(42,125,90,0.25)] text-[#6FCBA1]",
  draft: "bg-white/[0.06] text-white/65",
  archived: "bg-[rgba(184,66,51,0.18)] text-[#F49283]",
};

interface Props {
  service: ServiceRowData;
  isLast?: boolean;
}

export function ServiceRow({ service, isLast }: Props) {
  const Icon = ICON_MAP[service.icon];
  const iconBg = CATEGORY_ICON_BG[service.category] ?? CATEGORY_ICON_BG.coach;
  const statusPill = STATUS_PILL[service.status] ?? STATUS_PILL.live;
  const dim =
    service.status === "draft"
      ? "opacity-70"
      : service.status === "archived"
        ? "opacity-50"
        : "";
  const isArchived = service.status === "archived";

  return (
    <div
      className={
        "grid grid-cols-[44px_1fr_100px_90px_110px_100px_60px] items-center gap-3.5 px-4 py-3.5 text-[13px] " +
        (isLast ? "" : "border-b border-white/[0.04] ") +
        dim
      }
    >
      <div className={"grid h-11 w-11 place-items-center rounded-[10px] " + iconBg}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <div className="truncate font-semibold text-white">{service.name}</div>
        <div className="mt-0.5 truncate font-mono text-[9.5px] uppercase tracking-[0.04em] text-white/55">
          {service.meta}
        </div>
      </div>
      <div className="font-mono text-[13px] font-bold tabular-nums text-white">
        {service.duration}
        {service.durationUnit && (
          <span className="ml-0.5 text-[10px] font-medium text-white/50">
            {service.durationUnit}
          </span>
        )}
      </div>
      <div className="font-mono text-[13px] font-bold tabular-nums text-white">
        {service.price}
        {service.priceUnit && (
          <span className="ml-0.5 text-[10px] font-medium text-white/50">
            {service.priceUnit}
          </span>
        )}
      </div>
      <div
        className={
          "rounded-[5px] px-2 py-[3px] text-center font-mono text-[9.5px] font-bold uppercase tracking-[0.10em] " +
          statusPill
        }
      >
        {service.status === "live" && service.statusExtra
          ? `LIVE · ${service.statusExtra}`
          : service.status === "live"
            ? "LIVE"
            : service.status === "draft"
              ? "KLADD"
              : "ARKIVERT"}
      </div>
      <div className="font-mono text-[10.5px] text-white/65">{service.bookings}</div>
      <div className="flex justify-end gap-1">
        <button
          type="button"
          className="grid h-7 w-7 place-items-center rounded-md border border-white/[0.06] bg-white/[0.04] text-white/65 transition hover:bg-white/[0.08]"
          aria-label={isArchived ? "Gjenopprett" : "Rediger"}
        >
          {isArchived ? (
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.8} />
          ) : (
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
          )}
        </button>
        <button
          type="button"
          className="grid h-7 w-7 place-items-center rounded-md border border-white/[0.06] bg-white/[0.04] text-white/65 transition hover:bg-white/[0.08]"
          aria-label={isArchived ? "Slett" : "Mer"}
        >
          {isArchived ? (
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
          ) : (
            <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} />
          )}
        </button>
      </div>
    </div>
  );
}

export function ServiceTableHeader() {
  return (
    <div className="grid grid-cols-[44px_1fr_100px_90px_110px_100px_60px] gap-3.5 bg-black/20 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.10em] text-white/50">
      <div />
      <div>Navn</div>
      <div>Varighet</div>
      <div>Pris</div>
      <div>Status</div>
      <div>Book / mnd</div>
      <div />
    </div>
  );
}
