import type { CapabilityDetail } from "@/lib/data/capabilities-detail";

export function CapabilityPanel({ capability }: { capability: CapabilityDetail }) {
  return (
    <div data-reveal className="group">
      <div className="h-px w-full bg-hairline transition-colors duration-300 group-hover:bg-accent" />
      <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-2xl">
        {capability.name}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
        {capability.description}
      </p>
    </div>
  );
}
