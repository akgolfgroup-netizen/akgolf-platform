"use client";

interface ActivityItem {
  type: "booking" | "cancel" | "signup" | "payment" | "note";
  text: string;
  time: string;
}

interface ActivityFeedProps {
  items?: ActivityItem[];
}

const dotColors = {
  booking: "bg-primary",
  cancel: "bg-error",
  signup: "bg-info",
  payment: "bg-[var(--color-warning)]",
  note: "bg-grey-400",
};

export function ActivityFeed({ items = [] }: ActivityFeedProps) {
  return (
    <div className="bg-white border border-grey-200 rounded-xl p-4">
      <h3 className="text-xs font-bold text-black mb-3">Siste aktivitet</h3>
      {items.length === 0 ? (
        <p className="text-[10px] text-grey-400">Ingen aktivitet enna</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-[7px] h-[7px] rounded-full mt-1.5 shrink-0 ${dotColors[item.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-black leading-snug">{item.text}</p>
                <span className="text-[9px] text-grey-400">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
