import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { getTrackManV2Data } from "../actions";
import { TrackManV2Client } from "@/components/portal/trackman-v2/trackman-v2-client";

export const metadata: Metadata = {
  title: "TrackMan v2 | PlayerHQ",
  description: "Pixel-rebuild av TrackMan-siden med dispersionsplot per kølle.",
};

export const dynamic = "force-dynamic";

export default async function TrackManV2Page() {
  await requirePortalUser();

  const data = await getTrackManV2Data().catch((err) => {
    console.error("[trackman/v2] getTrackManV2Data failed:", err);
    return null;
  });

  if (!data) {
    return (
      <div className="min-h-screen p-10" style={{ background: "#F4F6F4" }}>
        <div className="max-w-[800px] mx-auto p-6 rounded-xl bg-white border">
          <h1 className="text-xl font-bold">Kunne ikke laste TrackMan-data</h1>
          <p className="mt-2 text-sm">Prøv igjen om litt.</p>
        </div>
      </div>
    );
  }

  return <TrackManV2Client data={data} />;
}
