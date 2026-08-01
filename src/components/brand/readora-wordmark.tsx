import { ReadoraMark } from "./readora-mark";

type ReadoraWordmarkProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
};

const type = {
  sm: { mark: "sm" as const, name: "text-xl", tagline: "hidden" },
  md: { mark: "md" as const, name: "text-2xl", tagline: "text-[10px]" },
  lg: { mark: "lg" as const, name: "text-4xl", tagline: "text-xs" },
};

export function ReadoraWordmark({ size = "md", className = "", showTagline = false }: ReadoraWordmarkProps) {
  const style = type[size];
  return (
    <div className={"flex items-center gap-3 " + className}>
      <ReadoraMark size={style.mark} className="shrink-0 text-leather" />
      <div className="leading-none">
        <div className={"font-display " + style.name + " tracking-[-0.04em]"}>Readora</div>
        {showTagline && <div className={"mt-2 " + style.tagline + " eyebrow text-ink-soft"}>A home for books</div>}
      </div>
    </div>
  );
}
