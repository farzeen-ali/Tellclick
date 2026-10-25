import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { RevealGroup } from "@/components/RevealGroup";
import { CapabilityPanel } from "@/components/CapabilityPanel";
import { BubbleButton } from "@/components/BubbleButton";
import { CAPABILITIES_DETAIL, TECHNOLOGY_NAMES } from "@/lib/data/capabilities-detail";

export const metadata: Metadata = {
  title: "Technology Capabilities",
  description:
    "Enterprise infrastructure, cloud, cybersecurity, automation and operations experience from Tellclick Inc.",
};

export default function CapabilitiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Capabilities"
        title="Six disciplines. One operating standard."
        description="The technical capabilities behind Tellclick's enterprise experience — kept concise, because the work speaks for itself."
        visual="waves"
      />

      <section className="relative overflow-hidden bg-paper py-16 lg:py-20">
        {/* Wave-silk texture behind the discipline grid — kept clearly
            readable as a photo (not just a faint trace of one), with only
            a light paper wash at the very top/bottom edges so it still
            settles into the sections above and below. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src="/images/capabilities-bg.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.6] img-bluegray"
            style={{ objectPosition: "70% center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-paper/45 via-paper/5 to-paper/45" />
        </div>

        <div className="relative mx-auto max-w-(--container-page) px-6 lg:px-10">
          <RevealGroup className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES_DETAIL.map((capability) => (
              <CapabilityPanel key={capability.index} capability={capability} />
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-tint py-16 lg:py-20">
        <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
          <SectionHeading eyebrow="Technology" title="Hands-on experience across:" />
          <RevealGroup className="mt-10 flex flex-wrap gap-x-3 gap-y-3">
            {TECHNOLOGY_NAMES.map((tech) => (
              <span
                key={tech}
                data-reveal
                className="rounded-full border border-navy/15 bg-navy/[0.04] dark:border-cyan/25 dark:bg-cyan/10 dark:hover:border-cyan/50 dark:hover:bg-cyan/20 dark:hover:text-ink px-5 py-2.5 text-sm text-ink-soft transition-all duration-300 hover:border-navy/35 hover:bg-navy/[0.13] hover:text-navy hover:shadow-[0_6px_18px_-8px_rgba(36,52,70,0.35)]"
              >
                {tech}
              </span>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-navy py-20 lg:py-24">
        <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="The Next Chapter"
              title="Learn about Ketrivo."
              subtitle="See how this enterprise foundation is being applied to a new generation of AI-powered business systems."
              theme="dark"
              className="max-w-2xl"
            />
            <div className="lg:pb-2">
              <BubbleButton href="/ketrivo" variant="inverse">
                Learn About Ketrivo
              </BubbleButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
