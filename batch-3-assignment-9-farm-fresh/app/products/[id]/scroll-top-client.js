"use client";
import { useEffect } from "react";

/**
 * ScrollTopOnMount
 * Safely resets scroll to top when the product detail layout mounts.
 * Features:
 *  - Skips if URL has a hash (respect anchor navigation intent)
 *  - Respects prefers-reduced-motion (avoids smooth animation if user requests reduced motion)
 *  - Uses standards-compliant behavior values ("smooth" / fallback to instant jump)
 *  - Catches unexpected runtime errors (defensive in older / embedded browsers)
 */
export default function ScrollTopOnMount() {
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety
    if (window.location.hash) return; // Respect anchor targets

    try {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      // Feature detection for smooth behavior support
      const supportsSmooth = "scrollBehavior" in document.documentElement.style;

      if (!prefersReducedMotion && supportsSmooth) {
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        });
      } else {
        // Fallback: immediate jump without animation
        window.scrollTo(0, 0);
      }
    } catch (_) {
      // Ultimate fallback
      try {
        window.scrollTo(0, 0);
      } catch {}
    }
  }, []);
  return null;
}
