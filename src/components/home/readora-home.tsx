"use client";

import { useEffect, useState } from "react";
import type { BookMetadata } from "@/lib/books/types";
import { BookInspectModal } from "./book-inspect-modal";
import { ContinueReadingSection } from "./continue-reading-section";
import { HomeSidebar } from "./home-sidebar";
import { HomeThemeProvider } from "./home-theme-provider";
import { HomeTopbar } from "./home-topbar";
import { PopularShelf } from "./popular-shelf";
import { ScheduleWidget } from "./schedule-widget";
import { SeriesCard } from "./series-card";
import { UsernameModal } from "./username-modal";

export function ReadoraHome() {
  const [inspectedBook, setInspectedBook] = useState<BookMetadata | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [showNameModal, setShowNameModal] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("readora-user-name");
      if (saved) {
        setUserName(saved);
      }
    } catch {
      // fallback
    }
  }, []);

  const handleInspectBook = (book: BookMetadata) => {
    setInspectedBook(book);
  };

  const handleSaveUsername = (name: string) => {
    setUserName(name);
    setShowNameModal(false);
  };

  return (
    <HomeThemeProvider>
      <div className="flex min-h-screen">
        {/* Left Floating Navigation Icon Rail */}
        <HomeSidebar />

        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {/* Top Bar with Search, Theme Switcher & Dynamic User Profile */}
          <HomeTopbar
            userName={userName}
            onEditName={() => setShowNameModal(true)}
          />

          {/* Main Workspace Layout */}
          <div className="mx-auto max-w-[1520px] mt-6">
            {/* Active Reading Progress Section */}
            <ContinueReadingSection onSelectBook={handleInspectBook} />

            {/* Content Grid: Left Main Shelf & Right Widgets */}
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
              {/* Main Column */}
              <div>
                {/* Popular Now: Real Live Trending 3D Books */}
                <PopularShelf onInspectBook={handleInspectBook} />

                {/* Latest Series Showcase */}
                <SeriesCard onInspectBook={handleInspectBook} />
              </div>

              {/* Right Column Widgets */}
              <div>
                <ScheduleWidget />
              </div>
            </div>
          </div>
        </div>

        {/* Username Onboarding Modal */}
        <UsernameModal onSave={handleSaveUsername} />

        {/* Manual Name Edit Modal */}
        {showNameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-3xl border p-6 shadow-2xl space-y-4" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-strong)" }}>
              <h3 className="font-display text-xl font-bold">Edit Profile Name</h3>
              <input
                type="text"
                defaultValue={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-2xl border p-3 text-xs"
                style={{ backgroundColor: "var(--bg-main)", borderColor: "var(--border-strong)", color: "var(--text-main)" }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNameModal(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-bold"
                  style={{ borderColor: "var(--border-subtle)", color: "var(--text-main)" }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Book Inspection 3D Pop-Up Modal */}
        {inspectedBook && (
          <BookInspectModal
            book={inspectedBook}
            onClose={() => setInspectedBook(null)}
          />
        )}
      </div>
    </HomeThemeProvider>
  );
}


