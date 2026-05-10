"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  triggerIcon?: React.ReactNode;
  className?: string;
}

export function ActionMenu({ items, triggerIcon, className }: ActionMenuProps) {
  const defaultItems = items.filter((i) => i.variant !== "danger");
  const dangerItems = items.filter((i) => i.variant === "danger");
  const hasBoth = defaultItems.length > 0 && dangerItems.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-[12px] text-[#5E5C57] transition-colors hover:bg-[#EFEDE6]",
            className
          )}
        >
          {triggerIcon ?? <MoreVertical className="h-[18px] w-[18px]" strokeWidth={1.75} />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[160px] rounded-[12px] border-[#E5E3DD] bg-white p-1"
      >
        {defaultItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            disabled={item.disabled}
            className="flex cursor-pointer items-center gap-2 rounded-[8px] px-2.5 py-2 text-[13px] text-[#0A1F18] focus:bg-[#EFEDE6]"
          >
            {item.icon && <span className="flex h-4 w-4 shrink-0 items-center justify-center">{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
        {hasBoth && <DropdownMenuSeparator className="my-1 bg-[#EFEDE6]" />}
        {dangerItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            disabled={item.disabled}
            className="flex cursor-pointer items-center gap-2 rounded-[8px] px-2.5 py-2 text-[13px] text-[#A32D2D] focus:bg-[#FAE3E3]"
          >
            {item.icon && <span className="flex h-4 w-4 shrink-0 items-center justify-center">{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
