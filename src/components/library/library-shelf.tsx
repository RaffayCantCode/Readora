"use client";

import { motion } from "framer-motion";
import type { BookMetadata } from "@/lib/books/types";
import { BookObject } from "./book-object";

export function LibraryShelf({ books, selectedId, reduceMotion, onInspect }: { books: BookMetadata[]; selectedId?: string; reduceMotion: boolean; onInspect: (book: BookMetadata) => void }) {
  return <div className="relative px-6 pb-5 pt-5 sm:px-10"><div className="flex min-h-[220px] items-end gap-2 overflow-hidden border-b-[14px] border-[#5a3825] bg-[linear-gradient(180deg,rgba(255,255,255,.035),transparent)] px-2 shadow-[0_18px_18px_rgb(0_0_0/.2)] sm:gap-3">{books.map((book, index) => <motion.div key={book.id} initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className={selectedId === book.id ? "rounded-sm ring-2 ring-brass ring-offset-2 ring-offset-[#38271e]" : ""}><BookObject book={book} onInspect={onInspect} reduceMotion={reduceMotion} /></motion.div>)}</div><div className="absolute bottom-0 left-0 right-0 h-4 rounded-sm bg-[#754a2e] shadow-[0_5px_5px_rgb(0_0_0/.25)]" /></div>;
}
