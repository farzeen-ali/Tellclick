"use client";

import { cn } from "@/lib/utils";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { PROOF_POINTS } from "@/lib/data/proof";

// Rotating gradient treatment per stat, cycling through the Technology
// Color System's shared .text-gradient-* utilities (globals.css). The
// third stat uses a brushed-metal violet instead of the warm coral tone —
// coral read as an off-brand orange against the other three cool accents.
const PROOF_GRADIENTS = [
  "text-gradient-cyan",
  "text-gradient-cyan",
  "text-gradient-cyan",
  "text-gradient-cyan",
];

export function ProofStrip() {
  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const cells = scope.querySelectorAll<HTMLElement>("[data-proof-cell]");

    cells.forEach((cell) => {
      const numberEl = cell.querySelector<HTMLElement>("[data-proof-number]");
      const target = Number(cell.dataset.value);
      const suffix = cell.dataset.suffix ?? "";

      if (prefersReducedMotion || !numberEl) {
        if (numberEl) numberEl.textContent = `${target}${suffix}`;
        gsap.set(cell, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(cell, { opacity: 0, y: 28 });
      const counter = { value: 0 };
      const tl = gsap.timeline({
        scrollTrigger: { trigger: cell, start: "top 85%", once: true },
      });
      tl.to(cell, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }).to(
        counter,
        {
          value: target,
          duration: 1.0,
          ease: "power2.out",
          onUpdate: () => {
            numberEl.textContent = `${Math.round(counter.value)}${suffix}`;
          },
        },
        "-=0.25"
      );
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-navy-2 py-16 lg:py-20">
      {/* Thin gradient thread connecting this strip to the network section
          above it — cyan through violet through coral, the full accent
          system in one line. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent"
      />

      <div
        ref={ref}
        className="relative mx-auto grid max-w-(--container-page) grid-cols-2 gap-x-6 gap-y-12 px-6 lg:grid-cols-4 lg:gap-x-10 lg:px-10"
      >
        {PROOF_POINTS.map((point, i) => (
          <div
            key={point.label}
            data-proof-cell
            data-value={point.value}
            data-suffix={point.suffix}
            className="min-w-0 border-l border-pale/15 pl-5 sm:pl-7"
          >
            <p
              data-proof-number
              className={cn(
                "max-w-full pr-1 font-display text-5xl font-bold leading-none tracking-tight max-[330px]:text-4xl sm:text-7xl lg:text-8xl",
                PROOF_GRADIENTS[i % PROOF_GRADIENTS.length]
              )}
            >
              0{point.suffix}
            </p>
            <p className="mt-5 max-w-[16ch] text-sm leading-snug text-pale/60 sm:text-base">
              {point.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
