"use client";

import * as React from "react";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { revealFrom, revealTo } from "@/lib/animations/motion";
import { cn } from "@/lib/utils";

interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

/**
 * Generic scroll-triggered fade-up reveal for any block of markup that
 * marks its animatable children with `data-reveal`. Used throughout the
 * interior pages so every section shares the same entrance rhythm as the
 * homepage without re-wiring GSAP by hand each time.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: RevealGroupProps) {
  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const targets = scope.querySelectorAll("[data-reveal]");
    if (targets.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, revealFrom);
    gsap.to(targets, {
      ...revealTo,
      stagger,
      scrollTrigger: { trigger: scope, start: "top 82%" },
    });
  }, []);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
