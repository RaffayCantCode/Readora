import { withCache } from "../cache";
import type { BookSearchQuery, ProviderBook } from "../types";

type WikiSearchResult = {
  pageid: number;
  title: string;
  snippet: string;
};

type WikiSummary = {
  type?: string;
  title?: string;
  extract?: string;
  description?: string;
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
};

export async function searchWikipediaBooks(query: BookSearchQuery): Promise<{ books: ProviderBook[]; total: number }> {
  const rawQ = query.query.trim();
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(rawQ)}&format=json&origin=*`;

  return withCache("wikipedia-books:" + searchUrl, async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(searchUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Readora/1.0",
        },
        signal: controller.signal,
        next: { revalidate: 3600 },
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Wikipedia API returned " + response.status);
      const payload = (await response.json()) as { query?: { search?: WikiSearchResult[] } };

      const searchHits = (payload.query?.search ?? []).slice(0, Math.min(query.limit * 3, 15));

      const rawBooks = (
        await Promise.all(
          searchHits.map(async (hit): Promise<ProviderBook | null> => {
            try {
              const hitLower = hit.title.toLowerCase();

              // Exclude generic articles like "Science fiction", "Book series", "List of..."
              if (
                hitLower.startsWith("list of") ||
                hitLower === "science fiction" ||
                hitLower === "bestseller" ||
                hitLower === "book series" ||
                hitLower.endsWith("literature") ||
                hitLower.endsWith("genre")
              ) {
                return null;
              }

              const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`;
              const sumRes = await fetch(summaryUrl, {
                headers: { Accept: "application/json" },
                next: { revalidate: 3600 },
              });
              if (!sumRes.ok) return null;
              const summary = (await sumRes.json()) as WikiSummary;

              if (summary.type === "disambiguation") return null;

              const descLower = (summary.description ?? "").toLowerCase();

              // Exclude non-book pages (films, television, actors, generic genres)
              if (
                descLower.includes("film") ||
                descLower.includes("movie") ||
                descLower.includes("actor") ||
                descLower.includes("television") ||
                descLower === "literary genre" ||
                descLower === "publishing concept"
              ) {
                return null;
              }

              const titleClean = summary.title?.replace(/\s*\([^)]*\)/, "") ?? hit.title;
              const description = summary.extract || hit.snippet.replace(/<[^>]*>/g, "");
              const coverUrl = summary.originalimage?.source || summary.thumbnail?.source;

              // Parse author from description (e.g. "2014 novel by Pierce Brown")
              let author = "Featured Author";
              if (summary.description && /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i.test(summary.description)) {
                const match = summary.description.match(/by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
                if (match) author = match[1];
              }

              // Extract published year from description or extract
              let publishedYear: number | undefined;
              const yearMatch = (summary.description || summary.extract || "").match(/\b(19\d\d|20\d\d)\b/);
              if (yearMatch) publishedYear = Number.parseInt(yearMatch[1], 10);

              return {
                provider: "openlibrary",
                providerId: `wiki-${hit.pageid}`,
                title: titleClean,
                authors: [author],
                description,
                subjects: ["Popular Literature", "Fiction"],
                publishedYear,
                publisher: "Featured Public Edition",
                pageCount: 380,
                isbns: [],
                coverUrl,
                sourceLinks: [`https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`],
              };
            } catch {
              return null;
            }
          })
        )
      ).filter(Boolean) as ProviderBook[];

      // Filter out duplicate titles
      const seenTitles = new Set<string>();
      const books: ProviderBook[] = [];
      for (const b of rawBooks) {
        const norm = b.title.toLowerCase().trim();
        if (!seenTitles.has(norm)) {
          seenTitles.add(norm);
          books.push(b);
        }
      }

      return { books: books.slice(0, query.limit), total: books.length };
    } catch {
      clearTimeout(timeoutId);
      return { books: [], total: 0 };
    }
  });
}
