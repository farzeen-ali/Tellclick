import { Cloud, Server, ShieldCheck, Workflow, RefreshCw } from "lucide-react";
import type { CaseStudy as CaseStudyType } from "@/lib/data/case-studies";

const CASE_ICONS = [Cloud, Server, ShieldCheck, Workflow, RefreshCw];

/**
 * Case study card: a numbered index, a small line-icon marking the
 * engagement type, and the full write-up. No photography — the previous
 * stock-photo thumbnails were replaced with this technical, icon-led
 * treatment as part of the enterprise redesign.
 */
export function CaseStudy({ study, index }: { study: CaseStudyType; index: number }) {
  const Icon = CASE_ICONS[index % CASE_ICONS.length];

  return (
    <div
      data-reveal
      className="group overflow-hidden rounded-sm border border-hairline bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_48px_-28px_rgba(15,38,56,0.18)] sm:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-full border border-hairline text-accent">
          <Icon className="size-5" strokeWidth={1.6} />
        </span>
        <span className="font-display text-sm font-medium tracking-tight text-ink-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
        {study.name}
      </p>
      <h3 className="mt-2 font-display text-lg font-medium leading-snug tracking-tight text-ink sm:text-xl">
        {study.headline}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
        {study.description}
      </p>
    </div>
  );
}
