"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "./site-nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <Button variant="icon" size="sm" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
        {open ? <X size={17} /> : <Menu size={17} />}
      </Button>
      {open && (
        <div className="absolute inset-x-4 top-[calc(100%+12px)] z-20 rounded-2xl border border-walnut/10 bg-parchment p-6 shadow-[0_20px_50px_rgb(var(--walnut)/.16)]">
          <SiteNav mobile onSelect={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
