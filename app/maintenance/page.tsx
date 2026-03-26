import { AKLogo } from "@/components/website/AKLogo";

export const metadata = {
  title: "Vedlikehold | AK Golf",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-ink-90 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-8">
          <AKLogo variant="gold" size={64} />
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-4">
          Vi oppgraderer
        </h1>

        <p className="text-ink-30 mb-8 leading-relaxed">
          AK Golf er nede for vedlikehold. Vi jobber med forbedringer og er snart tilbake.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-ink-80 rounded-full text-sm text-ink-40">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          Tilbake om kort tid
        </div>

        <div className="mt-12 pt-8 border-t border-ink-80">
          <p className="text-xs text-ink-50">
            Spørsmål? Kontakt oss på{" "}
            <a href="mailto:post@akgolf.no" className="text-gold hover:underline">
              post@akgolf.no
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
