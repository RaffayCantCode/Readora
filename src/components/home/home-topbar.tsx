"use client";

import { Search, Bell, LibraryBig, Sparkles, Layers, SunMoon } from "lucide-react";
import Image from "next/image";
import { type HomeTheme, useHomeTheme } from "./home-theme-provider";

const themes: { id: HomeTheme; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "classic", label: "Paper", icon: Sparkles },
  { id: "library", label: "Library", icon: LibraryBig },
  { id: "glass", label: "Glass", icon: Layers },
  { id: "dark", label: "Dark", icon: SunMoon },
];

export function HomeTopbar({
  onSearch,
}: {
  onSearch?: (query: string) => void;
}) {
  const { theme, setTheme } = useHomeTheme();

  return (
    <header className="flex flex-col gap-4 border-b pb-4 pt-2 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border-subtle)" }}>
      {/* Search Input */}
      <div className="relative flex-1 max-w-lg">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-dim)" }} />
        <input
          type="text"
          placeholder="Search book name, author, edition..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="w-full rounded-2xl border py-2.5 pl-11 pr-4 text-xs font-medium shadow-inner transition focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-main)",
          }}
        />
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
