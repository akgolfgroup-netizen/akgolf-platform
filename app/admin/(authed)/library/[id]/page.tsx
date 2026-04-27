import { redirect, notFound } from "next/navigation";
import { Capability } from "@prisma/client";
import { getPortalUser } from "@/lib/portal/auth";
import { hasCapability } from "@/lib/portal/capabilities/check";
import { getLibraryItem } from "@/lib/portal/library/queries";
import { LibraryDetail } from "./library-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LibraryDetailPage({ params }: PageProps) {
  const user = await getPortalUser();
  if (!user) redirect("/portal/login");

  const allowed = await hasCapability(user.id, Capability.LIBRARY_VIEW);
  if (!allowed) redirect("/admin/dashboard");

  const { id } = await params;
  const item = await getLibraryItem(id);
  if (!item) notFound();

  const canApprove = await hasCapability(user.id, Capability.LIBRARY_APPROVE);

  return <LibraryDetail item={item} canApprove={canApprove} />;
}
