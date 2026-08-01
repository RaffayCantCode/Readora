"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";

export function SeriesCard({
  onInspectBook,
}: {
  onInspectBook?: (book: BookMetadata) => void;
}) {
  const seriesBook: BookMetadata = {
    id: "fixture:ice-horse-series",
    title: "A Legend of Ice and Fire: The Ice Horse",
    authors: ["George R.R. Martin"],
    description: "An epic tale from Westeros, following the mythical Ice Dragon and the winter legends of the Far North.",
    subjects: ["Series", "Epic Fantasy"],
    publishedYear: 2020,
    publisher: "Bantam Spectra",
    pageCount: 480,
    isbns: ["9780553805444"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780553805444-L.jpg",
    sourceLinks: [],
    providerIds: {},
    source: "merged",
  };

  return (
    <section className="my-8">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold tracking-tight" style={{ color: "var(--text-main)" }}>
          New Series Collection
        </h3>
        <span className="text-xs font-semibold tracking-widest uppercase opacity-40">••</span>
      </div>

      {/* Series Horizontal Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => onInspectBook && onInspectBook(seriesBook)}
        className="group cursor-pointer flex items-center gap-5 rounded-2xl border p-4 shadow-sm transition"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)",
        }}
      >
        {/* Book Spine Stack Graphic */}
        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border spine-3d shadow-md" style={{ backgroundColor: "#1c2b36", borderColor: "var(--border-strong)" }}>
          <Image
            src="https://covers.openlibrary.org/b/isbn/9780553805444-L.jpg"
            alt="Series Stack"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="truncate font-display text-base font-bold transition-colors group-hover:text-brass" style={{ color: "var(--text-main)" }}>
            A Legend of Ice and Fire: The Ice Horse
          </h4>
          <p className="mt-1 text-xs" style={{ color: "var(--text-dim)" }}>
            8 chapters each vol
          </p>
        </div>

        {/* Badge */}
        <div className="rounded-xl border px-3 py-1.5 text-xs font-bold" style={{ borderColor: "var(--border-subtle)", color: "var(--accent-brass)", backgroundColor: "var(--bg-desk)" }}>
          2 vol
        </div>
      </motion.div>
    </section>
  );
}
