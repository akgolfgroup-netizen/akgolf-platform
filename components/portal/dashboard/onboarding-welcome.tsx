"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Target,
  BookOpen,
  Calendar,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface OnboardingStep {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: {
    label: string;
    href: string;
  };
  completed: boolean;
}

interface OnboardingWelcomeProps {
  userName: string;
  completedSteps?: string[];
  onDismiss?: () => void;
}

const defaultSteps: Omit<OnboardingStep, "completed">[] = [
  {
    id: "profile",
    icon: Target,
    title: "Sett opp profilen din",
    description: "Legg til handicap, hjemmeklubb og treningsmal",
    action: { label: "Oppdater profil", href: "/portal/innstillinger" },
  },
  {
    id: "first-session",
    icon: BookOpen,
    title: "Logg din forste okt",
    description: "Start a bygge treningshistorikken din",
    action: { label: "Logg okt", href: "/portal/dagbok" },
  },
  {
    id: "book-coaching",
    icon: Calendar,
    title: "Book en coachingtime",
    description: "Fa personlig veiledning fra en proff",
    action: { label: "Se ledige timer", href: "/portal/booking" },
  },
  {
    id: "set-goals",
    icon: TrendingUp,
    title: "Definer dine mal",
    description: "Sett konkrete mal for sesongen",
    action: { label: "Sett mal", href: "/portal/mal" },
  },
];

export function OnboardingWelcome({
  userName,
  completedSteps = [],
  onDismiss,
}: OnboardingWelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  const steps: OnboardingStep[] = defaultSteps.map((step) => ({
    ...step,
    completed: completedSteps.includes(step.id),
  }));

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;
  const firstName = userName.split(" ")[0];

  // All steps completed
  if (completedCount === steps.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="portal-card rounded-2xl overflow-hidden"
      >
        <div className="relative p-8 text-center">
          {/* Celebration background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-amber-500/5 to-transparent" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="relative inline-flex mb-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-lg shadow-gold/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h2 className="relative text-xl font-bold text-white mb-2">
            Velkommen til AK Golf, {firstName}!
          </h2>
          <p className="relative text-sm text-[var(--portal-text-muted)] mb-6 max-w-md mx-auto">
            Du er na klar til a ta golfen din til neste niva. Utforsk dashboardet og start reisen mot bedre golf!
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDismiss}
            className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-white font-medium shadow-lg shadow-gold/20 cursor-pointer"
          >
            La oss begynne
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="portal-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="relative p-5 pb-4 border-b border-white/5">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-amber-500/5 to-transparent" />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-amber-500/10 flex items-center justify-center"
            >
              <Play className="w-6 h-6 text-gold" />
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Velkommen, {firstName}!
              </h2>
              <p className="text-sm text-[var(--portal-text-muted)]">
                Fullfør oppsettet for å komme i gang
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-[var(--portal-text-muted)]" />
            </motion.div>
          </button>
        </div>

        {/* Progress bar */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between text-xs text-[var(--portal-text-muted)] mb-2">
            <span>{completedCount} av {steps.length} fullfort</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-2">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx === currentStep && !step.completed;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative p-4 rounded-xl transition-all duration-300 ${
                      step.completed
                        ? "bg-emerald-500/5 border border-emerald-500/20"
                        : isActive
                        ? "bg-gold/5 border border-gold/20"
                        : "bg-white/[0.02] border border-white/5 hover:bg-[var(--color-grey-100)]"
                    }`}
                    onMouseEnter={() => !step.completed && setCurrentStep(idx)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Step indicator */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          step.completed
                            ? "bg-emerald-500"
                            : isActive
                            ? "bg-gradient-to-br from-gold/20 to-amber-500/10"
                            : "bg-[var(--color-grey-100)]"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                          <Icon
                            className={`w-5 h-5 ${
                              isActive ? "text-gold" : "text-[var(--portal-text-muted)]"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            step.completed
                              ? "text-emerald-400 line-through"
                              : "text-white"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-[var(--portal-text-muted)] mt-0.5">
                          {step.description}
                        </p>
                      </div>

                      {/* Action button */}
                      {!step.completed && (
                        <Link
                          href={step.action.href}
                          className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? "bg-gold text-black hover:bg-gold/90"
                              : "bg-[var(--color-grey-100)] text-white hover:bg-[var(--color-grey-200)]"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {step.action.label}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Skip option */}
            <div className="px-5 pb-5">
              <button
                onClick={onDismiss}
                className="w-full py-2 text-xs text-[var(--portal-text-muted)] hover:text-white transition-colors cursor-pointer"
              >
                Hopp over for na
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
