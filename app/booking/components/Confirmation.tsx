"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, Clock, MapPin, CreditCard, Mail, ArrowRight, Download } from "lucide-react";

interface Props {
  serviceName: string;
  instructorName: string;
  dateTime: string;
  duration?: number;
  price?: number;
  isNewUser: boolean;
  bookingRef?: string;
}

// Animated checkmark component
function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="w-20 h-20 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-6 relative"
    >
      {/* Outer ring animation */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[var(--color-success)]/30"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.3, opacity: 0 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Inner circle with checkmark */}
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.path
          d="M5 13l4 4L19 7"
          stroke="var(--color-success)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        />
      </motion.svg>
    </motion.div>
  );
}

// Confetti particles with pre-generated values to avoid Math.random in render
// Apple Light Theme: black, grey, green accents
const CONFETTI_PARTICLES = [
  { id: 0, color: "#1D1D1F", left: 15, x: 45, duration: 2.5, delay: 0.1 },
  { id: 1, color: "var(--color-success)", left: 28, x: -32, duration: 3.2, delay: 0.2 },
  { id: 2, color: "#86868B", left: 42, x: 18, duration: 2.8, delay: 0.05 },
  { id: 3, color: "var(--color-success)", left: 55, x: -65, duration: 3.5, delay: 0.3 },
  { id: 4, color: "#1D1D1F", left: 68, x: 28, duration: 2.2, delay: 0.15 },
  { id: 5, color: "#D2D2D7", left: 82, x: -42, duration: 3.8, delay: 0.25 },
  { id: 6, color: "#86868B", left: 12, x: 55, duration: 2.6, delay: 0.35 },
  { id: 7, color: "var(--color-success)", left: 35, x: -15, duration: 3.0, delay: 0.08 },
  { id: 8, color: "#1D1D1F", left: 48, x: 72, duration: 2.4, delay: 0.22 },
  { id: 9, color: "var(--color-success)", left: 62, x: -48, duration: 3.3, delay: 0.12 },
  { id: 10, color: "#D2D2D7", left: 75, x: 38, duration: 2.7, delay: 0.4 },
  { id: 11, color: "var(--color-success)", left: 88, x: -25, duration: 3.6, delay: 0.18 },
  { id: 12, color: "#1D1D1F", left: 22, x: 62, duration: 2.3, delay: 0.28 },
  { id: 13, color: "#86868B", left: 38, x: -55, duration: 3.1, delay: 0.38 },
  { id: 14, color: "#D2D2D7", left: 52, x: 35, duration: 2.9, delay: 0.02 },
  { id: 15, color: "var(--color-success)", left: 65, x: -72, duration: 3.4, delay: 0.32 },
  { id: 16, color: "#1D1D1F", left: 78, x: 22, duration: 2.1, delay: 0.42 },
  { id: 17, color: "#86868B", left: 92, x: -38, duration: 3.7, delay: 0.06 },
  { id: 18, color: "#D2D2D7", left: 8, x: 48, duration: 2.5, delay: 0.16 },
  { id: 19, color: "var(--color-success)", left: 45, x: -62, duration: 3.9, delay: 0.26 },
];

