"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/animations/gsap";
import { NAV_LINKS } from "@/lib/nav-links";
import { NAV_MEGA } from "@/lib/nav-mega";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { BubbleButton } from "./BubbleButton";

const CLOSE_DELAY = 220;
const HIDE_MIN_SCROLL = 96;
const HIDE_HYSTERESIS = 8;

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [openHref, setOpenHref] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const navRef = React.useRef<HTMLElement>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openPreview = React.useCallback(
    (href: string) => {
      clearCloseTimer();
      setOpenHref(href);
    },
    [clearCloseTimer]
  );

  const scheduleClose = React.useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpenHref(null), CLOSE_DELAY);
  }, [clearCloseTimer]);

  const closeNow = React.useCallback(() => {
    clearCloseTimer();
    setOpenHref(null);
  }, [clearCloseTimer]);

  // Scroll handling: a small shadow/border once scrolled, and Cohere-style
  // hide-on-scroll-down / reveal-on-scroll-up beyond a minimum offset. An
  // open mega panel forces the bar to stay visible and pinned.
  React.useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 4);
      if (openHref) {
        lastY = y;
        return;
      }
      const delta = y - lastY;
      if (y < HIDE_MIN_SCROLL) {
        setHidden(false);
      } else if (delta > HIDE_HYSTERESIS) {
        setHidden(true);
      } else if (delta < -HIDE_HYSTERESIS) {
        setHidden(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [openHref]);

  // Close the open panel / mobile drawer on route change. Comparing against
  // state during render (React's documented pattern for "adjust state when
  // a prop changes") rather than in an effect, so this doesn't trip
  // react-hooks/set-state-in-effect and doesn't cost an extra paint.
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenHref(null);
    setMobileOpen(false);
  }

  React.useEffect(() => {
    if (!openHref) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeNow();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openHref, closeNow]);

  React.useEffect(() => {
    // Entrance reveal on first paint. GSAP tweens leave an inline transform
    // behind on completion, which would permanently outrank the Tailwind
    // translate-y classes driving hide-on-scroll below (inline style always
    // wins over a class) — so hand the transform back to CSS once it settles.
    gsap.fromTo(
      navRef.current,
      { y: -24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.1,
        onComplete: () => gsap.set(navRef.current, { clearProps: "transform" }),
      }
    );
  }, []);

  const active = openHref ? NAV_MEGA[openHref] : null;

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] opacity-0 transition-transform duration-300 ease-in-out",
          hidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div
          className={cn(
            "navbar-dark relative z-10 w-full border-b transition-shadow duration-300",
            scrolled || openHref
              ? "border-hairline shadow-[0_1px_0_rgba(15,38,56,0.06),0_12px_24px_-16px_rgba(15,38,56,0.18)]"
              : "border-transparent shadow-none"
          )}
        >
          <div className="mx-auto flex h-[72px] max-w-(--container-page) items-center justify-between px-6 lg:px-10">
            <Link href="/" className="text-pale" aria-label="Tellclick Inc. — home">
              <Logo />
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <li
                  key={link.href}
                  onMouseEnter={() => openPreview(link.href)}
                  onMouseLeave={scheduleClose}
                >
                  <NavLink
                    href={link.href}
                    active={pathname === link.href}
                    open={openHref === link.href}
                    onFocus={() => openPreview(link.href)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2.5">
              <ThemeToggle className="hidden text-pale lg:inline-flex" />
              <BubbleButton href="#contact" showArrow={false} variant="accent" className="hidden lg:inline-flex">
                Contact
              </BubbleButton>

              <ThemeToggle className="text-pale lg:hidden" />

              <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
                <Dialog.Trigger asChild>
                  <button
                    className="inline-flex size-11 items-center justify-center rounded-full text-pale transition-colors duration-300 lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="size-6" />
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 z-[60] bg-pale data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out dark:bg-paper" />
                  <Dialog.Content className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-pale px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] focus:outline-none dark:bg-paper">
                    <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
                    <div className="flex items-center justify-between">
                      <Logo className="text-charcoal dark:text-white" />
                      <div className="flex items-center gap-1">
                        <ThemeToggle className="text-charcoal dark:text-white" />
                        <Dialog.Close asChild>
                          <button
                            className="inline-flex size-11 items-center justify-center rounded-full text-charcoal dark:text-white"
                            aria-label="Close menu"
                          >
                            <X className="size-6" />
                          </button>
                        </Dialog.Close>
                      </div>
                    </div>

                    <div className="mt-10 flex flex-1 flex-col justify-center gap-1 pb-8">
                      {NAV_LINKS.map((link, i) => (
                        <MobileNavSection
                          key={link.href}
                          link={link}
                          onNavigate={() => setMobileOpen(false)}
                          delay={0.08 * (i + 1) + 0.05}
                        />
                      ))}
                    </div>

                    <BubbleButton
                      href="#contact"
                      variant="accent"
                      showArrow={false}
                      onClick={() => setMobileOpen(false)}
                      className="mb-4 h-14 w-full"
                    >
                      Contact
                    </BubbleButton>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
        </div>

        {/* Full-width mega panel — CSS-grid height accordion (0fr -> 1fr).
            Content swaps to whichever nav item is currently hovered/focused,
            Cohere-style: a label + big title + subtitle on the left, one or
            two short columns of {title, description} items, and a plain
            list of sibling-page links on the right. Kept short (3 items per
            column, single-line copy, tight padding) so it never comes close
            to covering the page. */}
        <div
          className="grid w-full transition-[grid-template-rows] duration-500 ease-[var(--ease-premium)]"
          style={{ gridTemplateRows: active ? "1fr" : "0fr" }}
          onMouseEnter={() => openHref && openPreview(openHref)}
          onMouseLeave={scheduleClose}
        >
          <div className="overflow-hidden">
            <div className="w-full border-b border-hairline bg-white shadow-[0_24px_48px_-24px_rgba(15,38,56,0.28)] dark:bg-surface">
              <div
                className={cn(
                  "mx-auto max-w-(--container-page) px-6 py-7 transition-all duration-300 lg:px-10",
                  active ? "translate-y-0 opacity-100 delay-150" : "-translate-y-1 opacity-0"
                )}
              >
                {active && (
                  <div className="flex gap-10">
                    <div className="w-[220px] shrink-0 border-r border-hairline pr-8">
                      <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
                        <span className="size-1 rounded-full bg-cyan" />
                        {active.label}
                      </p>
                      <p className="mt-2.5 font-display text-xl font-medium tracking-tight text-ink">
                        {active.title}
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-faint">
                        {active.subtitle}
                      </p>
                      <Link
                        href={active.href}
                        className="group/cta mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink transition-colors duration-200 hover:text-cyan"
                      >
                        {active.cta}
                        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                      </Link>
                    </div>

                    {active.columns.map((col) => (
                      <div key={col.heading} className="flex-1">
                        <p className="mb-3.5 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
                          {col.heading}
                        </p>
                        <div className="flex flex-col gap-3.5">
                          {col.items.map((item) => (
                            <div key={item.title}>
                              <p className="text-[14px] font-medium tracking-tight text-ink">
                                {item.title}
                              </p>
                              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-faint">
                                {item.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="w-[160px] shrink-0">
                      <p className="mb-3.5 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
                        Explore
                      </p>
                      <div className="flex flex-col gap-2.5">
                        {NAV_LINKS.filter((l) => l.href !== active.href).map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            className="text-[13.5px] text-ink-soft transition-colors duration-200 hover:text-cyan"
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <style>{`
        @keyframes mobileNavIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="mobileNavIn"] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </>
  );
}

function RollText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block h-[1.2em] overflow-hidden">
      <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

function NavLink({
  href,
  active,
  open,
  onFocus,
  children,
}: {
  href: string;
  active: boolean;
  open: boolean;
  onFocus: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onFocus={onFocus}
      className={cn(
        "group relative inline-flex items-center rounded-full px-3.5 py-2 text-[13.5px] font-medium tracking-wide text-pale transition-all duration-200 hover:bg-cyan/10",
        open && "bg-cyan/10"
      )}
    >
      <RollText>{children}</RollText>
      <span
        className={cn(
          "absolute -bottom-0.5 left-3.5 right-3.5 h-px origin-left scale-x-0 bg-cyan transition-transform duration-300 ease-out",
          active && "scale-x-100"
        )}
      />
    </Link>
  );
}

function MobileNavSection({
  link,
  onNavigate,
  delay,
}: {
  link: { label: string; href: string };
  onNavigate: () => void;
  delay: number;
}) {
  return (
    <div
      className="border-b border-charcoal/10 py-5 dark:border-white/15"
      style={{ animation: "mobileNavIn 0.6s var(--ease-premium, ease) both", animationDelay: `${delay}s` }}
    >
      <Link
        href={link.href}
        onClick={onNavigate}
        className="font-display text-3xl font-medium text-charcoal transition-colors duration-200 hover:text-cyan dark:text-white"
      >
        {link.label}
      </Link>
    </div>
  );
}
