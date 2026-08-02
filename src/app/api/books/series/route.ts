import { NextRequest, NextResponse } from "next/server";
import { getLiveSeriesCollections } from "@/lib/books/series-service";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const limit = Math.min(Math.max(Number.parseInt(params.get("limit") ?? "4", 10) || 4, 1), 8);

  try {
    const series = await getLiveSeriesCollections(limit);
    return NextResponse.json({ items: series }, { headers: { "Cache-Control": "private, max-age=600" } });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
