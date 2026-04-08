"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  X,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface SessionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  date: Date;
  duration?: number;
  location?: string;
  instructor?: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "coaching" | "training" | "tournament" | "booking";
  onCancel?: () => void;
  onReschedule?: () => void;
  delay?: number;
}

const typeStyles = {
  coaching: {
    bg: "bg-[#154212]/10",
    border: "border-[#154212]/20",
    text: "text-[#154212]",
    label: "Coaching",
  },
  training: {
    bg: "bg-[#3b82f6]/10",
    border: "border-[#3b82f6]/20",
    text: "text-[#3b82f6]",
    label: "Trening",
  },
  tournament: {
    bg: "bg-[#f59e0b]/10",
    border: "border-[#f59e0b]/20",
    text: "text-[#f59e0b]",
    label: "Turnering",
  },
  booking: {
    bg: "bg-[#8b5cf6]/10",
    border: "border-[#8b5cf6]/20",
    text: "text-[#8b5cf6]",
    label: "Booking",
  },
};

export function SessionCard({
  title,
  subtitle,
  date,
  duration,
  location,
  instructor,
  status,
  type,
  onCancel,
  onReschedule,
  delay = 0,
}: SessionCardProps) {
  const styles = typeStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "bg-white rounded-2xl p-5 border shadow-sm",
        "hover:shadow-md transition-all duration-300",
        status === "cancelled" && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                styles.bg,
                styles.text
              )}
            >
              {styles.label}
            </span>
            {status === "completed" && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-[#22c55e]">
                <CheckCircle2 className="w-3 h-3" />
                Fullført
              </span>
            )}
          </div>

          <h3 className="font-semibold text-[#1c1c16] truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-[#6b7366] mt-0.5">{subtitle}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[#8a9385]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(date, "EEEE d. MMMM", { locale: nb })}
            </span>
            {duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {duration} min
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            )}
            {instructor && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {instructor}
              </span>
            )}
          </div>
        </div>

        {status === "upcoming" && (
          <div className="flex items-center gap-1 ml-4">
            {onReschedule && (
              <button
                onClick={onReschedule}
                className="p-2 rounded-lg text-[#8a9385] hover:text-[#154212] hover:bg-[#f7f3ea] transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-2 rounded-lg text-[#8a9385] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
