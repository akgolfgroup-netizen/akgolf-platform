"use client";

import Image from "next/image";
import { cn } from "@/lib/portal/utils/cn";

interface AppleAvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  ring?: boolean;
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

const ringMap = {
  xs: "ring-1",
  sm: "ring-2",
  md: "ring-2",
  lg: "ring-[3px]",
  xl: "ring-4",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppleAvatar({
  src,
  alt = "",
  name = "",
  size = "md",
  ring = false,
  className,
}: AppleAvatarProps) {
  const initials = getInitials(name || alt);

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex-shrink-0",
        "bg-[var(--color-grey-200)]",
        "flex items-center justify-center font-semibold text-[var(--color-grey-600)]",
        ring && [
          "ring-[var(--color-grey-300)]",
          ringMap[size],
          "transition-all duration-300 hover:ring-[var(--color-grey-400)]",
        ],
        sizeMap[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || name}
          fill
          className="object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
