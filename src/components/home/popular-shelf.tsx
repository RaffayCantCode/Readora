"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Flame } from "lucide-react";
import type { BookMetadata, SearchResponse } from "@/lib/books/types";
import { fixtureBooks } from "@/lib/library/fixtures";
import { Book3D } from "@/components/ui/book-3d";
import { useHomeTheme } from "./home-theme-provider";

export function PopularShelf({
  onInspectBook,
}: {
  onInspectBook?: (book: BookMetadata) => void;
}) {
  const { theme, reduceMotion } = useHomeTheme();
  const [popularBooks, setPopularBooks] = useState<BookMetadata[]>([
    fixtureBooks[1],
    fixtureBooks[2],
    fixtureBooks[3],
    fixtureBooks[4],
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLiveTrending() {
      setLoading(true);
      try {
        const res = await fetch("/api/books/trending");
        const data = (await res.json()) as SearchResponse;
        if (data.items && data.items.length >= 4) {
          setPopularBooks(data.items.slice(0, 4));
        }
      } catch {
        // Fallback to fixture popular books
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
        {/* Books 3D Grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 items-end justify-items-center">
          {popularBooks.map((book, idx) => (
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

        {/* Physical Shelf Ledge Underneath */}
        <div className={`mt-6 h-5 w-full rounded-b-xl ${shelfLedgeClass}`} />
      </div>
    </section>
  );
}


