import { withCache } from "./cache";
import type { BookMetadata } from "./types";

export type BookSeriesItem = {
  id: string;
  title: string;
  author: string;
  volumes: string;
  chapters: string;
  coverUrl: string;
  extraCovers: string[];
  sampleBook: BookMetadata;
};

// Popular real-world series search queries to fetch dynamically
const FAMOUS_SERIES_QUERIES = [
  { id: "series-dune", title: "Dune Chronicles", query: "Dune Frank Herbert", author: "Frank Herbert", volumes: "6 Volumes", defaultIsbns: ["9780441172719", "9780441104024"] },
  { id: "series-potter", title: "Harry Potter Collection", query: "Harry Potter Rowling", author: "J.K. Rowling", volumes: "7 Volumes", defaultIsbns: ["9780439064873", "9780590353427"] },
  { id: "series-ice-fire", title: "A Song of Ice & Fire", query: "Game of Thrones George R.R. Martin", author: "George R.R. Martin", volumes: "5 Volumes", defaultIsbns: ["9780553103540", "9780553805444"] },
  { id: "series-wheel-time", title: "The Wheel of Time", query: "The Eye of the World Robert Jordan", author: "Robert Jordan", volumes: "14 Volumes", defaultIsbns: ["9780812511818", "9780812513751"] },
  { id: "series-lotr", title: "The Lord of the Rings", query: "The Fellowship of the Ring Tolkien", author: "J.R.R. Tolkien", volumes: "3 Volumes", defaultIsbns: ["9780618640157", "9780618640164"] },
  { id: "series-witcher", title: "The Witcher Saga", query: "The Last Wish Andrzej Sapkowski", author: "Andrzej Sapkowski", volumes: "8 Volumes", defaultIsbns: ["9780316029186", "9780316044912"] },
];

export async function getLiveSeriesCollections(limit = 4): Promise<BookSeriesItem[]> {
  const cacheKey = `live-series-collections-v2:${limit}`;

  return withCache(cacheKey, async () => {
    const seriesList: BookSeriesItem[] = [];
    const queries = FAMOUS_SERIES_QUERIES.slice(0, limit);

    await Promise.all(
      queries.map(async (item) => {
        try {
          const params = new URLSearchParams({
            q: item.query,
            limit: "3",
            fields: "key,title,author_name,first_publish_year,publisher,number_of_pages_median,isbn,cover_i,first_sentence",
          });
          const res = await fetch(`https://openlibrary.org/search.json?${params.toString()}`, {
            headers: { Accept: "application/json", "User-Agent": "Readora API" },
            next: { revalidate: 3600 },
          });

          if (res.ok) {
            const data = await res.json();
            const docs = data.docs ?? [];
            const doc = docs[0];

            if (doc) {
              const primaryIsbn = doc.isbn?.[0] || item.defaultIsbns[0];
              const coverUrl = doc.cover_i 
                ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` 
                : `https://covers.openlibrary.org/b/isbn/${primaryIsbn}-L.jpg`;

              const extraCovers: string[] = docs.slice(1, 3).map((d: { cover_i?: number; isbn?: string[] }, i: number) => {
                if (d.cover_i) return `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`;
                if (d.isbn?.[0]) return `https://covers.openlibrary.org/b/isbn/${d.isbn[0]}-M.jpg`;
                return `https://covers.openlibrary.org/b/isbn/${item.defaultIsbns[i + 1] || primaryIsbn}-M.jpg`;
              });

              if (extraCovers.length === 0) {
                extraCovers.push(`https://covers.openlibrary.org/b/isbn/${item.defaultIsbns[1] || primaryIsbn}-M.jpg`);
              }

              const sampleBook: BookMetadata = {
                id: doc.key ? `openlibrary:${doc.key.replace("/works/", "")}` : item.id,
                title: doc.title || item.title,
                authors: doc.author_name || [item.author],
                description: typeof doc.first_sentence === "string" ? doc.first_sentence : doc.first_sentence?.value || `An extraordinary saga in the ${item.title} collection.`,
                subjects: ["Series", "Fantasy", "Fiction"],
                publishedYear: doc.first_publish_year || 1990,
                publisher: doc.publisher?.[0] || "Publisher",
                pageCount: doc.number_of_pages_median || 420,
                isbns: doc.isbn || [primaryIsbn],
                coverUrl,
                sourceLinks: doc.key ? [`https://openlibrary.org${doc.key}`] : [],
                providerIds: {},
                source: "openlibrary",
              };

              seriesList.push({
                id: item.id,
                title: item.title,
                author: doc.author_name?.[0] || item.author,
                volumes: item.volumes,
                chapters: `${doc.number_of_pages_median || 420} pages per vol`,
                coverUrl,
                extraCovers,
                sampleBook,
              });
            }
          }
        } catch {
          // safe fallback
        }
      })
    );

    return seriesList;
  });
}

