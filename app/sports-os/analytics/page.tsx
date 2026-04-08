"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { month: "Jan", score: 85, handicap: 18 },
  { month: "Feb", score: 82, handicap: 16 },
  { month: "Mar", score: 79, handicap: 15 },
  { month: "Apr", score: 76, handicap: 14 },
];

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#333333]">Analytics</h1>
        <p className="text-[#666666]">Track your performance over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-[#e5e1d8]">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[#2D5A27]" />
            <span className="text-[#666666]">Handicap</span>
          </div>
          <p className="text-3xl font-bold text-[#333333]">14.2</p>
          <p className="text-sm text-[#2D5A27]">↓ 3.8 from start</p>
        </Card>

        <Card className="p-6 bg-white border-[#e5e1d8]">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-[#DFFF00]" />
            <span className="text-[#666666]">Avg Score</span>
          </div>
          <p className="text-3xl font-bold text-[#333333]">76.4</p>
          <p className="text-sm text-[#2D5A27]">↓ 8.6 from start</p>
        </Card>

        <Card className="p-6 bg-white border-[#e5e1d8]">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-[#2D5A27]" />
            <span className="text-[#666666]">Sessions</span>
          </div>
          <p className="text-3xl font-bold text-[#333333]">24</p>
          <p className="text-sm text-[#666666]">This season</p>
        </Card>
      </div>

      <Card className="p-6 bg-white border-[#e5e1d8]">
        <h2 className="text-xl font-bold text-[#333333] mb-4">Score Trend</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2D5A27" strokeWidth={3} />
              <Line type="monotone" dataKey="handicap" stroke="#DFFF00" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
