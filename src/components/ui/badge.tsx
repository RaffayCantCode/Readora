type BadgeProps = { children: React.ReactNode; tone?: "brass" | "moss" | "ink" | "paper"; className?: string };

const tones = {
  brass: "bg-brass/15 text-leather",
  moss: "bg-moss/15 text-moss",
  ink: "bg-ink/10 text-ink",
  paper: "bg-parchment text-ink-soft",
};

export function Badge({ children, tone = "paper", className = "" }: BadgeProps) {
  return <span className={"eyebrow inline-flex rounded-full px-3 py-2 " + tones[tone] + " " + className}>{children}</span>;
}
