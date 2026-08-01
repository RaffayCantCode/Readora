import { ArrowRight } from "lucide-react";
import { authors } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { MotionSection } from "./motion-section";

export function Authors() {
  return <MotionSection id="authors" className="bg-[#d8d0c3] px-6 py-24 lg:px-12 lg:py-36"><div className="mx-auto max-w-[1440px]"><SectionHeading eyebrow="People worth following" title="Meet the voices behind the pages." action={<button className="hidden items-center gap-2 text-sm font-semibold text-leather md:flex">Browse authors <ArrowRight size={15} /></button>} /><div className="grid gap-4 md:grid-cols-3">{authors.map((author, index) => <div key={author.name} className="flex items-center gap-5 border-t border-walnut/15 py-6"><div className={"grid h-16 w-16 place-items-center rounded-full font-display text-xl " + (index === 1 ? "bg-leather text-parchment" : "bg-parchment text-leather")}>{author.initials}</div><div><h3 className="font-display text-2xl">{author.name}</h3><p className="mt-1 text-xs text-ink-soft">{author.detail}</p></div></div>)}</div></div></MotionSection>;
}
