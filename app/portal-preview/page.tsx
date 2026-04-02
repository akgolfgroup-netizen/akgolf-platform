import { Metadata } from "next";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { PortalPreviewClient } from "./portal-preview-client";

export const metadata: Metadata = {
  title: "Spillerportalen | AK Golf",
  description: "Se hvordan AK Golf spillerportal hjelper deg trene smartere mellom coachingøktene.",
};

export default function PortalPreviewPage() {
  return (
    <>
      <WebsiteNav />
      <main>
        <PortalPreviewClient />
      </main>
      <WebsiteFooter />
    </>
  );
}
