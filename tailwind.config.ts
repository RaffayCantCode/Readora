import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        archive: "rgb(var(--archive) / <alpha-value>)",
        night: "rgb(var(--night) / <alpha-value>)",
        parchment: "rgb(var(--parchment) / <alpha-value>)",
        stone: "rgb(var(--stone) / <alpha-value>)",
        walnut: "rgb(var(--walnut) / <alpha-value>)",
        leather: "rgb(var(--leather) / <alpha-value>)",
        brass: "rgb(var(--brass) / <alpha-value>)",
        moss: "rgb(var(--moss) / <alpha-value>)",
        oxblood: "rgb(var(--oxblood) / <alpha-value>)",
        cobalt: "rgb(var(--cobalt) / <alpha-value>)",
        signal: "rgb(var(--signal) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
