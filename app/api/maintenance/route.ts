/**
 * Maintenance Status API
 * 
 * Returns current maintenance mode status.
 * Can be used by clients to check if maintenance mode is active.
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const expectedDuration = process.env.MAINTENANCE_EXPECTED_DURATION || null;
  const message = process.env.MAINTENANCE_MESSAGE || null;

  // Check for bypass
  const bypassKey = process.env.MAINTENANCE_BYPASS_KEY;
  const providedBypass = request.nextUrl.searchParams.get("bypass");
  const hasValidBypass = bypassKey && providedBypass === bypassKey;

  return NextResponse.json({
    maintenanceMode,
    bypassActive: hasValidBypass,
    expectedDuration,
    message,
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      // Prevent caching of maintenance status
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}

/**
 * POST endpoint for admin to toggle maintenance mode
 * Requires admin authentication
 */
export async function POST() {
  // Note: In production, this should be protected by admin authentication
  // For now, we just return a message that manual .env update is required
  
  return NextResponse.json({
    success: false,
    message: "Maintenance mode must be toggled via environment variables. Set MAINTENANCE_MODE=true in your .env file and redeploy.",
    instructions: [
      "1. Set MAINTENANCE_MODE=true in .env",
      "2. Optionally set MAINTENANCE_BYPASS_KEY for admin access",
      "3. Optionally set MAINTENANCE_EXPECTED_DURATION for ETA",
      "4. Optionally set MAINTENANCE_MESSAGE for custom message",
      "5. Redeploy the application",
    ],
  }, { status: 403 });
}
