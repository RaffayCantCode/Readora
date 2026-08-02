"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layers, ChevronRight, BookMarked, Loader2 } from "lucide-react";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";
import type { BookSeriesItem } from "@/lib/books/series-service";

const INITIAL_SERIES_PLACEHOLDERS: BookSeriesItem[] = [
  {
    id: "series-dune",
    title: "Dune Chronicles",
    author: "Frank Herbert",
    volumes: "6 Volumes",
    chapters: "504 pages per vol",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
    extraCovers: ["https://covers.openlibrary.org/b/isbn/9780441104024-M.jpg"],
    sampleBook: {
      id: "fixture:dune",
      title: "Dune",
      authors: ["Frank Herbert"],
      description: "Set on the desert planet Arrakis, Dune is the story of Paul Atreides.",
      subjects: ["Science Fiction", "Series"],
      publishedYear: 1965,
      publisher: "Chilton Books",
      pageCount: 688,
      isbns: ["9780441172719"],
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
      sourceLinks: [],
      providerIds: {},
      source: "merged",
    },
  },
  {
    id: "series-potter",
    title: "Harry Potter Collection",
    author: "J.K. Rowling",
    volumes: "7 Volumes",
    chapters: "302 pages per vol",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780439064873-L.jpg",
    extraCovers: ["https://covers.openlibrary.org/b/isbn/9780590353427-M.jpg"],
    sampleBook: {
      id: "fixture:hp1",
      title: "Harry Potter and the Sorcerer's Stone",
      authors: ["J.K. Rowling"],
      description: "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat.",
      subjects: ["Fantasy", "Series"],
      publishedYear: 1997,
      publisher: "Scholastic",
      pageCount: 309,
      isbns: ["9780439064873"],
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780439064873-L.jpg",
      sourceLinks: [],
      providerIds: {},
      source: "merged",
    },
  },
  {
    id: "series-ice-fire",
    title: "A Song of Ice & Fire",
    author: "George R.R. Martin",
    volumes: "5 Volumes",
    chapters: "801 pages per vol",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780553103540-L.jpg",
    extraCovers: ["https://covers.openlibrary.org/b/isbn/9780553805444-M.jpg"],
    sampleBook: {
      id: "fixture:got",
      title: "A Game of Thrones",
      authors: ["George R.R. Martin"],
      description: "Summers span decades. Winters can last a lifetime. And the struggle for the Iron Throne has begun.",
      subjects: ["Epic Fantasy", "Series"],
      publishedYear: 1996,
      publisher: "Bantam Spectra",
      pageCount: 694,
      isbns: ["9780553103540"],
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780553103540-L.jpg",
      sourceLinks: [],
      providerIds: {},
      source: "merged",
    },
  },
  {
    id: "series-wheel-time",
    title: "The Wheel of Time",
    author: "Robert Jordan",
    volumes: "14 Volumes",
    chapters: "782 pages per vol",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780812511818-L.jpg",
    extraCovers: ["https://covers.openlibrary.org/b/isbn/9780812513751-M.jpg"],
    sampleBook: {
      id: "fixture:wot",
      title: "The Eye of the World",
      authors: ["Robert Jordan"],
      description: "The Wheel of Time turns and Ages come and pass, leaving memories that become legend.",
      subjects: ["Epic Fantasy", "Series"],
      publishedYear: 1990,
      publisher: "Tor Books",
      pageCount: 814,
      isbns: ["9780812511818"],
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780812511818-L.jpg",
      sourceLinks: [],
      providerIds: {},
      source: "merged",
    },
  },
];

export function SeriesCard({
  onInspectBook,
}: {
  onInspectBook?: (book: BookMetadata) => void;
}) {
  const [seriesList, setSeriesList] = useState<BookSeriesItem[]>(INITIAL_SERIES_PLACEHOLDERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLiveSeries() {
      setLoading(true);
      try {
        const res = await fetch("/api/books/series?limit=4");
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setSeriesList(data.items);
        }
      } catch {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    }

    fetchLiveSeries();
  }, []);

  return (
    <section className="my-10">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="eyebrow flex items-center gap-1.5" style={{ color: "var(--accent-brass)" }}>
            <Layers size={14} />
            <span>Live Collections</span>
          </span>
          <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text-main)" }}>
            Popular Book Series
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="animate-spin text-brass" size={16} />
          ) : (
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
            {loading ? "Loading live series..." : "Live Catalog"}
          </span>
        </div>
      </div>

      {/* Series Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {loading && seriesList.length === 0 ? (
          <div className="col-span-2 flex h-32 items-center justify-center gap-3 rounded-3xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}>
            <Loader2 className="animate-spin text-brass" size={24} />
            <span className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Fetching live series collections...</span>
          </div>
        ) : (
          seriesList.map((series) => (
            <motion.div
              key={series.id}
              whileHover={{ y: -4, scale: 1.01 }}
              onClick={() => onInspectBook && onInspectBook(series.sampleBook)}
              className="group cursor-pointer flex items-center gap-5 rounded-3xl border p-5 shadow-lg transition-all"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-subtle)",
              }}
            >
              {/* 3D Overlapping Book Cover Stack Visualizer */}
              <div className="relative h-28 w-20 shrink-0 preserve-3d py-1">
                {/* Back Book in Stack */}
                {series.extraCovers?.[0] && (
                  <div className="absolute inset-0 translate-x-3 -translate-y-2 rotate-6 rounded-lg overflow-hidden border opacity-60 shadow-md transition-transform duration-300 group-hover:translate-x-4 group-hover:-translate-y-3" style={{ backgroundColor: "#1c1917", borderColor: "var(--border-subtle)" }}>
                    <Image src={series.extraCovers[0]} alt="" fill className="object-cover" unoptimized />
                  </div>
                )}

                {/* Middle Book in Stack */}
                <div className="absolute inset-0 translate-x-1.5 -translate-y-1 rotate-3 rounded-lg overflow-hidden border opacity-85 shadow-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-1.5" style={{ backgroundColor: "#241913", borderColor: "var(--border-subtle)" }}>
                  <Image src={series.coverUrl} alt="" fill className="object-cover" unoptimized />
                </div>

                {/* Main Front 3D Hardcover */}
                <div className="relative h-full w-full overflow-hidden rounded-lg border spine-3d shadow-2xl transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: "#1e1815", borderColor: "var(--border-strong)" }}>
                  <Image
                    src={series.coverUrl}
                    alt={series.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Glossy reflection streak */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--accent-brass)" }}>
                  <BookMarked size={12} />
                  <span>{series.volumes}</span>
                </span>

                <h4 className="truncate font-display text-base font-bold transition-colors group-hover:text-brass" style={{ color: "var(--text-main)" }}>
                  {series.title}
                </h4>
                <p className="truncate text-xs" style={{ color: "var(--text-dim)" }}>
                  by {series.author}
                </p>
                <p className="text-[10px] opacity-75" style={{ color: "var(--text-muted)" }}>
                  {series.chapters}
                </p>
              </div>

              {/* Arrow Icon */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition group-hover:bg-brass group-hover:text-black" style={{ borderColor: "var(--border-subtle)", color: "var(--text-main)" }}>
                <ChevronRight size={16} />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}


