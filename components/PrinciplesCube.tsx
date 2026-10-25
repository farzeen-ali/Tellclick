"use client";

import * as React from "react";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { DURATION, EASE } from "@/lib/animations/motion";
import { PastelCard } from "./PastelCard";

interface Principle {
  name: string;
  description: string;
}

// All five panels float as one group (same distance, duration and phase),
// so the gaps between them stay constant while the cluster drifts.
const FLOAT_DISTANCE = 22;
const FLOAT_DURATION = 3;

// Slot position for each card: index 0 is the large centred "screen" —
// bigger than the rest, sitting in front (z-10) — with the four smaller
// corner cards pushed out toward their own corner (left further left,
// right further right, top further up, bottom further down) just far
// enough that a small gap opens up on every side instead of any card
// overlapping another. Only applies from xl up — below that the cards
// fall back to a plain stacked/2-col grid, since an absolute corner-spread
// layout only reads as intended with real room to breathe.
const SLOT_CLASS = [
  "sm:col-span-2 xl:col-auto xl:absolute xl:left-1/2 xl:top-1/2 xl:z-10 xl:w-[28rem] xl:-translate-x-1/2 xl:-translate-y-1/2",
  // Corner cards sit a fixed 1rem clear of the centred card's edge (half of
  // its 28rem width + 1rem), so no card text ever touches the centre card.
  "xl:absolute xl:right-[calc(50%+14rem+1rem)] xl:top-[5%] xl:z-0 xl:w-60",
  "xl:absolute xl:left-[calc(50%+14rem+1rem)] xl:top-[5%] xl:z-0 xl:w-60",
  "xl:absolute xl:bottom-[5%] xl:right-[calc(50%+14rem+1rem)] xl:z-0 xl:w-60",
  "xl:absolute xl:bottom-[5%] xl:left-[calc(50%+14rem+1rem)] xl:z-0 xl:w-60",
];

/**
 * Five principle cards arranged as a floating collage: the principle with
 * the most content sits large and centred, in front, overlapping the
 * remaining four — smaller — cards tucked behind it at each corner, all
 * drifting gently up and down out of sync with each other. Replaces the
 * previous plain 2/3-column grid for this section specifically, per
 * request.
 */
export function PrinciplesCube({ principles }: { principles: Principle[] }) {
  // The card with the most content (title + description) is featured in
  // the centre slot; the rest keep their original order around it.
  const centerIndex = principles.reduce(
    (maxI, p, i, arr) =>
      p.name.length + p.description.length > arr[maxI].name.length + arr[maxI].description.length
        ? i
        : maxI,
    0
  );
  const ordered = [
    principles[centerIndex],
    ...principles.filter((_, i) => i !== centerIndex),
  ];

  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const slots = Array.from(scope.querySelectorAll<HTMLElement>("[data-principle-slot]"));
    const cards = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal]"));
    // The card's own built-in fade is neutralised here — the slot wrapper
    // drives visibility instead, so the two never fight over opacity.
    gsap.set(cards, { opacity: 1 });

    if (prefersReducedMotion) {
      gsap.set(slots, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const floatEnabled = window.matchMedia("(min-width: 1280px)").matches;

    gsap.set(slots, { opacity: 0, y: 28, scale: 0.94 });
    slots.forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: DURATION.slow,
        ease: EASE.premium,
        delay: i * 0.09,
        scrollTrigger: { trigger: scope, start: "top 78%" },
        onComplete: () => {
          // Float all five cards as ONE group: a single shared tween starts
          // once the last card has settled, so every card rises and falls
          // together and the gaps between them never change.
          if (!floatEnabled || i !== slots.length - 1) return;
          gsap.to(slots, {
            y: -FLOAT_DISTANCE,
            duration: FLOAT_DURATION,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        },
      });
    });
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:relative xl:block xl:min-h-[640px] xl:gap-0"
    >
      {ordered.map((principle, i) => (
        <div key={principle.name} data-principle-slot className={SLOT_CLASS[i % SLOT_CLASS.length]}>
          <PastelCard
            title={principle.name}
            description={principle.description}
            index={i}
            featured={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
