"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, BookOpen, Loader2 } from "lucide-react";
import Image from "next/image";
import type { BookMetadata, SearchResponse } from "@/lib/books/types";
import { getBookSkin } from "@/components/library/book-object";

const buzzList = [
  { title: "Dear Debbie", author: "Freida McFadden" },
  { title: "Whistler", author: "Ann Patchett" },
  { title: "John of John", author: "Douglas Stuart" },
  { title: "Where the Wildflowers Grow", author: "Terah Shelton Harris" },
  { title: "Land", author: "Maggie O'Farrell" },
  { title: "The Tapestry of Fate", author: "Shannon Chakraborty" },
  { title: "Dead Beat", author: "Leigh Bardugo" },
  { title: "Vigil", author: "George Saunders" },
  { title: "Kin", author: "Tayari Jones" },
  { title: "The Things We Never Say", author: "Elizabeth Strout" },
  { title: "Yesteryear", author: "Caro Claire Burke" },
  { title: "This Is Not About Us", author: "Allegra Goodman" },
];

type GoogleVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    industryIdentifiers?: { identifier: string }[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    previewLink?: string;
  };
};

type GoogleResponse = { items?: GoogleVolume[] };

function stripHtml(value?: string) {
  return value?.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function loadBuzzFallback(year: number, signal: AbortSignal): Promise<BookMetadata[]> {
  const results = await Promise.allSettled(buzzList.map(async ({ title, author }): Promise<BookMetadata> => {
    const query = new URLSearchParams({
      q: `intitle:${title} inauthor:${author}`,
      printType: "books",
      maxResults: "1",
    });
    const response = await fetch("https://www.googleapis.com/books/v1/volumes?" + query.toString(), { signal });
    if (!response.ok) throw new Error("Google Books fallback returned " + response.status);
    const payload = await response.json() as GoogleResponse;
    const item = payload.items?.[0];
    const info = item?.volumeInfo;
    if (!item || !info?.title) throw new Error("No fallback metadata");
    return {
      id: "buzz:" + item.id,
      title: info.title,
      authors: info.authors ?? [author],
      description: stripHtml(info.description),
      subjects: info.categories ?? ["2026 books"],
      publishedYear: info.publishedDate ? Number.parseInt(info.publishedDate.slice(0, 4), 10) || year : year,
      publisher: info.publisher,
      pageCount: info.pageCount,
      isbns: (info.industryIdentifiers ?? []).map((identifier) => identifier.identifier),
      coverUrl: (info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail)?.replace("http://", "https://"),
      sourceLinks: info.previewLink ? [info.previewLink] : [],
      providerIds: { googleBooks: item.id },
      source: "googlebooks",
    } satisfies BookMetadata;
  }));

  return results.flatMap((result, index) => {
    if (result.status === "fulfilled") return [result.value];
    const fallback = buzzList[index];
    return [{
      id: "buzz-static:" + fallback.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: fallback.title,
      authors: [fallback.author],
      description: "A 2026 release from the current Readora buzz shelf.",
      subjects: ["2026 books"],
      publishedYear: year,
      publisher: undefined,
      pageCount: undefined,
      isbns: [],
      coverUrl: undefined,
      sourceLinks: [],
      providerIds: {},
      source: "merged",
    } satisfies BookMetadata];
  });
}

export function TrendingThisYear() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [books, setBooks] = useState<BookMetadata[]>([]);
  const [featured, setFeatured] = useState<BookMetadata>();
  const [loading, setLoading] = useState(true);
  const [sourceLabel, setSourceLabel] = useState("Open Library + Google Books");

  useEffect(() => {
    const controller = new AbortController();
    async function loadTrending() {
      setLoading(true);
      try {
        const response = await fetch(`/api/books/trending?year=${year}&limit=12`, { signal: controller.signal });
        const payload = await response.json() as SearchResponse;
        if (payload.items.length) {
          setBooks(payload.items);
          setFeatured(payload.items[0]);
          setSourceLabel(payload.sources.length ? payload.sources.join(" + ") : "Metadata sources");
          return;
        }
        const fallback = await loadBuzzFallback(year, controller.signal);
        setBooks(fallback);
        setFeatured(fallback[0]);
        setSourceLabel("Google Books + 2026 buzz lists");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          const fallback = await loadBuzzFallback(year, controller.signal);
          setBooks(fallback);
          setFeatured(fallback[0]);
          setSourceLabel("Google Books + 2026 buzz lists");
        }
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
    return () => controller.abort();
  }, [year]);

  const active = featured ?? books[0];
  const skin = active ? getBookSkin(active) : undefined;

  return (
    <section className="catalog-stage relative min-h-screen overflow-hidden border-b border-white/10 text-parchment">
      <div className="absolute inset-0 fine-grid opacity-45" />
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1720px] grid-rows-[auto_1fr_auto] px-4 pb-6 pt-4 sm:px-7 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/12 bg-white/[0.04]">
              <BookOpen size={17} className="text-brass" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-none">Readora</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone/60">Live discovery</p>
            </div>
          </div>
          <a href="#my-library" className="flex h-9 items-center gap-2 rounded-[8px] border border-white/12 px-3 text-xs font-semibold text-stone transition hover:border-brass/60 hover:text-parchment">
            My collection
            <ArrowDown size={14} />
          </a>
        </header>

        <div className="grid items-center gap-8 py-10 lg:grid-cols-[minmax(340px,0.75fr)_minmax(520px,1.25fr)]">
          <div>
            <p className="eyebrow text-brass">Trending / {year}</p>
            <h1 className="mt-4 max-w-3xl font-display text-6xl leading-none text-parchment sm:text-8xl">Books with a pulse.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-stone">A live shelf of books surfacing from open catalog metadata. Covers appear when the source provides them; missing jackets become Readora-designed editions.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#trending-shelf" className="flex h-11 items-center gap-2 rounded-[8px] bg-brass px-4 text-sm font-semibold text-archive transition hover:bg-parchment">
                Browse the shelf
                <ArrowDown size={15} />
              </a>
              <span className="text-xs uppercase tracking-[0.16em] text-stone/55">{loading ? "Fetching metadata" : sourceLabel}</span>
            </div>
          </div>

          <div className="relative min-h-[520px]">
            <div className="absolute inset-x-[12%] bottom-10 h-14 bg-black/45 blur-3xl" />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-brass" size={28} />
              </div>
            )}
            {active && skin && (
              <button onClick={() => setFeatured(active)} className="absolute left-1/2 top-1/2 z-10 h-[430px] w-[285px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[8px] border border-white/25 book-cloth spine-shadow sm:h-[500px] sm:w-[330px]" style={{ backgroundColor: skin.base, color: skin.ink }}>
                {active.coverUrl ? <Image src={active.coverUrl} alt="" fill priority sizes="330px" className="object-cover" unoptimized /> : <FallbackCover book={active} />}
                <span className="sr-only">{active.title}</span>
              </button>
            )}
            <div id="trending-shelf" className="absolute inset-x-0 bottom-0 flex items-end gap-3 overflow-x-auto pb-2 pt-10">
              {books.slice(1, 10).map((book) => {
                const bookSkin = getBookSkin(book);
                return (
                  <button key={book.id} onClick={() => setFeatured(book)} className="relative h-56 w-24 shrink-0 overflow-hidden rounded-[6px] border border-white/20 book-cloth text-left transition hover:-translate-y-3 hover:border-brass/70" style={{ backgroundColor: bookSkin.base, color: bookSkin.ink }}>
                    {book.coverUrl ? <Image src={book.coverUrl} alt="" fill sizes="96px" className="object-cover opacity-75" unoptimized /> : <FallbackCover book={book} compact />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3 line-clamp-2 font-display text-sm leading-none drop-shadow">{book.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-4 text-sm text-stone lg:grid-cols-[1fr_auto]">
          <p>{active ? `${active.title} / ${active.authors.join(", ")}${active.publishedYear ? ` / ${active.publishedYear}` : ""}` : "Waiting for book metadata..."}</p>
          {active?.sourceLinks[0] && <a href={active.sourceLinks[0]} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-brass hover:text-parchment">View source <ArrowUpRight size={14} /></a>}
        </div>
      </div>
    </section>
  );
}

function FallbackCover({ book, compact = false }: { book: BookMetadata; compact?: boolean }) {
  const skin = getBookSkin(book);
  return (
    <div className="absolute inset-0 book-cloth" style={{ backgroundColor: skin.base, color: skin.ink }}>
      <div className="absolute inset-y-0 left-0 w-[13%]" style={{ backgroundColor: skin.strip }} />
      <div className="absolute inset-5 flex flex-col justify-between">
        <p className={"font-display leading-none " + (compact ? "text-base" : "text-5xl")}>{book.title}</p>
        <p className="text-[10px] uppercase tracking-[0.18em] opacity-75">{book.authors[0]}</p>
      </div>
    </div>
  );
}
