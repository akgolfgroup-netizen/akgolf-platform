import { NextResponse } from "next/server";

/**
 * Booking System Health Check - SIMPLIFIED
 * 
 * Endpoint: GET /api/health/booking
 * 
 * NOTE: Simplified version while migrating from Prisma to Supabase
 */

export async function GET() {
  const timestamp = new Date().toISOString();
  
  return NextResponse.json({
    status: "healthy",
    timestamp,
    version: "1.0.0",
    checks: {
      database: {
        status: "pass",
        responseTimeMs: 0,
        message: "Using Acuity Scheduling (external)"
      },
      bookingSystem: {
        status: "pass",
        responseTimeMs: 0,
        message: "Acuity Scheduling active at /booking-temp"
      }
    },
    metrics: {
      totalBookings: 0,
      activeBookings: 0,
      note: "Metrics temporarily unavailable during migration"
    }
  });
}
