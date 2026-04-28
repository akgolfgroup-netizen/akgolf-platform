"use client";

import Link from "next/link";
import { User, MapPin, Clock, Map, MessageCircle, X } from "lucide-react";
import type { BookingViewModel } from "@/components/portal/booking/booking-types";
import { dayPartShort, formatTimeRange, nextLabel } from "./booking-utils";

interface NextBookingHeroProps {
  booking: BookingViewModel;
  onCancel?: (id: string) => void;
}

export function NextBookingHero({ booking, onCancel }: NextBookingHeroProps) {
  const dp = dayPartShort(booking.startTime);
  const timeRange = formatTimeRange(booking.startTime, booking.duration);

  return (
    <section
      className="grid gap-7 items-center mb-7 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 90% 30%, rgba(209,248,67,0.16), transparent 50%), linear-gradient(135deg, rgba(13,46,35,0.95), rgba(10,31,24,1))",
        border: "1.5px solid rgba(209,248,67,0.30)",
        borderRadius: 18,
        padding: "28px 32px",
        gridTemplateColumns: "100px 1fr auto",
      }}
    >
      <div
        className="text-center"
        style={{
          background: "rgba(209,248,67,0.10)",
          border: "1px solid rgba(209,248,67,0.25)",
          borderRadius: 14,
          padding: "14px 8px",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "#D1F843",
            textTransform: "uppercase",
          }}
        >
          {dp.day}
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 38,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            margin: "4px 0 2px",
          }}
        >
          {dp.num}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
          }}
        >
          {dp.mo}
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#D1F843",
          }}
        >
          {nextLabel(booking.startTime)}
        </div>
        <h2
          style={{
            margin: "6px 0",
            fontSize: 26,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
          }}
        >
          {booking.serviceName}
        </h2>
        <div
          className="flex items-center gap-4 flex-wrap"
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 13,
          }}
        >
          <span className="inline-flex items-center gap-1.5">
            <User className="w-3 h-3" strokeWidth={2} /> Med{" "}
            <strong style={{ color: "#fff", fontWeight: 700 }}>
              {booking.instructorName}
            </strong>
          </span>
          {booking.location && (
            <>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.3)",
                }}
              />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3 h-3" strokeWidth={2} />
                {booking.location}
              </span>
            </>
          )}
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
            }}
          />
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3 h-3" strokeWidth={2} />
            {timeRange}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
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
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          href={`/portal/bookinger/${booking.id}`}
          className="inline-flex items-center gap-1.5"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            background: "#D1F843",
            color: "#0A1F18",
            border: "1px solid #D1F843",
            boxShadow:
              "0 0 0 1px rgba(209,248,67,0.20), 0 4px 16px rgba(209,248,67,0.20)",
          }}
        >
          <Map className="w-3.5 h-3.5" strokeWidth={2} /> Veibeskrivelse
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-1.5"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            background: "rgba(255,255,255,0.06)",
            color: "#E6EAE8",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} /> Send melding
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={() => onCancel(booking.id)}
            className="inline-flex items-center gap-1.5"
            style={{
              padding: "6px 12px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              background: "transparent",
              color: "#F49283",
              border: "1px solid transparent",
            }}
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} /> Avbestill
          </button>
        )}
      </div>
    </section>
  );
}
