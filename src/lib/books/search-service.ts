import { mergeBooks } from "./normalize";
import { searchGoogleBooks } from "./providers/google-books";
import { searchOpenLibrary } from "./providers/open-library";
import { fetchOpenLibrarySubjects } from "./providers/open-library-subjects";
import { searchWikipediaBooks } from "./providers/wikipedia";
import type { BookSearchQuery, SearchResponse } from "./types";

export async function searchBooks(query: BookSearchQuery): Promise<SearchResponse> {
  // Query Live Modern Literature APIs in Parallel
  const [wikiRes, googleRes, openLibRes, olSubRes] = await Promise.allSettled([
    searchWikipediaBooks(query),
    searchGoogleBooks(query),
    searchOpenLibrary(query),
    fetchOpenLibrarySubjects(query.query, query.limit),
  ]);

  const wikiBooks = wikiRes.status === "fulfilled" ? wikiRes.value.books : [];
  const googleBooks = googleRes.status === "fulfilled" ? googleRes.value.books : [];
  const openLibraryBooks = openLibRes.status === "fulfilled" ? openLibRes.value.books : [];
  const olSubBooks = olSubRes.status === "fulfilled" ? olSubRes.value.books : [];

  // Merge primary modern literature results
  const primaryBooks = wikiBooks.concat(googleBooks).concat(openLibraryBooks).concat(olSubBooks);
  const items = mergeBooks(primaryBooks, []);

  // RELEVANCE RANKING ENGINE: Sort results so exact title & author matches appear AT THE TOP!
  const rawQ = query.query.toLowerCase().trim();
  const qWords = rawQ.split(/\s+/).filter((w) => w.length > 1);

  items.sort((a, b) => {
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    const aAuthor = (a.authors[0] ?? "").toLowerCase();
    const bAuthor = (b.authors[0] ?? "").toLowerCase();

    // Exact title match gets top priority (#1)
    if (aTitle === rawQ && bTitle !== rawQ) return -1;
    if (bTitle === rawQ && aTitle !== rawQ) return 1;

    // Starts with search query gets #2 priority
    if (aTitle.startsWith(rawQ) && !bTitle.startsWith(rawQ)) return -1;
    if (bTitle.startsWith(rawQ) && !aTitle.startsWith(rawQ)) return 1;

    // Preference items with live covers
    if (a.coverUrl && !b.coverUrl) return -1;
    if (b.coverUrl && !a.coverUrl) return 1;

    // Count how many search terms match in title or author
    const aScore = qWords.reduce((score, w) => (aTitle.includes(w) ? score + 5 : aAuthor.includes(w) ? score + 2 : score), 0);
    const bScore = qWords.reduce((score, w) => (bTitle.includes(w) ? score + 5 : bAuthor.includes(w) ? score + 2 : score), 0);

    return bScore - aScore;
  });

  return {
    items: items.slice(0, query.limit),
    total: Math.max(
      wikiRes.status === "fulfilled" ? wikiRes.value.total : 0,
      googleRes.status === "fulfilled" ? googleRes.value.total : 0,
      openLibRes.status === "fulfilled" ? openLibRes.value.total : 0,
      olSubRes.status === "fulfilled" ? olSubRes.value.total : 0,
      items.length
    ),
    page: query.page,
    limit: query.limit,
    sources: [
      wikiRes.status === "fulfilled" && "wikipedia",
      googleRes.status === "fulfilled" && "googlebooks",
      openLibRes.status === "fulfilled" && "openlibrary",
      olSubRes.status === "fulfilled" && "openlibrary-subjects",
    ].filter(Boolean) as string[],
    degraded: items.length === 0,
  };
}
