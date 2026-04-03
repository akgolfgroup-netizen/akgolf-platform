// app/booking/components/QuizWizard.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Target, TrendingUp, Sprout, Building2, Calendar, RefreshCw, CircleDot, User, Users, UsersRound, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type Answer1 = "kort-sikt" | "langsiktig" | "nybegynner" | "bedrift";
type Answer2 = "ukentlig" | "sporadisk" | "engang";
type Answer3 = "alene" | "duo" | "gruppe";

interface QuizState {
  step: 1 | 2 | 3 | "result";
  answer1: Answer1 | null;
  answer2: Answer2 | null;
  answer3: Answer3 | null;
}

interface QuestionOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

const QUESTIONS: Record<1 | 2 | 3, { title: string; options: QuestionOption[] }> = {
  1: {
    title: "Hva er målet ditt?",
    options: [
      { value: "kort-sikt", label: "Bli bedre på kort sikt", icon: Target },
      { value: "langsiktig", label: "Systematisk utvikling over tid", icon: TrendingUp },
      { value: "nybegynner", label: "Jeg er helt ny til golf", icon: Sprout },
      { value: "bedrift", label: "Bedriftsevent / sosialt", icon: Building2 },
    ],
  },
  2: {
    title: "Hvor ofte vil du trene?",
    options: [
      { value: "ukentlig", label: "Ukentlig", icon: Calendar },
      { value: "sporadisk", label: "Av og til", icon: RefreshCw },
      { value: "engang", label: "Én gang", icon: CircleDot },
    ],
  },
  3: {
    title: "Alene eller med andre?",
    options: [
      { value: "alene", label: "Alene", icon: User },
      { value: "duo", label: "Med en venn", icon: Users },
      { value: "gruppe", label: "Gruppe", icon: UsersRound },
    ],
  },
};

function getResult(state: QuizState): { service: string; url: string } {
  const { answer1, answer2, answer3 } = state;

  // Early exits
  if (answer1 === "nybegynner") {
    return { service: "Foundation Test", url: "/booking/kategori/individuell" };
  }
  if (answer1 === "bedrift") {
    return { service: "Gruppetjenester", url: "/booking/kategori/gruppe" };
  }

  // Langsiktig path
  if (answer1 === "langsiktig") {
    if (answer2 === "ukentlig") return { service: "Performance Pro", url: "/booking/kategori/abonnement" };
    if (answer2 === "sporadisk") return { service: "Performance", url: "/booking/kategori/abonnement" };
    return { service: "Foundation Test", url: "/booking/kategori/individuell" };
  }

  // Kort-sikt path
  if (answer1 === "kort-sikt") {
    if (answer2 === "ukentlig") return { service: "Performance", url: "/booking/kategori/abonnement" };

    // Sporadisk/engang
    if (answer3 === "alene") return { service: "Flex 50 Solo", url: "/booking/kategori/individuell" };
    if (answer3 === "duo") return { service: "Flex 50 Duo", url: "/booking/kategori/gruppe" };
    if (answer3 === "gruppe") {
      return answer2 === "sporadisk"
        ? { service: "9 Hull Social", url: "/booking/kategori/gruppe" }
        : { service: "On-Course Par 3", url: "/booking/kategori/bane" };
    }
  }

  return { service: "Foundation Test", url: "/booking/kategori/individuell" };
}

export function QuizWizard() {
  const router = useRouter();
  const [state, setState] = useState<QuizState>({
    step: 1,
    answer1: null,
    answer2: null,
    answer3: null,
  });

  function handleAnswer(value: string) {
    if (state.step === 1) {
      const answer = value as Answer1;
      if (answer === "nybegynner" || answer === "bedrift") {
        setState({ ...state, answer1: answer, step: "result" });
      } else {
        setState({ ...state, answer1: answer, step: 2 });
      }
    } else if (state.step === 2) {
      const answer = value as Answer2;
      if (state.answer1 === "langsiktig" || answer === "ukentlig") {
        setState({ ...state, answer2: answer, step: "result" });
      } else {
        setState({ ...state, answer2: answer, step: 3 });
      }
    } else if (state.step === 3) {
      setState({ ...state, answer3: value as Answer3, step: "result" });
    }
  }

  function handleBack() {
    if (state.step === 2) setState({ ...state, step: 1, answer1: null });
    else if (state.step === 3) setState({ ...state, step: 2, answer2: null });
    else if (state.step === "result") {
      if (state.answer3) setState({ ...state, step: 3, answer3: null });
      else if (state.answer2) setState({ ...state, step: 2, answer2: null });
      else setState({ ...state, step: 1, answer1: null });
    }
  }

  const currentStep = state.step === "result" ? 3 : state.step;
  const result = state.step === "result" ? getResult(state) : null;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex gap-2 justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 w-8 rounded-full transition-colors ${
              s <= currentStep ? "bg-black" : "bg-grey-200"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {state.step !== "result" ? (
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              {QUESTIONS[state.step].title}
            </h2>

            <div className="space-y-3">
              {QUESTIONS[state.step].options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full flex items-center gap-4 p-4 bg-grey-100 rounded-[16px] hover:bg-grey-200 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-grey-200 flex items-center justify-center">
                      <Icon size={20} className="text-black" />
                    </div>
                    <span className="font-medium text-black">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-6">
              <Check size={32} strokeWidth={3} />
            </div>

            <h2 className="text-2xl font-bold mb-2">Vi anbefaler</h2>
            <p className="text-3xl font-bold text-black mb-6">{result?.service}</p>

            <button
              onClick={() => router.push(result?.url || "/booking")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors"
            >
              Se tjenester
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      {state.step !== 1 && (
        <button
          onClick={handleBack}
          className="mt-8 flex items-center gap-2 text-grey-500 hover:text-black transition-colors mx-auto"
        >
          <ArrowLeft size={16} />
          Tilbake
        </button>
      )}
    </div>
  );
}
