"use client";

import { cn } from "@/lib/utils";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";

/**
 * Abstract architecture-line visual: a restrained lattice of nodes and
 * connecting paths suggesting network / infrastructure topology, never a
 * literal server-rack or robot illustration. Lines draw in once on mount;
 * nodes hold a slow, barely-there pulse. Fully inert when the visitor
 * prefers reduced motion.
 */
export function TechnicalGrid({ className }: { className?: string }) {
  const ref = useGsapContext<SVGSVGElement>(({ scope, prefersReducedMotion }) => {
    const paths = scope.querySelectorAll("path[data-line]");
    const nodes = scope.querySelectorAll("circle[data-node]");

    if (prefersReducedMotion) {
      gsap.set(paths, { opacity: 0.5 });
      gsap.set(nodes, { opacity: 1 });
      return;
    }

    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0.55 });
    });

    const tl = gsap.timeline({ delay: 0.6 });
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: "power2.inOut",
      stagger: 0.12,
    }).fromTo(
      nodes,
      { scale: 0, opacity: 0, transformOrigin: "center" },
      { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: "back.out(2)" },
      "-=1.2"
    );

    gsap.to(nodes, {
      opacity: 0.5,
      duration: 2.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.5, from: "random" },
      delay: 2.6,
    });
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 560 560"
      fill="none"
      aria-hidden
      className={cn("h-full w-full", className)}
    >
      <g stroke="currentColor" strokeWidth="1">
        <path data-line d="M60 460L200 340L200 180L340 60" />
        <path data-line d="M200 340L360 400L500 300" />
        <path data-line d="M200 180L360 220L500 120" />
        <path data-line d="M360 220L360 400" />
        <path data-line d="M500 120L500 300" />
        <path data-line d="M60 460L200 500L420 500L500 300" />
        <path data-line d="M340 60L420 500" opacity="0.4" />
      </g>
      <g fill="currentColor">
        <circle data-node cx="60" cy="460" r="4" />
        <circle data-node cx="200" cy="340" r="4" />
        <circle data-node cx="200" cy="180" r="4" />
        <circle data-node cx="340" cy="60" r="5" />
        <circle data-node cx="360" cy="400" r="4" />
        <circle data-node cx="360" cy="220" r="4" />
        <circle data-node cx="500" cy="300" r="4" />
        <circle data-node cx="500" cy="120" r="4" />
        <circle data-node cx="200" cy="500" r="3.5" />
        <circle data-node cx="420" cy="500" r="3.5" />
      </g>
    </svg>
  );
}
