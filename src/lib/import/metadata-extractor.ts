import type { BookMetadata, SearchResponse } from "@/lib/books/types";
import type { SupportedFormat } from "./import-types";

// Determine supported format from filename extension
export function detectFormat(fileName: string): SupportedFormat | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  if (["pdf", "epub", "mobi", "azw3", "docx", "txt", "md", "cbz", "cbr"].includes(ext)) {
    return ext as SupportedFormat;
  }
  return null;
}

// Generate simple hash from file name and size
export async function computeFileHash(file: File): Promise<string> {
  const buffer = await file.slice(0, 64 * 1024).arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

// Clean file title from raw filename (e.g. "Pierce_Brown_Red_Rising_2014.epub" -> "Red Rising")
export function cleanTitleFromFilename(fileName: string): { title: string; author?: string } {
  let name = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  // Remove volume / format tags
  name = name.replace(/\b(v\d+|vol\d+|pdf|epub|mobi|azw3|cbz|cbr|x264|rar|zip)\b/gi, "").trim();

  const parts = name.split(" - ");
  if (parts.length >= 2) {
    return { author: parts[0].trim(), title: parts[1].trim() };
  }
  return { title: name };
}

// Generate a custom SVG cover jacket when no cover image is found
export function generateSvgCover(title: string, author: string, format: SupportedFormat): string {
  const colors = [
    { bg: "#1e293b", text: "#f8fafc", brass: "#c78d3d" },
    { bg: "#283830", text: "#f4efe4", brass: "#d4a359" },
    { bg: "#4a3c31", text: "#f4efe4", brass: "#e5c898" },
    { bg: "#3b1e2b", text: "#f8fafc", brass: "#e0ad36" },
  ];
  const theme = colors[Math.abs(title.length + author.length) % colors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <rect width="400" height="600" fill="${theme.bg}"/>
    <rect x="20" y="20" width="360" height="560" fill="none" stroke="${theme.brass}" stroke-width="2" opacity="0.6"/>
    <line x1="30" y1="30" x2="370" y2="30" stroke="${theme.brass}" stroke-width="1" opacity="0.4"/>
    <text x="200" y="100" font-family="serif" font-size="14" letter-spacing="3" fill="${theme.brass}" text-anchor="middle" font-weight="bold">READORA EDITION</text>
    <text x="200" y="240" font-family="serif" font-size="28" font-weight="bold" fill="${theme.text}" text-anchor="middle">${escapeXml(title.slice(0, 30))}</text>
    ${title.length > 30 ? `<text x="200" y="280" font-family="serif" font-size="22" font-weight="bold" fill="${theme.text}" text-anchor="middle">${escapeXml(title.slice(30, 60))}</text>` : ""}
    <line x1="160" y1="340" x2="240" y2="340" stroke="${theme.brass}" stroke-width="2"/>
    <text x="200" y="400" font-family="sans-serif" font-size="16" fill="${theme.brass}" text-anchor="middle">${escapeXml(author)}</text>
    <rect x="150" y="510" width="100" height="24" rx="12" fill="${theme.brass}" opacity="0.2"/>
    <text x="200" y="526" font-family="sans-serif" font-size="10" font-weight="bold" fill="${theme.brass}" text-anchor="middle" letter-spacing="1">${format.toUpperCase()}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "\'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

// Main metadata extraction & enrichment pipeline
export async function extractAndEnrichMetadata(
  file: File,
  format: SupportedFormat
): Promise<{ metadata: BookMetadata; isCustomCover: boolean }> {
  const { title: rawTitle, author: rawAuthor } = cleanTitleFromFilename(file.name);
  const authorName = rawAuthor ?? "Unknown Author";

  let enrichedMetadata: BookMetadata | null = null;

  // Search API to enrich missing metadata
  try {
    const res = await fetch(`/api/books/search?q=${encodeURIComponent(rawTitle)}&type=title&limit=1`);
    const data = (await res.json()) as SearchResponse;
    if (data.items && data.items.length > 0) {
      enrichedMetadata = data.items[0];
    }
  } catch {
    // Graceful fallback
  }

  const finalTitle = enrichedMetadata?.title ?? rawTitle;
  const finalAuthors = enrichedMetadata?.authors && enrichedMetadata.authors.length > 0 ? enrichedMetadata.authors : [authorName];
  const finalCover = enrichedMetadata?.coverUrl ?? generateSvgCover(finalTitle, finalAuthors[0], format);
  const isCustomCover = !enrichedMetadata?.coverUrl;

  const result: BookMetadata = {
    id: enrichedMetadata?.id ?? `imported-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: finalTitle,
    authors: finalAuthors,
    description: enrichedMetadata?.description ?? `Imported edition (${format.toUpperCase()}) added to your personal library.`,
    subjects: enrichedMetadata?.subjects ?? ["Imported", format.toUpperCase()],
    publishedYear: enrichedMetadata?.publishedYear ?? new Date().getFullYear(),
    publisher: enrichedMetadata?.publisher ?? "Self Imported",
    pageCount: enrichedMetadata?.pageCount ?? Math.max(50, Math.floor(file.size / 3000)),
    isbns: enrichedMetadata?.isbns ?? [],
    coverUrl: finalCover,
    sourceLinks: [],
    providerIds: enrichedMetadata?.providerIds ?? {},
    source: "merged",
  };

  return { metadata: result, isCustomCover };
}
