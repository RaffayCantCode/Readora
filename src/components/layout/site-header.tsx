import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ReadoraWordmark } from "@/components/brand/readora-wordmark";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { SiteNav } from "./site-nav";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-12">
        <Link href="/" aria-label="Readora home"><ReadoraWordmark size="sm" /></Link>
        <SiteNav />
        <div className="flex items-center gap-3">
          <Button variant="quiet" size="sm" className="hidden sm:inline-flex">Sign in</Button>
          <Button variant="primary" size="sm" className="hidden sm:inline-flex">Open my shelf <ArrowUpRight size={14} /></Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
