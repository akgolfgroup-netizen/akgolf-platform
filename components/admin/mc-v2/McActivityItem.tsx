import type { ReactNode } from "react";

export interface ActivityItem {
  id: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  when: string;
}

interface McActivityItemProps {
  item: ActivityItem;
  isLast?: boolean;
}

export function McActivityItem({ item, isLast }: McActivityItemProps) {
  return (
    <div
      className="flex items-start gap-3 py-3"
      style={{
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="shrink-0 w-8 h-8 rounded-lg grid place-items-center mt-0.5"
        style={{ background: item.iconBg, color: item.iconColor }}
      >
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-white leading-snug">
          {item.title}
        </div>
        <p className="m-0 mt-0.5 text-[12px] text-white/50 leading-relaxed">
          {item.body}
        </p>
      </div>
      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] text-white/35 mt-0.5">
        {item.when}
      </span>
    </div>
  );
}
