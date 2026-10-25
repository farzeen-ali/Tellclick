import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * "#rrggbb" -> "r,g,b" for building rgba() strings from a CSS custom
 * property value read via getComputedStyle. Falls back to the given
 * default (also "r,g,b") if the input isn't a recognizable hex colour.
 */
export function hexToRgbString(hex: string, fallback = "247,248,246"): string {
  const match = hex.trim().match(/^#([0-9a-f]{6})$/i);
  if (!match) return fallback;
  const int = parseInt(match[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `${r},${g},${b}`;
}
