"use client";

import { BookOpen, Clock3, Heart, LibraryBig } from "lucide-react";
import type { BookMetadata } from "@/lib/books/types";
import { BookObject, getBookProgress } from "./book-object";

export function ClassicLibrary({ books, view, reduceMotion, onInspect }: { books: BookMetadata[]; view: "grid" | "list"; reduceMotion: boolean; onInspect: (book: BookMetadata) => void }) {
  const stats = [
    { icon: LibraryBig, label: "All books", value: String(books.length) },
    { icon: Clock3, label: "Recently read", value: String(books.filter((book) => "lastRead" in book).length || 0) },
    { icon: Heart, label: "Favorites", value: String(books.filter((book) => "favorite" in book && book.favorite).length || 0) },
    { icon: BookOpen, label: "In progress", value: String(books.filter((book) => getBookProgress(book) > 0 && getBookProgress(book) < 100).length) },
  ];

  return (
    <div className="bg-parchment px-5 py-8 text-ink sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 grid gap-px overflow-hidden rounded-[8px] border border-archive/10 bg-archive/10 sm:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-parchment p-4">
              <Icon size={17} className="text-oxblood" />
              <span className="mt-4 block text-[11px] uppercase tracking-[0.16em] text-ink-soft">{label}</span>
              <strong className="mt-1 block font-display text-3xl leading-none">{value}</strong>
            </div>
          ))}
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {books.map((book) => <BookObject key={book.id} book={book} displayMode="card" reduceMotion={reduceMotion} onInspect={onInspect} />)}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[8px] border border-archive/10">
            {books.map((book) => (
              <button key={book.id} onClick={() => onInspect(book)} className="grid w-full grid-cols-[44px_1fr_auto] items-center gap-4 border-b border-archive/10 bg-parchment px-4 py-4 text-left transition last:border-b-0 hover:bg-stone/35">
                <div className="h-14 rounded-[4px] bg-oxblood book-cloth" />
                <div className="min-w-0">
                  <p className="truncate font-display text-xl leading-tight">{book.title}</p>
                  <p className="mt-1 truncate text-xs text-ink-soft">{book.authors.join(", ")}{book.publishedYear ? ` / ${book.publishedYear}` : ""}</p>
                </div>
                <span className="hidden text-xs text-ink-soft sm:inline">{getBookProgress(book)}%</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
