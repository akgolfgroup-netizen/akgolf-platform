"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";

// ════════════════════════════════════════════════════════════
// FRIENDS
// ════════════════════════════════════════════════════════════

export async function getFriends() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  // Hent alle aksepterte vennskap
  const { data: friendships } = await supabase
    .from("Friendship")
    .select("id, userId, friendId")
    .eq("status", "ACCEPTED")
    .or(`userId.eq.${user.id},friendId.eq.${user.id}`);

  const friendIds = (friendships || []).map((f) =>
    f.userId === user.id ? f.friendId : f.userId
  );

  if (friendIds.length === 0) return [];

  // Hent vennedata separat for ren typing
  const { data: friends } = await supabase
    .from("User")
    .select(`
      id,
      name,
      image,
      lastActiveAt,
      HandicapEntry (handicapIndex, date)
    `)
    .in("id", friendIds);

  const friendshipMap = new Map(
    (friendships || []).map((f) => [
      f.userId === user.id ? f.friendId : f.userId,
      f.id,
    ])
  );

  return (friends || []).map((friend) => {
    const handicapEntries = (friend.HandicapEntry as { handicapIndex: number; date: string }[]) || [];
    return {
      friendshipId: friendshipMap.get(friend.id) ?? "",
      id: friend.id,
      name: friend.name ?? "Ukjent",
      image: friend.image,
      lastActiveAt: friend.lastActiveAt?.toString() ?? null,
      latestHandicap: handicapEntries[0]?.handicapIndex ?? null,
    };
  });
}

export async function getPendingRequests() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  const { data: pending } = await supabase
    .from("Friendship")
    .select(`
      id,
      User (id, name, image),
      createdAt
    `)
    .eq("friendId", user.id)
    .eq("status", "PENDING")
    .order("createdAt", { ascending: false });

  return (pending || []).map((f) => {
    const userRecord = f.User as unknown as { id: string; name: string | null; image: string | null } | null;
    return {
      friendshipId: f.id,
      id: userRecord?.id ?? "",
      name: userRecord?.name ?? "Ukjent",
      image: userRecord?.image ?? null,
      createdAt: f.createdAt,
    };
  });
}

const searchSchema = z.object({
  query: z.string().min(2).max(100),
});

export async function searchUsers(query: string) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const parsed = searchSchema.safeParse({ query });
  if (!parsed.success) return [];

  const safeQuery = parsed.data.query;
  const supabase = await createServerSupabase();

  const { data: users } = await supabase
    .from("User")
    .select("id, name, image, email")
    .neq("id", user.id)
    .eq("isActive", true)
    .or(`name.ilike.%${safeQuery}%,email.ilike.%${safeQuery}%`)
    .limit(10);

  // Check existing friendships
  const { data: existingFriendships } = await supabase
    .from("Friendship")
    .select("userId, friendId, status")
    .or(`userId.eq.${user.id},friendId.eq.${user.id}`)
    .in("userId", (users || []).map((u) => u.id))
    .in("friendId", (users || []).map((u) => u.id));

  const friendshipMap = new Map<string, string>();
  for (const f of existingFriendships || []) {
    const otherId = f.userId === user.id ? f.friendId : f.userId;
    friendshipMap.set(otherId, f.status);
  }

  return (users || []).map((u) => ({
    id: u.id,
    name: u.name ?? "Ukjent",
    image: u.image,
    email: u.email ? `${u.email.slice(0, 3)}...` : null,
    friendshipStatus: friendshipMap.get(u.id) ?? null,
  }));
}

export async function sendFriendRequest(friendId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  if (friendId === user.id) {
    throw new Error("Du kan ikke legge til deg selv");
  }

  const supabase = await createServerSupabase();

  // Check if friendship already exists
  const { data: existing } = await supabase
    .from("Friendship")
    .select("id")
    .or(`and(userId.eq.${user.id},friendId.eq.${friendId}),and(userId.eq.${friendId},friendId.eq.${user.id})`)
    .single();

  if (existing) {
    throw new Error("Venneforespørsel eksisterer allerede");
  }

  await supabase.from("Friendship").insert({
    id: nanoid(),
    userId: user.id,
    friendId,
    status: "PENDING",
  });

  revalidatePath("/portal/sosialt");
}

