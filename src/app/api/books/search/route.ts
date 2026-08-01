import { NextRequest, NextResponse } from "next/server";
import { searchBooks } from "@/lib/books/search-service";
import type { BookSearchQuery, SearchType } from "@/lib/books/types";

const searchTypes = new Set<SearchType>(["title", "author", "isbn", "subject", "series"]);

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("q")?.trim() ?? "";
  const rawType = params.get("type") ?? "title";
  const type = searchTypes.has(rawType as SearchType) ? rawType as SearchType : "title";
  const page = Math.max(Number.parseInt(params.get("page") ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(params.get("limit") ?? "12", 10) || 12, 1), 20);
  const language = params.get("language")?.trim() || undefined;

  if (query.length < 2) {
    return NextResponse.json({ items: [], total: 0, page, limit, sources: [], degraded: false, error: "Query must be at least two characters." }, { status: 400 });
  }

  try {
    const result = await searchBooks({ query: query.slice(0, 120), type, page, limit, language } satisfies BookSearchQuery);
    return NextResponse.json(result, { headers: { "Cache-Control": "private, max-age=60" } });
  } catch {
    return NextResponse.json({ items: [], total: 0, page, limit, sources: [], degraded: true, error: "Book sources are temporarily unavailable." }, { status: 200 });
  }
}
