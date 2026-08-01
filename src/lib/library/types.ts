import type { BookMetadata } from "@/lib/books/types";

export type LibraryMode = "immersive" | "classic";

export type LibraryPreferences = {
  mode: LibraryMode;
  reduceMotion: boolean;
};

export type LibraryBook = BookMetadata & {
  progress: number;
  favorite: boolean;
  collection: string;
  lastRead?: string;
};
