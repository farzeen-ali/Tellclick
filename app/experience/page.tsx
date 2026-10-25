import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { Timeline } from "@/components/Timeline";
import { CaseStudySlider } from "@/components/CaseStudySlider";
import { BubbleButton } from "@/components/BubbleButton";

export const metadata: Metadata = {
  title: "Enterprise Technology Experience",
  description:
    "Explore Tellclick's technology experience across financial services, education and enterprise environments in Canada.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageIntro
        eyebrow="Experience"
        title="Fifteen years, one continuous thread."
        description="From physical infrastructure to applied AI — a chronological look at how Tellclick's enterprise technology experience was built, one environment at a time."
        visual="ribbons"
        accent="coral"
      />

      <section className="relative overflow-hidden bg-paper py-14 lg:py-16">
        {/* Faint abstract wash behind the timeline — two staggered copies
            (top-right, and bottom-left mirrored) so the texture carries all
            the way down the now-tall vertical spine instead of fading out
            partway, while staying faint enough to never fight the ink text
            and metallic panels sitting over it. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[60%]">
            <Image
              src="/images/experience-timeline-bg.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-[0.12] img-bluegray"
              style={{ objectPosition: "80% top" }}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[55%]">
            <Image
              src="/images/experience-timeline-bg.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-[0.1] [transform:scaleX(-1)] img-bluegray"
              style={{ objectPosition: "20% bottom" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-paper/20 via-paper/55 to-paper" />
        </div>

        <div className="relative mx-auto max-w-(--container-page) px-6 lg:px-10">
          <SectionHeading eyebrow="Timeline" title="How the experience was built." />
          <div className="mt-14 lg:mt-16">
            <Timeline />
          </div>
        </div>
      </section>

      <section className="bg-tint py-20 lg:py-24">
        <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
          <SectionHeading
            eyebrow="Case Studies"
            title="Evidence, not adjectives."
            subtitle="Large-scale engagements that show the operational depth behind the history."
          />
          <div className="mt-16">
            <CaseStudySlider />
          </div>
        </div>
      </section>

      <section className="bg-navy-2 py-20 lg:py-24">
        <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Capabilities"
              title="See the technical disciplines behind the history."
              theme="dark"
              className="max-w-2xl"
            />
            <div className="lg:pb-2">
              <BubbleButton href="/capabilities" variant="inverse">
                Explore Capabilities
              </BubbleButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
