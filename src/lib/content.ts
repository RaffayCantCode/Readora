export type BookCoverData = {
  title: string;
  author: string;
  genre: string;
  color: string;
  accent: string;
  mark?: string;
};

export type Collection = {
  title: string;
  description: string;
  count: string;
  tone: "walnut" | "moss" | "leather";
};

export const books: BookCoverData[] = [
  { title: "The Cartographer's Garden", author: "Mara Vale", genre: "Literary fiction", color: "#31453b", accent: "#c9a66b", mark: "IV" },
  { title: "A Field Guide to Quiet", author: "Jon Bell", genre: "Essays", color: "#b9a483", accent: "#594636", mark: "Q" },
  { title: "House of Small Hours", author: "Elian North", genre: "Novel", color: "#543c35", accent: "#d4b985", mark: "H" },
  { title: "Under the Fig Tree", author: "Nadia Rowan", genre: "Memoir", color: "#8b6048", accent: "#efe1c8", mark: "F" },
];

export const collections: Collection[] = [
  { title: "The slow shelf", description: "Books for unhurried afternoons and open windows.", count: "18 books", tone: "walnut" },
  { title: "New weather", description: "Stories that feel like a change in the air.", count: "24 books", tone: "moss" },
  { title: "The well-lived life", description: "Essays, memoirs, and the art of paying attention.", count: "31 books", tone: "leather" },
];

export const genres = ["Literary fiction", "Essays", "Memoir", "Poetry", "History", "Speculative", "Travel"];

export const authors = [
  { name: "Mara Vale", detail: "4 books in your library", initials: "MV" },
  { name: "Jon Bell", detail: "2 books in your library", initials: "JB" },
  { name: "Nadia Rowan", detail: "6 books in your library", initials: "NR" },
];

export const series = [
  { title: "The Orchard Letters", books: "4 volumes", color: "#73644e", accent: "#f0e2c6" },
  { title: "Atlas of Elsewhere", books: "3 volumes", color: "#435b5b", accent: "#d5c89e" },
  { title: "The House at Dusk", books: "5 volumes", color: "#583e3b", accent: "#bda47b" },
];
