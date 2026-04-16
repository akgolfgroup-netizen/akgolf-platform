import { NextRequest, NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { syncGoogleCalendar, getSyncStatus, getImportedEvents, disconnectGoogleCalendar } from "@/lib/portal/google-calendar/sync";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/portal/calendar/google/sync
 * 
 * Manuell synkronisering av Google Calendar
 */
export async function POST() {
  try {
    const user = await requirePortalUser();
    
    // Sjekk at bruker er instruktør eller admin
    const canManage = isStaff(user.role);
    if (!canManage) {
      return NextResponse.json(
        { error: "Mangler tilgang" },
        { status: 403 }
      );
    }

    // Finn instruktør-record for brukeren
    const supabase = createServiceClient();
    const { data: instructor } = await supabase
      .from("Instructor")
      .select("id")
      .eq("userId", user.id)
      .single();

    if (!instructor) {
      return NextResponse.json(
        { error: "Ingen instruktørprofil funnet" },
        { status: 404 }
      );
    }

    // Kjør synkronisering
    const result = await syncGoogleCalendar(instructor.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Google Calendar Sync] Error:", error);
    return NextResponse.json(
      { error: "Synkronisering feilet", message: error instanceof Error ? error.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/portal/calendar/google/sync
 * 
 * Hent synkroniseringsstatus og importerte events
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeEvents = searchParams.get("includeEvents") === "true";
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  try {
    const user = await requirePortalUser();
    
    // Sjekk at bruker er instruktør eller admin
    const canManage = isStaff(user.role);
    if (!canManage) {
      return NextResponse.json(
        { error: "Mangler tilgang" },
        { status: 403 }
      );
    }

    // Finn instruktør-record for brukeren
    const supabase = createServiceClient();
    const { data: instructor } = await supabase
      .from("Instructor")
      .select("id")
      .eq("userId", user.id)
      .single();

    if (!instructor) {
      return NextResponse.json(
        { error: "Ingen instruktørprofil funnet" },
        { status: 404 }
      );
    }

    // Hent status
    const status = await getSyncStatus(instructor.id);

    let events = null;
    if (includeEvents) {
      events = await getImportedEvents(instructor.id, {
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
        limit: 50,
      });
    }

    return NextResponse.json({
      status,
      events,
    });
  } catch (error) {
    console.error("[Google Calendar Sync] Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente status", message: error instanceof Error ? error.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/portal/calendar/google/sync
 * 
 * Koble fra Google Calendar
 */
export async function DELETE() {
  try {
    const user = await requirePortalUser();
    
    // Sjekk at bruker er instruktør eller admin
    const canManage = isStaff(user.role);
    if (!canManage) {
      return NextResponse.json(
        { error: "Mangler tilgang" },
        { status: 403 }
      );
    }

    // Finn instruktør-record for brukeren
    const supabase = createServiceClient();
    const { data: instructor } = await supabase
      .from("Instructor")
      .select("id")
      .eq("userId", user.id)
      .single();

    if (!instructor) {
      return NextResponse.json(
        { error: "Ingen instruktørprofil funnet" },
        { status: 404 }
      );
    }

    // Koble fra
    await disconnectGoogleCalendar(instructor.id);

    return NextResponse.json({
      success: true,
      message: "Google Calendar koblet fra",
    });
  } catch (error) {
    console.error("[Google Calendar Sync] Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke koble fra", message: error instanceof Error ? error.message : "Ukjent feil" },
      { status: 500 }
    );
  }
}
