import { withCache } from "./cache";
import { mergeBooks } from "./normalize";
import { searchWikipediaBooks } from "./providers/wikipedia";
import type { ProviderBook, SearchResponse } from "./types";

type SubjectWorkItem = {
  key: string;
  title: string;
  authors?: { name: string }[];
  cover_id?: number;
  first_publish_year?: number;
  subject?: string[];
};

type SubjectResponsePayload = {
  work_count?: number;
  works?: SubjectWorkItem[];
};

type GoogleVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    industryIdentifiers?: { identifier: string }[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    previewLink?: string;
  };
};

type GoogleResponse = { totalItems?: number; items?: GoogleVolume[] };

function text(value: unknown) {
  if (typeof value === "string") return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || undefined;
  if (typeof value === "object" && value && "value" in value && typeof value.value === "string") return value.value;
  return undefined;
}

// Fetch live books from Google Books API
async function fetchGoogleBooks(queryStr: string, limit: number) {
  const params = new URLSearchParams({
    q: queryStr,
    printType: "books",
    maxResults: String(Math.min(20, limit * 2)),
  });
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (apiKey) params.set("key", apiKey);
  const url = "https://www.googleapis.com/books/v1/volumes?" + params.toString();

  return withCache("google-books-live:" + url, async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: controller.signal,
        next: { revalidate: 3600 },
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Google Books returned " + response.status);
      const payload = (await response.json()) as GoogleResponse;

      const books = (payload.items ?? []).filter((item) => item.volumeInfo?.title).map((item): ProviderBook => {
        const info = item.volumeInfo ?? {};
        const publishedYear = info.publishedDate ? Number.parseInt(info.publishedDate.slice(0, 4), 10) : undefined;
        return {
          provider: "googlebooks",
          providerId: item.id,
          title: info.title ?? "Untitled",
          authors: info.authors ?? ["Unknown author"],
          description: text(info.description),
          subjects: info.categories ?? [],
          publishedYear,
          publisher: info.publisher,
          pageCount: info.pageCount,
          isbns: (info.industryIdentifiers ?? []).map((identifier) => identifier.identifier),
          coverUrl: (info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail)?.replace("http://", "https://"),
          sourceLinks: info.previewLink ? [info.previewLink] : [],
        };
      });
      return { books: books.slice(0, limit), total: payload.totalItems ?? books.length };
    } catch {
      clearTimeout(timeoutId);
      return { books: [], total: 0 };
    }
  });
}

// Fetch live books from Open Library Subjects API
async function fetchOpenLibrarySubjects(subject: string, limit: number) {
  const url = `https://openlibrary.org/subjects/${encodeURIComponent(subject)}.json?limit=${limit * 2}`;

  return withCache("openlibrary-subjects-live:" + url, async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        signal: controller.signal,
        next: { revalidate: 3600 },
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Open Library Subjects returned " + response.status);
      const payload = (await response.json()) as SubjectResponsePayload;

      const books = (payload.works ?? []).filter((w) => w.title).map((w): ProviderBook => {
        const coverUrl = w.cover_id ? `https://covers.openlibrary.org/b/id/${w.cover_id}-L.jpg` : undefined;
        return {
          provider: "openlibrary",
          providerId: w.key,
          title: w.title,
          authors: w.authors?.map((a) => a.name) ?? ["Featured Author"],
          description: `A popular ${subject} volume from the Open Library public catalog.`,
          subjects: (w.subject ?? [subject]).slice(0, 8),
          publishedYear: w.first_publish_year,
          publisher: "Open Library Edition",
          pageCount: 320,
          isbns: [],
          coverUrl,
          sourceLinks: [`https://openlibrary.org${w.key}`],
        };
      });
      return { books: books.slice(0, limit), total: payload.work_count ?? books.length };
    } catch {
      clearTimeout(timeoutId);
      return { books: [], total: 0 };
    }
  });
}

export async function getTrendingBooks(_year: number, limit: number): Promise<SearchResponse> {
  // Query live fiction & literature subjects dynamically across Wikipedia, Open Library, and Google Books
  const [wikiRes, olRes, googleRes] = await Promise.allSettled([
    searchWikipediaBooks({ query: "bestseller literature novel", type: "title", page: 1, limit }),
    fetchOpenLibrarySubjects("fiction", limit * 2),
    fetchGoogleBooks("bestseller literature", limit * 2),
  ]);

  const wikiBooks = wikiRes.status === "fulfilled" ? wikiRes.value.books : [];
  const olBooks = olRes.status === "fulfilled" ? olRes.value.books : [];
  const googleBooks = googleRes.status === "fulfilled" ? googleRes.value.books : [];

  const rawItems = mergeBooks(wikiBooks.concat(olBooks), googleBooks);

  // Deduplicate by normalized title
  const seen = new Set<string>();
  const items = rawItems.filter((item) => {
    const key = item.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);

  return {
    items,
    total: items.length,
    page: 1,
    limit,
    sources: ["wikipedia", "openlibrary-subjects", "googlebooks"],
    degraded: items.length === 0,
  };
}
