import { ArrowUpRight } from "lucide-react";
import { series } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { MotionSection } from "./motion-section";

export function Series() {
  return <MotionSection id="series" className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36"><SectionHeading eyebrow="A little continuity" title="Stay awhile." description="Complete worlds, collected in one place." /><div className="grid gap-8 md:grid-cols-3">{series.map((item) => <article key={item.title} className="group"><div className="relative mb-5 aspect-[1.7/1] overflow-hidden rounded-sm p-6" style={{ backgroundColor: item.color }}><div className="absolute bottom-[-20%] left-[10%] h-[120%] w-[28%] rotate-[-8deg] border-x border-white/20" /><div className="absolute bottom-[-20%] left-[38%] h-[120%] w-[28%] border-x border-white/20" /><div className="relative flex h-full items-end justify-between text-parchment"><div><span className="eyebrow" style={{ color: item.accent }}>The complete set</span><h3 className="mt-3 font-display text-3xl leading-none">{item.title}</h3></div><ArrowUpRight className="transition group-hover:-translate-y-1 group-hover:translate-x-1" size={20} /></div></div><p className="text-xs text-ink-soft">{item.books} · Available to explore</p></article>)}</div></MotionSection>;
}
