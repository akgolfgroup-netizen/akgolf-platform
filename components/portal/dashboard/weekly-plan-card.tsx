"use client";

import { Calendar } from "lucide-react";

interface DayPlan {
  day: string;
  activity: string;
  status: "done" | "today" | "upcoming" | "rest";
}

interface WeeklyPlanCardProps {
  days?: DayPlan[];
}

const defaultDays: DayPlan[] = [
  { day: "Man", activity: "Driving range", status: "done" },
  { day: "Tir", activity: "Putting", status: "done" },
  { day: "Ons", activity: "Hvile", status: "rest" },
  { day: "Tor", activity: "Coaching-okt", status: "today" },
  { day: "Fre", activity: "9 hull", status: "upcoming" },
];

const statusStyles = {
  done: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  today: "bg-[var(--color-brand)] text-white",
  upcoming: "bg-[#F5F5F7] text-[#6E6E73]",
  rest: "bg-transparent text-[#D2D2D7]",
};

export function WeeklyPlanCard({ days = defaultDays }: WeeklyPlanCardProps) {
  return (
    <div className="bg-white border border-[#E8E8ED] rounded-[14px] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-[#86868B]" />
        <h3 className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium">
          Ukens plan
        </h3>
      </div>
      <div className="space-y-2">
        {days.map((day) => (
          <div key={day.day} className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#86868B] w-8">{day.day}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${statusStyles[day.status]}`}>
              {day.activity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
