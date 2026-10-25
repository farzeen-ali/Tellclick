/**
 * Homepage hero visual: three translucent glass panes stacked in depth — a
 * blue-gray one at the back, a lavender one in the middle and a muted-teal
 * one in front — pierced by a single thin light line and ringed by faint
 * orbit curves. Redrawn as vector art from the approved glass-panes concept
 * in the Blue-Gray + Lavender palette (lavender leads, teal stays a small
 * accent). It fills the hero's visual panel in place of the earlier visuals;
 * the panel itself supplies the border, beam and entrance fade.
 */

type Pt = [number, number];

// Closed polygon with softly rounded corners (quadratic bends of radius r).
function roundedPoly(pts: Pt[], r: number) {
  const n = pts.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = pts[(i + n - 1) % n];
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const toward = (a: Pt, b: Pt): Pt => {
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const k = Math.min(r, len / 2) / len;
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    };
    const a = toward(cur, prev);
    const b = toward(cur, next);
    d += `${i === 0 ? "M" : "L"}${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${cur[0]} ${cur[1]} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

// Three identical panes stepped by the same offset (STEP_X, STEP_Y) so the
// gap between back/middle and middle/front is exactly equal.
const PANE_W = 246;
const PANE_SKEW = 140;
const PANE_H = 303;
const STEP_X = 84;
const STEP_Y = 58;
const pane = (x: number, y: number) =>
  roundedPoly([[x, y], [x + PANE_W, y + PANE_SKEW], [x + PANE_W, y + PANE_SKEW + PANE_H], [x, y + PANE_H]], 16);
const MID_X = 352;
const MID_Y = 135;
const BACK = pane(MID_X + STEP_X, MID_Y - STEP_Y);
const MIDDLE = pane(MID_X, MID_Y);
const FRONT = pane(MID_X - STEP_X, MID_Y + STEP_Y);

export function HeroGlass({ className }: { className?: string }) {
  return (
    <svg
      viewBox="20 30 840 650"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="hgBack" x1="436" y1="77" x2="682" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--hg-back-a)" stopOpacity="0.48" />
          <stop offset="1" stopColor="var(--hg-back-b)" stopOpacity="0.36" />
        </linearGradient>
        <linearGradient id="hgMiddle" x1="352" y1="135" x2="598" y2="578" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--hg-mid-a)" stopOpacity="0.56" />
          <stop offset="0.55" stopColor="var(--hg-mid-b)" stopOpacity="0.62" />
          <stop offset="1" stopColor="var(--hg-mid-c)" stopOpacity="0.52" />
        </linearGradient>
        <radialGradient id="hgMiddleGlow" cx="410" cy="380" r="170" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--hg-glow)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--hg-glow)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hgFront" x1="268" y1="193" x2="514" y2="636" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--hg-front-a)" stopOpacity="0.52" />
          <stop offset="0.6" stopColor="var(--hg-front-b)" stopOpacity="0.44" />
          <stop offset="1" stopColor="var(--hg-front-c)" stopOpacity="0.36" />
        </linearGradient>
        <linearGradient id="hgLine" x1="20" y1="640" x2="825" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--hg-line-a)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--hg-line-b)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--hg-line-c)" stopOpacity="0.95" />
        </linearGradient>
        <filter id="hgBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {/* faint orbit curves behind everything */}
      <g stroke="var(--hg-orbit)" strokeWidth="1.3" strokeLinecap="round" opacity="0.4">
        <path d="M335 215C205 255 100 340 135 410C165 470 250 490 330 470" />
        <path d="M548 62C680 50 790 100 800 230C810 330 780 400 700 450" />
        <path d="M690 345C790 380 850 450 820 520C790 600 650 650 560 650" />
        <path d="M235 485C320 540 420 590 500 640" opacity="0.6" />
      </g>

      {/* soft lavender glow behind the middle pane */}
      <path d={MIDDLE} fill="var(--hg-mid-a)" opacity="0.35" filter="url(#hgBlur)" />

      <path d={BACK} fill="url(#hgBack)" />
      <path d={BACK} stroke="var(--hg-stroke-back)" strokeOpacity="0.6" strokeWidth="2" strokeLinejoin="round" />

      <path d={MIDDLE} fill="url(#hgMiddle)" />
      <path d={MIDDLE} fill="url(#hgMiddleGlow)" />
      <path d={MIDDLE} stroke="var(--hg-glow)" strokeOpacity="0.8" strokeWidth="2.4" strokeLinejoin="round" />

      <path d={FRONT} fill="url(#hgFront)" />
      <path d={FRONT} stroke="var(--hg-stroke-front)" strokeOpacity="0.65" strokeWidth="2" strokeLinejoin="round" />

      {/* single piercing light line with a spark at its end */}
      <path d="M20 640L825 95" stroke="url(#hgLine)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="822" cy="96" r="5" fill="var(--hg-spark)" opacity="0.95" />
      <circle cx="822" cy="96" r="12" fill="var(--hg-glow)" opacity="0.25" />

      <circle cx="197" cy="182" r="2.4" fill="var(--hg-dot-a)" opacity="0.7" />
      <circle cx="851" cy="425" r="3" fill="var(--hg-dot-b)" opacity="0.75" />
    </svg>
  );
}
