"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Settings2 } from "lucide-react";
import Link from "next/link";
import type { BookMetadata, SearchResponse } from "@/lib/books/types";
import { useLibraryPreferences } from "@/lib/library/preferences";
import { Button } from "@/components/ui/button";
import { BookDetailPanel } from "./book-detail-panel";
import { ClassicLibrary } from "./classic-library";
import { ImmersiveLibrary } from "./immersive-library";
import { LibraryControls } from "./library-controls";

export function LibraryWorkspace({ showBack = true }: { showBack?: boolean }) {
  const { preferences, update } = useLibraryPreferences();
  const [books, setBooks] = useState<BookMetadata[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BookMetadata>();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load live initial library items
  useEffect(() => {
    async function loadInitialLibrary() {
      setLoading(true);
      try {
        const res = await fetch("/api/books/trending?limit=12");
        const payload = (await res.json()) as SearchResponse;
        if (payload.items) {
          setBooks(payload.items);
        }
      } catch {
        // Safe handling
      } finally {
        setLoading(false);
      }
    }

    loadInitialLibrary();
  }, []);

  // Handle user search input
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/books/search?q=" + encodeURIComponent(trimmed) + "&type=title&limit=12", { signal: controller.signal });
        const payload = await response.json() as SearchResponse;
        if (payload.items.length) {
          setBooks(payload.items);
          setMessage(payload.degraded ? "Showing the best available results." : "");
        } else {
          setBooks([]);
          setMessage("No books found in the open catalogue.");
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") setMessage("Search is resting. Try again in a moment.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const filteredBooks = useMemo(() => books, [books]);

  return (
    <main className="min-h-screen bg-archive text-parchment">
      <div className="mx-auto max-w-[1720px] px-4 py-4 sm:px-7 lg:px-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          {showBack ? (
            <Link href="/" className="flex items-center gap-2 text-sm text-stone/70 transition hover:text-parchment">
              <ArrowLeft size={16} />
              Back to Readora
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/12 bg-white/[0.04]">
                <BookOpen size={17} className="text-brass" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-none">Readora</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone/60">Personal library</p>
              </div>
            </div>
          )}
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden truncate text-xs text-stone/70 sm:inline">{loading ? "Searching the open catalogue..." : message || `${filteredBooks.length} books on this shelf`}</span>
            <Button variant="outline" size="sm" className="border-white/15 bg-white/[0.03] text-parchment hover:bg-white/[0.08]">
              <Settings2 size={14} />
              Settings
            </Button>
          </div>
        </div>
        <LibraryControls mode={preferences.mode} onModeChange={(mode) => update({ mode })} query={query} onQueryChange={setQuery} reduceMotion={preferences.reduceMotion} onReduceMotion={(reduceMotion) => update({ reduceMotion })} view={view} onViewChange={setView} />
      </div>
      {preferences.mode === "immersive" ? <ImmersiveLibrary books={filteredBooks} preferences={preferences} onInspect={setSelected} onRead={setSelected} /> : <ClassicLibrary books={filteredBooks} view={view} reduceMotion={preferences.reduceMotion} onInspect={setSelected} />}
      {selected && <BookDetailPanel book={selected} onClose={() => setSelected(undefined)} onRead={() => setSelected(undefined)} />}
    </main>
  );
}
