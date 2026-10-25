"use client";

import type { CSSProperties } from "react";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { BubbleButton } from "./BubbleButton";
import { HeroGlass } from "./HeroGlass";

const HEADLINE_LINES = ["Enterprise technology", "experience. Built over time."];

export function Hero() {
  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const eyebrow = scope.querySelector("[data-hero-eyebrow]");
    const lines = scope.querySelectorAll("[data-hero-line]");
    const supporting = scope.querySelector("[data-hero-support]");
    const ctas = scope.querySelector("[data-hero-ctas]");
    const visual = scope.querySelector("[data-hero-visual]");
    const marker = scope.querySelector("[data-hero-marker]");
    const labels = scope.querySelectorAll("[data-hero-label]");

    if (prefersReducedMotion) {
      gsap.set([eyebrow, lines, supporting, ctas, visual, marker, labels], {
        opacity: 1,
        y: 0,
        clipPath: "none",
      });
      return;
    }

    // The visual panel is on screen immediately, not part of the reveal
    // sequence — it shouldn't be the last thing to show up.
    gsap.set(visual, { opacity: 1, y: 0 });
    gsap.set(marker, { opacity: 0 });
    gsap.set(labels, { opacity: 0, y: 8 });

    gsap.set(lines, { yPercent: 110 });
    gsap.set([eyebrow, supporting, ctas], { opacity: 0, y: 24 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6 })
      .to(lines, { yPercent: 0, duration: 0.8, stagger: 0.09, ease: "power4.out" }, "-=0.25")
      .to(supporting, { opacity: 1, y: 0, duration: 0.65 }, "-=0.4")
      .to(ctas, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .to(marker, { opacity: 1, duration: 1 }, "-=0.9")
      .to(labels, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, "-=0.6");
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92svh] items-center overflow-hidden bg-navy pt-[calc(8rem+env(safe-area-inset-top))] pb-16"
    >
      {/* Faint fixed dot-grid, tuned for the dark field. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-pale/[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Oversized ghost numeral marking the company's founding year — a
          large graphic element that fills space without relying on any
          photography. */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 select-none font-display text-[34vw] font-bold leading-none text-pale/[0.05] sm:-right-6 sm:text-[18rem] lg:-right-10 lg:text-[24rem]"
      >
        2009
      </span>

      {/* Ambient accent glows — cyan (technology) + violet (intelligence).
          Violet now carries slightly more weight than cyan (bigger, more
          opaque) so the section reads as balanced rather than cyan-heavy. */}
      <div
        aria-hidden
        className="glow-blob pointer-events-none absolute left-[8%] top-[18%] size-[360px] bg-cyan/[0.14]"
      />
      <div
        aria-hidden
        className="glow-blob pointer-events-none absolute right-[6%] bottom-[10%] size-[440px] bg-violet/[0.22]"
      />

      <div className="relative mx-auto grid w-full max-w-(--container-page) grid-cols-[minmax(0,1fr)] items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10">
        <div className="max-w-3xl">
          <p
            data-hero-eyebrow
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-pale/15 bg-pale/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan"
          >
            <span className="size-1.5 rounded-full bg-cyan" />
            Canadian Enterprise Technology &bull; Est. 2009
          </p>

          <h1 className="font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight text-balance text-pale sm:text-6xl lg:text-[4.4rem]">
            {HEADLINE_LINES.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <span
                  data-hero-line
                  className="block"
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-support
            className="mt-8 max-w-xl text-base leading-relaxed text-pale/65 sm:text-lg"
          >
            Since 2009, Tellclick Inc. has built its foundation through
            hands-on work across demanding enterprise technology environments
            in Canada &mdash; spanning infrastructure, cloud, cybersecurity,
            automation and mission-critical operations.
          </p>

          <div data-hero-ctas className="mt-11 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <BubbleButton href="/experience" size="lg" variant="primary" className="w-full sm:w-auto">
              Our Experience
            </BubbleButton>
            <BubbleButton href="/ketrivo" size="lg" variant="outlineDark" className="w-full sm:w-auto">
              Meet Ketrivo
            </BubbleButton>
          </div>
        </div>

        <div
          data-hero-visual
          className="animated-border-panel relative mx-auto hidden aspect-square w-full max-w-[560px] items-center justify-center overflow-hidden rounded-[2.5rem] bg-white/[0.02] text-violet/80 shadow-[0_32px_64px_-32px_rgba(0,0,0,0.5)] lg:flex"
          style={{ "--border-beam-color": "var(--color-violet)" } as CSSProperties}
          aria-hidden
        >
          <div className="relative size-full">
            <HeroGlass className="absolute inset-0 size-full" />
          </div>

          <span
            data-hero-marker
            className="absolute right-7 top-7 size-1.5 rounded-full bg-lime shadow-[0_0_12px_3px_rgba(139,108,240,0.55)]"
          />
          <span
            data-hero-label
            className="absolute left-7 top-7 font-mono text-[10px] uppercase tracking-[0.18em] text-pale/40"
          >
            SYS.ACTIVE
          </span>
          <span
            data-hero-label
            className="absolute bottom-7 left-7 font-mono text-[10px] uppercase tracking-[0.18em] text-pale/40"
          >
            43.65&deg;N 79.38&deg;W
          </span>
          <span
            data-hero-label
            className="absolute bottom-7 right-7 font-mono text-[10px] uppercase tracking-[0.18em] text-pale/40"
          >
            EST. 2009
          </span>
        </div>
      </div>
    </section>
  );
}
