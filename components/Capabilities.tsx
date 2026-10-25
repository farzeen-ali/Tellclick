"use client";

import Link from "next/link";
import { Server, Cloud, ShieldCheck, Workflow, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { revealFrom, revealTo } from "@/lib/animations/motion";
import { CAPABILITIES, type Capability } from "@/lib/data/capabilities";
import { SectionHeading } from "./SectionHeading";
import { BubbleButton } from "./BubbleButton";

const CAP_ICONS = [Server, Cloud, ShieldCheck, Workflow, Cpu];

// Every card shares the same cyan ("technology") accent from the Tellclick
// Technology Color System — a light blue tint at rest that steps up to a
// denser, darker wash on hover, rather than swapping hue per card.
const CAP_ACCENT = {
  text: "text-cyan",
  border: "border-cyan/30",
  // The card itself is both the "group" and the hovered element, so its
  // own bg/border changes use the plain `hover:` variant — `group-hover:`
  // only fires on a *descendant* of the hovered element, not on itself.
  hoverBorder: "hover:border-cyan/70",
  baseBg: "bg-cyan/[0.05]",
  hoverBg: "hover:bg-cyan/[0.16]",
  iconRing: "border-cyan/30 text-cyan",
  hoverIconRing: "group-hover:border-cyan/60",
};

export function Capabilities() {
  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const panels = scope.querySelectorAll("[data-capability]");
    if (prefersReducedMotion) {
      gsap.set(panels, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(panels, revealFrom);
    gsap.to(panels, {
      ...revealTo,
      stagger: 0.05,
      scrollTrigger: { trigger: scope, start: "top 78%" },
    });
  }, []);

  const firstRow = CAPABILITIES.slice(0, 3);
  const secondRow = CAPABILITIES.slice(3);

  return (
    <section className="relative overflow-hidden bg-paper py-20 lg:py-24">
      <div className="relative mx-auto max-w-(--container-page) px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Capabilities"
            title="Five disciplines behind the history."
          />
          <div className="lg:pb-2">
            <BubbleButton href="/capabilities" variant="secondary">
              View All Capabilities
            </BubbleButton>
          </div>
        </div>

        {/* Product-card grid: three across on top, the remaining two
            centered beneath — same card treatment and the same "light
            tint at rest, deepen on hover" behaviour throughout. */}
        <div ref={ref} className="mt-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {firstRow.map((cap, i) => (
              <div
                key={cap.index}
                // In the two-column (tablet) layout the third card would sit
                // alone on the left; span both columns and centre it at one
                // column's width so it lands in the middle instead.
                className={
                  i === 2
                    ? "sm:col-span-2 sm:w-[calc((100%-1.5rem)/2)] sm:justify-self-center lg:col-span-1 lg:w-auto lg:justify-self-stretch"
                    : undefined
                }
              >
                <CapabilityCard cap={cap} index={i} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            {secondRow.map((cap, i) => (
              <div
                key={cap.index}
                className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              >
                <CapabilityCard cap={cap} index={i + 3} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({ cap, index }: { cap: Capability; index: number }) {
  const accent = CAP_ACCENT;
  const Icon = CAP_ICONS[index % CAP_ICONS.length];

  return (
    <Link
      href="/capabilities"
      data-capability
      className={cn(
        "group flex h-full flex-col rounded-3xl border p-7 transition-colors duration-500",
        accent.border,
        accent.hoverBorder,
        accent.baseBg,
        accent.hoverBg
      )}
    >
      <span
        className={cn(
          "flex size-14 shrink-0 items-center justify-center rounded-2xl border bg-surface transition-colors duration-500",
          accent.iconRing,
          accent.hoverIconRing
        )}
      >
        <Icon className="size-6" strokeWidth={1.6} />
      </span>

      <h3 className="mt-5 font-display text-xl font-medium tracking-tight text-ink">
        {cap.name}
      </h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">
        Discipline {cap.index}
      </p>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-soft">
        {cap.description}
      </p>

      <span
        className={cn(
          "mt-6 text-sm font-semibold underline-offset-4 transition-colors duration-500 group-hover:underline",
          accent.text
        )}
      >
        View
      </span>
    </Link>
  );
}
