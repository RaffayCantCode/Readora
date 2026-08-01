import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <div className="max-w-xl">
        <p className="eyebrow mb-4 text-leather">{eyebrow}</p>
        <h2 className="text-balance font-display text-4xl leading-[.98] tracking-[-0.04em] text-ink sm:text-5xl">{title}</h2>
        {description && <p className="mt-5 max-w-md text-sm leading-7 text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}
