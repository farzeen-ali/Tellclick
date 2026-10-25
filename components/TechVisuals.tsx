"use client";

import { cn } from "@/lib/utils";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";

/**
 * A small family of abstract, currentColor-driven technical illustrations —
 * network topology, data flow, a monitoring dashboard, cloud architecture —
 * used in place of stock photography throughout the site (hero, page
 * intros, section dividers). None are literal (no server racks, no robots):
 * each is a restrained line-and-node diagram that reads as "real
 * infrastructure" without dating the page or dominating it. All draw in
 * once on mount and hold a slow, barely-there pulse; fully inert under
 * prefers-reduced-motion.
 */

function drawPaths(paths: NodeListOf<Element> | Element[], prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    gsap.set(paths, { opacity: 1 });
    return;
  }
  paths.forEach((path) => {
    const length = (path as SVGPathElement).getTotalLength?.() ?? 0;
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
  });
  gsap.to(paths, {
    strokeDashoffset: 0,
    duration: 1.8,
    ease: "power2.inOut",
    stagger: 0.12,
    delay: 0.3,
  });
}

function popNodes(nodes: NodeListOf<Element> | Element[], prefersReducedMotion: boolean, delay = 0.9) {
  if (prefersReducedMotion) {
    gsap.set(nodes, { scale: 1, opacity: 1 });
    return;
  }
  gsap.fromTo(
    nodes,
    { scale: 0, opacity: 0, transformOrigin: "center" },
    { scale: 1, opacity: 1, duration: 0.5, stagger: 0.07, ease: "back.out(2)", delay }
  );
}

/** Horizontal data-flow diagram: two endpoint nodes exchanging data along a
 * routed line, with small packets animating along the path. Reads as
 * "systems talking to each other" — infrastructure/automation/AI. */