function Confetti() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {CONFETTI_PARTICLES.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: `${particle.left}%`,
            top: "-10%",
          }}
          animate={{
            y: [0, 400],
            x: [0, particle.x],
            rotate: [0, 360],
            opacity: [1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function generateCalendarLinks(
  title: string,
  dateTime: string,
  duration: number,
  location: string
) {
  const start = new Date(dateTime);
  const end = new Date(start.getTime() + duration * 60 * 1000);

  // Format for Google Calendar
  const googleStart = start.toISOString().replace(/-|:|\.\d{3}/g, "");
  const googleEnd = end.toISOString().replace(/-|:|\.\d{3}/g, "");
  const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${googleStart}/${googleEnd}&location=${encodeURIComponent(location)}`;

  // Format for Outlook
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    title
  )}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&location=${encodeURIComponent(
    location
  )}`;

  // Generate ICS content
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AK Golf//Booking//NO
BEGIN:VEVENT
DTSTART:${googleStart}
DTEND:${googleEnd}
SUMMARY:${title}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

  const icsUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  return { googleUrl, outlookUrl, icsUrl };
}

export function Confirmation({
  serviceName,
  instructorName,
  dateTime,
  duration = 60,
  price,
  isNewUser,
  bookingRef,
}: Props) {
  const date = new Date(dateTime);

  const formattedDate = date.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = new Date(date.getTime() + duration * 60 * 1000);
  const formattedEndTime = endTime.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const calendarTitle = `Golfcoaching: ${serviceName}`;
  const location = "AK Golf Academy, Fredrikstad";
  const { googleUrl, outlookUrl, icsUrl } = generateCalendarLinks(
    calendarTitle,
    dateTime,
    duration,
    location
  );

  return (
    <div className="relative max-w-xl mx-auto">
      <Confetti />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <AnimatedCheckmark />

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-black mb-2"
        >
          Booking bekreftet!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-grey-500 mb-4"
        >
          Vi har sendt en bekreftelse til din e-post
        </motion.p>

        {bookingRef && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-sm text-grey-500 mb-8"
          >
            Referansenummer:{" "}
            <span className="font-mono text-black bg-grey-100 px-2 py-1 rounded">
              {bookingRef}
            </span>
          </motion.p>
        )}

        {/* Booking details card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-grey-100 rounded-[20px] p-6 text-left mb-6"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-grey-200">
              <span className="text-grey-500 flex items-center gap-2">
                <Calendar size={16} className="text-black" />
                Tjeneste
              </span>
              <span className="font-medium text-black">{serviceName}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-grey-200">
              <span className="text-grey-500 flex items-center gap-2">
                <User size={16} className="text-black" />
                Instruktor
              </span>
              <span className="font-medium text-black">{instructorName}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-grey-200">
              <span className="text-grey-500 flex items-center gap-2">
                <Calendar size={16} className="text-black" />
                Dato
              </span>
              <span className="font-medium text-black capitalize">{formattedDate}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-grey-200">
              <span className="text-grey-500 flex items-center gap-2">
                <Clock size={16} className="text-black" />
                Tid
              </span>
              <span className="font-medium text-black">
                {formattedTime} - {formattedEndTime}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-grey-200">
              <span className="text-grey-500 flex items-center gap-2">
                <MapPin size={16} className="text-black" />
                Sted
              </span>
              <span className="font-medium text-black">{location}</span>
            </div>

            {price && (
              <div className="flex justify-between items-center py-2">
                <span className="text-grey-500 flex items-center gap-2">
                  <CreditCard size={16} className="text-[var(--color-success)]" />
                  Betalt
                </span>
                <span className="font-medium text-black">
                  kr {price.toLocaleString("nb-NO")}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Calendar buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h4 className="text-sm font-semibold text-black mb-3">Legg til i kalender</h4>
          <div className="flex flex-wrap justify-center gap-2">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-btn w-btn-secondary text-sm flex items-center gap-2"
            >
              <Calendar size={16} />
              Google
            </a>
            <a
              href={outlookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-btn w-btn-secondary text-sm flex items-center gap-2"
            >
              <Calendar size={16} />
              Outlook
            </a>
            <a
              href={icsUrl}
              download="booking.ics"
              className="w-btn w-btn-secondary text-sm flex items-center gap-2"
            >
              <Download size={16} />
              iCal
            </a>
          </div>
        </motion.div>

        {/* New user info card */}
        {isNewUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-grey-100 border border-grey-200 rounded-[20px] p-4 flex items-start gap-4 text-left mb-6"
          >
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-black mb-1">Sjekk e-posten din</p>
              <p className="text-sm text-grey-500 leading-relaxed">
                Vi har sendt deg en e-post med en lenke for a sette passord og logge inn pa{" "}
                <span className="text-black font-medium">AK Golf Portal</span>. Der kan du se
                bookinger, treningsplaner og coaching-notater.
              </p>
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-6 border-t border-grey-200 space-y-3"
        >
          <Link
            href="/portal/bookinger"
            className="w-btn w-btn-primary w-full flex items-center justify-center gap-2"
          >
            Ga til mine bookinger
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/booking"
            className="w-btn w-btn-ghost w-full flex items-center justify-center gap-2 text-grey-500"
          >
            Book ny time
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
