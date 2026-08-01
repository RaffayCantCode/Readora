"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";
import { fixtureBooks } from "@/lib/library/fixtures";
import { useHomeTheme } from "./home-theme-provider";

export function PopularShelf({
  onInspectBook,
}: {
  onInspectBook?: (book: BookMetadata) => void;
}) {
  const { reduceMotion } = useHomeTheme();

  const popularBooks: BookMetadata[] = [
    fixtureBooks[1], // The World of Ice & Fire
    fixtureBooks[2], // Fantastic Beasts
    fixtureBooks[3], // A Game of Thrones
    fixtureBooks[4], // The Wise Man's Fear
  ];

  return (
    <section className="my-8">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--text-main)" }}>
          Popular Now
        </h3>
        <span className="text-xs font-semibold tracking-widest uppercase opacity-40">••</span>
      </div>

      {/* Grid of Real Standing 3D Hardcover Books */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {popularBooks.map((book, idx) => (
          <motion.div
            key={book.id}
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            whileHover={reduceMotion ? {} : { y: -8, scale: 1.03 }}
            onClick={() => onInspectBook && onInspectBook(book)}
            className="group cursor-pointer flex flex-col"
          >
            {/* Real 3D Book Jacket Presentation */}
            <div
              className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border spine-3d transition-all duration-300 shadow-xl"
              style={{
                backgroundColor: "var(--bg-desk)",
                borderColor: "var(--border-subtle)",
              }}
            >
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="book-cloth absolute inset-0 p-4 flex flex-col justify-between" style={{ backgroundColor: "#1e1815", color: "#f4efe4" }}>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest opacity-60">Readora</span>
                    <h4 className="mt-2 font-display text-sm font-bold leading-snug">{book.title}</h4>
                  </div>
                  <p className="text-[10px] opacity-75">{book.authors[0]}</p>
                </div>
              )}

              {/* Realistic Drop Shadow underneath */}
              <div className="absolute -bottom-3 inset-x-2 h-3 rounded-full bg-black/50 blur-md transition-all group-hover:bg-black/70 group-hover:blur-lg" />
            </div>

            {/* Title & Volume Metadata */}
            <div className="mt-3.5 space-y-1">
              <h4 className="truncate font-display text-sm font-bold transition-colors group-hover:text-brass" style={{ color: "var(--text-main)" }}>
                {book.title}
              </h4>
              <p className="truncate text-xs" style={{ color: "var(--text-dim)" }}>
                {book.authors.join(", ")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
