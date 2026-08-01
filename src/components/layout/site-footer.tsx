import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ReadoraWordmark } from "@/components/brand/readora-wordmark";

export function SiteFooter() {
  return (
    <footer className="bg-walnut px-6 py-16 text-parchment lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <ReadoraWordmark size="md" className="[&_div]:text-parchment [&_svg]:text-brass" showTagline />
          <p className="mt-8 max-w-xs text-sm leading-7 text-parchment/60">A quieter place for the books you love, and the ones waiting to find you.</p>
        </div>
        <div className="grid content-start gap-3 text-sm text-parchment/65">
          <span className="eyebrow mb-2 text-brass">Explore</span>
          <Link href="#discover" className="hover:text-parchment">Discover</Link>
          <Link href="#genres" className="hover:text-parchment">Genres</Link>
          <Link href="#series" className="hover:text-parchment">Series</Link>
        </div>
        <div className="grid content-start gap-3 text-sm text-parchment/65">
          <span className="eyebrow mb-2 text-brass">Your shelf</span>
          <Link href="#library" className="hover:text-parchment">My Library <ArrowUpRight className="ml-1 inline" size={13} /></Link>
          <Link href="#reading-goals" className="hover:text-parchment">Reading goals</Link>
          <Link href="#wishlist" className="hover:text-parchment">Wishlist</Link>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1440px] justify-between border-t border-parchment/15 pt-5 text-[10px] uppercase tracking-[.18em] text-parchment/40">
        <span>Readora © 2026</span><span>Made for readers</span>
      </div>
    </footer>
  );
}