export async function acceptFriendRequest(friendshipId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();

  const { data: friendship } = await supabase
    .from("Friendship")
    .select("*")
    .eq("id", friendshipId)
    .single();

  if (!friendship || friendship.friendId !== user.id) {
    throw new Error("Venneforespørsel ikke funnet");
  }

  if (friendship.status !== "PENDING") {
    throw new Error("Venneforespørsel er allerede behandlet");
  }

  await supabase
    .from("Friendship")
    .update({ status: "ACCEPTED" })
    .eq("id", friendshipId);

  revalidatePath("/portal/sosialt");
}

export async function declineFriendRequest(friendshipId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();

  const { data: friendship } = await supabase
    .from("Friendship")
    .select("*")
    .eq("id", friendshipId)
    .single();

  if (!friendship || friendship.friendId !== user.id) {
    throw new Error("Venneforespørsel ikke funnet");
  }

  await supabase.from("Friendship").delete().eq("id", friendshipId);

  revalidatePath("/portal/sosialt");
}

export async function removeFriend(friendshipId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();

  const { data: friendship } = await supabase
    .from("Friendship")
    .select("*")
    .eq("id", friendshipId)
    .single();

  if (
    !friendship ||
    (friendship.userId !== user.id && friendship.friendId !== user.id)
  ) {
    throw new Error("Vennskap ikke funnet");
  }

  await supabase.from("Friendship").delete().eq("id", friendshipId);

  revalidatePath("/portal/sosialt");
}

// ════════════════════════════════════════════════════════════
// CHALLENGES
// ════════════════════════════════════════════════════════════

export async function getActiveChallenges() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const now = new Date().toISOString();

  const { data: challenges } = await supabase
    .from("Challenge")
    .select(`
      *,
      Creator (id, name, image),
      ChallengeParticipant (
        *,
        User (id, name, image)
      )
    `)
    .gte("endDate", now)
    .or(`createdById.eq.${user.id},ChallengeParticipant.userId.eq.${user.id}`)
    .order("endDate", { ascending: true });

  return (challenges || []).map((c) => ({
    id: c.id,
    title: c.title,
    type: c.type,
    metric: c.metric,
    startDate: c.startDate,
    endDate: c.endDate,
    isPublic: c.isPublic,
    creator: {
      id: (c.Creator as { id: string }).id,
      name: (c.Creator as { name: string | null }).name ?? "Ukjent",
      image: (c.Creator as { image: string | null }).image,
    },
    participants: ((c.ChallengeParticipant as { User: { id: string; name: string | null; image: string | null }; userId: string; currentValue: number; rank: number }[]) || []).map((p) => ({
      id: p.userId,
      name: p.User.name ?? "Ukjent",
      image: p.User.image,
      currentValue: p.currentValue,
      rank: p.rank,
    })),
    isCreator: c.createdById === user.id,
    isParticipant: (c.ChallengeParticipant as { userId: string }[]).some((p) => p.userId === user.id),
  }));
}

const challengeSchema = z.object({
  title: z.string().min(2).max(100),
  type: z.string(),
  metric: z.string().min(1).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  inviteFriendIds: z.array(z.string()).max(20).optional(),
});

export async function createChallenge(data: {
  title: string;
  type: string;
  metric: string;
  startDate: string;
  endDate: string;
  inviteFriendIds?: string[];
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const parsed = challengeSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Ugyldig data");
  }

  const challengeId = nanoid();
  const supabase = await createServerSupabase();

  await supabase.from("Challenge").insert({
    id: challengeId,
    createdById: user.id,
    title: parsed.data.title,
    type: parsed.data.type,
    metric: parsed.data.metric,
    startDate: parsed.data.startDate,
    endDate: parsed.data.endDate,
  });

  // Add creator as participant
  await supabase.from("ChallengeParticipant").insert({
    id: nanoid(),
    challengeId,
    userId: user.id,
  });

  // Add invited friends as participants
  if (parsed.data.inviteFriendIds?.length) {
    await supabase.from("ChallengeParticipant").insert(
      parsed.data.inviteFriendIds.map((friendId) => ({
        id: nanoid(),
        challengeId,
        userId: friendId,
      }))
    );
  }

  revalidatePath("/portal/sosialt");
  return { id: challengeId };
}

