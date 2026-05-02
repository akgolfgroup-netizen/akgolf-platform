"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useEffect, useCallback, useRef } from "react";
import { Video, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import Link from "next/link";
import type { NotificationWithDetails, GroupedNotifications } from "@/lib/portal/notifications/types";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = "all" | "booking" | "coaching" | "video" | "system" | "urgent";

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<NotificationWithDetails[]>([]);
  const [grouped, setGrouped] = useState<GroupedNotifications | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Hent notifikasjoner
  const fetchNotifications = useCallback(async (reset = false) => {
    if (!isOpen) return;
    
    setIsLoading(true);
    try {
      const newOffset = reset ? 0 : offset;
      const params = new URLSearchParams();
      if (activeFilter !== "all") params.set("type", activeFilter);
      params.set("limit", "50");
      params.set("offset", String(newOffset));

      const response = await fetch(`/api/portal/admin/notifications?${params}`);
      if (response.ok) {
        const data = await response.json();
        
        if (reset) {
          setNotifications(data.notifications || []);
        } else {
          setNotifications((prev) => [...prev, ...(data.notifications || [])]);
        }
        
        setGrouped(data.grouped || null);
        setUnreadCount(data.unreadCount || 0);
        setHasMore(data.hasMore || false);
        setOffset(newOffset + (data.notifications?.length || 0));
      }
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, activeFilter, offset]);

  // Initial fetch og polling
  useEffect(() => {
    fetchNotifications(true);
    
    const interval = setInterval(() => fetchNotifications(true), 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Spill lyd for nye notifikasjoner
  useEffect(() => {
    if (soundEnabled && unreadCount > 0) {
      playNotificationSound();
    }
  }, [unreadCount, soundEnabled]);

  // Lukk ved klikk utenfor
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const playNotificationSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/notification.mp3");
    }
    audioRef.current.play().catch(() => {
      // Ignorer autoplay-restrictions
    });
  };

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

  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/portal/notifications/read-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdminNotification: true }),
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

  const getNotificationIcon = (type: string, adminType: string | null) => {
    switch (adminType) {
      case "booking":
        return <Icon name="calendar_today" className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "coaching":
        return <Icon name="description" className="w-4 h-4" />;
      case "urgent":
        return <Icon name="error" className="w-4 h-4 text-[var(--color-error)]" />;
      case "system":
      default:
        return <Icon name="notifications" className="w-4 h-4" />;
    }
  };

  const getFilterIcon = (filter: FilterType) => {
    switch (filter) {
      case "booking":
        return <Icon name="calendar_today" className="w-3.5 h-3.5" />;
      case "coaching":
        return <Icon name="description" className="w-3.5 h-3.5" />;
      case "video":
        return <Video className="w-3.5 h-3.5" />;
      case "urgent":
        return <Icon name="error" className="w-3.5 h-3.5" />;
      case "system":
        return <Icon name="settings" className="w-3.5 h-3.5" />;
      default:
        return <Icon name="notifications" className="w-3.5 h-3.5" />;
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

  const NotificationItem = ({ notification }: { notification: NotificationWithDetails }) => {
    const content = (
      <div
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer group",
          notification.read
            ? "bg-transparent hover:bg-[var(--color-surface-container)]"
            : "bg-[var(--color-on-surface)]/5 hover:bg-[var(--color-on-surface)]/10 border-l-2 border-[var(--color-on-surface)]"
        )}
        onClick={() => !notification.read && markAsRead(notification.id)}
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          notification.read
            ? "bg-[var(--color-surface-container)] text-[var(--color-outline)]"
            : "bg-[var(--color-on-surface)]/10 text-[var(--color-on-surface)]"
        )}>
          {getNotificationIcon(notification.type, notification.adminType)}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-xs leading-tight",
            notification.read
              ? "text-[var(--color-outline)]"
              : "text-[var(--color-on-surface)] font-medium"
          )}>
            {notification.title}
          </p>
          <p className="text-[11px] text-[var(--color-outline)] mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-[var(--color-outline)]">
              {formatRelativeTime(notification.createdAt.toString())}
            </span>
            
            {notification.linkUrl && (
              <Link
                href={notification.linkUrl}
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] text-[var(--color-on-surface)] hover:underline flex items-center gap-0.5"
              >
                {notification.linkText || "Se detaljer"}
                <Icon name="chevron_right" className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
        
        {!notification.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification.id);
            }}
            disabled={markingRead.includes(notification.id)}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
            title="Merk som lest"
          >
            {markingRead.includes(notification.id) ? (
              <Icon name="progress_activity" className="w-3.5 h-3.5 animate-spin text-[var(--color-outline)]" />
            ) : (
              <Icon name="check" className="w-3.5 h-3.5 text-[var(--color-outline)]" />
            )}
          </button>
        )}
      </div>
    );

    return content;
  };

  const FilterButton = ({ filter, label }: { filter: FilterType; label: string }) => (
    <button
      onClick={() => {
        setActiveFilter(filter);
        setOffset(0);
        fetchNotifications(true);
      }}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors",
        activeFilter === filter
          ? "bg-[var(--color-on-surface)] text-[var(--color-surface)]"
          : "bg-[var(--color-surface-container)] text-[var(--color-outline)] hover:text-[var(--color-on-surface)]"
      )}
    >
      {getFilterIcon(filter)}
      {label}
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-on-surface/20 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.2 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-[var(--color-surface-container-lowest)] border-l border-[var(--color-outline-variant)] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-outline-variant)]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Icon name="notifications" className="w-5 h-5 text-[var(--color-on-surface)]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-error)] text-surface text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-on-surface)]">Notifikasjoner</h2>
                  <p className="text-[10px] text-[var(--color-outline)]">
                    {unreadCount > 0 ? `${unreadCount} uleste` : "Ingen nye"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-lg text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
                  title={soundEnabled ? "Skru av lyd" : "Skru på lyd"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
                
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={isLoading}
                    className="p-2 rounded-lg text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
                    title="Merk alle som lest"
                  >
                    {isLoading ? (
                      <Icon name="progress_activity" className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon name="check" className="w-4 h-4" />
                    )}
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
                >
                  <Icon name="close" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-outline-variant)] overflow-x-auto">
              <FilterButton filter="all" label="Alle" />
              <FilterButton filter="booking" label="Bookinger" />
              <FilterButton filter="coaching" label="Coaching" />
              <FilterButton filter="video" label="Video" />
              <FilterButton filter="urgent" label="Haster" />
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && notifications.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <Icon name="progress_activity" className="w-6 h-6 animate-spin text-[var(--color-outline)]" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <Icon name="notifications" className="w-12 h-12 text-[var(--color-outline)] mb-3" />
                  <p className="text-sm text-[var(--color-outline)]">Ingen notifikasjoner</p>
                  <p className="text-[11px] text-[var(--color-outline)] mt-1">
                    Du vil se varsler om bookinger, videoer og meldinger her
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {/* I dag */}
                  {grouped?.today && grouped.today.length > 0 && (
                    <>
                      <div className="px-2 py-1 text-[10px] font-medium text-[var(--color-outline)] uppercase tracking-wider">
                        I dag
                      </div>
                      {grouped.today.map((n) => (
                        <NotificationItem key={n.id} notification={n} />
                      ))}
                    </>
                  )}
                  
                  {/* I går */}
                  {grouped?.yesterday && grouped.yesterday.length > 0 && (
                    <>
                      <div className="px-2 py-1 mt-3 text-[10px] font-medium text-[var(--color-outline)] uppercase tracking-wider">
                        I går
                      </div>
                      {grouped.yesterday.map((n) => (
                        <NotificationItem key={n.id} notification={n} />
                      ))}
                    </>
                  )}
                  
                  {/* Denne uken */}
                  {grouped?.thisWeek && grouped.thisWeek.length > 0 && (
                    <>
                      <div className="px-2 py-1 mt-3 text-[10px] font-medium text-[var(--color-outline)] uppercase tracking-wider">
                        Denne uken
                      </div>
                      {grouped.thisWeek.map((n) => (
                        <NotificationItem key={n.id} notification={n} />
                      ))}
                    </>
                  )}
                  
                  {/* Eldre */}
                  {grouped?.older && grouped.older.length > 0 && (
                    <>
                      <div className="px-2 py-1 mt-3 text-[10px] font-medium text-[var(--color-outline)] uppercase tracking-wider">
                        Eldre
                      </div>
                      {grouped.older.map((n) => (
                        <NotificationItem key={n.id} notification={n} />
                      ))}
                    </>
                  )}
                  
                  {/* Load more */}
                  {hasMore && (
                    <button
                      onClick={() => fetchNotifications()}
                      disabled={isLoading}
                      className="w-full py-2 text-[11px] text-[var(--color-on-surface)] hover:text-[var(--color-on-surface)]/80 transition-colors"
                    >
                      {isLoading ? "Laster..." : "Last flere"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
