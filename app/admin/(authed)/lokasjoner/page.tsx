import { getLocationsConfigData } from "./actions";
import { LokasjonerClient } from "./lokasjoner-client";

export const dynamic = "force-dynamic";

export default async function LokasjonerPage() {
  const data = await getLocationsConfigData();

  return (
    <LokasjonerClient
      locations={data.locations}
      services={data.services}
      instructors={data.instructors}
      initialConfig={data.config}
    />
  );
}
