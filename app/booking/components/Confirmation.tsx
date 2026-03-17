"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Calendar, User, Clock, ArrowRight } from "lucide-react";

interface Props {
  serviceName: string;
  instructorName: string;
  dateTime: string;
  isNewUser: boolean;
}

// Animated checkmark component
function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mx-auto mb-6 relative"
    >
      {/* Outer ring animation */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-gold/30"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      {/* Inner circle with checkmark */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-[#D4B87A] flex items-center justify-center shadow-lg shadow-gold/30">
        <motion.svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}

// Confetti particles
function Confetti() {
  const colors = ["#B8975C", "#0F2950", "#D4B87A", "#1a2d3d"];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: "-10%",
          }}
          animate={{
            y: [0, 400],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, 360],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function Confirmation({ serviceName, instructorName, dateTime, isNewUser }: Props) {
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

  return (
    <div className="relative">
      <Confetti />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg mx-auto"
      >
        <AnimatedCheckmark />

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-navy mb-2"
        >
          Booking bekreftet!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-ink-50 mb-8"
        >
          Din coaching-time er booket og betalt. Vi gleder oss til å se deg!
        </motion.p>

        {/* Booking summary card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-card text-left mb-6 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-navy to-navy/90 px-6 py-4 -mx-6 -mt-6 mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Calendar size={18} className="text-gold" />
              Bookingdetaljer
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-gold" />
              </div>
              <div>
                <p className="text-xs text-ink-40 uppercase tracking-wider mb-0.5">Tjeneste</p>
                <p className="font-medium text-ink-90">{serviceName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-gold" />
              </div>
              <div>
                <p className="text-xs text-ink-40 uppercase tracking-wider mb-0.5">Trener</p>
                <p className="font-medium text-ink-90">{instructorName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-gold" />
              </div>
              <div>
                <p className="text-xs text-ink-40 uppercase tracking-wider mb-0.5">Dato og tid</p>
                <p className="font-medium text-ink-90 capitalize">
                  {formattedDate}, {formattedTime}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* New user info card */}
        {isNewUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="w-card border-gold/30 bg-gradient-to-br from-gold/5 to-transparent flex items-start gap-4 text-left mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
              <Mail size={24} className="text-gold" />
            </div>
            <div>
              <p className="font-semibold text-ink-90 mb-1">
                Sjekk e-posten din
              </p>
              <p className="text-sm text-ink-50 leading-relaxed">
                Vi har sendt deg en e-post med en lenke for å sette passord og
                logge inn på <span className="text-gold font-medium">AK Golf Portal</span>. 
                Der kan du se bookinger, treningsplaner og coaching-notater.
              </p>
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link 
            href="/" 
            className="w-btn w-btn-primary flex-1 flex items-center justify-center gap-2"
          >
            Tilbake til forsiden
            <ArrowRight size={18} />
          </Link>
          
          {isNewUser && (
            <Link 
              href="/portal" 
              className="w-btn w-btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              Gå til portalen
              <ArrowRight size={18} />
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
