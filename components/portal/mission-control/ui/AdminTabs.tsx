"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface AdminTabsProps {
  items: AdminTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function AdminTabs({
  items,
  value: controlledValue,
  defaultValue,
  onValueChange,
  className,
  size = "md",
}: AdminTabsProps) {
  const [uncontrolled, setUncontrolled] = React.useState<string>(
    defaultValue ?? items[0]?.id ?? "",
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;

  const handleChange = (id: string) => {
    if (!isControlled) setUncontrolled(id);
    onValueChange?.(id);
  };

  return (
    <div
      role="tablist"
      className={cn("flex items-center gap-1 border-b", className)}
      style={{ borderColor: "var(--color-muted)" }}
    >
      {items.map((item) => {
        const isActive = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            onClick={() => handleChange(item.id)}
            className={cn(
              "relative inline-flex items-center gap-2 font-medium transition-colors",
              size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm",
              item.disabled && "opacity-50 cursor-not-allowed",
            )}
            style={{
              color: isActive ? "var(--color-text)" : "var(--color-muted)",
            }}
          >
            {item.icon && (
              <span className="flex items-center justify-center">
                {item.icon}
              </span>
            )}
            {item.label}
            {item.badge !== undefined && (
              <span
                className="inline-flex items-center justify-center rounded-full px-1.5 text-[10px] font-semibold"
                style={{
                  background: isActive
                    ? "var(--color-primary)"
                    : "var(--color-muted)",
                  color: isActive ? "var(--color-surface)" : "var(--color-text)",
                  minWidth: 18,
                  height: 18,
                }}
              >
                {item.badge}
              </span>
            )}
            {isActive && (
              <span
                className="absolute left-0 right-0 -bottom-px h-0.5"
                style={{ background: "var(--color-primary)" }}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
