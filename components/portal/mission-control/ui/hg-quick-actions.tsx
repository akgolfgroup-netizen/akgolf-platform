"use client";

import { cn } from "@/lib/portal/utils/cn";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "primary";
}

interface HGQuickActionsProps {
  actions: QuickAction[];
  className?: string;
  title?: string;
}

export function HGQuickActions({ actions, className, title }: HGQuickActionsProps) {
  return (
    <div className={cn("hg-card p-4", className)}>
      {title && <h3 className="hg-label mb-3">{title}</h3>}
      <div className="hg-quick-actions">
        {actions.map((action, i) => {
          const Icon = action.icon;
          const content = (
            <>
              <Icon className="w-3.5 h-3.5" />
              <span>{action.label}</span>
            </>
          );

          if (action.href) {
            return (
              <Link
                key={i}
                href={action.href}
                className={cn(
                  "hg-quick-action",
                  action.variant === "primary" && "border-[var(--hg-primary)] text-[var(--hg-primary)]"
                )}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={i}
              onClick={action.onClick}
              className={cn(
                "hg-quick-action",
                action.variant === "primary" && "border-[var(--hg-primary)] text-[var(--hg-primary)]"
              )}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
