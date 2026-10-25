import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Tellclick Inc. handles information collected through tellclick.ca.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Privacy"
        title="How we handle your information."
        description="A short notice covering what tellclick.ca collects, and how to reach us with questions."
      />
      <section className="bg-paper py-24 lg:py-28">
        <div className="mx-auto max-w-2xl space-y-6 px-6 text-base leading-relaxed text-ink-soft lg:px-10">
          <p>
            Tellclick.ca does not sell personal information. Contact made
            through the corporate email address (info@tellclick.ca) is used
            solely to respond to your inquiry.
          </p>
          <p>
            If analytics or on-site forms are introduced in future, this
            notice will be updated to reflect what is collected, why, and how
            long it is retained, in line with applicable Canadian privacy
            law.
          </p>
          <p>
            Questions about this notice can be sent to{" "}
            <a href="mailto:info@tellclick.ca" className="text-ink underline underline-offset-4">
              info@tellclick.ca
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
