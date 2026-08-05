import { withCache } from "../cache";
import { cleanText } from "../normalize";
import type { BookSearchQuery, ProviderBook } from "../types";

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
    industryIdentifiers?: { type: string; identifier: string }[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    previewLink?: string;
  };
};

type GoogleResponse = { totalItems?: number; items?: GoogleVolume[] };

function queryValue(query: BookSearchQuery): string {
  if (query.type === "author") return "inauthor:" + query.query;
  if (query.type === "isbn") return "isbn:" + query.query;
  if (query.type === "subject") return "subject:" + query.query;
  if (query.type === "series") return "intitle:" + query.query;
  return query.query;
}

export async function searchGoogleBooks(query: BookSearchQuery): Promise<{ books: ProviderBook[]; total: number }> {
  const params = new URLSearchParams({
    q: queryValue(query),
    startIndex: String((query.page - 1) * query.limit),
    maxResults: String(Math.min(query.limit, 20)),
    printType: "books",
  });
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (apiKey) params.set("key", apiKey);
  const url = "https://www.googleapis.com/books/v1/volumes?" + params.toString();

  return withCache("googlebooks:" + url, async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: controller.signal,
        next: { revalidate: 600 },
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Google Books returned " + response.status);
      const payload = (await response.json()) as GoogleResponse;
      const books = (payload.items ?? []).filter((item) => item.volumeInfo?.title).map((item): ProviderBook => {
        const info = item.volumeInfo ?? {};
        return {
          provider: "googlebooks",
          providerId: item.id,
          title: info.title ?? "Untitled",
          authors: info.authors ?? ["Unknown author"],
          description: cleanText(info.description),
          subjects: info.categories ?? [],
          publishedYear: info.publishedDate ? Number.parseInt(info.publishedDate.slice(0, 4), 10) : undefined,
          publisher: info.publisher,
          pageCount: info.pageCount,
          isbns: (info.industryIdentifiers ?? []).map((item) => item.identifier),
          coverUrl: (info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail)?.replace("http://", "https://"),
          sourceLinks: info.previewLink ? [info.previewLink] : [],
        };
      });
      return { books, total: payload.totalItems ?? books.length };
    } catch {
      clearTimeout(timeoutId);
      return { books: [], total: 0 };
    }
  });
}
