"use client";

/**
 * SessionContextMenu — flytende dropdown-meny som vises ved høyreklikk
 * på en eksisterende økt i treningsplanleggeren.
 *
 * Posisjoneres ved cursoren og lukkes ved klikk utenfor eller Escape.
 * Foreløpig én handling: "Dupliser" — kan utvides senere.
 */

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";

export interface SessionContextMenuItem {
  id: string;
  label: string;
  iconName: string;
  onSelect: () => void | Promise<void>;
  disabled?: boolean;
  /** Hvis true: rendres med danger-styling (f.eks. for Slett senere). */
  destructive?: boolean;
}

interface Props {
  x: number;
  y: number;
  items: SessionContextMenuItem[];
  onClose: () => void;
}

export function SessionContextMenu({ x, y, items, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function handleScroll() {
      onClose();
    }
    // Bruk capture for å fange klikk før event bobler opp
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  // Hold menyen innenfor viewport
  const menuWidth = 200;
  const menuHeight = items.length * 40 + 12;
  const adjustedX =
    typeof window !== "undefined" && x + menuWidth > window.innerWidth
      ? window.innerWidth - menuWidth - 8
      : x;
  const adjustedY =
    typeof window !== "undefined" && y + menuHeight > window.innerHeight
      ? window.innerHeight - menuHeight - 8
      : y;

  return (
    <div
      ref={ref}
      role="menu"
      className="fixed z-50 min-w-[180px] overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest py-1.5 shadow-card-hover"
      style={{ top: adjustedY, left: adjustedX }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          onClick={async () => {
            if (item.disabled) return;
            await item.onSelect();
            onClose();
          }}
          className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] font-semibold transition-colors disabled:opacity-40 ${
            item.destructive
              ? "text-error hover:bg-error-container/30"
              : "text-on-surface hover:bg-surface-container"
          }`}
        >
          <Icon
            name={item.iconName}
            size={14}
            className={item.destructive ? "text-error" : "text-on-surface-variant"}
          />
          {item.label}
        </button>
      ))}
    </div>
  );
}
