"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, RefreshCw, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { BookMetadata, SearchResponse } from "@/lib/books/types";
import { useHomeTheme } from "./home-theme-provider";

const categories = [
  { id: "all", label: "Curated Shelf" },
  { id: "fiction", label: "Fiction" },
  { id: "classics", label: "Classics" },
  { id: "fantasy", label: "Fantasy" },
  { id: "essays", label: "Essays" },
];

export function RecommendedSection({
  onSelectBook,
}: {
  onSelectBook: (book: BookMetadata) => void;
}) {
  const { reduceMotion } = useHomeTheme();
  const [books, setBooks] = useState<BookMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sourceLabel, setSourceLabel] = useState("Open Library + Google Books");
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadRecommendations() {
      setLoading(true);
      try {
        const queryParam = activeCategory === "all" ? "fiction" : activeCategory;
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(queryParam)}&type=subject&limit=10`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as SearchResponse;

        if (payload.items && payload.items.length > 0) {
          setBooks(payload.items);
          setSourceLabel(payload.sources.length ? payload.sources.map((s) => (s === "openlibrary" ? "Open Library" : "Google Books")).join(" + ") : "Open Catalog");
          setDegraded(payload.degraded);
        } else {
          // Fallback fetch from trending endpoint
          const trendingRes = await fetch(`/api/books/trending?limit=10`, { signal: controller.signal });
          const trendingData = (await trendingRes.json()) as SearchResponse;
          setBooks(trendingData.items ?? []);
          setSourceLabel("Open Library");
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setDegraded(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
    return () => controller.abort();
  }, [activeCategory]);

  return (
    <section className="relative overflow-hidden py-12 lg:py-20" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="mx-auto max-w-[1520px] px-4 sm:px-8">
        {/* Header & Category Pills */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}>
                <Sparkles size={15} style={{ color: "var(--accent-brass)" }} />
              </span>
              <p className="eyebrow" style={{ color: "var(--accent-brass)" }}>
                Live Catalog Discovery
              </p>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text-main)" }}>
              Recommended For You
            </h2>
            <p className="mt-1 text-xs" style={{ color: "var(--text-dim)" }}>
              Fetched directly from {sourceLabel} open metadata APIs.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border p-1" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}>
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    backgroundColor: active ? "var(--bg-desk)" : "transparent",
                    color: active ? "var(--accent-brass)" : "var(--text-muted)",
                    border: active ? "1px solid var(--border-strong)" : "1px solid transparent",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Environmental Shelf Container */}
        <div className="relative min-h-[380px] rounded-3xl border p-6 sm:p-10" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin" size={28} style={{ color: "var(--accent-brass)" }} />
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Curating physical jackets from open metadata...
              </p>
            </div>
          ) : books.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <BookOpen size={32} style={{ color: "var(--accent-brass)" }} />
              <h3 className="mt-3 font-display text-xl font-bold" style={{ color: "var(--text-main)" }}>
                The shelf is quiet.
              </h3>
              <p className="mt-1 text-xs" style={{ color: "var(--text-dim)" }}>
                No recommendations found for this category right now.
              </p>
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-4 flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-main)" }}
              >
                <RefreshCw size={13} />
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="shelf-ledge relative pb-6">
              {/* Grid of Books Resting on Wooden / Glass Shelf Ledge */}
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {books.map((book, idx) => (
                  <motion.div
                    key={book.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    whileHover={reduceMotion ? {} : { y: -10, scale: 1.03 }}
                    onClick={() => onSelectBook(book)}
                    className="group relative flex cursor-pointer flex-col"
                  >
                    {/* Book Cover Staging */}
                    <div
                      className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border spine-3d transition-all duration-300"
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
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="book-cloth absolute inset-0 p-4 flex flex-col justify-between" style={{ backgroundColor: "#1e1815", color: "#f4efe4" }}>
                          <div>
                            <span className="text-[9px] uppercase tracking-widest opacity-60">Readora Edition</span>
                            <h4 className="mt-2 font-display text-sm font-bold leading-snug line-clamp-3">{book.title}</h4>
                          </div>
                          <p className="text-[10px] opacity-75 truncate">{book.authors[0]}</p>
                        </div>
                      )}

                      {/* Source Provider Badge */}
                      <span
                        className="absolute right-2 top-2 rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", color: "var(--accent-brass)", borderColor: "var(--border-subtle)" }}
                      >
                        {book.source === "googlebooks" ? "Google" : "Open Library"}
                      </span>
                    </div>

                    {/* Meta info underneath */}
                    <div className="mt-3">
                      <h4 className="truncate font-display text-sm font-bold transition-colors group-hover:text-brass" style={{ color: "var(--text-main)" }}>
                        {book.title}
                      </h4>
                      <p className="truncate text-xs" style={{ color: "var(--text-dim)" }}>
                        {book.authors.join(", ")}
                      </p>

                      {book.subjects && book.subjects.length > 0 && (
                        <span className="mt-1.5 inline-block truncate rounded-md border px-2 py-0.5 text-[10px] font-medium" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)", backgroundColor: "var(--bg-desk)" }}>
                          {book.subjects[0]}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-8 flex items-center justify-between border-t pt-4 text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-dim)" }}>
            <span>Showing real metadata from public API providers.</span>
            {degraded && <span className="text-amber-500 font-medium">Degraded connection mode active</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
