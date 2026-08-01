import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { genres } from "@/lib/content";
import { MotionSection } from "./motion-section";

export function Genres() {
  return <MotionSection id="genres" className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36"><div className="grid gap-12 lg:grid-cols-[.6fr_1fr]"><div><p className="eyebrow text-leather">Find your next world</p><h2 className="mt-5 max-w-sm font-display text-5xl leading-[.95] tracking-[-0.05em]">Go wherever a good book takes you.</h2></div><div className="border-t hairline">{genres.map((genre, index) => <Link key={genre} href="#discover" className="group flex items-center justify-between border-b hairline py-5"><span className="flex items-center gap-6"><span className="text-xs text-brass">0{index + 1}</span><span className="font-display text-3xl transition group-hover:translate-x-2">{genre}</span></span><ArrowUpRight size={18} className="text-ink-soft transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-leather" /></Link>)}</div></div></MotionSection>;
}
