"use client";

import * as React from "react";
import {
  Landmark,
  Server,
  ShieldCheck,
  CloudCog,
  ClipboardCheck,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { revealFrom, revealTo } from "@/lib/animations/motion";
import { TIMELINE } from "@/lib/data/timeline";

const ERA_ICONS: LucideIcon[] = [
  Landmark,
  Server,
  ShieldCheck,
  CloudCog,
  ClipboardCheck,
  BrainCircuit,
];

/**
 * Vertical timeline: a single spine running down the centre, carrying each
 * era's date at its midpoint, with a metallic visual panel and its text
 * alternating sides row to row — panel, text, then text, panel, and so on
 * — instead of the previous tall single-column stack or a horizontal
 * scroller. Both the panel and the text lean inward toward the spine, so
 * the whole thing reads as one connected thread rather than a list of
 * disconnected rows.
 */
export function Timeline() {
  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const rows = scope.querySelectorAll("[data-era-row]");
    const spine = scope.querySelector<HTMLElement>("[data-era-spine]");

    if (prefersReducedMotion) {
      gsap.set(rows, { opacity: 1, y: 0 });
      if (spine) gsap.set(spine, { scaleY: 1 });
      return;
    }

    if (spine) {
      gsap.set(spine, { scaleY: 0, transformOrigin: "top" });
      gsap.to(spine, {
        scaleY: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: scope, start: "top 75%" },
      });
    }

    gsap.set(rows, revealFrom);
    gsap.to(rows, {
      ...revealTo,
      stagger: 0.12,
      scrollTrigger: { trigger: scope, start: "top 72%" },
    });
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Central spine the whole sequence hangs off — desktop only; rows
          stack in a single column on narrower viewports. */}
      <div
        aria-hidden
        data-era-spine
        className="absolute left-1/2 top-2 bottom-2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-cyan/60 via-violet/50 to-cyan/60 lg:block"
      />

      <div className="flex flex-col gap-14 lg:gap-20">
        {TIMELINE.map((era, i) => {
          const Icon = ERA_ICONS[i % ERA_ICONS.length];
          const reversed = i % 2 === 1;

          return (
            <div
              key={era.period}
              data-era-row
              className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8"
            >
              <div
                className={cn(
                  "flex justify-center lg:order-1 lg:justify-end",
                  reversed && "lg:order-3 lg:justify-start"
                )}
              >
                <EraVisual icon={Icon} />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-2.5 lg:order-2">
                <span className="size-3 rounded-full bg-charcoal shadow-[0_0_0_4px_var(--color-paper)]" />
                <span className="metallic-date-pill">
                  <span className="font-bold text-charcoal dark:font-black dark:text-white dark:[text-shadow:0_0_0.6px_#fff]">{era.period}</span>
                </span>
              </div>

              <div
                className={cn(
                  "text-center lg:order-3 lg:max-w-sm lg:justify-self-start lg:text-left",
                  reversed && "lg:order-1 lg:ml-auto lg:justify-self-end lg:text-right"
                )}
              >
                <h3 className="font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
                  {era.theme}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                  {era.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EraVisual({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="metallic-panel flex size-24 shrink-0 items-center justify-center rounded-3xl text-white shadow-[0_20px_40px_-16px_rgba(16,38,58,0.55)] sm:size-28">
      <Icon className="relative z-10 size-10 sm:size-11" strokeWidth={1.5} />
    </span>
  );
}
