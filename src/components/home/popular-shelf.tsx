"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Flame } from "lucide-react";
import type { BookMetadata, SearchResponse } from "@/lib/books/types";
import { Book3D } from "@/components/ui/book-3d";
import { useHomeTheme } from "./home-theme-provider";

export function PopularShelf({
  onInspectBook,
}: {
  onInspectBook?: (book: BookMetadata) => void;
}) {
  const { theme, reduceMotion } = useHomeTheme();
  const [popularBooks, setPopularBooks] = useState<BookMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveTrending() {
      setLoading(true);
      try {
        const res = await fetch("/api/books/trending?limit=4");
        const data = (await res.json()) as SearchResponse;
        if (data.items && data.items.length > 0) {
          setPopularBooks(data.items.slice(0, 4));
        }
      } catch {
        // Safe handling
      } finally {
        setLoading(false);
      }
    }

    fetchLiveTrending();
  }, []);

  // Dynamic shelf ledge class based on active theme
  const shelfLedgeClass = {
    library: "shelf-ledge-wood",
    glass: "shelf-ledge-glass",
    classic: "shelf-ledge-classic",
    dark: "shelf-ledge-dark",
  }[theme];

  return (
    <section className="my-10">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="eyebrow flex items-center gap-1.5" style={{ color: "var(--accent-brass)" }}>
            <Flame size={14} />
            <span>Real-time Trending</span>
          </span>
          <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text-main)" }}>
            Popular Now
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="animate-spin text-brass" size={16} />
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
            {loading ? "Syncing..." : "Live Today"}
          </span>
        </div>
      </div>

      {/* Real 3D Books Standing on Physical Shelf Ledge */}
      <div className="relative pt-6 pb-12 px-4 rounded-3xl border shadow-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader2 className="animate-spin text-brass" size={28} />
          </div>
        ) : popularBooks.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center text-xs opacity-60">
            Searching live web catalog... Type any book in the search bar above to inspect live editions.
          </div>
        ) : (
          /* Books 3D Grid */
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 items-end justify-items-center">
            {popularBooks.filter(Boolean).map((book, idx) => (
              <motion.div
                key={book.id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Book3D
                  book={book}
                  onClick={() => onInspectBook && onInspectBook(book)}
                  size="md"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Physical Shelf Ledge Underneath */}
        <div className={`mt-6 h-5 w-full rounded-b-xl ${shelfLedgeClass}`} />
      </div>
    </section>
  );
}
