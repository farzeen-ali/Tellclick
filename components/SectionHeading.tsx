"use client";

import { cn } from "@/lib/utils";
import { ScrollTrigger, gsap } from "@/lib/animations/gsap";
import { useGsapContext } from "@/lib/animations/useGsapContext";
import { revealFrom, revealTo } from "@/lib/animations/motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  theme?: "light" | "dark";
  align?: "left" | "center";
  size?: "default" | "large";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  theme = "light",
  align = "left",
  size = "default",
  className,
}: SectionHeadingProps) {
  const ref = useGsapContext<HTMLDivElement>(({ scope, prefersReducedMotion }) => {
    const targets = scope.querySelectorAll("[data-reveal]");
    if (prefersReducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(targets, revealFrom);
    gsap.to(targets, {
      ...revealTo,
      stagger: 0.08,
      scrollTrigger: {
        trigger: scope,
        start: "top 82%",
      },
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.trigger === scope && t.kill());
  }, [title]);

  const isDark = theme === "dark";

  return (
    <div
      ref={ref}
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          data-reveal
          className={cn(
            "mb-5 text-xs font-medium uppercase tracking-[0.22em]",
            isDark ? "text-pale" : "text-accent"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        data-reveal
        className={cn(
          "font-display font-medium leading-[1.08] tracking-tight",
          size === "large"
            ? "text-4xl sm:text-5xl lg:text-6xl"
            : "text-3xl sm:text-4xl lg:text-[2.75rem]",
          isDark ? "text-pale" : "text-ink"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          data-reveal
          className={cn(
            "mt-6 text-base leading-relaxed sm:text-lg",
            isDark ? "text-pale/85" : "text-ink-soft"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
