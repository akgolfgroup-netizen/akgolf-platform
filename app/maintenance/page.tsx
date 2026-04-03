import { AKLogo } from "@/components/website/AKLogo";

export const metadata = {
  title: "Vedlikehold | AK Golf",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[var(--color-grey-900)] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-8">
          <AKLogo variant="white" size={64} />
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-4">
          Vi oppgraderer
        </h1>

        <p className="text-[var(--color-grey-400)] mb-8 leading-relaxed">
          AK Golf er nede for vedlikehold. Vi jobber med forbedringer og er snart tilbake.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-grey-800)] rounded-full text-sm text-[var(--color-grey-400)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-grey-400)] animate-pulse" />
          Tilbake om kort tid
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-grey-200)]">
          <p className="text-xs text-[var(--color-grey-500)]">
            Spørsmål? Kontakt oss på{" "}
            <a href="mailto:post@akgolf.no" className="text-white hover:underline">
              post@akgolf.no
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
