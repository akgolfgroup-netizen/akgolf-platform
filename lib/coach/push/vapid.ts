import webpush from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  "mailto:post@akgolf.no",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export { webpush, VAPID_PUBLIC_KEY };
