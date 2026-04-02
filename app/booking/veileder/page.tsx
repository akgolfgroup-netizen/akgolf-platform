import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { QuizWizard } from "../components/QuizWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finn riktig coaching | AK Golf",
  description: "Svar på noen enkle spørsmål og finn coaching som passer for deg.",
};

export default function VeilederPage() {
  return (
    <>
      <WebsiteNav />

      <main className="min-h-screen bg-white">
        <section className="pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="w-container">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 text-sm text-grey-500 hover:text-black transition-colors mb-12"
            >
              <ArrowLeft size={16} />
              Tilbake til booking
            </Link>

            <QuizWizard />
          </div>
        </section>
      </main>

      <WebsiteFooter />
    </>
  );
}
