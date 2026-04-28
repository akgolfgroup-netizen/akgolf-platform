"use client";

import { ArrowRight, Check, type LucideIcon } from "lucide-react";

export interface ServiceTileData {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  priceUnit: string;
  bullets: string[];
  Icon: LucideIcon;
  ribbon?: string;
  featured?: boolean;
  ctaLabel?: string;
  freePrice?: boolean;
}

interface ServiceTileProps {
  data: ServiceTileData;
  onSelect: () => void;
}

export function ServiceTile({ data, onSelect }: ServiceTileProps) {
  const {
    title,
    description,
    duration,
    price,
    priceUnit,
    bullets,
    Icon,
    ribbon,
    featured,
    ctaLabel = "Start booking",
    freePrice,
  } = data;

  return (
    <div
      className={`relative flex flex-col rounded-[20px] border bg-white p-[26px_28px_28px] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_48px_rgba(10,31,24,0.08)] ${
        featured
          ? "border-[var(--akgolf-primary,#005840)] shadow-[0_0_0_1px_var(--akgolf-primary,#005840)]"
          : "border-[var(--akgolf-line-light,#E0E8E5)]"
      }`}
    >
      {ribbon ? (
        <div
          className="absolute -top-[10px] right-6 rounded-full bg-[var(--akgolf-accent,#D1F843)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--akgolf-ink,#0A1F18)]"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {ribbon}
        </div>
      ) : null}

      <div className="mb-4 flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[rgba(0,88,64,0.10)] text-[var(--akgolf-primary,#005840)]">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div
          className="rounded-full bg-[var(--akgolf-surface,#F4F6F4)] px-[10px] py-[5px] text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--akgolf-muted,#A5B2AD)]"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {duration}
        </div>
      </div>

      <h3
        className="m-0 mb-2 text-[20px] font-extrabold tracking-[-0.02em] text-[var(--akgolf-ink,#0A1F18)]"
        style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
      >
        {title}
      </h3>
      <p className="m-0 mb-[18px] min-h-[44px] text-sm leading-[1.55] text-[var(--akgolf-text,#324D45)]">
        {description}
      </p>

      <ul className="m-0 mb-[22px] flex flex-1 list-none flex-col gap-1.5 p-0">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2 text-[13px] text-[var(--akgolf-text,#324D45)]"
          >
            <Check
              className="mt-[2px] h-3.5 w-3.5 flex-shrink-0 text-[var(--akgolf-primary,#005840)]"
              strokeWidth={2.5}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-[var(--akgolf-line-light,#E0E8E5)] pt-[18px]">
        <div className="flex flex-col">
          <div
            className={`text-[22px] font-extrabold leading-none tracking-[-0.02em] ${
              freePrice
                ? "text-[var(--akgolf-primary,#005840)]"
                : "text-[var(--akgolf-ink,#0A1F18)]"
            }`}
            style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
          >
            {price}
          </div>
          <div
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.10em] text-[var(--akgolf-muted,#A5B2AD)]"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            {priceUnit}
          </div>
        </div>
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--akgolf-ink,#0A1F18)] px-[18px] py-[10px] text-[13px] font-bold text-white transition-all hover:-translate-y-px hover:bg-[var(--akgolf-primary,#005840)]"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
