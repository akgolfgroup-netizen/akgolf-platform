"use client";

/**
 * Choicebox — radio/checkbox-cards med tittel + beskrivelse.
 * Heritage-stil: DM Sans, Material Symbols, Material 3-tokens.
 *
 * Bruk:
 *   <ChoiceboxGroup value={v} onChange={setV} type="radio">
 *     <ChoiceboxGroup.Item value="a" title="Tittel" description="Beskrivelse" iconName="auto_awesome" />
 *   </ChoiceboxGroup>
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

interface ChoiceboxGroupProps {
  direction?: "row" | "column";
  label?: string;
  showLabel?: boolean;
  onChange: (value: string) => void;
  type?: "radio";
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function ChoiceboxGroup({
  direction = "column",
  label,
  showLabel,
  onChange,
  type = "radio",
  value,
  children,
  disabled,
  className,
}: ChoiceboxGroupProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showLabel && label && (
        <label className="font-body text-[13px] text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex gap-3",
          direction === "row" ? "flex-row" : "flex-col",
        )}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement<ChoiceboxItemProps>, {
            onChange,
            type,
            valueSelected: value,
            disabled,
          });
        })}
      </div>
    </div>
  );
}

interface ChoiceboxItemProps {
  title: string;
  description?: string;
  value: string;
  iconName?: string;
  badge?: string;
  type?: "radio";
  valueSelected?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

function Item({
  title,
  description,
  value,
  iconName,
  badge,
  type = "radio",
  valueSelected,
  onChange,
  disabled,
  children,
}: ChoiceboxItemProps) {
  const isSelected = value === valueSelected;

  const onClick = () => {
    if (onChange && !disabled) onChange(value);
  };

  return (
    <div
      className={cn(
        "group relative w-full rounded-2xl border-2 transition-all duration-200",
        isSelected
          ? "border-primary bg-primary-container/10 shadow-card"
          : "border-outline-variant bg-surface-container-lowest hover:border-outline hover:shadow-card",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start gap-4 p-5">
        {iconName && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
              isSelected
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant group-hover:bg-surface-container-high",
            )}
          >
            <Icon name={iconName} size={20} />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-headline text-base font-semibold",
                isSelected ? "text-primary" : "text-on-surface",
              )}
            >
              {title}
            </span>
            {badge && (
              <span className="rounded-full bg-secondary-fixed px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-on-secondary-fixed">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <span className="font-body text-sm leading-relaxed text-on-surface-variant">
              {description}
            </span>
          )}
        </div>
        <div
          className={cn(
            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            isSelected ? "border-primary bg-primary" : "border-outline-variant",
          )}
        >
          {isSelected && (
            <span className="h-2 w-2 rounded-full bg-on-primary" />
          )}
        </div>
        <input
          disabled={disabled}
          type={type}
          value={value}
          checked={isSelected}
          onChange={onClick}
          className="sr-only"
          aria-label={title}
        />
      </div>
      {children && isSelected && (
        <div className="border-t border-outline-variant px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

ChoiceboxGroup.Item = Item;
