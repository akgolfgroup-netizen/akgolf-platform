"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Trophy,
  Target,
  MessageCircle,
  Search,
  Bell,
  Heart,
  Share2,
} from "lucide-react";
import { QuickAction } from "@/components/portal/heritage/quick-action";

// ════════════════════════════════════════════════════════════
// Typer
// ════════════════════════════════════════════════════════════

export interface SosialtFriend {
  friendshipId: string;
  id: string;
  name: string;
  image: string | null;
  lastActiveAt: string | null;
  latestHandicap: number | null;
}

export interface SosialtActivity {
  id: string;
  user: string;
  action: string;
  details: string;
  time: string;
  likes: number;
  comments: number;
}

export interface SosialtLeaderboardEntry {
  id: string;
  name: string;
  image: string | null;
  value: number | null;
  isCurrentUser: boolean;
}

export interface SosialtGroup {
  id: string;
  name: string;
  members: number;
  activity: string;
  joined: boolean;
}

export interface SosialtClientProps {
  friends: SosialtFriend[];
  activity: SosialtActivity[];
  leaderboard: SosialtLeaderboardEntry[];
  groups: SosialtGroup[];
  currentUserName: string;
}

// ════════════════════════════════════════════════════════════
// Hjelpefunksjoner
// ════════════════════════════════════════════════════════════

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getOnlineStatus(lastActiveAt: string | null): "online" | "offline" {
  if (!lastActiveAt) return "offline";
  const diff = Date.now() - new Date(lastActiveAt).getTime();
  return diff < 5 * 60 * 1000 ? "online" : "offline";
}

