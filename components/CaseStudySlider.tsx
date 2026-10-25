"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Cloud,
  Server,
  ShieldCheck,
  Workflow,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { revealFrom, revealTo } from "@/lib/animations/motion";
import { CASE_STUDIES } from "@/lib/data/case-studies";
import { useHorizontalSwipe } from "@/lib/useHorizontalSwipe";
import { LogoMark } from "./Logo";

const CASE_ICONS = [Cloud, Server, ShieldCheck, Workflow, RefreshCw];

// Rotating accent lighting per card, drawn from the Tellclick Technology
// Color System. Every class string is a static literal — required for
// Tailwind's scanner, which can't resolve a class name built at runtime —
// and `beam` is the CSS custom-property value consumed by the shared
// .animated-border-panel traveling-light effect (globals.css).
const CASE_ACCENTS = [
  { glow: "bg-cyan/20", pill: "bg-cyan", ring: "border-cyan/40", num: "text-cyan/[0.07]", beam: "var(--color-cyan)" },
  { glow: "bg-violet/20", pill: "bg-violet", ring: "border-violet/40", num: "text-violet/[0.07]", beam: "var(--color-violet)" },
];

/**
 * Case studies as a large-format horizontal slider — one big feature card
 * at a time with neighbouring cards peeking at the edges, and arrow + dot
 * navigation underneath — instead of a grid of plain rectangles. Same
 * carousel language as an editorial/blog slider (e.g. humain.com's), just
 * in Tellclick's own navy/blue palette and built from the site's existing
 * per-case icons and copy rather than any new imagery or links.
 */
// Inactive-card resting state for the humain.com-style "focus" effect: every
// slide but the active one sits slightly smaller and dimmer, then pops back
// up to full scale with a springy overshoot as it becomes active.
const INACTIVE_SCALE = 0.86;
const INACTIVE_OPACITY = 0.8;
const POP_EASE = "back.out(1.7)";
const POP_DURATION = 0.7;

