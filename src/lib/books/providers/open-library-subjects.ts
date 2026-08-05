import { withCache } from "../cache";
import type { ProviderBook } from "../types";

type SubjectWork = {
  key: string;
  title: string;
  authors?: { name: string }[];
  cover_id?: number;
  first_publish_year?: number;
  subject?: string[];
};

type SubjectResponse = {
  work_count?: number;
  works?: SubjectWork[];
};

export async function fetchOpenLibrarySubjects(subject = "fiction", limit = 12): Promise<{ books: ProviderBook[]; total: number }> {
  const url = `https://openlibrary.org/subjects/${encodeURIComponent(subject.toLowerCase())}.json?limit=${limit}`;

  return withCache("openlibrary-subjects:" + url, async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": "Readora/1.0" },
        signal: controller.signal,
        next: { revalidate: 3600 },
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Open Library Subjects returned " + response.status);
      const payload = (await response.json()) as SubjectResponse;

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

      return { books, total: payload.work_count ?? books.length };
    } catch {
      clearTimeout(timeoutId);
      return { books: [], total: 0 };
    }
  });
}
