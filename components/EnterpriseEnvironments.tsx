import Image from "next/image";
import { ENTERPRISE_ENVIRONMENTS as NAMES } from "@/lib/data/environments";
import { SectionHeading } from "./SectionHeading";
import { DotGridBackdrop } from "./TechVisuals";

export function EnterpriseEnvironments() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 lg:py-24">
      {/* Light mode: ribbon-wave artwork on white, toned from red to the theme blue and softened behind the heading and
          the moving type (dark mode keeps its original navy + glow blobs). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-white dark:hidden" />
      <Image
        src="/images/enterprise-wave.jpg"
        alt=""
        fill
        sizes="100vw"
        quality={95}
        unoptimized
        className="object-cover opacity-50 [filter:hue-rotate(205deg)_saturate(0.45)_brightness(0.97)] dark:hidden"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 hidden text-pale/[0.07] dark:block" aria-hidden>
        <DotGridBackdrop />
      </div>

      {/* Layered depth — faint cyan/violet glow fields behind the moving
          type, reading as an active technology network rather than a flat
          logo strip. */}
      <div aria-hidden className="glow-blob pointer-events-none absolute -left-24 top-0 size-[380px] bg-cyan/10" />
      <div aria-hidden className="glow-blob pointer-events-none absolute -right-24 bottom-0 size-[380px] bg-violet/[0.08]" />

      <div className="relative mx-auto max-w-(--container-page) px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Enterprise Environments"
            title="Enterprise environments our team has supported."
            theme="dark"
          />
          <span className="mb-1 hidden font-mono text-xs font-extrabold uppercase tracking-[0.18em] text-[#07141f] dark:text-[10px] dark:font-normal dark:text-cyan/50 sm:inline-flex sm:items-center sm:gap-2">
            <span className="size-2 rounded-full bg-[#0f4c63] dark:size-1.5 dark:bg-cyan dark:shadow-[0_0_8px_2px_rgba(189,232,246,0.55)]" />
            NETWORK.STATUS: ACTIVE
          </span>
        </div>
      </div>

      <div className="edge-fade-x relative mt-12 space-y-4">
        <div className="overflow-hidden">
          <MarqueeContent durationSeconds={34} accent="cyan" />
        </div>
        <div className="overflow-hidden">
          <MarqueeContent dim durationSeconds={40} reverse accent="violet" />
        </div>
      </div>
    </section>
  );
}

/**
 * Each row's own content is duplicated (copy 0 + copy 1) and the row is
 * driven by the CSS `.animate-marquee` keyframes (translateX 0 -> -50%),
 * so the loop point always lines up with the row's actual current width --
 * see the comment on `.animate-marquee` in globals.css for why that's the
 * fix over a JS-measured pixel tween. `reverse` flips the second row so it
 * drifts the opposite way, matching the original two-row banner look.
 * `accent` alternates the separating bullet's colour per row (cyan / violet)
 * instead of the flat single-colour dot the original used.
 */
function MarqueeContent({
  dim = false,
  durationSeconds,
  reverse = false,
  accent,
}: {
  dim?: boolean;
  durationSeconds: number;
  reverse?: boolean;
  accent: "cyan" | "violet";
}) {
  const bulletClass = accent === "cyan" ? "text-cyan/70" : "text-violet/70";

  return (
    <div
      className="animate-marquee flex w-max items-center whitespace-nowrap"
      style={{
        animationDuration: `${durationSeconds}s`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {[0, 1].map((copy) => (
        <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
          {NAMES.map((name, i) => (
            <span
              key={`${copy}-${name}-${i}`}
              className={
                dim
                  ? "mx-6 font-display text-3xl font-medium tracking-tight text-pale/40 sm:text-4xl lg:text-5xl"
                  : "mx-6 font-display text-4xl font-medium tracking-tight text-pale/90 sm:text-5xl lg:text-6xl"
              }
            >
              {name}
              <span className={`ml-12 ${bulletClass}`}>&bull;</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
