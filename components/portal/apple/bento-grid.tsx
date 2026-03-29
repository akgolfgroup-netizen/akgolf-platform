"use client";

import { cn } from "@/lib/portal/utils/cn";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
}

const gapMap = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

export function BentoGrid({ children, className, gap = "md" }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 min-w-0",
        "max-lg:grid-cols-6",
        "max-md:grid-cols-1",
        gapMap[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
