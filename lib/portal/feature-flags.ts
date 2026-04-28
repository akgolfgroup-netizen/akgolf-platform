/**
 * Feature flags for PlayerHQ-ruter.
 *
 * Bruk: legg til en rute her for å gjøre den synlig i sidebar.
 * Skjulte ruter forblir teknisk tilgjengelige via direkte URL,
 * men vises ikke i navigasjonen.
 *
 * Endre listen og redeploy for å justere hva spillere ser.
 */
export const VISIBLE_PLAYERHQ_ROUTES = new Set<string>([
  "/portal",
  "/portal/min-plan",
  "/portal/treningsplan",
  "/portal/treningsplan/uke",
  "/portal/bookinger",
  "/portal/profil",
  "/portal/ai-coach",
  "/portal/statistikk",
  "/portal/runde",
  "/portal/bag",
  "/portal/trackman",
  "/portal/turneringsplan",
]);

export function isPlayerHQRouteVisible(href: string): boolean {
  return VISIBLE_PLAYERHQ_ROUTES.has(href);
}
