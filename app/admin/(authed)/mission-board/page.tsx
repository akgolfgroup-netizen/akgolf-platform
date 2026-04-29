import { requirePortalUser } from "@/lib/portal/auth";
import { CoachHQDarkShell } from "@/components/admin/coachhq-dark";
import { MissionBoardClientV2 } from "./mission-board-client-v2";
import { fetchMissionBoardKanban } from "./actions";

export const metadata = {
  title: "Mission Board | AK Golf CoachHQ",
};
export const dynamic = "force-dynamic";

export default async function MissionBoardPage() {
  const user = await requirePortalUser();
  const board = await fetchMissionBoardKanban();

  return (
    <CoachHQDarkShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }}
      title="Mission Board"
      meta={`${board.counts.todo + board.counts.in_progress + board.counts.done} oppdrag`}
    >
      <MissionBoardClientV2 board={board} />
    </CoachHQDarkShell>
  );
}
