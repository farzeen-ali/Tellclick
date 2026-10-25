import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { BubbleButton } from "@/components/BubbleButton";
import { RevealGroup } from "@/components/RevealGroup";
import { PrinciplesCube } from "@/components/PrinciplesCube";
import { DotGridBackdrop } from "@/components/TechVisuals";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Tellclick's Canadian enterprise technology experience evolved from infrastructure and security into cloud, automation and applied AI.",
};

const PRINCIPLES = [
  {
    name: "Practical over fashionable",
    description: "Technology should solve an operational problem, not exist because a trend is popular.",
  },
  {
    name: "Enterprise discipline",
    description: "Security, documentation, change control, resilience and supportability matter from the beginning.",
  },
  {
    name: "Modernize without unnecessary disruption",
    description: "The best transformation often works with what an organization already has.",
  },
  {
    name: "Automation with accountability",
    description: "Automation should reduce repetitive work while preserving controls and visibility.",
  },
  {
    name: "Experience into the next chapter",
    description: "The move into AI is an extension of infrastructure, cloud, security and automation — not a departure from them.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About Tellclick"
        title="Experience before hype."
        description="Tellclick Inc. was established in Canada in 2009 as a vehicle for delivering specialized technology expertise. Over the years, that work has expanded across enterprise infrastructure, virtualization, cybersecurity, cloud, automation and complex production environments."
        visual="pattern"
      />

      {/* Company story */}
      <section className="bg-paper py-20 lg:py-24">
        <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <SectionHeading eyebrow="The Story" title="Built on real enterprise work." />
            <RevealGroup className="space-y-6 text-base leading-relaxed text-ink-soft sm:text-lg">
              <p data-reveal>
                The company&rsquo;s history has been shaped by real enterprise
                work: server and data-centre modernization, identity and
                privileged-access controls, vulnerability remediation,
                disaster recovery, cloud migration, automation, platform
                upgrades and daily support of business-critical systems.
              </p>
              <p data-reveal>
                That operational background matters because technology
                succeeds only when it works inside the realities of a
                business &mdash; security policies, change controls, legacy
                systems, people, uptime requirements and regulatory
                expectations.
              </p>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Enterprise experience */}
      <section className="relative overflow-hidden bg-navy py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 text-pale/[0.06]" aria-hidden>
          <DotGridBackdrop />
        </div>
        <div className="relative mx-auto max-w-(--container-page) px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Enterprise Experience"
              title="Fifteen-plus years across Canada's most demanding environments."
              theme="dark"
              className="max-w-2xl"
            />
            <div className="lg:pb-2">
              <BubbleButton href="/experience" variant="inverse">
                View Our Experience
              </BubbleButton>
            </div>
          </div>
          <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              { label: "Financial services", detail: "RBC, TD, BMO and Scotiabank environments" },
              { label: "Public institutions", detail: "University of Toronto, Toronto Public Library" },
              { label: "Enterprise & insurance", detail: "Allianz, FCT Canada, Kognitiv, US Steel, Arvato/Bertelsmann" },
            ].map((item) => (
              <div key={item.label} data-reveal className="border-l border-pale/15 pl-6">
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-pale">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-pale/60">{item.detail}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-paper py-20 lg:py-24">
        <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
          <SectionHeading eyebrow="Principles" title="What guides the work." />
          <div className="mt-14">
            <PrinciplesCube principles={PRINCIPLES} />
          </div>
        </div>
      </section>

      {/* Founder profile */}
      <section className="bg-tint py-20 lg:py-24">
        <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <SectionHeading eyebrow="Founder Profile" title="Built by an operator, not a pitch deck." />
            <RevealGroup>
              <p data-reveal className="text-base leading-relaxed text-ink-soft sm:text-lg">
                Tellclick was founded by a Canadian enterprise technology
                professional whose experience spans major financial
                institutions, public organizations and multinational
                enterprises. His work has covered infrastructure,
                cybersecurity, cloud, automation and enterprise operations.
              </p>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Next chapter */}
      <section className="bg-navy-2 py-20 lg:py-24">
        <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Next Chapter"
              title="From enterprise infrastructure to enterprise intelligence."
              subtitle="Tellclick is extending its enterprise foundation into applied AI through Ketrivo, the Saudi-focused venture built to move AI from experimentation into practical business workflows."
              theme="dark"
              className="max-w-2xl"
            />
            <div className="lg:pb-2">
              <BubbleButton href="/ketrivo" variant="inverse">
                Visit Ketrivo
              </BubbleButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
