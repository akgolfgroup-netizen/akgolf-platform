"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Trophy,
  Target,
  MessageCircle,
  ChevronRight,
  Search,
  Bell,
  Heart,
  Share2,
} from "lucide-react";
import { QuickAction } from "@/components/portal/heritage/quick-action";

// Mock data
const mockFriends = [
  { id: "1", name: "Thomas Petersen", handicap: 8.5, status: "online" as const, lastActive: "Nå", avatar: "TP" },
  { id: "2", name: "Mari Olsen", handicap: 12.2, status: "offline" as const, lastActive: "2t siden", avatar: "MO" },
  { id: "3", name: "Erik Johansen", handicap: 15.8, status: "playing" as const, lastActive: "Spiller nå", avatar: "EJ" },
  { id: "4", name: "Sofia Larsen", handicap: 9.1, status: "online" as const, lastActive: "Nå", avatar: "SL" },
];

const mockActivity = [
  { id: "1", user: "Thomas Petersen", action: "registrerte en runde", details: "78 slag på Bærums GK", time: "15 min siden", likes: 3, comments: 1 },
  { id: "2", user: "Mari Olsen", action: "fullførte en utfordring", details: "Birdie Challenge", time: "1t siden", likes: 8, comments: 2 },
  { id: "3", user: "Erik Johansen", action: "booket en coaching-time", details: "Med Anders Kristiansen", time: "3t siden", likes: 2, comments: 0 },
];

const mockLeaderboard = [
  { rank: 1, name: "Thomas Petersen", handicap: 8.5, trend: "down", avatar: "TP" },
  { rank: 2, name: "Sofia Larsen", handicap: 9.1, trend: "same", avatar: "SL" },
  { rank: 3, name: "Anders Kristiansen", handicap: 15.2, trend: "down", avatar: "AK" },
  { rank: 4, name: "Mari Olsen", handicap: 12.2, trend: "up", avatar: "MO" },
  { rank: 5, name: "Erik Johansen", handicap: 15.8, trend: "same", avatar: "EJ" },
];

const mockGroups = [
  { id: "1", name: "Bærums GK Elite", members: 24, activity: "Høy", joined: true },
  { id: "2", name: "Turneringsspillere", members: 156, activity: "Medium", joined: true },
  { id: "3", name: "Weekend Warriors", members: 89, activity: "Lav", joined: false },
];

