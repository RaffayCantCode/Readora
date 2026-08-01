"use client";

import { useMemo, useState } from "react";
import { Play, Clock, ChevronRight, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";
import { fixtureBooks } from "@/lib/library/fixtures";
import { useHomeTheme } from "./home-theme-provider";

export type CurrentlyReadingBook = BookMetadata & {
  progress: number;
  currentPage: number;
  totalPages: number;
  estimatedHoursLeft: number;
  lastOpened: string;
  color?: string;
  accent?: string;
};

// Rich active reading list sorted by most recently opened first
export const activeReadingList: CurrentlyReadingBook[] = [
  {
    ...fixtureBooks[0], // The Cartographer's Garden
    progress: 68,
    currentPage: 239,
    totalPages: 352,
    estimatedHoursLeft: 2.1,
    lastOpened: "2 hours ago",
    color: "#283830",
    accent: "#c78d3d",
  },
  {
    ...fixtureBooks[1], // A Field Guide to Quiet
    progress: 34,
    currentPage: 71,
    totalPages: 208,
    estimatedHoursLeft: 1.8,
    lastOpened: "Yesterday",
    color: "#4a3c31",
    accent: "#d4a359",
  },
  {
    ...fixtureBooks[3], // Under the Fig Tree
    progress: 82,
    currentPage: 216,
    totalPages: 264,
    estimatedHoursLeft: 0.9,
    lastOpened: "3 days ago",
    color: "#6b3e2e",
    accent: "#e5c898",
  },
];

export function ContinueReadingSection({
  onSelectBook,
}: {
  onSelectBook: (book: BookMetadata) => void;
}) {
  const { reduceMotion } = useHomeTheme();
  const [activeBookId, setActiveBookId] = useState<string>(activeReadingList[0].id);

  const heroBook = useMemo(() => {
    return activeReadingList.find((b) => b.id === activeBookId) ?? activeReadingList[0];
  }, [activeBookId]);

  const secondaryBooks = useMemo(() => {
    return activeReadingList.filter((b) => b.id !== heroBook.id);
  }, [heroBook.id]);

  return (
    <section className="relative overflow-hidden py-12 lg:py-20" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-700"
        style={{
          background: "radial-gradient(circle at 35% 30%, var(--accent-glow), transparent 65%)",
        }}
      />

      <div className="mx-auto max-w-[1520px] px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border shadow-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}>
              <Bookmark size={16} style={{ color: "var(--accent-brass)" }} />
            </span>
            <div>
              <p className="eyebrow" style={{ color: "var(--accent-brass)" }}>
                Active Reading
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text-main)" }}>
                Continue Reading
              </h2>
            </div>
          </div>
          <span className="hidden text-xs text-dim sm:inline" style={{ color: "var(--text-dim)" }}>
            {activeReadingList.length} books in progress
          </span>
        </div>

        {/* Environmental Desk Presentation */}
        <div
          className="desk-surface wood-grain relative min-h-[460px] overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14"
          style={{
            borderColor: "var(--border-subtle)",
          }}
        >
          {/* Surface Shadow Effect */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: Hero Book Physical Staging */}
            <div className="flex flex-col items-center justify-center lg:items-start">
              <motion.div
                key={heroBook.id}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                whileHover={reduceMotion ? {} : { y: -8, rotateY: -4, rotateX: 2 }}
                onClick={() => onSelectBook(heroBook)}
                className="group relative cursor-pointer"
              >
                {/* Physical Book Object */}
                <div
                  className="relative h-[340px] w-[230px] overflow-hidden rounded-xl border spine-3d transition-transform duration-500 sm:h-[400px] sm:w-[270px]"
                  style={{
                    backgroundColor: heroBook.color ?? "#283830",
                    borderColor: "var(--border-strong)",
                  }}
                >
                  {/* Real Cover Image or Custom Crafted Jacket */}
                  {heroBook.coverUrl ? (
                    <Image
                      src={heroBook.coverUrl}
                      alt={heroBook.title}
                      fill
                      sizes="270px"
                      priority
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="book-cloth absolute inset-0 p-6 flex flex-col justify-between" style={{ backgroundColor: heroBook.color }}>
                      <div className="border-l-2 pl-4" style={{ borderColor: heroBook.accent }}>
                        <p className="text-[10px] uppercase tracking-widest text-parchment/60">Edition</p>
                        <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-parchment">{heroBook.title}</h3>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-parchment/70">{heroBook.authors.join(", ")}</p>
                        <p className="mt-2 text-[11px] text-parchment/50">{heroBook.publishedYear}</p>
                      </div>
                    </div>
                  )}

                  {/* Bookmark Accent Layer */}
                  <div
                    className="absolute right-6 top-0 h-16 w-5 shadow-md"
                    style={{
                      backgroundColor: heroBook.accent ?? "var(--accent-brass)",
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)",
                    }}
                  />

                  {/* Progress Overlay bar on bottom of book */}
                  <div className="absolute inset-x-0 bottom-0 h-2 bg-black/40">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${heroBook.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full"
                      style={{ backgroundColor: heroBook.accent ?? "var(--accent-brass)" }}
                    />
                  </div>
                </div>

                {/* Drop shadow underneath book resting on desk surface */}
                <div className="absolute -bottom-6 inset-x-4 h-6 rounded-full bg-black/60 blur-xl transition-all duration-300 group-hover:bg-black/80 group-hover:blur-2xl" />
              </motion.div>
            </div>

            {/* Right: Book Details & Reading Progress */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider" style={{ backgroundColor: "var(--accent-glow)", color: "var(--accent-brass)" }}>
                    Most Recently Opened
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-dim)" }}>
                    <Clock size={13} />
                    {heroBook.lastOpened}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl" style={{ color: "var(--text-main)" }}>
                  {heroBook.title}
                </h3>
                <p className="mt-2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  by {heroBook.authors.join(", ")}
                </p>
                <p className="mt-4 line-clamp-3 text-xs leading-relaxed sm:text-sm" style={{ color: "var(--text-dim)" }}>
                  {heroBook.description ?? "A captivating volume resting on your desk."}
                </p>
              </div>

              {/* Physical Reading Progress Display */}
              <div className="rounded-2xl border p-5 shadow-inner" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span style={{ color: "var(--text-main)" }}>Page {heroBook.currentPage} of {heroBook.totalPages}</span>
                  <span style={{ color: "var(--accent-brass)" }}>{heroBook.progress}% Complete</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-black/20">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${heroBook.progress}%`,
                      backgroundColor: "var(--accent-brass)",
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]" style={{ color: "var(--text-dim)" }}>
                  <span>Est. {heroBook.estimatedHoursLeft} hrs remaining</span>
                  <span>Chapter {Math.ceil((heroBook.progress / 100) * 12)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectBook(heroBook)}
                  className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-md transition hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--accent-brass)",
                    color: "var(--bg-main)",
                  }}
                >
                  <Play size={15} fill="currentColor" />
                  <span>Resume Reading</span>
                </button>
                <button
                  onClick={() => onSelectBook(heroBook)}
                  className="flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-medium transition hover:border-strong"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  <span>Inspect Details</span>
                  <ChevronRight size={15} />
                </button>
              </div>

              {/* Secondary Books Resting Nearby on Desk */}
              {secondaryBooks.length > 0 && (
                <div className="border-t pt-5" style={{ borderColor: "var(--border-subtle)" }}>
                  <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--text-dim)" }}>
                    Other books on desk
                  </p>
                  <div className="flex items-center gap-4">
                    {secondaryBooks.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => setActiveBookId(book.id)}
                        className={`flex items-center gap-3 rounded-xl border p-2 text-left transition hover:scale-105 ${
                          activeBookId === book.id ? "border-brass" : ""
                        }`}
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          borderColor: activeBookId === book.id ? "var(--accent-brass)" : "var(--border-subtle)",
                        }}
                      >
                        <div className="relative h-12 w-9 overflow-hidden rounded border shrink-0" style={{ backgroundColor: book.color }}>
                          {book.coverUrl ? (
                            <Image src={book.coverUrl} alt="" fill className="object-cover" unoptimized />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center font-display text-[9px] text-parchment font-bold">
                              {book.title.slice(0, 2)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 pr-2">
                          <p className="truncate text-xs font-semibold" style={{ color: "var(--text-main)" }}>
                            {book.title}
                          </p>
                          <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                            {book.progress}% · {book.lastOpened}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
