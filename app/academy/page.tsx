import { AcademyHeroV2 } from "@/components/website/academy-hero-v2";
import { AcademyMethodV2 } from "@/components/website/academy-method-v2";
import { PlayerJourney } from "@/components/website/player-journey";
import { AcademyPricesV2 } from "@/components/website/academy-prices-v2";
import { AcademyCtaV2 } from "@/components/website/academy-cta-v2";

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero med tydelig budskap */}
      <AcademyHeroV2 />
      
      {/* 2. Metodikken bak (Analyse, Plan, Oppfølging) */}
      <AcademyMethodV2 />
      
      {/* 3. Spillerreisen (Fra Markus til Anders) */}
      <PlayerJourney />
      
      {/* 4. Priser og pakker */}
      <AcademyPricesV2 />
      
      {/* 5. Avsluttende CTA */}
      <AcademyCtaV2 />
    </main>
  );
}