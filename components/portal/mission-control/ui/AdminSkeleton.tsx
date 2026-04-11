"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AdminSkeletonVariant =
  | "text"
  | "circle"
  | "rectangle"
  | "card"
  | "table-row";

interface AdminSkeletonProps {
  variant?: AdminSkeletonVariant;
  width?: number | string;
  height?: number | string;
  count?: number;
  className?: string;
}

export function AdminSkeleton({
  variant = "text",
  width,
  height,
  count = 1,
  className,
}: AdminSkeletonProps) {
  if (variant === "card") {
    return (
      <div
        className={cn("admin-card space-y-3", className)}
        aria-hidden="true"
      >
        <Shimmer className="rounded-md" style={{ height: 14, width: "40%" }} />
        <Shimmer className="rounded-md" style={{ height: 28, width: "70%" }} />
        <Shimmer className="rounded-md" style={{ height: 10, width: "90%" }} />
        <Shimmer className="rounded-md" style={{ height: 10, width: "60%" }} />
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div
        className={cn("flex items-center gap-4 py-3", className)}
        aria-hidden="true"
      >
        <Shimmer className="rounded-full" style={{ width: 32, height: 32 }} />
        <Shimmer className="rounded-md flex-1" style={{ height: 12 }} />
        <Shimmer className="rounded-md" style={{ height: 12, width: 80 }} />
        <Shimmer className="rounded-md" style={{ height: 12, width: 60 }} />
      </div>
    );
  }

  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, index) => (
        <Shimmer
          key={index}
          className={cn(
            variant === "circle" ? "rounded-full" : "rounded-md",
            index < count - 1 && variant === "text" ? "mb-2" : "",
            className,
          )}
          style={{
            width:
              width ??
              (variant === "circle"
                ? 40
                : variant === "rectangle"
                  ? "100%"
                  : "100%"),
            height:
              height ??
              (variant === "circle"
                ? 40
                : variant === "rectangle"
                  ? 120
                  : 14),
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

function Shimmer({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      <div
        className={cn("admin-shimmer", className)}
        style={style}
        aria-hidden="true"
      />
      <style jsx global>{`
        .admin-shimmer {
          position: relative;
          overflow: hidden;
          background: color-mix(in srgb, var(--color-muted) 25%, transparent);
        }
        .admin-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--color-surface) 70%, transparent),
            transparent
          );
          animation: admin-shimmer 1.4s infinite;
        }
        @keyframes admin-shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}
