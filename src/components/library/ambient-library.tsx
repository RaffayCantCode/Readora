export function AmbientLibrary({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgb(var(--brass)/0.12),transparent)]" />
      <div className="absolute left-[12%] top-[-12%] h-[82%] w-px rotate-[14deg] bg-parchment/12" />
      <div className="absolute left-[58%] top-[-16%] h-[76%] w-px rotate-[14deg] bg-brass/10" />
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className={"absolute h-px w-px bg-brass/60 " + (reduceMotion ? "" : "animate-pulse")}
          style={{ left: ((index * 37) % 100) + "%", top: ((index * 23) % 82) + "%", opacity: 0.18 + (index % 4) * 0.08, animationDelay: index * 0.16 + "s" }}
        />
      ))}
    </div>
  );
}
