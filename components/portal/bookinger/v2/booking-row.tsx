"use client";

import Link from "next/link";
import {
  Clock,
  MapPin,
  ExternalLink,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  X,
} from "lucide-react";
import type { BookingViewModel } from "@/components/portal/booking/booking-types";
import {
  avatarColor,
  dayPartShort,
  formatTimeRange,
  getInitials,
} from "./booking-utils";

type Variant = "upcoming" | "past" | "cancelled";

interface BookingRowProps {
  booking: BookingViewModel;
  variant?: Variant;
  onCancel?: (id: string) => void;
}

export function BookingRow({
  booking,
  variant = "upcoming",
  onCancel,
}: BookingRowProps) {
  const dp = dayPartShort(booking.startTime);
  const timeRange = formatTimeRange(booking.startTime, booking.duration);
  const isCancelled = variant === "cancelled" || booking.status === "cancelled";
  const isPast = variant === "past" || booking.status === "completed";

  return (
    <div
      className="grid items-center gap-5 mb-2.5 transition-colors"
      style={{
        background: isCancelled ? "rgba(244,146,131,0.04)" : "#0D2E23",
        border: isCancelled
          ? "1px solid rgba(244,146,131,0.20)"
          : "1px solid #1a4a3a",
        borderRadius: 14,
        padding: "16px 22px",
        gridTemplateColumns: "88px 1fr auto auto",
        opacity: isPast ? 0.75 : 1,
      }}
    >
      <div
        className="text-center"
        style={{
          background: isPast
            ? "rgba(255,255,255,0.02)"
            : "rgba(255,255,255,0.04)",
          borderRadius: 10,
          padding: "10px 6px",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
          }}
        >
          {dp.day}
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: "2px 0",
          }}
        >
          {dp.num}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
          }}
        >
          {dp.mo}
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
          {isCancelled ? (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(244,146,131,0.20)",
                color: "#F49283",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              Avlyst
            </span>
          ) : isPast ? (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(42,125,90,0.25)",
                color: "#6FCBA1",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              Gjennomført
            </span>
          ) : (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(209,248,67,0.18)",
                color: "#D1F843",
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {booking.type === "coaching" ? "1-til-1" : "Trening"}
            </span>
          )}
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.01em",
              textDecoration: isCancelled ? "line-through" : undefined,
              opacity: isCancelled ? 0.6 : 1,
            }}
          >
            {booking.serviceName}
          </div>
        </div>
        <div
          className="flex items-center gap-3.5 flex-wrap"
          style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}
        >
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" strokeWidth={2} /> {timeRange}
          </span>
          {booking.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" strokeWidth={2} /> {booking.location}
            </span>
          )}
        </div>
      </div>

      <div
        className="flex items-center gap-2.5"
        style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}
      >
        <div
          className="grid place-items-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: avatarColor(booking.instructorName),
            color: "#0A1F18",
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          {getInitials(booking.instructorName)}
        </div>
        <span className="hidden sm:inline">{booking.instructorName}</span>
      </div>

      <div className="flex gap-1.5">
        {isCancelled ? (
          <Link
            href="/portal/bookinger/ny"
            className="inline-flex items-center gap-1.5"
            style={{
              padding: "6px 12px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              background: "transparent",
              color: "rgba(255,255,255,0.8)",
              border: "1px solid transparent",
            }}
          >
            <Repeat className="w-3.5 h-3.5" strokeWidth={2} /> Book igjen
          </Link>
        ) : (
          <>
            <Link
              href={`/portal/bookinger/${booking.id}`}
              aria-label="Åpne booking"
              className="grid place-items-center"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "transparent",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid transparent",
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
            <button
              type="button"
              aria-label="Send melding"
              className="grid place-items-center"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "transparent",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid transparent",
              }}
            >
              <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            {onCancel && !isPast && (
              <button
                type="button"
                onClick={() => onCancel(booking.id)}
                aria-label="Avbestill"
                className="grid place-items-center"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.06)",
                  color: "#F49283",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            )}
            {(isPast || !onCancel) && (
              <button
                type="button"
                aria-label="Mer"
                className="grid place-items-center"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <MoreHorizontal className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
