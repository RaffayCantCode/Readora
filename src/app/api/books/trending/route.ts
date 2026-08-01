import { NextRequest, NextResponse } from "next/server";
import { getTrendingBooks } from "@/lib/books/trending-service";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const currentYear = new Date().getFullYear();
  const year = Math.min(Math.max(Number.parseInt(params.get("year") ?? String(currentYear), 10) || currentYear, 1900), currentYear + 1);
  const limit = Math.min(Math.max(Number.parseInt(params.get("limit") ?? "10", 10) || 10, 1), 16);

  try {
    const result = await getTrendingBooks(year, limit);
    return NextResponse.json(result, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch {
    return NextResponse.json({ items: [], total: 0, page: 1, limit, sources: [], degraded: true, error: "Trending books are temporarily unavailable." }, { status: 200 });
  }
}
