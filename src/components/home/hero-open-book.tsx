"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";
import { useHomeTheme } from "./home-theme-provider";

export function HeroOpenBook({
  onInspectBook,
}: {
  onInspectBook?: (book: BookMetadata) => void;
}) {
  const { reduceMotion } = useHomeTheme();

  const heroBookMetadata: BookMetadata = {
    id: "fixture:harry-potter-chamber",
    title: "The Chamber of Secrets",
    authors: ["J.K. Rowling"],
    description: "Harry returns to Hogwarts school of witchcraft and wizardry for his 2nd year, only to discover that an ancient dark chamber has been opened.",
    subjects: ["Fantasy", "Magic", "Adventure"],
    publishedYear: 1999,
    publisher: "Scholastic",
    pageCount: 300,
    isbns: ["9780439064873"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780439064873-L.jpg",
    sourceLinks: [],
    providerIds: {},
    source: "merged",
  };

  return (
    <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg border my-6" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        {/* Left Welcome Message */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: "var(--border-subtle)", color: "var(--accent-brass)", backgroundColor: "var(--accent-glow)" }}>
            <Sparkles size={14} />
            <span>Active Session</span>
          </div>

          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: "var(--text-main)" }}>
            Happy reading, Harvey
          </h2>

          <p className="max-w-md text-xs leading-relaxed sm:text-sm" style={{ color: "var(--text-dim)" }}>
            {"Wow! You've delved deep into the wizarding world's secrets. Have Harry's parents died yet? Oops, looks like you're not there yet. Get reading now!"}
          </p>

          <div className="pt-2">
            <button
              onClick={() => onInspectBook && onInspectBook(heroBookMetadata)}
              className="flex h-12 items-center gap-2.5 rounded-2xl px-7 text-xs font-bold uppercase tracking-wider shadow-md transition hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--text-main)",
                color: "var(--bg-main)",
              }}
            >
              <span>Start reading</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Right 3D Open Book Presentation */}
        <div className="relative flex flex-col sm:flex-row items-center gap-8 rounded-2xl border p-6 shadow-inner" style={{ backgroundColor: "var(--bg-desk)", borderColor: "var(--border-subtle)" }}>
          {/* 3D Open Illustrated Book Graphic */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.95, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={reduceMotion ? {} : { rotateY: -5, scale: 1.03 }}
            onClick={() => onInspectBook && onInspectBook(heroBookMetadata)}
            className="group relative cursor-pointer flex-1"
          >
            {/* Realistic Open Book Display */}
            <div className="relative aspect-[1.4/1] w-full min-w-[260px] overflow-hidden rounded-xl border shadow-2xl flex" style={{ borderColor: "var(--border-strong)" }}>
              {/* Left Page (Text Page) */}
              <div className="w-1/2 bg-[#fbf8f1] text-[#2c2419] p-4 text-[9px] leading-tight font-serif flex flex-col justify-between border-r border-black/10 shadow-inner">
                <div>
                  <div className="flex justify-between text-[7px] uppercase tracking-widest text-black/40 font-sans mb-2">
                    <span>CHAPTER SIX</span>
                    <span>154</span>
                  </div>
                  <p className="font-semibold mb-1">Gilderoy Lockhart</p>
                  <p className="line-clamp-6 opacity-85">
                    {"\"Harry had not yet forgotten the flying car incident. Neither had Mrs. Weasley...\""}
                  </p>
                </div>
                <div className="text-[7px] text-center text-black/40 font-sans">Page 154</div>
              </div>

              {/* Right Page (Full Page Illustration) */}
              <div className="w-1/2 relative bg-[#f4efe4] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
                  alt="Illustrated Chapter"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-sans text-parchment">
                  Ill. Ed.
                </span>
              </div>

              {/* Spine crease shadow */}
              <div className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 bg-gradient-to-r from-black/20 via-black/40 to-black/20 pointer-events-none" />
            </div>

            {/* Drop shadow on desk surface */}
            <div className="absolute -bottom-4 inset-x-4 h-4 rounded-full bg-black/60 blur-md" />
          </motion.div>

          {/* Book Info Column */}
          <div className="space-y-3 sm:w-44 shrink-0">
            <h3 className="font-display text-2xl font-bold leading-tight" style={{ color: "var(--text-main)" }}>
              The Chamber of Secrets
            </h3>

            <div className="flex items-baseline gap-1 text-sm font-semibold" style={{ color: "var(--accent-brass)" }}>
              <span className="text-lg">154</span>
              <span className="text-xs" style={{ color: "var(--text-dim)" }}>/ 300 pages</span>
            </div>

            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>
              Harry as he returns to Hogwarts school of witchcraft and wizardry for his 2nd year, only to discover that..
            </p>

            <p className="text-xs font-semibold" style={{ color: "var(--text-main)" }}>
              - J.K. Rowling
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
