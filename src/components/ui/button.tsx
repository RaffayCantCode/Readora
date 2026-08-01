import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "quiet" | "outline" | "icon";
  size?: "sm" | "md" | "lg";
};

const styles = {
  primary: "bg-walnut text-parchment shadow-[0_10px_25px_rgb(var(--walnut)/.16)] hover:-translate-y-0.5 hover:bg-leather",
  quiet: "text-ink-soft hover:text-ink",
  outline: "border border-walnut/20 text-ink hover:border-brass hover:bg-brass/10",
  icon: "border border-walnut/15 text-ink hover:border-brass hover:text-leather",
};

const sizes = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-14 px-7 text-sm",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={"inline-flex items-center justify-center gap-2 rounded-[8px] font-semibold transition duration-300 active:translate-y-px " + styles[variant] + " " + sizes[size] + " " + className}
      {...props}
    />
  );
}
