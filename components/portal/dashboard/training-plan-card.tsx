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
    iconColor: "var(--color-green-bright)",
    iconBg: "rgba(0,88,64,0.08)",
  },
  {
    name: "Short game",
    meta: "Tir 8. apr \u00b7 30 min",
    done: true,
    icon: TrendingUp,
    iconColor: "var(--color-warning)",
    iconBg: "rgba(196,138,50,0.12)",
  },
  {
    name: "Driving range",
    meta: "Ons 9. apr \u00b7 45 min",
    done: true,
    icon: Target,
    iconColor: "var(--color-green-bright)",
    iconBg: "rgba(0,88,64,0.08)",
  },
  {
    name: "Coaching-okt",
    meta: "Fre 11. apr \u00b7 14:30",
    done: false,
    icon: User,
    iconColor: "var(--color-ai)",
    iconBg: "rgba(175,82,222,0.08)",
    highlight: true,
  },
  {
    name: "9 hull spill",
    meta: "Lor 12. apr",
    done: false,
    icon: Calendar,
    iconColor: "var(--color-portal-muted)",
    iconBg: "rgba(0,0,0,0.03)",
    dimmed: true,
  },
];

export function TrainingPlanCard({ delay = 0 }: TrainingPlanCardProps) {
  const doneCount = PLAN_ITEMS.filter((i) => i.done).length;

  return (
    <PremiumCard delay={delay} className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-portal-text)]">
            Ukens plan
          </p>
          <p className="text-[11px] text-[var(--color-portal-muted)]">
            {doneCount} av {PLAN_ITEMS.length} fullfort
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {PLAN_ITEMS.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2.5 rounded-[10px] border border-[var(--color-portal-border)] bg-[var(--color-portal-border-subtle)] px-3 py-2.5 transition-colors duration-200 hover:border-[rgba(0,0,0,0.08)] hover:bg-[rgba(0,0,0,0.04)]"
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
                    ? "var(--color-green-bright)"
                    : "var(--color-portal-text)",
                }}
              >
                {item.name}
              </p>
              <p className="text-[11px] text-[var(--color-portal-muted)]">
                {item.meta}
              </p>
            </div>

            {/* Check circle */}
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] transition-colors ${
                item.done
                  ? "border-[var(--color-success)] bg-[var(--color-success)] text-white"
                  : "border-[var(--color-portal-border)]"
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
