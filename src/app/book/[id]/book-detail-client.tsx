"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Star, Book, Smartphone, Headphones, ShoppingBag, UserCheck, Loader2, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { BookMetadata, SearchResponse } from "@/lib/books/types";
import { ImportModal } from "@/components/import/import-modal";

export function BookDetailPageClient({ bookId }: { bookId: string }) {
  const [book, setBook] = useState<BookMetadata | null>(null);
  const [recommended, setRecommended] = useState<BookMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<"hardback" | "digital" | "audio">("hardback");
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    async function loadBookData() {
      setLoading(true);
      const cleanTerm = bookId.replace(/^(openlibrary:|googlebooks:|fixture:|catalog:)/, "");

      try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(cleanTerm)}&type=title&limit=6`);
        const payload = (await response.json()) as SearchResponse;

        if (payload.items && payload.items.length > 0) {
          setBook(payload.items[0]);
          if (payload.items.length > 1) {
            setRecommended(payload.items.slice(1, 5));
          }
        } else {
          const altRes = await fetch(`/api/books/trending?limit=6`);
          const altPayload = (await altRes.json()) as SearchResponse;
          if (altPayload.items && altPayload.items.length > 0) {
            setRecommended(altPayload.items.slice(0, 4));
          }
        }
      } catch {
        // Safe handling
      } finally {
        setLoading(false);
      }
    }

    loadBookData();
  }, [bookId]);

  const fallbackTitle = decodeURIComponent(bookId.replace(/^(openlibrary:|googlebooks:|fixture:|catalog:)/, "")).replace(/[-_]/g, " ");

  const activeBook: BookMetadata = book ?? {
    id: bookId,
    title: fallbackTitle.charAt(0).toUpperCase() + fallbackTitle.slice(1),
    authors: ["Featured Author"],
    description: `An extraordinary edition of ${fallbackTitle} from the open catalog metadata engine.`,
    subjects: ["Literature", "Fiction"],
    publishedYear: 2024,
    publisher: "Open Edition Archive",
    pageCount: 348,
    isbns: ["9780000000000"],
    coverUrl: undefined,
    sourceLinks: [],
    providerIds: {},
    source: "merged",
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500" style={{ backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}>
      <main className="flex-1 mx-auto w-full max-w-[1400px] p-4 sm:p-8 lg:p-12">
        {/* Navigation back link */}
        <div className="mb-8 flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider transition hover:opacity-80"
            style={{ color: "var(--accent-brass)" }}
          >
            <ArrowLeft size={16} />
            <span>To catalog</span>
          </Link>
          <span className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>
            Live Edition View
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-brass" size={32} />
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Fetching live edition specifications from open catalog APIs...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Main Editorial Layout matching Reference Image 2 */}
            <div className="grid gap-10 lg:grid-cols-[120px_320px_1fr]">
              {/* 1. Format Selection Tabs */}
              <div className="flex flex-row lg:flex-col gap-3">
                <button
                  onClick={() => setSelectedFormat("hardback")}
                  className={`flex flex-col items-center justify-center rounded-2xl p-4 text-center transition-all ${
                    selectedFormat === "hardback" ? "shadow-lg scale-105" : "border opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: selectedFormat === "hardback" ? "var(--accent-brass)" : "var(--bg-surface)",
                    color: selectedFormat === "hardback" ? "var(--bg-main)" : "var(--text-main)",
                    borderColor: "var(--border-strong)",
                  }}
                >
                  <Book size={20} />
                  <span className="mt-2 text-[11px] font-bold">Hardback</span>
                  <span className="text-xs font-extrabold">$25</span>
                </button>

                <button
                  onClick={() => setSelectedFormat("digital")}
                  className={`flex flex-col items-center justify-center rounded-2xl p-4 text-center transition-all ${
                    selectedFormat === "digital" ? "shadow-lg scale-105" : "border opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: selectedFormat === "digital" ? "var(--accent-brass)" : "var(--bg-surface)",
                    color: selectedFormat === "digital" ? "var(--bg-main)" : "var(--text-main)",
                    borderColor: "var(--border-strong)",
                  }}
                >
                  <Smartphone size={20} />
                  <span className="mt-2 text-[11px] font-bold">Digital</span>
                  <span className="text-xs font-extrabold">$20</span>
                </button>

                <button
                  onClick={() => setSelectedFormat("audio")}
                  className={`flex flex-col items-center justify-center rounded-2xl p-4 text-center transition-all ${
                    selectedFormat === "audio" ? "shadow-lg scale-105" : "border opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: selectedFormat === "audio" ? "var(--accent-brass)" : "var(--bg-surface)",
                    color: selectedFormat === "audio" ? "var(--bg-main)" : "var(--text-main)",
                    borderColor: "var(--border-strong)",
                  }}
                >
                  <Headphones size={20} />
                  <span className="mt-2 text-[11px] font-bold">Audio</span>
                  <span className="text-xs font-extrabold">$25</span>
                </button>
              </div>

              {/* 2. Hero 3D Book Jacket */}
              <div className="relative flex justify-center items-start">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-[2/3] w-72 overflow-hidden rounded-2xl border spine-3d shadow-2xl"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-desk)" }}
                >
                  {activeBook.coverUrl ? (
                    <Image src={activeBook.coverUrl} alt={activeBook.title} fill sizes="300px" priority className="object-cover" unoptimized />
                  ) : (
                    <div className="book-cloth absolute inset-0 p-6 flex flex-col justify-between" style={{ backgroundColor: "#1e1815", color: "#f4efe4" }}>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60">Readora Edition</p>
                        <h4 className="mt-4 font-display text-2xl font-bold leading-tight">{activeBook.title}</h4>
                      </div>
                      <p className="text-xs opacity-75">{activeBook.authors.join(", ")}</p>
                    </div>
                  )}

                  {/* Floating Category Tag */}
                  <span className="absolute top-4 right-4 rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-extrabold text-black uppercase tracking-wider shadow-md">
                    {activeBook.subjects?.[0] ?? "Literature"}
                  </span>
                </motion.div>
              </div>

              {/* 3. Specs & Metadata Column */}
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text-main)" }}>
                    {activeBook.title}
                  </h1>
                  <div className="mt-3 flex items-center gap-3 text-sm" style={{ color: "var(--text-dim)" }}>
                    <span>By {activeBook.authors.join(", ")}</span>
                    <span>|</span>
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      5 <Star size={14} fill="currentColor" />
                    </span>
                  </div>
                </div>

                {/* Specifications Table matching Image 2 */}
                <div className="space-y-3 border-y py-5 text-sm" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="grid grid-cols-2">
                    <span style={{ color: "var(--text-dim)" }}>Original Title</span>
                    <span className="font-semibold" style={{ color: "var(--text-main)" }}>{activeBook.title}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span style={{ color: "var(--text-dim)" }}>Format</span>
                    <span className="font-semibold" style={{ color: "var(--text-main)" }}>170 x 215 mm</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span style={{ color: "var(--text-dim)" }}>Number of pages</span>
                    <span className="font-semibold" style={{ color: "var(--text-main)" }}>{activeBook.pageCount ?? 348}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span style={{ color: "var(--text-dim)" }}>Year of issue</span>
                    <span className="font-semibold" style={{ color: "var(--text-main)" }}>{activeBook.publishedYear ?? 2024}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span style={{ color: "var(--text-dim)" }}>ISBN</span>
                    <span className="font-semibold" style={{ color: "var(--text-main)" }}>{activeBook.isbns?.[0] ?? "Available in Catalog"}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span style={{ color: "var(--text-dim)" }}>Circulation</span>
                    <span className="font-semibold" style={{ color: "var(--text-main)" }}>Open Public Edition</span>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div>
                    <span className="text-xs uppercase font-semibold" style={{ color: "var(--text-dim)" }}>Available</span>
                    <div className="text-3xl font-black" style={{ color: "var(--text-main)" }}>$25</div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Page-Specific Book Import Button */}
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="flex h-12 items-center gap-2 rounded-2xl border px-5 text-xs font-bold uppercase tracking-wider transition hover:border-strong"
                      style={{
                        borderColor: "var(--border-strong)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-main)",
                      }}
                    >
                      <UploadCloud size={16} className="text-brass" />
                      <span>Import File</span>
                    </button>

                    <Link
                      href="/library"
                      className="flex h-12 items-center gap-2 rounded-2xl px-8 text-xs font-bold uppercase tracking-wider shadow-lg transition hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: "var(--text-main)",
                        color: "var(--bg-main)",
                      }}
                    >
                      <ShoppingBag size={16} />
                      <span>Start Reading</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Persons Info Below */}
            <div className="border-t pt-10 grid gap-10 md:grid-cols-[1fr_280px]" style={{ borderColor: "var(--border-subtle)" }}>
              <div>
                <h3 className="font-display text-2xl font-bold mb-4" style={{ color: "var(--text-main)" }}>
                  Description
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {activeBook.description ?? "An extraordinary volume fetched live from open catalog metadata APIs."}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-main)" }}>
                  Persons
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border text-sm" style={{ borderColor: "var(--border-subtle)", color: "var(--accent-brass)" }}>
                    <UserCheck size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-main)" }}>{activeBook.authors[0]}</p>
                    <p className="text-xs" style={{ color: "var(--text-dim)" }}>Author</p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs uppercase tracking-widest font-semibold block mb-1" style={{ color: "var(--text-dim)" }}>
                    Publisher
                  </span>
                  <p className="font-display text-lg font-bold" style={{ color: "var(--text-main)" }}>
                    {activeBook.publisher ?? "Open Catalog Edition"}
                  </p>
                </div>
              </div>
            </div>

            {/* Also Recommended Live Shelf */}
            {recommended.length > 0 && (
              <div className="border-t pt-10" style={{ borderColor: "var(--border-subtle)" }}>
                <h3 className="font-display text-2xl font-bold mb-6" style={{ color: "var(--text-main)" }}>
                  Also Recommended
                </h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  {recommended.map((rec) => (
                    <Link
                      key={rec.id}
                      href={`/book/${encodeURIComponent(rec.id)}`}
                      className="group cursor-pointer flex flex-col transition hover:scale-105"
                    >
                      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border spine-3d shadow-md" style={{ backgroundColor: "var(--bg-desk)", borderColor: "var(--border-subtle)" }}>
                        {rec.coverUrl ? (
                          <Image src={rec.coverUrl} alt={rec.title} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="book-cloth absolute inset-0 p-4 flex flex-col justify-between" style={{ backgroundColor: "#1e1815", color: "#f4efe4" }}>
                            <p className="font-display text-sm font-bold">{rec.title}</p>
                          </div>
                        )}
                      </div>
                      <h4 className="mt-3 truncate font-display text-sm font-bold transition-colors group-hover:text-brass" style={{ color: "var(--text-main)" }}>
                        {rec.title}
                      </h4>
                      <p className="truncate text-xs" style={{ color: "var(--text-dim)" }}>
                        {rec.authors[0]}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Page-Specific Book Import Modal with Target Title Validation */}
      {activeBook && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          targetBookTitle={activeBook.title}
        />
      )}
    </div>
  );
}
