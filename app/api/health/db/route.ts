import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Database Health Check
 * 
 * Detaljert sjekk av database-tilkobling og tabeller.
 * Brukes for å verifisere at databasen fungerer før deploy.
 * 
 * Endpoint: GET /api/health/db
 */

interface DBHealthCheck {
  status: "healthy" | "unhealthy";
  timestamp: string;
  database: {
    connected: boolean;
    responseTimeMs: number;
    tables: Record<string, TableStatus>;
    connectionInfo?: {
      url?: string;
      hasServiceRole: boolean;
    };
  };
}

interface TableStatus {
  exists: boolean;
  rowCount?: number;
  error?: string;
}

const CRITICAL_TABLES = [
  "profiles",
  "bookings",
  "coaching_packages",
  "subscription_tiers",
  "training_plans",
];

export async function GET() {
  const timestamp = new Date().toISOString();
  const tableStatuses: Record<string, TableStatus> = {};
  
  const startTime = Date.now();
  let connected = false;
  let connectionError: string | null = null;

  try {
    const supabase = createServiceClient();
    
    // Test basic connectivity
    const { error: pingError } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .limit(1);

    if (pingError) {
      connectionError = pingError.message;
    } else {
      connected = true;
    }

    // Sjekk hver kritisk tabell
    for (const table of CRITICAL_TABLES) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });

        if (error) {
          tableStatuses[table] = {
            exists: false,
            error: error.message,
          };
        } else {
          tableStatuses[table] = {
            exists: true,
            rowCount: count || 0,
          };
        }
      } catch (e) {
        tableStatuses[table] = {
          exists: false,
          error: e instanceof Error ? e.message : "Unknown error",
        };
      }
    }
  } catch (error) {
    connectionError = error instanceof Error ? error.message : "Unknown error";
  }

  const responseTimeMs = Date.now() - startTime;

  // Sjekk om alle kritiske tabeller finnes
  const allTablesExist = CRITICAL_TABLES.every(t => tableStatuses[t]?.exists);
  
  const health: DBHealthCheck = {
    status: connected && allTablesExist ? "healthy" : "unhealthy",
    timestamp,
    database: {
      connected,
      responseTimeMs,
      tables: tableStatuses,
      connectionInfo: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    },
  };

  // Legg til feilmelding hvis tilkobling feilet
  if (connectionError) {
    health.database.connectionInfo = {
      ...health.database.connectionInfo,
      error: connectionError,
    } as DBHealthCheck["database"]["connectionInfo"];
  }

  const statusCode = health.status === "healthy" ? 200 : 503;

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
