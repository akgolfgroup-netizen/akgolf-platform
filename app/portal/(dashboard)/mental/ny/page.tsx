"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ChevronLeft, Calendar, MapPin, Loader2 } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

interface Course {
  id: string;
  name: string;
  location: string;
}

export default function NewRoundPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [score, setScore] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/portal/courses");
        if (res.ok) {
          const data = await res.json();
          const list: Course[] = Array.isArray(data) ? data : data.courses || [];
          setCourses(list);
          if (list.length > 0) {
            setCourseId(list[0].id);
            setCourseName(list[0].name);
          }
        }
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, []);

  async function handleStart() {
    if (!courseId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/portal/ai/mental/rounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseName, courseId }),
      });
      const data = await res.json();
      if (res.ok && data.roundId) {
        router.push(`/portal/mental/${data.roundId}`);
      }
    } finally {
      setSaving(false);
    }
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
              {loadingCourses ? (
                <div className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white border border-[#D5DFDB] text-[#7A8C85] flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Laster baner...
                </div>
              ) : courses.length === 0 ? (
                <div className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white border border-[#D5DFDB] text-[#7A8C85]">
                  Ingen baner funnet
                </div>
              ) : (
                <select
                  value={courseId}
                  onChange={(e) => {
                    const selected = courses.find((c) => c.id === e.target.value);
                    setCourseId(e.target.value);
                    setCourseName(selected?.name ?? "");
                  }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm bg-white border border-[#D5DFDB] text-[#0A1F18] focus:outline-none focus:ring-2 focus:ring-[#0A1F18]/10 focus:border-[#0A1F18] appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%237A8C85' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                  }}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
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
            disabled={!courseId || loadingCourses}
          >
            <Save className="w-4 h-4 mr-2" />
            Start runde
          </Button>
        </div>
      </PremiumCard>
    </div>
  );
}
