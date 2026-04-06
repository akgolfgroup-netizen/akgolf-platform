"use client";

import { useState, useTransition, useCallback } from "react";
import {
  Users,
  Trophy,
  BarChart3,
  Search,
  UserPlus,
  Check,
  X,
  Clock,
  ChevronRight,
  Plus,
  Target,
  TrendingUp,
  Flame,
  Calendar,
  UserMinus,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getActiveChallenges,
  createChallenge,
  joinChallenge,
  getFriendsLeaderboard,
} from "./actions";
import { ChallengeType } from "@prisma/client";

// ════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════

interface Friend {
  friendshipId: string;
  id: string;
  name: string;
  image: string | null;
  lastActiveAt: string | null;
  latestHandicap: number | null;
}

interface PendingRequest {
  friendshipId: string;
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
}

interface ChallengeParticipant {
  id: string;
  name: string;
  image: string | null;
  currentValue: number | null;
  rank: number | null;
}

interface Challenge {
  id: string;
  title: string;
  type: string;
  metric: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  creator: { id: string; name: string; image: string | null };
  participants: ChallengeParticipant[];
  isCreator: boolean;
  isParticipant: boolean;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  image: string | null;
  value: number | null;
  isCurrentUser: boolean;
}

interface SearchResult {
  id: string;
  name: string;
  image: string | null;
  email: string | null;
  friendshipStatus: string | null;
}

type Tab = "venner" | "utfordringer" | "leaderboard";
type LeaderboardSort = "handicap" | "improvement" | "streak";

const TABS: { key: Tab; label: string; icon: typeof Users }[] = [
  { key: "venner", label: "Venner", icon: Users },
  { key: "utfordringer", label: "Utfordringer", icon: Trophy },
  { key: "leaderboard", label: "Leaderboard", icon: BarChart3 },
];

const CHALLENGE_TYPES: { value: ChallengeType; label: string }[] = [
  { value: "HANDICAP", label: "Handicap" },
  { value: "PUTTING", label: "Putting" },
  { value: "SG", label: "Strokes Gained" },
  { value: "DECADE", label: "DECADE" },
  { value: "ROUNDS", label: "Antall runder" },
];

const LEADERBOARD_SORTS: {
  key: LeaderboardSort;
  label: string;
  icon: typeof Target;
}[] = [
  { key: "handicap", label: "Handicap", icon: Target },
  { key: "improvement", label: "Forbedring 30d", icon: TrendingUp },
  { key: "streak", label: "Treningsstreak", icon: Flame },
];

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

function Avatar({
  src,
  name,
  size = "md",
}: {
  src: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={cn("rounded-full object-cover flex-shrink-0", sizeClasses[size])}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0 font-medium",
        sizeClasses[size]
      )}
      style={{
        background: "var(--color-grey-200)",
        color: "var(--color-grey-600)",
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "Aldri";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Akkurat na";
  if (diffMin < 60) return `${diffMin} min siden`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}t siden`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d siden`;
  return date.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
}

function daysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));
}

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export function SosialtClient({
  friends: initialFriends,
  pendingRequests: initialPending,
  challenges: initialChallenges,
  leaderboard: initialLeaderboard,
  currentUserId,
}: {
  friends: Friend[];
  pendingRequests: PendingRequest[];
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  currentUserId: string;
}) {
  const [tab, setTab] = useState<Tab>("venner");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--color-grey-900)" }}
        >
          Sosialt
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-grey-500)" }}
        >
          Venner, utfordringer og leaderboard
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{ background: "var(--color-grey-100)" }}
      >
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
              tab === key
                ? "bg-white shadow-sm"
                : "hover:bg-white/50"
            )}
            style={{
              color:
                tab === key
                  ? "var(--color-grey-900)"
                  : "var(--color-grey-500)",
            }}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "venner" && (
        <VennerTab
          friends={initialFriends}
          pendingRequests={initialPending}
        />
      )}
      {tab === "utfordringer" && (
        <UtfordringerTab
          challenges={initialChallenges}
          friends={initialFriends}
        />
      )}
      {tab === "leaderboard" && (
        <LeaderboardTab
          initialLeaderboard={initialLeaderboard}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// VENNER TAB
// ════════════════════════════════════════════════════════════

function VennerTab({
  friends,
  pendingRequests,
}: {
  friends: Friend[];
  pendingRequests: PendingRequest[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      startTransition(async () => {
        const results = await searchUsers(query);
        setSearchResults(results);
        setIsSearching(false);
      });
    },
    []
  );

  const handleSendRequest = (friendId: string) => {
    startTransition(async () => {
      try {
        await sendFriendRequest(friendId);
        setSearchResults((prev) =>
          prev.map((r) =>
            r.id === friendId ? { ...r, friendshipStatus: "PENDING" } : r
          )
        );
      } catch {
        // Error handled by revalidation
      }
    });
  };

  const handleAccept = (friendshipId: string) => {
    startTransition(async () => {
      await acceptFriendRequest(friendshipId);
    });
  };

  const handleDecline = (friendshipId: string) => {
    startTransition(async () => {
      await declineFriendRequest(friendshipId);
    });
  };

  const handleRemove = (friendshipId: string) => {
    startTransition(async () => {
      await removeFriend(friendshipId);
    });
  };

  return (
    <div className="space-y-4">
      {/* Pending requests */}
      {pendingRequests.length > 0 && (
        <div
          className="rounded-2xl border p-4"
          style={{
            borderColor: "var(--color-grey-200)",
            background: "white",
          }}
        >
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--color-grey-900)" }}
          >
            Ventende foresporsler ({pendingRequests.length})
          </h3>
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.friendshipId}
                className="flex items-center gap-3"
              >
                <Avatar src={req.image} name={req.name} />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--color-grey-900)" }}
                  >
                    {req.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-grey-400)" }}
                  >
                    {formatRelativeTime(req.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(req.friendshipId)}
                    disabled={isPending}
                    className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-[var(--color-grey-100)]"
                    style={{ color: "var(--color-success)" }}
                    title="Godta"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDecline(req.friendshipId)}
                    disabled={isPending}
                    className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-[var(--color-grey-100)]"
                    style={{ color: "var(--color-error)" }}
                    title="Avvis"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search / Add friends */}
      <div
        className="rounded-2xl border p-4"
        style={{
          borderColor: "var(--color-grey-200)",
          background: "white",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--color-grey-900)" }}
          >
            Venner ({friends.length})
          </h3>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            style={{
              background: "var(--color-grey-900)",
              color: "white",
            }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Legg til
          </button>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="mb-4">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{
                borderColor: "var(--color-grey-200)",
                background: "var(--color-grey-100)",
              }}
            >
              <Search
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "var(--color-grey-400)" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Sok etter navn eller e-post..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--color-grey-900)" }}
                autoFocus
              />
            </div>

            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="mt-2 space-y-1">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{ background: "var(--color-grey-100)" }}
                  >
                    <Avatar src={result.image} name={result.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--color-grey-900)" }}
                      >
                        {result.name}
                      </p>
                      {result.email && (
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--color-grey-400)" }}
                        >
                          {result.email}
                        </p>
                      )}
                    </div>
                    {result.friendshipStatus === "ACCEPTED" ? (
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          background: "var(--color-success-light)",
                          color: "var(--color-success-text)",
                        }}
                      >
                        Venn
                      </span>
                    ) : result.friendshipStatus === "PENDING" ? (
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          background: "var(--color-grey-100)",
                          color: "var(--color-grey-500)",
                        }}
                      >
                        Sendt
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(result.id)}
                        disabled={isPending}
                        className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white"
                        style={{ color: "var(--color-grey-900)" }}
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
              <p
                className="mt-2 text-xs text-center py-3"
                style={{ color: "var(--color-grey-400)" }}
              >
                Ingen brukere funnet
              </p>
            )}
          </div>
        )}

        {/* Friends list */}
        {friends.length === 0 ? (
          <div className="py-8 text-center">
            <Users
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: "var(--color-grey-300)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--color-grey-500)" }}
            >
              Ingen venner enna
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--color-grey-400)" }}
            >
              Sok etter andre spillere for a legge dem til
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {friends.map((friend) => (
              <div
                key={friend.friendshipId}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-[var(--color-grey-100)] group"
              >
                <Avatar src={friend.image} name={friend.name} />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--color-grey-900)" }}
                  >
                    {friend.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-grey-400)" }}
                  >
                    {friend.lastActiveAt
                      ? `Aktiv ${formatRelativeTime(friend.lastActiveAt)}`
                      : "Ikke aktiv enna"}
                  </p>
                </div>
                {friend.latestHandicap !== null && (
                  <span
                    className="text-sm font-semibold tabular-nums"
                    style={{ color: "var(--color-grey-900)" }}
                  >
                    HCP {friend.latestHandicap.toFixed(1)}
                  </span>
                )}
                <button
                  onClick={() => handleRemove(friend.friendshipId)}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-[var(--color-grey-200)]"
                  style={{ color: "var(--color-grey-400)" }}
                  title="Fjern venn"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// UTFORDRINGER TAB
// ════════════════════════════════════════════════════════════

function UtfordringerTab({
  challenges,
  friends,
}: {
  challenges: Challenge[];
  friends: Friend[];
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: "",
    type: "HANDICAP" as ChallengeType,
    metric: "Lavest handicap",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    inviteFriendIds: [] as string[],
  });

  const handleCreate = () => {
    startTransition(async () => {
      try {
        await createChallenge({
          ...form,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
        });
        setShowCreate(false);
        setForm({
          title: "",
          type: "HANDICAP",
          metric: "Lavest handicap",
          startDate: new Date().toISOString().slice(0, 10),
          endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          inviteFriendIds: [],
        });
      } catch {
        // Handled by revalidation
      }
    });
  };

  const handleJoin = (challengeId: string) => {
    startTransition(async () => {
      await joinChallenge(challengeId);
    });
  };

  const toggleFriendInvite = (friendId: string) => {
    setForm((prev) => ({
      ...prev,
      inviteFriendIds: prev.inviteFriendIds.includes(friendId)
        ? prev.inviteFriendIds.filter((id) => id !== friendId)
        : [...prev.inviteFriendIds, friendId],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Create button */}
      <button
        onClick={() => setShowCreate(!showCreate)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-colors cursor-pointer"
        style={{
          background: "var(--color-grey-900)",
          color: "white",
        }}
      >
        <Plus className="w-4 h-4" />
        Opprett utfordring
      </button>

      {/* Create form */}
      {showCreate && (
        <div
          className="rounded-2xl border p-4 space-y-4"
          style={{
            borderColor: "var(--color-grey-200)",
            background: "white",
          }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--color-grey-900)" }}
          >
            Ny utfordring
          </h3>

          <div className="space-y-3">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--color-grey-500)" }}
              >
                Tittel
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="F.eks. Handicap-kamp april"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[var(--color-grey-300)]"
                style={{
                  borderColor: "var(--color-grey-200)",
                  color: "var(--color-grey-900)",
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--color-grey-500)" }}
              >
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as ChallengeType,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer"
                style={{
                  borderColor: "var(--color-grey-200)",
                  color: "var(--color-grey-900)",
                }}
              >
                {CHALLENGE_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--color-grey-500)" }}
              >
                Malemetode
              </label>
              <input
                type="text"
                value={form.metric}
                onChange={(e) =>
                  setForm({ ...form, metric: e.target.value })
                }
                placeholder="F.eks. Lavest handicap"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[var(--color-grey-300)]"
                style={{
                  borderColor: "var(--color-grey-200)",
                  color: "var(--color-grey-900)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--color-grey-500)" }}
                >
                  Start
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer"
                  style={{
                    borderColor: "var(--color-grey-200)",
                    color: "var(--color-grey-900)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--color-grey-500)" }}
                >
                  Slutt
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer"
                  style={{
                    borderColor: "var(--color-grey-200)",
                    color: "var(--color-grey-900)",
                  }}
                />
              </div>
            </div>

            {/* Friend selection */}
            {friends.length > 0 && (
              <div>
                <label
                  className="block text-xs font-medium mb-2"
                  style={{ color: "var(--color-grey-500)" }}
                >
                  Inviter venner
                </label>
                <div className="flex flex-wrap gap-2">
                  {friends.map((friend) => {
                    const selected = form.inviteFriendIds.includes(friend.id);
                    return (
                      <button
                        key={friend.id}
                        onClick={() => toggleFriendInvite(friend.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                          selected
                            ? "border-[var(--color-grey-900)]"
                            : "border-[var(--color-grey-200)] hover:border-[var(--color-grey-300)]"
                        )}
                        style={{
                          background: selected
                            ? "var(--color-grey-900)"
                            : "white",
                          color: selected
                            ? "white"
                            : "var(--color-grey-700)",
                        }}
                      >
                        <Avatar src={friend.image} name={friend.name} size="sm" />
                        {friend.name}
                        {selected && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowCreate(false)}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border"
              style={{
                borderColor: "var(--color-grey-200)",
                color: "var(--color-grey-700)",
              }}
            >
              Avbryt
            </button>
            <button
              onClick={handleCreate}
              disabled={isPending || !form.title.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              style={{
                background: "var(--color-grey-900)",
                color: "white",
              }}
            >
              {isPending ? "Oppretter..." : "Opprett"}
            </button>
          </div>
        </div>
      )}

      {/* Active challenges */}
      {challenges.length === 0 ? (
        <div
          className="rounded-2xl border py-12 text-center"
          style={{
            borderColor: "var(--color-grey-200)",
            background: "white",
          }}
        >
          <Trophy
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: "var(--color-grey-300)" }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-grey-500)" }}
          >
            Ingen aktive utfordringer
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--color-grey-400)" }}
          >
            Opprett en utfordring og inviter vennene dine
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={handleJoin}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChallengeCard({
  challenge,
  onJoin,
  isPending,
}: {
  challenge: Challenge;
  onJoin: (id: string) => void;
  isPending: boolean;
}) {
  const days = daysRemaining(challenge.endDate);
  const totalDays = Math.ceil(
    (new Date(challenge.endDate).getTime() -
      new Date(challenge.startDate).getTime()) /
      86400000
  );
  const progress = Math.min(100, ((totalDays - days) / totalDays) * 100);

  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: "var(--color-grey-200)",
        background: "white",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4
            className="text-sm font-semibold"
            style={{ color: "var(--color-grey-900)" }}
          >
            {challenge.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "var(--color-grey-100)",
                color: "var(--color-grey-600)",
              }}
            >
              {challenge.type}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--color-grey-400)" }}
            >
              {challenge.metric}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock
            className="w-3.5 h-3.5"
            style={{ color: "var(--color-grey-400)" }}
          />
          <span
            className="text-xs font-medium"
            style={{
              color:
                days <= 3
                  ? "var(--color-error)"
                  : "var(--color-grey-500)",
            }}
          >
            {days}d igjen
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full mb-3"
        style={{ background: "var(--color-grey-100)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: "var(--color-grey-900)",
          }}
        />
      </div>

      {/* Participants */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {challenge.participants.slice(0, 5).map((p, i) => (
            <div
              key={p.id}
              className="relative"
              style={{ zIndex: 5 - i }}
            >
              <Avatar src={p.image} name={p.name} size="sm" />
            </div>
          ))}
          {challenge.participants.length > 5 && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white"
              style={{
                background: "var(--color-grey-200)",
                color: "var(--color-grey-600)",
              }}
            >
              +{challenge.participants.length - 5}
            </div>
          )}
        </div>

        {!challenge.isParticipant && (
          <button
            onClick={() => onJoin(challenge.id)}
            disabled={isPending}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            style={{
              background: "var(--color-grey-900)",
              color: "white",
            }}
          >
            Bli med
          </button>
        )}
      </div>

      {/* Leaderboard preview */}
      {challenge.participants.some((p) => p.currentValue !== null) && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--color-grey-100)" }}>
          {challenge.participants
            .filter((p) => p.currentValue !== null)
            .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
            .slice(0, 3)
            .map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-2 py-1"
              >
                <span
                  className="w-5 text-xs font-semibold text-center"
                  style={{ color: "var(--color-grey-400)" }}
                >
                  {i + 1}.
                </span>
                <span
                  className="text-xs flex-1"
                  style={{ color: "var(--color-grey-700)" }}
                >
                  {p.name}
                </span>
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: "var(--color-grey-900)" }}
                >
                  {p.currentValue?.toFixed(1)}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// LEADERBOARD TAB
// ════════════════════════════════════════════════════════════

function LeaderboardTab({
  initialLeaderboard,
  currentUserId,
}: {
  initialLeaderboard: LeaderboardEntry[];
  currentUserId: string;
}) {
  const [sortBy, setSortBy] = useState<LeaderboardSort>("handicap");
  const [entries, setEntries] = useState(initialLeaderboard);
  const [isPending, startTransition] = useTransition();

  const handleSort = (sort: LeaderboardSort) => {
    setSortBy(sort);
    startTransition(async () => {
      const data = await getFriendsLeaderboard(sort);
      setEntries(data);
    });
  };

  const sortLabel = LEADERBOARD_SORTS.find((s) => s.key === sortBy)?.label ?? "";
  const unit =
    sortBy === "handicap"
      ? "HCP"
      : sortBy === "improvement"
        ? "slag"
        : "okter";

  return (
    <div className="space-y-4">
      {/* Sort toggles */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{ background: "var(--color-grey-100)" }}
      >
        {LEADERBOARD_SORTS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer",
              sortBy === key ? "bg-white shadow-sm" : "hover:bg-white/50"
            )}
            style={{
              color:
                sortBy === key
                  ? "var(--color-grey-900)"
                  : "var(--color-grey-500)",
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          borderColor: "var(--color-grey-200)",
          background: "white",
        }}
      >
        {entries.length === 0 ? (
          <div className="py-12 text-center">
            <BarChart3
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: "var(--color-grey-300)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--color-grey-500)" }}
            >
              Ingen data enna
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--color-grey-400)" }}
            >
              Legg til venner for a se leaderboard
            </p>
          </div>
        ) : (
          <div>
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-colors",
                  entry.isCurrentUser && "bg-[var(--color-grey-100)]"
                )}
                style={{
                  borderBottom:
                    index < entries.length - 1
                      ? "1px solid var(--color-grey-100)"
                      : undefined,
                }}
              >
                {/* Rank */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    index === 0 && "bg-[var(--color-grey-900)] text-white",
                    index === 1 && "bg-[var(--color-grey-300)] text-[var(--color-grey-800)]",
                    index === 2 && "bg-[var(--color-grey-200)] text-[var(--color-grey-700)]",
                    index > 2 && "text-[var(--color-grey-400)]"
                  )}
                >
                  {index + 1}
                </div>

                <Avatar src={entry.image} name={entry.name} />

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm truncate",
                      entry.isCurrentUser ? "font-semibold" : "font-medium"
                    )}
                    style={{ color: "var(--color-grey-900)" }}
                  >
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span
                        className="ml-1.5 text-xs"
                        style={{ color: "var(--color-grey-400)" }}
                      >
                        (deg)
                      </span>
                    )}
                  </p>
                </div>

                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: "var(--color-grey-900)" }}
                >
                  {entry.value !== null
                    ? sortBy === "handicap"
                      ? entry.value.toFixed(1)
                      : sortBy === "improvement"
                        ? `${entry.value > 0 ? "-" : "+"}${Math.abs(entry.value).toFixed(1)}`
                        : entry.value
                    : "-"}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-grey-400)" }}
                >
                  {unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
