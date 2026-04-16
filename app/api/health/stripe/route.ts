import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Stripe Health Check
 * 
 * Verifiserer at Stripe-integrasjonen er riktig konfigurert
 * og at vi kan kommunisere med Stripe API.
 * 
 * Endpoint: GET /api/health/stripe
 */

interface StripeHealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  stripe: {
    configured: boolean;
    mode: "live" | "test" | "unknown";
    apiVersion: string;
    responseTimeMs: number;
    products?: number;
    error?: string;
    warnings?: string[];
  };
}

export async function GET() {
  const timestamp = new Date().toISOString();
  const startTime = Date.now();
  const warnings: string[] = [];

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  // Sjekk om Stripe-nøkkel er konfigurert
  if (!stripeKey) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp,
        stripe: {
          configured: false,
          mode: "unknown",
          apiVersion: "unknown",
          responseTimeMs: 0,
          error: "STRIPE_SECRET_KEY is not configured",
        },
      },
      { status: 503 }
    );
  }

  const isLiveKey = stripeKey.startsWith("sk_live_");
  const isTestKey = stripeKey.startsWith("sk_test_");

  // Advarsel hvis vi bruker test keys i produksjon
  if (isTestKey && process.env.NODE_ENV === "production") {
    warnings.push("Using Stripe test keys in production environment");
  }

  try {
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-02-24.acacia",
    });

    // Test API-tilkobling ved å hente produkter
    const products = await stripe.products.list({ limit: 1 });
    const responseTimeMs = Date.now() - startTime;

    // Sjekk webhooks
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      warnings.push("STRIPE_WEBHOOK_SECRET is not configured");
    }

    // Sjekk publishable key
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      warnings.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured");
    } else if (isLiveKey && publishableKey.startsWith("pk_test_")) {
      warnings.push("Mismatch: Live secret key with test publishable key");
    } else if (isTestKey && publishableKey.startsWith("pk_live_")) {
      warnings.push("Mismatch: Test secret key with live publishable key");
    }

    const health: StripeHealthCheck = {
      status: warnings.length > 0 ? "degraded" : "healthy",
      timestamp,
      stripe: {
        configured: true,
        mode: isLiveKey ? "live" : "test",
        apiVersion: stripe.getApiField("version") || "2025-02-24.acacia",
        responseTimeMs,
        products: products.data.length,
        warnings: warnings.length > 0 ? warnings : undefined,
      },
    };

    return NextResponse.json(health, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    const responseTimeMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp,
        stripe: {
          configured: true,
          mode: isLiveKey ? "live" : isTestKey ? "test" : "unknown",
          apiVersion: "unknown",
          responseTimeMs,
          error: error instanceof Error ? error.message : "Unknown Stripe error",
        },
      },
      { 
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
