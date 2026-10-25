/**
 * Homepage hero visual: the flowing blue-gray -> lavender ribbon wave from the
 * approved reference concept, redrawn as vector artwork. It sits in the hero's
 * visual panel in place of the old raster illustration (the panel supplies the
 * border, beam and entrance fade, so none of that changes here).
 *
 * Structure, following the reference: a diagonal soft-blue sheet rises from
 * the lower left to a crest, a lavender ribbon continues over the crest and
 * sweeps down to the right edge, a fainter lavender sheet trails below it,
 * and a few hairline arcs outline the translucent layers. Each sheet is a
 * centre line plus a width profile, drawn as a few stacked, slightly narrower
 * copies so its edges feather out like glass. Geometry is generated once at
 * module load (deterministic, so server and client markup match). Colours are
 * fixed blue-gray / lavender stops from the theme palette.
 */

type Pt = [number, number];

// Catmull-Rom spline point between p1 and p2 at t (0..1).
function spline(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t;
  const t3 = t2 * t;
  const at = (k: 0 | 1) =>
    0.5 *
    (2 * p1[k] +
      (-p0[k] + p2[k]) * t +
      (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
      (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
  return [at(0), at(1)];
}

function sample(pts: Pt[], per = 10): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p3 = pts[i + 2] ?? pts[i + 1];
    for (let s = 0; s < per; s++) out.push(spline(p0, pts[i], pts[i + 1], p3, s / per));
  }
  out.push(pts[pts.length - 1]);
  return out;
}

const fmt = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
const polyline = (pts: Pt[]) => `M${pts.map(fmt).join("L")}`;

interface Sheet {
  centre: Pt[];
  widths: number[];
}

// Top and bottom edge of a sheet: the centre line pushed out along its normal
// by half the (interpolated) width, scaled by `factor`.
function edges(sheet: Sheet, factor: number) {
  const c = sample(sheet.centre);
  const w = sample(sheet.widths.map((x): Pt => [x, 0])).map((p) => p[0]);
  const top: Pt[] = [];
  const bottom: Pt[] = [];
  for (let i = 0; i < c.length; i++) {
    const a = c[Math.max(i - 1, 0)];
    const b = c[Math.min(i + 1, c.length - 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    const h = (w[i] * factor) / 2;
    top.push([c[i][0] + nx * h, c[i][1] + ny * h]);
    bottom.push([c[i][0] - nx * h, c[i][1] - ny * h]);
  }
  return { top, bottom };
}

function sheetFill(sheet: Sheet, factor: number) {
  const { top, bottom } = edges(sheet, factor);
  return `${polyline(top)}L${polyline(bottom.reverse()).slice(1)}Z`;
}

function sheetEdges(sheet: Sheet): [string, string] {
  const { top, bottom } = edges(sheet, 1);
  return [polyline(top), polyline(bottom)];
}

const BLUE: Sheet = {
  centre: [[100, 368], [150, 356], [215, 332], [290, 268], [365, 203], [430, 152], [485, 114], [536, 100]],
  widths: [1, 30, 68, 80, 80, 64, 34, 2],
};
const LAVENDER: Sheet = {
  centre: [[330, 172], [380, 148], [430, 124], [485, 106], [545, 114], [615, 162], [690, 226], [760, 272], [812, 290], [850, 292]],
  widths: [2, 8, 24, 42, 50, 58, 62, 56, 42, 30],
};
const TRAIL: Sheet = {
  centre: [[590, 170], [650, 235], [710, 295], [780, 337], [850, 350]],
  widths: [20, 70, 86, 66, 44],
};
const OUTER: Sheet = {
  centre: [[100, 368], [200, 372], [300, 338], [400, 264], [470, 200], [520, 150]],
  widths: [6, 36, 70, 86, 70, 40],
};
// A copy of a sheet moved by (dx, dy) with its width scaled — used for the
// extra translucent layers that sit above/below the main ribbons.
const shift = (s: Sheet, dx: number, dy: number, k: number): Sheet => ({
  centre: s.centre.map(([x, y]): Pt => [x + dx, y + dy]),
  widths: s.widths.map((w) => w * k),
});
const BLUE_UP = shift(BLUE, -30, -24, 0.8);
const BLUE_DOWN = shift(BLUE, 34, 28, 0.95);
const LAV_UP = shift(LAVENDER, 6, -34, 0.9);
const LAV_DOWN = shift(LAVENDER, -8, 30, 0.8);
const BLUE_CORE: Sheet = { centre: BLUE.centre, widths: BLUE.widths.map((x) => x * 0.45) };

const ARC_LEFT: Pt[] = [[225, 262], [270, 185], [330, 112], [400, 68], [470, 66], [530, 96]];
const ARC_RIGHT: Pt[] = [[525, 96], [580, 64], [645, 55], [710, 75], [770, 115], [848, 152]];
const ARC_FAR: Pt[] = [[780, 108], [815, 92], [848, 86]];
const FAINT_A: Pt[] = [[300, 350], [390, 300], [470, 274], [550, 272], [620, 282], [670, 268]];
const FAINT_B: Pt[] = [[470, 440], [560, 392], [650, 330], [730, 300]];

// Stacked, progressively narrower copies give each sheet a feathered edge.
const FEATHER = [1, 0.9, 0.78, 0.6];
const stack = (sheet: Sheet) => FEATHER.map((f) => sheetFill(sheet, f));

const G_OUTER = stack(OUTER);
const G_TRAIL = stack(TRAIL);
const G_BLUE = stack(BLUE);
const G_LAVENDER = stack(LAVENDER);
const LAYERS = [
  { fill: sheetFill(BLUE_DOWN, 1), gradient: "hwBlue", opacity: 0.09 },
  { fill: sheetFill(BLUE_UP, 1), gradient: "hwBlue", opacity: 0.09 },
  { fill: sheetFill(LAV_DOWN, 1), gradient: "hwLavender", opacity: 0.09 },
  { fill: sheetFill(LAV_UP, 1), gradient: "hwLavender", opacity: 0.09 },
];
const LAYER_EDGES = [BLUE_UP, BLUE_DOWN, LAV_UP, LAV_DOWN].flatMap((l) => sheetEdges(l));
const CORE = sheetFill(BLUE_CORE, 1);
const [BLUE_TOP, BLUE_BOTTOM] = sheetEdges(BLUE);
const [LAV_TOP, LAV_BOTTOM] = sheetEdges(LAVENDER);
const [TRAIL_TOP, TRAIL_BOTTOM] = sheetEdges(TRAIL);
const [, OUTER_BOTTOM] = sheetEdges(OUTER);
const arc = (pts: Pt[]) => polyline(sample(pts));

export function HeroWave({ className }: { className?: string }) {
  return (
    <svg
      viewBox="80 40 768 420"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="hwBlue" gradientUnits="userSpaceOnUse" x1="120" y1="360" x2="520" y2="110">
          <stop offset="0" stopColor="#6d93b8" stopOpacity="0.3" />
          <stop offset="0.5" stopColor="#6fa3cc" stopOpacity="0.95" />
          <stop offset="1" stopColor="#8d8fd0" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="hwLavender" gradientUnits="userSpaceOnUse" x1="420" y1="110" x2="850" y2="300">
          <stop offset="0" stopColor="#9a98d8" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#7a6fb8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#a48ad6" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="hwTrail" gradientUnits="userSpaceOnUse" x1="600" y1="170" x2="850" y2="352">
          <stop offset="0" stopColor="#6b66a8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#5d5c9a" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="hwOuter" gradientUnits="userSpaceOnUse" x1="100" y1="370" x2="520" y2="150">
          <stop offset="0" stopColor="#5a7ea6" stopOpacity="0.4" />
          <stop offset="1" stopColor="#6c78b4" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="hwLine" gradientUnits="userSpaceOnUse" x1="100" y1="0" x2="850" y2="0">
          <stop offset="0" stopColor="#7ea3c8" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#a9a9de" stopOpacity="0.8" />
          <stop offset="1" stopColor="#a590d2" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="hwGlow" cx="518" cy="92" r="70" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b3b0ea" stopOpacity="0.14" />
          <stop offset="1" stopColor="#b3b0ea" stopOpacity="0" />
        </radialGradient>
        <filter id="hwSoft" x="-5%" y="-10%" width="110%" height="120%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
      </defs>

      <g filter="url(#hwSoft)">
        {G_OUTER.map((d, i) => (
          <path key={`o${i}`} d={d} fill="url(#hwOuter)" opacity="0.045" />
        ))}
        {G_TRAIL.map((d, i) => (
          <path key={`t${i}`} d={d} fill="url(#hwTrail)" opacity="0.06" />
        ))}
        {G_BLUE.map((d, i) => (
          <path key={`b${i}`} d={d} fill="url(#hwBlue)" opacity="0.18" />
        ))}
        {LAYERS.map((l, i) => (
          <path key={`x${i}`} d={l.fill} fill={`url(#${l.gradient})`} opacity={l.opacity} />
        ))}
        <path d={CORE} fill="#8cc4ea" opacity="0.24" />
        {G_LAVENDER.map((d, i) => (
          <path key={`l${i}`} d={d} fill="url(#hwLavender)" opacity="0.2" />
        ))}
        <circle cx="518" cy="92" r="70" fill="url(#hwGlow)" />
      </g>

      <g stroke="url(#hwLine)" strokeWidth="1.1" strokeLinecap="round">
        <path d={arc(ARC_LEFT)} opacity="0.6" />
        <path d={arc(ARC_RIGHT)} opacity="0.7" />
        <path d={arc(ARC_FAR)} opacity="0.45" />
        <path d={TRAIL_TOP} opacity="0.3" />
        <path d={TRAIL_BOTTOM} opacity="0.65" />
        <path d={BLUE_TOP} opacity="0.5" />
        <path d={BLUE_BOTTOM} opacity="0.5" />
        <path d={OUTER_BOTTOM} opacity="0.55" />
        <path d={LAV_TOP} opacity="0.6" />
        <path d={LAV_BOTTOM} opacity="0.6" />
        {LAYER_EDGES.map((d, i) => (
          <path key={`e${i}`} d={d} opacity="0.32" />
        ))}
        <path d={arc(FAINT_A)} opacity="0.25" />
        <path d={arc(FAINT_B)} opacity="0.18" />
      </g>
    </svg>
  );
}
