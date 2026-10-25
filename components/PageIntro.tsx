"use client";

import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { TechnicalGrid } from "./TechnicalGrid";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  visual?: "pattern" | "ribbons" | "waves" | "device" | "grid";
  /** Per-section accent from the Tellclick Technology Color System — cyan
   * (technology/infrastructure) is the default; Experience uses coral
   * (automation/transformation, tracing the 15-year arc) and Ketrivo uses
   * violet (intelligence/AI), matching the same colour's meaning everywhere
   * else on the site. Ignored by the Privacy page's GridIntro. */
  accent?: "cyan" | "violet" | "coral";
}

// Privacy ("grid") still uses the abstract technical diagram in a bordered
// side panel. Every other page (About/Experience/Capabilities/Ketrivo) has
// no visual panel at all — see NoPanelIntro below — so this map only ever
// has the one entry.
const VISUAL_COMPONENT: Partial<Record<NonNullable<PageIntroProps["visual"]>, ComponentType<{ className?: string }>>> = {
  grid: TechnicalGrid,
};

/**
 * Shared interior-page title band. Privacy ("grid") keeps the original
 * two-column layout — copy on the left, the abstract technical diagram in a
 * bordered panel on the right. Every other page has no side panel/image at
 * all: NoPanelIntro renders a full-width, centered, dark "statement" band
 * instead (pill eyebrow + big heading + short subtitle over a navy field
 * with a soft glow), the same treatment across About/Experience/
 * Capabilities/Ketrivo.
 */
export function PageIntro({ eyebrow, title, description, visual = "grid", accent = "cyan" }: PageIntroProps) {
  if (visual !== "grid") {
    return <NoPanelIntro eyebrow={eyebrow} title={title} description={description} accent={accent} />;
  }
  return <GridIntro eyebrow={eyebrow} title={title} description={description} visual={visual} />;
}

/**
 * Privacy's original two-column layout — copy on the left, the abstract
 * technical diagram in a bordered panel on the right. Split out into its own
 * component (rather than living inline in PageIntro) purely so its
 * useGsapContext call is never conditionally reached — PageIntro itself
 * calls no hooks, it just picks which of these two to render.
 */
function GridIntro({
  eyebrow,
  title,
  description,
  visual,
}: Required<Pick<PageIntroProps, "eyebrow" | "title" | "description" | "visual">>) {
  const Visual = VISUAL_COMPONENT[visual];

  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const targets = scope.querySelectorAll("[data-reveal]");
    const panel = scope.querySelector("[data-intro-visual]");

    if (prefersReducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      gsap.set(panel, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y: 12 });
    gsap.set(panel, { opacity: 0, y: 16 });

    const tl = gsap.timeline({ delay: 0.05, defaults: { ease: "power2.out" } });
    tl.to(targets, { opacity: 1, y: 0, duration: 0.22, stagger: 0.04 });
    tl.to(panel, { opacity: 1, y: 0, duration: 0.6 }, "-=0.05");
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[70svh] items-center overflow-hidden bg-paper pt-[calc(8rem+env(safe-area-inset-top))] pb-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-ink/[0.035]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-(--container-page) items-center gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-10">
        <div className="max-w-2xl">
          <p
            data-reveal
            className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-ink-soft"
          >
            <span className="size-1.5 rounded-full bg-accent" />
            {eyebrow}
          </p>
          <h1
            data-reveal
            className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          <p
            data-reveal
            className="mt-7 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {description}
          </p>
        </div>

        <div
          data-intro-visual
          className="relative hidden aspect-[4/3] items-center justify-center rounded-md border border-hairline bg-surface p-8 text-ink-faint shadow-[0_32px_64px_-32px_rgba(15,38,56,0.18)] lg:flex"
          aria-hidden
        >
          {Visual ? <Visual /> : null}
        </div>
      </div>
    </section>
  );
}

/**
 * The no-panel intro: a full-width, centered "statement" band on a constant
 * dark-navy field (the same always-dark chrome colour as the navbar/footer
 * and the case-study/flip-card backs — not the theme-adaptive paper/ink
 * tokens), with a pill-shaped eyebrow badge, one big centered headline and a
 * short centered subtitle. Replaces the old side-by-side photo panel on
 * About/Experience/Capabilities/Ketrivo with something that reads as a
 * deliberate, on-brand statement rather than an empty gap where an image
 * used to be.
 */
const NO_PANEL_ACCENTS = {
  cyan: { text: "text-cyan", dot: "bg-cyan", glow: "bg-cyan/[0.16]", glow2: "bg-violet/10" },
  violet: { text: "text-violet", dot: "bg-violet", glow: "bg-violet/[0.16]", glow2: "bg-cyan/10" },
  coral: { text: "text-coral", dot: "bg-coral", glow: "bg-coral/[0.16]", glow2: "bg-cyan/10" },
} as const;

function NoPanelIntro({
  eyebrow,
  title,
  description,
  accent = "cyan",
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent?: "cyan" | "violet" | "coral";
}) {
  const tone = NO_PANEL_ACCENTS[accent];
  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const targets = scope.querySelectorAll("[data-reveal]");

    if (prefersReducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y: 14 });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.1,
    });
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[56svh] items-center justify-center overflow-hidden bg-navy pt-[calc(9rem+env(safe-area-inset-top))] pb-24"
    >
      {/* Faint dot-grid, matching the texture used site-wide, tuned light
          for a dark field instead of dark-on-light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-pale/[0.05]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Soft ambient glow centered behind the copy — the bit of depth that
          keeps a text-only band from reading as flat/empty. Colour is the
          section's own accent from the Tellclick Technology Color System. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]",
          tone.glow
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 size-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]",
          tone.glow2
        )}
      />

      <div className="relative mx-auto w-full max-w-3xl px-6 text-center lg:px-10">
        <p
          data-reveal
          className={cn(
            "mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-pale/15 bg-pale/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em]",
            tone.text
          )}
        >
          <span className={cn("size-1.5 rounded-full", tone.dot)} />
          {eyebrow}
        </p>
        <h1
          data-reveal
          className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance text-pale sm:text-5xl lg:text-6xl"
        >
          {title}
        </h1>
        <p
          data-reveal
          className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-pale/70 sm:text-lg"
        >
          {description}
        </p>
      </div>
    </section>
  );
}
