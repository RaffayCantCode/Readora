import { mergeBooks } from "./normalize";
import { searchGoogleBooks } from "./providers/google-books";
import { searchOpenLibrary } from "./providers/open-library";
import type { BookSearchQuery, SearchResponse } from "./types";

export async function searchBooks(query: BookSearchQuery): Promise<SearchResponse> {
  let openLibrary: Awaited<ReturnType<typeof searchOpenLibrary>> | undefined;
  let googleBooks: Awaited<ReturnType<typeof searchGoogleBooks>> | undefined;
  let degraded = false;

  try {
    openLibrary = await searchOpenLibrary(query);
  } catch {
    degraded = true;
  }

  try {
    googleBooks = await searchGoogleBooks(query);
  } catch {
    degraded = true;
  }

  const items = mergeBooks(openLibrary?.books ?? [], googleBooks?.books ?? []);
  return {
    items,
    total: Math.max(openLibrary?.total ?? 0, googleBooks?.total ?? 0),
    page: query.page,
    limit: query.limit,
    sources: [openLibrary && "openlibrary", googleBooks && "googlebooks"].filter(Boolean) as string[],
    degraded,
  };
}
