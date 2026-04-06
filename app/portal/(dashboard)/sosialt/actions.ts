"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";
import { FriendshipStatus, ChallengeType } from "@prisma/client";

// ════════════════════════════════════════════════════════════
// FRIENDS
// ════════════════════════════════════════════════════════════

export async function getFriends() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  // Hent alle aksepterte vennskap
  const friendships = await prisma.friendship.findMany({
    where: {
      status: FriendshipStatus.ACCEPTED,
      OR: [{ userId: user.id }, { friendId: user.id }],
    },
    select: { id: true, userId: true, friendId: true },
  });

  const friendIds = friendships.map((f) =>
    f.userId === user.id ? f.friendId : f.userId
  );

  if (friendIds.length === 0) return [];

  // Hent vennedata separat for ren typing
  const friends = await prisma.user.findMany({
    where: { id: { in: friendIds } },
    select: {
      id: true,
      name: true,
      image: true,
      lastActiveAt: true,
      HandicapEntry: {
        orderBy: { date: "desc" as const },
        take: 1,
        select: { handicapIndex: true },
      },
    },
  });

  const friendshipMap = new Map(
    friendships.map((f) => [
      f.userId === user.id ? f.friendId : f.userId,
      f.id,
    ])
  );

  return friends.map((friend) => ({
    friendshipId: friendshipMap.get(friend.id) ?? "",
    id: friend.id,
    name: friend.name ?? "Ukjent",
    image: friend.image,
    lastActiveAt: friend.lastActiveAt?.toISOString() ?? null,
    latestHandicap: friend.HandicapEntry[0]?.handicapIndex ?? null,
  }));
}

export async function getPendingRequests() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const pending = await prisma.friendship.findMany({
    where: {
      friendId: user.id,
      status: FriendshipStatus.PENDING,
    },
    include: {
      User: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return pending.map((f) => ({
    friendshipId: f.id,
    id: f.User.id,
    name: f.User.name ?? "Ukjent",
    image: f.User.image,
    createdAt: f.createdAt.toISOString(),
  }));
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

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: user.id } },
        { isActive: true },
        {
          OR: [
            { name: { contains: safeQuery, mode: "insensitive" } },
            { email: { contains: safeQuery, mode: "insensitive" } },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
    },
    take: 10,
  });

  // Check existing friendships
  const existingFriendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { userId: user.id, friendId: { in: users.map((u) => u.id) } },
        { friendId: user.id, userId: { in: users.map((u) => u.id) } },
      ],
    },
    select: { userId: true, friendId: true, status: true },
  });

  const friendshipMap = new Map<string, string>();
  for (const f of existingFriendships) {
    const otherId = f.userId === user.id ? f.friendId : f.userId;
    friendshipMap.set(otherId, f.status);
  }

  return users.map((u) => ({
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

  // Check if friendship already exists
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId: user.id, friendId },
        { userId: friendId, friendId: user.id },
      ],
    },
  });

  if (existing) {
    throw new Error("Venneforespørsel eksisterer allerede");
  }

  await prisma.friendship.create({
    data: {
      id: nanoid(),
      userId: user.id,
      friendId,
      status: FriendshipStatus.PENDING,
    },
  });

  revalidatePath("/portal/sosialt");
}

export async function acceptFriendRequest(friendshipId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship || friendship.friendId !== user.id) {
    throw new Error("Venneforespørsel ikke funnet");
  }

  if (friendship.status !== FriendshipStatus.PENDING) {
    throw new Error("Venneforespørsel er allerede behandlet");
  }

  await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendshipStatus.ACCEPTED },
  });

  revalidatePath("/portal/sosialt");
}

export async function declineFriendRequest(friendshipId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship || friendship.friendId !== user.id) {
    throw new Error("Venneforespørsel ikke funnet");
  }

  await prisma.friendship.delete({
    where: { id: friendshipId },
  });

  revalidatePath("/portal/sosialt");
}

export async function removeFriend(friendshipId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (
    !friendship ||
    (friendship.userId !== user.id && friendship.friendId !== user.id)
  ) {
    throw new Error("Vennskap ikke funnet");
  }

  await prisma.friendship.delete({
    where: { id: friendshipId },
  });

  revalidatePath("/portal/sosialt");
}

// ════════════════════════════════════════════════════════════
// CHALLENGES
// ════════════════════════════════════════════════════════════

