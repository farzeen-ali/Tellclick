"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { DURATION, EASE } from "@/lib/animations/motion";
import { SECTORS } from "@/lib/data/sectors";
import { SectionHeading } from "./SectionHeading";
import { DataFlowDivider } from "./TechVisuals";

// Resting vertical offsets (px) that scatter the four bubbles instead of
// lining them up in a strict row — part of what makes this read as "very
// different" from the flip cards and the slider. Baked into the GSAP tween
// itself (not a CSS transform class) so it never fights the entrance/float
// tweens, which also animate `y` on the same element.
const SCATTER_Y = [0, 26, -18, 14];

// Independent per-bubble float timing so the four circles drift up and down
// slowly out of sync with each other, not as one synchronized group.
const FLOAT_DISTANCE = [18, 14, 20, 15];
const FLOAT_DURATION = [0.8, 1.0, 0.9, 1.1];

export function SectorSection() {
  const tweensRef = React.useRef<Array<gsap.core.Tween | undefined>>([]);

  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const bubbles = Array.from(scope.querySelectorAll<HTMLElement>("[data-sector-bubble]"));
    // The static scatter offset only makes sense in the side-by-side desktop
    // row; in the single-column mobile stack it just crowds neighbouring
    // bubbles together, so it's skipped below the `sm` breakpoint.
    const scatterEnabled = window.matchMedia("(min-width: 640px)").matches;
    const scatter = scatterEnabled ? SCATTER_Y : [0, 0, 0, 0];

    if (prefersReducedMotion) {
      bubbles.forEach((el, i) => gsap.set(el, { opacity: 1, y: scatter[i % scatter.length] }));
      return;
    }

    bubbles.forEach((el, i) => {
      const rest = scatter[i % scatter.length];
      gsap.set(el, { opacity: 0, y: rest + 32, scale: 0.94 });
      gsap.to(el, {
        opacity: 1,
        y: rest,
        scale: 1,
        duration: DURATION.slow,
        ease: EASE.premium,
        delay: i * 0.1,
        scrollTrigger: { trigger: scope, start: "top 78%" },
        onComplete: () => {
          // Gentler drift in the single-column phone stack so the gaps
          // between circles stay visibly even.
          const distance =
            FLOAT_DISTANCE[i % FLOAT_DISTANCE.length] * (scatterEnabled ? 1 : 0.4);
          const duration = FLOAT_DURATION[i % FLOAT_DURATION.length];
          tweensRef.current[i] = gsap.to(el, {
            y: rest + (i % 2 === 0 ? -distance : distance),
            duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        },
      });
    });
  }, []);

  return (
    <section className="bg-paper pt-6 pb-20 lg:pt-8 lg:pb-24">
      <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
        <div
          className="relative overflow-hidden rounded-[1.75rem] px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
        >
          {/* Abstract band as the full background of the heading block —
              the image fills the whole panel, edge-to-edge, and the text
              sits on top of it rather than above a separate strip. */}
          <Image
            src="/images/sector-intro-bg-2.jpg"
            alt=""
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover img-vivid"
          />
          {/* Dark scrim so the light heading text stays legible over the
              photo, strongest behind the text and fading toward the right. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-navy/70 via-navy/40 to-navy/10"
          />

          <div className="relative z-10">
            <SectionHeading
              eyebrow="Experience Where Technology Matters"
              title="Built where uptime, governance and change control are non-negotiable."
              subtitle="Experience built in environments where security, uptime, governance and change control are non-negotiable."
              theme="dark"
            />
          </div>
        </div>

        <div
          className="relative mt-12 h-20 overflow-hidden rounded-sm border border-cyan/20 bg-surface sm:h-24"
          aria-hidden
        >
          <DataFlowDivider className="h-full w-full" />
        </div>

        {/* Four slow-drifting bubbles standing in for the four sectors —
            sky-blue/violet tinted, no index numerals, each floating up and
            down independently. Hovering a bubble pauses its drift and
            deepens the tint, echoing the hover language used elsewhere on
            the site (Capabilities, Progression). */}
        <div
          ref={ref}
          className="mt-20 grid grid-cols-1 justify-items-center gap-y-10 sm:mt-24 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-20 xl:grid-cols-4 xl:gap-x-8"
        >
          {SECTORS.map((sector, i) => (
            <div key={sector.name} className="flex justify-center">
              <div
                data-sector-bubble
                onMouseEnter={() => tweensRef.current[i]?.pause()}
                onMouseLeave={() => tweensRef.current[i]?.resume()}
                className="group relative flex size-[220px] shrink-0 items-center justify-center rounded-full shadow-[0_28px_64px_-30px_rgba(15,38,56,0.35)] sm:size-[236px] xl:size-[252px]"
              >
                {/* Base sky-blue/violet tint. */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(140deg, rgba(43,127,153,0.16), rgba(165,140,240,0.18))",
                  }}
                />
                {/* Deeper wash that fades in on hover — same "increase the
                    density" language as the rest of the site's hover
                    states. */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(140deg, rgba(43,127,153,0.32), rgba(165,140,240,0.34))",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-[#10263a]/35 transition-colors duration-500 dark:border-cyan/35 dark:group-hover:border-violet/50"
                />

                <div className="relative z-10 flex max-w-[152px] flex-col items-center px-4 text-center sm:max-w-[164px] xl:max-w-[176px]">
                  <h3 className="font-display text-base font-medium tracking-tight text-ink sm:text-lg">
                    {sector.name}
                  </h3>
                  <p className="mt-2.5 line-clamp-4 text-[11px] leading-relaxed text-ink-soft sm:text-xs">
                    {sector.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
