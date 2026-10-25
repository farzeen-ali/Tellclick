"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Server,
  Layers,
  ShieldCheck,
  Cloud,
  Workflow,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { revealFrom, revealTo } from "@/lib/animations/motion";
import { PROGRESSION_STAGES, type ProgressionStage } from "@/lib/data/progression";
import { useHorizontalSwipe } from "@/lib/useHorizontalSwipe";
import { SectionHeading } from "./SectionHeading";
import { LogoMark } from "./Logo";

export function Progression() {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const dragState = React.useRef<{
    startX: number;
    startScroll: number;
    dragging: boolean;
    captured: boolean;
  }>({
    startX: 0,
    startScroll: 0,
    dragging: false,
    captured: false,
  });
  const suppressClickRef = React.useRef(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const gridRef = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const cards = scope.querySelectorAll("[data-progression-card]");
    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(cards, revealFrom);
    gsap.to(cards, {
      ...revealTo,
      stagger: 0.06,
      scrollTrigger: { trigger: scope, start: "top 80%" },
    });
  }, []);

  const updateScrollState = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  useHorizontalSwipe(trackRef, { align: "start", suppressClickRef });

  const scrollByAmount = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-progression-card]");
    const styles = window.getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap) || 20;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  // Mouse drag-to-swipe, so desktop visitors without a touchpad can still
  // pull the row left/right, not just touch or trackpad users.
  //
  // Pointer capture is deliberately NOT taken on pointerdown. Chromium
  // retargets the trailing "click" event to whichever element is holding
  // pointer capture at release time — if we captured immediately, every
  // ordinary click (down + up with ~0 movement) would get its click event
  // retargeted to the track div instead of the card, and cards would stop
  // flipping entirely. Capture is only engaged once real drag movement
  // (>6px) is detected, so a plain click never captures and reaches the
  // card's onClick normally.
  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || e.pointerType === "touch") return; // native touch scrolling handles swipe
    dragState.current = { startX: e.clientX, startScroll: el.scrollLeft, dragging: true, captured: false };
    suppressClickRef.current = false;
    setIsDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !dragState.current.dragging) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 6) {
      suppressClickRef.current = true;
      if (!dragState.current.captured) {
        dragState.current.captured = true;
        el.style.scrollSnapType = "none";
        el.setPointerCapture(e.pointerId);
      }
    }
    el.scrollLeft = dragState.current.startScroll - delta;
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    setIsDragging(false);
    if (dragState.current.captured) {
      dragState.current.captured = false;
      if (trackRef.current) {
        trackRef.current.style.scrollSnapType = "";
        try {
          trackRef.current.releasePointerCapture(e.pointerId);
        } catch {
          /* The pointer can already be gone by the time pointerup arrives. */
        }
      }
    }
    // suppressClickRef stays true through the trailing click (if any) so
    // FlipCard's toggle() ignores it; FlipCard resets the ref back to
    // false once it has consumed (or ignored) that click.
  };

  return (
    <section className="relative bg-paper pt-20 pb-10 lg:pt-24 lg:pb-14">
      <div className="mx-auto w-full max-w-(--container-page) px-6 lg:px-10">
        <SectionHeading
          eyebrow="The Progression"
          title="Technology changes. Operational discipline does not."
          subtitle="Tellclick's history mirrors the evolution of enterprise technology: from physical infrastructure and Windows environments, through virtualization and security, into cloud, automation and now applied artificial intelligence."
        />

        <div
          ref={gridRef}
          className="mt-12 lg:mt-14"
        >
          <div className="flex items-center gap-4 lg:gap-5">
            <CarouselArrowButton
              direction="left"
              onClick={() => scrollByAmount(-1)}
              disabled={!canScrollLeft}
            />

            <div
              ref={trackRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
              className="touch-carousel no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch] lg:gap-6"
              style={{ cursor: isDragging ? "grabbing" : undefined }}
            >
              {PROGRESSION_STAGES.map((stage, i) => (
                <FlipCard
                  key={stage.label}
                  stage={stage}
                  index={i}
                  suppressClickRef={suppressClickRef}
                />
              ))}
            </div>

            <CarouselArrowButton
              direction="right"
              onClick={() => scrollByAmount(1)}
              disabled={!canScrollRight}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 lg:hidden">
          <p className="text-xs text-ink-faint">Swipe to see all six stages</p>
          <div className="flex items-center gap-2">
            <CarouselArrowButton
              direction="left"
              onClick={() => scrollByAmount(-1)}
              disabled={!canScrollLeft}
              placement="inline"
            />
            <CarouselArrowButton
              direction="right"
              onClick={() => scrollByAmount(1)}
              disabled={!canScrollRight}
              placement="inline"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function useMediaQuery(query: string, serverFallback: boolean) {
  return React.useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback
  );
}

/**
 * Circular prev/next control for the progression carousel. The hover
 * "bubble" — a navy circle that expands from the cursor's entry point,
 * synchronized with an icon colour crossfade — mirrors the exact mechanic
 * BubbleButton.tsx already uses for the site's CTAs, so the interaction
 * language stays consistent; it just falls back to the plain colour
 * transition under prefers-reduced-motion, same as BubbleButton does.
 */
function CarouselArrowButton({
  direction,
  onClick,
  disabled,
  placement = "side",
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  placement?: "side" | "inline";
}) {
  const rootRef = React.useRef<HTMLButtonElement>(null);
  const bubbleRef = React.useRef<HTMLSpanElement>(null);
  const iconRef = React.useRef<HTMLSpanElement>(null);
  const reducedMotion = React.useRef(false);

  React.useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const originFromEvent = (e: React.MouseEvent) => {
    const el = rootRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleEnter = (e: React.MouseEvent) => {
    const el = rootRef.current;
    const bubble = bubbleRef.current;
    if (!el || !bubble) return;
    const { x, y } = originFromEvent(e);
    const size = Math.max(el.offsetWidth, el.offsetHeight) * 2.2;

    if (reducedMotion.current) {
      gsap.to(bubble, { opacity: 1, duration: 0.15 });
      gsap.to(iconRef.current, { color: "#f7fbfc", duration: 0.15 });
      return;
    }

    gsap.killTweensOf(bubble);
    gsap.set(bubble, { left: x, top: y, width: size, height: size, xPercent: -50, yPercent: -50 });
    gsap.fromTo(bubble, { scale: 0, opacity: 1 }, { scale: 1, duration: 0.55, ease: "power3.out" });
    gsap.to(iconRef.current, { color: "#f7fbfc", duration: 0.35, ease: "power2.out" });
  };

  const handleLeave = (e: React.MouseEvent) => {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    const { x, y } = originFromEvent(e);

    if (reducedMotion.current) {
      gsap.to(bubble, { opacity: 0, duration: 0.15 });
      gsap.to(iconRef.current, { color: "", duration: 0.15 });
      return;
    }

    gsap.killTweensOf(bubble);
    gsap.to(bubble, { left: x, top: y, scale: 0, duration: 0.4, ease: "power2.in" });
    gsap.to(iconRef.current, { color: "", duration: 0.3, ease: "power2.out" });
  };

  const Icon = direction === "left" ? ArrowLeft : ArrowRight;

  return (
    <button
      ref={rootRef}
      type="button"
      aria-label={direction === "left" ? "Scroll progression left" : "Scroll progression right"}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      disabled={disabled}
      className={cn(
        "relative size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-charcoal/55 bg-surface text-charcoal shadow-sm transition-colors duration-300 disabled:pointer-events-none disabled:opacity-30 dark:border-white/35 dark:text-white",
        placement === "side" ? "hidden lg:inline-flex" : "inline-flex"
      )}
    >
      <span
        ref={bubbleRef}
        aria-hidden
        className="pointer-events-none absolute rounded-full bg-charcoal opacity-0"
        style={{ willChange: "transform" }}
      />
      <span ref={iconRef} className="relative z-10 inline-flex">
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------------
 * Artwork for the progression cards. Enterprise redesign: dropped the
 * previous full-bleed photograph + hand-drawn leaf/petal/grass motifs in
 * favour of a single line-icon and a rotating accent colour drawn from
 * the Tellclick Technology Color System — each stage in the six-part
 * progression reads as its own "chip" in a coordinated set instead of
 * six identical grey cards. The front face's oversized numeral was later
 * swapped for a low-poly blue/violet mesh photo, and the back face's own
 * oversized numeral was removed too — both sides now read on the icon,
 * label and (front) art alone.
 * ------------------------------------------------------------------- */

const STAGE_ICONS = [Server, Layers, ShieldCheck, Cloud, Workflow, Cpu];

const CARD_ACCENTS = [
  { ring: "border-cyan/40 text-cyan", glow: "bg-cyan/25", chip: "bg-cyan" },
  { ring: "border-violet/40 text-violet", glow: "bg-violet/25", chip: "bg-violet" },
  { ring: "border-coral/40 text-coral", glow: "bg-coral/25", chip: "bg-coral" },
];

function CardArt({ index, side }: { index: number; side: "front" | "back" }) {
  const Icon = STAGE_ICONS[index % STAGE_ICONS.length];
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  if (side === "front") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
        {/* Low-poly blue/violet mesh photo, masked to fade into the card's
            white surface before the bottom third where the heading sits. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 38%, transparent 78%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 38%, transparent 78%)",
          }}
        >
          <Image
            src="/images/progression-mesh.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 78vw"
            className="object-cover img-bluegray"
          />
        </div>

        <div className="absolute inset-0 flex items-start justify-end p-7 sm:p-8">
          <span className={cn("flex size-10 items-center justify-center rounded-full border bg-surface/70 backdrop-blur-sm", accent.ring)}>
            <Icon className="size-4.5" strokeWidth={1.6} />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
      <div className="absolute inset-0 flex items-center justify-center text-pale/[0.06]">
        <LogoMark className="h-28 w-28 sm:h-36 sm:w-36" />
      </div>

      <div className="absolute inset-0 flex items-start justify-end p-7 sm:p-8">
        <span className="flex size-10 items-center justify-center rounded-full border border-pale/25 text-pale">
          <Icon className="size-4.5" strokeWidth={1.6} />
        </span>
      </div>
    </div>
  );
}

function FlipCard({
  stage,
  index,
  suppressClickRef,
}: {
  stage: ProgressionStage;
  index: number;
  suppressClickRef: React.RefObject<boolean>;
}) {
  const [flipped, setFlipped] = React.useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", false);

  const toggle = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setFlipped((v) => !v);
  };

  return (
    <div
      data-progression-card
      data-carousel-card
      className="group w-[78vw] max-w-[300px] shrink-0 snap-start [perspective:1600px] sm:w-[300px] lg:w-[calc((100%_-_48px)/3)] lg:max-w-none"
      style={{ aspectRatio: "4 / 5" }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${stage.label} — press to see details`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className={cn(
          "flip-inner relative h-full w-full cursor-pointer select-none outline-none [transform-style:preserve-3d] transition-transform [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          reducedMotion ? "duration-0" : "duration-700"
        )}
        style={flipped ? { transform: "rotateY(180deg)" } : undefined}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col justify-end overflow-hidden rounded-sm border border-hairline border-t-2 bg-surface p-7 [backface-visibility:hidden] sm:p-8"
          style={{ borderTopColor: `var(--color-${["cyan", "violet", "coral"][index % 3]})` }}
        >
          <CardArt index={index} side="front" />
          <div className="relative z-10">
            <h3 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              {stage.label}
            </h3>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col justify-center overflow-hidden rounded-sm flip-back p-7 [backface-visibility:hidden] sm:p-8"
          style={{ transform: "rotateY(180deg)" }}
        >
          <CardArt index={index} side="back" />
          {/* Plain navbar-navy face with only a fine inner hairline. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-white/10"
          />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
              <span className={cn("size-1.5 rounded-full", CARD_ACCENTS[index % CARD_ACCENTS.length].chip)} />
              {stage.label}
            </span>
            <span aria-hidden className="mt-3 block h-px w-12 bg-gradient-to-r from-[#bde8f6] to-[#c9b8fa]" />
            <p className="mt-4 text-sm font-semibold leading-relaxed text-white sm:text-base">
              {stage.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
