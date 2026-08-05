import type { BookMetadata } from "@/lib/books/types";

export type SupportedFormat =
  | "pdf"
  | "epub"
  | "mobi"
  | "azw3"
  | "docx"
  | "txt"
  | "md"
  | "cbz"
  | "cbr";

export type ImportStatus =
  | "queued"
  | "extracting"
  | "enriching"
  | "checking_duplicates"
  | "duplicate_found"
  | "processing"
  | "ready"
  | "error";

export type DuplicateAction = "replace" | "keep_both" | "skip" | "merge";

export type ImportedBook = BookMetadata & {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileFormat: SupportedFormat;
  uploadedAt: string;
  fileHash: string;
  progress: number;
  toc?: { title: string; page?: number }[];
  isCustomCover?: boolean;
};

export type ImportQueueItem = {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  fileFormat: SupportedFormat;
  progress: number;
  status: ImportStatus;
  error?: string;
  extractedMetadata?: Partial<BookMetadata>;
  matchedDuplicate?: ImportedBook;
  resolution?: DuplicateAction;
  finalBook?: ImportedBook;
};
