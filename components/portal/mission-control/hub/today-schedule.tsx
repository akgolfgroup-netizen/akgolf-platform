"use client";

interface ScheduleItem {
  time: string;
  name: string;
  type: "individual" | "gruppe" | "junior" | "ledig";
}

interface TodayScheduleProps {
  items?: ScheduleItem[];
}

const typeStyles = {
  individual: { bg: "bg-black", text: "text-white", label: "Indiv" },
  gruppe: { bg: "bg-info", text: "text-white", label: "Gruppe" },
  junior: { bg: "bg-info", text: "text-white", label: "Junior" },
  ledig: { bg: "bg-surface", text: "text-grey-400", label: "Ledig" },
};

export function TodaySchedule({ items = [] }: TodayScheduleProps) {
  return (
    <div className="bg-white border border-grey-200 rounded-xl p-4">
      <h3 className="text-xs font-bold text-[var(--color-black)] mb-3">Dagens timeplan</h3>
      {items.length === 0 ? (
        <p className="text-[10px] text-[var(--color-grey-400)]">Ingen okter i dag</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => {
            const style = typeStyles[item.type];
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-[var(--color-grey-400)] w-12 tabular-nums">{item.time}</span>
                <span className="text-[11px] font-medium text-[var(--color-black)] flex-1 truncate">{item.name}</span>
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