export function DataFlowVisual({ className }: { className?: string }) {
  const ref = useGsapContext<SVGSVGElement>(({ scope, prefersReducedMotion }) => {
    const paths = scope.querySelectorAll("[data-line]");
    const nodes = scope.querySelectorAll("[data-node]");
    const packets = scope.querySelectorAll<SVGCircleElement>("[data-packet]");

    drawPaths(paths, prefersReducedMotion);
    popNodes(nodes, prefersReducedMotion);

    if (prefersReducedMotion) {
      gsap.set(packets, { opacity: 0 });
      return;
    }

    packets.forEach((packet, i) => {
      const path = scope.querySelector<SVGPathElement>(`[data-packet-path="${i % 2}"]`);
      if (!path) return;
      const len = path.getTotalLength();
      gsap.set(packet, { opacity: 0 });
      gsap.to(packet, {
        opacity: 1,
        duration: 0.01,
        delay: 1.6 + i * 0.9,
      });
      const proxy = { d: 0 };
      gsap.to(proxy, {
        d: len,
        duration: 2.6,
        ease: "power1.inOut",
        repeat: -1,
        delay: 1.6 + i * 0.9,
        onUpdate: () => {
          const pt = path.getPointAtLength(proxy.d);
          gsap.set(packet, { attr: { cx: pt.x, cy: pt.y } });
        },
      });
    });
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 640 220"
      fill="none"
      aria-hidden
      className={cn("h-full w-full", className)}
    >
      <g stroke="currentColor" strokeWidth="1.3">
        <path data-line data-packet-path="0" d="M70 110H220C240 110 240 60 260 60H420" />
        <path data-line data-packet-path="1" d="M70 110H220C240 110 240 160 260 160H420" />
        <path data-line d="M420 60H560C575 60 575 110 570 110" opacity="0.55" />
        <path data-line d="M420 160H560C575 160 575 110 570 110" opacity="0.55" />
      </g>
      <g fill="currentColor">
        <circle data-packet r="4" opacity="0" />
        <circle data-packet r="4" opacity="0" />
      </g>
      <g>
        <rect data-node x="34" y="86" width="46" height="48" rx="6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <line x1="42" y1="98" x2="72" y2="98" stroke="currentColor" strokeWidth="1.3" />
        <line x1="42" y1="108" x2="72" y2="108" stroke="currentColor" strokeWidth="1.3" />
        <line x1="42" y1="118" x2="72" y2="118" stroke="currentColor" strokeWidth="1.3" />

        <rect data-node x="420" y="36" width="46" height="48" rx="6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="443" cy="60" r="9" fill="none" stroke="currentColor" strokeWidth="1.3" />

        <rect data-node x="420" y="136" width="46" height="48" rx="6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M432 168l7-14 6 8 8-12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />

        <circle data-node cx="570" cy="110" r="12" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle data-node cx="570" cy="110" r="4" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Abstract monitoring / analytics dashboard: a window frame containing a
 * bar chart, a trend line and two stat tiles. Reads as "operational
 * visibility" — automation, security monitoring, AI. */
export function DashboardVisual({ className }: { className?: string }) {
  const ref = useGsapContext<SVGSVGElement>(({ scope, prefersReducedMotion }) => {
    const bars = scope.querySelectorAll("[data-bar]");
    const line = scope.querySelectorAll("[data-trend]");
    const nodes = scope.querySelectorAll("[data-node]");

    drawPaths(line, prefersReducedMotion);
    popNodes(nodes, prefersReducedMotion, 1.1);

    if (prefersReducedMotion) {
      gsap.set(bars, { scaleY: 1 });
      return;
    }
    gsap.set(bars, { scaleY: 0, transformOrigin: "bottom" });
    gsap.to(bars, { scaleY: 1, duration: 0.7, stagger: 0.08, ease: "power2.out", delay: 0.3 });
  }, []);

  const barHeights = [26, 44, 34, 58, 40, 50];

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 340"
      fill="none"
      aria-hidden
      className={cn("h-full w-full", className)}
    >
      <rect x="1" y="1" width="478" height="338" rx="10" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
      <line x1="1" y1="42" x2="479" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="24" cy="21" r="4" fill="currentColor" opacity="0.5" />
      <circle cx="40" cy="21" r="4" fill="currentColor" opacity="0.35" />
      <circle cx="56" cy="21" r="4" fill="currentColor" opacity="0.2" />

      {/* bar chart, bottom-left */}
      <g transform="translate(36 260)">
        {barHeights.map((h, i) => (
          <rect
            key={i}
            data-bar
            x={i * 32}
            y={-h}
            width="18"
            height={h}
            rx="2"
            fill="currentColor"
            opacity={0.28 + i * 0.09}
          />
        ))}
      </g>

      {/* trend line, top-right */}
      <g transform="translate(250 70)">
        <path
          data-trend
          d="M0 70 L30 46 L60 58 L90 20 L120 34 L150 6 L180 18"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle data-node cx="180" cy="18" r="4.5" fill="currentColor" />
      </g>

      {/* stat tiles */}
      <g transform="translate(250 190)">
        <rect x="0" y="0" width="90" height="56" rx="6" stroke="currentColor" strokeWidth="1" opacity="0.45" />
        <rect x="12" y="16" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
        <rect x="12" y="30" width="24" height="6" rx="3" fill="currentColor" opacity="0.3" />

        <rect x="102" y="0" width="90" height="56" rx="6" stroke="currentColor" strokeWidth="1" opacity="0.45" />
        <rect x="114" y="16" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
        <rect x="114" y="30" width="24" height="6" rx="3" fill="currentColor" opacity="0.3" />
      </g>
    </svg>
  );
}

/** Cloud + connected infrastructure nodes: a simple cloud outline with
 * lines descending to three system nodes. Reads as "cloud architecture". */
export function CloudArchitectureVisual({ className }: { className?: string }) {
  const ref = useGsapContext<SVGSVGElement>(({ scope, prefersReducedMotion }) => {
    const paths = scope.querySelectorAll("[data-line]");
    const nodes = scope.querySelectorAll("[data-node]");
    const cloud = scope.querySelectorAll("[data-cloud]");

    drawPaths([...paths, ...cloud], prefersReducedMotion);
    popNodes(nodes, prefersReducedMotion, 1.0);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 380"
      fill="none"
      aria-hidden
      className={cn("h-full w-full", className)}
    >
      <path
        data-cloud
        d="M150 130c-24 0-44 18-47 41-19 4-33 21-33 42 0 23 19 42 42 42h226c25 0 46-20 46-46 0-22-16-40-37-45 1-3 1-7 1-10 0-30-24-54-54-54-21 0-39 12-48 30-6-6-15-30-38-0z"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.8"
      />
      <g stroke="currentColor" strokeWidth="1.3">
        <path data-line d="M160 255V300" />
        <path data-line d="M260 255V300" />
        <path data-line d="M360 255V300" />
      </g>
      <g>
        <rect data-node x="128" y="300" width="64" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <line x1="140" y1="316" x2="180" y2="316" stroke="currentColor" strokeWidth="1.2" />
        <line x1="140" y1="326" x2="180" y2="326" stroke="currentColor" strokeWidth="1.2" />
        <line x1="140" y1="336" x2="168" y2="336" stroke="currentColor" strokeWidth="1.2" />

        <circle data-node cx="260" cy="325" r="25" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M248 325a12 12 0 0 1 24 0" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="260" cy="330" r="3" fill="currentColor" />

        <rect data-node x="328" y="300" width="64" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M342 336l9-16 7 9 9-13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/**
 * Thin full-width horizontal divider used between sections in place of a
 * photographic banner: a routed line touching a handful of nodes, evenly
 * spaced. Purely decorative, aria-hidden.
 */
const DIVIDER_DOT_COUNT = 5;

/**
 * The line draws in once, then a handful of dots travel continuously along
 * its full length (looping seamlessly), each read off the path itself via
 * getPointAtLength every frame — so a dot's position can never drift off
 * the line the way a hand-typed {cx, cy} pair previously did (one node
 * used to sit above the path's actual dip instead of on it). Reduced
 * motion gets the same real path-derived positions, evenly spaced and
 * held still, instead of travelling.
 */
export function DataFlowDivider({ className }: { className?: string }) {
  const ref = useGsapContext<SVGSVGElement>(({ scope, prefersReducedMotion }) => {
    const path = scope.querySelector<SVGPathElement>("[data-line]");
    const dots = scope.querySelectorAll<SVGCircleElement>("[data-node]");
    if (!path) return;

    const length = path.getTotalLength();

    if (prefersReducedMotion) {
      gsap.set(path, { opacity: 1 });
      dots.forEach((dot, i) => {
        const pt = path.getPointAtLength((length / dots.length) * i);
        gsap.set(dot, { opacity: 1, attr: { cx: pt.x, cy: pt.y } });
      });
      return;
    }

    drawPaths([path], false);

    dots.forEach((dot, i) => {
      const proxy = { d: (length / dots.length) * i };
      gsap.set(dot, { opacity: 0 });
      gsap.to(dot, { opacity: 1, duration: 0.4, delay: 1.6 });
      gsap.to(proxy, {
        d: proxy.d + length,
        duration: 7,
        ease: "none",
        repeat: -1,
        delay: 1.6,
        onUpdate: () => {
          const d = proxy.d % length;
          const pt = path.getPointAtLength(d);
          gsap.set(dot, { attr: { cx: pt.x, cy: pt.y } });
        },
      });
    });
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 80"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-full w-full", className)}
    >
      <defs>
        {/* Same cyan-to-violet blend as the sector bubbles below it, so the
            divider reads as part of the same colour family rather than a
            flat cyan line. */}
        <linearGradient id="dataFlowGradient" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-cyan)" />
          <stop offset="100%" stopColor="var(--color-violet)" />
        </linearGradient>
      </defs>
      <path
        data-line
        d="M0 40C50 20 150 20 200 40C250 60 350 60 400 40C450 20 550 20 600 40C650 60 750 60 800 40C850 20 950 20 1000 40C1050 60 1150 60 1200 40"
        stroke="url(#dataFlowGradient)"
        strokeWidth="1.8"
      />
      {Array.from({ length: DIVIDER_DOT_COUNT }).map((_, i) => (
        <circle key={i} data-node r="5.5" fill="url(#dataFlowGradient)" opacity="0" />
      ))}
    </svg>
  );
}

const SIGNAL_HUB_CENTER = { x: 240, y: 190 };
const SIGNAL_HUB_RADIUS = 140;
const SIGNAL_HUB_ANGLES = [0, 60, 120, 180, 240, 300];
const SIGNAL_HUB_POINTS = SIGNAL_HUB_ANGLES.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: SIGNAL_HUB_CENTER.x + SIGNAL_HUB_RADIUS * Math.cos(rad),
    y: SIGNAL_HUB_CENTER.y + SIGNAL_HUB_RADIUS * Math.sin(rad),
  };
});

