/**
 * Booking System Health Check
 * 
 * Endpoint: GET /api/health/booking
 * 
 * Sjekker:
 * 1. Database-tilkobling
 * 2. Redis/cache (hvis konfigurert)
 * 3. Google Calendar API (hvis syncet)
 * 4. Ingen dobbeltbookings i systemet
 * 5. BookingLock-tabell status
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import { detectExistingDoubleBookings, getBookingStats } from "@/lib/portal/booking/conflict-check";

// -----------------------------------------------------------------------------
// Typer
// -----------------------------------------------------------------------------

interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  checks: {
    database: HealthStatus;
    cache?: HealthStatus;
    googleCalendar?: HealthStatus;
    doubleBookings: HealthStatus;
    locks: HealthStatus;
  };
  metrics?: {
    totalBookings: number;
    activeBookings: number;
    pendingLocks: number;
    doubleBookingsDetected: number;
    averageBookingDuration?: number;
  };
}

interface HealthStatus {
  status: "pass" | "fail" | "warn" | "skip";
  responseTimeMs: number;
  message?: string;
  details?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Konfigurasjon
// -----------------------------------------------------------------------------

const HEALTH_CHECK_VERSION = "1.0.0";
const DB_TIMEOUT_MS = 5000;

// -----------------------------------------------------------------------------
// Health Check Functions
// -----------------------------------------------------------------------------

/**
 * Sjekker database-tilkobling
 */
async function checkDatabase(): Promise<HealthStatus> {
  const start = Date.now();
  
  try {
    // Timeout wrapper
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Database timeout")), DB_TIMEOUT_MS);
    });

    // Faktisk database-sjekk
    const dbCheck = prisma.$queryRaw`SELECT 1 as connected`;
    
    await Promise.race([dbCheck, timeoutPromise]);

    // Sjekk at Booking-tabellen er tilgjengelig
    const bookingCount = await prisma.booking.count({
      take: 1, // Kun for å verifisere tilgang
    });

    return {
      status: "pass",
      responseTimeMs: Date.now() - start,
      details: { bookingTableAccessible: true },
    };

  } catch (error) {
    logger.error("[health/booking] Database check failed:", error);
    
    return {
      status: "fail",
      responseTimeMs: Date.now() - start,
      message: error instanceof Error ? error.message : "Database error",
    };
  }
}

/**
 * Sjekker for dobbeltbookings i systemet
 */
async function checkDoubleBookings(): Promise<HealthStatus> {
  const start = Date.now();
  
  try {
    const doubleBookings = await detectExistingDoubleBookings();

    if (doubleBookings.length === 0) {
      return {
        status: "pass",
        responseTimeMs: Date.now() - start,
        message: "Ingen dobbeltbookings funnet",
      };
    }

    // Logg alvorligheten
    logger.error("[health/booking] Double bookings detected!", {
      count: doubleBookings.length,
      conflicts: doubleBookings.slice(0, 5), // Logg maks 5
    });

    return {
      status: "fail",
      responseTimeMs: Date.now() - start,
      message: `${doubleBookings.length} dobbeltbooking(s) oppdaget!`,
      details: {
        conflicts: doubleBookings.slice(0, 10),
        severity: doubleBookings.length > 5 ? "critical" : "warning",
      },
    };

  } catch (error) {
    logger.error("[health/booking] Double booking check failed:", error);
    
    return {
      status: "fail",
      responseTimeMs: Date.now() - start,
      message: "Kunne ikke sjekke for dobbeltbookings",
    };
  }
}

/**
 * Sjekker BookingLock-tabell status
 */
async function checkLocks(): Promise<HealthStatus> {
  const start = Date.now();
  
  try {
    // Tell aktive låser
    const activeLocksResult = await prisma.$queryRaw<
      Array<{ count: number }>
    >`
      SELECT COUNT(*) as count FROM "BookingLock" 
      WHERE "expiresAt" > ${new Date()}
    `;
    
    const activeLocks = Number(activeLocksResult[0]?.count || 0);

    // Tell utløpte låser (bør være 0 eller lavt tall)
    const expiredLocksResult = await prisma.$queryRaw<
      Array<{ count: number }>
    >`
      SELECT COUNT(*) as count FROM "BookingLock" 
      WHERE "expiresAt" <= ${new Date()}
    `;
    
    const expiredLocks = Number(expiredLocksResult[0]?.count || 0);

    // Sjekk om det er mistenkelig mange låser
    const status: HealthStatus["status"] = 
      activeLocks > 100 ? "warn" : 
      expiredLocks > 50 ? "warn" : 
      "pass";

    return {
      status,
      responseTimeMs: Date.now() - start,
      message: `${activeLocks} aktive låser, ${expiredLocks} utløpte låser`,
      details: { activeLocks, expiredLocks },
    };

  } catch (error) {
    logger.error("[health/booking] Lock check failed:", error);
    
    return {
      status: "fail",
      responseTimeMs: Date.now() - start,
      message: "Kunne ikke sjekke lås-status",
    };
  }
}

/**
 * Sjekker Google Calendar sync (hvis konfigurert)
 */
