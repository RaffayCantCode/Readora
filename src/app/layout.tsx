import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Readora — A home for books",
  description: "A personal digital library for readers who want more from every page.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
