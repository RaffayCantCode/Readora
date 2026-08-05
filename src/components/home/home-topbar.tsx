"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Bell, LibraryBig, Sparkles, Layers, SunMoon, Loader2, X, ArrowRight, Flame } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { BookMetadata, SearchResponse } from "@/lib/books/types";
import { type HomeTheme, useHomeTheme } from "./home-theme-provider";

const themes: { id: HomeTheme; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "classic", label: "Paper", icon: Sparkles },
  { id: "library", label: "Library", icon: LibraryBig },
  { id: "glass", label: "Glass", icon: Layers },
  { id: "dark", label: "Dark", icon: SunMoon },
];

const quickSearchSuggestions = ["Red Rising", "Dune", "Harry Potter", "Atomic Habits", "1984"];

export function HomeTopbar() {
  const { theme, setTheme } = useHomeTheme();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live real-time search from public APIs
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(trimmed)}&type=title&limit=8`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as SearchResponse;
        if (payload.items) {
          setResults(payload.items);
          setIsOpen(true);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectBook = (bookId: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/book/${encodeURIComponent(bookId)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelectBook(results[0].id);
    } else if (query.trim().length >= 2) {
      handleSelectBook(query.trim());
    }
  };

  return (
    <header className="flex flex-col gap-4 border-b pb-4 pt-2 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border-subtle)" }}>
      {/* Live Search Input & Dropdown Container */}
      <div ref={dropdownRef} className="relative flex-1 max-w-xl">
        <form onSubmit={handleSubmit} className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brass" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search any book live (e.g. Red Rising, Dune, 1984)..."
            className="w-full rounded-2xl border py-3 pl-11 pr-10 text-xs font-semibold shadow-inner transition focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: isOpen ? "var(--accent-brass)" : "var(--border-subtle)",
              color: "var(--text-main)",
            }}
          />
          {loading ? (
            <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-brass" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold hover:opacity-100 opacity-60"
            >
              <X size={16} />
            </button>
          ) : null}
        </form>

        {/* Live Search Results & Quick Suggestions Dropdown */}
        {isOpen && (
          <div
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[480px] overflow-y-auto rounded-3xl border shadow-2xl backdrop-blur-xl p-3 space-y-2"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-strong)",
              color: "var(--text-main)",
            }}
          >
            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 px-1 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1" style={{ color: "var(--text-dim)" }}>
                <Flame size={12} className="text-amber-500" /> Popular:
              </span>
              {quickSearchSuggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => {
                    setQuery(sug);
                    setIsOpen(true);
                  }}
                  className="rounded-lg border px-2.5 py-1 text-[11px] font-semibold shrink-0 transition hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-desk)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)",
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>

            {results.length > 0 && (
              <div className="flex items-center justify-between px-2 pt-1 text-[10px] uppercase font-bold tracking-widest" style={{ color: "var(--accent-brass)" }}>
                <span>Live API Results ({results.length})</span>
                <span>Press Enter to open top match</span>
              </div>
            )}

            {results.length === 0 && query.trim().length >= 2 && !loading ? (
              <div
                onClick={() => handleSelectBook(query.trim())}
                className="p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition hover:scale-[1.01]"
                style={{ backgroundColor: "var(--bg-desk)", borderColor: "var(--border-subtle)" }}
              >
                <div>
                  <h4 className="font-display text-sm font-bold">Search edition for &quot;{query}&quot;</h4>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>Click to open full book specification page</p>
                </div>
                <ArrowRight size={16} className="text-brass" />
              </div>
            ) : results.length > 0 ? (
              results.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSelectBook(book.id)}
                  className="flex items-center justify-between rounded-2xl p-2.5 transition cursor-pointer hover:scale-[1.01]"
                  style={{
                    backgroundColor: "var(--bg-desk)",
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg border shadow-sm" style={{ backgroundColor: "var(--bg-main)", borderColor: "var(--border-subtle)" }}>
                      {book.coverUrl ? (
                        <Image src={book.coverUrl} alt={book.title} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center p-1 text-center font-display text-[9px] font-bold" style={{ backgroundColor: "#1e1815", color: "#f4efe4" }}>
                          {book.title.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate font-display text-sm font-bold" style={{ color: "var(--text-main)" }}>
                        {book.title}
                      </h4>
                      <p className="truncate text-xs" style={{ color: "var(--text-dim)" }}>
                        by {book.authors.join(", ")} {book.publishedYear ? `· ${book.publishedYear}` : ""}
                      </p>
                      {book.subjects?.[0] && (
                        <span className="mt-1 inline-block text-[9px] font-semibold uppercase tracking-wider rounded border px-1.5 py-0.5" style={{ borderColor: "var(--border-subtle)", color: "var(--accent-brass)" }}>
                          {book.subjects[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold pl-3 shrink-0" style={{ color: "var(--accent-brass)" }}>
                    <span>Open</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))
            ) : null}
          </div>
        )}
      </div>

      {/* Right Controls: Theme Selector + User Profile */}
      <div className="flex items-center gap-4">
        {/* Theme pills */}
        <div className="hidden md:flex items-center gap-1 rounded-xl border p-1" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
          {themes.map((t) => {
            const Icon = t.icon;
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  active ? "shadow-sm" : "opacity-70 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: active ? "var(--bg-desk)" : "transparent",
                  color: active ? "var(--accent-brass)" : "var(--text-muted)",
                  border: active ? "1px solid var(--border-strong)" : "1px solid transparent",
                }}
              >
                <Icon size={13} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notification Bell */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border transition hover:scale-105"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)", color: "var(--text-main)" }}
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent-brass)" }} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l pl-4" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 shadow-sm" style={{ borderColor: "var(--accent-brass)" }}>
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Alexander Mark"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="hidden sm:block">
            <h4 className="text-xs font-bold leading-tight" style={{ color: "var(--text-main)" }}>
              Alexander Mark
            </h4>
            <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>
              Avid Collector
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
