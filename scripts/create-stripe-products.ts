// @ts-nocheck — AppModule, AppBundle models not yet in Prisma schema
import "dotenv/config";
import Stripe from "stripe";
import { prisma } from "../lib/portal/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function main() {
  console.log("Creating Stripe products and prices for app modules...\n");

  const modules = await prisma.appModule.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  for (const mod of modules) {
    // Skip free modules
    if (mod.monthlyPriceNok === 0) {
      console.log(`  ⏭️  ${mod.name} (gratis - ingen Stripe-produkt)`);
      continue;
    }

    // Check if product already exists
    if (mod.stripePriceId) {
      console.log(`  ✅ ${mod.name} har allerede Stripe Price ID: ${mod.stripePriceId}`);
      continue;
    }

    // Create product
    const product = await stripe.products.create({
      name: mod.name,
      description: mod.description || undefined,
      metadata: {
        module_slug: mod.slug,
        source: "akgolf-portal",
      },
    });

    // Create monthly price (amount in øre)
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: mod.monthlyPriceNok,
      currency: "nok",
      recurring: {
        interval: "month",
      },
      metadata: {
        module_slug: mod.slug,
        interval: "month",
      },
    });

    // Create yearly price if defined
    let yearlyPrice: Stripe.Price | null = null;
    if (mod.yearlyPriceNok) {
      yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: mod.yearlyPriceNok,
        currency: "nok",
        recurring: {
          interval: "year",
        },
        metadata: {
          module_slug: mod.slug,
          interval: "year",
        },
      });
    }

    // Update module with Stripe IDs
    await prisma.appModule.update({
      where: { id: mod.id },
      data: {
        stripePriceId: monthlyPrice.id,
        stripeYearlyPriceId: yearlyPrice?.id,
      },
    });

    console.log(`  ✅ ${mod.name}`);
    console.log(`     Product: ${product.id}`);
    console.log(`     Monthly: ${monthlyPrice.id} (${mod.monthlyPriceNok / 100} kr/mnd)`);
    if (yearlyPrice) {
      console.log(`     Yearly:  ${yearlyPrice.id} (${mod.yearlyPriceNok! / 100} kr/år)`);
    }
  }

  // Now handle bundles
  console.log("\nCreating Stripe products for bundles...\n");

  const bundles = await prisma.appBundle.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  for (const bundle of bundles) {
    if (bundle.stripePriceId) {
      console.log(`  ✅ ${bundle.name} har allerede Stripe Price ID: ${bundle.stripePriceId}`);
      continue;
    }

    const product = await stripe.products.create({
      name: bundle.name,
      description: bundle.description || undefined,
      metadata: {
        bundle_slug: bundle.slug,
        source: "akgolf-portal",
      },
    });

    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: bundle.monthlyPriceNok,
      currency: "nok",
      recurring: {
        interval: "month",
      },
      metadata: {
        bundle_slug: bundle.slug,
        interval: "month",
      },
    });

    let yearlyPrice: Stripe.Price | null = null;
    if (bundle.yearlyPriceNok) {
      yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: bundle.yearlyPriceNok,
        currency: "nok",
        recurring: {
          interval: "year",
        },
        metadata: {
          bundle_slug: bundle.slug,
          interval: "year",
        },
      });
    }

    await prisma.appBundle.update({
      where: { id: bundle.id },
      data: {
        stripePriceId: monthlyPrice.id,
        stripeYearlyPriceId: yearlyPrice?.id,
      },
    });

    console.log(`  ✅ ${bundle.name}`);
    console.log(`     Product: ${product.id}`);
    console.log(`     Monthly: ${monthlyPrice.id} (${bundle.monthlyPriceNok / 100} kr/mnd)`);
    if (yearlyPrice) {
      console.log(`     Yearly:  ${yearlyPrice.id} (${bundle.yearlyPriceNok! / 100} kr/år)`);
    }
  }

  console.log("\nDone! All Stripe products and prices created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
