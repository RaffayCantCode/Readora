import type { BookCoverData } from "@/lib/content";

export function BookCover({ book, compact = false }: { book: BookCoverData; compact?: boolean }) {
  return (
    <div className={"group relative aspect-[2/3] overflow-hidden rounded-[3px] shadow-[12px_16px_25px_rgb(var(--walnut)/.18)] transition duration-500 hover:-translate-y-2 hover:shadow-[16px_22px_30px_rgb(var(--walnut)/.24)] " + (compact ? "w-24 sm:w-28" : "w-full")}>
      <div className="absolute inset-0" style={{ backgroundColor: book.color }}>
        <div className="absolute inset-3 border border-white/30" />
        <div className="absolute -right-8 top-10 h-28 w-28 rounded-full border-[16px] border-white/10" />
        <div className="absolute bottom-8 left-1/2 h-px w-1/2 -translate-x-1/2 bg-white/50" />
        <div className="absolute inset-x-5 bottom-5 text-center text-[10px] uppercase tracking-[.22em] text-white/80">{book.mark}</div>
        <div className="absolute inset-x-4 top-8 text-center font-display text-[clamp(.9rem,1.8vw,1.45rem)] leading-[.95] text-white">{book.title}</div>
        <div className="absolute bottom-12 inset-x-3 text-center text-[9px] uppercase tracking-[.16em]" style={{ color: book.accent }}>{book.author}</div>
      </div>
    </div>
  );
}
