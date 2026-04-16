"use client";

import { Target, Circle, BarChart3, Calendar, Brain, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

interface QuickQuestion {
  id: string;
  text: string;
  message: string;
  icon: React.ReactNode;
  category: "technique" | "mental" | "analysis" | "planning" | "fitness";
}

const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: "draw",
    text: "Hvordan slår jeg en draw?",
    message: "Hvordan slår jeg en draw? Gi meg konkrete tips basert på mitt nivå.",
    icon: <Target className="w-4 h-4" />,
    category: "technique",
  },
  {
    id: "putting",
    text: "Tips for bedre putting",
    message: "Jeg vil ha tips for å forbedre puttingen min. Hvilke driller bør jeg gjøre?",
    icon: <Circle className="w-4 h-4" />,
    category: "technique",
  },
  {
    id: "analyze",
    text: "Analyser siste runde",
    message: "Kan du analysere min siste runde og fortelle meg hva jeg bør fokusere på?",
    icon: <BarChart3 className="w-4 h-4" />,
    category: "analysis",
  },
  {
    id: "plan",
    text: "Lag treningsplan for denne uken",
    message: "Lag en treningsplan for denne uken basert på min profil og mål.",
    icon: <Calendar className="w-4 h-4" />,
    category: "planning",
  },
  {
    id: "mental",
    text: "Håndtere nervøsitet",
    message: "Hvordan kan jeg håndtere nervøsitet før viktige slag?",
    icon: <Brain className="w-4 h-4" />,
    category: "mental",
  },
  {
    id: "fitness",
    text: "Øvelser for mer avstand",
    message: "Hvilke fysiske øvelser kan hjelpe meg å få mer avstand?",
    icon: <Dumbbell className="w-4 h-4" />,
    category: "fitness",
  },
];

interface QuickQuestionsProps {
  onSelect: (message: string) => void;
  disabled?: boolean;
  variant?: "grid" | "chips";
}

export function QuickQuestions({ onSelect, disabled, variant = "grid" }: QuickQuestionsProps) {
  if (variant === "chips") {
    return (
      <>
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q.id}
            onClick={() => onSelect(q.message)}
            disabled={disabled}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 bg-grey-50 text-grey-600 border border-grey-200 hover:border-grey-300 hover:bg-grey-100"
          >
            <span className="text-grey-400">{q.icon}</span>
            <span className="truncate">{q.text}</span>
          </button>
        ))}
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
      {QUICK_QUESTIONS.map((q, index) => (
        <motion.button
          key={q.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(q.message)}
          disabled={disabled}
          className="flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 bg-grey-50 text-grey-600 border border-grey-200 hover:border-purple-200 hover:bg-purple-50/50 group"
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-grey-200 flex items-center justify-center text-grey-400 group-hover:text-purple-500 group-hover:border-purple-200 transition-colors">
            {q.icon}
          </span>
          <span className="font-medium">{q.text}</span>
        </motion.button>
      ))}
    </div>
  );
}
