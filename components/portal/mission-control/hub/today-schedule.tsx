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
  individual: { bg: "bg-[#0A1F18]", text: "text-white", label: "Indiv" },
  gruppe: { bg: "bg-[#2563EB]", text: "text-white", label: "Gruppe" },
  junior: { bg: "bg-[#007AFF]", text: "text-white", label: "Junior" },
  ledig: { bg: "bg-[#ECF0EF]", text: "text-[#7A8C85]", label: "Ledig" },
};

export function TodaySchedule({ items = [] }: TodayScheduleProps) {
  return (
    <div className="bg-white border border-[#D5DFDB] rounded-xl p-4">
      <h3 className="text-xs font-bold text-[#0A1F18] mb-3">Dagens timeplan</h3>
      {items.length === 0 ? (
        <p className="text-[10px] text-[#7A8C85]">Ingen okter i dag</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => {
            const style = typeStyles[item.type];
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-[#7A8C85] w-12 tabular-nums">{item.time}</span>
                <span className="text-[11px] font-medium text-[#0A1F18] flex-1 truncate">{item.name}</span>
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
