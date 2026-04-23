import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { getTrackManOverview } from "./actions";
import { TrackManClient } from "./trackman-client";

export const metadata: Metadata = {
  title: "TrackMan | PlayersHQ",
  description:
    "Dine TrackMan-sesjoner og analyser. Se klubbdata, trends og forbedringsområder.",
  openGraph: {
    title: "TrackMan | PlayersHQ",
    description:
      "Dine TrackMan-sesjoner og analyser. Se klubbdata, trends og forbedringsområder.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackMan | PlayersHQ",
    description:
      "Dine TrackMan-sesjoner og analyser. Se klubbdata, trends og forbedringsområder.",
  },
};

export default async function TrackManPage() {
  await requirePortalUser();

  const data = await getTrackManOverview();

  return <TrackManClient data={data} />;
}
