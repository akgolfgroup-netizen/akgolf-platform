"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminTimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon?: React.ReactNode;
  color?: string;
}

interface AdminTimelineProps {
  items: AdminTimelineItem[];
  className?: string;
}

export function AdminTimeline({ items, className }: AdminTimelineProps) {
  return (
    <ol className={cn("relative", className)}>
      <div
        className="absolute top-2 bottom-2 w-px"
        style={{
          left: 11,
          background: "var(--color-muted)",
          opacity: 0.3,
        }}
        aria-hidden="true"
      />
      {items.map((item) => (
        <li key={item.id} className="relative pl-8 pb-6 last:pb-0">
          <span
            className="absolute left-0 top-1 flex items-center justify-center rounded-full"
            style={{
              width: 22,
              height: 22,
              background: "var(--color-surface)",
              border: `2px solid ${item.color ?? "var(--color-primary)"}`,
            }}
            aria-hidden="true"
          >
            {item.icon ? (
              <span
                className="flex items-center justify-center"
                style={{ color: item.color ?? "var(--color-primary)" }}
              >
                {item.icon}
              </span>
            ) : (
              <span
                className="block rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: item.color ?? "var(--color-primary)",
                }}
              />
            )}
          </span>
          <div className="flex items-center gap-2 mb-0.5">
            <h4
              className="text-sm font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              {item.title}
            </h4>
            <time
              className="text-xs"
              style={{ color: "var(--color-muted)" }}
            >
              {item.date}
            </time>
          </div>
          {item.description && (
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              {item.description}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
