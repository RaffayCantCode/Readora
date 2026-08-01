"use client";

import { useState } from "react";
import { ArrowLeft, Star, Book, Smartphone, Headphones, ShoppingBag, X, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";

export function BookViewModal({
  book,
  onClose,
}: {
  book: BookMetadata;
  onClose: () => void;
}) {
  const [selectedFormat, setSelectedFormat] = useState<"hardback" | "digital" | "audio">("hardback");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Editorial Book View Container matching Image 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border shadow-2xl p-6 sm:p-10 my-auto"
          style={{
            backgroundColor: "var(--bg-main)",
            borderColor: "var(--border-strong)",
            color: "var(--text-main)",
          }}
        >
          {/* Header Navigation Link */}
          <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: "var(--border-subtle)" }}>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={16} />
              To catalog
            </button>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border transition hover:scale-105"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-main)" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Main Grid matching Reference Image 2 */}
          <div className="grid gap-8 lg:grid-cols-[100px_260px_1fr]">
            {/* 1. Format Selection Tabs (Left Sidebar) */}
            <div className="flex flex-row lg:flex-col gap-2">
              <button
                onClick={() => setSelectedFormat("hardback")}
                className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition ${
                  selectedFormat === "hardback" ? "shadow-md" : "border opacity-70 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: selectedFormat === "hardback" ? "var(--accent-brass)" : "var(--bg-surface)",
                  color: selectedFormat === "hardback" ? "var(--bg-main)" : "var(--text-main)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <Book size={18} />
                <span className="mt-1 text-[10px] font-bold">Hardback</span>
                <span className="text-xs font-extrabold">$25</span>
              </button>

              <button
                onClick={() => setSelectedFormat("digital")}
                className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition ${
                  selectedFormat === "digital" ? "shadow-md" : "border opacity-70 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: selectedFormat === "digital" ? "var(--accent-brass)" : "var(--bg-surface)",
                  color: selectedFormat === "digital" ? "var(--bg-main)" : "var(--text-main)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <Smartphone size={18} />
                <span className="mt-1 text-[10px] font-bold">Digital</span>
                <span className="text-xs font-extrabold">$20</span>
              </button>

              <button
                onClick={() => setSelectedFormat("audio")}
                className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition ${
                  selectedFormat === "audio" ? "shadow-md" : "border opacity-70 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: selectedFormat === "audio" ? "var(--accent-brass)" : "var(--bg-surface)",
                  color: selectedFormat === "audio" ? "var(--bg-main)" : "var(--text-main)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <Headphones size={18} />
                <span className="mt-1 text-[10px] font-bold">Audio</span>
                <span className="text-xs font-extrabold">$25</span>
              </button>
            </div>

            {/* 2. Hero 3D Book Cover */}
            <div className="relative flex justify-center items-start">
              <div className="relative aspect-[2/3] w-56 overflow-hidden rounded-2xl border spine-3d shadow-2xl" style={{ borderColor: "var(--border-strong)" }}>
                {book.coverUrl ? (
                  <Image src={book.coverUrl} alt={book.title} fill sizes="250px" className="object-cover" unoptimized />
                ) : (
                  <div className="book-cloth absolute inset-0 p-6 flex flex-col justify-between" style={{ backgroundColor: "#1e1815", color: "#f4efe4" }}>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-60">Readora</p>
                      <h4 className="mt-4 font-display text-xl font-bold leading-tight">{book.title}</h4>
                    </div>
                    <p className="text-xs opacity-75">{book.authors.join(", ")}</p>
                  </div>
                )}

                {/* Category Floating Badge */}
                <span className="absolute top-3 right-3 rounded-lg bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-black uppercase tracking-wider shadow-md">
                  {book.subjects?.[0] ?? "Fantasy"}
                </span>
              </div>
            </div>

            {/* 3. Specs & Metadata Column */}
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-3xl font-bold leading-tight" style={{ color: "var(--text-main)" }}>
                  {book.title}
                </h2>
                <div className="mt-2 flex items-center gap-3 text-xs" style={{ color: "var(--text-dim)" }}>
                  <span>By {book.authors.join(", ")}</span>
                  <span>|</span>
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    5 <Star size={12} fill="currentColor" />
                  </span>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="space-y-2 border-y py-4 text-xs" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="grid grid-cols-2">
                  <span style={{ color: "var(--text-dim)" }}>Original</span>
                  <span className="font-semibold" style={{ color: "var(--text-main)" }}>{book.title}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span style={{ color: "var(--text-dim)" }}>Format</span>
                  <span className="font-semibold" style={{ color: "var(--text-main)" }}>170 x 215 mm</span>
                </div>
                <div className="grid grid-cols-2">
                  <span style={{ color: "var(--text-dim)" }}>Number of pages</span>
                  <span className="font-semibold" style={{ color: "var(--text-main)" }}>{book.pageCount ?? 348}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span style={{ color: "var(--text-dim)" }}>Year of issue</span>
                  <span className="font-semibold" style={{ color: "var(--text-main)" }}>{book.publishedYear ?? 2003}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span style={{ color: "var(--text-dim)" }}>ISBN</span>
                  <span className="font-semibold" style={{ color: "var(--text-main)" }}>{book.isbns?.[0] ?? "5-353-01339-5"}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] uppercase font-semibold" style={{ color: "var(--text-dim)" }}>Available</span>
                  <div className="text-2xl font-extrabold" style={{ color: "var(--text-main)" }}>$25</div>
                </div>

                <button
                  onClick={onClose}
                  className="flex h-11 items-center gap-2 rounded-xl px-6 text-xs font-bold uppercase tracking-wider shadow-md transition hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--text-main)",
                    color: "var(--bg-main)",
                  }}
                >
                  <ShoppingBag size={15} />
                  <span>Start Reading</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description & Persons Info Below */}
          <div className="mt-10 border-t pt-8 grid gap-8 md:grid-cols-[1fr_240px]" style={{ borderColor: "var(--border-subtle)" }}>
            <div>
              <h4 className="font-display text-lg font-bold mb-3" style={{ color: "var(--text-main)" }}>
                Description
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {book.description ?? "A masterwork of storytelling that transports readers into an unforgettable realm of wonder and imagination."}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-display text-sm font-bold" style={{ color: "var(--text-main)" }}>
                Persons
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--accent-brass)" }}>
                  <UserCheck size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--text-main)" }}>{book.authors[0]}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>Author</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