async function checkGoogleCalendar(): Promise<HealthStatus> {
  const start = Date.now();
  
  // Sjekk om Google Calendar er konfigurert
  const hasGoogleConfig = !!process.env.GOOGLE_CLIENT_ID;
  
  if (!hasGoogleConfig) {
    return {
      status: "skip",
      responseTimeMs: Date.now() - start,
      message: "Google Calendar ikke konfigurert",
    };
  }

  try {
    // Sjekk om det finnes aktive Google Calendar syncs
    const syncCount = await prisma.googleCalendarSync.count({
      where: { syncEnabled: true },
    });

    // Sjekk for nylige feil
    const recentErrors = await prisma.googleCalendarSync.count({
      where: {
        syncEnabled: true,
        lastErrorAt: {
          gt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Siste 24 timer
        },
      },
    });

    const status: HealthStatus["status"] = 
      recentErrors > 0 ? "warn" : 
      "pass";

    return {
      status,
      responseTimeMs: Date.now() - start,
      message: `${syncCount} aktive syncs, ${recentErrors} feil siste 24t`,
      details: { activeSyncs: syncCount, recentErrors },
    };

  } catch (error) {
    logger.error("[health/booking] Google Calendar check failed:", error);
    
    return {
      status: "warn",
      responseTimeMs: Date.now() - start,
      message: "Kunne ikke sjekke Google Calendar status",
    };
  }
}

/**
 * Sjekker cache (Redis/Upstash) hvis konfigurert
 */
async function checkCache(): Promise<HealthStatus> {
  const start = Date.now();
  
  // Sjekk om Redis er konfigurert
  const hasRedis = !!process.env.REDIS_URL || !!process.env.UPSTASH_REDIS_REST_URL;
  
  if (!hasRedis) {
    return {
      status: "skip",
      responseTimeMs: Date.now() - start,
      message: "Cache ikke konfigurert",
    };
  }

  try {
    // Her ville vi sjekket faktisk Redis-tilkobling
    // Forenklet for nå
    return {
      status: "pass",
      responseTimeMs: Date.now() - start,
      message: "Cache konfigurert",
    };

  } catch (error) {
    return {
      status: "warn",
      responseTimeMs: Date.now() - start,
      message: "Cache utilgjengelig",
    };
  }
}

// -----------------------------------------------------------------------------
// API Handler
// -----------------------------------------------------------------------------

export async function GET(): Promise<NextResponse> {
  const overallStart = Date.now();

  try {
    // Kjør alle sjekker parallelt
    const [
      databaseStatus,
      doubleBookingStatus,
      lockStatus,
      googleCalendarStatus,
      cacheStatus,
    ] = await Promise.all([
      checkDatabase(),
      checkDoubleBookings(),
      checkLocks(),
      checkGoogleCalendar(),
      checkCache(),
    ]);

    // Hent metrics
    const metrics = await getBookingStats();

    // Beregn overall status
    const allStatuses = [
      databaseStatus.status,
      doubleBookingStatus.status,
      lockStatus.status,
    ];

    // Google Calendar og Cache er optional
    if (googleCalendarStatus.status !== "skip") {
      allStatuses.push(googleCalendarStatus.status);
    }
    if (cacheStatus.status !== "skip") {
      allStatuses.push(cacheStatus.status);
    }

    const overallStatus: HealthCheckResult["status"] = 
      allStatuses.includes("fail") ? "unhealthy" :
      allStatuses.includes("warn") ? "degraded" :
      "healthy";

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: HEALTH_CHECK_VERSION,
      checks: {
        database: databaseStatus,
        doubleBookings: doubleBookingStatus,
        locks: lockStatus,
        googleCalendar: googleCalendarStatus,
        cache: cacheStatus,
      },
      metrics: {
        totalBookings: metrics.totalBookings,
        activeBookings: metrics.activeBookings,
        pendingLocks: metrics.pendingLocks,
        doubleBookingsDetected: metrics.doubleBookingsDetected,
      },
    };

    // Logg hvis unhealthy
    if (overallStatus !== "healthy") {
      logger.warn("[health/booking] System health check failed", {
        status: overallStatus,
        failedChecks: allStatuses.filter(s => s === "fail" || s === "warn"),
      });
    }

    // HTTP status code basert på helse
    const statusCode = 
      overallStatus === "healthy" ? 200 :
      overallStatus === "degraded" ? 200 : // Degradert er fortsatt OK-ish
      503; // Unhealthy = Service Unavailable

    return NextResponse.json(result, { 
      status: statusCode,
      headers: {
        "Cache-Control": "no-store",
        "X-Response-Time": `${Date.now() - overallStart}ms`,
      },
    });

  } catch (error) {
    logger.error("[health/booking] Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        version: HEALTH_CHECK_VERSION,
        checks: {},
        error: "Health check failed",
      },
      { 
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}

// -----------------------------------------------------------------------------
// Additional Endpoints
// -----------------------------------------------------------------------------

/**
 * POST /api/health/booking
 * 
 * Admin-funksjon for å:
 * - Rydde opp utløpte låser
 * - Generere rapport om dobbeltbookings
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { action } = await request.json();

    switch (action) {
      case "cleanup-locks": {
        const deleted = await prisma.$executeRaw`
          DELETE FROM "BookingLock" 
          WHERE "expiresAt" < ${new Date()}
        `;
        
        return NextResponse.json({
          success: true,
          action: "cleanup-locks",
          deletedCount: deleted,
        });
      }

      case "check-conflicts": {
        const conflicts = await detectExistingDoubleBookings();
        
        return NextResponse.json({
          success: true,
          action: "check-conflicts",
          conflictsFound: conflicts.length,
          conflicts: conflicts.slice(0, 20), // Maks 20 i respons
        });
      }

      default:
        return NextResponse.json(
          { error: "Ukjent action" },
          { status: 400 }
        );
    }

  } catch (error) {
    logger.error("[health/booking] Admin action failed:", error);
    
    return NextResponse.json(
      { error: "Action failed" },
      { status: 500 }
    );
  }
}
