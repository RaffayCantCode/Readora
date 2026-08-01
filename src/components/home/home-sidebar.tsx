"use client";

import { useState } from "react";
import { Home, BookOpen, Clock, Bookmark, Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { ReadoraLogo } from "@/components/brand/readora-logo";

export function HomeSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "library", label: "My Library", icon: BookOpen, href: "/library" },
    { id: "goals", label: "Schedule", icon: Clock, href: "#schedule" },
    { id: "bookmarks", label: "Saved", icon: Bookmark, href: "#saved" },
    { id: "settings", label: "Settings", icon: Settings, href: "#settings" },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between border-r py-6 transition-all duration-300 ${
        collapsed ? "w-16 px-2" : "w-20 px-3 lg:w-56 lg:px-4"
      }`}
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="space-y-8">
        {/* Brand Logo in Top Left */}
        {!collapsed ? (
          <ReadoraLogo showTagline={false} />
        ) : (
          <div className="flex justify-center">
            <ReadoraLogo showTagline={false} className="w-10 overflow-hidden" />
          </div>
        )}

        {/* Navigation items that scroll down naturally with page */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all ${
                  active ? "shadow-md scale-[1.02]" : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                style={{
                  backgroundColor: active ? "var(--accent-brass)" : "transparent",
                  color: active ? "var(--bg-main)" : "var(--text-muted)",
                }}
              >
                <Icon size={20} className="shrink-0 transition-transform group-hover:scale-110" />
                {!collapsed && <span className="hidden truncate lg:inline">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mt-12 flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
        style={{ color: "var(--text-dim)" }}
      >
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        {!collapsed && <span className="hidden lg:inline">Collapse</span>}
      </button>
    </aside>
  );
}
