import type { LibraryBook } from "./types";

const makeBook = (book: Omit<LibraryBook, "source" | "providerIds"> & Partial<Pick<LibraryBook, "source" | "providerIds">>): LibraryBook => ({
  source: "merged",
  providerIds: {},
  ...book,
});

export const fixtureBooks: LibraryBook[] = [
  makeBook({ id: "fixture:cartographers-garden", title: "The Cartographer's Garden", authors: ["Mara Vale"], description: "A tender novel about maps, memory, and the places we carry with us.", subjects: ["Literary fiction", "Nature"], publishedYear: 2024, publisher: "North Window Press", pageCount: 352, isbns: ["9780000000001"], coverUrl: undefined, sourceLinks: [], progress: 62, favorite: true, collection: "The slow shelf", lastRead: "Yesterday" }),
  makeBook({ id: "fixture:field-guide-quiet", title: "A Field Guide to Quiet", authors: ["Jon Bell"], description: "Essays on attention, stillness, and the small weather of an ordinary day.", subjects: ["Essays"], publishedYear: 2023, publisher: "Small Hours", pageCount: 208, isbns: ["9780000000002"], sourceLinks: [], progress: 28, favorite: false, collection: "The well-lived life", lastRead: "4 days ago" }),
  makeBook({ id: "fixture:house-small-hours", title: "House of Small Hours", authors: ["Elian North"], description: "A family story told through rooms, letters, and the light between them.", subjects: ["Novel", "Family"], publishedYear: 2022, publisher: "Walnut House", pageCount: 416, isbns: ["9780000000003"], sourceLinks: [], progress: 0, favorite: true, collection: "New weather" }),
  makeBook({ id: "fixture:under-fig-tree", title: "Under the Fig Tree", authors: ["Nadia Rowan"], description: "A memoir of leaving, returning, and learning a garden by heart.", subjects: ["Memoir", "Travel"], publishedYear: 2021, publisher: "Lantern Editions", pageCount: 264, isbns: ["9780000000004"], sourceLinks: [], progress: 84, favorite: false, collection: "The well-lived life", lastRead: "Last week" }),
  makeBook({ id: "fixture:night-archive", title: "The Night Archive", authors: ["Iris Bellwether"], description: "A speculative mystery about a library that only opens after midnight.", subjects: ["Speculative", "Mystery"], publishedYear: 2020, publisher: "Dusk & Co.", pageCount: 384, isbns: ["9780000000005"], sourceLinks: [], progress: 12, favorite: false, collection: "New weather" }),
  makeBook({ id: "fixture:orchard-letters", title: "The Orchard Letters", authors: ["S. Wren"], description: "Four seasons, three generations, one house at the edge of an orchard.", subjects: ["Series", "Historical"], publishedYear: 2019, publisher: "Elm Street Press", pageCount: 336, isbns: ["9780000000006"], sourceLinks: [], progress: 100, favorite: true, collection: "The slow shelf", lastRead: "2 months ago" }),
];
