// scripts/verify-stripe.ts
import "dotenv/config";
import Stripe from "stripe";
import { prisma } from "../lib/portal/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

async function verifyStripe() {
  console.log("🔍 Verifying Stripe configuration...\n");

  // 1. Check API key works
  console.log("1. Testing API connection...");
  try {
    const account = await stripe.accounts.retrieve();
    console.log(`   ✓ Connected to Stripe account: ${account.business_profile?.name || account.id}`);
  } catch (e) {
    console.error("   ✗ Failed to connect to Stripe:", e);
    process.exit(1);
  }

  // 2. Check webhook endpoint
  console.log("\n2. Checking webhook endpoints...");
  const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
  const portalWebhook = webhooks.data.find(w =>
    w.url.includes("/api/portal/webhooks/stripe")
  );
  if (portalWebhook) {
    console.log(`   ✓ Webhook found: ${portalWebhook.url}`);
    console.log(`   ✓ Events: ${portalWebhook.enabled_events.join(", ")}`);
  } else {
    console.log("   ⚠ No webhook found for /api/portal/webhooks/stripe");
    console.log("   → Create webhook in Stripe Dashboard");
  }

  // 3. Verify prices match database
  console.log("\n3. Comparing prices with database...");
  const serviceTypes = await prisma.serviceType.findMany({
    where: { isActive: true, allowStripe: true },
    select: { id: true, name: true, price: true },
  });

  for (const service of serviceTypes) {
    const expectedStripeAmount = service.price * 100; // Kroner to øre
    console.log(`   ${service.name}: ${service.price} kr → ${expectedStripeAmount} øre (Stripe)`);
  }

  // 4. Check required env vars
  console.log("\n4. Checking environment variables...");
  const requiredVars = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  ];
  for (const v of requiredVars) {
    if (process.env[v]) {
      console.log(`   ✓ ${v} is set`);
    } else {
      console.log(`   ✗ ${v} is MISSING`);
    }
  }

  console.log("\n✅ Stripe verification complete!");
}

verifyStripe()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
