"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function SetupAdminPage() {
  const [status, setStatus] = useState<string>("Klar til å starte");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
    console.log(msg);
  };

  const createAdminUser = async () => {
    try {
      setStatus("Initialiserer...");
      setError(null);
      setLogs([]);

      addLog("Sjekker Supabase config...");
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Mangler Supabase URL eller API nøkkel");
      }

      addLog("Kobler til Supabase...");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Test tilkobling
      addLog("Tester tilkobling...");
      const { error: pingError } = await supabase.from("User").select("count").limit(1);
      if (pingError) {
        addLog("Tilkoblingsfeil: " + pingError.message);
      }

      // Sjekk om bruker allerede finnes i databasen
      addLog("Sjekker om bruker finnes...");
      const { data: existingUser, error: userError } = await supabase
        .from("User")
        .select("id, email")
        .eq("email", "anders@akgolf.no")
        .maybeSingle();

      if (userError) {
        addLog("User query error: " + userError.message);
      }

      if (existingUser) {
        addLog("Bruker finnes allerede i databasen!");
        setSuccess(true);
        setStatus("Bruker finnes allerede");
        return;
      }

      // Opprett bruker i Supabase Auth
      addLog("Oppretter bruker i Auth...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: "anders@akgolf.no",
        password: "anders",
        options: {
          data: {
            name: "Anders Kristiansen",
            role: "ADMIN",
          },
        },
      });

      if (authError) {
        addLog("Auth error: " + authError.message);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("Kunne ikke opprette bruker - ingen user data");
      }

      addLog("Auth bruker opprettet: " + authData.user.id);
      const userId = authData.user.id;

      // Vent litt for å la triggeren opprette User raden
      addLog("Venter på database trigger...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Sjekk om User raden ble opprettet
      addLog("Sjekker User rad...");
      const { data: newUser, error: checkError } = await supabase
        .from("User")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (checkError) {
        addLog("Check error: " + checkError.message);
      }

      if (!newUser) {
        addLog("User rad ikke funnet, oppretter manuelt...");
        const { error: insertUserError } = await supabase
          .from("User")
          .insert({
            id: userId,
            email: "anders@akgolf.no",
            name: "Anders Kristiansen",
            role: "ADMIN",
            isActive: true,
          });
        
        if (insertUserError) {
          addLog("Insert User error: " + insertUserError.message);
        }
      }

      // Opprett Instructor
      addLog("Oppretter instruktør...");
      const { error: instructorError } = await supabase
        .from("Instructor")
        .upsert({
          id: "instr_anders",
          userId: userId,
          title: "Head Coach",
          isActive: true,
        });

      if (instructorError) {
        addLog("Instructor error: " + instructorError.message);
      } else {
        addLog("Instruktør opprettet!");
      }

      // Koble til ServiceTypes
      addLog("Henter tjenester...");
      const { data: serviceTypes, error: stError } = await supabase
        .from("ServiceType")
        .select("id");

      if (stError) {
        addLog("ServiceType error: " + stError.message);
      }

      if (serviceTypes && serviceTypes.length > 0) {
        addLog(`Kobler til ${serviceTypes.length} tjenester...`);
        const instructorServiceTypes = serviceTypes.map((st) => ({
          A: "instr_anders",
          B: st.id,
        }));

        const { error: linkError } = await supabase
          .from("_InstructorToServiceType")
          .upsert(instructorServiceTypes, { onConflict: "A,B" });

        if (linkError) {
          addLog("Link error: " + linkError.message);
        }
      }

      setSuccess(true);
      setStatus("✅ Admin-bruker opprettet!");
      addLog("Ferdig!");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addLog("FEIL: " + errorMsg);
      setError(errorMsg);
      setStatus("Feil ved oppretting");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-lg border border-[#154212]/5">
        <h1 className="text-3xl font-bold text-[#154212] mb-4">Setup Admin</h1>
        
        {!success && !error && status === "Klar til å starte" && (
          <button
            onClick={createAdminUser}
            className="w-full bg-[#d2f000] text-[#154212] py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:scale-[1.02] transition-transform"
          >
            Opprett admin-bruker
          </button>
        )}

        {(status !== "Klar til å starte" || error || success) && (
          <>
            {error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4">
                <p className="font-medium">Feil:</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-4">
                <p className="font-medium">{status}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#154212]"></div>
                <p className="text-[#42493e]">{status}</p>
              </div>
            )}

            {/* Logs */}
            <div className="mt-4 bg-gray-50 p-3 rounded-xl text-xs font-mono text-gray-600 max-h-40 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="py-0.5">{log}</div>
              ))}
            </div>
          </>
        )}

        {success && (
          <div className="mt-6 space-y-3">
            <div className="bg-white border border-[#154212]/10 p-4 rounded-xl text-sm">
              <p><strong>E-post:</strong> anders@akgolf.no</p>
              <p><strong>Passord:</strong> anders</p>
            </div>
            <a
              href="/portal/login"
              className="block w-full bg-[#154212] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm text-center hover:opacity-90"
            >
              Gå til login
            </a>
          </div>
        )}

        {error && (
          <button
            onClick={createAdminUser}
            className="w-full mt-4 bg-[#d2f000] text-[#154212] py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:scale-[1.02] transition-transform"
          >
            Prøv igjen
          </button>
        )}
      </div>
    </div>
  );
}
