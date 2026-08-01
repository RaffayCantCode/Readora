export function AmbientGlow({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={"pointer-events-none absolute rounded-full bg-brass/10 blur-3xl " + className} />;
}
