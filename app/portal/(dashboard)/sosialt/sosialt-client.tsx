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
          <h1 className="text-2xl font-bold text-portal-text">Sosialt</h1>
          <p className="text-portal-secondary mt-1">
            {friends.length} venner · Bli inspirert av andre spillere
          </p>
        </div>
        <button
          onClick={() => setShowAddFriend(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[20px] bg-primary text-white text-sm font-medium hover:bg-primary-alt transition-colors"
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
      <div className="flex gap-1 p-[3px] rounded-[10px] bg-portal-hover w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-[7px] rounded-[7px] text-[13px] font-medium transition-all",
              activeTab === tab.id
                ? "bg-primary text-white shadow-[0_2px_8px_rgba(0,88,64,0.3)]"
                : "text-portal-muted hover:text-portal-secondary hover:bg-portal-hover"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Friends Tab */}
      {activeTab === "friends" && (
        <PremiumCard noHover className="p-0 overflow-hidden">
          <div className="p-4 border-b border-portal-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-muted" />
              <input
                type="text"
                value={friendFilter}
                onChange={(e) => setFriendFilter(e.target.value)}
                placeholder="Filtrer venner..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-portal-hover border-none text-sm placeholder:text-portal-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          {filteredFriends.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-10 h-10 text-portal-muted mx-auto mb-3" />
              <p className="text-portal-secondary">
                {friends.length === 0
                  ? "Du har ingen venner ennå. Legg til noen for å komme i gang."
                  : "Ingen treff."}
              </p>
              {friends.length === 0 && (
                <button
                  onClick={() => setShowAddFriend(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <UserPlus className="w-4 h-4" />
                  Legg til din første venn
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-portal-border">
              {filteredFriends.map((friend) => {
                const status = getOnlineStatus(friend.lastActiveAt);
                return (
                  <div
                    key={friend.id}
                    className="p-4 flex items-center justify-between hover:bg-portal-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(friend.name)}
                        </div>
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                            status === "online" ? "bg-success" : "bg-portal-muted"
                          )}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-portal-text">
                          {friend.name}
                        </h4>
                        <p className="text-xs text-portal-muted">
                          {friend.latestHandicap !== null
                            ? `HCP ${friend.latestHandicap.toFixed(1)}`
                            : "HCP ukjent"}{" "}
                          · {formatLastActive(friend.lastActiveAt)}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-portal-hover transition-colors">
                      <MessageCircle className="w-4 h-4 text-portal-muted" />
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
        <PremiumCard noHover className="p-0 overflow-hidden">
          <div className="p-4 border-b border-portal-border">
            <h3 className="font-semibold text-portal-text">
              Handicap-toppliste
            </h3>
          </div>
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <Trophy className="w-10 h-10 text-portal-muted mx-auto mb-3" />
              <p className="text-portal-secondary">
                Ingen data for topplisten ennå. Legg til venner og registrer
                handicap.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-portal-border">
              {leaderboard.map((player, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={player.id}
                    className={cn(
                      "p-4 flex items-center gap-4",
                      player.isCurrentUser && "bg-accent-cta/10"
                    )}
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold tabular-nums",
                        rank === 1
                          ? "bg-warning text-white"
                          : rank === 2
                            ? "bg-portal-secondary text-white"
                            : rank === 3
                              ? "bg-portal-text text-white"
                              : "bg-portal-hover text-portal-secondary"
                      )}
                    >
                      {rank}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(player.name)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-portal-text">
                        {player.name}
                        {player.isCurrentUser && (
                          <span className="ml-2 text-xs text-primary">
                            (Deg)
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-portal-text tabular-nums">
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