export async function joinChallenge(challengeId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();

  const { data: challenge } = await supabase
    .from("Challenge")
    .select("isPublic, endDate")
    .eq("id", challengeId)
    .single();

  if (!challenge) throw new Error("Utfordring ikke funnet");
  if (new Date(challenge.endDate) < new Date()) throw new Error("Utfordringen er avsluttet");

  const { data: existing } = await supabase
    .from("ChallengeParticipant")
    .select("id")
    .eq("challengeId", challengeId)
    .eq("userId", user.id)
    .single();

  if (existing) throw new Error("Du deltar allerede");

  await supabase.from("ChallengeParticipant").insert({
    id: nanoid(),
    challengeId,
    userId: user.id,
  });

  revalidatePath("/portal/sosialt");
}

// ════════════════════════════════════════════════════════════
// LEADERBOARD
// ════════════════════════════════════════════════════════════

export async function getFriendsLeaderboard(
  sortBy: "handicap" | "improvement" | "streak" = "handicap"
) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  // Get all accepted friends
  const { data: friendships } = await supabase
    .from("Friendship")
    .select("userId, friendId")
    .eq("status", "ACCEPTED")
    .or(`userId.eq.${user.id},friendId.eq.${user.id}`);

  const friendIds = (friendships || []).map((f) =>
    f.userId === user.id ? f.friendId : f.userId
  );
  const allUserIds = [user.id, ...friendIds];

  if (sortBy === "handicap") {
    const { data: users } = await supabase
      .from("User")
      .select(`
        id,
        name,
        image,
        HandicapEntry (handicapIndex, date)
      `)
      .in("id", allUserIds);

    return (users || [])
      .map((u) => {
        const entries = (u.HandicapEntry as { handicapIndex: number; date: string }[]) || [];
        return {
          id: u.id,
          name: u.name ?? "Ukjent",
          image: u.image,
          value: entries[0]?.handicapIndex ?? null,
          isCurrentUser: u.id === user.id,
        };
      })
      .filter((u) => u.value !== null)
      .sort((a, b) => (a.value ?? 54) - (b.value ?? 54));
  }

  if (sortBy === "improvement") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: users } = await supabase
      .from("User")
      .select(`
        id,
        name,
        image,
        HandicapEntry (handicapIndex, date)
      `)
      .in("id", allUserIds);

    return (users || [])
      .map((u) => {
        const entries = ((u.HandicapEntry as { handicapIndex: number; date: string }[]) || [])
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const current = entries[0]?.handicapIndex;
        const oldEntry = entries.find(
          (e) => new Date(e.date) <= thirtyDaysAgo
        );
        const improvement =
          current != null && oldEntry
            ? (oldEntry.handicapIndex ?? 0) - current
            : null;

        return {
          id: u.id,
          name: u.name ?? "Ukjent",
          image: u.image,
          value: improvement,
          isCurrentUser: u.id === user.id,
        };
      })
      .filter((u) => u.value !== null)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }

  // streak — training logs count last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: users } = await supabase
    .from("User")
    .select(`
      id,
      name,
      image,
      TrainingLog (id)
    `)
    .in("id", allUserIds)
    .filter("TrainingLog.date", "gte", thirtyDaysAgo.toISOString());

  return (users || [])
    .map((u) => ({
      id: u.id,
      name: u.name ?? "Ukjent",
      image: u.image,
      value: ((u.TrainingLog as { id: string }[]) || []).length,
      isCurrentUser: u.id === user.id,
    }))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
}
