#!/usr/bin/env tsx
/**
 * Setup PlayerHQ Product + Price i Stripe.
 *
 * Krever STRIPE_SECRET_KEY i .env.
 *
 * Kjøres ÉN gang før lansering 1. juni:
 *   set -a && source .env && set +a && npx tsx scripts/setup-playerhq-stripe.ts
 *
 * Oppretter:
 *   - Product "PlayerHQ"
 *   - Price 299 NOK / monthly (recurring)
 *
 * Skriver Price ID til konsoll. Kopier til Vercel env-var STRIPE_PRICE_PLAYERHQ.
 */

import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error("Missing STRIPE_SECRET_KEY in environment");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

async function main() {
  console.log("Oppretter PlayerHQ Product + Price i Stripe...\n");

  // Sjekk om product allerede finnes
  const existing = await stripe.products.search({
    query: 'metadata["slug"]:"playerhq"',
  });

  let product: Stripe.Product;
  if (existing.data.length > 0) {
    product = existing.data[0];
    console.log(`Product finnes allerede: ${product.id}`);
  } else {
    product = await stripe.products.create({
      name: "PlayerHQ",
      description:
        "Spillerportal for AK Golf — treningsplan, statistikk, booking og personlig oppfølging.",
      metadata: { slug: "playerhq" },
    });
    console.log(`Product opprettet: ${product.id}`);
  }

  // Sjekk om price allerede finnes
  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 10,
  });

  let price: Stripe.Price | undefined = prices.data.find(
    (p) => p.unit_amount === 29900 && p.currency === "nok" && p.recurring?.interval === "month"
  );

  if (price) {
    console.log(`Price finnes allerede: ${price.id}`);
  } else {
    price = await stripe.prices.create({
      product: product.id,
      currency: "nok",
      unit_amount: 29900, // 299 NOK i øre
      recurring: { interval: "month" },
      metadata: { slug: "playerhq-299" },
    });
    console.log(`Price opprettet: ${price.id}`);
  }

  console.log("\n=== Ferdig ===");
  console.log("Product ID:", product.id);
  console.log("Price ID:  ", price.id);
  console.log("\nLegg til i Vercel env-vars:");
  console.log(`  STRIPE_PRICE_PLAYERHQ=${price.id}`);
  console.log(`  STRIPE_PRODUCT_PLAYERHQ=${product.id}`);
}

main().catch((err) => {
  console.error("Feil:", err);
  process.exit(1);
});