export function CaseStudySlider() {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<Array<HTMLElement | null>>([]);
  const reducedMotionRef = React.useRef(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  // Pixel spacers (not CSS %) at each end of the track, sized to exactly
  // half the gap between the track's width and one card's width — this is
  // what lets the first/last card scroll all the way to dead-center instead
  // of stopping at the container edge. Percentage padding can't do this
  // reliably here: a flex child's width% resolves against the *content*
  // box (after the track's own padding is subtracted), so padding and card
  // width end up computed against two different bases and never line up.
  const [spacerWidth, setSpacerWidth] = React.useState(0);

  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    reducedMotionRef.current = prefersReducedMotion;

    if (prefersReducedMotion) {
      gsap.set(scope, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(scope, revealFrom);
    gsap.to(scope, {
      ...revealTo,
      scrollTrigger: { trigger: scope, start: "top 78%" },
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.trigger === scope && t.kill());
  }, []);

  // Scale/fade the active card up to full size with a "pop" overshoot and
  // settle every other card back to its smaller, dimmer resting state.
  const applyFocusState = React.useCallback((index: number, animate: boolean) => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const isActive = i === index;
      const vars = { scale: isActive ? 1 : INACTIVE_SCALE, opacity: isActive ? 1 : INACTIVE_OPACITY };
      if (animate && !reducedMotionRef.current) {
        gsap.to(card, { ...vars, duration: POP_DURATION, ease: POP_EASE, overwrite: "auto" });
      } else {
        gsap.set(card, vars);
      }
    });
  }, []);

  React.useLayoutEffect(() => {
    applyFocusState(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    applyFocusState(activeIndex, true);
  }, [activeIndex, applyFocusState]);

  // Measure the real, rendered card width (in px, post-layout) and keep the
  // end spacers sized so the first/last card can reach dead-center too —
  // recomputed on any resize, including a card's width jumping at a
  // Tailwind breakpoint.
  React.useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const recompute = () => {
      const firstCard = track.querySelector<HTMLElement>("article");
      if (!firstCard) return;
      setSpacerWidth(Math.max(0, (track.clientWidth - firstCard.offsetWidth) / 2));
    };

    recompute();

    const observer = new ResizeObserver(recompute);
    observer.observe(track);
    const firstCard = track.querySelector<HTMLElement>("article");
    if (firstCard) observer.observe(firstCard);

    return () => observer.disconnect();
  }, []);

  const getCards = React.useCallback(
    () => Array.from(trackRef.current?.querySelectorAll<HTMLElement>("article") ?? []),
    []
  );

  // Centers the target slide inside the track only. scrollIntoView also
  // scrolls the page, which on mobile jumps the whole document and often
  // never moves the card row.
  const scrollToIndex = React.useCallback(
    (i: number) => {
      const track = trackRef.current;
      const cards = getCards();
      const clamped = Math.max(0, Math.min(cards.length - 1, i));
      const slide = cards[clamped];
      if (!track || !slide) return;
      const delta = slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const left = track.scrollLeft + delta - (track.clientWidth - slide.offsetWidth) / 2;
      track.scrollTo({
        left: Math.max(0, left),
        behavior: reducedMotionRef.current ? "auto" : "smooth",
      });
      setActiveIndex(clamped);
    },
    [getCards]
  );

  useHorizontalSwipe(trackRef, { align: "center" });

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Whichever card's own center sits closest to the track's visible
        // center is the "active" one — matches the snap-center behaviour.
        const trackRect = track.getBoundingClientRect();
        const containerCenter = trackRect.left + trackRect.width / 2;
        let closest = 0;
        let closestDist = Infinity;
        getCards().forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const dist = Math.abs(cardCenter - containerCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        setActiveIndex(closest);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [getCards]);

  return (
    <div ref={ref} className="min-w-0">
      <div
        ref={trackRef}
        className="touch-carousel no-scrollbar flex min-w-0 max-w-full snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch]"
      >
        <div aria-hidden className="shrink-0" style={{ width: spacerWidth }} />
        {CASE_STUDIES.map((study, i) => {
          const Icon = CASE_ICONS[i % CASE_ICONS.length];
          const accent = CASE_ACCENTS[i % CASE_ACCENTS.length];
          const numeral = String(i + 1).padStart(2, "0");
          return (
            <article
              key={study.name}
              data-carousel-card
              className="relative w-[86%] shrink-0 snap-center sm:w-[60%] lg:w-[52%]"
            >
            <div
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-case-motion
              className="animated-border-panel relative flex min-h-[480px] flex-col overflow-hidden rounded-2xl bg-navy case-card text-pale [transform-origin:center] sm:h-[500px] sm:min-h-0 lg:h-[560px]"
              style={{ "--border-beam-color": accent.beam } as CSSProperties}
            >
              {/* Faint technical grid across the whole card — part of the
                  "card itself is the visual" treatment, standing in for
                  stock photography. */}
              <div aria-hidden className="bg-grid-lines pointer-events-none absolute inset-0 text-pale/[0.05]" />

              {/* Oversized, non-overlapping index numeral — a background
                  watermark only (absolute, aria-hidden, very low opacity,
                  behind every piece of real content), never the foreground
                  running "0X/05" counter that was removed earlier for
                  colliding with the copy block. */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -bottom-6 -right-3 select-none font-display text-[9rem] font-bold leading-none sm:text-[11rem]",
                  accent.num
                )}
              >
                {numeral}
              </span>

              <div className="relative flex items-center border-b border-pale/15 px-7 py-5 sm:px-9">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pale">
                  <LogoMark className="size-4" />
                  Tellclick
                </span>
              </div>

              <div className="relative border-b border-pale/15 px-7 py-7 sm:px-9 sm:py-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-maple">
                  Case Study
                </p>
                <h3 className="mt-3 font-display text-2xl font-medium leading-snug tracking-tight text-pale sm:text-[1.75rem] lg:text-3xl">
                  {study.headline}
                </h3>
              </div>

              <div className="relative flex flex-1 flex-col overflow-hidden">
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -right-16 top-1/3 size-[340px] -translate-y-1/2 rounded-full blur-[90px] sm:size-[420px]",
                    accent.glow
                  )}
                />

                {/* Emblem gets its own flex region above the copy, instead of
                    being centered over the full card and absolutely
                    overlapping whatever the copy block below turns out to be
                    tall — the description length varies per case study, so a
                    fixed-position overlay could (and did) collide with it. */}
                <div className="flex min-h-[100px] flex-1 items-center justify-center py-2 sm:min-h-0">
                  <CaseEmblem Icon={Icon} ring={accent.ring} />
                </div>

                <div className="relative flex shrink-0 flex-col gap-3 p-7 pt-0 sm:px-9 sm:pb-9">
                  <span
                    className={cn(
                      "inline-flex w-fit items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-navy sm:text-sm",
                      accent.pill
                    )}
                  >
                    {study.name}
                  </span>
                  <p className="max-w-md text-sm leading-relaxed text-pale sm:text-base">
                    {study.description}
                  </p>
                </div>
              </div>
            </div>
            </article>
          );
        })}
        <div aria-hidden className="shrink-0" style={{ width: spacerWidth }} />
      </div>

      <p className="mt-4 text-center text-xs text-ink-faint sm:hidden">Swipe to browse case studies</p>

      <div className="mt-4 flex items-center justify-center gap-2 sm:mt-8 sm:gap-4">
        <button
          type="button"
          aria-label="Previous case study"
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="inline-flex size-11 items-center justify-center rounded-full text-ink-faint transition-colors duration-200 hover:bg-ink/5 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowLeft className="size-5" strokeWidth={1.75} />
        </button>

        <div className="flex items-center">
          {CASE_STUDIES.map((study, i) => (
            <button
              key={study.name}
              type="button"
              aria-label={`Go to case study ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
              onClick={() => scrollToIndex(i)}
              className="inline-flex size-10 items-center justify-center"
            >
              <span
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === activeIndex ? "size-2.5 bg-accent" : "size-2 bg-ink-faint/35"
                )}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Next case study"
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex === CASE_STUDIES.length - 1}
          className="inline-flex size-11 items-center justify-center rounded-full text-ink-faint transition-colors duration-200 hover:bg-ink/5 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowRight className="size-5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

/** Large layered "chip" emblem — four concentric rotated squares plus the
 * case's line-icon centered on top — the slider's big graphic, standing in
 * for the kind of stock/AI imagery a reference site would use here. The
 * innermost two rings pick up the card's rotating accent colour for extra
 * depth instead of a single flat accent ring. */
function CaseEmblem({
  Icon,
  ring,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  ring: string;
}) {
  return (
    <div className="relative flex size-[170px] max-h-full max-w-full items-center justify-center sm:size-[200px] lg:size-[230px]">
      <span className="absolute inset-0 rotate-45 rounded-[28px] border border-pale/10" />
      <span className="absolute inset-[12%] rotate-45 rounded-[24px] border border-pale/15" />
      <span className={cn("absolute inset-[24%] rotate-45 rounded-[20px] border", ring)} />
      <span className={cn("absolute inset-[36%] rotate-45 rounded-[14px] border", ring)} />
      <Icon className="relative size-12 text-pale/90 sm:size-14" strokeWidth={1.4} />
    </div>
  );
}
