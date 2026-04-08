"use client";

import { cn } from "@/lib/portal/utils/cn";
import { User, Users, GraduationCap } from "lucide-react";

interface TimelineItem {
  id: string;
  time: string;
  name: string;
  type: "individual" | "gruppe" | "junior";
  status?: "confirmed" | "pending" | "cancelled";
  coach?: string;
  duration?: string;
}

interface HGBookingTimelineProps {
  items: TimelineItem[];
  className?: string;
  title?: string;
}

const typeIcons = {
  individual: User,
  gruppe: Users,
  junior: GraduationCap,
};

const typeLabels = {
  individual: "Individuell",
  gruppe: "Gruppe",
  junior: "Junior",
};

const statusStyles = {
  confirmed: "bg-[var(--hg-success)] shadow-[0_0_6px_var(--hg-success)]",
  pending: "bg-[var(--hg-warning)]",
  cancelled: "bg-[var(--hg-error)]",
};

export function HGBookingTimeline({
  items,
  className,
  title = "Dagens timeplan",
}: HGBookingTimelineProps) {
  return (
    <div className={cn("hg-card overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
        <h3 className="hg-section-title">{title}</h3>
        <span className="text-xs text-[var(--hg-text-muted)]">
          {items.length} økter
        </span>
      </div>
      
      <div className="p-2 max-h-[400px] overflow-y-auto hg-scrollbar">
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <span className="text-sm text-[var(--hg-text-muted)]">
              Ingen bookinger i dag
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = typeIcons[item.type];
              return (
                <div
                  key={item.id}
                  className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--hg-surface-raised)] transition-colors cursor-pointer"
                >
                  {/* Time */}
                  <div className="flex flex-col items-center min-w-[3rem]">
                    <span className="text-sm font-semibold text-[var(--hg-text)] tabular-nums">
                      {item.time}
                    </span>
                    {item.duration && (
                      <span className="text-[10px] text-[var(--hg-text-muted)]">
                        {item.duration}
                      </span>
                    )}
                  </div>
                  
                  {/* Status indicator */}
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      item.status ? statusStyles[item.status] : "bg-[var(--hg-border)]"
                    )}
                  />
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--hg-text)] truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--hg-text-muted)]">
                      <Icon className="w-3 h-3" />
                      <span>{typeLabels[item.type]}</span>
                      {item.coach && (
                        <>
                          <span className="text-[var(--hg-border-hover)]">•</span>
                          <span>{item.coach}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
