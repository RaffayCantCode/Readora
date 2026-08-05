import type { BookMetadata } from "@/lib/books/types";
import type { DuplicateAction, ImportedBook, ImportQueueItem } from "./import-types";
import { computeFileHash, detectFormat, extractAndEnrichMetadata } from "./metadata-extractor";

const STORAGE_KEY = "readora-imported-books";

class ImportStore {
  private importedBooks: ImportedBook[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.importedBooks = JSON.parse(saved);
      }
    } catch {
      this.importedBooks = [];
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.importedBooks));
      this.notifyListeners();
    } catch {
      // Storage limits handled gracefully
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  public getImportedBooks(): ImportedBook[] {
    return [...this.importedBooks];
  }

  // Duplicate detection matching by ISBN, Hash, or Title similarity
  public findDuplicate(fileHash: string, title: string, isbns: string[]): ImportedBook | null {
    // 1. Match by SHA-256 File Hash
    const byHash = this.importedBooks.find((b) => b.fileHash === fileHash);
    if (byHash) return byHash;

    // 2. Match by ISBN
    if (isbns.length > 0) {
      const byIsbn = this.importedBooks.find((b) => b.isbns.some((isbn) => isbns.includes(isbn)));
      if (byIsbn) return byIsbn;
    }

    // 3. Match by exact title similarity
    const cleanT = title.toLowerCase().trim();
    const byTitle = this.importedBooks.find((b) => b.title.toLowerCase().trim() === cleanT);
    if (byTitle) return byTitle;

    return null;
  }

  // Process a single file upload through the pipeline
  public async processFile(
    file: File,
    onProgress: (progress: number) => void
  ): Promise<{ item: ImportQueueItem; duplicateMatch?: ImportedBook }> {
    const format = detectFormat(file.name);
    if (!format) {
      throw new Error(`Unsupported file format: .${file.name.split(".").pop()}`);
    }

    onProgress(15);
    const hash = await computeFileHash(file);
    onProgress(35);

    const { metadata, isCustomCover } = await extractAndEnrichMetadata(file, format);
    onProgress(70);

    const duplicateMatch = this.findDuplicate(hash, metadata.title, metadata.isbns);

    const queueItem: ImportQueueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      fileName: file.name,
      fileSize: file.size,
      fileFormat: format,
      progress: 90,
      status: duplicateMatch ? "duplicate_found" : "ready",
      extractedMetadata: metadata,
      matchedDuplicate: duplicateMatch ?? undefined,
    };

    if (!duplicateMatch) {
      const imported: ImportedBook = {
        ...metadata,
        fileId: `file-${Date.now()}`,
        fileName: file.name,
        fileSize: file.size,
        fileFormat: format,
        uploadedAt: new Date().toISOString(),
        fileHash: hash,
        progress: 0,
        isCustomCover,
      };
      this.addBook(imported);
      queueItem.finalBook = imported;
      queueItem.status = "ready";
      onProgress(100);
    }

    return { item: queueItem, duplicateMatch: duplicateMatch ?? undefined };
  }

  // Resolve duplicate action (Replace, Keep Both, Skip, Merge)
  public resolveDuplicate(item: ImportQueueItem, action: DuplicateAction): ImportedBook | null {
    if (!item.extractedMetadata || !item.matchedDuplicate) return null;

    const metadata = item.extractedMetadata as BookMetadata;
    const existing = item.matchedDuplicate;

    if (action === "skip") {
      return null;
    }

    if (action === "replace") {
      // Remove existing book and insert new one
      this.importedBooks = this.importedBooks.filter((b) => b.id !== existing.id);
      const replaced: ImportedBook = {
        ...metadata,
        id: existing.id,
        fileId: `file-${Date.now()}`,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileFormat: item.fileFormat,
        uploadedAt: new Date().toISOString(),
        fileHash: existing.fileHash,
        progress: existing.progress,
      };
      this.addBook(replaced);
      return replaced;
    }

    if (action === "keep_both") {
      const duplicated: ImportedBook = {
        ...metadata,
        id: `imported-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: `${metadata.title} (Copy)`,
        fileId: `file-${Date.now()}`,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileFormat: item.fileFormat,
        uploadedAt: new Date().toISOString(),
        fileHash: `${existing.fileHash}-copy`,
        progress: 0,
      };
      this.addBook(duplicated);
      return duplicated;
    }

    if (action === "merge") {
      const merged: ImportedBook = {
        ...existing,
        description: metadata.description ?? existing.description,
        publisher: metadata.publisher ?? existing.publisher,
        subjects: Array.from(new Set([...existing.subjects, ...metadata.subjects])),
        pageCount: metadata.pageCount ?? existing.pageCount,
      };
      this.importedBooks = this.importedBooks.map((b) => (b.id === existing.id ? merged : b));
      this.saveToStorage();
      return merged;
    }

    return null;
  }

  public addBook(book: ImportedBook) {
    // Avoid duplicate IDs
    this.importedBooks = [book, ...this.importedBooks.filter((b) => b.id !== book.id)];
    this.saveToStorage();
  }

  public deleteBook(id: string) {
    this.importedBooks = this.importedBooks.filter((b) => b.id !== id);
    this.saveToStorage();
  }
}

export const importStore = new ImportStore();
