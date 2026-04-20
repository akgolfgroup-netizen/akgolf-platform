"use client";

import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { cn } from "@/lib/portal/utils/cn";
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
} from "../actions";
import {
  MonoLabel,
  BentoCard,
  BentoGrid,
} from "@/components/portal/patterns";

// ════════════════════════════════════════════════════════════
// Typer
// ════════════════════════════════════════════════════════════

export interface VennerFriend {
  friendshipId: string;
  id: string;
  name: string;
  image: string | null;
  lastActiveAt: string | null;
  latestHandicap: number | null;
}

export interface VennerClientProps {
  friends: VennerFriend[];
  pendingRequests: PendingRequest[];
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

// ════════════════════════════════════════════════════════════
// Komponent
// ════════════════════════════════════════════════════════════

export default function VennerClient({
  friends,
  pendingRequests,
}: VennerClientProps) {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendFilter, setFriendFilter] = useState("");

  const filteredFriends = friendFilter
    ? friends.filter((f) =>
        f.name.toLowerCase().includes(friendFilter.toLowerCase())
      )
    : friends;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <MonoLabel
            as="p"
            size="xs"
            uppercase
            className="text-on-surface-variant block"
          >
            Sosialt
          </MonoLabel>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-on-surface">
            Venner
          </h1>
        </div>
        <button
          onClick={() => setShowAddFriend(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-fixed text-on-surface text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Icon name="person_add" size={16} />
          Legg til venn
        </button>
      </div>

      {/* Pending requests */}
      <PendingRequests
        requests={pendingRequests}
        onAccept={acceptFriendRequest}
        onDecline={declineFriendRequest}
      />

      {/* Friends grid */}
      <BentoGrid cols={1} gap="md">
        <BentoCard variant="light" padding="none">
          <div className="p-4 border-b border-outline-variant/10">
            <div className="relative">
              <Icon
                name="search"
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                type="text"
                value={friendFilter}
                onChange={(e) => setFriendFilter(e.target.value)}
                placeholder="Søk etter venner..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border-none text-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>
          {filteredFriends.length === 0 ? (
            <div className="p-8 text-center">
              <Icon
                name="group"
                size={40}
                className="text-on-surface-variant mx-auto mb-3"
              />
              <p className="text-on-surface-variant">
                {friends.length === 0
                  ? "Du har ingen venner ennå. Legg til noen for å komme i gang."
                  : "Ingen treff."}
              </p>
              {friends.length === 0 && (
                <button
                  onClick={() => setShowAddFriend(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface hover:underline"
                >
                  <Icon name="person_add" size={16} />
                  Legg til din første venn
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/10">
              {filteredFriends.map((friend) => {
                const status = getOnlineStatus(friend.lastActiveAt);
                return (
                  <div
                    key={friend.id}
                    className="p-4 flex items-center justify-between hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-surface text-sm font-bold">
                          {getInitials(friend.name)}
                        </div>
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                            status === "online"
                              ? "bg-success"
                              : "bg-surface-variant"
                          )}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-on-surface">
                          {friend.name}
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          <MonoLabel size="xs">
                            {friend.latestHandicap !== null
                              ? `HCP ${friend.latestHandicap.toFixed(1)}`
                              : "HCP ukjent"}{" "}
                            · {formatLastActive(friend.lastActiveAt)}
                          </MonoLabel>
                        </p>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-surface transition-colors">
                      <Icon
                        name="chat_bubble"
                        size={16}
                        className="text-on-surface-variant"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </BentoCard>
      </BentoGrid>

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
