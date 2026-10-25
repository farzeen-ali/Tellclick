import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Brand mark only: "TC Monogram" — a rounded ring "C" wrapped around a crisp
 * "T". The T always follows currentColor. With `gradient` the ring uses the
 * brand teal-to-lavender gradient (driven by the --logo-c1/--logo-c2 tokens in
 * globals.css so it stays bright on both light and dark surfaces); without it
 * the whole mark is single-colour currentColor, which is what the faint
 * watermark uses (Progression's card art) and the small case-study header mark.
 * Exported on its own so it can be reused as a standalone mark, not just
 * inside the full Logo lockup.
 */
export function LogoMark({
  className,
  gradient = false,
}: {
  className?: string;
  gradient?: boolean;
}) {
  const id = React.useId();
  const gid = `logo-ring-${id.replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      {gradient && (
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--logo-c1)" }} />
            <stop offset="1" style={{ stopColor: "var(--logo-c2)" }} />
          </linearGradient>
        </defs>
      )}
      <path
        d="M37.79 34.77 A17.5 17.5 0 1 1 37.79 13.23"
        stroke={gradient ? `url(#${gid})` : "currentColor"}
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="15.5" y="16.5" width="17" height="5.4" rx="2.2" fill="currentColor" />
      <rect x="21.3" y="16.5" width="5.4" height="16" rx="2.2" fill="currentColor" />
    </svg>
  );
}

/**
 * Full brand lockup: the mark plus the wordmark ("click" carries the brand
 * gradient), matching the finished brand kit's primary lockup.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark gradient className="size-7" />
      <span className="font-display text-[1.05rem] font-semibold tracking-tight">
        Tell<span className="logo-click">click</span>
        <span className="ml-1 text-[0.65em] font-medium tracking-[0.1em] opacity-60">
          INC.
        </span>
      </span>
    </span>
  );
}
