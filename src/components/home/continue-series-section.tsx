"use client";

import { useMemo } from "react";
import { Layers, ArrowRight, BookCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";
import { useHomeTheme } from "./home-theme-provider";

type SeriesDefinition = {
  id: string;
  seriesTitle: string;
  author: string;
  activeVolumeNumber: number;
  activeVolumeTitle: string;
  nextVolumeNumber: number;
  nextVolumeTitle: string;
  totalVolumes: number;
  description: string;
  color: string;
  accent: string;
  coverUrl?: string;
};

// Known series catalogue mapping
const seriesDatabase: Record<string, Omit<SeriesDefinition, "id">> = {
  "orchard-letters": {
    seriesTitle: "The Orchard Letters",
    author: "S. Wren",
    activeVolumeNumber: 1,
    activeVolumeTitle: "Book I: Four Seasons at Elm House",
    nextVolumeNumber: 2,
    nextVolumeTitle: "Book II: The Autumn Harvest",
    totalVolumes: 4,
    description: "Four seasons, three generations, and the family letters preserved at the edge of the orchard.",
    color: "#4a3b2c",
    accent: "#d4b886",
  },
  "harry-potter": {
    seriesTitle: "Harry Potter",
    author: "J.K. Rowling",
    activeVolumeNumber: 2,
    activeVolumeTitle: "The Chamber of Secrets",
    nextVolumeNumber: 3,
    nextVolumeTitle: "The Prisoner of Azkaban",
    totalVolumes: 7,
    description: "Return to Hogwarts as dark forces gather and secrets from the past unfold.",
    color: "#5c1b1e",
    accent: "#e0ad36",
  },
  mistborn: {
    seriesTitle: "Mistborn",
    author: "Brandon Sanderson",
    activeVolumeNumber: 1,
    activeVolumeTitle: "The Final Empire",
    nextVolumeNumber: 2,
    nextVolumeTitle: "The Well of Ascension",
    totalVolumes: 3,
    description: "In a world where ash falls from the sky, a thief plans the ultimate heist against an immortal Lord Ruler.",
    color: "#233342",
    accent: "#8eb6d4",
  },
};

export function ContinueSeriesSection({
  activeBooks = [],
  onSelectBook,
}: {
  activeBooks?: BookMetadata[];
  onSelectBook?: (book: BookMetadata) => void;
}) {
  const { reduceMotion } = useHomeTheme();

  // Detect if any book in user's active reading list belongs to a series
  const activeSeries = useMemo<SeriesDefinition | null>(() => {
    for (const book of activeBooks) {
      const titleLower = book.title.toLowerCase();
      if (titleLower.includes("orchard") || book.id.includes("orchard")) {
        return { id: "orchard-letters", ...seriesDatabase["orchard-letters"] };
      }
      if (titleLower.includes("harry potter") || titleLower.includes("potter")) {
        return { id: "harry-potter", ...seriesDatabase["harry-potter"] };
      }
      if (titleLower.includes("mistborn") || titleLower.includes("final empire")) {
        return { id: "mistborn", ...seriesDatabase["mistborn"] };
      }
    }
    return null;
  }, [activeBooks]);

  // CRITICAL REQUIREMENT: If no series is currently being read, hide this section entirely!
  if (!activeSeries) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      <div className="mx-auto max-w-[1520px] px-4 sm:px-8">
        {/* Section Title */}
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border shadow-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}>
            <Layers size={16} style={{ color: "var(--accent-brass)" }} />
          </span>
          <div>
            <p className="eyebrow" style={{ color: "var(--accent-brass)" }}>
              Series Continuity
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text-main)" }}>
              Continue {activeSeries.seriesTitle}
            </h2>
          </div>
        </div>

        {/* Environmental Series Volume Box Presentation */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border p-6 sm:p-10 lg:p-12 shadow-xl"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-strong)",
          }}
        >
          <div className="grid items-center gap-8 lg:grid-cols-[300px_1fr]">
            {/* Left: Volume Staging Stand */}
            <div className="flex justify-center">
              <div
                className="relative h-[320px] w-[210px] overflow-hidden rounded-2xl border spine-3d transition-transform duration-500 hover:scale-105"
                style={{
                  backgroundColor: activeSeries.color,
                  borderColor: "var(--border-subtle)",
                }}
              >
                {activeSeries.coverUrl ? (
                  <Image src={activeSeries.coverUrl} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="book-cloth absolute inset-0 p-6 flex flex-col justify-between" style={{ backgroundColor: activeSeries.color }}>
                    <div>
                      <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-parchment/80">
                        Volume {activeSeries.nextVolumeNumber} of {activeSeries.totalVolumes}
                      </span>
                      <h3 className="mt-4 font-display text-2xl font-bold leading-snug text-parchment">
                        {activeSeries.nextVolumeTitle}
                      </h3>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-parchment/70">{activeSeries.author}</p>
                      <p className="mt-2 text-[10px] text-parchment/50">Next Volume Ready</p>
                    </div>
                  </div>
                )}
                {/* Volume Tag */}
                <div
                  className="absolute right-4 top-4 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    borderColor: activeSeries.accent,
                    color: activeSeries.accent,
                  }}
                >
                  Vol {activeSeries.nextVolumeNumber}
                </div>
              </div>
            </div>

            {/* Right: Next Volume Info & CTA */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <BookCheck size={16} style={{ color: "var(--accent-brass)" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-brass)" }}>
                    You finished Volume {activeSeries.activeVolumeNumber} ({activeSeries.activeVolumeTitle})
                  </span>
                </div>

                <h3 className="mt-3 font-display text-3xl font-bold" style={{ color: "var(--text-main)" }}>
                  {activeSeries.nextVolumeTitle}
                </h3>
                <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Book {activeSeries.nextVolumeNumber} in {activeSeries.seriesTitle} by {activeSeries.author}
                </p>

                <p className="mt-4 max-w-2xl text-xs leading-relaxed sm:text-sm" style={{ color: "var(--text-dim)" }}>
                  {activeSeries.description}
                </p>
              </div>

              {/* Series Progress Markers */}
              <div className="flex items-center gap-2">
                {Array.from({ length: activeSeries.totalVolumes }).map((_, idx) => {
                  const volNum = idx + 1;
                  const isCompleted = volNum <= activeSeries.activeVolumeNumber;
                  const isNext = volNum === activeSeries.nextVolumeNumber;
                  return (
                    <div
                      key={volNum}
                      className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold ${
                        isCompleted ? "opacity-60" : isNext ? "shadow-md" : "opacity-40"
                      }`}
                      style={{
                        backgroundColor: isNext ? "var(--bg-desk)" : "var(--bg-main)",
                        borderColor: isNext ? "var(--accent-brass)" : "var(--border-subtle)",
                        color: isNext ? "var(--accent-brass)" : "var(--text-main)",
                      }}
                    >
                      {isCompleted ? <ShieldCheck size={13} /> : null}
                      <span>Vol {volNum}</span>
                    </div>
                  );
                })}
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onSelectBook) {
                      onSelectBook({
                        id: `series-${activeSeries.id}-vol${activeSeries.nextVolumeNumber}`,
                        title: activeSeries.nextVolumeTitle,
                        authors: [activeSeries.author],
                        description: activeSeries.description,
                        subjects: [activeSeries.seriesTitle, "Series"],
                        publishedYear: 2024,
                        isbns: [],
                        sourceLinks: [],
                        providerIds: {},
                        source: "merged",
                      });
                    }
                  }}
                  className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-md transition hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--accent-brass)",
                    color: "var(--bg-main)",
                  }}
                >
                  <span>Begin Volume {activeSeries.nextVolumeNumber}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
