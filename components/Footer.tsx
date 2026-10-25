import Link from "next/link";
import { Logo } from "./Logo";
import { NAV_LINKS } from "@/lib/nav-links";

/** Small inline Canada flag, used beside "Ontario, Canada" in the footer's
 * corporate-contact block for a quick, professional country cue. */
function CanadaFlagIcon() {
  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 17 12"
      aria-hidden
      className="shrink-0 overflow-hidden rounded-[2px] ring-1 ring-white/15"
    >
      <rect width="17" height="12" fill="#FF2A2A" />
      <rect x="4.25" width="8.5" height="12" fill="#ffffff" />
      <path
        d="M8.5 2.1l.62 1.3 1.36-.66-.28 1.44 1.4.17-1.05.98.72.74-1.36.1.09 1.02-.9-.56v1.1h-.6v-1.1l-.9.56.09-1.02-1.36-.1.72-.74-1.05-.98 1.4-.17-.28-1.44 1.36.66z"
        fill="#FF2A2A"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-pale/10 navbar-dark pb-[env(safe-area-inset-bottom)] text-pale/85">
      <div className="relative mx-auto max-w-(--container-page) px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo className="text-pale" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-pale/60">
              Tellclick Inc. is a Canadian enterprise technology company
              established in 2009, built on experience across infrastructure,
              cloud, cybersecurity, automation and enterprise operations.
            </p>
            <p className="mt-6 text-sm text-pale/60">
              Tellclick Inc. &bull; Ontario, Canada &bull; Established 2009
            </p>
          </div>

          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-pale/40">
              Navigate
            </p>
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-pale/75 transition-colors hover:text-pale"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-pale/40">
              Corporate contact
            </p>
            <ul className="space-y-3 text-sm text-pale/75">
              <li>
                <a
                  href="mailto:info@tellclick.ca"
                  className="inline-flex min-h-11 items-center transition-colors hover:text-pale"
                >
                  info@tellclick.ca
                </a>
              </li>
              <li className="flex items-center gap-2 text-pale/50">
                <CanadaFlagIcon />
                Ontario, Canada
              </li>
              <li className="pt-3">
                <a
                  href="https://ketrivo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-pale transition-colors hover:text-sage"
                >
                  Ketrivo &mdash; Powered by Tellclick Inc.
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-pale/15 pt-8 text-xs text-pale/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Enterprise Technology &bull; Cloud &bull; Security &bull; Automation
            &bull; AI
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="inline-flex min-h-11 items-center transition-colors hover:text-pale/80">
              Privacy
            </Link>
            <span>&copy; {new Date().getFullYear()} Tellclick Inc. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
