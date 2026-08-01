"use client";

import { BookOpen, Sparkles, SunMoon, Layers, LibraryBig, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { type HomeTheme, useHomeTheme } from "./home-theme-provider";

const themes: { id: HomeTheme; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "library", label: "Library", icon: LibraryBig },
  { id: "classic", label: "Classic", icon: Sparkles },
  { id: "glass", label: "Glass", icon: Layers },
  { id: "dark", label: "Dark", icon: SunMoon },
];

export function HomeHeader() {
  const { theme, setTheme, reduceMotion, setReduceMotion } = useHomeTheme();

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-500" style={{ borderColor: "var(--border-subtle)", backgroundColor: "rgba(var(--bg-main), 0.8)" }}>
      <div className="mx-auto flex max-w-[1520px] flex-col gap-4 px-4 py-3 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-transform duration-300 hover:scale-105" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-surface)" }}>
            <BookOpen size={20} style={{ color: "var(--accent-brass)" }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight" style={{ color: "var(--text-main)" }}>
                Readora
              </span>
              <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold" style={{ borderColor: "var(--border-subtle)", color: "var(--accent-brass)", backgroundColor: "var(--accent-glow)" }}>
                Editorial
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              A sanctuary for readers & digital collections
            </p>
          </div>
        </div>

        {/* Theme Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Theme Selector */}
          <div className="flex items-center gap-1 rounded-xl border p-1 shadow-inner" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}>
            {themes.map((t) => {
              const Icon = t.icon;
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                    active ? "shadow-md" : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: active ? "var(--bg-desk)" : "transparent",
                    color: active ? "var(--accent-brass)" : "var(--text-muted)",
                    border: active ? "1px solid var(--border-strong)" : "1px solid transparent",
                  }}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Reduce Motion Toggle */}
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            title={reduceMotion ? "Enable fluid motion" : "Reduce motion for calm reading"}
            className="flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition"
            style={{
              borderColor: reduceMotion ? "var(--accent-brass)" : "var(--border-subtle)",
              backgroundColor: "var(--bg-surface)",
              color: reduceMotion ? "var(--accent-brass)" : "var(--text-muted)",
            }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: reduceMotion ? "var(--accent-brass)" : "var(--text-dim)" }} />
            <span>{reduceMotion ? "Calm mode" : "Motion"}</span>
          </button>

          {/* Library Link */}
          <Link
            href="/library"
            className="flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-sm transition hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--accent-brass)",
              color: "var(--bg-main)",
            }}
          >
            <span>My Library</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
