"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/animations/gsap";

type BubbleVariant = "primary" | "secondary" | "inverse" | "outlineDark" | "outlineLight" | "accent";

interface BubbleButtonBaseProps {
  children: React.ReactNode;
  variant?: BubbleVariant;
  size?: "default" | "lg";
  className?: string;
  showArrow?: boolean;
}

type BubbleButtonProps = BubbleButtonBaseProps &
  (
    | ({ href: string } & Omit<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        "className" | "children"
      >)
    | ({ href?: undefined } & Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        "className" | "children"
      >)
  );

const VARIANT_STYLES: Record<
  BubbleVariant,
  { base: string; bubble: string; hoverText: string; dot: string }
> = {
  primary: {
    base: "bg-charcoal text-white",
    bubble: "bg-maple",
    hoverText: "text-white",
    dot: "bg-maple",
  },
  secondary: {
    base: "bg-transparent text-ink border border-ink/20",
    bubble: "bg-charcoal",
    hoverText: "text-white",
    dot: "bg-maple",
  },
  inverse: {
    base: "bg-white text-charcoal",
    bubble: "bg-mist",
    hoverText: "text-charcoal",
    dot: "bg-maple",
  },
  outlineDark: {
    base: "bg-transparent text-pale border border-pale/30",
    bubble: "bg-charcoal",
    hoverText: "text-white",
    dot: "bg-maple",
  },
  outlineLight: {
    base: "bg-transparent text-charcoal border border-charcoal/25 dark:text-white dark:border-white/30",
    bubble: "bg-charcoal",
    hoverText: "text-white",
    dot: "bg-maple",
  },
  accent: {
    base: "bg-violet text-navy",
    bubble: "bg-pale",
    hoverText: "text-navy",
    dot: "bg-cyan",
  },
};

/**
 * Reusable premium CTA. A circular "bubble" originates from the cursor's
 * entry point, expands to cover the button, and a synchronized colour
 * crossfade + arrow shift completes the effect. Falls back to a plain
 * colour transition when the visitor prefers reduced motion.
 */
export function BubbleButton({
  children,
  variant = "primary",
  size = "default",
  className,
  showArrow = true,
  href,
  ...props
}: BubbleButtonProps) {
  const rootRef = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const bubbleRef = React.useRef<HTMLSpanElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const arrowRef = React.useRef<HTMLSpanElement>(null);
  const styles = VARIANT_STYLES[variant];
  const reducedMotion = React.useRef(false);

  React.useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const setOrigin = (e: React.MouseEvent) => {
    const el = rootRef.current;
    const bubble = bubbleRef.current;
    if (!el || !bubble) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleEnter = (e: React.MouseEvent) => {
    const el = rootRef.current;
    const bubble = bubbleRef.current;
    if (!el || !bubble) return;
    const { x, y } = setOrigin(e);
    const size = Math.max(el.offsetWidth, el.offsetHeight) * 2.4;

    if (reducedMotion.current) {
      gsap.to(bubble, { opacity: 1, duration: 0.15 });
      gsap.to(labelRef.current, { color: getComputedColor(styles.hoverText), duration: 0.15 });
      gsap.to(arrowRef.current, { x: 4, duration: 0.15 });
      return;
    }

    gsap.killTweensOf(bubble);
    gsap.set(bubble, { left: x, top: y, width: size, height: size, xPercent: -50, yPercent: -50 });
    gsap.fromTo(
      bubble,
      { scale: 0, opacity: 1 },
      { scale: 1, duration: 0.6, ease: "power3.out" }
    );
    gsap.to(labelRef.current, { color: getComputedColor(styles.hoverText), duration: 0.4, ease: "power2.out" });
    gsap.to(arrowRef.current, { x: 5, duration: 0.5, ease: "power3.out" });
  };

  const handleLeave = (e: React.MouseEvent) => {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    const { x, y } = setOrigin(e);

    if (reducedMotion.current) {
      gsap.to(bubble, { opacity: 0, duration: 0.15 });
      gsap.to(labelRef.current, { color: "", duration: 0.15 });
      gsap.to(arrowRef.current, { x: 0, duration: 0.15 });
      return;
    }

    gsap.killTweensOf(bubble);
    gsap.to(bubble, {
      left: x,
      top: y,
      scale: 0,
      duration: 0.45,
      ease: "power2.in",
    });
    gsap.to(labelRef.current, { color: "", duration: 0.35, ease: "power2.out" });
    gsap.to(arrowRef.current, { x: 0, duration: 0.4, ease: "power3.out" });
  };

  const content = (
    <>
      <span
        ref={bubbleRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute rounded-full opacity-0",
          styles.bubble
        )}
        style={{ willChange: "transform" }}
      />
      <span ref={labelRef} className="relative z-10">
        {children}
      </span>
      {showArrow && (
        <span ref={arrowRef} className="relative z-10 inline-flex">
          <ArrowRight className="size-4" strokeWidth={2} />
        </span>
      )}
    </>
  );

  const sharedClassName = cn(
    "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full text-sm font-medium tracking-wide transition-colors",
    size === "lg" ? "h-14 px-9 text-[15px]" : "h-12 px-7",
    styles.base,
    className
  );

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          ref={rootRef}
          href={href}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className={sharedClassName}
          target="_blank"
          rel="noopener noreferrer"
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        ref={rootRef}
        href={href}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className={sharedClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={rootRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={sharedClassName}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

function getComputedColor(twClass: string) {
  if (twClass.includes("white")) return "#f7fbfc";
  if (twClass.includes("charcoal")) return "#10263a";
  if (twClass.includes("navy")) return "#10263a";
  return "";
}
