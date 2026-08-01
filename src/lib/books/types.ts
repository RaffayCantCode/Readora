export type SearchType = "title" | "author" | "isbn" | "subject" | "series";

export type BookSearchQuery = {
  query: string;
  type: SearchType;
  page: number;
  limit: number;
  language?: string;
};

export type BookMetadata = {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  subjects: string[];
  publishedYear?: number;
  publisher?: string;
  pageCount?: number;
  isbns: string[];
  coverUrl?: string;
  sourceLinks: string[];
  providerIds: {
    openLibrary?: string;
    googleBooks?: string;
  };
  source: "openlibrary" | "googlebooks" | "merged";
};

export type ProviderBook = Omit<BookMetadata, "id" | "source" | "providerIds"> & {
  provider: "openlibrary" | "googlebooks";
  providerId: string;
};

export type SearchResponse = {
  items: BookMetadata[];
  total: number;
  page: number;
  limit: number;
  sources: string[];
  degraded: boolean;
};
