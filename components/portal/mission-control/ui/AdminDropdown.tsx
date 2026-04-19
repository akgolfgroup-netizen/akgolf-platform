"use client";


import { Icon } from "@/components/ui/icon";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface AdminDropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  variant?: "default" | "danger";
  onSelect: () => void;
}

interface AdminDropdownProps {
  trigger?: React.ReactNode;
  label?: string;
  items: AdminDropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function AdminDropdown({
  trigger,
  label = "Handlinger",
  items,
  align = "right",
  className,
}: AdminDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((i) => Math.min(items.length - 1, i + 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
      }
      if (event.key === "Enter") {
        const item = items[activeIndex];
        if (item && !item.disabled) {
          item.onSelect();
          setOpen(false);
        }
      }
    };
    window.addEventListener("mousedown", handler);
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("mousedown", handler);
      window.removeEventListener("keydown", keyHandler);
    };
  }, [open, items, activeIndex]);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {trigger ? (
        <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="admin-btn admin-btn-secondary"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {label}
          <Icon name="expand_more" className="w-4 h-4" />
        </button>
      )}
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute mt-2 min-w-[200px] rounded-xl shadow-xl overflow-hidden z-50 py-1",
            align === "right" ? "right-0" : "left-0",
          )}
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-muted)",
          }}
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isDanger = item.variant === "danger";
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  item.onSelect();
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left text-sm",
                  item.disabled && "opacity-50 cursor-not-allowed",
                )}
                style={{
                  background: isActive && !item.disabled
                    ? isDanger
                      ? "rgba(184, 66, 51, 0.08)"
                      : "rgba(0, 88, 64, 0.06)"
                    : "transparent",
                  color: isDanger
                    ? "var(--color-error)"
                    : "var(--color-text)",
                }}
              >
                {item.icon && (
                  <span className="shrink-0 flex items-center justify-center w-4 h-4">
                    {item.icon}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.label}</div>
                  {item.description && (
                    <div
                      className="text-xs truncate"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
