export const colors = {
  ink: "#241f1a",
  inkSoft: "#62584d",
  parchment: "#f3ede1",
  parchmentDeep: "#e7dcc9",
  walnut: "#3d2c20",
  leather: "#755038",
  brass: "#b98b46",
  moss: "#596451",
  smoke: "#d8d0c3",
} as const;

export const motion = {
  fast: 0.18,
  base: 0.32,
  slow: 0.65,
  reveal: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
} as const;

export const spacing = {
  section: "clamp(5rem, 11vw, 10rem)",
  page: "clamp(1.25rem, 4vw, 4rem)",
} as const;
