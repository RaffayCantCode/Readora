import { withCache } from "./cache";
import { mergeBooks } from "./normalize";
import type { ProviderBook, SearchResponse } from "./types";

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  subject?: string[];
  first_publish_year?: number;
  publisher?: string[];
  number_of_pages_median?: number;
  isbn?: string[];
  cover_i?: number;
  first_sentence?: string | { value?: string };
};

type OpenLibraryResponse = { numFound?: number; docs?: OpenLibraryDoc[] };

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

async function openLibraryTrending(year: number, limit: number) {
  const params = new URLSearchParams({
    q: "subject:fiction OR subject:literature OR subject:fantasy OR subject:classics",
    limit: String(limit * 2),
    fields: "key,title,author_name,subject,first_publish_year,publisher,number_of_pages_median,isbn,cover_i,first_sentence",
  });
  const url = "https://openlibrary.org/search.json?" + params.toString();
  return withCache("openlibrary-trending:" + url, async () => {
    const response = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "Readora local development" }, next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("Open Library trending returned " + response.status);
    const payload = await response.json() as OpenLibraryResponse;
    const books = (payload.docs ?? []).filter((doc) => doc.title).map((doc): ProviderBook => {
      const isbnCover = doc.isbn?.[0] ? `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg` : undefined;
      const coverUrl = doc.cover_i ? "https://covers.openlibrary.org/b/id/" + doc.cover_i + "-L.jpg?default=false" : isbnCover;
      return {
        provider: "openlibrary",
        providerId: doc.key ?? doc.title ?? "unknown",
        title: doc.title ?? "Untitled",
        authors: doc.author_name ?? ["Unknown author"],
        description: text(doc.first_sentence),
        subjects: (doc.subject ?? []).slice(0, 12),
        publishedYear: doc.first_publish_year,
        publisher: doc.publisher?.[0],
        pageCount: doc.number_of_pages_median,
        isbns: (doc.isbn ?? []).slice(0, 8),
        coverUrl,
        sourceLinks: doc.key ? ["https://openlibrary.org" + doc.key] : [],
      };
    });
    return { books: books.slice(0, limit), total: payload.numFound ?? books.length };
  });
}

async function googleNewest(year: number, limit: number) {
  const params = new URLSearchParams({
    q: "subject:fiction",
    printType: "books",
    maxResults: String(Math.min(20, limit * 2)),
  });
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (apiKey) params.set("key", apiKey);
  const url = "https://www.googleapis.com/books/v1/volumes?" + params.toString();
  return withCache("google-newest:" + url, async () => {
    const response = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("Google Books newest returned " + response.status);
    const payload = await response.json() as GoogleResponse;
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
  });
}

export async function getTrendingBooks(year: number, limit: number): Promise<SearchResponse> {
  let openLibrary: Awaited<ReturnType<typeof openLibraryTrending>> | undefined;
  let googleBooks: Awaited<ReturnType<typeof googleNewest>> | undefined;
  let degraded = false;

  try {
    openLibrary = await openLibraryTrending(year, limit);
  } catch {
    degraded = true;
  }

  try {
    googleBooks = await googleNewest(year, limit);
  } catch {
    degraded = true;
  }

  const items = mergeBooks(openLibrary?.books ?? [], googleBooks?.books ?? []).slice(0, limit);

  return {
    items,
    total: Math.max(openLibrary?.total ?? 0, googleBooks?.total ?? 0, items.length),
    page: 1,
    limit,
    sources: [openLibrary && "openlibrary", googleBooks && "googlebooks"].filter(Boolean) as string[],
    degraded,
  };
}

