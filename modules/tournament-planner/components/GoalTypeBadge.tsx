import type { GoalType } from "../types";
import { GOAL_TYPE_CONFIG } from "../constants";

interface GoalTypeBadgeProps {
  goalType: GoalType;
  size?: "sm" | "md";
}

export function GoalTypeBadge({ goalType, size = "md" }: GoalTypeBadgeProps) {
  const config = GOAL_TYPE_CONFIG[goalType];
  const px = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${px}`}
      style={{
        color: config.color,
        backgroundColor: `${config.color}18`,
        border: `1px solid ${config.color}30`,
      }}
    >
      {config.label}
    </span>
  );
}