export async function getActiveChallenges() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const now = new Date();

  const challenges = await prisma.challenge.findMany({
    where: {
      endDate: { gte: now },
      OR: [
        { createdById: user.id },
        { Participants: { some: { userId: user.id } } },
      ],
    },
    include: {
      Creator: { select: { id: true, name: true, image: true } },
      Participants: {
        include: {
          User: { select: { id: true, name: true, image: true } },
        },
        orderBy: { rank: "asc" },
      },
    },
    orderBy: { endDate: "asc" },
  });

  return challenges.map((c) => ({
    id: c.id,
    title: c.title,
    type: c.type,
    metric: c.metric,
    startDate: c.startDate.toISOString(),
    endDate: c.endDate.toISOString(),
    isPublic: c.isPublic,
    creator: {
      id: c.Creator.id,
      name: c.Creator.name ?? "Ukjent",
      image: c.Creator.image,
    },
    participants: c.Participants.map((p) => ({
      id: p.userId,
      name: p.User.name ?? "Ukjent",
      image: p.User.image,
      currentValue: p.currentValue,
      rank: p.rank,
    })),
    isCreator: c.createdById === user.id,
    isParticipant: c.Participants.some((p) => p.userId === user.id),
  }));
}

const challengeSchema = z.object({
  title: z.string().min(2).max(100),
  type: z.nativeEnum(ChallengeType),
  metric: z.string().min(1).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  inviteFriendIds: z.array(z.string()).max(20).optional(),
});

export async function createChallenge(data: {
  title: string;
  type: ChallengeType;
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

  await prisma.challenge.create({
    data: {
      id: challengeId,
      createdById: user.id,
      title: parsed.data.title,
      type: parsed.data.type,
      metric: parsed.data.metric,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
    },
  });

  // Add creator as participant
  await prisma.challengeParticipant.create({
    data: {
      id: nanoid(),
      challengeId,
      userId: user.id,
    },
  });

  // Add invited friends as participants
  if (parsed.data.inviteFriendIds?.length) {
    await prisma.challengeParticipant.createMany({
      data: parsed.data.inviteFriendIds.map((friendId) => ({
        id: nanoid(),
        challengeId,
        userId: friendId,
      })),
    });
  }

  revalidatePath("/portal/sosialt");
  return { id: challengeId };
}

export async function joinChallenge(challengeId: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { isPublic: true, endDate: true },
  });

  if (!challenge) throw new Error("Utfordring ikke funnet");
  if (challenge.endDate < new Date()) throw new Error("Utfordringen er avsluttet");

  const existing = await prisma.challengeParticipant.findUnique({
    where: {
      challengeId_userId: {
        challengeId,
        userId: user.id,
      },
    },
  });

  if (existing) throw new Error("Du deltar allerede");

  await prisma.challengeParticipant.create({
    data: {
      id: nanoid(),
      challengeId,
      userId: user.id,
    },
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

  // Get all accepted friends
  const friendships = await prisma.friendship.findMany({
    where: {
      status: FriendshipStatus.ACCEPTED,
      OR: [{ userId: user.id }, { friendId: user.id }],
    },
    select: { userId: true, friendId: true },
  });

  const friendIds = friendships.map((f) =>
    f.userId === user.id ? f.friendId : f.userId
  );
  const allUserIds = [user.id, ...friendIds];

  if (sortBy === "handicap") {
    const users = await prisma.user.findMany({
      where: { id: { in: allUserIds } },
      select: {
        id: true,
        name: true,
        image: true,
        HandicapEntry: {
          orderBy: { date: "desc" },
          take: 1,
          select: { handicapIndex: true },
        },
      },
    });

    return users
      .map((u) => ({
        id: u.id,
        name: u.name ?? "Ukjent",
        image: u.image,
        value: u.HandicapEntry[0]?.handicapIndex ?? null,
        isCurrentUser: u.id === user.id,
      }))
      .filter((u) => u.value !== null)
      .sort((a, b) => (a.value ?? 54) - (b.value ?? 54));
  }

  if (sortBy === "improvement") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const users = await prisma.user.findMany({
      where: { id: { in: allUserIds } },
      select: {
        id: true,
        name: true,
        image: true,
        HandicapEntry: {
          orderBy: { date: "desc" },
          take: 10,
          select: { handicapIndex: true, date: true },
        },
      },
    });

    return users
      .map((u) => {
        const entries = u.HandicapEntry;
        const current = entries[0]?.handicapIndex;
        const oldEntry = entries.find(
          (e) => e.date <= thirtyDaysAgo
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

  const users = await prisma.user.findMany({
    where: { id: { in: allUserIds } },
    select: {
      id: true,
      name: true,
      image: true,
      TrainingLog: {
        where: { date: { gte: thirtyDaysAgo } },
        select: { id: true },
      },
    },
  });

  return users
    .map((u) => ({
      id: u.id,
      name: u.name ?? "Ukjent",
      image: u.image,
      value: u.TrainingLog.length,
      isCurrentUser: u.id === user.id,
    }))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
}
