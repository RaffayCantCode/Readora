import Link from "next/link";
import { Compass, Library, Search } from "lucide-react";

export const primaryNav = [
  { label: "Discover", href: "#discover", icon: Compass },
  { label: "Genres", href: "#genres" },
  { label: "Authors", href: "#authors" },
  { label: "Series", href: "#series" },
];

export function SiteNav({ mobile = false, onSelect }: { mobile?: boolean; onSelect?: () => void }) {
  return (
    <nav className={mobile ? "grid gap-5" : "hidden items-center gap-7 lg:flex"} aria-label="Primary navigation">
      {primaryNav.map((item) => (
        <Link key={item.label} href={item.href} onClick={onSelect} className="group flex items-center gap-2 text-sm text-ink-soft transition hover:text-ink">
          {mobile && item.icon ? <item.icon size={16} strokeWidth={1.5} /> : null}
          <span>{item.label}</span>
          <span className="hidden h-px w-0 bg-brass transition-all group-hover:w-4 sm:block" />
        </Link>
      ))}
      {mobile && (
        <>
          <Link href="#library" onClick={onSelect} className="flex items-center gap-2 text-sm text-ink-soft transition hover:text-ink"><Library size={16} strokeWidth={1.5} /> My Library</Link>
          <Link href="#discover" onClick={onSelect} className="flex items-center gap-2 text-sm text-ink-soft transition hover:text-ink"><Search size={16} strokeWidth={1.5} /> Search the shelves</Link>
        </>
      )}
      {!mobile && <Link href="/library" className="hidden items-center gap-2 text-sm font-semibold text-leather lg:flex"><Library size={15} strokeWidth={1.5} /> My Library</Link>}
    </nav>
  );
}
