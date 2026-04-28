"use client";

import { useState } from "react";
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
} from "@/app/portal/(dashboard)/sosialt/actions";
import type {
  SosialtFriend,
  SosialtLeaderboardEntry,
} from "@/app/portal/(dashboard)/sosialt/sosialt-client";
import { SosialtHero } from "./sosialt-hero";
import { ActivityFeedPlaceholder } from "./feed-card";
import { LeaderboardCard } from "./leaderboard-card";
import { FriendsCard } from "./friends-card";
import { PrivacyFooter } from "./privacy-footer";
import { accent, monoFont } from "./styles";

interface Props {
  friends: SosialtFriend[];
  leaderboard: SosialtLeaderboardEntry[];
  pendingRequests: PendingRequest[];
}

export function SosialtClientV2({ friends, leaderboard, pendingRequests }: Props) {
  const [showAddFriend, setShowAddFriend] = useState(false);

  return (
    <div
      className="rounded-[24px] p-7 lg:p-9"
      style={{ background: "#0A1F18", minHeight: "calc(100vh - 120px)" }}
    >
      <header className="mb-6">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: accent, fontFamily: monoFont }}
        >
          / Felleskap · sosialt
        </div>
        <h1 className="mt-2 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[48px]">
          Treningskompiser, runder, framgang.
        </h1>
        <p className="mt-3 max-w-[60ch] text-[14px] leading-[1.6] text-white/65">
          Du deler bare med venner og grupper du har valgt. Coach ser ovingsdata uansett. Alt annet
          er privat med mindre du eksplisitt poster.
        </p>
      </header>

      <SosialtHero
        friendsCount={friends.length}
        pendingCount={pendingRequests.length}
        onAdd={() => setShowAddFriend(true)}
      />

      {pendingRequests.length > 0 ? (
        <div className="mb-6">
          <PendingRequests
            requests={pendingRequests}
            onAccept={acceptFriendRequest}
            onDecline={declineFriendRequest}
          />
        </div>
      ) : null}

      <div className="grid items-start gap-[22px] lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-3.5 flex items-end justify-between">
            <h3 className="m-0 text-[18px] font-bold tracking-[-0.02em] text-white">
              Aktivitet · venner
            </h3>
            <span
              className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/45"
              style={{ fontFamily: monoFont }}
            >
              {friends.length} venner
            </span>
          </div>
          <ActivityFeedPlaceholder friends={friends} />
        </div>

        <aside className="flex flex-col gap-[18px]">
          <LeaderboardCard entries={leaderboard} />
          <FriendsCard friends={friends} />
        </aside>
      </div>

      <PrivacyFooter />

      <AddFriendDialog
        open={showAddFriend}
        onClose={() => setShowAddFriend(false)}
        onSearch={searchUsers}
        onSendRequest={sendFriendRequest}
      />
    </div>
  );
}
