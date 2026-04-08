"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle, Circle, Clock, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const weeks = [
  { week: 1, title: "Setup & Grip", status: "completed" },
  { week: 2, title: "Backswing Basics", status: "completed" },
  { week: 3, title: "Backswing Depth", status: "completed" },
  { week: 4, title: "Transition", status: "current" },
  { week: 5, title: "Downswing", status: "locked" },
  { week: 6, title: "Impact Position", status: "locked" },
  { week: 7, title: "Short Game Basics", status: "locked" },
  { week: 8, title: "Putting", status: "locked" },
  { week: 9, title: "Course Strategy", status: "locked" },
  { week: 10, title: "Mental Game", status: "locked" },
  { week: 11, title: "Competition Prep", status: "locked" },
  { week: 12, title: "Assessment", status: "locked" },
];

export default function IUPPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#333333] mb-2">AI-IUP Training Plan</h1>
        <p className="text-[#666666]">Your personalized 12-week development program</p>
      </div>

      <Card className="p-6 bg-[#2D5A27] border-[#1a3d16]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#DFFF00] rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-[#2D5A27]" />
            </div>
            <div>
              <p className="text-[#a8c4a4] text-sm">Progress</p>
              <p className="text-3xl font-bold text-[#F5F1E8]">35%</p>
            </div>
          </div>
          <Button className="bg-[#DFFF00] text-[#2D5A27] font-bold">
            <Zap className="w-4 h-4 mr-2" />
            View This Week
          </Button>
        </div>
        <div className="h-3 bg-[#1a3d16] rounded-full overflow-hidden">
          <div className="h-full w-[35%] bg-[#DFFF00] rounded-full" />
        </div>
      </Card>

      <Card className="p-6 bg-white border-[#e5e1d8]">
        <h2 className="text-xl font-bold text-[#333333] mb-4">12-Week Journey</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {weeks.map((week) => (
            <div
              key={week.week}
              className={`p-4 rounded-xl border-2 ${
                week.status === "completed" ? "bg-[#2D5A27] border-[#2D5A27] text-white" :
                week.status === "current" ? "bg-[#DFFF00] border-[#DFFF00] text-[#2D5A27]" :
                "bg-white border-[#e5e1d8]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">Week {week.week}</span>
                {week.status === "completed" && <CheckCircle className="w-4 h-4" />}
                {week.status === "current" && <Circle className="w-4 h-4 fill-current" />}
                {week.status === "locked" && <Clock className="w-4 h-4 text-[#999999]" />}
              </div>
              <h3 className="font-bold text-sm">{week.title}</h3>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
