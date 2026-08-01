"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Circle, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";
import { BookObject, getBookProgress, getBookSkin } from "./book-object";

function getCollection(book: BookMetadata) {
  return "collection" in book && typeof book.collection === "string" ? book.collection : book.subjects[0] ?? "Unsorted";
}

function getLastRead(book: BookMetadata) {
  return "lastRead" in book && typeof book.lastRead === "string" ? book.lastRead : "Not started";
}

export function LibraryRoom({ books, aisle, onAisleChange, reduceMotion, onInspect, onRead }: { books: BookMetadata[]; aisle: number; onAisleChange: (aisle: number) => void; reduceMotion: boolean; onInspect: (book: BookMetadata) => void; onRead: (book: BookMetadata) => void }) {
  const aisleCount = Math.max(1, books.length);
  const featured = books[aisle] ?? books[0];
  const rail = books.length ? [...books.slice(aisle + 1), ...books.slice(0, aisle + 1)].slice(0, 12) : [];

  if (!featured) {
    return (
      <div className="catalog-stage flex min-h-[620px] items-center justify-center border-y border-white/10 px-5 text-center">
        <div>
          <p className="eyebrow text-brass">No matches</p>
          <h2 className="mt-4 font-display text-4xl text-parchment">The shelf is quiet.</h2>
          <p className="mt-3 text-sm text-stone">Try a different title, author, or subject.</p>
        </div>
      </div>
    );
  }

  const skin = getBookSkin(featured);
  const progress = getBookProgress(featured);

  return (
    <div className="catalog-stage relative min-h-[calc(100vh-116px)] overflow-hidden border-y border-white/10">
      <div className="absolute inset-0 fine-grid opacity-50" />
      <div className="absolute inset-x-0 top-[16%] h-px bg-white/10" />
      <div className="absolute inset-x-0 bottom-[22%] h-[18px] bg-[linear-gradient(180deg,rgb(255_255_255/.08),rgb(0_0_0/.28))]" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-116px)] max-w-[1720px] grid-rows-[auto_1fr_auto] px-4 pb-5 pt-7 sm:px-7 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow text-brass">My collection / catalog wall</p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl leading-none text-parchment sm:text-7xl">Readora</h1>
          </div>
          <div className="grid max-w-xl grid-cols-3 gap-2 text-xs text-stone">
            {["Newest", "Classics", "In progress"].map((label, index) => (
              <button key={label} className={"rounded-[8px] border px-3 py-2 text-left transition " + (index === 2 ? "border-brass/60 bg-brass/12 text-parchment" : "border-white/10 bg-white/[0.03] hover:border-white/25")}>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-stone/60">Filter</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid items-center gap-8 py-8 lg:grid-cols-[280px_minmax(420px,1fr)_330px]">
          <div className="hidden lg:block">
            <p className="text-[11px] uppercase tracking-[0.18em] text-stone/60">Aisle index</p>
            <div className="mt-5 space-y-3">
              {books.slice(0, 6).map((book, index) => (
                <button key={book.id} onClick={() => onAisleChange(index)} className={"flex w-full items-center gap-3 border-l-2 py-2 pl-3 text-left text-sm transition " + (index === aisle ? "border-brass text-parchment" : "border-white/10 text-stone hover:border-white/35 hover:text-parchment")}>
                  <Circle size={8} fill={index === aisle ? "currentColor" : "none"} />
                  <span className="truncate">{book.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[430px] items-center justify-center">
            <div className="absolute inset-x-[10%] bottom-8 h-10 bg-black/35 blur-2xl" />
            <motion.button
              key={featured.id}
              type="button"
              initial={reduceMotion ? false : { opacity: 0, y: 24, rotateY: -8 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
              onClick={() => onInspect(featured)}
              className="group relative h-[390px] w-[255px] overflow-hidden rounded-[8px] border border-white/25 book-cloth spine-shadow focus-visible:outline-none sm:h-[460px] sm:w-[300px]"
              style={{ backgroundColor: skin.base, color: skin.ink }}
            >
              {featured.coverUrl ? (
                <Image src={featured.coverUrl} alt="" fill priority sizes="300px" className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
              ) : (
                <>
                  <div className="absolute inset-y-0 left-0 w-[13%]" style={{ backgroundColor: skin.strip }} />
                  <div className="absolute inset-x-8 top-8 h-px opacity-70" style={{ backgroundColor: skin.accent }} />
                  <div className="absolute inset-8 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] opacity-70">{getCollection(featured)}</p>
                      <h2 className="mt-8 font-display text-5xl leading-none sm:text-6xl">{featured.title}</h2>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] opacity-75">{featured.authors.join(", ")}</p>
                      <div className="mt-5 h-1.5 bg-black/25">
                        <span className="block h-full" style={{ width: `${progress}%`, backgroundColor: skin.accent }} />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {featured.coverUrl && (
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/30">
                  <span className="block h-full" style={{ width: `${progress}%`, backgroundColor: skin.accent }} />
                </div>
              )}
              <span className="absolute right-5 top-5 rounded-[6px] border border-current/25 px-2 py-1 text-[10px] uppercase tracking-[0.16em] opacity-80">{featured.publishedYear ?? "Read"}</span>
              <span className="sr-only">Inspect {featured.title}</span>
            </motion.button>
          </div>

          <aside className="border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="eyebrow text-brass">In focus</p>
            <h2 className="mt-4 font-display text-4xl leading-none text-parchment">{featured.title}</h2>
            <p className="mt-3 text-sm text-stone">{featured.authors.join(", ")}{featured.publishedYear ? ` / ${featured.publishedYear}` : ""}</p>
            <p className="mt-6 line-clamp-5 text-sm leading-7 text-stone">{featured.description ?? "A book waiting to be opened in your library."}</p>
            <div className="mt-7 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.03] p-3">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-stone/55">Progress</span>
                <strong className="mt-2 block font-display text-3xl text-parchment">{progress}%</strong>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.03] p-3">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-stone/55">Last read</span>
                <strong className="mt-3 flex items-center gap-2 text-sm text-parchment"><Clock3 size={14} /> {getLastRead(featured)}</strong>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              <button onClick={() => onRead(featured)} className="flex h-10 items-center gap-2 rounded-[8px] bg-brass px-4 text-sm font-semibold text-archive transition hover:bg-parchment">
                Read
                <ArrowUpRight size={15} />
              </button>
              <button onClick={() => onInspect(featured)} className="h-10 rounded-[8px] border border-white/15 px-4 text-sm text-parchment transition hover:border-white/35">Inspect</button>
            </div>
          </aside>
        </div>

        <div className="border-t border-white/10 pt-5">
          <div className="flex items-end justify-between gap-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-stone/60">Shelf rail / {String(aisle + 1).padStart(2, "0")} of {String(aisleCount).padStart(2, "0")}</p>
            <div className="flex gap-2">
              <button onClick={() => onAisleChange((aisle - 1 + aisleCount) % aisleCount)} aria-label="Previous book" className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 text-stone transition hover:border-brass/50 hover:text-parchment"><ChevronLeft size={17} /></button>
              <button onClick={() => onAisleChange((aisle + 1) % aisleCount)} aria-label="Next book" className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 text-stone transition hover:border-brass/50 hover:text-parchment"><ChevronRight size={17} /></button>
            </div>
          </div>
          <div className="mt-4 flex min-h-[230px] items-end gap-3 overflow-x-auto pb-3">
            {rail.map((book, index) => (
              <motion.div key={book.id} initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }}>
                <BookObject book={book} reduceMotion={reduceMotion} onInspect={onInspect} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
