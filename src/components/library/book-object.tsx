"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";

const skins = [
  { base: "#2f5948", accent: "#c78d3d", ink: "#f4efe4", strip: "#8e2f32" },
  { base: "#1f5fbf", accent: "#f4efe4", ink: "#f4efe4", strip: "#e34234" },
  { base: "#8e2f32", accent: "#c78d3d", ink: "#f4efe4", strip: "#1e1815" },
  { base: "#f4efe4", accent: "#1e1815", ink: "#1e1815", strip: "#e34234" },
  { base: "#141414", accent: "#e34234", ink: "#f4efe4", strip: "#c78d3d" },
  { base: "#c78d3d", accent: "#1e1815", ink: "#1e1815", strip: "#2f5948" },
  { base: "#593c8f", accent: "#f4efe4", ink: "#f4efe4", strip: "#c78d3d" },
  { base: "#d7d1c4", accent: "#1f5fbf", ink: "#1e1815", strip: "#1e1815" },
];

export function getBookSkin(book: BookMetadata) {
  const seed = Array.from(book.title).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return skins[seed % skins.length];
}

export function getBookProgress(book: BookMetadata) {
  return "progress" in book && typeof book.progress === "number" ? book.progress : 0;
}

function firstWords(title: string) {
  return title.split(" ").slice(0, 5).join(" ");
}

export function BookObject({ book, displayMode = "shelf", onInspect, reduceMotion = false }: { book: BookMetadata; displayMode?: "shelf" | "card"; onInspect: (book: BookMetadata) => void; reduceMotion?: boolean }) {
  const skin = getBookSkin(book);
  const progress = getBookProgress(book);

  if (displayMode === "card") {
    return (
      <motion.button type="button" layout={!reduceMotion} whileHover={reduceMotion ? undefined : { y: -5 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} onClick={() => onInspect(book)} className="group w-full text-left focus-visible:outline-none">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[8px] border border-archive/15 book-cloth spine-shadow" style={{ backgroundColor: skin.base, color: skin.ink }}>
          {book.coverUrl ? (
            <Image src={book.coverUrl} alt="" fill sizes="(min-width: 1024px) 16vw, 45vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
          ) : (
            <>
              <div className="absolute inset-y-0 left-0 w-[13%]" style={{ backgroundColor: skin.strip }} />
              <div className="absolute inset-x-5 top-5 h-px opacity-70" style={{ backgroundColor: skin.accent }} />
              <div className="absolute inset-5 flex flex-col justify-between">
                <p className="font-display text-2xl leading-none">{firstWords(book.title)}</p>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] opacity-75">{book.authors[0]}</p>
                  {progress > 0 && <div className="mt-3 h-1 bg-black/20"><span className="block h-full" style={{ width: `${progress}%`, backgroundColor: skin.accent }} /></div>}
                </div>
              </div>
            </>
          )}
          {book.coverUrl && progress > 0 && (
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/30">
              <span className="block h-full" style={{ width: `${progress}%`, backgroundColor: skin.accent }} />
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="font-display text-xl leading-tight text-ink">{book.title}</p>
          <p className="mt-1 text-xs text-ink-soft">{book.authors.join(", ")}</p>
        </div>
        <span className="sr-only">Inspect {book.title}</span>
      </motion.button>
    );
  }

  const height = 188 + (book.title.length % 5) * 18;
  const width = 48 + (book.authors[0]?.length % 4) * 10;

  return (
    <motion.button
      type="button"
      layout={!reduceMotion}
      whileHover={reduceMotion ? undefined : { y: -18, rotateZ: -1.5, scale: 1.03 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      onClick={() => onInspect(book)}
      className="group relative shrink-0 text-left focus-visible:outline-none"
      style={{ width, height }}
    >
      <div className="relative h-full overflow-hidden rounded-[4px] border border-white/20 book-cloth spine-shadow transition duration-300 group-hover:border-brass/70" style={{ backgroundColor: skin.base, color: skin.ink }}>
        {book.coverUrl && <Image src={book.coverUrl} alt="" fill sizes="96px" className="object-cover opacity-45 grayscale contrast-125" unoptimized />}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/35" />
        <div className="absolute inset-y-0 left-0 w-[7px]" style={{ backgroundColor: skin.strip }} />
        <div className="absolute inset-y-3 left-3 w-px opacity-60" style={{ backgroundColor: skin.accent }} />
        <div className="absolute left-1/2 top-4 h-[calc(100%-4.5rem)] -translate-x-1/2 [writing-mode:vertical-rl]">
          <p className="font-display text-base leading-none drop-shadow-sm">{firstWords(book.title)}</p>
        </div>
        <p className="absolute bottom-5 left-2 right-2 truncate text-center text-[8px] uppercase tracking-[0.16em] opacity-80">{book.authors[0]}</p>
        {progress > 0 && <span className="absolute bottom-0 left-0 h-1.5" style={{ width: `${progress}%`, backgroundColor: skin.accent }} />}
      </div>
      <span className="sr-only">Inspect {book.title}</span>
    </motion.button>
  );
}
