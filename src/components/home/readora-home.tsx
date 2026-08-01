"use client";

import { useRouter } from "next/navigation";
import type { BookMetadata } from "@/lib/books/types";
import { HeroOpenBook } from "./hero-open-book";
import { HomeSidebar } from "./home-sidebar";
import { HomeThemeProvider } from "./home-theme-provider";
import { HomeTopbar } from "./home-topbar";
import { PopularShelf } from "./popular-shelf";
import { ScheduleWidget } from "./schedule-widget";
import { SeriesCard } from "./series-card";

export function ReadoraHome() {
  const router = useRouter();

  const handleSelectBook = (book: BookMetadata) => {
    router.push(`/book/${encodeURIComponent(book.id)}`);
  };

  return (
    <HomeThemeProvider>
      <div className="flex min-h-screen">
        {/* Left Navigation Icon Rail */}
        <HomeSidebar />

        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {/* Top Bar with Search & User Profile */}
          <HomeTopbar />

          {/* Main Workspace Layout */}
          <div className="mx-auto max-w-[1520px]">
            {/* Hero 3D Open Book Section ("Happy reading, Harvey") */}
            <HeroOpenBook onInspectBook={handleSelectBook} />

            {/* Content Grid: Left Main Shelf & Right Widgets */}
            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              {/* Main Column */}
              <div>
                {/* Popular Now: Real Standing 3D Books */}
                <PopularShelf onInspectBook={handleSelectBook} />

                {/* New Series Collection */}
                <SeriesCard onInspectBook={handleSelectBook} />
              </div>

              {/* Right Column Widgets */}
              <div>
                <ScheduleWidget />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeThemeProvider>
  );
}
