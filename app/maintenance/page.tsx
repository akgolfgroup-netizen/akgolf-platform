import { AKLogo } from "@/components/website/AKLogo";

export const metadata = {
  title: "Vedlikehold | AK Golf Group",
  description: "Vi oppgraderer nettsiden. Tilbake snart.",
};

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-ink-deep flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <AKLogo className="h-16 w-auto mx-auto text-gold" />
        </div>

        {/* Tittel */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Vi oppgraderer nettsiden
        </h1>

        {/* Beskrivelse */}
        <p className="text-ink-40 text-lg mb-8">
          Vi jobber med forbedringer for a gi deg en enda bedre opplevelse.
          Nettsiden er tilbake innen kort tid.
        </p>

        {/* Forventet ferdig */}
        <div className="bg-ink-90/50 rounded-xl p-6 mb-8 border border-ink-80">
          <p className="text-ink-30 text-sm uppercase tracking-wider mb-2">
            Forventet ferdig
          </p>
          <p className="text-white text-xl font-semibold">
            25. mars 2026
          </p>
        </div>

        {/* Kontaktinfo */}
        <div className="text-ink-40">
          <p className="mb-2">Har du sporsmal?</p>
          <a
            href="mailto:post@akgolf.no"
            className="text-gold hover:text-gold-light transition-colors"
          >
            post@akgolf.no
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-ink-50 text-sm">
        AK Golf Group AS
      </footer>
    </main>
  );
}
