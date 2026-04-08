// Midlertidig deaktivert for lansering
// TODO: Aktiver etter VAPID-nøkler er fikset

import webpush from "web-push";

const VAPID_PUBLIC_KEY = "";

function ensureVapidConfigured() {
  return false;
}

export { webpush, VAPID_PUBLIC_KEY, ensureVapidConfigured };
