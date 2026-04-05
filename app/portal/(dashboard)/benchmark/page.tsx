import { requirePortalUser } from "@/lib/portal/auth";
import { getPlayerSGProfile } from "./actions";
import { BenchmarkClient } from "./benchmark-client";

export const metadata = {
  title: "Benchmarking | AK Golf Portal",
};

export default async function BenchmarkPage() {
  await requirePortalUser();

  const profile = await getPlayerSGProfile();

  return <BenchmarkClient profile={profile} />;
}
