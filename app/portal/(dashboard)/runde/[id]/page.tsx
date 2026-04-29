import { requirePortalUser } from "@/lib/portal/auth";
import { getRoundDetail } from "../actions";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RoundRedirectPage({ params }: Props) {
  const { id } = await params;
  await requirePortalUser();

  const round = await getRoundDetail(id);
  if (!round) notFound();

  if (round.isComplete) {
    redirect(`/portal/runde/${id}/oppsummering`);
  }

  redirect(`/portal/runde/${id}/live`);
}
