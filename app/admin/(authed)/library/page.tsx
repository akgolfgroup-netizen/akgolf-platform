import { redirect } from "next/navigation";
import { Capability } from "@prisma/client";
import { getPortalUser } from "@/lib/portal/auth";
import { hasCapability } from "@/lib/portal/capabilities/check";
import { listLibraryItems, countByStatus } from "@/lib/portal/library/queries";
import type { LibraryItemStatus, LibraryItemType } from "@prisma/client";
import { LibraryClient } from "./library-client";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    type?: string;
    area?: string;
    q?: string;
  }>;
}

const VALID_STATUSES: LibraryItemStatus[] = [
  "DRAFT",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
];
const VALID_TYPES: LibraryItemType[] = [
  "DRILL",
  "EXERCISE",
  "TEST",
  "ACTIVITY",
  "COMPETITION_PREP",
];

export default async function LibraryPage({ searchParams }: PageProps) {
  const user = await getPortalUser();
  if (!user) redirect("/portal/login");

  const allowed = await hasCapability(user.id, Capability.LIBRARY_VIEW);
  if (!allowed) redirect("/admin");

  const params = await searchParams;
  const status = VALID_STATUSES.includes(params.status as LibraryItemStatus)
    ? (params.status as LibraryItemStatus)
    : "DRAFT";
  const type = VALID_TYPES.includes(params.type as LibraryItemType)
    ? (params.type as LibraryItemType)
    : undefined;
  const area = params.area || undefined;
  const search = params.q?.trim() || undefined;

  const [items, counts] = await Promise.all([
    listLibraryItems({ status, type, area, search }),
    countByStatus(),
  ]);

  const canApprove = await hasCapability(user.id, Capability.LIBRARY_APPROVE);
  const canGenerate = await hasCapability(user.id, Capability.LIBRARY_GENERATE);

  return (
    <LibraryClient
      items={items}
      counts={counts}
      filter={{ status, type, area, search }}
      canApprove={canApprove}
      canGenerate={canGenerate}
    />
  );
}
