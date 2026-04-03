"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
        relative w-full text-left rounded-[20px] p-5 transition-[border-color,background-color,color] duration-300 border-2
        ${isSelected
          ? "border-black bg-black text-white"
          : "border-grey-200 bg-white hover:border-grey-300"
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className={`
          relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0
          ${isSelected ? "ring-2 ring-white" : "ring-2 ring-grey-200"}
        `}>
          {instructor.user.image ? (
            <Image
              src={instructor.user.image}
              alt={instructor.user.name || "Trener"}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              sizes="64px"
            />
          ) : (
            <div className={`
              w-full h-full flex items-center justify-center text-lg font-semibold
              ${isSelected ? "bg-white text-black" : "bg-grey-100 text-grey-500"}
            `}>
              {(instructor.user.name?.[0] || "T").toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg mb-0.5 ${isSelected ? "text-white" : "text-black"}`}>
            {instructor.user.name || "Trener"}
          </h3>
          <p className={`text-sm ${isSelected ? "text-white/70" : "text-grey-500"}`}>
            {instructor.title || "Golfcoach"}
          </p>
        </div>

        {/* Selection circle */}
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${isSelected
            ? "border-white bg-white"
            : "border-grey-300"
          }
        `}>
          {isSelected && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3.5 h-3.5 text-black"
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
