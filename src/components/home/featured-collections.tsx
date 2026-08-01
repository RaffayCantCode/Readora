import { ArrowUpRight } from "lucide-react";
import { collections } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { MotionSection } from "./motion-section";

const tones = { walnut: "bg-walnut text-parchment", moss: "bg-moss text-parchment", leather: "bg-leather text-parchment" };
export function FeaturedCollections() {
  return <MotionSection className="bg-[#e7dcc9] px-6 py-24 lg:px-12 lg:py-36">
    <div className="mx-auto max-w-[1440px]"><SectionHeading eyebrow="Curated shelves" title="Follow your curiosity." description="Thoughtful collections for the mood you’re in, or the one you’re looking for." />
      <div className="grid gap-4 md:grid-cols-3">{collections.map((collection, index) => <article key={collection.title} className={"group relative min-h-[320px] overflow-hidden rounded-sm p-7 " + tones[collection.tone]}><div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[28px] border-white/10 transition duration-700 group-hover:scale-110" /><div className="relative flex h-full flex-col justify-between"><div><span className="eyebrow text-brass">0{index + 1} / collection</span><h3 className="mt-16 max-w-[12rem] font-display text-4xl leading-[.95] tracking-[-0.04em]">{collection.title}</h3></div><div className="flex items-end justify-between gap-4"><p className="max-w-[14rem] text-sm leading-6 text-current/65">{collection.description}</p><ArrowUpRight className="shrink-0 text-brass transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" /></div><span className="absolute right-0 top-0 text-xs text-current/45">{collection.count}</span></div></article>)}</div>
    </div>
  </MotionSection>;
}
