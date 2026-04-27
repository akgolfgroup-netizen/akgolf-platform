import { prisma } from "@/lib/portal/prisma";
import type {
  LibraryItem,
  LibraryItemStatus,
  LibraryItemType,
} from "@prisma/client";

export interface LibraryListFilter {
  status?: LibraryItemStatus;
  type?: LibraryItemType;
  area?: string;
  search?: string;
}

export async function listLibraryItems(
  filter: LibraryListFilter = {}
): Promise<LibraryItem[]> {
  return prisma.libraryItem.findMany({
    where: {
      status: filter.status,
      type: filter.type,
      area: filter.area,
      ...(filter.search
        ? {
            OR: [
              { title: { contains: filter.search, mode: "insensitive" } },
              { summary: { contains: filter.search, mode: "insensitive" } },
              { tags: { has: filter.search } },
            ],
          }
        : {}),
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 200,
  });
}

export async function getLibraryItem(id: string) {
  return prisma.libraryItem.findUnique({
    where: { id },
    include: {
      ApprovedBy: { select: { id: true, name: true, email: true } },
      RejectedBy: { select: { id: true, name: true, email: true } },
      CreatedBy: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function countByStatus(): Promise<Record<LibraryItemStatus, number>> {
  const rows = await prisma.libraryItem.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const map: Record<LibraryItemStatus, number> = {
    DRAFT: 0,
    APPROVED: 0,
    REJECTED: 0,
    ARCHIVED: 0,
  };
  for (const row of rows) {
    map[row.status] = row._count._all;
  }
  return map;
}

/**
 * Henter kun godkjente items for treningsplanleggeren.
 * Inkrementerer usageCount når items returneres som "valgt".
 */
export async function findApprovedForPlanner(input: {
  type?: LibraryItemType;
  area?: string;
  playerLevel?: string;
  minDuration?: number;
  maxDuration?: number;
  limit?: number;
}) {
  return prisma.libraryItem.findMany({
    where: {
      status: "APPROVED",
      type: input.type,
      area: input.area,
      ...(input.playerLevel
        ? { playerLevels: { has: input.playerLevel } }
        : {}),
      ...(input.minDuration !== undefined
        ? { minDurationMinutes: { lte: input.minDuration } }
        : {}),
      ...(input.maxDuration !== undefined
        ? { maxDurationMinutes: { gte: input.maxDuration } }
        : {}),
    },
    orderBy: [{ rating: "desc" }, { usageCount: "desc" }],
    take: input.limit ?? 20,
  });
}

export async function incrementUsage(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await prisma.libraryItem.updateMany({
    where: { id: { in: ids } },
    data: { usageCount: { increment: 1 } },
  });
}