/**
 * "Signal hub": a central node broadcasting outward on six spokes to
 * alternating circle/square satellite nodes, with radar-style pulse rings
 * expanding from the centre — the site's own "Open Signal" brand mark,
 * reinterpreted as a diagram. Deliberately radial/circular rather than the
 * horizontal or diagonal compositions used by every other visual in this
 * file, so the homepage hero — the first thing a visitor sees — reads as
 * distinct from the page-intro diagrams rather than a repeat of one.
 */
export function SignalHubVisual({ className }: { className?: string }) {
  const ref = useGsapContext<SVGSVGElement>(({ scope, prefersReducedMotion }) => {
    const spokes = scope.querySelectorAll("[data-line]");
    const nodes = scope.querySelectorAll("[data-node]");
    const rings = scope.querySelectorAll<SVGCircleElement>("[data-ring]");

    drawPaths(spokes, prefersReducedMotion);
    popNodes(nodes, prefersReducedMotion, 0.9);

    if (prefersReducedMotion) {
      gsap.set(rings, { opacity: 0.3, scale: 1 });
      return;
    }

    gsap.set(rings, { transformOrigin: "center", scale: 0.6, opacity: 0 });
    rings.forEach((ring, i) => {
      gsap.fromTo(
        ring,
        { scale: 0.6, opacity: 0.55 },
        {
          scale: 1.35,
          opacity: 0,
          duration: 2.6,
          ease: "power1.out",
          repeat: -1,
          delay: 1.4 + i * 0.85,
        }
      );
    });
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 360"
      fill="none"
      aria-hidden
      className={cn("h-full w-full", className)}
    >
      <g stroke="currentColor" strokeWidth="1">
        <circle data-ring cx={SIGNAL_HUB_CENTER.x} cy={SIGNAL_HUB_CENTER.y} r="40" />
        <circle data-ring cx={SIGNAL_HUB_CENTER.x} cy={SIGNAL_HUB_CENTER.y} r="40" />
        <circle data-ring cx={SIGNAL_HUB_CENTER.x} cy={SIGNAL_HUB_CENTER.y} r="40" />
      </g>

      <g stroke="currentColor" strokeWidth="1.2">
        {SIGNAL_HUB_POINTS.map((p, i) => (
          <path
            key={i}
            data-line
            d={`M${SIGNAL_HUB_CENTER.x} ${SIGNAL_HUB_CENTER.y}L${p.x.toFixed(1)} ${p.y.toFixed(1)}`}
          />
        ))}
      </g>

      <g strokeWidth="1.4" stroke="currentColor">
        {SIGNAL_HUB_POINTS.map((p, i) =>
          i % 2 === 0 ? (
            <circle key={i} data-node cx={p.x} cy={p.y} r="7" fill="none" />
          ) : (
            <rect key={i} data-node x={p.x - 7} y={p.y - 7} width="14" height="14" rx="3" fill="none" />
          )
        )}
      </g>

      <circle
        data-node
        cx={SIGNAL_HUB_CENTER.x}
        cy={SIGNAL_HUB_CENTER.y}
        r="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle data-node cx={SIGNAL_HUB_CENTER.x} cy={SIGNAL_HUB_CENTER.y} r="5" fill="currentColor" />
    </svg>
  );
}

/**
 * Ascending "growth path": a stepped staircase line rising left to right
 * with a milestone node at each tread, a dashed timeline baseline with
 * tick marks underneath, and a ringed marker + upward arrow at the peak.
 * Deliberately a different silhouette from the rest of the family (every
 * other visual here reads left-to-right/horizontal; this one climbs
 * diagonally), used specifically on the About page — "experience built
 * over time" — so it doesn't read as a repeat of the flow/cloud/dashboard
 * diagrams used elsewhere.
 */
export function GrowthPathVisual({ className }: { className?: string }) {
  const ref = useGsapContext<SVGSVGElement>(({ scope, prefersReducedMotion }) => {
    const lines = scope.querySelectorAll("[data-line]");
    const baseline = scope.querySelectorAll("[data-baseline]");
    const nodes = scope.querySelectorAll("[data-node]");

    drawPaths([...baseline, ...lines], prefersReducedMotion);
    popNodes(nodes, prefersReducedMotion, 1.1);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 380"
      fill="none"
      aria-hidden
      className={cn("h-full w-full", className)}
    >
      <g stroke="currentColor" strokeWidth="1" opacity="0.35">
        <path data-baseline d="M30 340H490" strokeDasharray="1 7" strokeLinecap="round" />
      </g>
      <g stroke="currentColor" strokeWidth="1" opacity="0.3">
        {[70, 150, 230, 310, 390, 470].map((x) => (
          <line key={x} x1={x} y1="336" x2={x} y2="344" />
        ))}
      </g>

      <path
        data-line
        d="M50 310H140V250H230V190H320V130H410V70H460"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g fill="currentColor">
        <circle data-node cx="50" cy="310" r="4" />
        <circle data-node cx="140" cy="250" r="4" />
        <circle data-node cx="230" cy="190" r="4" />
        <circle data-node cx="320" cy="130" r="4" />
      </g>

      {/* peak marker: ringed node + small upward arrow, marking the
          current/leading edge of the climb */}
      <g>
        <circle data-node cx="460" cy="70" r="11" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle data-node cx="460" cy="70" r="3.5" fill="currentColor" />
        <path
          data-line
          d="M460 46V30M460 30l-8 8M460 30l8 8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** Very subtle full-bleed dot-grid, used as a low-opacity backdrop on solid
 * navy chrome sections in place of a photographic image. */
export function DotGridBackdrop({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="tc-dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tc-dot-grid)" />
    </svg>
  );
}
