"use client";



import { Icon } from "@/components/ui/icon";
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
    icon: <Icon name="my_location" className="w-4 h-4" />,
    category: "technique",
  },
  {
    id: "putting",
    text: "Tips for bedre putting",
    message: "Jeg vil ha tips for å forbedre puttingen min. Hvilke driller bør jeg gjøre?",
    icon: <Icon name="circle" className="w-4 h-4" />,
    category: "technique",
  },
  {
    id: "analyze",
    text: "Analyser siste runde",
    message: "Kan du analysere min siste runde og fortelle meg hva jeg bør fokusere på?",
    icon: <Icon name="bar_chart" className="w-4 h-4" />,
    category: "analysis",
  },
  {
    id: "plan",
    text: "Lag treningsplan for denne uken",
    message: "Lag en treningsplan for denne uken basert på min profil og mål.",
    icon: <Icon name="calendar_today" className="w-4 h-4" />,
    category: "planning",
  },
  {
    id: "mental",
    text: "Håndtere nervøsitet",
    message: "Hvordan kan jeg håndtere nervøsitet før viktige slag?",
    icon: <Icon name="psychology" className="w-4 h-4" />,
    category: "mental",
  },
  {
    id: "fitness",
    text: "Øvelser for mer avstand",
    message: "Hvilke fysiske øvelser kan hjelpe meg å få mer avstand?",
    icon: <Icon name="fitness_center" className="w-4 h-4" />,
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
          className="flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 bg-grey-50 text-grey-600 border border-grey-200 hover:border-ai/20 hover:bg-ai-light/50 group"
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-grey-200 flex items-center justify-center text-grey-400 group-hover:text-ai group-hover:border-ai/20 transition-colors">
            {q.icon}
          </span>
          <span className="font-medium">{q.text}</span>
        </motion.button>
      ))}
    </div>
  );
}
