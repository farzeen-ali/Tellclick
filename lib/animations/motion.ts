/**
 * Shared motion vocabulary. Keeping durations/eases/offsets centralized is
 * what makes the site's ~30 GSAP call sites feel like one coherent system
 * instead of a grab-bag of tweaks.
 */
export const EASE = {
  premium: "power3.out",
  editorial: "power2.inOut",
  soft: "power1.out",
} as const;

export const DURATION = {
  fast: 0.4,
  base: 0.6,
  slow: 0.9,
  hero: 1.2,
} as const;

export const REVEAL_Y = 36;

/** Standard scroll-triggered entrance: used by nearly every section heading,
 * paragraph and card across the site so reveals feel identical everywhere. */
export const revealFrom = {
  y: REVEAL_Y,
  opacity: 0,
};

export const revealTo = {
  y: 0,
  opacity: 1,
  duration: DURATION.base,
  ease: EASE.premium,
};
