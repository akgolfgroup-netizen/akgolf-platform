"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Zap,
  ChevronRight,
  Users,
  Trophy,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Strokes Gained Data
const strokesGainedData = [
  { subject: "Driving", A: 120, fullMark: 150 },
  { subject: "Approach", A: 98, fullMark: 150 },
  { subject: "Short Game", A: 86, fullMark: 150 },
  { subject: "Putting", A: 99, fullMark: 150 },
  { subject: "Recovery", A: 85, fullMark: 150 },
  { subject: "Mental", A: 65, fullMark: 150 },
];

// Sparkline data for stats
const girTrend = [
  { day: "M", value: 45 },
  { day: "T", value: 52 },
  { day: "W", value: 48 },
  { day: "T", value: 61 },
  { day: "F", value: 58 },
  { day: "S", value: 67 },
  { day: "S", value: 72 },
];

const scramblingTrend = [
  { day: "M", value: 38 },
  { day: "T", value: 42 },
  { day: "W", value: 45 },
  { day: "T", value: 43 },
  { day: "F", value: 48 },
  { day: "S", value: 52 },
  { day: "S", value: 55 },
];

const puttingTrend = [
  { day: "M", value: 1.8 },
  { day: "T", value: 1.75 },
  { day: "W", value: 1.72 },
  { day: "T", value: 1.68 },
  { day: "F", value: 1.65 },
  { day: "S", value: 1.62 },
  { day: "S", value: 1.58 },
];

// IUP Training Plan Data
const iupWeeks = [
  { week: 1, focus: "Setup & Grip", completed: true },
  { week: 2, focus: "Backswing", completed: true },
  { week: 3, focus: "Transition", completed: true },
  { week: 4, focus: "Downswing", completed: false, current: true },
  { week: 5, focus: "Impact", completed: false },
  { week: 6, focus: "Follow Through", completed: false },
  { week: 7, focus: "Short Game", completed: false },
  { week: 8, focus: "Putting", completed: false },
  { week: 9, focus: "Course Strategy", completed: false },
  { week: 10, focus: "Mental Game", completed: false },
  { week: 11, focus: "Competition Prep", completed: false },
  { week: 12, focus: "Assessment", completed: false },
];

