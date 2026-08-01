import Link from "next/link";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[760px] overflow-hidden bg-parchment paper-grain px-6 pb-20 pt-40 lg:px-12 lg:pt-48">
      <AmbientGlow className="right-[-10%] top-[18%] h-[28rem] w-[28rem]" />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
        <div className="max-w-2xl">
          <div className="eyebrow mb-8 flex items-center gap-3 text-leather"><Sparkles size={14} strokeWidth={1.5} /> Your personal digital library</div>
          <h1 className="text-balance max-w-3xl font-display text-[clamp(4.25rem,9vw,9rem)] leading-[.82] tracking-[-0.08em] text-ink">Make room<br /><em className="font-normal text-leather">for wonder.</em></h1>
          <p className="mt-9 max-w-md text-base leading-8 text-ink-soft">Readora brings the atmosphere of a beautiful library to every book you own, discover, and return to.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="#discover"><Button size="lg">Explore the library <ArrowUpRight size={16} /></Button></Link>
            <Link href="#library" className="text-sm font-semibold text-ink-soft underline decoration-brass/70 underline-offset-8 hover:text-ink">Open my shelf</Link>
          </div>
          <div className="mt-20 flex items-center gap-3 text-xs text-ink-soft"><ArrowDown size={14} className="text-brass" /> Scroll to wander</div>
        </div>
        <div className="relative mx-auto h-[420px] w-full max-w-[530px]">
          <div className="absolute left-[9%] top-[16%] h-[74%] w-[42%] rotate-[-9deg] rounded-[4px] bg-[#5b4132] shadow-[20px_25px_35px_rgb(var(--walnut)/.25)]">
            <div className="absolute inset-4 border border-brass/50" /><span className="absolute inset-x-5 bottom-8 text-center font-display text-2xl text-parchment/90">Read<br /><em className="font-normal">slowly</em></span>
          </div>
          <div className="absolute right-[8%] top-[6%] h-[82%] w-[46%] rotate-[8deg] rounded-[4px] bg-[#b9a483] shadow-[20px_25px_35px_rgb(var(--walnut)/.22)]">
            <div className="absolute inset-4 border border-walnut/25" /><span className="absolute inset-x-5 top-10 text-center font-display text-3xl leading-[.9] text-walnut">A field<br />guide to<br /><em className="font-normal">quiet</em></span><span className="absolute inset-x-5 bottom-8 text-center text-[9px] uppercase tracking-[.25em] text-walnut/70">Jon Bell</span>
          </div>
          <div className="absolute bottom-[3%] left-[25%] right-[13%] h-6 rounded-[50%] bg-walnut/20 blur-xl" />
          <div className="absolute bottom-0 left-1/2 h-2 w-40 -translate-x-1/2 rounded-full bg-brass/40 blur-md" />
        </div>
      </div>
    </section>
  );
}
