"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "./gsap";

/**
 * Runs GSAP work scoped to a ref, wrapped in gsap.context() for automatic
 * cleanup (kills tweens/ScrollTriggers created inside on unmount), and
 * passes along whether the visitor prefers reduced motion so callers can
 * skip motion-heavy setup entirely.
 */
export function useGsapContext<T extends Element>(
  callback: (ctx: { scope: T; prefersReducedMotion: boolean }) => void | (() => void),
  deps: React.DependencyList = []
): RefObject<T | null> {
  const scopeRef = useRef<T>(null);

  useLayoutEffect(() => {
    if (!scopeRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      return callback({ scope: scopeRef.current as T, prefersReducedMotion });
    }, scopeRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