function formatLastActive(lastActiveAt: string | null): string {
  if (!lastActiveAt) return "Ikke sett";
  const diff = Date.now() - new Date(lastActiveAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "N\u00e5";
  if (minutes < 60) return `${minutes} min siden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}t siden`;
  const days = Math.floor(hours / 24);
  return `${days}d siden`;
}

// ════════════════════════════════════════════════════════════
// Komponent
// ════════════════════════════════════════════════════════════

export default function SosialtClient({
  friends,
  activity,
  leaderboard,
  groups,
  currentUserName,
}: SosialtClientProps) {
  const [activeTab, setActiveTab] = useState<"feed" | "friends" | "leaderboard">("feed");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">Sosialt</h1>
          <p className="text-[var(--color-grey-500)] mt-1">Bli inspirert av andre spillere</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white border border-[var(--color-grey-200)]/70 hover:bg-[var(--color-grey-100)] transition-colors relative">
            <Bell className="w-5 h-5 text-[var(--color-grey-500)]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-error)]" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-alt)] transition-colors">
            <UserPlus className="w-4 h-4" />
            Inviter venn
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-white border border-[var(--color-grey-200)]/70 w-fit">
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
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-grey-500)] hover:bg-[var(--color-grey-100)]"
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
          {activity.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[var(--color-grey-200)]/70 text-center">
              <Target className="w-10 h-10 text-[var(--color-grey-300)] mx-auto mb-3" />
              <p className="text-[var(--color-grey-500)]">Ingen aktivitet enn\u00e5. Legg til venner for \u00e5 se hva de driver med.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activity.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-[var(--color-grey-200)]/70"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(item.user)}
                    </div>
                    <div className="flex-1">
                      <p className="text-[var(--color-grey-900)]">
                        <span className="font-semibold">{item.user}</span>{" "}
                        <span className="text-[var(--color-grey-500)]">{item.action}</span>
                      </p>
                      <p className="text-sm text-[var(--color-primary)] font-medium mt-1">{item.details}</p>
                      <p className="text-xs text-[var(--color-grey-400)] mt-2">{item.time}</p>

                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--color-grey-200)]/50">
                        <button className="flex items-center gap-1 text-sm text-[var(--color-grey-500)] hover:text-[var(--color-error)] transition-colors">
                          <Heart className="w-4 h-4" />
                          {item.likes}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-[var(--color-grey-500)] hover:text-[var(--color-primary)] transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {item.comments}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-[var(--color-grey-500)] hover:text-[var(--color-primary)] transition-colors">
                          <Share2 className="w-4 h-4" />
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Groups */}
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-grey-200)]/70">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--color-grey-900)]">Dine grupper</h3>
              <button className="text-sm text-[var(--color-primary)] hover:underline">Se alle</button>
            </div>
            {groups.filter((g) => g.joined).length === 0 ? (
              <p className="text-sm text-[var(--color-grey-500)]">Du er ikke med i noen grupper enn\u00e5.</p>
            ) : (
              <div className="space-y-3">
                {groups.filter((g) => g.joined).map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)] transition-colors cursor-pointer"
                  >
                    <div>
                      <h4 className="font-medium text-[var(--color-grey-900)]">{group.name}</h4>
                      <p className="text-xs text-[var(--color-grey-500)]">{group.members} medlemmer</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        group.activity === "H\u00f8y"
                          ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                          : group.activity === "Medium"
                          ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                          : "bg-[var(--color-grey-400)]/10 text-[var(--color-grey-400)]"
                      }`}
                    >
                      {group.activity} aktivitet
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Friends Tab */}
      {activeTab === "friends" && (
        <div className="bg-white rounded-2xl border border-[var(--color-grey-200)]/70 overflow-hidden">
          <div className="p-4 border-b border-[var(--color-grey-200)]/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-grey-400)]" />
              <input
                type="text"
                placeholder="S\u00f8k etter venner..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--color-grey-100)] border-none text-sm placeholder-[var(--color-grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
          </div>
          {friends.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-10 h-10 text-[var(--color-grey-300)] mx-auto mb-3" />
              <p className="text-[var(--color-grey-500)]">Du har ingen venner enn\u00e5. Inviter noen for \u00e5 komme i gang.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-grey-200)]/50">
              {friends.map((friend) => {
                const status = getOnlineStatus(friend.lastActiveAt);
                return (
                  <div key={friend.id} className="p-4 flex items-center justify-between hover:bg-[var(--color-grey-100)] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(friend.name)}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            status === "online"
                              ? "bg-[var(--color-success)]"
                              : "bg-[var(--color-grey-400)]"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--color-grey-900)]">{friend.name}</h4>
                        <p className="text-xs text-[var(--color-grey-500)]">
                          {friend.latestHandicap !== null ? `HCP ${friend.latestHandicap.toFixed(1)}` : "HCP ukjent"} · {formatLastActive(friend.lastActiveAt)}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white transition-colors">
                      <MessageCircle className="w-4 h-4 text-[var(--color-grey-500)]" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <div className="bg-white rounded-2xl border border-[var(--color-grey-200)]/70 overflow-hidden">
          <div className="p-4 border-b border-[var(--color-grey-200)]/50">
            <h3 className="font-semibold text-[var(--color-grey-900)]">Handicap-leaderboard</h3>
          </div>
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <Trophy className="w-10 h-10 text-[var(--color-grey-300)] mx-auto mb-3" />
              <p className="text-[var(--color-grey-500)]">Ingen data for topplisten enn\u00e5. Legg til venner og registrer handicap.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-grey-200)]/50">
              {leaderboard.map((player, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={player.id}
                    className={`p-4 flex items-center gap-4 ${
                      player.isCurrentUser ? "bg-[var(--color-accent-cta)]/15" : ""
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        rank === 1
                          ? "bg-[var(--color-warning)] text-white"
                          : rank === 2
                          ? "bg-[var(--color-grey-400)] text-white"
                          : rank === 3
                          ? "bg-[var(--color-grey-600)] text-white"
                          : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)]"
                      }`}
                    >
                      {rank}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(player.name)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--color-grey-900)]">
                        {player.name}
                        {player.isCurrentUser && (
                          <span className="ml-2 text-xs text-[var(--color-primary)]">(Deg)</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[var(--color-grey-900)]">
                        {player.value !== null ? player.value.toFixed(1) : "-"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction href="#" icon={UserPlus} label="Finn venner" description="S\u00f8k etter spillere" />
        <QuickAction href="#" icon={Users} label="Opprett gruppe" description="Lag din egen gruppe" />
        <QuickAction href="#" icon={Trophy} label="Utfordringer" description="Delta i konkurranser" />
      </div>
    </div>
  );
}
