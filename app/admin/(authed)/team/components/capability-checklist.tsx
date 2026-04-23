"use client";


import { Icon } from "@/components/ui/icon";
import { useMemo } from "react";
import type { Capability } from "@prisma/client";
import {
  CAPABILITY_CATALOG,
  CAPABILITY_GROUPS,
} from "@/lib/portal/capabilities";


interface CapabilityChecklistProps {
  value: Capability[];
  onChange: (next: Capability[]) => void;
  disabled?: boolean;
}

export function CapabilityChecklist({
  value,
  onChange,
  disabled,
}: CapabilityChecklistProps) {
  const selected = useMemo(() => new Set(value), [value]);

  function toggle(cap: Capability) {
    const next = new Set(selected);
    if (next.has(cap)) next.delete(cap);
    else next.add(cap);
    onChange(Array.from(next));
  }

  return (
    <div className="space-y-5">
      {CAPABILITY_GROUPS.map((group) => {
        const items = CAPABILITY_CATALOG.filter((c) => c.group === group.id);
        if (items.length === 0) return null;

        const groupActive = items.filter((i) => selected.has(i.capability)).length;

        return (
          <div
            key={group.id}
            className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]"
          >
            <div className="px-4 py-3 border-b border-[var(--color-outline-variant)] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-on-surface)] tracking-[-0.01em]">
                  {group.label}
                </h4>
                <p className="text-[11px] text-[var(--color-outline)] mt-0.5">
                  {group.description}
                </p>
              </div>
              <span className="text-[11px] tabular-nums font-medium text-[var(--color-outline)]">
                {groupActive}/{items.length}
              </span>
            </div>

            <div className="divide-y divide-[var(--color-outline-variant)]">
              {items.map((item) => {
                const isChecked = selected.has(item.capability);
                const missingPrereq = item.requires?.some(
                  (r) => !selected.has(r)
                );
                return (
                  <label
                    key={item.capability}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      isChecked
                        ? "bg-[var(--color-surface-container)]"
                        : "hover:bg-[var(--color-surface-container)]"
                    } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
                      checked={isChecked}
                      disabled={disabled}
                      onChange={() => toggle(item.capability)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-[var(--color-on-surface)]">
                          {item.label}
                        </span>
                        {item.requiresMfa && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-warning-light px-2 py-0.5 text-[10px] font-medium text-warning-text">
                            <Icon name="gpp_maybe" className="h-3 w-3" />
                            2FA
                          </span>
                        )}
                        {item.juniorGated && (
                          <span className="inline-flex items-center rounded-full bg-error-light px-2 py-0.5 text-[10px] font-medium text-error-text">
                            Juniordata
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[var(--color-outline)] mt-0.5">
                        {item.description}
                      </p>
                      {item.requires && item.requires.length > 0 && (
                        <p className="text-[11px] text-[var(--color-outline)] mt-1">
                          Krever:{" "}
                          <span
                            className={
                              missingPrereq && isChecked
                                ? "text-error-text font-medium"
                                : ""
                            }
                          >
                            {item.requires.join(", ")}
                          </span>
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
