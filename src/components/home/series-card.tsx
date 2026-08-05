"use client";

import { useEffect, useState } from "react";
import { Layers, Sparkles, Lightbulb, ArrowUpRight, Loader2 } from "lucide-react";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";
import type { BookSeriesItem } from "@/lib/books/series-service";

export function SeriesCard({
  onInspectBook,
}: {
  onInspectBook?: (book: BookMetadata) => void;
}) {
  const [seriesList, setSeriesList] = useState<BookSeriesItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiveSeries() {
      setLoading(true);
      try {
        const response = await fetch("/api/books/series?limit=6");
        const payload = (await response.json()) as { items?: BookSeriesItem[] };
        if (payload.items && payload.items.length > 0) {
          setSeriesList(payload.items);
          // Pick a random series item from the live response
          setSelectedIndex(Math.floor(Math.random() * payload.items.length));
        }
      } catch {
        // Safe handling
      } finally {
        setLoading(false);
      }
    }

    loadLiveSeries();
  }, []);

  const activeSeries = seriesList[selectedIndex];

  return (
    <section className="my-10">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={18} style={{ color: "var(--accent-brass)" }} />
          <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl" style={{ color: "var(--text-main)" }}>
            Featured Series & Live Literary Discovery
          </h3>
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase opacity-60 flex items-center gap-1" style={{ color: "var(--accent-brass)" }}>
          <Sparkles size={12} /> Live API Collection
        </span>
      </div>

      {/* Series Card Container */}
      <div
        className="rounded-3xl border p-6 shadow-xl space-y-5"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)",
        }}
      >
        {loading ? (
          <div className="flex min-h-[160px] items-center justify-center">
            <Loader2 className="animate-spin text-brass" size={24} />
          </div>
        ) : !activeSeries ? (
          <div className="p-6 text-center text-xs opacity-60">
            Series catalog syncing live editions from open library APIs...
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b pb-5" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center gap-5 min-w-0 w-full sm:w-auto">
                {/* Book Spine Graphic */}
                <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl border spine-3d shadow-md" style={{ backgroundColor: "#1e1815", borderColor: "var(--border-strong)" }}>
                  {activeSeries.coverUrl ? (
                    <Image src={activeSeries.coverUrl} alt={activeSeries.title} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-display text-xs font-bold text-parchment p-2 text-center" style={{ backgroundColor: "#1e1815" }}>
                      {activeSeries.title.slice(0, 2)}
                    </div>
                  )}
                </div>

                {/* Main Series Meta */}
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--accent-brass)" }}>
                    {activeSeries.volumes}
                  </span>
                  <h4 className="truncate font-display text-2xl font-bold" style={{ color: "var(--text-main)" }}>
                    {activeSeries.title}
                  </h4>
                  <p className="mt-1 text-xs font-semibold" style={{ color: "var(--text-dim)" }}>
                    By {activeSeries.author}
                  </p>
                </div>
              </div>

              {/* Action button */}
              {activeSeries.sampleBook && (
                <button
                  onClick={() => onInspectBook && onInspectBook(activeSeries.sampleBook)}
                  className="flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition hover:scale-105 active:scale-95 shrink-0"
                  style={{
                    backgroundColor: "var(--bg-desk)",
                    borderColor: "var(--border-strong)",
                    color: "var(--text-main)",
                  }}
                >
                  <span>Explore Series</span>
                  <ArrowUpRight size={14} className="text-brass" />
                </button>
              )}
            </div>

            {/* Live Excerpt Callout Box */}
            <div className="flex items-start gap-3.5 rounded-2xl p-4 border text-xs leading-relaxed" style={{ backgroundColor: "var(--bg-desk)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0 font-bold" style={{ backgroundColor: "var(--accent-glow)", color: "var(--accent-brass)" }}>
                <Lightbulb size={16} />
              </div>
              <div>
                <span className="font-bold block mb-0.5" style={{ color: "var(--text-main)" }}>
                  Live Series Excerpt & Overview:
                </span>
                <p style={{ color: "var(--text-dim)" }}>{activeSeries.description}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
