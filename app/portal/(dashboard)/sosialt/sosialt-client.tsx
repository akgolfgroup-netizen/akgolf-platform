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
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { AddFriendDialog } from "@/components/portal/social/add-friend-dialog";
import {
  PendingRequests,
  type PendingRequest,
} from "@/components/portal/social/pending-requests";
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from "./actions";

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

export interface SosialtLeaderboardEntry {
  id: string;
  name: string;
  image: string | null;
  value: number | null;
  isCurrentUser: boolean;
}

export interface SosialtClientProps {
  friends: SosialtFriend[];
  leaderboard: SosialtLeaderboardEntry[];
  pendingRequests: PendingRequest[];
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
  if (minutes < 1) return "Nå";
  if (minutes < 60) return `${minutes} min siden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}t siden`;
  const days = Math.floor(hours / 24);
  return `${days}d siden`;
}

type TabId = "friends" | "leaderboard";

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "friends", label: "Venner", icon: Users },
  { id: "leaderboard", label: "Toppliste", icon: Trophy },
];

// ════════════════════════════════════════════════════════════
// Komponent
// ════════════════════════════════════════════════════════════

export default function SosialtClient({
  friends,
  leaderboard,
  pendingRequests,
  currentUserName,
}: SosialtClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("friends");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendFilter, setFriendFilter] = useState("");

  const filteredFriends = friendFilter
    ? friends.filter((f) =>
        f.name.toLowerCase().includes(friendFilter.toLowerCase())
      )
    : friends;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F18]">Sosialt</h1>
          <p className="text-[#324D45] mt-1">
            {friends.length} venner · Bli inspirert av andre spillere
          </p>
        </div>
        <button
          onClick={() => setShowAddFriend(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D1F843] text-[#0A1F18] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <UserPlus className="w-4 h-4" />
          Legg til venn
        </button>
      </div>

      {/* Pending requests */}
      <PendingRequests
        requests={pendingRequests}
        onAccept={acceptFriendRequest}
        onDecline={declineFriendRequest}
      />

      {/* Tabs — Pill style */}
      <div className="flex gap-1 p-[3px] rounded-[10px] bg-[#F5F8F7] w-fit border border-[#D5DFDB]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-[7px] rounded-[7px] text-[13px] font-medium transition-all",
              activeTab === tab.id
                ? "bg-[#0A1F18] text-white shadow-sm"
                : "text-[#7A8C85] hover:text-[#324D45] hover:bg-white"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Friends Tab */}
      {activeTab === "friends" && (
        <PremiumCard noHover className="p-0 overflow-hidden bg-white border border-[#D5DFDB] rounded-xl">
          <div className="p-4 border-b border-[#D5DFDB]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C85]" />
              <input
                type="text"
                value={friendFilter}
                onChange={(e) => setFriendFilter(e.target.value)}
                placeholder="Filtrer venner..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F5F8F7] border-none text-sm placeholder:text-[#7A8C85] focus:outline-none focus:ring-2 focus:ring-[#0A1F18]/10"
              />
            </div>
          </div>
          {filteredFriends.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-10 h-10 text-[#7A8C85] mx-auto mb-3" />
              <p className="text-[#324D45]">
                {friends.length === 0
                  ? "Du har ingen venner ennå. Legg til noen for å komme i gang."
                  : "Ingen treff."}
              </p>
              {friends.length === 0 && (
                <button
                  onClick={() => setShowAddFriend(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A1F18] hover:underline"
                >
                  <UserPlus className="w-4 h-4" />
                  Legg til din første venn
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#D5DFDB]">
              {filteredFriends.map((friend) => {
                const status = getOnlineStatus(friend.lastActiveAt);
                return (
                  <div
                    key={friend.id}
                    className="p-4 flex items-center justify-between hover:bg-[#F5F8F7] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[#0A1F18] flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(friend.name)}
                        </div>
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                            status === "online" ? "bg-[#1A4D36]" : "bg-[#7A8C85]"
                          )}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0A1F18]">
                          {friend.name}
                        </h4>
                        <p className="text-xs text-[#7A8C85]">
                          {friend.latestHandicap !== null
                            ? `HCP ${friend.latestHandicap.toFixed(1)}`
                            : "HCP ukjent"}{" "}
                          · {formatLastActive(friend.lastActiveAt)}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-[#F5F8F7] transition-colors">
                      <MessageCircle className="w-4 h-4 text-[#7A8C85]" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </PremiumCard>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <PremiumCard noHover className="p-0 overflow-hidden bg-white border border-[#D5DFDB] rounded-xl">
          <div className="p-4 border-b border-[#D5DFDB]">
            <h3 className="font-semibold text-[#0A1F18]">
              Handicap-toppliste
            </h3>
          </div>
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <Trophy className="w-10 h-10 text-[#7A8C85] mx-auto mb-3" />
              <p className="text-[#324D45]">
                Ingen data for topplisten ennå. Legg til venner og registrer
                handicap.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#D5DFDB]">
              {leaderboard.map((player, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={player.id}
                    className={cn(
                      "p-4 flex items-center gap-4",
                      player.isCurrentUser && "bg-[#D1F843]/10"
                    )}
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold tabular-nums",
                        rank === 1
                          ? "bg-[#D1F843] text-[#0A1F18]"
                          : rank === 2
                            ? "bg-[#324D45] text-white"
                            : rank === 3
                              ? "bg-[#0A1F18] text-white"
                              : "bg-[#F5F8F7] text-[#324D45]"
                      )}
                    >
                      {rank}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#0A1F18] flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(player.name)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#0A1F18]">
                        {player.name}
                        {player.isCurrentUser && (
                          <span className="ml-2 text-xs text-[#324D45]">
                            (Deg)
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0A1F18] tabular-nums">
                        {player.value !== null ? player.value.toFixed(1) : "-"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </PremiumCard>
      )}

      {/* Legg til venn dialog */}
      <AddFriendDialog
        open={showAddFriend}
        onClose={() => setShowAddFriend(false)}
        onSearch={searchUsers}
        onSendRequest={sendFriendRequest}
      />
    </div>
  );
}
