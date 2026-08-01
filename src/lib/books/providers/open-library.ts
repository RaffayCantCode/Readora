import { withCache } from "../cache";
import { cleanText } from "../normalize";
import type { BookSearchQuery, ProviderBook } from "../types";

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
  edition_key?: string[];
  first_sentence?: string | { value?: string };
};

type OpenLibraryResponse = { numFound?: number; docs?: OpenLibraryDoc[] };

function queryValue(query: BookSearchQuery): string {
  const value = encodeURIComponent(query.query);
  if (query.type === "author") return "author=" + value;
  if (query.type === "isbn") return "isbn=" + value;
  if (query.type === "subject") return "subject=" + value;
  if (query.type === "series") return "q=" + encodeURIComponent("series:" + query.query);
  return "title=" + value;
}

export async function searchOpenLibrary(query: BookSearchQuery): Promise<{ books: ProviderBook[]; total: number }> {
  const url = "https://openlibrary.org/search.json?" + queryValue(query) + "&page=" + query.page + "&limit=" + query.limit + "&fields=key,title,author_name,subject,first_publish_year,publisher,number_of_pages_median,isbn,cover_i,edition_key,first_sentence";
  return withCache("openlibrary:" + url, async () => {
    const response = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: 600 } });
    if (!response.ok) throw new Error("Open Library returned " + response.status);
    const payload = (await response.json()) as OpenLibraryResponse;
    const books = (payload.docs ?? []).filter((doc) => doc.title).map((doc): ProviderBook => ({
      provider: "openlibrary",
      providerId: doc.key ?? doc.edition_key?.[0] ?? doc.title ?? "unknown",
      title: doc.title ?? "Untitled",
      authors: doc.author_name ?? ["Unknown author"],
      description: cleanText(typeof doc.first_sentence === "object" ? doc.first_sentence?.value : doc.first_sentence),
      subjects: (doc.subject ?? []).slice(0, 12),
      publishedYear: doc.first_publish_year,
      publisher: doc.publisher?.[0],
      pageCount: doc.number_of_pages_median,
      isbns: (doc.isbn ?? []).slice(0, 8),
      coverUrl: doc.cover_i ? "https://covers.openlibrary.org/b/id/" + doc.cover_i + "-L.jpg?default=false" : undefined,
      sourceLinks: doc.key ? ["https://openlibrary.org" + doc.key] : [],
    }));
    return { books, total: payload.numFound ?? books.length };
  });
}
