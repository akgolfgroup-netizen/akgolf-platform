import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface ProductConfig {
  name: string;
  description: string;
  priceNok: number;
  type: "subscription" | "one_time";
  metadata: Record<string, string>;
}

const COACHING_PRODUCTS: Record<string, ProductConfig> = {
  performance: {
    name: "Performance",
    description: "2 × 20 min individuell coaching/mnd med selvbooking 7 dager frem. Full spillerportal.",
    priceNok: 1600,
    type: "subscription",
    metadata: {
      sessionsPerMonth: "2",
      sessionDuration: "20",
      bookingWindowDays: "7",
      tier: "PERFORMANCE",
    },
  },
  performancePro: {
    name: "Performance Pro",
    description: "4 × 20 min individuell coaching/mnd med prioritert booking 14 dager frem. Full spillerportal.",
    priceNok: 2000,
    type: "subscription",
    metadata: {
      sessionsPerMonth: "4",
      sessionDuration: "20",
      bookingWindowDays: "14",
      tier: "PERFORMANCE_PRO",
    },
  },
  juniorAcademy: {
    name: "Junior Academy",
    description: "Strukturert gruppetrening for juniorer med nivåtilpasset program og foreldresamarbeid.",
    priceNok: 2500,
    type: "subscription",
    metadata: {
      tier: "JUNIOR_ACADEMY",
    },
  },
  juniorElite: {
    name: "Junior Elite",
    description: "8 × 20 min individuell coaching/mnd (2/uke) med faste tider. TrackMan-analyse og full spillerportal.",
    priceNok: 2500,
    type: "subscription",
    metadata: {
      sessionsPerMonth: "8",
      sessionDuration: "20",
      tier: "JUNIOR_ELITE",
    },
  },
  flex50: {
    name: "Flex 50",
    description: "50 minutter individuell coaching. Book ledige tider 48 timer i forveien. Ingen binding.",
    priceNok: 1500,
    type: "one_time",
    metadata: {
      sessionDuration: "50",
      tier: "FLEX",
    },
  },
  flex90: {
    name: "Flex 90",
    description: "90 minutter dypdykk med full TrackMan-analyse. Book ledige tider 48 timer i forveien. Ingen binding.",
    priceNok: 2500,
    type: "one_time",
    metadata: {
      sessionDuration: "90",
      tier: "FLEX",
    },
  },
};

async function main() {
  console.log("Oppretter Stripe-produkter for coaching...\n");

  const envLines: string[] = [];

  for (const [key, config] of Object.entries(COACHING_PRODUCTS)) {
    console.log(`Oppretter ${config.name}...`);

    // Opprett produkt
    const product = await stripe.products.create({
      name: config.name,
      description: config.description,
      metadata: {
        ...config.metadata,
        source: "akgolf-coaching",
      },
    });

    // Opprett pris
    const priceParams: Stripe.PriceCreateParams = {
      product: product.id,
      unit_amount: config.priceNok * 100, // Stripe bruker øre
      currency: "nok",
      metadata: {
        ...config.metadata,
        source: "akgolf-coaching",
      },
    };

    if (config.type === "subscription") {
      priceParams.recurring = { interval: "month" };
    }

    const price = await stripe.prices.create(priceParams);

    // Generer env-variabelnavn
    const envKey = `STRIPE_PRICE_${key.replace(/([A-Z])/g, "_$1").toUpperCase()}`;
    envLines.push(`${envKey}=${price.id}`);

    console.log(`  Produkt: ${product.id}`);
    console.log(`  Pris: ${price.id} (${config.priceNok} kr${config.type === "subscription" ? "/mnd" : ""})`);
    console.log("");
  }

  console.log("=".repeat(60));
  console.log("Legg disse i .env:\n");
  console.log(envLines.join("\n"));
  console.log("\n" + "=".repeat(60));
  console.log("\nFerdig! Alle produkter opprettet i Stripe.");
}

main().catch((e) => {
  console.error("Feil:", e);
  process.exit(1);
});
