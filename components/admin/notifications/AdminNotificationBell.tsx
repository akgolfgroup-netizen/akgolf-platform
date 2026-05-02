"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { NotificationPanel } from "./NotificationPanel";

interface AdminNotificationBellProps {
  className?: string;
}

export function AdminNotificationBell({ className }: AdminNotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  // Hent antall uleste notifikasjoner
  const fetchUnreadCount = async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/portal/admin/notifications", {
        method: "GET",
        signal,
      });

      // Stopp polling ved auth-feil — bruker er ikke innlogget som admin
      if (response.status === 401 || response.status === 403) {
        setIsAuthorized(false);
        return;
      }

      if (!response.ok) {
        return;
      }

      // Sikker JSON-parsing (endepunktet kan returnere tom body)
      const text = await response.text();
      if (!text) return;

      const data = JSON.parse(text) as { unreadCount?: number };
      const newCount = data.unreadCount || 0;

      setUnreadCount((current) => {
        if (newCount > current) {
          setHasNewNotification(true);
          timeoutRef.current = window.setTimeout(() => {
            setHasNewNotification(false);
            timeoutRef.current = null;
          }, 2000);
        }

        return newCount;
      });
    } catch (error) {
      // Ignorer AbortError (cleanup)
      if (error instanceof Error && error.name === "AbortError") return;
      // Stille logging — ikke spam konsollen
    }
  };

  // Initial fetch — bruk timeout for å unngå sync setState-warning
  useEffect(() => {
    const controller = new AbortController();
    const id = window.setTimeout(() => {
      void fetchUnreadCount(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(id);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    // Stopp polling hvis ikke autorisert
    if (!isAuthorized) return;

    const controller = new AbortController();
    const interval = window.setInterval(() => {
      void fetchUnreadCount(controller.signal);
    }, 30000);

    return () => {
      controller.abort();
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      window.clearInterval(interval);
    };
  }, [isAuthorized]);

  // Skjul komponenten helt hvis ikke autorisert
  if (!isAuthorized) return null;

  return (
    <>
      <button
        onClick={() => setIsPanelOpen(true)}
        className={className}
        aria-label="Åpne notifikasjoner"
      >
        <div className="relative">
          <Icon name="notifications" className="w-4 h-4" />
          
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ 
                  scale: hasNewNotification ? [1, 1.3, 1] : 1,
                }}
                exit={{ scale: 0 }}
                transition={{ 
                  duration: hasNewNotification ? 0.3 : 0.15,
                }}
                className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-1 bg-[var(--color-error)] text-surface text-[9px] font-semibold rounded-full flex items-center justify-center"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
          
          {/* Ringing animation for new notifications */}
          {hasNewNotification && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="absolute inset-0 rounded-full bg-[var(--color-error)]/30"
            />
          )}
        </div>
      </button>

      <NotificationPanel 
        isOpen={isPanelOpen} 
        onClose={() => {
          setIsPanelOpen(false);
          fetchUnreadCount(); // Oppdater teller ved lukking
        }} 
      />
    </>
  );
}
