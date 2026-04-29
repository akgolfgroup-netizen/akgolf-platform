import type { Metadata } from "next";
import { AboutPageClient } from "@/components/website-v2/about-page-client";

export const metadata: Metadata = {
  title: "Om AK Golf Group",
  description:
    "Møt teamet bak AK Golf Group — Anders Kristiansen og Markus Røinås Pedersen. Coaching som måler at du faktisk blir bedre.",
};

export default function OmOssPage() {
  return <AboutPageClient />;
}
