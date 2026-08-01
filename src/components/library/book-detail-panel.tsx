"use client";

import { ArrowUpRight, Bookmark, Check, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { BookMetadata } from "@/lib/books/types";
import { getBookProgress, getBookSkin } from "./book-object";

export function BookDetailPanel({ book, onClose, onRead }: { book: BookMetadata; onClose: () => void; onRead: (book: BookMetadata) => void }) {
  const skin = getBookSkin(book);
  const progress = getBookProgress(book);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-archive/70 p-3 backdrop-blur-md sm:p-6" role="dialog" aria-modal="true" aria-label={book.title}>
      <div className="relative grid max-h-[calc(100vh-1.5rem)] w-full max-w-5xl overflow-y-auto rounded-[8px] border border-white/12 bg-parchment text-ink shadow-2xl sm:max-h-[calc(100vh-3rem)] lg:grid-cols-[330px_1fr]">
        <button onClick={onClose} aria-label="Close book details" className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-[8px] border border-archive/10 text-ink-soft transition hover:bg-archive hover:text-parchment"><X size={18} /></button>
        <div className="bg-archive p-8 text-parchment">
          <div className="relative mx-auto aspect-[2/3] max-w-[230px] overflow-hidden rounded-[8px] border border-white/25 book-cloth spine-shadow" style={{ backgroundColor: skin.base, color: skin.ink }}>
            {book.coverUrl ? (
              <Image src={book.coverUrl} alt="" fill sizes="230px" className="object-cover" unoptimized />
            ) : (
              <>
                <div className="absolute inset-y-0 left-0 w-[13%]" style={{ backgroundColor: skin.strip }} />
                <div className="absolute inset-7 flex flex-col justify-between">
                  <p className="font-display text-4xl leading-none">{book.title}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] opacity-75">{book.authors[0]}</p>
                </div>
              </>
            )}
            {progress > 0 && <span className="absolute bottom-0 left-0 h-1.5" style={{ width: `${progress}%`, backgroundColor: skin.accent }} />}
          </div>
        </div>
        <div className="p-7 sm:p-10">
          <p className="eyebrow text-oxblood">Book in focus</p>
          <h2 className="mt-5 max-w-2xl font-display text-5xl leading-none">{book.title}</h2>
          <p className="mt-4 text-sm text-ink-soft">{book.authors.join(", ")}</p>
          <p className="mt-7 max-w-2xl text-sm leading-7 text-ink-soft">{book.description ?? "A book waiting to be discovered in your library."}</p>
          <div className="mt-7 flex flex-wrap gap-2">{book.subjects.slice(0, 4).map((subject) => <span key={subject} className="rounded-[6px] border border-archive/10 bg-stone/40 px-3 py-1 text-xs text-ink-soft">{subject}</span>)}</div>
          <div className="mt-9 grid gap-px overflow-hidden rounded-[8px] border border-archive/10 bg-archive/10 sm:grid-cols-4">
            <span className="bg-parchment p-4 text-xs text-ink-soft"><strong className="block font-display text-2xl leading-none text-ink">{book.publishedYear ?? "-"}</strong>Published</span>
            <span className="bg-parchment p-4 text-xs text-ink-soft"><strong className="block font-display text-2xl leading-none text-ink">{book.pageCount ?? "-"}</strong>Pages</span>
            <span className="bg-parchment p-4 text-xs text-ink-soft"><strong className="block font-display text-2xl leading-none text-ink">{progress}%</strong>Progress</span>
            <span className="bg-parchment p-4 text-xs text-ink-soft"><strong className="block truncate font-display text-xl leading-none text-ink">{book.publisher ?? "Library"}</strong>Publisher</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => onRead(book)}>Read this book <ArrowUpRight size={15} /></Button>
            <Button variant="outline"><Bookmark size={15} /> Bookmark</Button>
            <Button variant="quiet"><Check size={15} /> Collection</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
