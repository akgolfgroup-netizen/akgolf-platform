"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationPanel } from "./NotificationPanel";

interface AdminNotificationBellProps {
  className?: string;
}

export function AdminNotificationBell({ className }: AdminNotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Hent antall uleste notifikasjoner
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/portal/admin/notifications", {
        method: "HEAD",
      });

      if (response.ok) {
        const data = await response.json();
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
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchUnreadCount();
    };

    void load();
    const interval = window.setInterval(load, 30000);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsPanelOpen(true)}
        className={className}
        aria-label="Åpne notifikasjoner"
      >
        <div className="relative">
          <Bell className="w-4 h-4" />
          
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
                className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-1 bg-[var(--hg-error)] text-white text-[9px] font-semibold rounded-full flex items-center justify-center"
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
              className="absolute inset-0 rounded-full bg-[var(--hg-error)]/30"
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
