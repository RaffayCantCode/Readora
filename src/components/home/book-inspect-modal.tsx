"use client";

import { X, BookOpen, ExternalLink, Play, BookmarkPlus, Calendar, Building, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";
import { useHomeTheme } from "./home-theme-provider";

export function BookInspectModal({
  book,
  onClose,
}: {
  book: BookMetadata;
  onClose: () => void;
}) {
  const { reduceMotion } = useHomeTheme();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 backdrop-blur-md"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        />

        {/* Modal Window */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border shadow-2xl"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-strong)",
            color: "var(--text-main)",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border shadow-md transition hover:scale-105"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--bg-main)",
              color: "var(--text-main)",
            }}
          >
            <X size={18} />
          </button>

          <div className="grid max-h-[85vh] overflow-y-auto lg:grid-cols-[280px_1fr]">
            {/* Left: Book Cover Presentation */}
            <div className="desk-surface wood-grain flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: "var(--bg-desk)" }}>
              <div className="relative aspect-[2/3] w-48 overflow-hidden rounded-xl border spine-3d shadow-2xl" style={{ borderColor: "var(--border-strong)" }}>
                {book.coverUrl ? (
                  <Image src={book.coverUrl} alt={book.title} fill sizes="200px" className="object-cover" unoptimized />
                ) : (
                  <div className="book-cloth absolute inset-0 p-4 flex flex-col justify-between" style={{ backgroundColor: "#1e1815", color: "#f4efe4" }}>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-60">Readora</p>
                      <h4 className="mt-4 font-display text-xl font-bold leading-tight">{book.title}</h4>
                    </div>
                    <p className="text-xs opacity-75">{book.authors.join(", ")}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Book Details */}
            <div className="flex flex-col justify-between p-6 sm:p-8 space-y-6">
              <div>
                <span className="rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ borderColor: "var(--border-subtle)", color: "var(--accent-brass)", backgroundColor: "var(--accent-glow)" }}>
                  {book.subjects?.[0] ?? "Literature"}
                </span>

                <h3 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl" style={{ color: "var(--text-main)" }}>
                  {book.title}
                </h3>
                <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  by {book.authors.join(", ")}
                </p>

                <p className="mt-4 text-xs leading-relaxed sm:text-sm" style={{ color: "var(--text-dim)" }}>
                  {book.description ?? "An exceptional work available for exploration in your digital archive."}
                </p>

                {/* Metadata grid */}
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                  {book.publishedYear && (
                    <div className="flex items-center gap-2 rounded-xl border p-2.5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-main)" }}>
                      <Calendar size={14} style={{ color: "var(--accent-brass)" }} />
                      <div>
                        <span className="block text-[10px]" style={{ color: "var(--text-dim)" }}>Published</span>
                        <strong style={{ color: "var(--text-main)" }}>{book.publishedYear}</strong>
                      </div>
                    </div>
                  )}

                  {book.pageCount && (
                    <div className="flex items-center gap-2 rounded-xl border p-2.5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-main)" }}>
                      <BookOpen size={14} style={{ color: "var(--accent-brass)" }} />
                      <div>
                        <span className="block text-[10px]" style={{ color: "var(--text-dim)" }}>Length</span>
                        <strong style={{ color: "var(--text-main)" }}>{book.pageCount} pages</strong>
                      </div>
                    </div>
                  )}

                  {book.publisher && (
                    <div className="flex items-center gap-2 rounded-xl border p-2.5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-main)" }}>
                      <Building size={14} style={{ color: "var(--accent-brass)" }} />
                      <div className="min-w-0">
                        <span className="block text-[10px]" style={{ color: "var(--text-dim)" }}>Publisher</span>
                        <strong className="block truncate" style={{ color: "var(--text-main)" }}>{book.publisher}</strong>
                      </div>
                    </div>
                  )}

                  {book.isbns?.[0] && (
                    <div className="flex items-center gap-2 rounded-xl border p-2.5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-main)" }}>
                      <Hash size={14} style={{ color: "var(--accent-brass)" }} />
                      <div className="min-w-0">
                        <span className="block text-[10px]" style={{ color: "var(--text-dim)" }}>ISBN</span>
                        <strong className="block truncate" style={{ color: "var(--text-main)" }}>{book.isbns[0]}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                <button
                  onClick={onClose}
                  className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-md transition hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--accent-brass)",
                    color: "var(--bg-main)",
                  }}
                >
                  <Play size={15} fill="currentColor" />
                  <span>Start Reading</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-medium transition hover:border-strong"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)",
                    backgroundColor: "var(--bg-main)",
                  }}
                >
                  <BookmarkPlus size={15} />
                  <span>Add to Shelf</span>
                </button>

                {book.sourceLinks?.[0] && (
                  <a
                    href={book.sourceLinks[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 items-center gap-2 rounded-xl border px-4 text-xs transition"
                    style={{
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-dim)",
                    }}
                  >
                    <span>View Catalog Source</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