export default function SosialtPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "friends" | "leaderboard">("feed");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Sosialt</h1>
          <p className="text-[#6b7366] mt-1">Bli inspirert av andre spillere</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white border border-[#c2c9bb]/50 hover:bg-[#f7f3ea] transition-colors relative">
            <Bell className="w-5 h-5 text-[#6b7366]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ef4444]" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#154212] text-white text-sm font-medium hover:bg-[#0d2e0c] transition-colors">
            <UserPlus className="w-4 h-4" />
            Inviter venn
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-white border border-[#c2c9bb]/50 w-fit">
        {[
          { id: "feed", label: "Aktivitet", icon: Target },
          { id: "friends", label: "Venner", icon: Users },
          { id: "leaderboard", label: "Toppliste", icon: Trophy },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#154212] text-white"
                : "text-[#6b7366] hover:bg-[#f7f3ea]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed Tab */}
      {activeTab === "feed" && (
        <div className="space-y-6">
          {/* Activity Feed */}
          <div className="space-y-4">
            {mockActivity.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#154212] flex items-center justify-center text-white text-sm font-bold">
                    {item.user.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#1c1c16]">
                      <span className="font-semibold">{item.user}</span>{" "}
                      <span className="text-[#6b7366]">{item.action}</span>
                    </p>
                    <p className="text-sm text-[#154212] font-medium mt-1">{item.details}</p>
                    <p className="text-xs text-[#8a9385] mt-2">{item.time}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#c2c9bb]/30">
                      <button className="flex items-center gap-1 text-sm text-[#6b7366] hover:text-[#ef4444] transition-colors">
                        <Heart className="w-4 h-4" />
                        {item.likes}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-[#6b7366] hover:text-[#154212] transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {item.comments}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-[#6b7366] hover:text-[#154212] transition-colors">
                        <Share2 className="w-4 h-4" />
                        Del
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Groups */}
          <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1c1c16]">Dine grupper</h3>
              <button className="text-sm text-[#154212] hover:underline">Se alle</button>
            </div>
            <div className="space-y-3">
              {mockGroups.filter((g) => g.joined).map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f7f3ea] hover:bg-[#e8e4db] transition-colors cursor-pointer"
                >
                  <div>
                    <h4 className="font-medium text-[#1c1c16]">{group.name}</h4>
                    <p className="text-xs text-[#6b7366]">{group.members} medlemmer</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      group.activity === "Høy"
                        ? "bg-[#22c55e]/10 text-[#22c55e]"
                        : group.activity === "Medium"
                        ? "bg-[#f59e0b]/10 text-[#f59e0b]"
                        : "bg-[#8a9385]/10 text-[#8a9385]"
                    }`}
                  >
                    {group.activity} aktivitet
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Friends Tab */}
      {activeTab === "friends" && (
        <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 overflow-hidden">
          <div className="p-4 border-b border-[#c2c9bb]/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a9385]" />
              <input
                type="text"
                placeholder="Søk etter venner..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f7f3ea] border-none text-sm placeholder-[#8a9385] focus:outline-none focus:ring-2 focus:ring-[#154212]/20"
              />
            </div>
          </div>
          <div className="divide-y divide-[#c2c9bb]/30">
            {mockFriends.map((friend) => (
              <div key={friend.id} className="p-4 flex items-center justify-between hover:bg-[#f7f3ea] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#154212] flex items-center justify-center text-white text-sm font-bold">
                      {friend.avatar}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        friend.status === "online"
                          ? "bg-[#22c55e]"
                          : friend.status === "playing"
                          ? "bg-[#f59e0b]"
                          : "bg-[#8a9385]"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1c1c16]">{friend.name}</h4>
                    <p className="text-xs text-[#6b7366]">
                      HCP {friend.handicap} · {friend.lastActive}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-white transition-colors">
                  <MessageCircle className="w-4 h-4 text-[#6b7366]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 overflow-hidden">
          <div className="p-4 border-b border-[#c2c9bb]/30">
            <h3 className="font-semibold text-[#1c1c16]">Handicap-leaderboard</h3>
          </div>
          <div className="divide-y divide-[#c2c9bb]/30">
            {mockLeaderboard.map((player) => (
              <div
                key={player.name}
                className={`p-4 flex items-center gap-4 ${
                  player.name === "Anders Kristiansen" ? "bg-[#d2f000]/10" : ""
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    player.rank === 1
                      ? "bg-[#f59e0b] text-white"
                      : player.rank === 2
                      ? "bg-[#8a9385] text-white"
                      : player.rank === 3
                      ? "bg-[#cd7f32] text-white"
                      : "bg-[#f7f3ea] text-[#6b7366]"
                  }`}
                >
                  {player.rank}
                </span>
                <div className="w-10 h-10 rounded-full bg-[#154212] flex items-center justify-center text-white text-sm font-bold">
                  {player.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#1c1c16]">
                    {player.name}
                    {player.name === "Anders Kristiansen" && (
                      <span className="ml-2 text-xs text-[#154212]">(Deg)</span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1c1c16]">{player.handicap.toFixed(1)}</p>
                  <span
                    className={`text-xs ${
                      player.trend === "down"
                        ? "text-[#22c55e]"
                        : player.trend === "up"
                        ? "text-[#ef4444]"
                        : "text-[#8a9385]"
                    }`}
                  >
                    {player.trend === "down" ? "↓" : player.trend === "up" ? "↑" : "→"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction href="#" icon={UserPlus} label="Finn venner" description="Søk etter spillere" />
        <QuickAction href="#" icon={Users} label="Opprett gruppe" description="Lag din egen gruppe" />
        <QuickAction href="#" icon={Trophy} label="Utfordringer" description="Delta i konkurranser" />
      </div>
    </div>
  );
}
