"use client";

import { Grid2X2, List, Search, SlidersHorizontal, Sparkles, Waves } from "lucide-react";
import type { LibraryMode } from "@/lib/library/types";

export function LibraryControls({ mode, onModeChange, query, onQueryChange, reduceMotion, onReduceMotion, view, onViewChange }: { mode: LibraryMode; onModeChange: (mode: LibraryMode) => void; query: string; onQueryChange: (query: string) => void; reduceMotion: boolean; onReduceMotion: (value: boolean) => void; view: "grid" | "list"; onViewChange: (view: "grid" | "list") => void }) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => onModeChange("immersive")} className={"flex h-9 items-center gap-2 rounded-[8px] px-3 text-xs font-semibold transition " + (mode === "immersive" ? "bg-brass text-archive" : "border border-white/10 text-stone hover:border-brass/60 hover:text-parchment")}>
          <Sparkles size={14} />
          Immersive
        </button>
        <button onClick={() => onModeChange("classic")} className={"flex h-9 items-center gap-2 rounded-[8px] px-3 text-xs font-semibold transition " + (mode === "classic" ? "bg-parchment text-archive" : "border border-white/10 text-stone hover:border-parchment/50 hover:text-parchment")}>
          <SlidersHorizontal size={14} />
          Classic
        </button>
        <button onClick={() => onReduceMotion(!reduceMotion)} className="flex h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-xs text-stone transition hover:border-brass/50 hover:text-parchment">
          <Waves size={14} />
          {reduceMotion ? "Reduced motion" : "Motion"}
        </button>
      </div>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex h-10 min-w-0 items-center gap-2 rounded-[8px] border border-white/12 bg-white/[0.03] px-3 text-sm text-parchment sm:w-[360px]">
          <Search size={16} className="shrink-0 text-brass" />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search title, author, subject" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-stone/55" />
        </label>
        {mode === "classic" && (
          <div className="flex h-10 w-fit rounded-[8px] border border-white/10 p-1">
            <button onClick={() => onViewChange("grid")} aria-label="Grid view" className={"rounded-[6px] px-2 transition " + (view === "grid" ? "bg-parchment text-archive" : "text-stone hover:text-parchment")}><Grid2X2 size={15} /></button>
            <button onClick={() => onViewChange("list")} aria-label="List view" className={"rounded-[6px] px-2 transition " + (view === "list" ? "bg-parchment text-archive" : "text-stone hover:text-parchment")}><List size={15} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
