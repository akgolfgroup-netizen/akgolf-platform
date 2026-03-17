"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { Instructor } from "../types";

interface InstructorCardProps {
  instructor: Instructor;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function InstructorCard({ instructor, isSelected, onClick, index }: InstructorCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`
        relative w-full text-left rounded-2xl p-5 transition-all duration-300
        ${isSelected 
          ? "bg-navy text-white shadow-lg shadow-navy/20" 
          : "bg-white hover:bg-gray-50 border border-ink-20 hover:border-gold/50"
        }
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          layoutId="selection"
          className="absolute inset-0 border-2 border-gold rounded-2xl"
          initial={false}
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className={`
          relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0
          ${isSelected ? "ring-2 ring-gold" : "ring-2 ring-ink-10"}
        `}>
          {instructor.user.image ? (
            <img
              src={instructor.user.image}
              alt={instructor.user.name || "Trener"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`
              w-full h-full flex items-center justify-center text-lg font-semibold
              ${isSelected ? "bg-gold text-navy" : "bg-ink-10 text-ink-50"}
            `}>
              {(instructor.user.name?.[0] || "T").toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg mb-0.5 ${isSelected ? "text-white" : "text-ink-90"}`}>
            {instructor.user.name || "Trener"}
          </h3>
          <p className={`text-sm ${isSelected ? "text-white/70" : "text-ink-50"}`}>
            {instructor.title || "Golfcoach"}
          </p>
          
          {/* Badge */}
          <div className={`
            inline-flex items-center gap-1.5 mt-2 text-xs font-medium px-2.5 py-1 rounded-full
            ${isSelected 
              ? "bg-gold/20 text-gold" 
              : "bg-navy/5 text-navy"
            }
          `}>
            <Award size={12} />
            <span>PGA-sertifisert</span>
          </div>
        </div>

        {/* Selection circle */}
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${isSelected 
            ? "border-gold bg-gold" 
            : "border-ink-20"
          }
        `}>
          {isSelected && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3.5 h-3.5 text-navy"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </div>
      </div>
    </motion.button>
  );
}
