"use client";

import * as React from "react";
import { Search } from "lucide-react";

export interface AdminCommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
  keywords?: string[];
  action: () => void;
}

interface AdminCommandPaletteProps {
  items: AdminCommandItem[];
  placeholder?: string;
  shortcut?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AdminCommandPalette({
  items,
  placeholder = "Søk etter sider, elever, handlinger...",
  shortcut = "k",
  open: controlledOpen,
  onOpenChange,
}: AdminCommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const key = shortcut.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key) {
        event.preventDefault();
        setOpen(!open);
      }
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen, shortcut]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => {
      const haystack = [
        item.label,
        item.description ?? "",
        ...(item.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, AdminCommandItem[]>();
    for (const item of filtered) {
      const group = item.group ?? "Handlinger";
      const list = map.get(group) ?? [];
      list.push(item);
      map.set(group, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const flat = React.useMemo(
    () => grouped.flatMap(([, list]) => list),
    [grouped],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(flat.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = flat[activeIndex];
      if (item) {
        item.action();
        setOpen(false);
      }
    }
  };

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Kommandopalett"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-muted)",
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: "var(--color-muted)" }}
        >
          <Search className="w-4 h-4" style={{ color: "var(--color-muted)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--color-text)" }}
          />
          <kbd
            className="text-[10px] px-1.5 py-0.5 rounded border"
            style={{
              borderColor: "var(--color-muted)",
              color: "var(--color-muted)",
            }}
          >
            ESC
          </kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div
              className="px-4 py-6 text-center text-sm"
              style={{ color: "var(--color-muted)" }}
            >
              Ingen treff.
            </div>
          ) : (
            grouped.map(([group, list]) => (
              <div key={group} className="mb-2 last:mb-0">
                <div
                  className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--color-muted)" }}
                >
                  {group}
                </div>
                {list.map((item) => {
                  runningIndex += 1;
                  const isActive = runningIndex === activeIndex;
                  const currentIndex = runningIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(currentIndex)}
                      onClick={() => {
                        item.action();
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                      style={{
                        background: isActive
                          ? "var(--color-primary)"
                          : "transparent",
                        color: isActive
                          ? "var(--color-surface)"
                          : "var(--color-text)",
                      }}
                    >
                      {item.icon && (
                        <span className="flex items-center justify-center w-4 h-4">
                          {item.icon}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.label}</div>
                        {item.description && (
                          <div
                            className="text-xs truncate"
                            style={{
                              color: isActive
                                ? "var(--color-surface)"
                                : "var(--color-muted)",
                              opacity: isActive ? 0.8 : 1,
                            }}
                          >
                            {item.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
