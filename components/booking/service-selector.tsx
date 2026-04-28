"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Target,
  CalendarClock,
  Flag,
  Users,
  Package,
  MessageCircle,
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { BookingServiceType } from "./booking-types";
import { formatBookingPrice } from "./booking-types";

interface ServiceSelectorProps {
  services: BookingServiceType[];
  onSelect: (service: BookingServiceType) => void;
}

// Modul-niva cache — kjor regex bare en gang per unike service-navn pa tvers av render.
const iconCache = new Map<string, LucideIcon>();

// Map service-name keywords to lucide icons (Brand Guide V2.0 — Lucide only)
function pickServiceIcon(name: string): LucideIcon {
  const cached = iconCache.get(name);
  if (cached) return cached;
  const n = name.toLowerCase();
  let icon: LucideIcon = Target;
  if (n.includes("on-course") || n.includes("bane")) icon = Flag;
  else if (n.includes("par") || n.includes("duo") || n.includes("gruppe")) icon = Users;
  else if (n.includes("flex 90") || n.includes("dyp") || n.includes("90 min")) icon = CalendarClock;
  else if (n.includes("intro") || n.includes("fri")) icon = MessageCircle;
  else if (n.includes("pakke") || n.includes("performance pro") || n.includes("performance")) icon = Package;
  else if (n.includes("test") || n.includes("kartlegg")) icon = Sparkles;
  iconCache.set(name, icon);
  return icon;
}

function isFeatured(service: BookingServiceType): boolean {
  const n = service.name.toLowerCase();
  return n.includes("performance") && !n.includes("pro");
}

export function ServiceSelector({ services, onSelect }: ServiceSelectorProps) {
  // Pre-beregn ikon + featured-flag per service slik at render-loopen ikke kaller funksjonene per render.
  const enriched = useMemo(
    () =>
      services.map((svc) => ({
        ...svc,
        Icon: pickServiceIcon(svc.name),
        featured: isFeatured(svc),
      })),
    [services],
  );
  return (
    <div>
      {/* Header — Brand Guide V2.0 (Inter Tight + JetBrains Mono eyebrow) */}
      <div className="mb-8">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">
          / Steg 1 — Velg tjeneste
        </div>
        <h2 className="font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-ink mb-2">
          Velg din treningsform.
        </h2>
        <p className="text-[14px] text-ink-muted leading-relaxed max-w-prose">
          Alle coaching-timer inkluderer TrackMan-analyse og personlig oppfølging.
        </p>
      </div>

      <div className="space-y-3">
        {enriched.map((svc, index) => {
          const { Icon, featured } = svc;
          return (
            <motion.button
              key={svc.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => onSelect(svc)}
              className={`group relative w-full text-left bg-card rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 ${
                featured
                  ? "border-2 border-primary shadow-[0_0_0_1px_rgba(0,88,64,0.08),0_18px_40px_rgba(10,31,24,0.06)]"
                  : "border border-line hover:border-line/60 hover:shadow-card-hover"
              }`}
              style={{
                boxShadow: featured
                  ? undefined
                  : "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
              }}
            >
              {featured && (
                <div className="absolute -top-2.5 right-6 bg-accent text-ink px-3 py-1 rounded-full font-mono text-[9px] font-bold uppercase tracking-[0.14em]">
                  Mest populær
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon + duration column */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-muted text-center leading-tight">
                    {svc.duration} min
                    {svc.maxStudents > 1 && (
                      <>
                        <br />
                        {svc.maxStudents}-pack
                      </>
                    )}
                  </div>
                </div>

                {/* Title + description */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-inter-tight text-[18px] font-bold leading-tight tracking-tight text-ink mb-1.5">
                    {svc.name}
                  </h3>
                  {svc.description && (
                    <p className="text-[13px] text-ink-muted leading-relaxed line-clamp-2">
                      {svc.description}
                    </p>
                  )}
                </div>

                {/* Price + arrow */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="font-inter-tight text-[20px] font-bold tracking-tight text-ink tabular-nums leading-none">
                    {svc.price === 0 ? (
                      <span className="text-primary">Inkludert</span>
                    ) : (
                      formatBookingPrice(svc.price)
                    )}
                  </div>
                  <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                    {svc.price === 0 ? "i abonnement" : "engang"}
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-ink-subtle mt-2 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {services.length === 0 && (
        <div className="bg-card border border-line rounded-2xl p-8 text-center">
          <p className="text-[14px] text-ink-muted">
            Ingen tilgjengelige tjenester akkurat nå.
          </p>
        </div>
      )}
    </div>
  );
}
