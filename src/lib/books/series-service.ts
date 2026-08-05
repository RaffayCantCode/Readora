import { withCache } from "./cache";
import type { BookMetadata } from "./types";

export type BookSeriesItem = {
  id: string;
  title: string;
  author: string;
  volumes: string;
  description: string;
  coverUrl?: string;
  sampleBook: BookMetadata;
};

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

export async function getLiveSeriesCollections(limit = 4): Promise<BookSeriesItem[]> {
  const cacheKey = `live-series-collections-v4:${limit}`;

  return withCache(cacheKey, async () => {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent("novel series")}&format=json&origin=*`;

    try {
      const response = await fetch(searchUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Readora/1.0",
        },
        next: { revalidate: 3600 },
      });

      if (!response.ok) throw new Error("Wikipedia API returned " + response.status);
      const payload = (await response.json()) as { query?: { search?: WikiSearchResult[] } };

      const hits = (payload.query?.search ?? []).slice(0, 12);

      const items = (
        await Promise.all(
          hits.map(async (hit): Promise<BookSeriesItem | null> => {
            try {
              const hitLower = hit.title.toLowerCase();
              if (hitLower.startsWith("list of") || hitLower === "book series") return null;

              const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`;
              const sumRes = await fetch(summaryUrl, {
                headers: { Accept: "application/json" },
                next: { revalidate: 3600 },
              });
              if (!sumRes.ok) return null;
              const summary = (await sumRes.json()) as WikiSummary;

              if (summary.type === "disambiguation") return null;

              const descLower = (summary.description ?? "").toLowerCase();

              // Exclude non-book pages (films, actors, television)
              if (descLower.includes("film") || descLower.includes("actor") || descLower.includes("television")) {
                return null;
              }

              const coverUrl = summary.originalimage?.source || summary.thumbnail?.source;
              const title = summary.title?.replace(/\s*\([^)]*\)/, "") ?? hit.title;
              const description = summary.extract || hit.snippet.replace(/<[^>]*>/g, "");

              let author = "Featured Author";
              if (summary.description && /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i.test(summary.description)) {
                const match = summary.description.match(/by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
                if (match) author = match[1];
              }

              const sampleBook: BookMetadata = {
                id: `wiki-series-${hit.pageid}`,
                title,
                authors: [author],
                description,
                subjects: ["Series Collection", "Literature"],
                publishedYear: 2024,
                publisher: "Live Series Archive",
                pageCount: 420,
                isbns: [],
                coverUrl,
                sourceLinks: [`https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`],
                providerIds: {},
                source: "openlibrary",
              };

              return {
                id: `series-${hit.pageid}`,
                title,
                author,
                volumes: summary.description ? summary.description.charAt(0).toUpperCase() + summary.description.slice(1) : "Novel Series Collection",
                description,
                coverUrl,
                sampleBook,
              };
            } catch {
              return null;
            }
          })
        )
      ).filter(Boolean) as BookSeriesItem[];

      // Filter out duplicate titles
      const seen = new Set<string>();
      const result: BookSeriesItem[] = [];
      for (const item of items) {
        const norm = item.title.toLowerCase().trim();
        if (!seen.has(norm)) {
          seen.add(norm);
          result.push(item);
        }
      }

      return result.slice(0, limit);
    } catch {
      return [];
    }
  });
}
