"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import type { GoalType } from "../types";
import { GOAL_TYPE_CONFIG } from "../constants";
import { HelpCircle } from "lucide-react";

interface GoalTypeTooltipProps {
  goalType: GoalType;
}

export function GoalTypeTooltip({ goalType }: GoalTypeTooltipProps) {
  const config = GOAL_TYPE_CONFIG[goalType];

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="inline-flex items-center text-[var(--color-gold-muted)]/60 hover:text-[var(--color-gold-muted)] transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="max-w-xs px-3 py-2 rounded-lg text-xs bg-[var(--color-bg-deep)] border border-[var(--color-border)] text-[var(--color-snow)] shadow-xl z-50"
            sideOffset={4}
          >
            <p className="font-semibold mb-1" style={{ color: config.color }}>
              {config.label}
            </p>
            <p className="text-[var(--color-gold-muted)]">{config.tooltip}</p>
            <Tooltip.Arrow className="fill-[var(--color-bg-deep)]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
