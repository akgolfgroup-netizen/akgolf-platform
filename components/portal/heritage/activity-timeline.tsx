"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Target,
  Dumbbell,
  MapPin,
  Flag,
  Zap,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface ActivityItem {
  id: string;
  type: "range" | "course" | "putting" | "coaching" | "fitness";
  title: string;
  date: Date;
  duration?: number;
  notes?: string;
  energyLevel: "high" | "medium" | "low";
  completed: boolean;
}

interface ActivityTimelineProps {
  items: ActivityItem[];
  filter?: "all" | "range" | "course" | "putting";
}

const typeConfig = {
  range: { icon: Target, label: "Range", color: "#154212" },
  course: { icon: Flag, label: "Bane", color: "#3b82f6" },
  putting: { icon: MapPin, label: "Putting", color: "#8b5cf6" },
  coaching: { icon: Zap, label: "Coaching", color: "#f59e0b" },
  fitness: { icon: Dumbbell, label: "Fysisk", color: "#ef4444" },
};

const energyIcons = {
  high: { icon: Smile, color: "#22c55e", label: "Høy energi" },
  medium: { icon: Meh, color: "#f59e0b", label: "Middels energi" },
  low: { icon: Frown, color: "#8a9385", label: "Lav energi" },
};

function TimelineItem({ item, index }: { item: ActivityItem; index: number }) {
  const config = typeConfig[item.type];
  const Icon = config.icon;
  const energy = energyIcons[item.energyLevel];
  const EnergyIcon = energy.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-4 pb-6 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-[19px] top-10 bottom-0 w-px bg-[#c2c9bb]/50 last:hidden" />

      {/* Icon */}
      <div
        className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${config.color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color: config.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium text-[#1c1c16]">{item.title}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#8a9385]">
              <span>{format(item.date, "EEEE d. MMMM", { locale: nb })}</span>
              {item.duration && <span>{item.duration} min</span>}
            </div>
          </div>
          <div
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
            style={{ backgroundColor: `${energy.color}15`, color: energy.color }}
          >
            <EnergyIcon className="w-3 h-3" />
            <span className="hidden sm:inline">{energy.label}</span>
          </div>
        </div>

        {item.notes && (
          <p className="text-sm text-[#6b7366] mt-2 bg-[#f7f3ea] rounded-lg p-3">
            {item.notes}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full",
              item.completed
                ? "bg-[#22c55e]/10 text-[#22c55e]"
                : "bg-[#8a9385]/10 text-[#8a9385]"
            )}
          >
            {item.completed ? "Fullført" : "Ikke fullført"}
          </span>
          <span className="text-[10px] font-medium text-[#8a9385] px-2 py-0.5 rounded-full bg-[#f7f3ea]">
            {config.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function ActivityTimeline({ items, filter = "all" }: ActivityTimelineProps) {
  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.type === filter);

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-[#c2c9bb]/50">
        <p className="text-[#8a9385]">Ingen aktiviteter funnet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50">
      {filteredItems.map((item, index) => (
        <TimelineItem key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
