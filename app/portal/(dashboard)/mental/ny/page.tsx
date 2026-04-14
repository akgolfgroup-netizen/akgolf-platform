"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ChevronLeft, Calendar, MapPin } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function NewRoundPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [course, setCourse] = useState("");
  const [score, setScore] = useState("");

  async function handleStart() {
    if (!course.trim()) return;
    setSaving(true);
    // Mock API call
    await new Promise((res) => setTimeout(res, 600));
    const mockId = "r-" + Math.random().toString(36).slice(2, 8);
    setSaving(false);
    router.push(`/portal/mental/${mockId}`);
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_APPLE }}
        className="flex items-center gap-3"
      >
        <Link
          href="/portal/mental"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#D5DFDB] text-[#0A1F18] hover:bg-[#F5F8F7] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F18]">Ny mental scorecard</h1>
          <p className="text-[#7A8C85] mt-1">Start en ny runde-logg</p>
        </div>
      </motion.div>

      <PremiumCard delay={0.1} padding="lg" radius="large">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A8C85] mb-1.5">
              Dato
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C85]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white border border-[#D5DFDB] text-[#0A1F18] focus:outline-none focus:ring-2 focus:ring-[#0A1F18]/10 focus:border-[#0A1F18]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A8C85] mb-1.5">
              Bane
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C85]" />
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="F.eks. Losby GK"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white border border-[#D5DFDB] text-[#0A1F18] placeholder:text-[#A5B2AD] focus:outline-none focus:ring-2 focus:ring-[#0A1F18]/10 focus:border-[#0A1F18]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A8C85] mb-1.5">
              Score (valgfritt)
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="F.eks. 78"
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white border border-[#D5DFDB] text-[#0A1F18] placeholder:text-[#A5B2AD] focus:outline-none focus:ring-2 focus:ring-[#0A1F18]/10 focus:border-[#0A1F18]"
            />
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleStart}
            isLoading={saving}
            disabled={!course.trim()}
          >
            <Save className="w-4 h-4 mr-2" />
            Start runde
          </Button>
        </div>
      </PremiumCard>
    </div>
  );
}
