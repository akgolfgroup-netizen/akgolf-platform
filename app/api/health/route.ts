import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Health Check Endpoint
 * 
 * Sjekker status for alle kritiske systemer:
 * - Database (Supabase)
 * - Stripe (via miljøvariabel-verifisering)
 * - Redis (Upstash)
 * 
 * Endpoint: GET /api/health
 */

interface HealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
  checks: {
    database: HealthStatus;
    stripe: HealthStatus;
    redis: HealthStatus;
  };
}

interface HealthStatus {
  status: "pass" | "fail" | "warn";
  responseTimeMs: number;
  message?: string;
}

const VERSION = "1.0.0";
const START_TIME = Date.now();

export async function GET() {
  const timestamp = new Date().toISOString();
  const checks: HealthCheck["checks"] = {
    database: { status: "fail", responseTimeMs: 0 },
    stripe: { status: "fail", responseTimeMs: 0 },
    redis: { status: "fail", responseTimeMs: 0 },
  };

  // Sjekk database (Supabase)
  const dbStart = Date.now();
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true })
      .limit(1);

    if (error) {
      checks.database = {
        status: "fail",
        responseTimeMs: Date.now() - dbStart,
        message: `Database error: ${error.message}`,
      };
    } else {
      checks.database = {
        status: "pass",
        responseTimeMs: Date.now() - dbStart,
        message: "Connected to Supabase",
      };
    }
  } catch (error) {
    checks.database = {
      status: "fail",
      responseTimeMs: Date.now() - dbStart,
      message: `Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  // Sjekk Stripe (verifiser at API-nøkkel er satt)
  const stripeStart = Date.now();
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      checks.stripe = {
        status: "fail",
        responseTimeMs: Date.now() - stripeStart,
        message: "STRIPE_SECRET_KEY not configured",
      };
    } else if (stripeKey.startsWith("sk_test_") && process.env.NODE_ENV === "production") {
      checks.stripe = {
        status: "warn",
        responseTimeMs: Date.now() - stripeStart,
        message: "Using test keys in production environment",
      };
    } else {
      checks.stripe = {
        status: "pass",
        responseTimeMs: Date.now() - stripeStart,
        message: stripeKey.startsWith("sk_live_") ? "Live mode" : "Test mode",
      };
    }
  } catch (error) {
    checks.stripe = {
      status: "fail",
      responseTimeMs: Date.now() - stripeStart,
      message: `Stripe check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  // Sjekk Redis (Upstash)
  const redisStart = Date.now();
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!redisUrl || !redisToken) {
      checks.redis = {
        status: "warn",
        responseTimeMs: Date.now() - redisStart,
        message: "Redis not configured (optional)",
      };
    } else {
      // Prøv å gjøre en enkel ping til Redis
      const response = await fetch(`${redisUrl}/ping`, {
        headers: {
          Authorization: `Bearer ${redisToken}`,
        },
      });
      
      if (response.ok) {
        checks.redis = {
          status: "pass",
          responseTimeMs: Date.now() - redisStart,
          message: "Connected to Upstash Redis",
        };
      } else {
        checks.redis = {
          status: "fail",
          responseTimeMs: Date.now() - redisStart,
          message: `Redis ping failed: ${response.status}`,
        };
      }
    }
  } catch (error) {
    checks.redis = {
      status: "warn",
      responseTimeMs: Date.now() - redisStart,
      message: `Redis check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  // Beregn total status
  const failedChecks = Object.values(checks).filter(c => c.status === "fail").length;
  const warningChecks = Object.values(checks).filter(c => c.status === "warn").length;
  
  let overallStatus: HealthCheck["status"] = "healthy";
  if (failedChecks > 0) {
    overallStatus = "unhealthy";
  } else if (warningChecks > 0) {
    overallStatus = "degraded";
  }

  const health: HealthCheck = {
    status: overallStatus,
    timestamp,
    version: VERSION,
    uptime: Math.floor((Date.now() - START_TIME) / 1000),
    environment: process.env.NODE_ENV || "unknown",
    checks,
  };

  // Returner 503 hvis unhealthy, ellers 200
  const statusCode = overallStatus === "unhealthy" ? 503 : 200;
  
  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
    },
  });
}
