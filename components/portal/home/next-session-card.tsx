"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";

interface NextSessionCardProps {
  session: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    groupName?: string;
    location?: string;
    instructor?: string;
  } | null;
}

export function NextSessionCard({ session }: NextSessionCardProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!session) return;
    const target = new Date(`${session.date}T${session.startTime}`);

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
      setIsUrgent(diff < 3600000);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session) return null;

  return (
    <Link href={`/portal/bookinger/${session.id}`}>
      <motion.div
        className={`p-5 rounded-xl border ${
          isUrgent
            ? "border-gold ring-2 ring-gold/20"
            : "border-[#E5E5E5]"
        } bg-white hover:shadow-lg transition-shadow`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-xs font-semibold text-gold uppercase mb-2">
          Neste okt
        </p>
        <h3 className="text-lg font-bold text-[#171717]">{session.title}</h3>

        <div className="flex gap-4 mt-3 text-sm text-[#737373]">
          {session.groupName && (
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {session.groupName}
            </span>
          )}
          {session.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {session.location}
            </span>
          )}
          {session.instructor && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Med {session.instructor}
            </span>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          {(["hours", "minutes", "seconds"] as const).map((unit) => (
            <div key={unit} className="text-center">
              <div className="text-2xl font-mono font-bold text-[#171717]">
                {String(timeLeft[unit]).padStart(2, "0")}
              </div>
              <div className="text-xs text-[#737373]">
                {unit === "hours" ? "t" : unit === "minutes" ? "m" : "s"}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
