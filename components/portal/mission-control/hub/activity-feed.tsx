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
  booking: "bg-[#2D6A4F]",
  cancel: "bg-[#D14343]",
  signup: "bg-[#2563EB]",
  payment: "bg-[#E89C30]",
  note: "bg-[#86868B]",
};

export function ActivityFeed({ items = [] }: ActivityFeedProps) {
  return (
    <div className="bg-white border border-[#E8E8ED] rounded-xl p-4">
      <h3 className="text-xs font-bold text-[#1D1D1F] mb-3">Siste aktivitet</h3>
      {items.length === 0 ? (
        <p className="text-[10px] text-[#86868B]">Ingen aktivitet enna</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-[7px] h-[7px] rounded-full mt-1.5 shrink-0 ${dotColors[item.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#1D1D1F] leading-snug">{item.text}</p>
                <span className="text-[9px] text-[#86868B]">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
