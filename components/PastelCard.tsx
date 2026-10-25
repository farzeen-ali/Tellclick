import { cn } from "@/lib/utils";

/**
 * Enterprise principle card styled as a floating cube face: a navy-tinted
 * panel, a static perspective tilt with layered "edge" slivers along the
 * right and bottom sides to read as a 3D block rather than a flat card,
 * and a thin accent rule that draws in on hover. Currently used only by
 * PrinciplesCube, so its styling is scoped to that treatment rather than
 * the flatter surface card used elsewhere (Capabilities/SectorSection/
 * CaseStudy). The tilt is fixed (set once, not changed on hover) — these
 * cards sit stacked on top of one another in PrinciplesCube, so a hover
 * transform that shifts or re-tilts the card would visibly nudge it over
 * its neighbours and cut off their text. Hover feedback instead comes
 * only from the border/shadow deepening, which never moves anything. GSAP
 * never touches this element's transform either (it only sets opacity
 * here and animates the parent slot wrapper), so nothing here collides.
 *
 * `featured` scales the card up for the single centred "screen" slot in
 * PrinciplesCube — the principle with the most content sits there, so it
 * gets more room to breathe than the four smaller cards around it. The
 * four non-featured corner cards also get a fixed height at the `lg`
 * breakpoint (where PrinciplesCube's absolute corner layout is active) so
 * they read as four uniform small rectangles regardless of how much their
 * own title/description happens to wrap — below `lg` they stay auto-height
 * in the plain stacked/2-col fallback, and a lighter sky-blue tint (versus
 * the centred card's navy one) to set them apart from the featured card.
 */
export function PastelCard({
  title,
  description,
  index,
  featured = false,
}: {
  title: string;
  description: string;
  index: number;
  featured?: boolean;
}) {
  return (
    <div
      data-reveal
      className={cn(
        "group relative flex h-full flex-col justify-center overflow-hidden rounded-lg border border-navy/15 dark:border-cyan/25 shadow-[6px_10px_0_-2px_rgba(15,38,56,0.14),10px_18px_28px_-16px_rgba(15,38,56,0.4)] transition-[border-color,box-shadow] duration-300 [transform:perspective(1000px)_rotateX(2deg)_rotateY(-3deg)] hover:border-navy/40 dark:hover:border-cyan/50 hover:shadow-[6px_10px_0_-2px_rgba(15,38,56,0.2),14px_26px_38px_-16px_rgba(15,38,56,0.5)]",
        featured
          ? "cube-face min-h-[15rem] p-7 sm:min-h-[17rem] sm:p-9"
          : "cube-face-sky min-h-[13rem] p-6 sm:min-h-[14.5rem] sm:p-7 lg:h-[280px]"
      )}
    >
      {/* Cube "edge" slivers — darker strips along the right and bottom
          borders so the panel reads as a face of a cube seen at an angle. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-1.5 right-0 w-1.5 rounded-r-lg bg-gradient-to-b from-navy/25 via-navy/15 to-navy/25"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-1.5 bottom-0 h-1.5 rounded-b-lg bg-gradient-to-r from-navy/25 via-navy/15 to-navy/25"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full"
      />
      <span className="font-display text-xs font-medium tracking-tight text-ink-faint">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3
        className={cn(
          "mt-3 font-display font-medium leading-snug tracking-tight text-ink",
          featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-3 leading-relaxed text-ink-soft",
          featured ? "text-base sm:text-lg" : "text-sm sm:text-base"
        )}
      >
        {description}
      </p>
    </div>
  );
}
