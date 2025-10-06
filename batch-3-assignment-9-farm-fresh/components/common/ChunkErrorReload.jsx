"use client";
import { useEffect } from "react";

// Global runtime guard to auto-recover from sporadic ChunkLoadError by reloading once
export default function ChunkErrorReload() {
  useEffect(() => {
    // Avoid infinite reload loops when a chunk truly cannot be loaded (e.g., bad deploy)
    const buildId =
      typeof window !== "undefined" ? window.__NEXT_DATA__?.buildId : "";
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const storageKey = `ff-chunk-reloaded-${buildId || "_"}-${path}`;
    const maxReloads = 1; // once per build & path
    let inMemoryTriggered = false;

    const handler = (event) => {
      const err = event?.reason || event?.error || event;
      if (!err) return;
      const name = err?.name || "";
      const message = err?.message || "";
      const isChunkError =
        name.includes("ChunkLoadError") ||
        message.includes("ChunkLoadError") ||
        message.includes("Loading chunk") ||
        message.includes("Failed to fetch dynamically imported module");

      if (!isChunkError) return; // ignore unrelated errors

      try {
        const count = Number(localStorage.getItem(storageKey) || "0");
        if (count >= maxReloads) {
          // We've already tried reloading; stop looping & surface a console hint.
          if (!inMemoryTriggered) {
            inMemoryTriggered = true;
            console.warn(
              `[ChunkErrorReload] Persistent chunk error after ${count} reload(s). Suppressing further reloads.`,
              { name, message }
            );
          }
          return;
        }
        localStorage.setItem(storageKey, String(count + 1));
        console.info(
          "[ChunkErrorReload] Attempting one-time recovery reload due to chunk error",
          {
            name,
            message,
          }
        );
        window.location.reload();
      } catch (e) {
        // Fallback: if storage unavailable, attempt single reload guarded by in-memory flag
        if (!inMemoryTriggered) {
          inMemoryTriggered = true;
          window.location.reload();
        }
      }
    };

    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", handler);
    return () => {
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", handler);
    };
  }, []);

  return null;
}
