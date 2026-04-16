"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, Check, Loader2, Calendar, FileText, Trophy, Sparkles, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  linkUrl: string | null;
  linkText: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  sender?: {
    name: string | null;
    image: string | null;
  } | null;
}

interface GroupedNotifications {
  today: Notification[];
  yesterday: Notification[];
  thisWeek: Notification[];
  older: Notification[];
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [grouped, setGrouped] = useState<GroupedNotifications>({
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/portal/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        
        // Group notifications by date
        if (data.notifications) {
          setGrouped(groupNotificationsByDate(data.notifications));
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    setMarkingRead((prev) => [...prev, notificationId]);
    try {
      const response = await fetch("/api/portal/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setMarkingRead((prev) => prev.filter((id) => id !== notificationId));
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/portal/notifications/read-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return "Nå";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHours < 24) return `${diffHours}t`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BOOKING_CONFIRMED":
        return <Calendar className="w-4 h-4 text-[var(--color-success)]" />;
      case "BOOKING_CANCELLED":
        return <AlertCircle className="w-4 h-4 text-[var(--color-error)]" />;
      case "BOOKING_REMINDER":
        return <Clock className="w-4 h-4 text-[var(--color-brand)]" />;
      case "PLAN_READY":
      case "PLAN_GENERATED":
        return <FileText className="w-4 h-4 text-[var(--color-info)]" />;
      case "COACHING_SUMMARY":
        return <FileText className="w-4 h-4 text-[var(--color-brand)]" />;
      case "ACHIEVEMENT_UNLOCKED":
        return <Trophy className="w-4 h-4 text-[var(--color-warning)]" />;
      case "AI_INSIGHT":
        return <Sparkles className="w-4 h-4 text-[var(--color-brand)]" />;
      case "TRAINING_REMINDER":
        return <Clock className="w-4 h-4 text-[var(--color-info)]" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const groupNotificationsByDate = (notifications: Notification[]): GroupedNotifications => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const grouped: GroupedNotifications = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    for (const notification of notifications) {
      const createdAt = new Date(notification.createdAt);
      createdAt.setHours(0, 0, 0, 0);

      if (createdAt.getTime() === today.getTime()) {
        grouped.today.push(notification);
      } else if (createdAt.getTime() === yesterday.getTime()) {
        grouped.yesterday.push(notification);
      } else if (createdAt >= weekAgo) {
        grouped.thisWeek.push(notification);
      } else {
        grouped.older.push(notification);
      }
    }

    return grouped;
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const content = (
      <div
        className={cn(
          "flex items-start gap-3 p-3 rounded-xl transition-colors",
          notification.read
            ? "bg-transparent hover:bg-[var(--color-grey-100)]"
            : "bg-[var(--color-brand)]/5 hover:bg-[var(--color-brand)]/10 border-l-2 border-[var(--color-brand)]"
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-[var(--color-grey-200)] flex items-center justify-center flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm leading-tight",
              notification.read
                ? "text-[var(--color-grey-700)]"
                : "text-[var(--color-grey-900)] font-medium"
            )}
          >
            {notification.title}
          </p>
          <p className="text-xs text-[var(--color-grey-500)] mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-[var(--color-grey-400)]">
              {formatRelativeTime(notification.createdAt)}
            </span>
            {notification.linkUrl && (
              <span className="text-[10px] text-[var(--color-brand)]">
                {notification.linkText || "Se mer"}
              </span>
            )}
          </div>
        </div>
        {!notification.read && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              markAsRead(notification.id);
            }}
            disabled={markingRead.includes(notification.id)}
            className="p-1.5 rounded-lg hover:bg-[var(--color-grey-200)] transition-colors flex-shrink-0"
            title="Merk som lest"
          >
            {markingRead.includes(notification.id) ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-grey-400)]" />
            ) : (
              <Check className="w-3.5 h-3.5 text-[var(--color-grey-400)]" />
            )}
          </button>
        )}
      </div>
    );

    if (notification.linkUrl && !notification.read) {
      return (
        <Link
          href={notification.linkUrl}
          onClick={() => markAsRead(notification.id)}
          className="block"
        >
          {content}
        </Link>
      );
    }

    return <div className="block">{content}</div>;
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-2 py-1 text-[10px] font-medium text-[var(--color-grey-500)] uppercase tracking-wider">
      {title}
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2.5 rounded-xl transition-colors",
          isOpen
            ? "bg-[var(--color-grey-200)] text-[var(--color-grey-900)]"
            : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)]"
        )}
        aria-label="Notifikasjoner"
      >
        <Bell className="w-5 h-5" />
        
        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1.5 right-1.5 w-4 h-4 bg-[var(--color-error)] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[var(--color-grey-200)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-grey-200)]">
              <h3 className="font-semibold text-[var(--color-grey-900)]">Notifikasjoner</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={isLoading}
                  className="text-xs text-[var(--color-brand)] hover:text-[var(--color-brand)]/80 font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Markerer..." : "Merk alle som lest"}
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="w-10 h-10 mx-auto mb-3 text-[var(--color-grey-300)]" />
                  <p className="text-sm text-[var(--color-grey-500)]">Ingen notifikasjoner</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {/* I dag */}
                  {grouped.today.length > 0 && (
                    <>
                      <SectionHeader title="I dag" />
                      {grouped.today.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                    </>
                  )}
                  
                  {/* I går */}
                  {grouped.yesterday.length > 0 && (
                    <>
                      <SectionHeader title="I går" />
                      {grouped.yesterday.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                    </>
                  )}
                  
                  {/* Denne uken */}
                  {grouped.thisWeek.length > 0 && (
                    <>
                      <SectionHeader title="Denne uken" />
                      {grouped.thisWeek.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                    </>
                  )}
                  
                  {/* Eldre */}
                  {grouped.older.length > 0 && (
                    <>
                      <SectionHeader title="Eldre" />
                      {grouped.older.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-[var(--color-grey-200)] bg-[var(--color-grey-100)]">
              <Link
                href="/portal/profil"
                onClick={() => setIsOpen(false)}
                className="block text-xs text-center text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] transition-colors"
              >
                Se alle innstillinger
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
