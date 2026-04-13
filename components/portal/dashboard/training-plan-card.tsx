"use client";

import { Check, Circle, User, TrendingUp, Target, Calendar } from "lucide-react";
import { PremiumCard } from "./premium-card";

interface PlanItem {
  name: string;
  meta: string;
  done: boolean;
  iconColor: string;
  iconBg: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  highlight?: boolean;
  dimmed?: boolean;
}

interface TrainingPlanCardProps {
  delay?: number;
}

const PLAN_ITEMS: PlanItem[] = [
  {
    name: "Putting-drill",
    meta: "Man 7. apr \u00b7 20 min",
    done: true,
    icon: Circle,
    iconColor: "#2A7D5A",
    iconBg: "rgba(42,125,90,0.1)",
  },
  {
    name: "Short game",
    meta: "Tir 8. apr \u00b7 30 min",
    done: true,
    icon: TrendingUp,
    iconColor: "#C48A32",
    iconBg: "rgba(196,138,50,0.12)",
  },
  {
    name: "Driving range",
    meta: "Ons 9. apr \u00b7 45 min",
    done: true,
    icon: Target,
    iconColor: "#2A7D5A",
    iconBg: "rgba(42,125,90,0.1)",
  },
  {
    name: "Coaching-okt",
    meta: "Fre 11. apr \u00b7 14:30",
    done: false,
    icon: User,
    iconColor: "#AF52DE",
    iconBg: "rgba(175,82,222,0.1)",
    highlight: true,
  },
  {
    name: "9 hull spill",
    meta: "Lor 12. apr",
    done: false,
    icon: Calendar,
    iconColor: "#8a8a82",
    iconBg: "rgba(138,138,130,0.08)",
    dimmed: true,
  },
];

export function TrainingPlanCard({ delay = 0 }: TrainingPlanCardProps) {
  const doneCount = PLAN_ITEMS.filter((i) => i.done).length;

  return (
    <PremiumCard delay={delay} className="h-full" radius="large">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[-0.01em] text-[#1c1c16]">
            Ukens plan
          </p>
          <p className="text-[11px] text-[#8a8a82]">
            {doneCount} av {PLAN_ITEMS.length} fullfort
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {PLAN_ITEMS.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2.5 rounded-xl border border-[#154212]/8 bg-[#f7f3ea]/50 px-3 py-2.5 transition-colors duration-200 hover:border-[#d2f000]/30 hover:bg-[#f7f3ea]"
            style={{ opacity: item.dimmed ? 0.4 : 1 }}
          >
            {/* Icon dot */}
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{ background: item.iconBg }}
            >
              <item.icon
                className="h-3 w-3"
                style={{ color: item.iconColor }}
                strokeWidth={2}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] font-medium"
                style={{
                  color: item.highlight
                    ? "#154212"
                    : "#1c1c16",
                }}
              >
                {item.name}
              </p>
              <p className="text-[11px] text-[#8a8a82]">
                {item.meta}
              </p>
            </div>

            {/* Check circle */}
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] transition-colors ${
                item.done
                  ? "border-[#2A7D5A] bg-[#2A7D5A] text-white"
                  : "border-[#154212]/15"
              }`}
            >
              {item.done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
