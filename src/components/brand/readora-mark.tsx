import type { SVGProps } from "react";

type ReadoraMarkProps = SVGProps<SVGSVGElement> & {
  size?: "sm" | "md" | "lg";
  title?: string;
};

const sizes = { sm: 28, md: 42, lg: 72 };

export function ReadoraMark({ size = "md", title = "Readora mark", ...props }: ReadoraMarkProps) {
  const dimension = sizes[size];
  return (
    <svg width={dimension} height={dimension} viewBox="0 0 72 72" fill="none" role="img" aria-label={title} {...props}>
      <path d="M9 17.5C20 15 29.1 17.1 36 23.4C42.9 17.1 52 15 63 17.5V57.3C52 54.7 42.9 56.9 36 63C29.1 56.9 20 54.7 9 57.3V17.5Z" fill="currentColor" opacity=".15" />
      <path d="M36 23.4C29.1 17.1 20 15 9 17.5V57.3C20 54.7 29.1 56.9 36 63M36 23.4C42.9 17.1 52 15 63 17.5V57.3C52 54.7 42.9 56.9 36 63M36 23.4V63" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40.2 31.2C48.3 26.6 56.2 29.7 55.7 36.6C55.4 40.6 51.6 42.3 47.1 42.6L55.9 50.3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M47.5 42.3C44.1 45.4 42.8 49 43.5 52.6C47.4 51.1 50.2 48.4 51.7 44.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
    </svg>
  );
}
