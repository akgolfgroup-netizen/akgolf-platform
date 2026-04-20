export interface Screen {
  route: string;
  heritageRef: string;
  label: string;
  sprint: string;
  group?: string;
  auth: "none" | "portal" | "admin";
  status: "done" | "tokens" | "layout" | "todo";
}

export const screens: Screen[] = [
  // ─── Sprint A — Spillerportal kjerne (DONE ✅) ───
  { route: "/portal", heritageRef: "dashboard_mission_control", label: "Dashboard", sprint: "A", auth: "portal", status: "done" },
  { route: "/portal/statistikk", heritageRef: "analytics_strokes_gained", label: "Statistikk", sprint: "A", auth: "portal", status: "done" },
  { route: "/portal/kartlegging", heritageRef: "coach_player_view", label: "Kartlegging", sprint: "A", auth: "portal", status: "done" },
  { route: "/portal/dagbok", heritageRef: "log_practice_diary", label: "Dagbok", sprint: "A", auth: "portal", status: "done" },
  { route: "/portal/runde/ny", heritageRef: "log_practice_diary", label: "Ny runde", sprint: "A", auth: "portal", status: "done" },
  { route: "/portal/runde/demo", heritageRef: "coach_live_session", label: "Live runde", sprint: "A", auth: "portal", status: "done" },
  { route: "/portal/treningsplan", heritageRef: "iup_12_week_training_plan", label: "Treningsplan", sprint: "A", auth: "portal", status: "done" },
  { route: "/portal/min-plan", heritageRef: "iup_12_week_training_plan", label: "Min plan", sprint: "A", auth: "portal", status: "done" },
  { route: "/portal/bookinger", heritageRef: "sessions_calendar_view", label: "Bookinger", sprint: "A", auth: "portal", status: "done" },
  { route: "/portal/profil", heritageRef: "settings_profile", label: "Profil", sprint: "A", auth: "portal", status: "done" },

  // ─── Sprint B — Mission Control kjerne (DONE ✅) ───
  { route: "/admin", heritageRef: "mission_control_command_center", label: "Hub-oversikt", sprint: "B", auth: "admin", status: "done" },
  { route: "/admin/mission-board", heritageRef: "dashboard_mission_control", label: "Mission Board", sprint: "B", auth: "admin", status: "done" },
  { route: "/admin/coaching-board", heritageRef: "coach_my_day", label: "Coaching Board", sprint: "B", auth: "admin", status: "done" },
  { route: "/admin/elever", heritageRef: "admin_player_management", label: "Elever", sprint: "B", auth: "admin", status: "done" },
  { route: "/admin/elever/demo", heritageRef: "admin_player_profile", label: "Elev-detalj", sprint: "B", auth: "admin", status: "done" },
  { route: "/admin/team", heritageRef: "team_setup", label: "Team + tilgang", sprint: "B", auth: "admin", status: "done" },
  { route: "/admin/bookinger", heritageRef: "booking_review_confirm", label: "Bookinger (admin)", sprint: "B", auth: "admin", status: "done" },

  // ─── Sprint C — Booking-system (DONE ✅) ───
  { route: "/booking", heritageRef: "booking_select_service", label: "Velg tjeneste", sprint: "C", auth: "none", status: "done" },
  { route: "/booking/[id]/confirmation", heritageRef: "booking_confirmed", label: "Bekreftelse", sprint: "C", auth: "none", status: "done" },
  { route: "/booking/[id]/cancel", heritageRef: "booking_confirmed", label: "Avlys", sprint: "C", auth: "none", status: "done" },
  { route: "/booking/[id]/pay", heritageRef: "booking_review_confirm", label: "Betaling", sprint: "C", auth: "none", status: "done" },
  { route: "/booking/[id]/status", heritageRef: "booking_review_confirm", label: "Status", sprint: "C", auth: "none", status: "done" },
  { route: "/portal/bookinger", heritageRef: "sessions_calendar_view", label: "Bookinger (portal)", sprint: "C", auth: "portal", status: "done" },
  { route: "/portal/bookinger/[id]/endre", heritageRef: "reschedule_booking", label: "Endre booking", sprint: "C", auth: "portal", status: "done" },

  // ─── Sprint D — Landingpages ───
  { route: "/academy", heritageRef: "landing_pricing", label: "Academy", sprint: "D", auth: "none", status: "tokens" },
  { route: "/academy/abonnement", heritageRef: "landing_pricing", label: "Academy abonnement", sprint: "D", auth: "none", status: "tokens" },
  { route: "/junior-academy", heritageRef: "landing_contact", label: "Junior Academy", sprint: "D", auth: "none", status: "tokens" },
  { route: "/landing/pricing", heritageRef: "landing_pricing", label: "Landing pricing", sprint: "D", auth: "none", status: "tokens" },
  { route: "/landing/contact", heritageRef: "landing_contact", label: "Landing contact", sprint: "D", auth: "none", status: "tokens" },
  { route: "/utvikling", heritageRef: "", label: "Utvikling", sprint: "D", auth: "none", status: "tokens" },
  { route: "/personvern", heritageRef: "legal_pages", label: "Personvern", sprint: "D", auth: "none", status: "tokens" },

  // ─── Sprint E — Sekundær portal ───
  // E1 — Kalender & Kommunikasjon
  { route: "/portal/kalender", heritageRef: "sessions_calendar_view", label: "Kalender", sprint: "E", group: "E1", auth: "portal", status: "tokens" },
  { route: "/portal/meldinger", heritageRef: "coach_messages", label: "Meldinger", sprint: "E", group: "E1", auth: "portal", status: "tokens" },
  { route: "/portal/meldinger/demo", heritageRef: "inbox_main", label: "Melding thread", sprint: "E", group: "E1", auth: "portal", status: "tokens" },
  // E2 — Sosialt & Spill
  { route: "/portal/sosialt", heritageRef: "social_feed_community", label: "Sosialt feed", sprint: "E", group: "E2", auth: "portal", status: "tokens" },
  { route: "/portal/sosialt/venner", heritageRef: "friend_list", label: "Venner", sprint: "E", group: "E2", auth: "portal", status: "tokens" },
  { route: "/portal/spill", heritageRef: "challenges_quests", label: "Spill", sprint: "E", group: "E2", auth: "portal", status: "tokens" },
  // E3 — Analyse & AI
  { route: "/portal/analyse", heritageRef: "analytics_ai_recap", label: "Analyse", sprint: "E", group: "E3", auth: "portal", status: "tokens" },
  { route: "/portal/ai-coach", heritageRef: "", label: "AI-coach", sprint: "E", group: "E3", auth: "portal", status: "tokens" },
  { route: "/portal/benchmark", heritageRef: "analytics_leaderboard", label: "Benchmark", sprint: "E", group: "E3", auth: "portal", status: "tokens" },
  { route: "/portal/sammenligning", heritageRef: "head_to_head_versus", label: "Sammenligning", sprint: "E", group: "E3", auth: "portal", status: "tokens" },
  { route: "/portal/strategi", heritageRef: "coach_prepare_session", label: "Strategi", sprint: "E", group: "E3", auth: "portal", status: "tokens" },
  // E4 — Utstyr & Tester
  { route: "/portal/bag", heritageRef: "settings_profile", label: "Bag", sprint: "E", group: "E4", auth: "portal", status: "tokens" },
  { route: "/portal/trackman", heritageRef: "analytics_strokes_gained", label: "TrackMan", sprint: "E", group: "E4", auth: "portal", status: "tokens" },
  { route: "/portal/tester", heritageRef: "coach_drills_library", label: "Tester", sprint: "E", group: "E4", auth: "portal", status: "tokens" },
  { route: "/portal/mental", heritageRef: "coach_observations", label: "Mental", sprint: "E", group: "E4", auth: "portal", status: "tokens" },
  // E5 — Administrasjon
  { route: "/portal/abonnement", heritageRef: "settings_billing", label: "Abonnement", sprint: "E", group: "E5", auth: "portal", status: "tokens" },
  { route: "/portal/apper", heritageRef: "integration_directory", label: "Apper", sprint: "E", group: "E5", auth: "portal", status: "tokens" },
  { route: "/portal/onboarding", heritageRef: "onboarding_wizard", label: "Onboarding", sprint: "E", group: "E5", auth: "portal", status: "tokens" },
  { route: "/portal/profil/innstillinger", heritageRef: "settings_user_preferences", label: "Profil innstillinger", sprint: "E", group: "E5", auth: "portal", status: "tokens" },
  { route: "/portal/coaching-historikk", heritageRef: "coach_session_review", label: "Coaching-historikk", sprint: "E", group: "E5", auth: "portal", status: "tokens" },
  { route: "/portal/turneringer", heritageRef: "tournaments_competitions", label: "Turneringer", sprint: "E", group: "E5", auth: "portal", status: "tokens" },

  // ─── Sprint F — Sekundær MC ───
  // F1 — Operasjon
  { route: "/admin/kalender", heritageRef: "sessions_calendar_view", label: "Kalender (admin)", sprint: "F", group: "F1", auth: "admin", status: "tokens" },
  { route: "/admin/godkjenninger", heritageRef: "booking_review_confirm", label: "Godkjenninger", sprint: "F", group: "F1", auth: "admin", status: "tokens" },
  { route: "/admin/tilgjengelighet", heritageRef: "coach_set_hours", label: "Tilgjengelighet", sprint: "F", group: "F1", auth: "admin", status: "tokens" },
  { route: "/admin/kapasitet", heritageRef: "mission_control_capacity_forecast", label: "Kapasitet", sprint: "F", group: "F1", auth: "admin", status: "tokens" },
  { route: "/admin/focus", heritageRef: "coach_my_day", label: "Focus", sprint: "F", group: "F1", auth: "admin", status: "tokens" },
  { route: "/admin/denne-uken", heritageRef: "coach_my_day", label: "Denne uken", sprint: "F", group: "F1", auth: "admin", status: "tokens" },
  { route: "/admin/okter", heritageRef: "coach_session_review", label: "Økter (admin)", sprint: "F", group: "F1", auth: "admin", status: "tokens" },
  { route: "/admin/treningsplan", heritageRef: "iup_12_week_training_plan", label: "Treningsplan (admin)", sprint: "F", group: "F1", auth: "admin", status: "tokens" },
  { route: "/admin/turneringer", heritageRef: "tournaments_competitions", label: "Turneringer (admin)", sprint: "F", group: "F1", auth: "admin", status: "tokens" },
  { route: "/admin/fasiliteter", heritageRef: "admin_player_management", label: "Fasiliteter", sprint: "F", group: "F1", auth: "admin", status: "tokens" },
  // F2 — Kommunikasjon
  { route: "/admin/meldinger", heritageRef: "inbox_main", label: "Meldinger (admin)", sprint: "F", group: "F2", auth: "admin", status: "tokens" },
  { route: "/admin/e-postmaler", heritageRef: "email_templates", label: "E-postmaler", sprint: "F", group: "F2", auth: "admin", status: "tokens" },
  { route: "/admin/notifications", heritageRef: "push_notifications", label: "Push-varsler", sprint: "F", group: "F2", auth: "admin", status: "tokens" },
  // F3 — AI + Analyse
  { route: "/admin/ai-assistent", heritageRef: "automated_responses", label: "AI-assistent", sprint: "F", group: "F3", auth: "admin", status: "tokens" },
  { route: "/admin/agenter", heritageRef: "developer_console", label: "Agenter", sprint: "F", group: "F3", auth: "admin", status: "tokens" },
  { route: "/admin/analytics", heritageRef: "analytics_live_dashboard", label: "Analytics", sprint: "F", group: "F3", auth: "admin", status: "tokens" },
  { route: "/admin/okonomi", heritageRef: "analytics_financials", label: "Økonomi", sprint: "F", group: "F3", auth: "admin", status: "tokens" },
  { route: "/admin/rapporter", heritageRef: "analytics_generated_report", label: "Rapporter", sprint: "F", group: "F3", auth: "admin", status: "tokens" },

  // ─── Sprint G — Auth + Error ───
  { route: "/auth/login", heritageRef: "auth_sign_in_updated", label: "Login", sprint: "G", auth: "none", status: "tokens" },
  { route: "/auth/signup", heritageRef: "auth_register_step_1", label: "Registrering", sprint: "G", auth: "none", status: "tokens" },
  { route: "/auth/forgot-password", heritageRef: "auth_forgot_password_updated", label: "Glemt passord", sprint: "G", auth: "none", status: "tokens" },
  { route: "/404", heritageRef: "error_404_not_found", label: "404", sprint: "G", auth: "none", status: "tokens" },
  { route: "/403", heritageRef: "error_403_access_denied", label: "403", sprint: "G", auth: "none", status: "tokens" },
  { route: "/500", heritageRef: "error_500_server_error", label: "500", sprint: "G", auth: "none", status: "tokens" },
];

export const sprintNames: Record<string, string> = {
  A: "Sprint A — Spillerportal kjerne",
  B: "Sprint B — Mission Control kjerne",
  C: "Sprint C — Booking-system",
  D: "Sprint D — Landingpages",
  E: "Sprint E — Sekundær portal",
  F: "Sprint F — Sekundær MC",
  G: "Sprint G — Auth + Error",
};

export const groupNames: Record<string, string> = {
  E1: "Kalender & Kommunikasjon",
  E2: "Sosialt & Spill",
  E3: "Analyse & AI",
  E4: "Utstyr & Tester",
  E5: "Administrasjon",
  F1: "Operasjon",
  F2: "Kommunikasjon",
  F3: "AI + Analyse",
};

export const statusConfig: Record<string, { label: string; className: string }> = {
  done: { label: "Done", className: "bg-primary-container text-surface" },
  tokens: { label: "Tokens migrated", className: "bg-secondary-fixed text-on-surface" },
  layout: { label: "Layout needed", className: "bg-tertiary-container text-on-tertiary-container" },
  todo: { label: "Todo", className: "bg-surface-variant text-on-surface-variant" },
};
