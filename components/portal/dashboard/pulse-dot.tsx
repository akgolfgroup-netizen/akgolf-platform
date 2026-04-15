"use client";

import { cn } from "@/lib/utils";

interface PulseDotProps {
  className?: string;
  color?: "lime" | "sage" | "coral" | "blue";
}

export function PulseDot({ className, color = "lime" }: PulseDotProps) {
  const colorMap = {
    lime: "bg-[#D1F843]",
    sage: "bg-[#2A7D5A]",
    coral: "bg-[#E85D4E]",
    blue: "bg-[#007AFF]",
  };

  return (
    <span className={cn("relative flex h-2.5 w-2.5", className)}>
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          colorMap[color]
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-2.5 w-2.5 rounded-full",
          colorMap[color]
        )}
      />
    </span>
  );
}
