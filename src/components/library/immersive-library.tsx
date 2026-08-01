"use client";

import { useState } from "react";
import type { BookMetadata } from "@/lib/books/types";
import type { LibraryPreferences } from "@/lib/library/types";
import { AmbientLibrary } from "./ambient-library";
import { LibraryRoom } from "./library-room";

export function ImmersiveLibrary({ books, preferences, onInspect, onRead }: { books: BookMetadata[]; preferences: LibraryPreferences; onInspect: (book: BookMetadata) => void; onRead: (book: BookMetadata) => void }) {
  const [activeAisle, setActiveAisle] = useState(0);

  return (
    <div className="relative overflow-hidden bg-archive text-parchment">
      <AmbientLibrary reduceMotion={preferences.reduceMotion} />
      <div className="relative z-10">
        <LibraryRoom books={books} aisle={Math.min(activeAisle, Math.max(books.length - 1, 0))} onAisleChange={setActiveAisle} reduceMotion={preferences.reduceMotion} onInspect={onInspect} onRead={onRead} />
      </div>
    </div>
  );
}
