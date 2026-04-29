import { requirePortalUser } from "@/lib/portal/auth";
import { MissionBoardDarkClient } from "./mission-board-dark-client";

export const metadata = {
  title: "Mission Board | AK Golf CoachHQ",
};
export const dynamic = "force-dynamic";

export default async function MissionBoardPage() {
  const user = await requirePortalUser();

  return <MissionBoardDarkClient user={user} />;
}
