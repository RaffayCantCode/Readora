"use client";

import Link from "next/link";

export function ReadoraLogo({
  className = "",
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <Link href="/" className={`group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02] ${className}`}>
      {/* Brand Icon SVG Emblem */}
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-md transition-all duration-300 group-hover:shadow-lg" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-strong)" }}>
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left page */}
          <path d="M6 8C6 6.89543 6.89543 6 8 6H15V24H8C6.89543 24 6 23.1046 6 22V8Z" fill="var(--accent-brass)" fillOpacity="0.25" stroke="var(--accent-brass)" strokeWidth="2" strokeLinejoin="round" />
          {/* Right page */}
          <path d="M17 6H24C25.1046 6 26 6.89543 26 8V22C26 23.1046 25.1046 24 24 24H17V6Z" fill="var(--text-main)" fillOpacity="0.15" stroke="var(--text-main)" strokeWidth="2" strokeLinejoin="round" />
          {/* Book Spine Center line */}
          <line x1="16" y1="4" x2="16" y2="26" stroke="var(--accent-brass)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Bookmark Ribbon */}
          <path d="M20 6V14L22.5 12L25 14V6H20Z" fill="var(--accent-brass)" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>
            Readora
          </span>
          <span className="rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest" style={{ borderColor: "var(--border-strong)", color: "var(--accent-brass)", backgroundColor: "var(--accent-glow)" }}>
            Archive
          </span>
        </div>
        {showTagline && (
          <p className="text-[10px] font-medium tracking-wide" style={{ color: "var(--text-dim)" }}>
            Digital Library & Editorial Sanctuary
          </p>
        )}
      </div>
    </Link>
  );
}
