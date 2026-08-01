import { ArrowRight } from "lucide-react";
import { books } from "@/lib/content";
import { BookCover } from "@/components/ui/book-cover";
import { SectionHeading } from "@/components/ui/section-heading";
import { MotionSection } from "./motion-section";

export function TrendingBooks() {
  return <MotionSection id="discover" className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36">
    <SectionHeading eyebrow="On the nightstand" title="Books with a little pull." description="A small selection from the shelves our readers are opening most this week." action={<button className="hidden items-center gap-2 text-sm font-semibold text-leather md:flex">See all books <ArrowRight size={15} /></button>} />
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-7 lg:gap-10">{books.map((book) => <div key={book.title}><BookCover book={book} /><div className="mt-5"><p className="font-display text-xl">{book.title}</p><p className="mt-1 text-xs text-ink-soft">{book.author} · {book.genre}</p></div></div>)}</div>
  </MotionSection>;
}
