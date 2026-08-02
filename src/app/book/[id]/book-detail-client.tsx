"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { BookMetadata, SearchResponse } from "@/lib/books/types";
import { fixtureBooks } from "@/lib/library/fixtures";
import { Book3D } from "@/components/ui/book-3d";
import { HomeThemeProvider, useHomeTheme } from "@/components/home/home-theme-provider";

type BookWithCollection = BookMetadata & { collection?: string };

export function BookDetailPageClient({ bookId }: { bookId: string }) {
  return (
    <HomeThemeProvider>
      <BookDetailContent bookId={bookId} />
    </HomeThemeProvider>
  );
}

function BookDetailContent({ bookId }: { bookId: string }) {
  const { reduceMotion } = useHomeTheme();
  const [book, setBook] = useState<BookWithCollection | null>(null);
  const [seriesBooks, setSeriesBooks] = useState<BookWithCollection[]>([]);
  const [similarBooks, setSimilarBooks] = useState<BookWithCollection[]>([]);

  useEffect(() => {
    async function loadBookData() {
      // 1. Find book from fixtures or query
      const decodedId = decodeURIComponent(bookId);
      const fixtureMatch = fixtureBooks.find(
        (b) => b.id === decodedId || b.title.toLowerCase() === decodedId.toLowerCase()
      );

      let currentBook: BookWithCollection | null = fixtureMatch ?? null;

      if (!currentBook) {
        try {
          const res = await fetch(`/api/books/search?q=${encodeURIComponent(decodedId)}&limit=6`);
          const data = (await res.json()) as SearchResponse;
          if (data.items && data.items.length > 0) {
            currentBook = data.items[0] as BookWithCollection;
          }
        } catch {
          // fallback
        }
      }

      if (!currentBook) {
        currentBook = fixtureBooks[0];
      }

      setBook(currentBook);

      // 2. Determine Series or Similar Books
      // Check if book is part of a known collection or series (e.g. Wizarding World / Harry Potter)
      const isWizarding = currentBook.collection === "Wizarding World" || currentBook.title.toLowerCase().includes("harry potter");
      
      if (isWizarding) {
        // Collect all series books
        const hpBooks = fixtureBooks.filter((b) => b.collection === "Wizarding World" || b.title.toLowerCase().includes("harry potter"));
        setSeriesBooks(hpBooks);
        setSimilarBooks([]);
      } else {
        // Check fixture collection or fetch similar
        const sameCollection = fixtureBooks.filter((b) => b.id !== currentBook.id && (b.collection === currentBook.collection || b.authors[0] === currentBook.authors[0]));
        
        if (sameCollection.length > 0) {
          setSeriesBooks(sameCollection);
          setSimilarBooks([]);
        } else {
          // Similar titles based on subjects
          const fallbackSimilar = fixtureBooks.filter((b) => b.id !== currentBook.id).slice(0, 4);
          setSeriesBooks([]);
          setSimilarBooks(fallbackSimilar);
        }
      }
    }

    loadBookData();
  }, [bookId]);

  const activeBook = book ?? fixtureBooks[0];
  const isSeries = seriesBooks.length > 0;
  const sidebarItems = isSeries ? seriesBooks : similarBooks;

  // Mock editorial review data
  const sampleReview = {
    author: "Christopher Reath",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quote: "A breathtaking achievement in worldbuilding and editorial craftsmanship. An essential masterwork for any serious catalog.",
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}>
      {/* Top Header Rail */}
      <header className="border-b py-4 px-6 sm:px-12 flex items-center justify-between" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}>
        <Link href="/" className="font-display text-xl font-bold tracking-tight flex items-center gap-2" style={{ color: "var(--text-main)" }}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brass text-black font-extrabold text-xs">R</span>
          <span>readora</span>
        </Link>

        <span className="text-xs uppercase font-extrabold tracking-widest text-dim hidden sm:inline" style={{ color: "var(--text-dim)" }}>
          Book Detail
        </span>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition hover:text-brass"
          style={{ color: "var(--text-main)" }}
        >
          <ArrowLeft size={15} />
          <span>Back to Library</span>
        </Link>
      </header>

      {/* Main Content Layout matching Gestalten Editorial Reference */}
      <main className="flex-1 mx-auto w-full max-w-[1520px] p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_280px] gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: 3D Cover Stage */}
          <div className="flex flex-col items-center justify-center pt-4">
            <div className="relative flex items-center justify-center w-full aspect-square max-w-[320px]">
              {/* Subtle Ambient Disc Highlight behind cover */}
              <div
                className="absolute inset-4 rounded-full opacity-30 transition-all"
                style={{
                  background: "radial-gradient(circle, var(--accent-brass) 0%, transparent 70%)",
                  filter: "blur(24px)",
                }}
              />

              {/* 3D Interactive Hardcover */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <Book3D book={activeBook} size="lg" showMetadata={false} />
              </motion.div>
            </div>

            {/* Click preview prompt */}
            <Link
              href={`/reader`}
              className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-extrabold transition hover:scale-105"
              style={{ color: "var(--text-dim)" }}
            >
              <BookOpen size={13} style={{ color: "var(--accent-brass)" }} />
              <span>Click for preview</span>
            </Link>
          </div>

          {/* CENTER COLUMN: Editorial Specifications & Description */}
          <div className="space-y-8 max-w-2xl">
            {/* Title & Author */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {activeBook.subjects?.slice(0, 3).map((sub) => (
                  <span
                    key={sub}
                    className="rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      borderColor: "var(--border-subtle)",
                      color: "var(--accent-brass)",
                      backgroundColor: "var(--accent-glow)",
                    }}
                  >
                    {sub}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-none" style={{ color: "var(--text-main)" }}>
                {activeBook.title}
              </h1>

              <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                by {activeBook.authors.join(", ")}
              </p>
            </div>

            {/* Italicized Lead Summary Quote */}
            <div className="border-l-2 pl-4 py-1" style={{ borderColor: "var(--accent-brass)" }}>
              <p className="font-serif italic text-base sm:text-lg leading-relaxed opacity-90" style={{ color: "var(--text-main)" }}>
                {activeBook.description ? `"${activeBook.description.slice(0, 140)}..."` : `"An extraordinary story of adventure and discovery, bringing rare editorial craftsmanship to life."`}
              </p>
            </div>

            {/* Full Body Description */}
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {activeBook.description ?? "Here in this remarkable work, the author presents a stunning narrative that spans vast horizons. For generations, readers have cherished the intricate world-building, deep characters, and unforgettable prose."}
            </p>

            {/* Editorial Specifications Grid matching Reference */}
            <div className="border-y py-6 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs" style={{ borderColor: "var(--border-subtle)" }}>
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-50 mb-0.5" style={{ color: "var(--text-dim)" }}>
                  Publisher
                </span>
                <span className="font-semibold" style={{ color: "var(--text-main)" }}>
                  {activeBook.publisher ?? "Gestalten Press"}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-50 mb-0.5" style={{ color: "var(--text-dim)" }}>
                  Release Date
                </span>
                <span className="font-semibold" style={{ color: "var(--text-main)" }}>
                  {activeBook.publishedYear ?? "May 2017"}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-50 mb-0.5" style={{ color: "var(--text-dim)" }}>
                  Format
                </span>
                <span className="font-semibold" style={{ color: "var(--text-main)" }}>
                  Hardcover (21 x 26 cm)
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-50 mb-0.5" style={{ color: "var(--text-dim)" }}>
                  Features
                </span>
                <span className="font-semibold" style={{ color: "var(--text-main)" }}>
                  Full color, {activeBook.pageCount ?? 256} pages
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-50 mb-0.5" style={{ color: "var(--text-dim)" }}>
                  Language
                </span>
                <span className="font-semibold" style={{ color: "var(--text-main)" }}>
                  English
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-50 mb-0.5" style={{ color: "var(--text-dim)" }}>
                  ISBN
                </span>
                <span className="font-semibold font-mono text-[11px]" style={{ color: "var(--text-main)" }}>
                  {activeBook.isbns?.[0] ?? "978-3-89955-698-8"}
                </span>
              </div>
            </div>

            {/* Reader Review Section */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brass shadow-sm">
                  <Image src={sampleReview.avatar} alt={sampleReview.author} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-60" style={{ color: "var(--text-dim)" }}>
                    Reviewed By
                  </span>
                  <strong className="text-xs font-bold" style={{ color: "var(--text-main)" }}>
                    {sampleReview.author}
                  </strong>
                </div>
              </div>
              <p className="font-serif italic text-xs leading-relaxed opacity-85" style={{ color: "var(--text-muted)" }}>
                &ldquo;{sampleReview.quote}&rdquo;
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Bookshelf Rail (Series or Similar Titles) */}
          <div className="rounded-3xl border p-6 space-y-6 shadow-xl" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
              <div>
                <span className="eyebrow block" style={{ color: "var(--accent-brass)" }}>
                  {isSeries ? "Book Series" : "Recommendations"}
                </span>
                <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-main)" }}>
                  {isSeries ? (activeBook.collection ?? "Series Collection") : "Similar Titles"}
                </h3>
              </div>
              <Layers size={18} style={{ color: "var(--accent-brass)" }} />
            </div>

            {/* Stack of Series / Similar Books */}
            <div className="space-y-5">
              {sidebarItems.map((item) => {
                const isActive = item.id === activeBook.id;
                return (
                  <Link
                    key={item.id}
                    href={`/book/${encodeURIComponent(item.id)}`}
                    className={`group relative flex items-center gap-4 rounded-2xl p-3 border transition duration-300 ${
                      isActive ? "shadow-md scale-[1.02]" : "hover:scale-[1.02]"
                    }`}
                    style={{
                      backgroundColor: isActive ? "var(--bg-desk)" : "var(--bg-main)",
                      borderColor: isActive ? "var(--accent-brass)" : "var(--border-subtle)",
                    }}
                  >
                    {/* Active Accent Bar on Left */}
                    {isActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-brass" />
                    )}

                    {/* Book Mini Cover */}
                    <div className="relative aspect-[2/3] w-14 shrink-0 overflow-hidden rounded-md border spine-3d shadow" style={{ borderColor: "var(--border-subtle)" }}>
                      {item.coverUrl ? (
                        <Image src={item.coverUrl} alt={item.title} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="book-cloth absolute inset-0 p-1 flex items-center justify-center text-center font-display text-[8px] font-bold text-parchment">
                          {item.title}
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <h4 className={`truncate font-display text-xs font-bold transition-colors ${isActive ? "text-brass" : "group-hover:text-brass"}`} style={{ color: isActive ? "var(--accent-brass)" : "var(--text-main)" }}>
                        {item.title}
                      </h4>
                      <p className="truncate text-[10px] mt-0.5" style={{ color: "var(--text-dim)" }}>
                        {item.authors[0]}
                      </p>
                      {isActive && (
                        <span className="mt-1 inline-block rounded bg-brass/20 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-brass">
                          Currently Viewing
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
