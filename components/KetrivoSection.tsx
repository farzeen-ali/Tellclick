"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { revealFrom, revealTo } from "@/lib/animations/motion";
import { BubbleButton } from "./BubbleButton";

export function KetrivoSection() {
  const ref = useGsapContext<HTMLElement>(({ scope, prefersReducedMotion }) => {
    const targets = scope.querySelectorAll("[data-reveal]");
    const glow = scope.querySelector("[data-ketrivo-glow]");

    if (prefersReducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, revealFrom);
    gsap.to(targets, {
      ...revealTo,
      stagger: 0.08,
      scrollTrigger: { trigger: scope, start: "top 75%" },
    });

    if (glow) {
      gsap.fromTo(
        glow,
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: scope, start: "top 70%" },
        }
      );
    }
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-navy-2 py-24 lg:py-28">
      {/* Faint technical grid — this is the site's only section with no
          dot/grid texture at all today; a very low-opacity graph gives the
          "next chapter" moment the same generative-graphic language as
          every other dark section instead of a flat colour field. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 text-pale/[0.04] bg-grid-lines" />

      <div
        data-ketrivo-glow
        aria-hidden
        className="pointer-events-none absolute -right-1/4 top-0 h-full w-3/4 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(165,140,240,0.22), transparent 55%), radial-gradient(ellipse at 40% 70%, rgba(43,127,153,0.14), transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid max-w-(--container-page) items-center gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-10">
        <div className="max-w-2xl">
          <p
            data-reveal
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-pale/15 bg-pale/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-violet"
          >
            <span className="size-1.5 rounded-full bg-violet" />
            The Next Chapter
          </p>

          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-pale sm:text-5xl lg:text-[3.75rem]">
            <span data-reveal className="block">
              From enterprise infrastructure to
            </span>
            <span data-reveal className="text-gradient-tech block">
              enterprise intelligence.
            </span>
          </h2>

          <p data-reveal className="mt-8 max-w-xl text-base leading-relaxed text-pale/70 sm:text-lg">
            Tellclick is applying its accumulated experience in enterprise
            technology, operations, security and automation to a new
            generation of business systems. Ketrivo is the Saudi-focused AI
            venture built to move artificial intelligence from
            experimentation into practical business workflows.
          </p>

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-5">
            <BubbleButton href="/ketrivo" size="lg" variant="inverse">
              Visit Ketrivo
            </BubbleButton>
            <p className="text-sm text-pale/45">
              Ketrivo &mdash; Powered by Tellclick Inc., Canada.
            </p>
          </div>
        </div>

        <div
          aria-hidden
          className="animated-border-panel relative hidden aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-white/[0.03] p-8 lg:flex"
          style={{ "--border-beam-color": "var(--color-violet)" } as CSSProperties}
        >
          <div className="relative size-full max-w-[320px]">
            <Image
              src="/images/ketrivo-visual.png"
              alt=""
              fill
              sizes="320px"
              className="object-contain img-bluegray drop-shadow-[0_20px_48px_rgba(165,140,240,0.25)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
