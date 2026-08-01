import type { BookMetadata, ProviderBook } from "./types";

export function cleanText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return cleaned || undefined;
}

export function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isbnKey(book: ProviderBook): string | undefined {
  return book.isbns.map((isbn) => isbn.replace(/[^0-9X]/gi, "").toUpperCase()).find(Boolean);
}

function titleAuthorKey(book: ProviderBook): string {
  return normalizeKey(book.title) + "|" + normalizeKey(book.authors[0] ?? "");
}

export function mergeBooks(primary: ProviderBook[], enrichment: ProviderBook[]): BookMetadata[] {
  const merged = new Map<string, BookMetadata>();
  const add = (book: ProviderBook) => {
    const key = isbnKey(book) ?? titleAuthorKey(book);
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, {
        id: book.provider + ":" + book.providerId,
        title: book.title,
        authors: book.authors,
        description: book.description,
        subjects: book.subjects,
        publishedYear: book.publishedYear,
        publisher: book.publisher,
        pageCount: book.pageCount,
        isbns: book.isbns,
        coverUrl: book.coverUrl,
        sourceLinks: book.sourceLinks,
        providerIds: book.provider === "openlibrary" ? { openLibrary: book.providerId } : { googleBooks: book.providerId },
        source: "merged",
      });
      return;
    }
    existing.description ||= book.description;
    existing.coverUrl ||= book.coverUrl;
    existing.publisher ||= book.publisher;
    existing.pageCount ||= book.pageCount;
    existing.publishedYear ||= book.publishedYear;
    existing.subjects = Array.from(new Set(existing.subjects.concat(book.subjects))).slice(0, 12);
    existing.isbns = Array.from(new Set(existing.isbns.concat(book.isbns)));
    existing.sourceLinks = Array.from(new Set(existing.sourceLinks.concat(book.sourceLinks)));
    if (book.provider === "openlibrary") existing.providerIds.openLibrary = book.providerId;
    if (book.provider === "googlebooks") existing.providerIds.googleBooks = book.providerId;
  };
  primary.forEach(add);
  enrichment.forEach(add);
  return Array.from(merged.values());
}
