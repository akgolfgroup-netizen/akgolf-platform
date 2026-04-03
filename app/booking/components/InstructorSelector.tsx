"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shuffle, ArrowRight } from "lucide-react";
import { StepHeader } from "./StepHeader";
import { InstructorCard } from "./InstructorCard";
import type { Instructor, ServiceType } from "../types";

interface Props {
  service: ServiceType;
  instructors: Instructor[];
  onSelect: (instructor: Instructor | null) => void;
}

export function InstructorSelector({ service, instructors, onSelect }: Props) {
  const [selectedId, setSelectedId] = useState<string | "no-preference" | null>(null);

  function handleSelect(id: string | "no-preference") {
    setSelectedId(id);
  }

  function handleContinue() {
    if (selectedId === "no-preference") {
      // Pick first available instructor as fallback
      onSelect(instructors[0]);
    } else if (selectedId) {
      const instructor = instructors.find((i) => i.id === selectedId);
      if (instructor) onSelect(instructor);
    }
  }

  const canContinue = selectedId !== null;

  return (
    <div>
      <StepHeader
        eyebrow="Steg 2"
        heading="Velg instruktor"
        description={`Velg din foretrukne trener for ${service.name.toLowerCase()}`}
      />

      <div className="space-y-3 max-w-2xl">
        {/* No preference option */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => handleSelect("no-preference")}
          className={`
            relative w-full text-left rounded-[20px] p-5 transition-[border-color,background-color] duration-300 border-2 border-dashed
            ${selectedId === "no-preference"
              ? "border-black bg-grey-100"
              : "border-grey-300 hover:border-grey-400 bg-grey-100"
            }
          `}
        >
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className={`
                w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0
                ${selectedId === "no-preference" ? "bg-black" : "bg-grey-200"}
              `}
            >
              <Shuffle
                size={28}
                className={selectedId === "no-preference" ? "text-white" : "text-grey-500"}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-0.5 text-black">
                Ingen preferanse
              </h3>
              <p className="text-sm text-grey-500">
                Vi finner den beste tilgjengelige instruktoren
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium px-2.5 py-1 rounded-full bg-grey-200 text-grey-600">
                Raskest tilgjengelig
              </div>
            </div>

            {/* Selection circle */}
            <div
              className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                ${selectedId === "no-preference" ? "border-black bg-black" : "border-grey-300"}
              `}
            >
              {selectedId === "no-preference" && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3.5 h-3.5 text-white"
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

        {/* Instructor cards */}
        {instructors.map((instructor, index) => (
          <InstructorCard
            key={instructor.id}
            instructor={instructor}
            isSelected={selectedId === instructor.id}
            onClick={() => handleSelect(instructor.id)}
            index={index + 1}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-8 pt-6 border-t border-grey-200">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-btn w-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Velg tid
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