// 20-Min Session Cards
const sessionTypes = [
  {
    title: "The Swing Fix",
    description: "Rask analyse av ett spesifikt svingproblem",
    price: "450,-",
    popular: true,
  },
  {
    title: "Short Game Tune-Up",
    description: "Fokus på putting eller chipping",
    price: "450,-",
    popular: false,
  },
  {
    title: "Trackman Check",
    description: "Svingdata og ballflyt analyse",
    price: "450,-",
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">
          Mission Control
        </h1>
        <p className="text-[#666666]">
          Welcome back, Coach. You have 3 sessions today.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Strokes Gained Radar - Large Card */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-7">
          <Card className="p-6 bg-white border-[#e5e1d8] h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#333333]">Strokes Gained</h2>
                <p className="text-sm text-[#666666]">Performance Radar</p>
              </div>
              <div className="flex items-center gap-2 text-[#DFFF00] bg-[#2D5A27] px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-bold">+2.4</span>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={strokesGainedData}>
                  <PolarGrid stroke="#e5e1d8" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#666666", fontSize: 12 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#2D5A27"
                    fill="#2D5A27"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Target"
                    dataKey="fullMark"
                    stroke="#DFFF00"
                    fill="#DFFF00"
                    fillOpacity={0.1}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats - 3 Cards */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-5 space-y-4">
          {/* GIR % */}
          <Card className="p-5 bg-white border-[#e5e1d8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666666]">Greens in Regulation</p>
                <p className="text-3xl font-bold text-[#333333]">72%</p>
                <p className="text-xs text-[#2D5A27] font-medium">+5% vs last week</p>
              </div>
              <div className="w-24 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={girTrend}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2D5A27"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Scrambling */}
          <Card className="p-5 bg-white border-[#e5e1d8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666666]">Scrambling</p>
                <p className="text-3xl font-bold text-[#333333]">55%</p>
                <p className="text-xs text-[#DFFF00] font-medium">+12% vs last week</p>
              </div>
              <div className="w-24 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scramblingTrend}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#DFFF00"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Putting Average */}
          <Card className="p-5 bg-white border-[#e5e1d8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666666]">Putts per Round</p>
                <p className="text-3xl font-bold text-[#333333]">1.58</p>
                <p className="text-xs text-[#2D5A27] font-medium">-0.2 vs last week</p>
              </div>
              <div className="w-24 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={puttingTrend}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2D5A27"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI-IUP 12-Week Plan */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8">
          <Card className="p-6 bg-[#2D5A27] border-[#1a3d16]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#DFFF00] rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#2D5A27]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#F5F1E8]">AI-IUP Training Plan</h2>
                  <p className="text-sm text-[#a8c4a4]">12-Week Personalized Program</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#DFFF00]">Week 4</p>
                <p className="text-sm text-[#a8c4a4]">of 12</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-[#1a3d16] rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-[#DFFF00] rounded-full" />
              </div>
              <p className="text-xs text-[#a8c4a4] mt-2">25% Complete</p>
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-6 gap-2">
              {iupWeeks.map((week) => (
                <div
                  key={week.week}
                  className={`p-2 rounded-lg text-center transition-all ${
                    week.completed
                      ? "bg-[#1a3d16] text-[#DFFF00]"
                      : week.current
                      ? "bg-[#DFFF00] text-[#2D5A27]"
                      : "bg-[#1a3d16]/50 text-[#8fb88a]"
                  }`}
                >
                  <p className="text-xs font-bold">W{week.week}</p>
                  <p className="text-[10px] truncate">{week.focus}</p>
                </div>
              ))}
            </div>

            <Button className="mt-6 w-full bg-[#DFFF00] hover:bg-[#c8e600] text-[#2D5A27] font-bold">
              View Full Plan
            </Button>
          </Card>
        </motion.div>

        {/* Next Session */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4">
          <Card className="p-6 bg-white border-[#e5e1d8] h-full">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#2D5A27]" />
              <h2 className="text-lg font-bold text-[#333333]">Next Session</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-[#F5F1E8] rounded-xl border border-[#e5e1d8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#666666]">Today</span>
                  <span className="text-xs bg-[#DFFF00] text-[#2D5A27] px-2 py-0.5 rounded-full font-bold">
                    14:00
                  </span>
                </div>
                <h3 className="font-bold text-[#333333]">Ola Nordmann</h3>
                <p className="text-sm text-[#666666]">20-Min Swing Analysis</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#e5e1d8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#666666]">Today</span>
                  <span className="text-xs bg-[#2D5A27] text-[#F5F1E8] px-2 py-0.5 rounded-full font-bold">
                    15:30
                  </span>
                </div>
                <h3 className="font-bold text-[#333333]">Kari Hansen</h3>
                <p className="text-sm text-[#666666]">Trackman Session</p>
              </div>

              <Button variant="outline" className="w-full border-[#2D5A27] text-[#2D5A27] hover:bg-[#2D5A27] hover:text-[#F5F1E8]">
                View All Sessions
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* 20-Min Session Cards */}
        <motion.div variants={itemVariants} className="col-span-12">
          <h2 className="text-xl font-bold text-[#333333] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2D5A27]" />
            The 20-Minute Transformation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessionTypes.map((session) => (
              <Card
                key={session.title}
                className={`p-5 border transition-all duration-200 hover:shadow-lg ${
                  session.popular
                    ? "bg-[#2D5A27] border-[#1a3d16] text-white"
                    : "bg-white border-[#e5e1d8]"
                }`}
              >
                {session.popular && (
                  <span className="inline-block bg-[#DFFF00] text-[#2D5A27] text-xs font-bold px-2 py-1 rounded-full mb-3">
                    MOST POPULAR
                  </span>
                )}
                <h3
                  className={`font-bold text-lg mb-2 ${
                    session.popular ? "text-[#F5F1E8]" : "text-[#333333]"
                  }`}
                >
                  {session.title}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    session.popular ? "text-[#c8dcc4]" : "text-[#666666]"
                  }`}
                >
                  {session.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-2xl font-bold ${
                      session.popular ? "text-[#DFFF00]" : "text-[#2D5A27]"
                    }`}
                  >
                    kr {session.price}
                  </span>
                  <Button
                    size="sm"
                    className={
                      session.popular
                        ? "bg-[#DFFF00] text-[#2D5A27] hover:bg-[#c8e600]"
                        : "bg-[#2D5A27] text-[#F5F1E8] hover:bg-[#1a3d16]"
                    }
                  >
                    Book Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
