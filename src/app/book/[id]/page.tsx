import { HomeThemeProvider } from "@/components/home/home-theme-provider";
import { BookDetailPageClient } from "./book-detail-client";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const bookId = decodeURIComponent(resolvedParams.id);

  return (
    <HomeThemeProvider>
      <BookDetailPageClient bookId={bookId} />
    </HomeThemeProvider>
  );
}
