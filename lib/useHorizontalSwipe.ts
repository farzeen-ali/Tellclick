"use client";

import * as React from "react";

type Align = "start" | "center";

/**
 * Finger-tracking horizontal scroll for card rows.
 *
 * `touch-action: pan-y` (set by `.touch-carousel`) lets the page keep
 * vertical scrolling, but it also tells the browser to ignore horizontal
 * pans. This hook takes those horizontal pans over with a non-passive
 * touchmove listener — React's synthetic touch events are passive, so
 * preventDefault() there cannot win the gesture. Scroll-snap is suspended
 * while the finger is down so the row tracks 1:1, then the nearest card
 * is settled on release.
 */
export function useHorizontalSwipe(
  ref: React.RefObject<HTMLElement | null>,
  options?: {
    align?: Align;
    suppressClickRef?: React.RefObject<boolean>;
  }
) {
  const align = options?.align ?? "start";
  const suppressClickRef = options?.suppressClickRef;
  const alignRef = React.useRef(align);
  const suppressRef = React.useRef(suppressClickRef);

  React.useEffect(() => {
    alignRef.current = align;
    suppressRef.current = suppressClickRef;
  }, [align, suppressClickRef]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let axis: "x" | "y" | null = null;
    let moved = false;
    let snapTimer = 0;

    const suspendSnap = () => {
      window.clearTimeout(snapTimer);
      el.style.scrollSnapType = "none";
    };

    const restoreSnap = () => {
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        el.style.scrollSnapType = "";
      }, 520);
    };

    const snapToNearest = (projectedShift: number) => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-carousel-card]"));
      if (cards.length === 0) return;

      const trackRect = el.getBoundingClientRect();
      const projectedScroll = el.scrollLeft + projectedShift;
      const positions = cards.map((card) => {
        const rect = card.getBoundingClientRect();
        const delta = rect.left - trackRect.left;
        return alignRef.current === "center"
          ? el.scrollLeft + delta - (el.clientWidth - card.offsetWidth) / 2
          : el.scrollLeft + delta;
      });

      const closest = (to: number) => {
        let index = 0;
        let bestDist = Infinity;
        positions.forEach((left, i) => {
          const dist = Math.abs(left - to);
          if (dist < bestDist) {
            bestDist = dist;
            index = i;
          }
        });
        return index;
      };

      let index = closest(projectedScroll);
      const startIndex = closest(startScroll);
      const travel = projectedScroll - startScroll;
      // A deliberate swipe that hasn't crossed the halfway point should still
      // advance one card. Tiny jitters fall back to the card already in view.
      if (index === startIndex && Math.abs(travel) > 48) {
        index = Math.max(0, Math.min(cards.length - 1, startIndex + (travel > 0 ? 1 : -1)));
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      suspendSnap();
      el.scrollTo({
        left: Math.max(0, positions[index]),
        behavior: reduced ? "auto" : "smooth",
      });
      if (reduced) el.style.scrollSnapType = "";
      else restoreSnap();
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startScroll = el.scrollLeft;
      lastX = startX;
      lastT = performance.now();
      velocity = 0;
      axis = null;
      moved = false;
      suspendSnap();
    };

    const onMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || axis === "y") return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (!axis) {
        if (Math.hypot(dx, dy) < 10) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axis === "y") {
          el.style.scrollSnapType = "";
          return;
        }
        el.style.scrollBehavior = "auto";
      }

      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      velocity = (touch.clientX - lastX) / dt;
      lastX = touch.clientX;
      lastT = now;

      e.preventDefault();
      moved = true;
      el.scrollLeft = startScroll - dx;
    };

    const onEnd = () => {
      const shouldSnap = axis === "x" && moved;
      el.style.scrollBehavior = "";
      if (shouldSnap) {
        const suppress = suppressRef.current;
        if (suppress) {
          suppress.current = true;
          window.setTimeout(() => {
            suppress.current = false;
          }, 600);
        }
        const coast = performance.now() - lastT > 80 ? 0 : Math.max(-160, Math.min(160, -velocity * 180));
        snapToNearest(coast);
      } else {
        el.style.scrollSnapType = "";
      }
      axis = null;
      moved = false;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
      window.clearTimeout(snapTimer);
      el.style.scrollSnapType = "";
      el.style.scrollBehavior = "";
    };
  }, [ref]);
}
