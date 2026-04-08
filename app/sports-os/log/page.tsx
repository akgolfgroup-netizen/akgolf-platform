"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const entries = [
  { id: 1, date: "Apr 14, 2026", title: "Great round at Skjeberg", type: "Round", score: 76 },
  { id: 2, date: "Apr 12, 2026", title: "20-min Swing Fix", type: "Session", focus: "Backswing" },
  { id: 3, date: "Apr 10, 2026", title: "Practice session", type: "Practice", duration: 90 },
];

export default function LogPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Training Log</h1>
          <p className="text-[#666666]">Record your progress and sessions</p>
        </div>
        <Button className="bg-[#DFFF00] text-[#2D5A27] font-bold">
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-5 bg-white border-[#e5e1d8] hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F5F1E8] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#2D5A27]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#333333]">{entry.title}</h3>
                  <p className="text-sm text-[#666666] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {entry.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-[#2D5A27] text-[#F5F1E8] text-sm font-bold rounded-full">
                  {entry.type}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
