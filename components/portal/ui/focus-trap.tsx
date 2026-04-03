"use client";

import { useEffect, useRef, useCallback, ReactNode } from "react";

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  onEscape?: () => void;
  initialFocus?: "first" | "last" | "none";
  returnFocus?: boolean;
}

/**
 * Focus trap component for modals and dialogs.
 * Keeps focus within the container and handles Escape key.
 */
export function FocusTrap({
  children,
  active = true,
  onEscape,
  initialFocus = "first",
  returnFocus = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const elements = containerRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    return Array.from(elements).filter(
      (el) => el.offsetParent !== null // Filter out hidden elements
    );
  }, []);

  // Store previously focused element and set initial focus
  useEffect(() => {
    if (!active) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    if (initialFocus !== "none") {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        const targetIndex = initialFocus === "last" ? focusableElements.length - 1 : 0;
        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => {
          focusableElements[targetIndex]?.focus();
        });
      }
    }

    return () => {
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, initialFocus, returnFocus, getFocusableElements]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onEscape) {
        event.preventDefault();
        event.stopPropagation();
        onEscape();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift+Tab on first element -> go to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      // Tab on last element -> go to first
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, onEscape, getFocusableElements]);

  return (
    <div ref={containerRef} className="contents">
      {children}
    </div>
  );
}
