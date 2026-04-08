"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, MapPin, Users, Play, Plus, Search, ChevronRight, Clock } from "lucide-react";
import { QuickAction } from "@/components/portal/heritage/quick-action";

// Mock data
const mockSessions = [
  { id: "1", name: "Lørdagsrunde", course: "Bærums GK", players: 4, status: "active" as const, date: "I dag" },
  { id: "2", name: "Turnerings-forberedelse", course: "Oslo GK", players: 2, status: "completed" as const, date: "I går" },
  { id: "3", name: "Vennematch", course: "Vik Golf", players: 4, status: "completed" as const, date: "For 3 dager siden" },
];

const mockCourses = [
  { id: "1", name: "Bærums GK", location: "Bærum", par: 72 },
  { id: "2", name: "Oslo GK", location: "Oslo", par: 71 },
  { id: "3", name: "Vik Golf", location: "Stavanger", par: 72 },
  { id: "4", name: "Miklagard", location: "Akershus", par: 72 },
];

const challenges = [
  { id: "1", title: "Beat the Pro", description: "Slå coach Anders på Bærums GK", reward: "100 poeng", difficulty: "Hard" },
  { id: "2", title: "Birdie Challenge", description: "Få 3 birdies denne uken", reward: "50 poeng", difficulty: "Medium" },
  { id: "3", title: "Range Warrior", description: "Trene 5 timer på range", reward: "25 poeng", difficulty: "Easy" },
];

export default function SpillPage() {
  const [showNewGame, setShowNewGame] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Spill</h1>
          <p className="text-[#6b7366] mt-1">Start en runde, bli med i spill eller utforsk utfordringer</p>
        </div>
        <button
          onClick={() => setShowNewGame(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#154212] text-white text-sm font-medium hover:bg-[#0d2e0c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nytt spill
        </button>
      </div>

      {/* Active Game */}
      <div className="bg-gradient-to-br from-[#154212] to-[#0d2e0c] rounded-3xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#d2f000] text-[#1c1c16] text-xs font-bold">
              <Clock className="w-3 h-3" />
              Pågår
            </span>
            <h2 className="text-xl font-bold mt-3">Lørdagsrunde</h2>
            <p className="text-white/70 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              Bærums GK
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-[#d2f000]" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-white/20 border-2 border-[#154212] flex items-center justify-center text-xs font-bold"
              >
                S{i}
              </div>
            ))}
          </div>
          <span className="text-sm text-white/70">4 spillere</span>
        </div>

        <button className="w-full py-3 rounded-xl bg-[#d2f000] text-[#1c1c16] font-semibold hover:bg-[#b8d600] transition-colors flex items-center justify-center gap-2">
          <Play className="w-4 h-4" />
          Fortsett spill
        </button>
      </div>

      {/* Recent Games */}
      <div>
        <h3 className="font-semibold text-[#1c1c16] mb-4">Nylige spill</h3>
        <div className="space-y-3">
          {mockSessions.slice(1).map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-[#c2c9bb]/50 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
            >
              <div>
                <h4 className="font-medium text-[#1c1c16]">{session.name}</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-[#6b7366]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {session.course}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {session.players} spillere
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#8a9385]">{session.date}</span>
                <ChevronRight className="w-5 h-5 text-[#c2c9bb] ml-auto" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Course Explorer */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1c1c16]">Utforsk baner</h3>
          <button className="text-sm text-[#154212] hover:underline">Se alle</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-[#c2c9bb]/50 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-[#1c1c16]">{course.name}</h4>
                  <p className="text-sm text-[#6b7366] flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {course.location}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full bg-[#f7f3ea] text-xs font-medium text-[#6b7366]">
                  Par {course.par}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#f59e0b]" />
            <h3 className="font-semibold text-[#1c1c16]">Utfordringer</h3>
          </div>
          <span className="text-xs text-[#8a9385]">3 aktive</span>
        </div>
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="p-4 rounded-xl bg-[#f7f3ea] flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-[#1c1c16]">{challenge.title}</h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      challenge.difficulty === "Easy"
                        ? "bg-[#22c55e]/10 text-[#22c55e]"
                        : challenge.difficulty === "Medium"
                        ? "bg-[#f59e0b]/10 text-[#f59e0b]"
                        : "bg-[#ef4444]/10 text-[#ef4444]"
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-xs text-[#6b7366] mt-1">{challenge.description}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-[#154212]">{challenge.reward}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction href="#" icon={Search} label="Finn spillere" description="Søk etter venner" />
        <QuickAction href="#" icon={MapPin} label="Bane-database" description="Se alle baner" />
        <QuickAction href="#" icon={Trophy} label="Leaderboard" description="Se topplisten" />
      </div>

      {/* New Game Modal (simplified) */}
      {showNewGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-[#1c1c16] mb-4">Start nytt spill</h3>
            <div className="space-y-3">
              <button className="w-full p-4 rounded-xl bg-[#f7f3ea] text-left hover:bg-[#e8e4db] transition-colors">
                <span className="font-medium text-[#1c1c16]">Live scoring</span>
                <p className="text-sm text-[#6b7366]">Følg score i sanntid med venner</p>
              </button>
              <button className="w-full p-4 rounded-xl bg-[#f7f3ea] text-left hover:bg-[#e8e4db] transition-colors">
                <span className="font-medium text-[#1c1c16]">Match play</span>
                <p className="text-sm text-[#6b7366]">Hull-for-hull match mot andre</p>
              </button>
              <button className="w-full p-4 rounded-xl bg-[#f7f3ea] text-left hover:bg-[#e8e4db] transition-colors">
                <span className="font-medium text-[#1c1c16]">Practice round</span>
                <p className="text-sm text-[#6b7366]">Registrer en treningsrunde</p>
              </button>
            </div>
            <button
              onClick={() => setShowNewGame(false)}
              className="w-full mt-4 py-3 rounded-xl border border-[#c2c9bb] text-[#6b7366] hover:bg-[#f7f3ea] transition-colors"
            >
              Avbryt
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
