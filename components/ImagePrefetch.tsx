"use client";

import { useEffect } from "react";

/**
 * Historically warmed every full-bleed background photo used across the
 * site (homepage hero + each inner page's title section) into the browser
 * cache shortly after first paint. The enterprise redesign replaced those
 * photographs with inline SVG technical diagrams (see components/
 * TechVisuals.tsx), which need no network fetch at all, so there is
 * nothing left to prefetch. Left in place as a no-op rather than removed
 * so app/layout.tsx doesn't need touching, and so a future section that
 * reintroduces a real full-bleed photo has an obvious place to register it.
 */
const ALL_SECTION_IMAGES: string[] = [];

export function ImagePrefetch() {
  useEffect(() => {
    const warm = () => {
      ALL_SECTION_IMAGES.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = setTimeout(warm, 300);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
