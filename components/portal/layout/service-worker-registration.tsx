"use client";

import { useEffect, useState } from "react";
import { AchievementToast } from "@/components/portal/ui/achievement-toast";

interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
}

export function ServiceWorkerRegistration() {
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  useEffect(() => {
    async function subscribeToPushNotifications() {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
          ) as BufferSource,
        });

        // Send subscription to server
        await fetch("/api/portal/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            p256dh: arrayBufferToBase64(subscription.getKey("p256dh")!),
            auth: arrayBufferToBase64(subscription.getKey("auth")!),
          }),
        });

        console.log("[Push] Subscribed successfully");
      } catch (error) {
        console.error("[Push] Subscription failed:", error);
      }
    }
    // Register service worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[SW] Registered:", registration.scope);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New version available
                  console.log("[SW] New version available");
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("[SW] Registration failed:", error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "ACHIEVEMENT_UNLOCKED") {
          setUnlockedAchievement(event.data.achievement);
        }
      });

      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        // Defer permission request until user interaction
        const requestPermission = () => {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              subscribeToPushNotifications();
            }
          });
        };

        // Add click listener to request permission on first user interaction
        const handleFirstInteraction = () => {
          requestPermission();
          document.removeEventListener("click", handleFirstInteraction);
        };
        document.addEventListener("click", handleFirstInteraction);
      }
    }
  }, []);

  return (
    <AchievementToast
      achievement={unlockedAchievement}
      onClose={() => setUnlockedAchievement(null)}
    />
  );
}
