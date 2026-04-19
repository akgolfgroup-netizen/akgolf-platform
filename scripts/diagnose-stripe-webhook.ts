#!/usr/bin/env tsx
/**
 * Stripe Webhook Diagnose
 *
 * Kjører tester mot live webhook-endepunktet for å identifisere feil.
 *
 * Bruk: npx tsx scripts/diagnose-stripe-webhook.ts
 */

import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_URL = "https://akgolf.no/api/portal/webhooks/stripe";

async function diagnose() {
  console.log("🔍 Stripe Webhook Diagnose\n");
  console.log(`Webhook URL: ${WEBHOOK_URL}\n`);

  if (!STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY er ikke satt");
    console.log("   Sett denne før du kjører scriptet:");
    console.log("   STRIPE_SECRET_KEY=sk_live_xxx npx tsx scripts/diagnose-stripe-webhook.ts");
    process.exit(1);
  }

  const isLive = STRIPE_SECRET_KEY.startsWith("sk_live_");
  console.log(`Mode: ${isLive ? "LIVE" : "TEST"}\n`);

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover" as Stripe.LatestApiVersion,
  });

  // 1. Hent webhook endpoints fra Stripe
  console.log("1️⃣  Henter webhook endpoints fra Stripe...");
  const endpoints = await stripe.webhookEndpoints.list({ limit: 20 });

  const portalEndpoint = endpoints.data.find((w) =>
    w.url.includes("/api/portal/webhooks/stripe")
  );

  if (!portalEndpoint) {
    console.error("   ❌ Ingen webhook endpoint funnet for /api/portal/webhooks/stripe");
    console.log("   → Gå til https://dashboard.stripe.com/webhooks og opprett en ny");
    return;
  }

  console.log(`   ✅ Endpoint funnet: ${portalEndpoint.url}`);
  console.log(`   📋 ID: ${portalEndpoint.id}`);
  console.log(`   🌍 Status: ${portalEndpoint.status}`);
  console.log(`   📅 Opprettet: ${new Date(portalEndpoint.created * 1000).toISOString()}`);
  console.log(`   📨 Events: ${portalEndpoint.enabled_events.join(", ")}`);

  // 2. Sjekk siste delivery attempts
  console.log("\n2️⃣  Siste delivery attempts...");

  // Hent siste 10 events for dette endpointet
  const events = await stripe.events.list({
    limit: 10,
    type: "payment_intent.succeeded",
  });

  if (events.data.length === 0) {
    console.log("   ℹ️  Ingen payment_intent.succeeded events funnet");
  } else {
    for (const evt of events.data.slice(0, 5)) {
      console.log(`   • ${evt.id} — ${new Date(evt.created * 1000).toLocaleString("nb-NO")}`);
    }
  }

  // 3. Sjekk om secret stemmer
  console.log("\n3️⃣  Webhook secret-sjekk...");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("   ❌ STRIPE_WEBHOOK_SECRET er ikke satt lokalt");
  } else if (webhookSecret.startsWith("whsec_")) {
    console.log(`   ✅ Secret er konfigurert lokalt (${webhookSecret.slice(0, 12)}...)`);
    console.log(`   ⚠️  Sammenlign med secret i Stripe Dashboard:`);
    console.log(`      https://dashboard.stripe.com/webhooks/${portalEndpoint.id}`);
  }

  // 4. Send test-ping (ikke-signert)
  console.log("\n4️⃣  Tester om endpointet svarer...");
  try {
    const pingRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "test", data: {} }),
    });

    console.log(`   HTTP ${pingRes.status} ${pingRes.statusText}`);
    const body = await pingRes.json().catch(() => ({}));
    console.log(`   Svar: ${JSON.stringify(body)}`);

    if (pingRes.status === 400 && body.error?.includes("signature")) {
      console.log("   ✅ Endpointet er oppe — returnerer 400 pga manglende signatur (forventet)");
    } else if (pingRes.status === 500) {
      console.error("   ❌ Endpointet returnerer 500 — sjekk Vercel logs");
    } else if (pingRes.status === 404) {
      console.error("   ❌ Endpointet finnes ikke — sjekk deploy-status");
    }
  } catch (err) {
    console.error(`   ❌ Kan ikke nå endpointet: ${err instanceof Error ? err.message : err}`);
    console.log("   → Sjekk at appen er deployet og URL-en er korrekt");
  }

  // 5. Oppsummering
  console.log("\n📋 Oppsummering & anbefalinger:");
  console.log("   1. Gå til https://dashboard.stripe.com/webhooks");
  console.log(`   2. Finn endpoint: ${portalEndpoint.url}`);
  console.log('   3. Klikk på endpointet og sjekk "Recent deliveries"');
  console.log('   4. Hvis deliveries feiler med "signature verification", regenerer secret:');
  console.log('      → Klikk "Reveal" under "Signing secret"');
  console.log("      → Kopier verdien (whsec_...)");
  console.log("      → Oppdater STRIPE_WEBHOOK_SECRET i Vercel Dashboard");
  console.log("   5. Hvis deliveries feiler med 500, sjekk Vercel logs for feilmeldinger");
  console.log('   6. Hvis endpointet er "Disabled", klikk "Enable" i Stripe Dashboard');
}

diagnose().catch((err) => {
  console.error("\n❌ Diagnose feilet:", err);
  process.exit(1);
});
