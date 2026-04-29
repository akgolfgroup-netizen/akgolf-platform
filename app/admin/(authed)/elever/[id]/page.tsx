import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect, notFound } from "next/navigation";
import { CoachHQDarkShell } from "@/components/admin/coachhq-dark";
import { getStudentProfile } from "./actions";
import { SpillerprofilTabsClient } from "./spillerprofil-tabs-client";
import { SpillerprofilLongpageClient } from "./spillerprofil-longpage-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getStudentProfile(id);
  return {
    title: profile
      ? `${profile.name ?? "Spiller"} | AK Golf CoachHQ`
      : "Spiller | AK Golf CoachHQ",
  };
}

export default async function SpillerprofilPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ layout?: string }>;
}) {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const { id } = await params;
  const { layout } = await searchParams;
  const profile = await getStudentProfile(id);

  if (!profile) {
    notFound();
  }

  const isLongpage = layout === "longpage";

  return (
    <CoachHQDarkShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }}
      title={`Spillere · ${profile.name ?? "Spiller"}`}
      meta={
        isLongpage
          ? "scroll-vennlig · alt på ett sted"
          : "profil · oppdatert i sanntid"
      }
    >
      {isLongpage ? (
        <SpillerprofilLongpageClient profile={profile} />
      ) : (
        <SpillerprofilTabsClient profile={profile} />
      )}
    </CoachHQDarkShell>
  );
}
