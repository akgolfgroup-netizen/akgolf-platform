/**
 * Backfill Stripe-katalog for eksisterende ServiceType-records.
 *
 * Bruk: kjøres ÉN gang i prod etter at ekte STRIPE_SECRET_KEY er satt.
 *
 * Logikk:
 *   - Finn alle ServiceType der stripePriceId er null
 *   - For hver: opprett Stripe Product + Price (recurring kun hvis isRecurring)
 *   - Lagre product/price-id på record
 *
 * Kjør:
 *   set -a && source .env && set +a && DATABASE_URL="$DIRECT_URL" \
 *     npx tsx scripts/backfill-stripe-services.ts
 */

import { prisma } from "../lib/portal/prisma";
import { createStripeServiceProduct } from "../lib/portal/stripe/catalog";

async function main() {
  const services = await prisma.serviceType.findMany({
    where: { stripePriceId: null, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  console.log(`Funnet ${services.length} tjenester uten Stripe-pris.`);

  let succeeded = 0;
  let failed = 0;

  for (const s of services) {
    try {
      const result = await createStripeServiceProduct({
        name: s.name,
        description: s.description ?? undefined,
        priceKr: s.price,
        isRecurring: s.isRecurring,
        recurringInterval:
          s.recurringInterval === "year" ? "year" : "month",
      });

      await prisma.serviceType.update({
        where: { id: s.id },
        data: {
          stripeProductId: result.productId,
          stripePriceId: result.priceId,
          updatedAt: new Date(),
        },
      });

      console.log(
        `  ✓ ${s.name}: product=${result.productId}, price=${result.priceId}`,
      );
      succeeded++;
    } catch (err) {
      console.error(
        `  ✗ ${s.name}: ${err instanceof Error ? err.message : "ukjent feil"}`,
      );
      failed++;
    }
  }

  console.log(`\nFerdig. Suksess: ${succeeded}, feil: ${failed}.`);
}

main()
  .catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
