"use client";

import { useState } from "react";
import { Home, BookOpen, Clock, Bookmark, Settings, BookMarked } from "lucide-react";
import Link from "next/link";

export function HomeSidebar() {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "library", label: "My Library", icon: BookOpen, href: "/library" },
    { id: "goals", label: "Schedule", icon: Clock, href: "#schedule" },
    { id: "bookmarks", label: "Saved", icon: Bookmark, href: "#saved" },
    { id: "settings", label: "Settings", icon: Settings, href: "#settings" },
  ];

  return (
    <aside className="sticky top-6 z-40 hidden sm:flex flex-col items-center gap-6 py-6 px-2.5 my-4 ml-3 rounded-3xl border shadow-2xl self-start"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-strong)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Brand Icon Badge */}
      <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm transition hover:scale-110" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-main)" }}>
        <BookMarked size={20} style={{ color: "var(--accent-brass)" }} />
      </Link>

      {/* Floating Vertical Navigation Icons */}
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <div key={item.id} className="relative group">
              <Link
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                  active ? "shadow-lg scale-105" : "hover:scale-110"
                }`}
                style={{
                  backgroundColor: active ? "var(--accent-brass)" : "var(--bg-main)",
                  color: active ? "var(--bg-main)" : "var(--text-muted)",
                  border: active ? "none" : "1px solid var(--border-subtle)",
                }}
              >
                <Icon size={19} />
              </Link>

              {/* Floating Tooltip */}
              <span
                className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs font-bold shadow-xl opacity-0 pointer-events-none transition-all group-hover:opacity-100 group-hover:left-16"
                style={{
                  backgroundColor: "var(--bg-main)",
                  borderColor: "var(--border-strong)",
                  color: "var(--text-main)",
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

