"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AIRecommendationCardProps {
  title?: string;
  recommendation?: string | null;
}

export function AIRecommendationCard({
  title = "AI-anbefaling",
  recommendation,
}: AIRecommendationCardProps) {
  return (
    <div className="portal-ai-card h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-4">
        <motion.div
          className="w-8 h-8 rounded-lg bg-[#AF52DE] flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
        <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6B21A8]">
          {title}
        </span>
      </div>

      <p className="text-[15px] text-[#0A1F18] leading-relaxed flex-1">
        {recommendation ||
          "Logg din forste okt eller runde for a fa personlige anbefalinger basert pa dine data."}
      </p>

      <div className="flex gap-3 mt-5">
        <Link
          href="/portal/treningsplan"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#AF52DE] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-3 h-3" />
          Se treningsplan
        </Link>
        <Link
          href="/portal/analyse"
          className="inline-flex items-center px-4 py-2.5 rounded-full border border-[#E9D5FF] text-[#6B21A8] text-xs font-semibold hover:bg-[#F3E8FF] transition-colors"
        >
          Ny anbefaling
        </Link>
      </div>
    </div>
  );
}
