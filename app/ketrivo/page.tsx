import Image from "next/image";
import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { RevealGroup } from "@/components/RevealGroup";
import { BubbleButton } from "@/components/BubbleButton";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Ketrivo",
  description:
    "Ketrivo is Tellclick's Saudi-focused AI operations venture, bringing enterprise technology experience into practical business AI workflows.",
};

const REASONS = [
  "AI deployments still require security, access control, integration, change management and operational reliability.",
  "Tellclick's background brings enterprise infrastructure and operations thinking to Ketrivo's AI product strategy.",
  "Ketrivo can remain a modern Saudi-focused brand while benefiting from an established Canadian corporate and technology foundation.",
];

// NOTE: update to Ketrivo's confirmed production domain before launch.
const KETRIVO_URL = "https://www.ketrivo.com";

export default function KetrivoPage() {
  return (
    <>
      <PageIntro
        eyebrow="Powering the Next Chapter"
        title="Enterprise experience, applied to AI."
        description="After years of working inside complex technology environments, Tellclick is extending its experience into applied artificial intelligence. Ketrivo is the Saudi-focused AI operations venture designed to help businesses deploy AI into practical sales, HR and knowledge workflows."
        visual="device"
        accent="violet"
      />

      <section className="bg-paper py-20 lg:py-24">
        <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
          <SectionHeading eyebrow="Why The Connection Matters" title="Enterprise infrastructure is the prerequisite for enterprise AI." />
          <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-3">
            {REASONS.map((reason) => (
              <div
                key={reason}
                data-reveal
                className="group relative overflow-hidden rounded-sm border border-hairline bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_48px_-28px_rgba(15,38,56,0.22)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full"
                />
                <span className="flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink-faint transition-all duration-500 ease-out group-hover:rotate-90 group-hover:border-accent/40 group-hover:text-accent">
                  <Plus className="size-4" strokeWidth={1.75} />
                </span>
                <p className="mt-6 text-base leading-relaxed text-ink-soft">{reason}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-2 py-24 lg:py-28">
        {/* Corner image: a plain, hard-edged photo flush to the section's
            right edge — no blur, fade or blending. */}
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 hidden h-full w-[32%] lg:block">
          <Image
            src="/images/ketrivo-corner.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 32vw, 0px"
            className="object-cover dark:opacity-80 dark:mix-blend-screen dark:[filter:invert(1)_hue-rotate(180deg)]"
          />
        </div>
        <div className="relative mx-auto max-w-(--container-page) px-6 lg:px-10">
          <RevealGroup className="max-w-2xl">
            <p data-reveal className="mb-6 text-xs font-medium uppercase tracking-[0.24em] text-maple">
              Preferred Close
            </p>
            <h2 data-reveal className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-pale sm:text-5xl lg:text-6xl">
              Built for Saudi businesses. Backed by Canadian enterprise technology experience.
            </h2>
            <div data-reveal className="mt-10">
              <BubbleButton href={KETRIVO_URL} size="lg" variant="inverse">
                Explore Ketrivo
              </BubbleButton>
            </div>
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
