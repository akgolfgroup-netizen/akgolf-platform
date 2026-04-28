import { cookies } from "next/headers";
import { HomeClient } from "./home-client";
import { HomeV2Client } from "@/components/website-v2/home-v2-client";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ v?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const cookieStore = await cookies();
  const wantsV2 =
    sp.v === "2" || cookieStore.get("website")?.value === "v2";

  if (wantsV2) {
    return <HomeV2Client />;
  }
  return <HomeClient />;
}
